/*
  WTE_MOST_RECENT_EVENTS

  ** added option for oldest instead of only most recent
  ** this could also be implemented as options in the events_math type dropdown: most recent value, oldest value

  ** note: original WTE name was misleading - it should be most_recent_event (singular) or most_recent_event_value
*/
import { DistinctEventTypes } from '../mock_data/sample_events.js';

export default {
  length: 0,
  init: function () {
    this.jsonInit({
      type: 'most_recent_events',
      output: 'Number',
      colour: 65,

      message0: '%1 %2 event\nthat match filters [...]',
      args0: [
        // whether to get most recent or oldest
        {
          type: 'field_dropdown',
          name: 'AGE',
          options: [
            ['Most Recent', 'MOST RECENT'],
            ['Oldest', 'OLDEST'],
          ],
          value: 'MOST RECENT',
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
