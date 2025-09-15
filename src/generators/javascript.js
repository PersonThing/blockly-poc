import { javascriptGenerator, Order } from "blockly/javascript";

javascriptGenerator.forBlock["set_output"] = function (block, generator) {
  const value = generator.valueToCode(block, "VALUE", 0) || "null";
  return `context.output = ${value}`; //, Order.NONE];
};

javascriptGenerator.forBlock["context_variable"] = function (block, generator) {
  const variableName = block.getFieldValue("VARIABLE_NAME") || "";
  return [`context['${variableName}']`, Order.NONE];
};

javascriptGenerator.forBlock["add"] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || "null";
    values.push(value);
  }
  return [`(${values.join(" + ")})`, Order.ADDITION];
};

javascriptGenerator.forBlock["subtract"] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || "null";
    values.push(value);
  }
  return [`(${values.join(" - ")})`, Order.SUBTRACTION];
};

javascriptGenerator.forBlock["multiply"] = function (block, generator) {
  const a = generator.valueToCode(block, "A", Order.NONE) || "0";
  const b = generator.valueToCode(block, "B", Order.NONE) || "0";
  return [`(${a} * ${b})`, Order.MULTIPLICATION];
};

javascriptGenerator.forBlock["divide"] = function (block, generator) {
  const a = generator.valueToCode(block, "A", Order.NONE) || "0";
  const b = generator.valueToCode(block, "B", Order.NONE) || "0";
  return [`(${a} / ${b})`, Order.DIVISION];
};

javascriptGenerator.forBlock["conditional_number"] = function (
  block,
  generator
) {
  const condition =
    generator.valueToCode(block, "CONDITION", Order.NONE) || "false";
  const trueValue =
    generator.valueToCode(block, "TRUE_VALUE", Order.NONE) || "0";
  const falseValue =
    generator.valueToCode(block, "FALSE_VALUE", Order.NONE) || "0";
  return [`(${condition} ? ${trueValue} : ${falseValue})`, Order.CONDITIONAL];
};

javascriptGenerator.forBlock["recurrence"] = function (block, generator) {
  const recurrence = {
    frequency: block.getFieldValue("FREQUENCY"),
    interval: block.getFieldValue("INTERVAL"),
    anchor: block.getFieldValue("ANCHOR"),
  };
  return [JSON.stringify(recurrence), Order.NONE];
};

javascriptGenerator.forBlock["offset"] = function (block, generator) {
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

  return [JSON.stringify(offsetValue), Order.NONE];
};

javascriptGenerator.forBlock["recurrence_frame"] = function (block, generator) {
  const recurrence = generator.valueToCode(block, "RECURRENCE", Order.NONE) || "null";
  const offset = generator.valueToCode(block, "OFFSET", Order.NONE) || "null";
  const output = generator.valueToCode(block, "OUTPUT", Order.NONE) || "null";

  return [
    `
  executeRecurrenceFrame({
    recurrence: ${recurrence},
    offset: ${offset},
    output: (context) => {
      return ${output}
    }
  })`,
    Order.NONE,
  ];
};

export default javascriptGenerator;
