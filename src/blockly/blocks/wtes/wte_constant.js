export default {
  init: function () {
    this.jsonInit({
      type: "wte_constant",
      message0: "Constant %1",
      args0: [
        {
          type: "field_input",
          name: "x",
          check: "Number",
        },
      ],
      output: "Number",
      colour: 200,
    });
  },
};
