export default {
  init: function () {
    this.jsonInit({
      type: 'recurrence_frame',
      message0: 'Recurrence Frame \nRecurrence %1 \nOffset %2 \nOutput %3',
      args0: [
        {
          type: 'input_value',
          name: 'RECURRENCE',
          check: 'RECURRENCE',
        },
        {
          type: 'input_value',
          name: 'OFFSET',
          check: 'OFFSET',
        },
        {
          type: 'input_value',
          name: 'OUTPUT',
          check: 'Number',
        },
      ],
      colour: 10,
      tooltip: '',
      helpUrl: '',
      // previousStatement: null,
      // nextStatement: null,
      output: 'Number',
    });
  },
};
