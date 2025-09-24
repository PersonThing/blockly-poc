const wteNames = {};

const getWTENames = () => [
  ['a', 'a'],
  ...Object.keys(wteNames).map(key => [wteNames[key], wteNames[key]])
];

const callWTE = {
  init: function () {
    this.jsonInit({
      type: "call_wte",
      message0: "Call Custom WTE: %1\n(allow passing context overrides?)",
      args0: [
        {
          type: "field_dropdown",
          name: "NAME",
          options: () => getWTENames(),
          value: ""
        },
      ],
      colour: 300,
      tooltip: "",
      helpUrl: "",
      // previousStatement: null,
      // nextStatement: null,
      output: "Number",
    });
  }
};

const defineWTE = {
  // generate an id based on timestamp
  id: `define_wte_${Date.now()}`,

  init: function () {
    this.jsonInit({
      type: "define_wte",
      message0: "Define Custom WTE: %1 \nOutput %2",
      args0: [
        {
          type: "field_input",
          name: "NAME",
          text: "wte1",
        },
        {
          type: "input_value",
          name: "OUTPUT",
          check: "Number",
        },
      ],
      colour: 300,
      tooltip: "",
      helpUrl: "",
    });
  },

  saveExtraState: function() {
    // when name changes, update wteNames map
    wteNames[this.id] = this.getFieldValue('NAME');
    console.log('define_wte saveExtraState', wteNames);
    return null;
  },

  loadExtraState: function(state) {
    // on load, add this WTE to the wteNames map
    wteNames[this.id] = this.getFieldValue('NAME');
    console.log('define_wte loadExtraState', wteNames);
  }
};


export { defineWTE, callWTE };