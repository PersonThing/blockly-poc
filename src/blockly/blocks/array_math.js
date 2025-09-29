/*
  WTE_MAX_ARRAY + WTE_MIN_ARRAY + WTE_SUM_ARRAY + WTE_MULTIPLY_ARRAY
  
  ** combined min_array, max_array, sum_array, multiply_array into 1 block, added average and count
*/
export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: 'array_math',
      output: 'Number',
      colour: 230,

      message0: '%1 of list %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'MATH_TYPE',
          options: [
            ['count', 'COUNT'],
            ['min', 'MIN'],
            ['max', 'MAX'],
            ['average', 'AVERAGE'],
            ['sum', 'SUM'],
            ['multiply', 'MULTIPLY'], // multiply seems awkward here
          ],
          value: 'MIN',
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
