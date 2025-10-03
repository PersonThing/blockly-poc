import compare_options from '../compare_options';

export default {
  init: function () {
    this.jsonInit({
      type: 'conditional_number',
      message0: 'if\n%1\n%2\n%3\nthen %4\nelse %5',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'OPERATOR',
          options: compare_options.map((option) => [option, option]),
          value: 'equals',
        },
        {
          type: 'input_value',
          name: 'RIGHT',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'TRUE_VALUE',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'FALSE_VALUE',
          check: 'Number',
        },
      ],
      output: 'Number',
      colour: 1000,
    });
  },
};
