/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { wteNames } from './blocks/custom_wte.svelte.js';
import SampleBlocks from './mock_data/sample_blocks.js';

const storageKey = 'mainWorkspace';

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
    data = structuredClone(SampleBlocks);
  }

  // Don't emit events during loading.
  if (data) {
    // set wte names from define_wte blocks at the root
    if (data.blocks && data.blocks.blocks) {
      for (const block of data.blocks.blocks) {
        if (block.type === 'define_wte' && block.fields && block.fields.NAME) {
          wteNames[block.id] = block.fields.NAME;
        }
      }
    }

    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace, false);
    Blockly.Events.enable();
  }
};
