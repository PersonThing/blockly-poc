import { FieldTextButton } from "./FieldTextButton.js";

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: "subtract",
      output: "Number",
      colour: 0,
    });

    // add a button to add more inputs
    this.appendDummyInput("values")
      .appendField("-")
      .appendField(
        new FieldTextButton("+", () => {
          this.addInput();
        })
      );
  },

  addInput: function () {
    const lastIndex = this.length++;
    const inputName = `value_${lastIndex}`;

    // add a new value input
    const appendedInput = this.appendValueInput(inputName).setCheck("Number");

    // add a button to remove this input
    appendedInput.appendField(
      new FieldTextButton("-", () => {
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
      console.log('adding extra input', i)
      this.addInput();
    }
  },
};
