/*
  WTE_RATIO_CONDITION_TRUE

  Purpose:
    Calculates ratio of array elements that satisfy filter conditions

  Inputs:
    z (variadic): Array of decimal values ([]*decimal.Decimal)
    Filter conditions to evaluate against each element

  Outputs:
    Output: Ratio (count_matching / total_count)
    Context: count_matching, total_count, null_found flag
*/

export default {
  init: function () {
    this.jsonInit({
      type: "conditional_number",
      message0: "Conditional number:\n if %1 then %2 else %3",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
        {
          type: "input_value",
          name: "TRUE_VALUE",
          check: "Number",
        },
        { type: "input_value", name: "FALSE_VALUE", check: "Number" },
      ],
      output: "Number",
      colour: 1000,
    });
  },
};
