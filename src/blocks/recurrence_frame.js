export default {
  init: function () {
    this.jsonInit({
      type: "recurrence_frame",
      message0: "Recurrence Frame \nRecurrence %1 \nOffset %2",
      args0: [
        {
          type: "input_value",
          name: "RECURRENCE",
          check: "RECURRENCE",
        },
        {
          type: "input_value",
          name: "OFFSET",
          check: "OFFSET",
        },
      ],
      message1: "Body %1",
      args1: [
        {
          type: "input_statement",
          name: "BODY",
        },
      ],
      colour: 10,
      tooltip: "",
      helpUrl: "",
      previousStatement: null,
      nextStatement: null,
    });
  },
};
