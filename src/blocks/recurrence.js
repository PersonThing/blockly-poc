export default {
  init: function () {
    this.jsonInit({
      type: "recurrence",
      message0: "Recurrence\n Frequency %1 \nInterval %2 \nAnchor %3 \nWindow start %4 \nWindow end %5",
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
          value: "WEEK",
        },
        {
          type: "field_number",
          name: "INTERVAL",
          value: 1,
        },
        {
          type: "field_date",
          name: "ANCHOR",
          date: null,
        },
        {
          type: "field_date",
          name: "WINDOW_START",
          date: null,
        },
        {
          type: "field_date",
          name: "WINDOW_END",
          date: null,
        },
      ],
      colour: 50,
      tooltip: "",
      helpUrl: "",
      output: "RECURRENCE",
    });
  },
};
