/*
  WTE_AVE_EVENTS + WTE_COUNT_EVENTS
  
  ** combined ave_events and count_events into 1 block and added min, max, sum, multiply
*/
import { DistinctEventTypes } from '../mock_data/sample_events.js';

import event_operations from '../event_operations.js';

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: 'events_math',
      output: 'Number',
      colour: 65,

      message0: '%1 of %2 event values\nthat match filters [...]',
      args0: [
        {
          type: 'field_dropdown',
          name: 'OPERATION',
          options: event_operations.map(op => [op, op]),
          value: 'sum',
        },

        // event type to filter for
        {
          type: 'field_dropdown',
          name: 'EVENT_TYPE',
          options: DistinctEventTypes.map((type) => [type, type]),
          value: 'PatientSatisfaction',
        },

        // TODO: allow adding event filters here
      ],
    });
  },
};
