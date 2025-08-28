export default {
  init: function () {
    this.jsonInit({
      type: "offset",
      message0:
        "Offset\n Grain %1 \nAmount %2\nDuration Grain %3 \nDuration Amount %4",
      args0: [
        {
          type: "field_dropdown",
          name: "OFFSET_GRAIN",
          options: [
            ["day", "DAY"],
            ["week", "WEEK"],
            ["half month", "HALF_MONTH"],
            ["month", "MONTH"],
            ["nil", "NIL"],
          ],
          defaultValue: "DAY", // Uncomment if you want a default value
        },
        {
          type: "field_number",
          name: "OFFSET_AMOUNT",
        },
        {
          type: "field_dropdown",
          name: "DURATION_GRAIN",
          options: [
            ["day", "DAY"],
            ["week", "WEEK"],
            ["half month", "HALF_MONTH"],
            ["month", "MONTH"],
            ["nil", "NIL"],
          ],
          defaultValue: "DAY", // Uncomment if you want a default value
        },
        {
          type: "field_number",
          name: "DURATION_AMOUNT",
        },
      ],
      colour: 30,
      tooltip: "",
      helpUrl: "",
      output: "OFFSET",
    });
  },
};
