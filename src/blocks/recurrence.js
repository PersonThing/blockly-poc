export default {
  init: function () {
    this.jsonInit({
      type: "recurrence",
      message0: "Recurrence\n Frequency %1 \nInterval %2 \nAnchor %3",
      args0: [
        {
          type: "field_dropdown",
          name: "FREQUENCY",
          options: [
            ["day", "DAY"],
            ["week", "WEEK"],
            ["half month", "HALF_MONTH"],
            ["month", "MONTH"],
          ],
          defaultValue: "DAY", // Uncomment if you want a default value
        },
        {
          type: "field_number",
          name: "INTERVAL",
        },
        {
          type: "field_date",
          name: "ANCHOR",
          date: "2025-01-01",
        },
      ],
      colour: 50,
      tooltip: "",
      helpUrl: "",
      output: "RECURRENCE",
    });
  },
};
