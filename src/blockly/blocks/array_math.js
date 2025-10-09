/*
  WTE_MAX_ARRAY + WTE_MIN_ARRAY + WTE_SUM_ARRAY + WTE_MULTIPLY_ARRAY
  
  ** combined min_array, max_array, sum_array, multiply_array into 1 block, added average and count
*/
import math_operations from '../math_operations.js';

export default {
  init: function () {
    this.jsonInit({
      type: 'array_math',
      output: 'Number',
      colour: 230,

      message0: '%1 of array %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPERATION',
          options: math_operations.map(op => [op, op]),
          value: 'sum',
        },
        {
          type: 'input_value',
          name: 'LIST',
          check: 'Array',
        },
      ],
    });
  },
};
