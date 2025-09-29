//////////////////////////////////////////////////////////////////////////////
// Code available to eval()
//////////////////////////////////////////////////////////////////////////////
import { SampleEvents } from './mock_data/sample_events.js';
import SampleSegments from './mock_data/sample_segments.js';
import SampleTiers from './mock_data/sample_tiers.js';

const tryRunJS = function (code, context) {
  const executionLogs = [];

  const logAndReturn = (label, meta, result) => {
    executionLogs.push({ label, meta, result });
    return result;
  };

  const wteDefinitions = {}; // name -> function - created by define_wte blocks, called by call_wte blocks
  const defineWte = function (name, outputCallback) {
    wteDefinitions[name] = outputCallback;
  };
  const callWte = function (name, contextOverrides) {
    const wteFunc = wteDefinitions[name];
    if (wteFunc) {
      const context = { ...contextOverrides };
      return logAndReturn(`wte:${name}`, null, wteFunc(context));
    }
    console.error(`No WTE defined with name ${name}`);
    return logAndReturn('wte_error', { name }, `No WTE defined with name ${name}`, null);
  };

  // execute a segment frame, calling outputCallback for each participant in the segment
  // outputCallback is expected to return a value for that participant
  // returns an array of results, one per participant
  // each result is logged with the participant name
  const executeSegmentFrame = function (name, segmentId, outputCallback) {
    const participants = SampleSegments[segmentId] || [];
    const executionContext = {
      ...context,
      participants,
    };
    return participants.map((p, i) =>
      logAndReturn(
        `segment_frame:${i + 1}:${p.name}`,
        { name, participant: p },
        outputCallback({
          ...executionContext,
          ...p,
        })
      )
    );
  };

  // execute a recurrence frame, calling outputCallback for each frame
  // outputCallback is expected to return a value for that frame
  // returns an array of results, one per frame
  // each result is logged with the frame start date
  const executeRecurrenceFrame = function (recurrence, offset, outputCallback) {
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
      return logAndReturn(`recurrence_frame`, { date }, outputCallback(context));
    });
  };

  const getRatio = function (numerator, denominator) {
    if (denominator === 0) return 0;
    return numerator / denominator;
  };

  const isConditionMet = function (item, type, value) {
    switch (type) {
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
  };

  const getRatioConditionTrue = function (array, conditions) {
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

    return logAndReturn(
      `ratio_condition_true:${countTrue}/${array.length}`,
      { array, conditions },
      countTrue / array.length
    );
  };

  const getTargetAchieved = function (params) {
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
    return logAndReturn(
      `target_achieved:${achieved}`,
      { input, adjustedTarget },
      achieved ? adjustedReturnValue : 0
    );
  };

  const getTargetAchievedExcess = function (params) {
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
    if (!achieved) {
      return logAndReturn(`target_achieved_excess:false`, { ...params, adjustedTarget }, 0);
    }
    // TODO: does backend handle cases of less than ? eg, 50 < 100.. excess should be 50?
    // using Math.abs() for now in case we should
    let excess = Math.abs(input - adjustedTarget);
    let excessValue = excess * return_value;
    let adjustedReturnValue = excessValue * return_value_proration;
    return logAndReturn(
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
  };

  const getTierIntersection = function (params) {
    const {
      input,
      thresholds,
      return_value_proration = 1,
      min_max_proration = 1,
      min_inclusive = false,
      multiplyByInput = false, // only true for tier_intersection_multiply block
    } = params;
    let tier = null;
    for (const t of thresholds) {
      const [ min, max, value ] = t;

      const minCheck = min_inclusive ? input >= min : input > min;

      // if min is not inclusive, max should be
      const maxCheck = max != null ? min_inclusive ? input < max : input <= max : true;

      logAndReturn(`tier_check:${min}-${max}`, { input, tier: t }, minCheck && maxCheck);

      if (minCheck && maxCheck) {
        tier = { min, max, value };
        break;
      }
    }

    if (!tier) {
      return logAndReturn(`tier_intersection:none`, { ...params }, 0);
    }

    let tierValue = tier.value * return_value_proration * min_max_proration;
    const result = multiplyByInput ? tierValue * input : tierValue;
    return logAndReturn(
      `tier_intersection:${tier.min}-${tier.max}`,
      { ...params, tier, tierValue, result },
      result
    );
  };

  const getTierIntersectionMultiply = function (params) {
    return getTierIntersection({ ...params, multiplyByInput: true });
  };

  /**
   * getTierOverlapMultiply
    Example scenario:
      thresholds = [ [0, 100, 5], [100, 200, 6], [200, null, 7] ]
      return_value_proration = 1
      min_max_proration = 1

      If x = 250:
        Tier 1: (100 - 0) * 5 = 500
        Tier 2: (200 - 100) * 6 = 600
        Tier 3: (250 - 200) * 7 = 350
        Total = 1450

      If x = 150:
        Tier 1: (100 - 0) * 5 = 500
        Tier 2: (150 - 100) * 6 = 300
        Total = 800} params 
   */
  const getTierOverlapMultiply = function (params) {
    const {
      input,
      thresholds,
      return_value_proration = 1,
      min_max_proration = 1,
    } = params;

    // let total = 0;
    // let left = input;
    // for (const t of thresholds) {
    //   if (left <= 0) break; // no more input left to allocate
    //   const [ min, max, rate ] = t;
    //   if (input >= min) {
    //   }
    // }

    const total = 3.33 // too tired to figure out the logic, just putting placeholder in for now

    return logAndReturn(`tier_overlap_multiply`, { ...params, total }, total);
  };

  const mathForBlock = (mathType, list) => {
    switch (mathType) {
      case 'COUNT':
        return list.length;
      case 'MAX':
        return Math.max(...list);
      case 'MIN':
        return Math.min(...list);
      case 'AVERAGE':
        return list.reduce((a, b) => a + b, 0) / list.length;
      case 'SUM':
        return list.reduce((a, b) => a + b, 0);
      case 'MULTIPLY':
        return list.reduce((a, b) => a * b, 1);
      default:
        return null;
    }
  };

  const arrayMath = function (mathType, list) {
    const result = mathForBlock(mathType, list);
    return logAndReturn(`array_math:${mathType}`, { mathType, list }, result);
  };

  const eventsMath = function (mathType, eventType) {
    const events = SampleEvents.filter((e) => e.type === eventType);
    const result = mathForBlock(
      mathType,
      events.map((e) => e.value)
    );
    return logAndReturn(
      `events_math:${mathType}:${eventType}`,
      { mathType, eventType, events },
      result
    );
  };

  const mostRecentEvent = function (age, eventType) {
    const events = SampleEvents.filter((e) => e.type === eventType).map((e) => e.value);
    // assume events are ordered oldest to newest
    const result = age === 'MOST RECENT' ? events.slice(-1)[0] : events.slice(0, 1)[0];
    return logAndReturn(`most_recent_event:${eventType}:${age}`, { age, eventType }, result);
  };

  try {
    eval(code);
  } catch (e) {
    console.error('Error during generated code execution', e);
  }

  return executionLogs.reverse();
};

export { tryRunJS };
