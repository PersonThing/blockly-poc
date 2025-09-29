import * as Blockly from "blockly/core";
import './blocks/FieldTextButton.js'
import { defineWTE, callWTE } from "./blocks/custom_wte.svelte.js";
Blockly.Blocks['call_wte'] = callWTE;
Blockly.Blocks['define_wte'] = defineWTE;

import addBlock from "./blocks/add.js";
Blockly.Blocks['add'] = addBlock;

import arrayMathBlock from "./blocks/array_math.js";
Blockly.Blocks['array_math'] = arrayMathBlock;

import conditionalNumberBlock from "./blocks/conditional_number.js";
Blockly.Blocks['conditional_number'] = conditionalNumberBlock;

import contextVariableBlock from "./blocks/context_variable.js";
Blockly.Blocks['context_variable'] = contextVariableBlock;

import eventsMathBlock from "./blocks/events_math.js";
Blockly.Blocks['events_math'] = eventsMathBlock;

import makeArrayBlock from "./blocks/make_array.js";
Blockly.Blocks['make_array'] = makeArrayBlock;

import mostRecentEventsBlock from "./blocks/most_recent_events.js";
Blockly.Blocks['most_recent_events'] = mostRecentEventsBlock;

import offsetBlock from "./blocks/offset.js";
Blockly.Blocks['offset'] = offsetBlock;

import ratioBlock from "./blocks/ratio.js";
Blockly.Blocks['ratio'] = ratioBlock;

import ratioConditionTrueBlock from "./blocks/ratio_condition_true.js";
Blockly.Blocks['ratio_condition_true'] = ratioConditionTrueBlock;

import recurrenceBlock from "./blocks/recurrence.js";
Blockly.Blocks['recurrence'] = recurrenceBlock;

import recurrenceFrameBlock from "./blocks/recurrence_frame.js";
Blockly.Blocks['recurrence_frame'] = recurrenceFrameBlock;

import segmentFrameBlock from "./blocks/segment_frame.js";
Blockly.Blocks['segment_frame'] = segmentFrameBlock;

import subtractBlock from "./blocks/subtract.js";
Blockly.Blocks['subtract'] = subtractBlock;
