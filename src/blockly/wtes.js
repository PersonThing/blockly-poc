import { SampleEvents } from './mock_data/sample_events.js';
import SampleSegments from './mock_data/sample_segments.js';

// helpers several wtes use
function isConditionMet(left, operator, right) {
  switch (operator.toLowerCase()) {
    case 'equals':
      return left === right;
    case 'not_equals':
      return left !== right;
    case 'greater_than':
      return left > right;
    case 'less_than':
      return left < right;
    case 'greater_than_or_equals':
      return left >= right;
    case 'less_than_or_equals':
      return left <= right;
    default:
      console.error(`Unknown condition type: ${operator}`);
      return false;
  }
}

const wtes = {
  // reset logs and context and attempt to execute generated js from blockly
  tryRun: (code, cx) => {
    wtes.reset();
    wtes.context = cx;

    try {
      eval(`
const context = wtes.context;

${code}`);
    } catch (e) {
      console.error('Error during generated code execution', e);
    }
    return wtes.logs.reverse();
  },

  reset: () => {
    wtes.logs = [];
    wtes.context = {};
    wtes.wteCache = {};
  },

  // execution context
  context: {},

  // wteCache - custom defined wtes cache the result for a given context to avoid re-computation
  wteCache: {},

  // logging helpers
  logs: [],
  logIndentLevel: 0,
  logAndReturn: (label, meta, result) => {
    wtes.logs.push({ 
      label: `${'  '.repeat(wtes.logIndentLevel)}${label}`, 
        meta, 
        result });
    return result;
  },

  // sample data available during execution
  SampleSegments,
  SampleEvents,

  ///////////////////////////////////////////////////////
  // wte functions available inside generated code
  // generators/javascript.js block methods call these methods after pulling arguments out of inputs/fields/child blocks/etc
  ///////////////////////////////////////////////////////

  number: (value) => {
    return wtes.logAndReturn(`number`, { value }, value);
  },

  context_variable: (context, variableName) => {
    const value = context[variableName];
    return wtes.logAndReturn(`context_variable:${variableName}`, { variableName }, value);
  },

  wteDefinitions: {},

  define: (name, outputCallback) => {
    wtes.wteDefinitions[name] = outputCallback;
    wtes.logAndReturn(`define:${name}`, { name, func: outputCallback.toString() }, 'defined');
  },

  call: (name, contextOverrides) => {
    const wteFunc = wtes.wteDefinitions[name];
    if (wteFunc) {
      const context = { ...contextOverrides };
      
      // result is cached for reuse when same context is used
      const cacheKey = JSON.stringify({ name, context });
      if (!wtes.wteCache.hasOwnProperty(cacheKey)) {
        wtes.logIndentLevel++;
        wtes.wteCache[cacheKey] = wteFunc(context);
        wtes.logIndentLevel--;
      }
      const result = wtes.wteCache[cacheKey];
      return wtes.logAndReturn(`call:${name}`, null, result);
    }
    console.error(`No WTE defined with name ${name}`);
    return wtes.logAndReturn(`call:${name}`, { name }, 'error: wte not defined');
  },

  conditional_number: (left, operator, right, trueValue, falseValue) => {
    const condition = isConditionMet(left, operator, right)
    const result = condition ? trueValue : falseValue;
    return wtes.logAndReturn(
      `conditional_number:${condition}`,
      { left, operator, right, condition, trueValue, falseValue },
      result
    );
  },

  // execute a segment frame, calling outputCallback for each participant in the segment
  // outputCallback is expected to return a value for that participant
  // returns an array of results, one per participant
  // each result is logged with the participant name
  segment_frame: (context, name, segment, outputCallback) => {
    const executionContext = {
      ...context,
      segment,
    };
    return segment.map((p, i) =>
      wtes.logAndReturn(
        `segment_frame:${i + 1}:${p.name}`,
        { name, participant: p },
        outputCallback({
          ...executionContext,
          ...p,
        })
      )
    );
  },

  // execute a recurrence frame, calling outputCallback for each frame
  // outputCallback is expected to return a value for that frame
  // returns an array of results, one per frame
  // each result is logged with the frame start date
  recurrence_frame: (context, recurrence, offset, outputCallback) => {
    const frames = [];
    const startDate = new Date(recurrence.window_start);
    const endDate = new Date(recurrence.window_end);
    const anchorDate = new Date(recurrence.anchor);
    let currentDate = new Date(anchorDate);

    // TODO: respect offset

    while (currentDate < endDate) {
      // if currentDate is within startDate and endDate, add a frame
      if (currentDate >= startDate && currentDate <= endDate) {
        frames.push({
          start: new Date(currentDate),
          end: new Date(currentDate), // for now, same as start
        });
      }

      // increment currentDate by recurrence.frequency and recurrence.interval
      switch (recurrence.frequency) {
        case 'DAY':
          currentDate.setDate(currentDate.getDate() + (recurrence.interval || 1));
          break;
        case 'WEEK':
          currentDate.setDate(currentDate.getDate() + 7 * (recurrence.interval || 1));
          break;
        case 'HALF_MONTH':
          currentDate.setDate(currentDate.getDate() + 15 * (recurrence.interval || 1));
          break;
        case 'MONTH':
          currentDate.setMonth(currentDate.getMonth() + (recurrence.interval || 1));
          break;
      }
    }

    return frames.map((frame, i) => {
      const date = new Date(frame.start).toISOString().split('T')[0];
      return wtes.logAndReturn(`recurrence_frame`, { date }, outputCallback(context));
    });
  },

  ratio_condition_true: (array, conditions) => {
    if (!Array.isArray(array) || array.length === 0) return 0;

    const countTrue = array.reduce((acc, item) => {
      let conditionMet = false;
      for (const condition of conditions) {
        const { type, value } = condition;
        if (type) {
          conditionMet = isConditionMet(item, type, value);
        }
      }
      return acc + (conditionMet ? 1 : 0);
    }, 0);

    return wtes.logAndReturn(
      `ratio_condition_true:${countTrue}/${array.length}`,
      { array, conditions },
      countTrue / array.length
    );
  },

  target_achieved: (params) => {
    const {
      input,
      target,
      target_compare,
      return_value,
      target_proration = 1,
      return_value_proration = 1,
    } = params;
    let adjustedTarget = target * target_proration;
    let achieved = isConditionMet(input, target_compare, adjustedTarget);
    let adjustedReturnValue = return_value * return_value_proration;
    return wtes.logAndReturn(
      `target_achieved:${achieved}`,
      { input, adjustedTarget },
      achieved ? adjustedReturnValue : 0
    );
  },

  target_achieved_excess: (params) => {
    const {
      input,
      target,
      target_compare,
      return_value,
      target_proration = 1,
      return_value_proration = 1,
    } = params;
    let adjustedTarget = target * target_proration;
    let achieved = isConditionMet(input, target_compare, adjustedTarget);
    console.log('condition met', achieved);
    if (!achieved) {
      return wtes.logAndReturn(`target_achieved_excess:false`, { ...params, adjustedTarget }, 0);
    }
    // TODO: does backend handle cases of less than ? eg, 50 < 100.. excess should be 50?
    // using Math.abs() for now in case we should
    let excess = Math.abs(input - adjustedTarget);
    let excessValue = excess * return_value;
    let adjustedReturnValue = excessValue * return_value_proration;
    return wtes.logAndReturn(
      `target_achieved_excess:true`,
      {
        ...params,
        adjustedTarget,
        excess,
        excessValue,
        adjustedReturnValue,
      },
      adjustedReturnValue
    );
  },

  tier_intersection: (params) => {
    const {
      input,
      tiers,
      return_value_proration = 1,
      min_max_proration = 1,
      min_inclusive = false,
      multiply_by_input = false,
    } = params;
    let tier = null;
    for (const t of tiers) {
      const { min, max, value } = t;

      const minCheck = min_inclusive ? input >= min : input > min;

      // if min is not inclusive, max should be
      const maxCheck = max != null && max > 0 ? (min_inclusive ? input < max : input <= max) : true;

      wtes.logAndReturn(
        `tier_intersection:check:${min}-${max}`,
        { input, tier: t },
        minCheck && maxCheck
      );

      if (minCheck && maxCheck) {
        tier = { min, max, value };
        break;
      }
    }

    if (!tier) {
      return wtes.logAndReturn(`tier_intersection:none`, { ...params }, 0);
    }

    let tierValue = tier.value * return_value_proration * min_max_proration;
    if (multiply_by_input) {
      tierValue = tierValue * input;
    }
    return wtes.logAndReturn(
      `tier_intersection:${tier.min}-${tier.max}`,
      { ...params, tier, tierValue },
      tierValue
    );
  },

  tier_overlap_multiply: (params) => {
    const { input, tiers, return_value_proration = 1, min_max_proration = 1 } = params;
    let total = 0;
    let remaining = input;

    for (let { min, max, value } of tiers) {
      if (max == 0) max = null;
      if (remaining <= 0) break;
      const tierMin = min ?? 0;
      const tierMax = max ?? input;
      // Only count overlap if input exceeds the tier min
      if (input > tierMin) {
        // The upper bound for this tier is either the tier's max or the input, whichever is lower
        const upper = Math.min(tierMax, input);
        // The lower bound is the tier's min
        const lower = tierMin;
        // The amount in this tier is the difference between upper and lower, but not less than 0
        const amount = Math.max(upper - lower, 0);
        wtes.logAndReturn(
          `tier_overlap_multiply:apply:${min}-${max}`,
          { input, tier: { min, max, value }, amount },
          amount * value
        );
        total += amount * value;
      }
    }

    total = total * return_value_proration * min_max_proration;
    return wtes.logAndReturn(`tier_overlap_multiply`, { ...params, total }, total);
  },

  tier: (params) => {
    const { min, max, value } = params;
    const tier = { min, max, value };
    return wtes.logAndReturn(`tier:${min}-${max}`, params, tier);
  },

  _do_math: (mathType, values) => {
    let operation = mathType?.toLowerCase();
    let result = null;
    if (typeof wtes[operation] === 'function') {
      result = wtes[operation](...values);
    } else {
      console.error(`Unknown math type: ${operation}`);
    }
    return result;
  },

  multiply: (...values) => {
    const result = values.length > 0 ? values.reduce((a, b) => a * b, 1) : null;
    return wtes.logAndReturn(`multiply`, { values: JSON.stringify(values) }, result);
  },

  sum: (...values) => {
    const result = values.length > 0 ? values.reduce((a, b) => a + b, 0) : null;
    return wtes.logAndReturn(`sum`, { values: JSON.stringify(values) }, result);
  },

  subtract: (...values) => {
    const result = values.length > 0 ? values.reduce((a, b) => a - b) : null;
    return wtes.logAndReturn(`subtract`, { values: JSON.stringify(values) }, result);
  },

  divide: (...values) => {
    const result = values.length > 0 ? values.reduce((a, b) => a / b) : null;
    return wtes.logAndReturn(`divide`, { values: JSON.stringify(values) }, result);
  },

  min: (...values) => {
    const result = values.length > 0 ? Math.min(...values) : null;
    return wtes.logAndReturn(`min`, { values: JSON.stringify(values) }, result);
  },

  max: (...values) => {
    const result = values.length > 0 ? Math.max(...values) : null;
    return wtes.logAndReturn(`max`, { values: JSON.stringify(values) }, result);
  },

  average: (...values) => {
    const result = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    return wtes.logAndReturn(`average`, { values: JSON.stringify(values) }, result);
  },

  count: (...values) => {
    const result = values.length;
    return wtes.logAndReturn(`count`, { values: JSON.stringify(values) }, result);
  },

  math: (mathType, values) => {
    const result = wtes._do_math(mathType, values);
    return wtes.logAndReturn(`math:${mathType}`, { mathType, values: JSON.stringify(values) }, result);
  },

  events_math: (mathType, eventType) => {
    const events = SampleEvents.filter((e) => e.type === eventType);
    const result = wtes._do_math(
      mathType,
      events.map((e) => e.value)
    );
    return wtes.logAndReturn(
      `events_math:${mathType}:${eventType}`,
      { mathType, eventType, events },
      result
    );
  },

  most_recent_events: (age, eventType) => {
    const events = SampleEvents.filter((e) => e.type === eventType).map((e) => e.value);
    // assume events are ordered oldest to newest
    const result =
      age.toLowerCase() === 'most recent' ? events.slice(-1)[0] : events.slice(0, 1)[0];
    return wtes.logAndReturn(`most_recent_event:${eventType}:${age}`, { age, eventType }, result);
  },
};

/*
dummy calls to make sure tree-shaking doesn't happen
*/
wtes.context_variable({}, 'testVar');
wtes.define('test', (context) => 42);
wtes.call('test', {});
delete wtes.wteDefinitions['test'];

export default wtes;
