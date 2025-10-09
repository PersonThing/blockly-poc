import * as Blockly from 'blockly/core';
import './blocks/FieldTextButton.js';
import { define, call } from './blocks/custom_wte.svelte.js';
Blockly.Blocks['call'] = call;
Blockly.Blocks['define'] = define;

import array_math from './blocks/array_math.js';
Blockly.Blocks['array_math'] = array_math;

import conditional_number from './blocks/conditional_number.js';
Blockly.Blocks['conditional_number'] = conditional_number;

import context_variable from './blocks/context_variable.svelte.js';
Blockly.Blocks['context_variable'] = context_variable;

import events_value from './blocks/events_value.js';
Blockly.Blocks['events_value'] = events_value;

import events_filter from './blocks/events_filter.js';
Blockly.Blocks['events_filter'] = events_filter;

import { sum, subtract, multiply, divide, min, max, average, count, math } from './blocks/math.js';
Blockly.Blocks['sum'] = sum;
Blockly.Blocks['subtract'] = subtract;
Blockly.Blocks['multiply'] = multiply;
Blockly.Blocks['divide'] = divide;
Blockly.Blocks['min'] = min;
Blockly.Blocks['max'] = max;
Blockly.Blocks['average'] = average;
Blockly.Blocks['count'] = count;
Blockly.Blocks['math'] = math;

import number from './blocks/number.js';
Blockly.Blocks['number'] = number;

import offset from './blocks/offset.js';
Blockly.Blocks['offset'] = offset;

import ratio_condition_true from './blocks/ratio_condition_true.js';
Blockly.Blocks['ratio_condition_true'] = ratio_condition_true;

import recurrence from './blocks/recurrence.js';
Blockly.Blocks['recurrence'] = recurrence;

import recurrence_frame from './blocks/recurrence_frame.js';
Blockly.Blocks['recurrence_frame'] = recurrence_frame;

import segment_frame from './blocks/segment_frame.js';
Blockly.Blocks['segment_frame'] = segment_frame;

import target_achieved from './blocks/target_achieved.js';
Blockly.Blocks['target_achieved'] = target_achieved;

import target_achieved_excess from './blocks/target_achieved_excess.js';
Blockly.Blocks['target_achieved_excess'] = target_achieved_excess;

import tier_intersection from './blocks/tier_intersection.js';
Blockly.Blocks['tier_intersection'] = tier_intersection;

import tier_overlap_multiply from './blocks/tier_overlap_multiply.js';
Blockly.Blocks['tier_overlap_multiply'] = tier_overlap_multiply;

import tier from './blocks/tier.js';
Blockly.Blocks['tier'] = tier;
