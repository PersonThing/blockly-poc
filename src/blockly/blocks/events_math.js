/*
  WTE_AVE_EVENTS + WTE_COUNT_EVENTS
  
  ** combined ave_events and count_events into 1 block and added min, max, sum, multiply
*/
import { DistinctEventTypes } from '../mock_data/sample_events.js';

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: 'events_math',
      output: 'Number',
      colour: 65,

      message0: '%1 of %2 events\nthat match filters [...]',
      args0: [
        // type of math to run
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
          value: 'COUNT',
        },

        // event type to filter for
        {
          type: 'field_dropdown',
          name: 'EVENT_TYPE',
          options: DistinctEventTypes.map(type => [type, type]),
          value: 'PatientSatisfaction',
        },

        // TODO: allow adding event filters here
      ],
    });
  },
};
