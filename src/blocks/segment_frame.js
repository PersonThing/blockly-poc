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
          type: "field_number",
          name: "SEGMENT_ID",
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
