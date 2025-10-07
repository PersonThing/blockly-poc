<div id="pageContainer">
  <div id="contentPane">
    <div id="tabs">
      <button onclick={() => (tab = 'blockly')} class:active={tab === 'blockly'}
        >Visual Editor</button
      >
      <button onclick={() => (tab = 'json')} class:active={tab === 'json'}>JSON</button>
      <button onclick={() => (tab = 'js')} class:active={tab === 'js'}>JS</button>
    </div>

    <div
      id="blocklyContainer"
      bind:this={blocklyContainer}
      style="display: {tab === 'blockly' ? 'block' : 'none'}"
    ></div>

    {#if tab === 'json'}
      <pre id="generatedCode">{generatedJson}</pre>
    {:else if tab === 'js'}
      <pre id="generatedCode">{generatedJs}</pre>
    {/if}
  </div>
  <div id="inputOutputPane">
    <div id="input">
      <h2>Input</h2>
      <BlocklyWorkspaceContext {runCode} />
    </div>
    <div id="output">
      <button onclick={toggleBlockTypeFilters} style="float: right;"> Log filters </button>
      <h2>Output</h2>

      <div class="blockTypeFilters" style="display: {showBlockTypeFilters ? 'block' : 'none'}">
        <button onclick={() => (selectedBlockTypes = [...blockTypes])}>Check all</button>
        <button onclick={() => (selectedBlockTypes = [])}>Uncheck all</button>
        {#each blockTypes as blockType}
          <label>
            <input type="checkbox" bind:group={selectedBlockTypes} value={blockType} />
            {blockType}
          </label>
        {/each}
      </div>

      {#each filteredOutputLogs as log}
        <div class="logEntry">
          <label>{log.label}</label>
          {#if log.meta}
          <pre class="logMeta">{JSON.stringify(log.meta, null, 2)}</pre>
          {/if}
          <pre>{JSON.stringify(log.result, null, 2)}</pre>
        </div>
      {/each}
    </div>
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { FieldDate } from '@blockly/field-date';
  import './custom_blocks.js';
  import javascriptGenerator from './generators/javascript.js';
  import jsonGenerator from './generators/json';
  import { save, load } from './serialization.js';
  import { toolbox } from './toolbox.js';
  import './BlocklyWorkspace.svelte.css';
  import wtes from './wtes.js';
  import BlocklyWorkspaceContext from './BlocklyWorkspace.Context.svelte';
  import context from './context.svelte.js';

  let blocklyContainer;
  let generatedJs = $state('');
  let generatedJson = $state('');
  let outputLogs = $state([]);

  let tab = $state('blockly');
  let ws;

  // all the custom block types - probably a simpler way to filter out built-in blocks
  let blockTypes = $state(
    Object.keys(Blockly.Blocks)
      .filter(
        (key) =>
          !key.startsWith('text_') &&
          !key.startsWith('math_') &&
          !key.startsWith('logic_') &&
          !key.startsWith('controls_') &&
          !key.startsWith('lists_') &&
          !key.startsWith('procedures_') &&
          !key.startsWith('variables')
      )
      .sort()
  );

  let selectedBlockTypes = $state([...blockTypes]);

  let filteredOutputLogs = $derived(
    outputLogs.filter((log) => {
      const logStart = log.label.split(':')[0];
      return selectedBlockTypes.includes(logStart) || !blockTypes.includes(logStart); // include logs not associated with a block type - all should be, but in case someone typo's
    })
  );

  onMount(() => {
    initBlockly();
  });

  function initBlockly() {
    ws = Blockly.inject(blocklyContainer, {
      toolbox,
      rtl: false,
      grid: {spacing: 20, length: 3, colour: '#ccc', snap: true},
    });

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
      if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
        return;
      }
      runCode();
    });
  }

  // This function resets the code and output divs, shows the
  // generated code from the workspace, and evals the code.
  // In a real application, you probably shouldn't use `eval`.
  const runCode = () => {
    // generate js and attempt to run it
    generatedJs = javascriptGenerator.workspaceToCode(ws);
    outputLogs = wtes.tryRun(generatedJs, context);

    // generate json from blocks
    let json = jsonGenerator.fromWorkspace(ws);
    try {
      const parsed = JSON.parse('[' + json + ']');
      json = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error('Unable to parse JSON', e, json);
    }
    generatedJson = json;
  };

  let showBlockTypeFilters = $state(false);
  const toggleBlockTypeFilters = () => {
    showBlockTypeFilters = !showBlockTypeFilters;
  };
</script>
