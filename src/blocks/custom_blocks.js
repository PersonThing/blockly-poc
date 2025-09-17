import * as Blockly from "blockly/core";


import './FieldTextButton.js'
import defineWte from "./define_wte.js";
import callWte from "./call_wte.js";
import addBlock from "./add.js";
import subtractBlock from "./subtract.js";
import multiplyBlock from "./multiply.js";
import divideBlock from "./divide.js";
import offsetBlock from "./offset.js";
import recurrenceBlock from "./recurrence.js";
import recurrenceFrameBlock from "./recurrence_frame.js";
import segmentFrameBlock from "./segment_frame.js";
import contextVariableBlock from "./context_variable.js";
import conditionalNumberBlock from "./conditional_number.js";

Blockly.Blocks['define_wte'] = defineWte;
Blockly.Blocks['call_wte'] = callWte;
Blockly.Blocks['add'] = addBlock;
Blockly.Blocks['subtract'] = subtractBlock;
Blockly.Blocks['multiply'] = multiplyBlock;
Blockly.Blocks['divide'] = divideBlock;
Blockly.Blocks['offset'] = offsetBlock;
Blockly.Blocks['recurrence'] = recurrenceBlock;
Blockly.Blocks['recurrence_frame'] = recurrenceFrameBlock;
Blockly.Blocks['context_variable'] = contextVariableBlock;
Blockly.Blocks['conditional_number'] = conditionalNumberBlock;
Blockly.Blocks['segment_frame'] = segmentFrameBlock;