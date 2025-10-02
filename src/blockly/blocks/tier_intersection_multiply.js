/*
  TODO: discuss...
    given the changes to tier_intersection,
    this WTE becomes kind of pointless
    it can be accomplished with a multiply block in the tier value function
    or with a multiply block on the output of tier_intersection

  WTE_TIER_INTERSECTION_MULTIPLY

  Purpose:
    Like WTE_TIER_INTERSECTION but multiplies tier value by input x

  Inputs:
    Same as WTE_TIER_INTERSECTION

  Outputs:
    Output: Tier value × input x if match found, 0 otherwise
    Context: min, max, value of matching tier

*/

import { FieldTextButton } from './FieldTextButton.js';

export default {
  length: 0,

  init: function () {
    this.jsonInit({
      type: 'tier_intersection_multiply',
      message0: `Tier Intersection Multiply\nInput %1\nReturn Value Proration %2\nMin/Max Proration %3\nMin Inclusive %4`,
      args0: [
        {
          type: 'input_value',
          name: 'INPUT',
          check: 'Number',
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
