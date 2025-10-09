import SampleSegments from '../mock_data/sample_segments.js';

export default {
  init: function () {
    this.jsonInit({
      type: 'segment_frame',
      message0: 'Segment Frame \nName %1 \nSegment %2 \nOutput %3',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'seg1',
        },
        {
          type: 'field_dropdown',
          name: 'SEGMENT_ID',
          options: Object.entries(SampleSegments)
            .map(([key, segment]) => [`${key}: ${segment.length} participants`, key]),
          // default
          value: 2,
        },
        {
          type: 'input_value',
          name: 'OUTPUT',
          check: 'Number',
        },
      ],
      colour: 100,
      tooltip: '',
      // previousStatement: null,
      // nextStatement: null,
      output: 'Array',
    });
  },
};
