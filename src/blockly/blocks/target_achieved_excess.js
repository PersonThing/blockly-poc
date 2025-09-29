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

import compare_options from '../mock_data/compare_options';

export default {
  init: function () {
    this.jsonInit({
      type: 'target_achieved_excess',
      message0:
        'Target achieved excess\nInput %1\nTarget %2\nCompare %3\nMultiply excess by %4\nTarget Proration %5\nReturn Value Proration %6',
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'TARGET',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'TARGET_COMPARE',
          options: compare_options.map((option) => [option, option]),
          value: 'EQUALS',
        },
        {
          type: 'input_value',
          name: 'RETURN_VALUE',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'TARGET_PRORATION',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'RETURN_VALUE_PRORATION',
          check: 'Number',
        },
      ],
      colour: 50,
      tooltip: '',
      helpUrl: '',
      output: 'Number',
    });
  },
};
