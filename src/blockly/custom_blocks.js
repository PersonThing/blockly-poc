import * as Blockly from "blockly/core";
import './blocks/FieldTextButton.js'
import { define_wte, call_wte } from "./blocks/custom_wte.svelte.js";
Blockly.Blocks['call_wte'] = call_wte;
Blockly.Blocks['define_wte'] = define_wte;

import add from "./blocks/add.js";
Blockly.Blocks['add'] = add;

import array_math from "./blocks/array_math.js";
Blockly.Blocks['array_math'] = array_math;

import conditional_number from "./blocks/conditional_number.js";
Blockly.Blocks['conditional_number'] = conditional_number;

import context_variable from "./blocks/context_variable.js";
Blockly.Blocks['context_variable'] = context_variable;

import events_math from "./blocks/events_math.js";
Blockly.Blocks['events_math'] = events_math;

import make_array from "./blocks/make_array.js";
Blockly.Blocks['make_array'] = make_array;

import most_recent_events from "./blocks/most_recent_events.js";
Blockly.Blocks['most_recent_events'] = most_recent_events;

import offset from "./blocks/offset.js";
Blockly.Blocks['offset'] = offset;

import ratio from "./blocks/ratio.js";
Blockly.Blocks['ratio'] = ratio;

import ratio_condition_true from "./blocks/ratio_condition_true.js";
Blockly.Blocks['ratio_condition_true'] = ratio_condition_true;

import recurrence from "./blocks/recurrence.js";
Blockly.Blocks['recurrence'] = recurrence;

import recurrence_frame from "./blocks/recurrence_frame.js";
Blockly.Blocks['recurrence_frame'] = recurrence_frame;

import segment_frame from "./blocks/segment_frame.js";
Blockly.Blocks['segment_frame'] = segment_frame;

import subtract from "./blocks/subtract.js";
Blockly.Blocks['subtract'] = subtract;

import target_achieved from "./blocks/target_achieved.js";
Blockly.Blocks['target_achieved'] = target_achieved;

import target_achieved_excess from "./blocks/target_achieved_excess.js";
Blockly.Blocks['target_achieved_excess'] = target_achieved_excess;

import tier_intersection from "./blocks/tier_intersection.js";
Blockly.Blocks['tier_intersection'] = tier_intersection;

import tier_intersection_multiply from "./blocks/tier_intersection_multiply.js";
Blockly.Blocks['tier_intersection_multiply'] = tier_intersection_multiply;