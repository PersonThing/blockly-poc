/*
  WTE_TARGET_ACHIEVED

  Purpose:
    Compares input to target and returns value if target is met

  Inputs:
    x (fixed): Value to compare (decimal.Decimal)
    target (fixed): Target threshold (decimal.Decimal)
    return_value (fixed): Value to return if achieved (decimal.Decimal)
    target_compare (fixed): Comparison operator (string) - ">", ">=", "<", "<="
    target_proration (fixed): Target multiplier (decimal.Decimal)
    return_value_proration (fixed): Return value multiplier (decimal.Decimal)

  Outputs:
    Output: return_value × return_value_proration if achieved, 0 otherwise
    Context: Achievement status and return value
*/

import compare_options from '../compare_options';

export default {
  init: function () {
    this.jsonInit({
      type: 'target_achieved',
      message0:
        'Target Achieved?\nInput %1\nTarget %2\nCompare %3\nReturn Value %4\nTarget Proration %5\nReturn Value Proration %6',
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: 'Number',
        },
        {
          type: 'field_number',
          name: 'TARGET',
          value: 0,
        },
        {
          type: 'field_dropdown',
          name: 'TARGET_COMPARE',
          options: compare_options.map((option) => [option, option]),
          value: 'EQUALS',
        },
        {
          type: 'field_number',
          name: 'RETURN_VALUE',
          value: 100,
        },
        {
          type: 'field_number',
          name: 'TARGET_PRORATION',
          value: 1,
        },
        {
          type: 'field_number',
          name: 'RETURN_VALUE_PRORATION',
          value: 1,
        },
      ],
      colour: 50,
      tooltip: '',
      output: 'Number',
    });
  },
};
