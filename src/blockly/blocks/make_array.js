// a block that takes variadic inputs and creates a single array output value
import { FieldTextButton } from './FieldTextButton.js';

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: 'make_array',
      output: 'Array',
      colour: 50,
    });

    // add a button to add more inputs
    this.appendDummyInput('values')
      .appendField('make array')
      .appendField(
        new FieldTextButton('+', () => {
          this.addInput();
        })
      );
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
    for (let i = 0; i < state.length; i++) {
      this.addInput();
    }
  },
};
