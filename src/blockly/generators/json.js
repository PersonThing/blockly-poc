import * as Blockly from 'blockly';

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

// built-in stuff
jsonGenerator.math_number = function (block) {
  const num = Number(block.getFieldValue('NUM'));
  return `{"type": "number", "value": ${isNaN(num) ? 0 : num} }`;
};

jsonGenerator.math_on_list = function (block) {
  const operator = block.getFieldValue('OP');
  const list = this.fromBlock(block.getInputTargetBlock('LIST'));
  return `{"type":"math_on_list", "operator":"${operator}", "list":${list}}`;
};

jsonGenerator.logic_compare = function (block) {
  const operator = block.getFieldValue('OP');
  const left = this.fromBlock(block.getInputTargetBlock('A'));
  const right = this.fromBlock(block.getInputTargetBlock('B'));
  return `{"type":"logic_compare", "operator":"${operator}", "left":${left}, "right":${right}}`;
};

jsonGenerator.context_variable = function (block) {
  const variable = block.getFieldValue('VARIABLE_NAME');
  return `{"type":"context_variable", "value": "${variable}"}`;
};

jsonGenerator.add = function (block) {
  const values = [];
  block.getChildren(true).forEach((block) => {
    values.push(this.fromBlock(block));
  });
  return `{"type":"add", "values": [${values.join(',')}]}`;
};

jsonGenerator.subtract = function (block) {
  const values = [];
  block.getChildren().forEach((block) => {
    values.push(this.fromBlock(block));
  });
  return `{"type":"subtract", "values": [${values.join(',')}]}`;
};

jsonGenerator.conditional_number = function (block) {
  const condition = this.fromBlock(block.getInputTargetBlock('CONDITION'));
  const trueValue = this.fromBlock(block.getInputTargetBlock('TRUE_VALUE'));
  const falseValue = this.fromBlock(block.getInputTargetBlock('FALSE_VALUE'));
  return `{"type":"conditional_number", "value":{"if":${condition}, "then":${trueValue}, "else":${falseValue}}}`;
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

jsonGenerator.define_wte = function (block) {
  const name = block.getFieldValue('NAME');
  const outputJson = this.fromBlock(block.getInputTargetBlock('OUTPUT'));
  const jsonOutput = {
    type: 'define_wte',
    value: {
      name: name,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.call_wte = function (block) {
  const name = block.getFieldValue('NAME');
  const jsonOutput = {
    type: 'call_wte',
    value: {
      name: name,
    },
  };
  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.array_math = function (block) {
  const mathType = block.getFieldValue('MATH_TYPE');
  const list = this.fromBlock(block.getInputTargetBlock('LIST'));
  return `{"type":"array_math", "math_type":"${mathType}", "list":${list}}`;
};

jsonGenerator.events_math = function (block) {
  const mathType = block.getFieldValue('MATH_TYPE');
  const eventType = block.getFieldValue('EVENT_TYPE');
  // TODO: filters
  return `{"type":"events_math", "math_type":"${mathType}", "event_type":"${eventType}"}`;
};

jsonGenerator.most_recent_events = function (block) {
  const age = Number(block.getFieldValue('AGE'));
  const eventType = block.getFieldValue('EVENT_TYPE');
  return `{"type":"most_recent_events", "age":"${age}", "event_type":"${eventType}"}`;
};

jsonGenerator.ratio = function (block) {
  const numerator = this.fromBlock(block.getInputTargetBlock('NUMERATOR'));
  const denominator = this.fromBlock(block.getInputTargetBlock('DENOMINATOR'));
  return `{"type":"ratio", "numerator":${numerator}, "denominator":${denominator}}`;
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

export default jsonGenerator;
