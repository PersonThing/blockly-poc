import * as Blockly from 'blockly';

import math_operations from '../math_operations.js';

const jsonGenerator = new Blockly.Generator('JSON');

jsonGenerator.fromWorkspace = function (workspace) {
  let rootBlockJsons = [];

  var topBlocks = workspace.getTopBlocks(true);
  topBlocks.forEach(function (block) {
    rootBlockJsons.push(jsonGenerator.fromBlock(block));
  });

  return `[${rootBlockJsons.join(',')}]`;
};

jsonGenerator.fromBlock = function (block) {
  if (block) {
    var func = this[block.type];
    if (func) {
      return func.call(this, block);
    } else {
      console.log(`Don't know how to generate JSON code for a ${block.type} block`);
      return 'null';
    }
  } else {
    return 'null';
  }
};

jsonGenerator.number = function (block) {
  const value = Number(block.getFieldValue('VALUE'));
  return `{"type": "number", "value": ${isNaN(value) ? 0 : value} }`;
};

jsonGenerator.context_variable = function (block) {
  const variable = block.getFieldValue('VARIABLE_NAME');
  return `{"type":"context_variable", "value": "${variable}"}`;
};

jsonGenerator.conditional_number = function (block) {
  const left = this.fromBlock(block.getInputTargetBlock('LEFT'));
  const operator = block.getFieldValue('OPERATOR');
  const right = this.fromBlock(block.getInputTargetBlock('RIGHT'));
  const trueValue = this.fromBlock(block.getInputTargetBlock('TRUE_VALUE'));
  const falseValue = this.fromBlock(block.getInputTargetBlock('FALSE_VALUE'));
  return `{"type":"conditional_number", "left":${left}, "operator":"${operator}", "right":${right}, "true_value":${trueValue}, "false_value":${falseValue}}`;
};

jsonGenerator.recurrence = function (block) {
  const frequency = block.getFieldValue('FREQUENCY');
  const interval = block.getFieldValue('INTERVAL');
  const anchor = block.getFieldValue('ANCHOR');
  const windowStart = block.getFieldValue('WINDOW_START');
  const windowEnd = block.getFieldValue('WINDOW_END');
  return `{"type":"recurrence", "value":{"frequency":"${frequency}", "interval":${interval}, "anchor":"${anchor}", "window_start":"${windowStart}", "window_end":"${windowEnd}"}}`;
};

jsonGenerator.offset = function (block) {
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

  return `{"type":"offset", "value":${JSON.stringify(offsetValue)}}`;
};

jsonGenerator.recurrence_frame = function (block) {
  const recurrenceJson = this.fromBlock(block.getInputTargetBlock('RECURRENCE'));
  const offsetJson = this.fromBlock(block.getInputTargetBlock('OFFSET'));
  const outputJson = this.fromBlock(block.getInputTargetBlock('OUTPUT'));
  const jsonOutput = {
    type: 'recurrence_frame',
    value: {
      recurrence: recurrenceJson ? JSON.parse(recurrenceJson) : null,
      offset: offsetJson ? JSON.parse(offsetJson) : null,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };
  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.segment_frame = function (block) {
  const name = block.getFieldValue('NAME');
  const segmentId = block.getFieldValue('SEGMENT_ID');
  const outputJson = this.fromBlock(block.getInputTargetBlock('OUTPUT'));
  const jsonOutput = {
    type: 'segment_frame',
    value: {
      name: name,
      segment_id: segmentId,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };
  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.define = function (block) {
  const name = block.getFieldValue('NAME');
  const outputJson = this.fromBlock(block.getInputTargetBlock('OUTPUT'));
  const jsonOutput = {
    type: 'define',
    value: {
      name: name,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.call = function (block) {
  const name = block.getFieldValue('NAME');
  const jsonOutput = {
    type: 'call',
    value: {
      name: name,
    },
  };
  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

const makeMathGenerator = (operation) => {
  return function (block) {
    const values = [];
    for (let i = 0; i < block.length; i++) {
      const valueBlock = block.getInputTargetBlock(`value_${i}`);
      values.push(this.fromBlock(valueBlock));
    }
    return `{"type":"${operation}", "values":[${values.join(',')}]}`;
  };
};
math_operations.forEach((op) => jsonGenerator[op] = makeMathGenerator(op));

jsonGenerator.math = function (block) {
  const operation = block.getFieldValue('OPERATION');
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const valueBlock = block.getInputTargetBlock(`value_${i}`);
    values.push(this.fromBlock(valueBlock));
  }
  return `{"type":"math", "operation":"${operation}", "values":[${values.join(',')}]}`;
};

jsonGenerator.array_math = function (block) {
  const operation = block.getFieldValue('OPERATION');
  const list = this.fromBlock(block.getInputTargetBlock('LIST'));
  return `{"type":"array_math", "operation":"${operation}", "list":${list}}`;
};

jsonGenerator.events_value = function (block) {
  const operation = block.getFieldValue('OPERATION');
  const eventType = block.getFieldValue('EVENT_TYPE');
  // TODO: filters
  return `{"type":"events_value", "operation":"${operation}", "event_type":"${eventType}"}`;
};

jsonGenerator.ratio_condition_true = function (block) {
  const z = this.fromBlock(block.getInputTargetBlock('Z'));
  const conditionType = block.getFieldValue('CONDITION_TYPE');
  const conditionValue = block.getFieldValue('CONDITION_VALUE');
  return `{"type":"ratio_condition_true", "z":${z}, "condition_type":"${conditionType}", "condition_value":${conditionValue}}`;
};

jsonGenerator.target_achieved = function (block) {
  const input = this.fromBlock(block.getInputTargetBlock('INPUT'));
  const target = this.fromBlock(block.getInputTargetBlock('TARGET'));
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE'));
  const targetProration = this.fromBlock(block.getInputTargetBlock('TARGET_PRORATION'));
  const returnValueProration = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE_PRORATION'));
  return `{"type":"target_achieved", "input":${input}, "target":${target}, "target_compare":"${targetCompare}", "return_value":${returnValue}, "target_proration":${targetProration}, "return_value_proration":${returnValueProration}}`;
};

jsonGenerator.target_achieved_excess = function (block) {
  const input = this.fromBlock(block.getInputTargetBlock('INPUT'));
  const target = this.fromBlock(block.getInputTargetBlock('TARGET'));
  const targetCompare = block.getFieldValue('TARGET_COMPARE');
  const returnValue = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE'));
  const targetProration = this.fromBlock(block.getInputTargetBlock('TARGET_PRORATION'));
  const returnValueProration = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE_PRORATION'));
  return `{"type":"target_achieved_excess", "input":${input}, "target":${target}, "target_compare":"${targetCompare}", "return_value":${returnValue}, "target_proration":${targetProration}, "return_value_proration":${returnValueProration}}`;
};

jsonGenerator.getTiersFromBlock = function (block) {
  const tiers = [];
  for (let i = 0; i < block.length; i++) {
    const tierBlock = block.getInputTargetBlock(`tier_${i}`);
    if (tierBlock) {
      tiers.push(this.fromBlock(tierBlock));
    }
  }
  return tiers;
};

jsonGenerator.tier_intersection = function (block) {
  const input = this.fromBlock(block.getInputTargetBlock('INPUT'));
  const returnValueProration = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE_PRORATION'));
  const minMaxProration = this.fromBlock(block.getInputTargetBlock('MIN_MAX_PRORATION'));
  const minInclusive = block.getFieldValue('MIN_INCLUSIVE') === 'TRUE';
  const multiplyByInput = block.getFieldValue('MULTIPLY_BY_INPUT') === 'TRUE';
  const tiers = this.getTiersFromBlock(block);
  return `{"type":"tier_intersection", "input":${input}, "tiers":[${tiers.join(',')}], "return_value_proration":${returnValueProration}, "min_max_proration":${minMaxProration}, "min_inclusive":${minInclusive}, "multiply_by_input":${multiplyByInput}}`;
};

jsonGenerator.tier_overlap_multiply = function (block) {
  const input = this.fromBlock(block.getInputTargetBlock('INPUT'));
  const returnValueProration = this.fromBlock(block.getInputTargetBlock('RETURN_VALUE_PRORATION'));
  const minMaxProration = this.fromBlock(block.getInputTargetBlock('MIN_MAX_PRORATION'));
  const tiers = this.getTiersFromBlock(block);
  return `{"type":"tier_overlap_multiply", "input":${input}, "tiers":[${tiers.join(',')}], "return_value_proration":${returnValueProration}, "min_max_proration":${minMaxProration}}`;
};

jsonGenerator.tier = function (block) {
  const min = Number(block.getFieldValue('MIN'));
  const max = Number(block.getFieldValue('MAX'));
  const value = this.fromBlock(block.getInputTargetBlock('VALUE'));
  return `{"type":"tier", "min":${isNaN(min) ? null : min}, "max":${isNaN(max) ? null : max}, "value":${value}}`;
}

export default jsonGenerator;
