/*
  WTE_TIER_INTERSECTION_MULTIPLY

  Purpose:
    Like WTE_TIER_INTERSECTION but multiplies tier value by input x

  Inputs:
    Same as WTE_TIER_INTERSECTION

  Outputs:
    Output: Tier value × input x if match found, 0 otherwise
    Context: min, max, value of matching tier
*/

import sample_tiers from "../mock_data/sample_tiers";

export default {
  init: function () {
    this.jsonInit({
      type: 'tier_intersection_multiply',
      message0:
        `Tier intersection Multiply\nInput %1\nThresholds %2\nReturn Value Proration %3\nMin/Max Proration %4\nMin Inclusive %5`,
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'THRESHOLD_ID',
          options: sample_tiers.map((t, index) => [JSON.stringify(t), `${index}`]),
          value: 0,
        },
        {
          type: 'field_number',
          name: 'RETURN_VALUE_PRORATION',
          value: 1,
        },
        {
          type: 'field_number',
          name: 'MIN_MAX_PRORATION',
          value: 1,
        },
        {
          type: 'field_checkbox',
          name: 'MIN_INCLUSIVE',
          value: true,
        },
      ],
      output: 'Number',
      colour: 230,
    });
  },
};
