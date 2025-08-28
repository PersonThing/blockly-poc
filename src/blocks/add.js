import { FieldTextButton } from "./FieldTextButton.js";

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: "add",
      output: "Number",
      colour: 100,
    });

    // add a button to add more inputs
    this.appendDummyInput("values")
      .appendField("+")
      .appendField(
        new FieldTextButton("+", function () {
          const lastIndex = this.sourceBlock_.length++;
          const inputName = `value_${lastIndex}`;

          // add a new value input
          const appendedInput = this.sourceBlock_
            .appendValueInput(inputName)
            .setCheck("Number");

          // add a button to remove this input
          appendedInput.appendField(
            new FieldTextButton("-", function () {
              this.sourceBlock_.removeInput(inputName);
              this.sourceBlock_.length--;
            })
          );
        })
      );
  },
};
