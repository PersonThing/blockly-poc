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

import { FieldTextButton } from './FieldTextButton.js';

export default {
  length: 0,

  init: function () {
    this.jsonInit({
      type: 'tier_overlap_multiply',
      message0: `Tier Overlap Multiply
Input %1
Return Value Proration %2
Min/Max Proration %3
`,
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'RETURN_VALUE_PRORATION',
          value: 1,
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN_MAX_PRORATION',
          value: 1,
          check: 'Number',
        },
      ],
      output: 'Number',
      colour: 230,
    });

    // add a button to add tiers
    this.appendDummyInput('tiers')
      .appendField('\n')
      .appendField(
        new FieldTextButton('+ Add tier', () => {
          this.addInput();
        })
      );
  },

  addInput: function () {
    const lastIndex = this.length++;
    const inputName = `tier_${lastIndex}`;

    // add a new tier input
    const appendedInput = this.appendValueInput(inputName).setCheck('Tier');

    // add a button to remove this input
    appendedInput.appendField(
      new FieldTextButton('-', () => {
        this.removeInput(inputName);
        this.length--;
      })
    );
  },

  saveExtraState: function () {
    return {
      length: this.length,
    };
  },

  loadExtraState: function (state) {
    for (let i = 0; i < state.length; i++) {
      this.addInput();
    }
  },
};
