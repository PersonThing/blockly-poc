/*
WTE_TIER_INTERSECTION

Purpose:
Returns tier value when input falls within a threshold range

Inputs:
x (fixed): Input value to evaluate (decimal.Decimal)
return_value_proration (fixed): Multiplier for return values (decimal.Decimal)
min_max_proration (fixed): Multiplier for threshold boundaries (decimal.Decimal)
min_inclusive (fixed): Whether minimum threshold is inclusive (bool)
thresholds (fixed): Array of [min, max, value] triplets ([][]*decimal.Decimal)

Outputs:
Output: Tier value if match found, 0 otherwise
Context: min, max, value of matching tier
*/

import { FieldTextButton } from './FieldTextButton.js';

export default {
  length: 0,

  init: function () {
    this.jsonInit({
      type: 'tier_intersection',
      message0: `Tier Intersection\nInput %1\nReturn Value Proration %2\nMin/Max Proration %3\nMin Inclusive %4\nMultiply tier value by input %5`,
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
        {
          type: 'field_checkbox',
          name: 'MIN_INCLUSIVE',
          value: true,
        },
        {
          type: 'field_checkbox',
          name: 'MULTIPLY_BY_INPUT',
          value: true,
        },
      ],
      output: 'Number',
      colour: 230,
    });

    // add a button to add tiers
    this.appendDummyInput('tiers')
      .appendField('Tiers')
      .appendField(
        new FieldTextButton('+', () => {
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
