export default {
  init: function () {
    this.jsonInit({
      type: "call_wte",
      message0: "Call Custom WTE: %1\n(allow passing context overrides?)",
      args0: [
        // {
        //   type: "field_dropdown",
        //   name: "NAME",
        //   options: Object.keys(Blockly.wteDefinitions).map((name) => [name, name]),
        //   value: ""
        // },
        {
          type: "field_input",
          name: "NAME",
          text: "wte1",
        }
      ],
      colour: 300,
      tooltip: "",
      helpUrl: "",
      // previousStatement: null,
      // nextStatement: null,
      output: "Number",
    });
  },
};
