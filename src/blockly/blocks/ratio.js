/*
  WTE_RATIO

  ** just use the built-in division block for now
*/

export default {
  init: function () {
    this.jsonInit({
      type: 'ratio',
      message0: 'Ratio: %1 / %2',
      args0: [
        { type: 'input_value', name: 'NUMERATOR', check: 'Number' },
        { type: 'input_value', name: 'DENOMINATOR', check: 'Number' },
      ],
      output: 'Number',
      colour: 230,
    });
  },
};
