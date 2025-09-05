/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { FieldDate } from "@blockly/field-date";
import "./blocks/custom_blocks";
import javascriptGenerator from "./generators/javascript";
import jsonGenerator from "./generators/json";
import { save, load } from "./serialization";
import { toolbox } from "./toolbox";
import "./index.css";

// Set up UI elements and inject Blockly
const jsContainer = document.getElementById("generatedJs");
const jsonTextarea = document.getElementById("generatedJson");
const blocklyDiv = document.getElementById("blocklyDiv");
const ws = Blockly.inject(blocklyDiv, {
  toolbox,
  rtl: false,
});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  // generate javascript from blocks
  // when editing, we should see all available context variables/list data, be able to adjust them, and set preview values for them
  // for now, we're using a few sample values to inject at the start of execution to allow users to test formula/s etc
  const code =
    `
const context = {
  output: 0,
  base_pay: 150000,
  wrvu: 500,
  hours: 40
}

` + javascriptGenerator.workspaceToCode(ws);

  jsContainer.innerText = code;

  // eval(code);

  // generate json from blocks
  // this is what our APIs will persist
  let json = jsonGenerator.fromWorkspace(ws);

  // parse and format it
  try {
    const parsed = JSON.parse("[" + json + "]");
    json = JSON.stringify(parsed, null, 2);
  } catch (e) {
    // ignore
    console.error("Unable to parse JSON", e, json);
  }

  jsonTextarea.value = json;
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  runCode();
});
