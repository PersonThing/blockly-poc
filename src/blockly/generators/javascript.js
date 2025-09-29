import { javascriptGenerator, Order } from 'blockly/javascript';
import sample_tiers from '../mock_data/sample_tiers';

javascriptGenerator.forBlock['context_variable'] = function (block, generator) {
  const variableName = block.getFieldValue('VARIABLE_NAME') || '';
  return [`context['${variableName}']`, Order.NONE];
};

javascriptGenerator.forBlock['add'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || 'null';
    values.push(value);
  }
  return [`${values.flatMap((v) => v).join(' + ')}`, Order.ADDITION];
};

javascriptGenerator.forBlock['subtract'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || 'null';
    values.push(value);
  }
  return [`${values.flatMap((v) => v).join(' - ')}`, Order.SUBTRACTION];
};

javascriptGenerator.forBlock['make_array'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || 'null';
    values.push(value);
  }
  return [`[${values.join(',')}]`, Order.NONE];
};

javascriptGenerator.forBlock['array_math'] = function (block, generator) {
  const mathType = block.getFieldValue('MATH_TYPE');
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`arrayMath('${mathType}', ${list})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['events_math'] = function (block, generator) {
  const mathType = block.getFieldValue('MATH_TYPE');
  const eventType = block.getFieldValue('EVENT_TYPE');
  return [`eventsMath('${mathType}', '${eventType}')`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['most_recent_events'] = function (block, generator) {
  const age = block.getFieldValue('AGE');
  const eventType = block.getFieldValue('EVENT_TYPE');
  return [`mostRecentEvent('${age}', '${eventType}')`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['conditional_number'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const trueValue = generator.valueToCode(block, 'TRUE_VALUE', Order.NONE) || '0';
  const falseValue = generator.valueToCode(block, 'FALSE_VALUE', Order.NONE) || '0';
  return [`${condition} ? ${trueValue} : ${falseValue}`, Order.CONDITIONAL];
};

javascriptGenerator.forBlock['recurrence'] = function (block, generator) {
  const recurrence = {
    frequency: block.getFieldValue('FREQUENCY'),
    interval: block.getFieldValue('INTERVAL'),
    anchor: block.getFieldValue('ANCHOR'),
    window_start: block.getFieldValue('WINDOW_START'),
    window_end: block.getFieldValue('WINDOW_END'),
  };
  return [JSON.stringify(recurrence), Order.NONE];
};

javascriptGenerator.forBlock['offset'] = function (block, generator) {
  const offsetGrain = block.getFieldValue('OFFSET_GRAIN');
  const offsetAmount = block.getFieldValue('OFFSET_AMOUNT');
  const durationGrain = block.getFieldValue('DURATION_GRAIN');
  const durationAmount = block.getFieldValue('DURATION_AMOUNT');
  const offsetValue = {
    offset_grain: offsetGrain,
    offset_amount: offsetAmount,
    duration: {
      duration_grain: durationGrain,
      duration_amount: durationAmount,
    },
  };

  return [JSON.stringify(offsetValue), Order.NONE];
};

javascriptGenerator.forBlock['recurrence_frame'] = function (block, generator) {
  const recurrence = generator.valueToCode(block, 'RECURRENCE', Order.NONE) || 'null';
  const offset = generator.valueToCode(block, 'OFFSET', Order.NONE) || 'null';
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';

  return [`executeRecurrenceFrame(${recurrence}, ${offset}, (context) => ${output})`, Order.NONE];
};

javascriptGenerator.forBlock['segment_frame'] = function (block, generator) {
  let name = block.getFieldValue('NAME');
  name = name ? `'${name}'` : 'null';
  let segmentId = block.getFieldValue('SEGMENT_ID');
  segmentId = segmentId ? segmentId : 'null';
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';
  return [`executeSegmentFrame(${name}, ${segmentId}, (context) => ${output})`, Order.NONE];
};

javascriptGenerator.forBlock['define_wte'] = function (block, generator) {
  const name = block.getFieldValue('NAME');
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';
  return `defineWte('${name}', context => ${output});`;
};

javascriptGenerator.forBlock['call_wte'] = function (block, generator) {
  const name = block.getFieldValue('NAME');
  return [`callWte('${name}', context)`, Order.NONE];
};

javascriptGenerator.forBlock['ratio'] = function (block, generator) {
  const numerator = generator.valueToCode(block, 'NUMERATOR', Order.NONE) || '0';
  const denominator = generator.valueToCode(block, 'DENOMINATOR', Order.NONE) || '1';
  return [`getRatio(${numerator}, ${denominator})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['ratio_condition_true'] = function (block, generator) {
  const z = generator.valueToCode(block, 'Z', Order.NONE) || '[]';

  // TODO: handle multiple conditions
  const conditions = [
    {
      type: block.getFieldValue('CONDITION_TYPE'),
      value: block.getFieldValue('CONDITION_VALUE'),
    },
  ];

  return [`getRatioConditionTrue(${z}, ${JSON.stringify(conditions)})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['target_achieved'] = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || 'null';
  const target = generator.valueToCode(block, 'TARGET', Order.NONE) || 'null';
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = generator.valueToCode(block, 'RETURN_VALUE', Order.NONE) || 'null';
  const targetProration = generator.valueToCode(block, 'TARGET_PRORATION', Order.NONE) || 'null';
  const returnValueProration =
    generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || 'null';

  return [
    `getTargetAchieved({
  input: ${input},
  target: ${target},
  target_compare: '${targetCompare}',
  return_value: ${returnValue},
  target_proration: ${targetProration},
  return_value_proration: ${returnValueProration}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock['target_achieved_excess'] = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || 'null';
  const target = generator.valueToCode(block, 'TARGET', Order.NONE) || 'null';
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = generator.valueToCode(block, 'RETURN_VALUE', Order.NONE) || 'null';
  const targetProration = generator.valueToCode(block, 'TARGET_PRORATION', Order.NONE) || 'null';
  const returnValueProration =
    generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || 'null';

  return [
    `getTargetAchievedExcess({
  input: ${input},
  target: ${target},
  target_compare: '${targetCompare}',
  return_value: ${returnValue},
  target_proration: ${targetProration},
  return_value_proration: ${returnValueProration}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock['tier_intersection'] = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '0';
  const thresholds = JSON.stringify(sample_tiers.map((t) => [t.min, t.max, t.value]));
  const returnValueProration = block.getFieldValue('RETURN_VALUE_PRORATION');
  const minMaxProration = block.getFieldValue('MIN_MAX_PRORATION');
  const minInclusive = block.getFieldValue('MIN_INCLUSIVE') === 'TRUE';
  return [
    `getTierIntersection({
  input: ${input},
  thresholds: ${thresholds},
  return_value_proration: ${returnValueProration},
  min_max_proration: ${minMaxProration},
  min_inclusive: ${minInclusive}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock['tier_intersection_multiply'] = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '0';
  const thresholdsId = block.getFieldValue('THRESHOLD_ID');
  const thresholds = thresholdsId >= 0 && thresholdsId < sample_tiers.length ? sample_tiers[thresholdsId] : [];
  const returnValueProration = block.getFieldValue('RETURN_VALUE_PRORATION');
  const minMaxProration = block.getFieldValue('MIN_MAX_PRORATION');
  const minInclusive = block.getFieldValue('MIN_INCLUSIVE') === 'TRUE';
  return [
    `getTierIntersectionMultiply({
  input: ${input},
  thresholds: ${JSON.stringify(thresholds)},
  return_value_proration: ${returnValueProration},
  min_max_proration: ${minMaxProration},
  min_inclusive: ${minInclusive}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock['tier_overlap_multiply'] = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '0';
  const thresholdsId = block.getFieldValue('THRESHOLD_ID');
  const thresholds = thresholdsId >= 0 && thresholdsId < sample_tiers.length ? sample_tiers[thresholdsId] : [];
  const returnValueProration = block.getFieldValue('RETURN_VALUE_PRORATION');
  const minMaxProration = block.getFieldValue('MIN_MAX_PRORATION');
  return [
    `getTierOverlapMultiply({
  input: ${input},
  thresholds: ${JSON.stringify(thresholds)},
  return_value_proration: ${returnValueProration},
  min_max_proration: ${minMaxProration}
})`,
    Order.FUNCTION_CALL,
  ];
};

export default javascriptGenerator;
