export default {
  init: function () {
    this.jsonInit({
      type: "context_variable",
      message0: "Context variable %1",
      args0: [
        {
          type: "field_dropdown",
          name: "VARIABLE_NAME",
          check: "Number",
          options: [
            ["output", "output"],
            ["base_pay", "base_pay"],
            ["wrvu", "wrvu"],
            ["hours", "hours"],
            ["other generated variables here", "v3"],
          ],
          defaultValue: "DAY", // Uncomment if you want a default value
        },
      ],
      output: "Number",
      colour: 160,
    });
  },
};
