/*
  WTE_TIER_OVERLAP_MULTIPLY

  Purpose:
    Calculates overlapping tier contributions (progressive taxation style)

  Inputs:
    x (fixed): Input value to evaluate (decimal.Decimal)
    thresholds (fixed): Array of [min, max, rate] triplets ([][]*decimal.Decimal)
    return_value_proration (fixed): Multiplier for rates (decimal.Decimal)
    min_max_proration (fixed): Multiplier for thresholds (decimal.Decimal)

  Outputs:
    Output: Sum of contributions from all applicable tiers

  Example scenario:
    thresholds = [ [0, 100, 5], [100, 200, 6], [200, null, 7] ]
    return_value_proration = 1
    min_max_proration = 1

    If x = 250:
      Tier 1: (100 - 0) * 5 = 500
      Tier 2: (200 - 100) * 6 = 600
      Tier 3: (250 - 200) * 7 = 350
      Total = 1450

    If x = 150:
      Tier 1: (100 - 0) * 5 = 500
      Tier 2: (150 - 100) * 6 = 300
      Total = 800
*/

import sample_tiers from '../mock_data/sample_tiers';

export default {
  init: function () {
    this.jsonInit({
      type: 'tier_overlap_multiply',
      message0: `Tier Overlap Multiply\nInput %1\nThresholds %2\nReturn Value Proration %3\nMin/Max Proration %4`,
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
      ],
      output: 'Number',
      colour: 230,
    });
  },
};
