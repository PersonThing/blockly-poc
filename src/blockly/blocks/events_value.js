/*
  WTE_AVE_EVENTS + WTE_COUNT_EVENTS
  
  ** combined ave_events and count_events into 1 block and added min, max, sum, multiply
*/
import { DistinctEventTypes } from '../mock_data/sample_events.js';
import { FieldTextButton } from './FieldTextButton.js';
import event_operations from '../event_operations.js';

export default {
  length: 0,

  init: function () {
    this.jsonInit({
      type: 'events_value',
      output: 'Number',
      colour: 65,

      message0: '%1 of %2 event values\n',
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPERATION',
          options: event_operations.map((op) => [op, op]),
          value: 'sum',
        },

        // event type to filter for
        {
          type: 'field_dropdown',
          name: 'EVENT_TYPE',
          options: DistinctEventTypes.map((type) => [type, type]),
          value: 'PatientSatisfaction',
        },
      ],
      inputsInline: true,
    });

    // add a button to add filters
    this.appendEndRowInput('filters')
      .appendField(
        new FieldTextButton('+ Add filter', () => {
          this.addInput();
        })
      );
  },

  addInput: function () {
    const lastIndex = this.length++;
    const inputName = `filter_${lastIndex}`;

    // add a new filter input
    const appendedInput = this.appendValueInput(inputName).setCheck('EventFilter');

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
