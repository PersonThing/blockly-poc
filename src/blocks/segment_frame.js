export default {
  init: function () {
    this.jsonInit({
      type: "segment_frame",
      message0: "Segment Frame \nName %1 \nSegmentID %2 \nOutput %3",
      args0: [
        {
          type: "field_input",
          name: "NAME",
          text: "seg1",
        },
        {
          type: "field_dropdown",
          name: "SEGMENT_ID",
          options: [
            ["seg1 (1 participant)", "1"],
            ["seg2 (2 participants)", "2"],
            ["seg3 (3 participants)", "3"],
            ["seg4 (4 participants)", "4"],
            ["seg5 (10 participants)", "5"],
          ],
          // default
          value: 2,
        },
        {
          type: "input_value",
          name: "OUTPUT",
          check: "Number",
        },
      ],
      colour: 25,
      tooltip: "",
      helpUrl: "",
      // previousStatement: null,
      // nextStatement: null,
      output: "Number",
    });
  },
};
