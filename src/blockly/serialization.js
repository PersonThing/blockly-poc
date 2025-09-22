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
    data = {"blocks":{"languageVersion":0,"blocks":[{"type":"define_wte","id":"!`Hq)6swo*_H7^9eP:Uy","x":49,"y":39,"fields":{"NAME":"bonuses"},"inputs":{"OUTPUT":{"block":{"type":"add","id":"|nGTY/U;q#WvFsNj1n_:","inputs":{"value_0":{"block":{"type":"conditional_number","id":"F4m3$~oRYv%g1Jodsu}l","inputs":{"CONDITION":{"block":{"type":"logic_compare","id":".9Ze5aUl|oOWh1]3n?~{","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"context_variable","id":"/[B]6[Gyg*.1rA+UkF-0","fields":{"VARIABLE_NAME":"wrvu"}}},"B":{"block":{"type":"context_variable","id":"$2{xTGQA/N0Um!PZnV$`","fields":{"VARIABLE_NAME":"wrvu_bonus_threshold"}}}}}},"TRUE_VALUE":{"block":{"type":"math_number","id":"5mGEzP`V^r,czO}jW6dd","fields":{"NUM":5}}},"FALSE_VALUE":{"block":{"type":"math_number","id":"GA_5d%%Q.LSu{M8GO]AP","fields":{"NUM":0}}}}}},"value_1":{"block":{"type":"conditional_number","id":"b7M+e8;-Vh%yVXooSvX7","inputs":{"CONDITION":{"block":{"type":"logic_compare","id":"tTO+C;A.S:+HCDv6)hIS","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"context_variable","id":"{UDuxjHUcA1QiQPUdo1b","fields":{"VARIABLE_NAME":"hours"}}},"B":{"block":{"type":"context_variable","id":"b.)6TGU]$Cj%I2#If+Az","fields":{"VARIABLE_NAME":"hour_bonus_threshold"}}}}}},"TRUE_VALUE":{"block":{"type":"math_number","id":"N.vWsI66U3b8x$S~PV_E","fields":{"NUM":1}}},"FALSE_VALUE":{"block":{"type":"math_number","id":"B3I@;NoFu13!qX3Mw;S$","fields":{"NUM":0}}}}}}}}}}},{"type":"define_wte","id":"iiPrX^k0G]:Op:|3zJgV","x":47,"y":504,"fields":{"NAME":"main"},"inputs":{"OUTPUT":{"block":{"type":"add","id":"G$hl?=EcBk1C6~*}FvuV","inputs":{"value_0":{"block":{"type":"context_variable","id":"T}}Eov#QL@.L{37VE(hJ","fields":{"VARIABLE_NAME":"base_pay"}}},"value_1":{"block":{"type":"add","id":"cin8S0MbpeDMr$n?@Esk","inputs":{"value_0":{"block":{"type":"call_wte","id":"n-33I`d{mhX+FR$Ce0.V","fields":{"NAME":"bonuses"}}},"value_1":{"block":{"type":"call_wte","id":"jDTxFJ+`=}Gf[#S=)Ctz","fields":{"NAME":"group_bonus"}}}}}}}}}}},{"type":"call_wte","id":"(`67%6wfxH)WNOb;{1JN","x":41,"y":766,"fields":{"NAME":"main"}},{"type":"define_wte","id":"mMy,)Xcy@S/,XY(qPEa`","x":49,"y":273,"fields":{"NAME":"group_bonus"},"inputs":{"OUTPUT":{"block":{"type":"conditional_number","id":"3=a$u[Xvfmv{A|4p%pVR","inputs":{"CONDITION":{"block":{"type":"logic_compare","id":"f[_3#o}QsQYp5~{R55#S","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"math_on_list","id":"gCJM0K0}q+#,3+NLg2$I","extraState":"<mutation op=\"AVERAGE\"></mutation>","fields":{"OP":"AVERAGE"},"inputs":{"LIST":{"block":{"type":"segment_frame","id":"pr_tYJJkJDid3n.(V).8","fields":{"NAME":"seg1","SEGMENT_ID":"5"},"inputs":{"OUTPUT":{"block":{"type":"context_variable","id":"!o*b^ot7DuCJn2Q;FGr/","fields":{"VARIABLE_NAME":"wrvu"}}}}}}}}},"B":{"block":{"type":"context_variable","id":"YNeGTf+pYS^Up_*meffU","fields":{"VARIABLE_NAME":"wrvu_bonus_threshold"}}}}}},"TRUE_VALUE":{"block":{"type":"math_number","id":"J}L`fB{:[p%C4;sQ-L?B","fields":{"NUM":0.5}}},"FALSE_VALUE":{"block":{"type":"math_number","id":"CE1?Uq)9)69Y7x1E8W}3","fields":{"NUM":0}}}}}}}}]}}
  }

  // Don't emit events during loading.
  if (data) {
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace, false);
    Blockly.Events.enable();
  }
};
