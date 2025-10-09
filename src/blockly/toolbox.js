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

import math_operations from './math_operations.js';

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
          type: 'define',
        },
        {
          kind: 'block',
          type: 'call',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Basics',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'context_variable',
        },

        {
          kind: 'block',
          type: 'events_value',
        },

        {
          kind: 'block',
          type: 'number',
          fields: {
            VALUE: 123,
          },
        },

        {
          kind: 'block',
          type: 'conditional_number',
          inputs: {
            LEFT: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 1,
                },
              },
            },
            RIGHT: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TRUE_VALUE: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 1,
                },
              },
            },
            FALSE_VALUE: {
              shadow: {
                type: 'number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },

        {
          kind: 'block',
          type: 'ratio_condition_true',
        },

        {
          kind: 'block',
          type: 'target_achieved',
        },

        {
          kind: 'block',
          type: 'target_achieved_excess',
        },
      ],
    },

    {
      kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      contents: [
        {
          kind: 'block',
          type: 'math',
        },
        {
          kind: 'block',
          type: 'array_math',
        },

        ...math_operations.map((op) => ({
          kind: 'block',
          type: op,
        })),
      ],
    },

    {
      kind: 'category',
      name: 'Tiers',
      categorystyle: 'text_category',
      contents: [
        {
          kind: 'block',
          type: 'tier_intersection',
          inputs: {
            INPUT: {
              shadow: {
                type: 'number',
                fields: {
                  VALUE: 1,
                },
              },
            },
            RETURN_VALUE_PRORATION: {
              shadow: {
                type: 'number',
                fields: {
                  VALUE: 1,
                },
              },
            },
            MIN_MAX_PRORATION: {
              shadow: {
                type: 'number',
                fields: {
                  VALUE: 1,
                },
              },
            },
          },
        },

        {
          kind: 'block',
          type: 'tier_overlap_multiply',
        },

        {
          kind: 'block',
          type: 'tier',
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
  ],
};
