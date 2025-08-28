import * as Blockly from "blockly";
import { Order } from "blockly/javascript";

export const jsonGenerator = new Blockly.CodeGenerator("JSON");

const getNestedCode = (block, generator) => {
  const nextBlocks = generator.statementToCode(block, "BODY");
  const lines = nextBlocks.split("\n").filter(Boolean); // Split into lines and filter out empty strings
  const formattedLines = lines.map((line) => line.trim()); // Trim whitespace from each line
  return formattedLines;
};

jsonGenerator.forBlock["set_output"] = function (block, generator) {
  const value = generator.valueToCode(block, "VALUE", 0) || "null";
  const code = `{"type":"set_output", "value": ${value}}`;
  return code; //[code, Order.NONE];
};

jsonGenerator.forBlock["math_number"] = function (block, generator) {
  const num = Number(block.getFieldValue("NUM"));
  return [isNaN(num) ? "0" : String(num), Order.ATOMIC];
};

jsonGenerator.forBlock["context_variable"] = function (block, generator) {
  const variable = block.getFieldValue("VARIABLE_NAME");
  return [`{"type":"context_variable", "value": "${variable}"}`, Order.NONE];
};

jsonGenerator.forBlock["add"] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || "null";
    values.push(value);
  }
  return [`{"type":"add", "values": [${values.join(',')}]}`, Order.ADDITION];
};

jsonGenerator.forBlock["subtract"] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || "null";
    values.push(value);
  }
  return [`{"type":"subtract", "values": [${values.join(',')}]}`, Order.SUBTRACTION];
};

jsonGenerator.forBlock["multiply"] = function (block, generator) {
  const valueA = generator.valueToCode(block, "A", 0) || "null";
  const valueB = generator.valueToCode(block, "B", 0) || "null";
  return [
    `{"type":"multiply", "value":{"A":${valueA}, "B":${valueB}}}`,
    Order.MULTIPLICATION,
  ];
};

jsonGenerator.forBlock["divide"] = function (block, generator) {
  const valueA = generator.valueToCode(block, "A", 0) || "null";
  const valueB = generator.valueToCode(block, "B", 0) || "null";
  return [
    `{"type":"divide", "value":{"A":${valueA}, "B":${valueB}}}`,
    Order.DIVISION,
  ];
};

jsonGenerator.forBlock["conditional_number"] = function (block, generator) {
  const condition = generator.valueToCode(block, "CONDITION", 0) || "null";
  const trueValue = generator.valueToCode(block, "TRUE_VALUE", 0) || "null";
  const falseValue = generator.valueToCode(block, "FALSE_VALUE", 0) || "null";
  return [
    `{"type":"conditional_number", "value":{"if":${condition}, "then":${trueValue}, "else":${falseValue}}}`,
    Order.CONDITIONAL,
  ];
};

jsonGenerator.forBlock["recurrence"] = function (block, generator) {
  const frequency = block.getFieldValue("FREQUENCY");
  const interval = block.getFieldValue("INTERVAL");
  const anchor = block.getFieldValue("ANCHOR");
  return [
    `{"type":"recurrence", "value":{"frequency":"${frequency}", "interval":${interval}, "anchor":"${anchor}"}}`,
    Order.NONE,
  ];
};

jsonGenerator.forBlock["offset"] = function (block, generator) {
  const offsetGrain = block.getFieldValue("OFFSET_GRAIN");
  const offsetAmount = block.getFieldValue("OFFSET_AMOUNT");
  const durationGrain = block.getFieldValue("DURATION_GRAIN");
  const durationAmount = block.getFieldValue("DURATION_AMOUNT");

  const offsetValue = {
    "offset grain": offsetGrain,
    "offset amount": offsetAmount,
    duration: {
      "duration grain": durationGrain,
      "duration amount": durationAmount,
    },
  };

  return [
    `{"type":"offset", "value":${JSON.stringify(offsetValue)}}`,
    Order.NONE,
  ];
};

jsonGenerator.forBlock["recurrence_frame"] = function (block, generator) {
  const recurrence = generator.valueToCode(block, "RECURRENCE", 0) || "null";
  const offset = generator.valueToCode(block, "OFFSET", 0) || "null";
  const body = getNestedCode(block, generator);

  const jsonOutput = {
    type: "recurrence_frame",
    value: {
      recurrence: JSON.parse(recurrence)?.value,
      offset: JSON.parse(offset)?.value,
      body: body.map(JSON.parse),
    },
  };

  return `${JSON.stringify(jsonOutput, null, 2)}`;
};
