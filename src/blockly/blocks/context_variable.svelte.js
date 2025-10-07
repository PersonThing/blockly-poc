import context from '../context.svelte.js';

export default {
  init: function () {
    this.jsonInit({
      type: 'context_variable',
      message0: '~ %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'VARIABLE_NAME',
          check: 'Number',
          options: () =>
            Object.keys(context)
              .sort()
              .map((key) => [key, key]),
          defaultValue: 'output', // Uncomment if you want a default value
        },
      ],
      output: 'Number',
      colour: 160,
    });
  },
};
