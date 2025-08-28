export default {
  init: function () {
    this.jsonInit({
      type: "set_output",
      message0: "Set output %1",
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: "Number",
        },
      ],
      colour: 160,
      previousStatement: null,
      nextStatement: null,
    });
  },
};
