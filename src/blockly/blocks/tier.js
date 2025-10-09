
// a block that accepts a number for min, max, and an output formula - which should also be a number, but could be composed of other inputs
export default {
  length: 0,

  init: function () {
    this.jsonInit({
      type: 'tier',
      message0: 'Tier Min %1 Max %2\nValue %3\n',
      args0: [
        {
          type: 'field_input',
          name: 'MIN',
          value: null,
          check: ['Number', 'Null'], // TODO: empty seems to translate to 0.. anything non-numeric translates to null, but try to fix this
        },
        {
          type: 'field_input',
          name: 'MAX',
          value: null,
          check: ['Number', 'Null'],
        },
        {
          type: 'input_value',
          name: 'VALUE',
          check: 'Number',
        }
      ],
      colour: 1000,
      tooltip: '',
      output: 'Tier',
    });
  }
};