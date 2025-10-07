import context from '../context.svelte.js';

export default {
  init: function () {
    this.jsonInit({
      type: 'number',
      message0: '# %1',
      args0: [
        {
          type: 'field_number',
          name: 'VALUE',
          value: 0,
        },
      ],
      output: 'Number',
      colour: 200,
    });
  },
};
