export default {
  init: function () {
    this.jsonInit({
      type: 'conditional_number',
      message0: 'Conditional number:\n if %1 then %2 else %3',
      args0: [
        {
          type: 'input_value',
          name: 'CONDITION',
          check: 'Boolean',
        },
        {
          type: 'input_value',
          name: 'TRUE_VALUE',
          check: 'Number',
        },
        { type: 'input_value', name: 'FALSE_VALUE', check: 'Number' },
      ],
      output: 'Number',
      colour: 1000,
    });
  },
};
