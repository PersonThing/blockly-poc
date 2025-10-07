import { FieldTextButton } from './FieldTextButton.js';
import math_operations from '../math_operations.js';

// we also have a generic math block that makes the operator a dropdown
// basic json that all math blocks will start with, and just modify the type, color, and message
const createMathBlock = (type, color, message, args = null) => ({
  length: 0,

  init: function () {
    this.jsonInit({
      type: type,
      colour: color,
      message0: message,
      args0: args,
      output: 'Number',
    });

    // add a button to add more inputs
    this.appendDummyInput('values').appendField(
      new FieldTextButton('+', () => {
        this.addInput();
      })
    );

    // always have at least 2 inputs
    this.addInput();
    this.addInput();
  },

  addInput: function () {
    const lastIndex = this.length++;
    const inputName = `value_${lastIndex}`;

    // add a new value input
    const appendedInput = this.appendValueInput(inputName).setCheck('Number');

    // add a button to remove this input
    appendedInput.appendField(
      new FieldTextButton('-', () => {
        this.removeInput(inputName);
        this.length--;
      })
    );
  },

  saveExtraState: function () {
    return {
      length: this.length,
    };
  },

  loadExtraState: function (state) {
    for (let i = 2; i < state.length; i++) {
      this.addInput();
    }
  },
});

const sum = createMathBlock('sum', 230, '+');
const subtract = createMathBlock('subtract', 230, '−');
const multiply = createMathBlock('multiply', 230, '×');
const divide = createMathBlock('divide', 230, '÷');
const min = createMathBlock('min', 230, 'min');
const max = createMathBlock('max', 230, 'max');
const average = createMathBlock('average', 230, 'average');
const count = createMathBlock('count', 230, 'count');
const math = createMathBlock('math', 230, '%1', [
  {
    type: 'field_dropdown',
    name: 'MATH_TYPE',
    options: math_operations.map((op) => [op, op]),
    value: 'sum',
  },
]);

export { sum, subtract, multiply, divide, min, max, average, count, math };
