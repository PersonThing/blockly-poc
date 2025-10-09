// a simple block with key, condition, value inputs
// use the same compare_options we used in conditional_number.js

import compare_options from '../compare_options';

export default {
  init: function () {
    this.jsonInit({
      type: 'events_filter',
      message0: 'Event Filter \nKey %1 \nCondition %2 \nValue %3',
      args0: [
        {
          type: 'field_input',
          name: 'KEY',
          text: 'event_key',
        },
        {
          type: 'field_dropdown',
          name: 'CONDITION',
          options: compare_options.map((option) => [option, option]),
          value: 'equals',
        },
        {
          type: 'field_input',
          name: 'VALUE',
          text: 'event_value',
          // TODO: ideally this would be able to accept WTE inputs, not just fixed values, but backend only allows fixed values anyway
        },
      ],
      colour: 1000,
      tooltip: '',
      output: 'EventFilter',
    });
  },
};
