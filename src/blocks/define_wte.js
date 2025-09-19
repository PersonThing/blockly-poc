export default {
  init: function () {
    this.jsonInit({
      type: "define_wte",
      message0: "Define Custom WTE: %1 \nOutput %2",
      args0: [
        {
          type: "field_input",
          name: "NAME",
          text: "wte1",
        },
        {
          type: "input_value",
          name: "OUTPUT",
          check: "Number",
        },
      ],
      colour: 300,
      tooltip: "",
      helpUrl: "",
    });
  },
};
