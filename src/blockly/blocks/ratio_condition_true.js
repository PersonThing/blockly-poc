/*
  WTE_RATIO_CONDITION_TRUE

  ** for now, just a single condition - later, allow multiple conditions
  ** we should probably allow AND / OR logic between conditions too, backend doesn't seem to allow that?

  Purpose:
    Calculates ratio of array elements that satisfy filter conditions

  Inputs:
    z (variadic): Array of decimal values ([]*decimal.Decimal)
    Filter conditions to evaluate against each element

  Outputs:
    Output: Ratio (count_matching / total_count)
    Context: count_matching, total_count, null_found flag
*/

import compare_options from '../compare_options';

export default {
  init: function () {
    this.jsonInit({
      type: 'ratio_condition_true',
      message0: 'Percent of %1\nWhere value is %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'Z',
          check: 'Array',
        },

        // single condition for mockup - this would allow adding more conditions
        {
          type: 'field_dropdown',
          name: 'CONDITION_TYPE',
          options: compare_options.map((option) => [option, option]),
          value: 'EQUALS',
        },
        {
          type: 'field_number',
          name: 'CONDITION_VALUE',
          value: 0,
        },
      ],
      output: 'Number',
      colour: 230,
    });
  },
};
