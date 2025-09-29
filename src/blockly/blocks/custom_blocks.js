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
import makeArrayBlock from "./make_array.js";
import arrayMathBlock from "./array_math.js";
import eventsMathBlock from "./events_math.js";
import mostRecentEventsBlock from "./most_recent_events.js";

Blockly.Blocks['define_wte'] = defineWTE;
Blockly.Blocks['call_wte'] = callWTE;
Blockly.Blocks['add'] = addBlock;
Blockly.Blocks['subtract'] = subtractBlock;
Blockly.Blocks['make_array'] = makeArrayBlock;
Blockly.Blocks['offset'] = offsetBlock;
Blockly.Blocks['recurrence'] = recurrenceBlock;
Blockly.Blocks['recurrence_frame'] = recurrenceFrameBlock;
Blockly.Blocks['context_variable'] = contextVariableBlock;
Blockly.Blocks['conditional_number'] = conditionalNumberBlock;
Blockly.Blocks['segment_frame'] = segmentFrameBlock;
Blockly.Blocks['array_math'] = arrayMathBlock;
Blockly.Blocks['events_math'] = eventsMathBlock;
Blockly.Blocks['most_recent_events'] = mostRecentEventsBlock;