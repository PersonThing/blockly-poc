/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Custom WTEs',
      categorystyle: 'procedure_category',
      contents: [
        {
          kind: 'block',
          type: 'define_wte',
        },
        {
          kind: 'block',
          type: 'call_wte',
        },
      ],
    },
    {
      kind: 'category',
      name: 'System WTEs',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'context_variable',
        },

        // arrays
        {
          kind: 'block',
          type: 'make_array',
        },
        {
          kind: 'block',
          type: 'array_math',
        },
        {
          kind: 'block',
          type: 'ratio_condition_true',
        },

        // events
        {
          kind: 'block',
          type: 'events_math',
        },
        {
          kind: 'block',
          type: 'most_recent_events',
        },

        {
          kind: 'block',
          type: 'add',
        },
        {
          kind: 'block',
          type: 'subtract',
        },

        {
          kind: 'block',
          type: 'ratio',
        },

        {
          kind: 'block',
          type: 'target_achieved',
        },

        {
          kind: 'block',
          type: 'target_achieved_excess',
        },

        {
          kind: 'block',
          type: 'conditional_number',
        },
      ],
    },

    {
      kind: 'category',
      name: 'Frames',
      categorystyle: 'text_category',
      contents: [
        {
          kind: 'block',
          type: 'segment_frame',
        },
        {
          kind: 'block',
          type: 'recurrence_frame',
        },
        {
          kind: 'block',
          type: 'recurrence',
        },
        {
          kind: 'block',
          type: 'offset',
        },
      ],
    },

    {
      kind: 'category',
      name: 'Blockly built-in',
      categorystyle: 'logic_category',
      contents: [
        // basics + built-in stuff
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'logic_boolean',
        },
        {
          kind: 'block',
          type: 'logic_null',
        },
        {
          kind: 'block',
          type: 'logic_ternary',
        },
        {
          kind: 'block',
          type: 'math_number',
          fields: {
            NUM: 123,
          },
        },
        {
          kind: 'block',
          type: 'math_arithmetic',
          inputs: {
            A: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            B: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_single',
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 9,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_trig',
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 45,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_constant',
        },
        {
          kind: 'block',
          type: 'math_number_property',
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_round',
          fields: {
            OP: 'ROUND',
          },
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 3.1,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_on_list',
          fields: {
            OP: 'SUM',
          },
        },
        {
          kind: 'block',
          type: 'math_modulo',
          inputs: {
            DIVIDEND: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 64,
                },
              },
            },
            DIVISOR: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_constrain',
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 50,
                },
              },
            },
            LOW: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            HIGH: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_random_float',
        },
        {
          kind: 'block',
          type: 'math_atan2',
          inputs: {
            X: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            Y: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
      ],
    },

    // {
    //   kind: "category",
    //   name: "Variables",
    //   categorystyle: "variable_category",
    //   custom: "VARIABLE",
    // },
    // {
    //   kind: "category",
    //   name: "Functions",
    //   categorystyle: "procedure_category",
    //   custom: "PROCEDURE",
    // },
  ],
};
