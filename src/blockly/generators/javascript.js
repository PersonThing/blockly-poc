import { javascriptGenerator, Order } from "blockly/javascript";

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
  return [
    `${values
      .flatMap((v) => `flatten(${v})`)
      .join(" + ")}`,
    Order.ADDITION,
  ];
};

javascriptGenerator.forBlock["subtract"] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.length; i++) {
    const inputName = `value_${i}`;
    const value = generator.valueToCode(block, inputName, 0) || "null";
    values.push(value);
  }
  return [
    `${values
      .flatMap((v) => `flatten(${v})`)
      .join(" - ")}`,
    Order.SUBTRACTION,
  ];
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
  return [
    `${condition} ? ${trueValue} : ${falseValue}`,
    Order.CONDITIONAL,
  ];
};

javascriptGenerator.forBlock["recurrence"] = function (block, generator) {
  const recurrence = {
    frequency: block.getFieldValue("FREQUENCY"),
    interval: block.getFieldValue("INTERVAL"),
    anchor: block.getFieldValue("ANCHOR"),
    window_start: block.getFieldValue("WINDOW_START"),
    window_end: block.getFieldValue("WINDOW_END"),
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
  const recurrence =
    generator.valueToCode(block, "RECURRENCE", Order.NONE) || "null";
  const offset = generator.valueToCode(block, "OFFSET", Order.NONE) || "null";
  const output = generator.valueToCode(block, "OUTPUT", Order.NONE) || "null";

  return [
    `executeRecurrenceFrame(${recurrence}, ${offset}, (context) => ${output})`,
    Order.NONE,
  ];
};

javascriptGenerator.forBlock["segment_frame"] = function (block, generator) {
  let name = block.getFieldValue("NAME");
  name = name ? `'${name}'` : "null";
  let segmentId = block.getFieldValue("SEGMENT_ID");
  segmentId = segmentId ? segmentId : "null";
  const output = generator.valueToCode(block, "OUTPUT", Order.NONE) || "null";
  return [
    `executeSegmentFrame(${name}, ${segmentId}, (context) => ${output})`,
    Order.NONE,
  ];
};

javascriptGenerator.forBlock["define_wte"] = function (block, generator) {
  const name = block.getFieldValue("NAME");
  const output = generator.valueToCode(block, "OUTPUT", Order.NONE) || "null";
  return `defineWte('${name}', context => ${output});`;
};

javascriptGenerator.forBlock["call_wte"] = function (block, generator) {
  const name = block.getFieldValue("NAME");
  return [`callWte('${name}', context)`, Order.NONE];
};

// WTEs
javascriptGenerator.forBlock["wte_constant"] = function (block, generator) {
  const value = block.getFieldValue("x");
  return [`(${value})`, Order.NONE];
};

export default javascriptGenerator;
