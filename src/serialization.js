/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

const storageKey = "mainWorkspace";

/**
 * Saves the state of the workspace to browser's local storage.
 * @param {Blockly.Workspace} workspace Blockly workspace to save.
 */
export const save = function (workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param {Blockly.Workspace} workspace Blockly workspace to load into.
 */
export const load = function (workspace) {
  let data = window.localStorage?.getItem(storageKey);
  if (data) {
    data = JSON.parse(data);
  }
  if (!data) {
    data = {"blocks":{"languageVersion":0,"blocks":[{"type":"define_wte","id":"!`Hq)6swo*_H7^9eP:Uy","x":39,"y":23,"fields":{"NAME":"bonuses"},"inputs":{"OUTPUT":{"block":{"type":"add","id":"|nGTY/U;q#WvFsNj1n_:","inputs":{"value_0":{"block":{"type":"conditional_number","id":"F4m3$~oRYv%g1Jodsu}l","inputs":{"CONDITION":{"block":{"type":"logic_compare","id":".9Ze5aUl|oOWh1]3n?~{","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"context_variable","id":"/[B]6[Gyg*.1rA+UkF-0","fields":{"VARIABLE_NAME":"wrvu"}}},"B":{"block":{"type":"context_variable","id":"$2{xTGQA/N0Um!PZnV$`","fields":{"VARIABLE_NAME":"wrvu_bonus_threshold"}}}}}},"TRUE_VALUE":{"block":{"type":"math_number","id":"5mGEzP`V^r,czO}jW6dd","fields":{"NUM":5000}}},"FALSE_VALUE":{"block":{"type":"math_number","id":"GA_5d%%Q.LSu{M8GO]AP","fields":{"NUM":0}}}}}},"value_1":{"block":{"type":"conditional_number","id":"b7M+e8;-Vh%yVXooSvX7","inputs":{"CONDITION":{"block":{"type":"logic_compare","id":"tTO+C;A.S:+HCDv6)hIS","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"context_variable","id":"{UDuxjHUcA1QiQPUdo1b","fields":{"VARIABLE_NAME":"hours"}}},"B":{"block":{"type":"context_variable","id":"b.)6TGU]$Cj%I2#If+Az","fields":{"VARIABLE_NAME":"hour_bonus_threshold"}}}}}},"TRUE_VALUE":{"block":{"type":"math_number","id":"N.vWsI66U3b8x$S~PV_E","fields":{"NUM":5000}}},"FALSE_VALUE":{"block":{"type":"math_number","id":"B3I@;NoFu13!qX3Mw;S$","fields":{"NUM":0}}}}}}}}}}},{"type":"define_wte","id":"iiPrX^k0G]:Op:|3zJgV","x":41,"y":270,"fields":{"NAME":"main"},"inputs":{"OUTPUT":{"block":{"type":"add","id":"z0S%/;$wfGo#km(+k4I1","inputs":{"value_0":{"block":{"type":"context_variable","id":"T}}Eov#QL@.L{37VE(hJ","fields":{"VARIABLE_NAME":"base_pay"}}},"value_1":{"block":{"type":"segment_frame","id":"GO/HZxM{;LLgrLlD+[K7","fields":{"NAME":"seg1","SEGMENT_ID":4},"inputs":{"OUTPUT":{"block":{"type":"call_wte","id":"St:oE?@M1RT3%`nYGJ-b","fields":{"NAME":"bonuses"}}}}}}}}}}},{"type":"call_wte","id":"(`67%6wfxH)WNOb;{1JN","x":43,"y":571,"fields":{"NAME":"main"}}]}};
  }

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(data, workspace, false);
  Blockly.Events.enable();
};
