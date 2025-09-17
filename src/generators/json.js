import * as Blockly from "blockly";

const jsonGenerator = new Blockly.Generator("JSON");

jsonGenerator.fromWorkspace = function (workspace) {
  let rootBlockJsons = [];

  var topBlocks = workspace.getTopBlocks(true);
  topBlocks.forEach(function (block) {
    rootBlockJsons.push(jsonGenerator.fromBlock(block));
  });

  return `[${rootBlockJsons.join(",")}]`;
};

jsonGenerator.fromBlock = function (block) {
  if (block) {
    var func = this[block.type];
    if (func) {
      return func.call(this, block);
    } else {
      console.log(
        `Don't know how to generate JSON code for a ${block.type} block`
      );
      return "null";
    }
  } else {
    return "null";
  }
};

jsonGenerator.math_number = function (block) {
  const num = Number(block.getFieldValue("NUM"));
  return `{"type": "number", "value": ${isNaN(num) ? 0 : num} }`;
};

jsonGenerator.logic_compare = function (block) {
  const operator = block.getFieldValue("OP");
  const left = this.fromBlock(block.getInputTargetBlock("A"));
  const right = this.fromBlock(block.getInputTargetBlock("B"));
  return `{"type":"logic_compare", "operator":"${operator}", "left":${left}, "right":${right}}`;
};

jsonGenerator.context_variable = function (block) {
  const variable = block.getFieldValue("VARIABLE_NAME");
  return `{"type":"context_variable", "value": "${variable}"}`;
};

jsonGenerator.add = function (block) {
  const values = [];
  block.getChildren(true).forEach((block) => {
    values.push(this.fromBlock(block));
  });
  return `{"type":"add", "values": [${values.join(",")}]}`;
};

jsonGenerator.subtract = function (block) {
  const values = [];
  block.getChildren().forEach((block) => {
    values.push(this.fromBlock(block));
  });
  return `{"type":"subtract", "values": [${values.join(",")}]}`;
};

jsonGenerator.multiply = function (block) {
  const valueA = this.fromBlock(block.getInputTargetBlock("A"));
  const valueB = this.fromBlock(block.getInputTargetBlock("B"));
  return `{"type":"multiply", "value":{"A":${valueA}, "B":${valueB}}}`;
};

jsonGenerator.divide = function (block) {
  const valueA = this.fromBlock(block.getInputTargetBlock("A"));
  const valueB = this.fromBlock(block.getInputTargetBlock("B"));
  return `{"type":"divide", "value":{"A":${valueA}, "B":${valueB}}}`;
};

jsonGenerator.conditional_number = function (block) {
  const condition = this.fromBlock(block.getInputTargetBlock("CONDITION"));
  const trueValue = this.fromBlock(block.getInputTargetBlock("TRUE_VALUE"));
  const falseValue = this.fromBlock(block.getInputTargetBlock("FALSE_VALUE"));
  return `{"type":"conditional_number", "value":{"if":${condition}, "then":${trueValue}, "else":${falseValue}}}`;
};

jsonGenerator.recurrence = function (block) {
  const frequency = block.getFieldValue("FREQUENCY");
  const interval = block.getFieldValue("INTERVAL");
  const anchor = block.getFieldValue("ANCHOR");
  const windowStart = block.getFieldValue("WINDOW_START");
  const windowEnd = block.getFieldValue("WINDOW_END");
  return `{"type":"recurrence", "value":{"frequency":"${frequency}", "interval":${interval}, "anchor":"${anchor}", "window_start":"${windowStart}", "window_end":"${windowEnd}"}}`;
};

jsonGenerator.offset = function (block) {
  const offsetGrain = block.getFieldValue("OFFSET_GRAIN");
  const offsetAmount = block.getFieldValue("OFFSET_AMOUNT");
  const durationGrain = block.getFieldValue("DURATION_GRAIN");
  const durationAmount = block.getFieldValue("DURATION_AMOUNT");

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

jsonGenerator.define_wte = function (block) {
  const name = block.getFieldValue("NAME");
  const outputJson = this.fromBlock(block.getInputTargetBlock("OUTPUT"));
  const jsonOutput = {
    type: "define_wte",
    value: {
      name: name,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.call_wte = function (block) {
  const name = block.getFieldValue("NAME");
  const jsonOutput = {
    type: "call_wte",
    value: {
      name: name,
    },
  };
  return `${JSON.stringify(jsonOutput, null, 2)}`;
}

jsonGenerator.recurrence_frame = function (block) {
  const recurrenceJson = this.fromBlock(
    block.getInputTargetBlock("RECURRENCE")
  );
  const offsetJson = this.fromBlock(block.getInputTargetBlock("OFFSET"));
  const outputJson = this.fromBlock(block.getInputTargetBlock("OUTPUT"));

  const jsonOutput = {
    type: "recurrence_frame",
    value: {
      recurrence: recurrenceJson ? JSON.parse(recurrenceJson) : null,
      offset: offsetJson ? JSON.parse(offsetJson) : null,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

jsonGenerator.segment_frame = function (block) {
  
  const name = block.getFieldValue("NAME");
  const segmentId = block.getFieldValue("SEGMENT_ID");
  const outputJson = this.fromBlock(block.getInputTargetBlock("OUTPUT"));

  const jsonOutput = {
    type: "segment_frame",
    value: {
      name: name,
      segment_id: segmentId,
      output: outputJson ? JSON.parse(outputJson) : null,
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};

export default jsonGenerator;
