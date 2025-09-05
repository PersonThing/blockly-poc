import { FieldTextButton } from "./FieldTextButton.js";

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: "add",
      output: "Number",
      colour: 100,
    });

    console.log(this);

    // add a button to add more inputs
    this.appendDummyInput("values")
      .appendField("+")
      .appendField(
        new FieldTextButton("+", () => {
          this.addInput();
        })
      );

    // todo: add correct # of inputs from initialized block when loading an existing block
    this.addInput();
    this.addInput();
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
};
