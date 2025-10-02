import { SampleEvents } from './mock_data/sample_events.js';
import SampleSegments from './mock_data/sample_segments.js';

const wtes = {
  // reset logs and context and attempt to execute generated js from blockly
  tryRun: (code, cx) => {
    wtes.logs = [];
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

  // execution context
  context: {},

  // logging helpers
  logs: [],
  logAndReturn: (label, meta, result) => {
    wtes.logs.push({ label, meta, result });
    return result;
  },

  // sample data available during execution
  SampleSegments,
  SampleEvents,

  // helpers several wtes use
  isConditionMet: function (item, type, value) {
    switch (type.toLowerCase()) {
      case 'equals':
        return item === value;
      case 'not_equals':
        return item !== value;
      case 'greater_than':
        return item > value;
      case 'less_than':
        return item < value;
      case 'greater_than_or_equals':
        return item >= value;
      case 'lesser_than_or_equals':
        return item <= value;
      default:
        console.error(`Unknown condition type: ${type}`);
        return false;
    }
  },

  arrayMath: (mathType, list) => {
    switch (mathType) {
      case 'COUNT':
        return list.length;
      case 'MAX':
        return list.length > 0 ? Math.max(...list) : null;
      case 'MIN':
        return list.length > 0 ? Math.min(...list) : null;
      case 'AVERAGE':
        return list.length > 0 ? list.reduce((a, b) => a + b, 0) / list.length : null;
      case 'SUM':
        return list.length > 0 ? list.reduce((a, b) => a + b, 0) : null;
      case 'MULTIPLY':
        return list.length > 0 ? list.reduce((a, b) => a * b, 1) : null;
      default:
        return null;
    }
  },

  ///////////////////////////////////////////////////////
  // wte functions available inside generated code
  // generators/javascript.js block methods call these methods after pulling arguments out of inputs/fields/child blocks/etc
  ///////////////////////////////////////////////////////

  context_variable: (context, variableName) => {
    const value = context[variableName];
    return wtes.logAndReturn(`context_variable:${variableName}`, { variableName }, value);
  },

  wteDefinitions: {},

  define_wte: (name, outputCallback) => {
    wtes.wteDefinitions[name] = outputCallback;
    wtes.logAndReturn(`define_wte:${name}`, { name, func: outputCallback.toString() }, 'defined');
  },

  call_wte: (name, contextOverrides) => {
    const wteFunc = wtes.wteDefinitions[name];
    if (wteFunc) {
      const context = { ...contextOverrides };
      return wtes.logAndReturn(`call_wte:${name}`, null, wteFunc(context));
    }
    console.error(`No WTE defined with name ${name}`);
    return wtes.logAndReturn(`wte_error:${name}`, { name }, 'wte not defined');
  },

  add: (...params) => {
    const result = params.reduce((a, b) => a + b, 0);
    return wtes.logAndReturn(`add`, { params }, result);
  },

  subtract: (...params) => {
    const result = params.reduce((a, b) => a - b);
    return wtes.logAndReturn(`subtract`, { params }, result);
  },

  make_array: (...items) => {
    return wtes.logAndReturn(`make_array`, { items }, items);
  },

  conditional_number: (condition, trueValue, falseValue) => {
    const result = condition ? trueValue : falseValue;
    return wtes.logAndReturn(
      `conditional_number:${condition}`,
      { condition, trueValue, falseValue },
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

  ratio: (numerator, denominator) => {
    if (denominator === 0) return 0;
    return numerator / denominator;
  },

  ratio_condition_true: (array, conditions) => {
    if (!Array.isArray(array) || array.length === 0) return 0;

    const countTrue = array.reduce((acc, item) => {
      let conditionMet = false;
      for (const condition of conditions) {
        const { type, value } = condition;
        if (type) {
          conditionMet = wtes.isConditionMet(item, type, value);
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
    let achieved = wtes.isConditionMet(input, target_compare, adjustedTarget);
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
    let achieved = wtes.isConditionMet(input, target_compare, adjustedTarget);
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
    return wtes.logAndReturn(
      `tier_intersection:${tier.min}-${tier.max}`,
      { ...params, tier, tierValue },
      tierValue
    );
  },

  tier_intersection_multiply: (params) => {
    const tierValue = wtes.tier_intersection(params);
    const result = tierValue * params.input;
    return wtes.logAndReturn(
      `tier_intersection_multiply`,
      { ...params, tierValue, result },
      result
    );
  },

  tier_overlap_multiply: (params) => {
    const { input, tiers, return_value_proration = 1, min_max_proration = 1 } = params;
    let total = 0;
    let remaining = input;

    for (const { min, max, value } of tiers) {
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

  array_math: (mathType, list) => {
    const result = wtes.arrayMath(mathType, list);
    return wtes.logAndReturn(`array_math:${mathType}`, { mathType, list }, result);
  },

  events_math: (mathType, eventType) => {
    const events = SampleEvents.filter((e) => e.type === eventType);
    const result = wtes.arrayMath(
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
    const result = age.toLowerCase() === 'most recent' ? events.slice(-1)[0] : events.slice(0, 1)[0];
    return wtes.logAndReturn(`most_recent_event:${eventType}:${age}`, { age, eventType }, result);
  },

  multiply: (a, b) => {
    const result = a * b;
    return wtes.logAndReturn(`multiply`, { a, b }, result);
  },
};

/*
dummy calls to make sure tree-shaking doesn't happen
*/
wtes.context_variable({}, 'testVar');
wtes.define_wte('test', (context) => 42);
wtes.call_wte('test', {});
delete wtes.wteDefinitions['test'];

export default wtes;
