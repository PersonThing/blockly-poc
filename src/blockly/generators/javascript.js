import { javascriptGenerator, Order } from 'blockly/javascript';
import sample_segments from '../mock_data/sample_segments';
import math_operations from '../math_operations.js';

// for simplicity, this generator should only handle values out of field values / inputs / child blocks / etc
// and then calling a helper function in wtes.<block_name> passing said values

javascriptGenerator.forBlock.number = function (block, generator) {
  const value = Number(block.getFieldValue('VALUE'));
  return [`wtes.number(${value})`, Order.ATOMIC];
};

javascriptGenerator.forBlock.context_variable = function (block, generator) {
  const variableName = block.getFieldValue('VARIABLE_NAME') || '';
  return [`wtes.context_variable(context, '${variableName}')`, Order.NONE];
};

javascriptGenerator.forBlock.define = function (block, generator) {
  const name = block.getFieldValue('NAME');
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';
  return `wtes.define('${name}', context => ${output});`;
};

javascriptGenerator.forBlock.call = function (block, generator) {
  const name = block.getFieldValue('NAME');
  return [`wtes.call('${name}', context)`, Order.NONE];
};

const makeMathGenerator = (operation) => {
  return function (block, generator) {
    const values = [];
    for (let i = 0; i < block.length; i++) {
      const inputName = `value_${i}`;
      const value = generator.valueToCode(block, inputName, 0) || 'null';
      values.push(value);
    }
    return [`wtes.${operation}(${values.flatMap((v) => v).join(', ')})`, Order.FUNCTION_CALL];
  };
};

math_operations.forEach((op) => javascriptGenerator.forBlock[op] = makeMathGenerator(op));

javascriptGenerator.forBlock.math = function (block, generator) {
  const operation = block.getFieldValue('OPERATION');
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || 'null';
    values.push(value);
  }
  return [`wtes.math('${operation}', [${values.flatMap((v) => v).join(', ')}])`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock.array_math = function (block, generator) {
  const operation = block.getFieldValue('OPERATION');
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`wtes.math('${operation}', ${list})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock.events_value = function (block, generator) {
  const operation = block.getFieldValue('OPERATION');
  const eventType = block.getFieldValue('EVENT_TYPE');
  return [`wtes.events_value('${operation}', '${eventType}')`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock.conditional_number = function (block, generator) {
  const left = generator.valueToCode(block, 'LEFT', Order.NONE) || '0';
  const operator = block.getFieldValue('OPERATOR');
  const right = generator.valueToCode(block, 'RIGHT', Order.NONE) || '0';

  const trueValue = generator.valueToCode(block, 'TRUE_VALUE', Order.NONE) || '0';
  const falseValue = generator.valueToCode(block, 'FALSE_VALUE', Order.NONE) || '0';
  return [`wtes.conditional_number(${left}, '${operator}', ${right}, ${trueValue}, ${falseValue})`, Order.CONDITIONAL];
};

javascriptGenerator.forBlock.recurrence = function (block, generator) {
  const recurrence = {
    frequency: block.getFieldValue('FREQUENCY'),
    interval: block.getFieldValue('INTERVAL'),
    anchor: block.getFieldValue('ANCHOR'),
    window_start: block.getFieldValue('WINDOW_START'),
    window_end: block.getFieldValue('WINDOW_END'),
  };
  return [JSON.stringify(recurrence), Order.NONE];
};

javascriptGenerator.forBlock.offset = function (block, generator) {
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

javascriptGenerator.forBlock.recurrence_frame = function (block, generator) {
  const recurrence = generator.valueToCode(block, 'RECURRENCE', Order.NONE) || 'null';
  const offset = generator.valueToCode(block, 'OFFSET', Order.NONE) || 'null';
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';

  return [
    `wtes.recurrence_frame(context, ${recurrence}, ${offset}, (context) => ${output})`,
    Order.NONE,
  ];
};

javascriptGenerator.forBlock.segment_frame = function (block, generator) {
  let name = block.getFieldValue('NAME');
  name = name ? `'${name}'` : 'null';
  let segmentId = block.getFieldValue('SEGMENT_ID');
  segmentId = segmentId ? segmentId : 'null';
  const segment = sample_segments[segmentId] || [];
  const output = generator.valueToCode(block, 'OUTPUT', Order.NONE) || 'null';
  return [`wtes.segment_frame(context, ${name}, ${JSON.stringify(segment)}, (context) => ${output})`, Order.NONE];
};

javascriptGenerator.forBlock.ratio_condition_true = function (block, generator) {
  const z = generator.valueToCode(block, 'Z', Order.NONE) || '[]';

  // TODO: handle multiple conditions
  const conditions = [
    {
      type: block.getFieldValue('CONDITION_TYPE'),
      value: block.getFieldValue('CONDITION_VALUE'),
    },
  ];

  return [`wtes.ratio_condition_true(${z}, ${JSON.stringify(conditions)})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock.target_achieved = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || 'null';
  const target = generator.valueToCode(block, 'TARGET', Order.NONE) || 'null';
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = generator.valueToCode(block, 'RETURN_VALUE', Order.NONE) || 'null';
  const targetProration = generator.valueToCode(block, 'TARGET_PRORATION', Order.NONE) || 'null';
  const returnValueProration =
    generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || 'null';

  return [
    `wtes.target_achieved({
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

javascriptGenerator.forBlock.target_achieved_excess = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || 'null';
  const target = generator.valueToCode(block, 'TARGET', Order.NONE) || 'null';
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = generator.valueToCode(block, 'RETURN_VALUE', Order.NONE) || 'null';
  const targetProration = generator.valueToCode(block, 'TARGET_PRORATION', Order.NONE) || 'null';
  const returnValueProration =
    generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || 'null';

  return [
    `wtes.target_achieved_excess({
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

const getTiersFromBlock = (block, generator) => {
  const tiers = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `tier_${i}`;
    const tier = generator.valueToCode(block, inputName, Order.NONE) || 'null';
    tiers.push(tier);
  }
  return tiers;
};

javascriptGenerator.forBlock.tier_intersection = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '0';
  const returnValueProration = generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || '0';
  const minMaxProration = generator.valueToCode(block, 'MIN_MAX_PRORATION', Order.NONE) || '0';
  const minInclusive = block.getFieldValue('MIN_INCLUSIVE') === 'TRUE';
  const multiplyByInput = block.getFieldValue('MULTIPLY_BY_INPUT') === 'TRUE';
  const tiers = getTiersFromBlock(block, generator);
  return [
    `wtes.tier_intersection({
  input: ${input},
  tiers: [
    ${tiers.join(',\n    ')}
  ],
  return_value_proration: ${returnValueProration},
  min_max_proration: ${minMaxProration},
  min_inclusive: ${minInclusive},
  multiply_by_input: ${multiplyByInput}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock.tier_overlap_multiply = function (block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '0';
  const returnValueProration = generator.valueToCode(block, 'RETURN_VALUE_PRORATION', Order.NONE) || '0';
  const minMaxProration = generator.valueToCode(block, 'MIN_MAX_PRORATION', Order.NONE) || '0';
  const tiers = getTiersFromBlock(block, generator);
  return [
    `wtes.tier_overlap_multiply({
  input: ${input},
  tiers: [
    ${tiers.join(',\n    ')}
  ],
  return_value_proration: ${returnValueProration},
  min_max_proration: ${minMaxProration}
})`,
    Order.FUNCTION_CALL,
  ];
};

javascriptGenerator.forBlock.tier = function (block, generator) {
  const min = Number(block.getFieldValue('MIN'));
  const max = Number(block.getFieldValue('MAX'));
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'null';
  return [
    `wtes.tier({
      "min": ${isNaN(min) ? null : min},
      "max": ${isNaN(max) ? null : max},
      "value": ${value}
    })`,
    Order.NONE,
  ];
};

export default javascriptGenerator;
