// this object is populated on page load from serialization.js, and updated when define_wte blocks are added or their names change
const wteNames = $state({});

const getWTEOptions = () => {
  if (Object.keys(wteNames).length === 0) {
    return [['<none>', '']];
  }
  return Object.values(wteNames).map((name) => [name, name]);
};

const call_wte = {
  init: function () {
    this.jsonInit({
      type: 'call_wte',
      message0: 'Call Custom WTE: %1\n(allow passing context overrides?)',
      args0: [
        {
          type: 'field_dropdown',
          name: 'NAME',
          options: () => getWTEOptions(),
          value: 'main',
        },
        // {
        //   type: 'field_input',
        //   name: 'NAME',
        //   text: 'wte1',
        // }
      ],
      colour: 300,
      tooltip: '',
      helpUrl: '',
      // previousStatement: null,
      // nextStatement: null,
      output: 'Number',
    });
  },

  saveExtraState: function () {
    return {
      name: this.getFieldValue('NAME'), // only saving to extra state so it will be forced to load on page load
    };
  },

  loadExtraState: function (state) {
    this.setFieldValue(state.name, 'NAME');
  },
};

const define_wte = {
  // generate an id based on timestamp
  init: function () {
    this.jsonInit({
      type: 'define_wte',
      message0: 'Define Custom WTE: %1 \nOutput %2',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'wte1',
        },
        {
          type: 'input_value',
          name: 'OUTPUT',
          check: 'Number',
        },
      ],
      colour: 300,
      tooltip: '',
      helpUrl: '',
    });
  },

  saveExtraState: function () {
    const name = this.getFieldValue('NAME');
    wteNames[this.id] = name;
    return null;
  },
};

export { define_wte, call_wte, wteNames };
