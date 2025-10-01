export default {
  init: function () {
    this.jsonInit({
      type: 'multiply',
      output: 'Number',
      colour: 100,
      message0: '%1 × %2',
      args0: [
        {
          type: 'input_value',
          name: 'A',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'B',
          check: 'Number',
        },
      ],
    });
  },
};
