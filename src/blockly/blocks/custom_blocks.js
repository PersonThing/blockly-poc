import * as Blockly from "blockly/core";

import './FieldTextButton.js'
import { defineWTE, callWTE } from "./custom_wte.svelte.js";
import addBlock from "./add.js";
import subtractBlock from "./subtract.js";
import offsetBlock from "./offset.js";
import recurrenceBlock from "./recurrence.js";
import recurrenceFrameBlock from "./recurrence_frame.js";
import segmentFrameBlock from "./segment_frame.js";
import contextVariableBlock from "./context_variable.js";
import conditionalNumberBlock from "./conditional_number.js";

Blockly.Blocks['define_wte'] = defineWTE;
Blockly.Blocks['call_wte'] = callWTE;
Blockly.Blocks['add'] = addBlock;
Blockly.Blocks['subtract'] = subtractBlock;
Blockly.Blocks['offset'] = offsetBlock;
Blockly.Blocks['recurrence'] = recurrenceBlock;
Blockly.Blocks['recurrence_frame'] = recurrenceFrameBlock;
Blockly.Blocks['context_variable'] = contextVariableBlock;
Blockly.Blocks['conditional_number'] = conditionalNumberBlock;
Blockly.Blocks['segment_frame'] = segmentFrameBlock;
