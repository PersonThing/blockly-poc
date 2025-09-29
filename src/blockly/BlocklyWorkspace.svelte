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
      style={{ display: tab === 'blockly' ? 'block' : 'none' }}
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
      {#each Object.keys(context) as key}
        <div class="inputItem">
          <label for={key}>{key}:</label>
          <input type="number" id={key} name={key} bind:value={context[key]} onkeyup={runCode} />
          <br />
        </div>
      {/each}
    </div>
    <div id="output">
      <h2>Output</h2>
      {#each outputLogs as log}
        <div class="logEntry">
          <pre>{JSON.stringify(log.result, null, 2)}</pre>
          <label>{log.label}</label>
          {#if log.meta}
            <pre class="logMeta">{JSON.stringify(log.meta, null, 2)}</pre>
          {/if}
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
  import { SampleEvents, DistinctEventTypes } from './mock_data/sample_events.js';
  import SampleSegments from './mock_data/sample_segments.js';

  let blocklyContainer;
  let generatedJs = $state('');
  let generatedJson = $state('');
  let outputLogs = $state([]);
  let context = $state({
    base_pay: 150000,
    wrvu: 400,
    wrvu_bonus_threshold: 200,
    hours: 40,
    hour_bonus_threshold: 20,
  });

  let tab = $state('blockly');
  let ws;

  onMount(() => {
    initBlockly();
  });

  function initBlockly() {
    ws = Blockly.inject(blocklyContainer, {
      toolbox,
      rtl: false,
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
    // Create some utility functions available to the eval environment
    const wteDefinitions = {}; // name -> function - created by define_wte blocks, called by call_wte blocks
    const defineWte = function (name, outputCallback) {
      wteDefinitions[name] = outputCallback;
    };
    const callWte = function (name, contextOverrides) {
      const wteFunc = wteDefinitions[name];
      if (wteFunc) {
        const context = { ...contextOverrides };
        return logAndReturn(`wte:${name}`, null, wteFunc(context));
      }
      console.error(`No WTE defined with name ${name}`);
      return logAndReturn('wte_error', { name }, `No WTE defined with name ${name}`, null);
    };

    // sampleEvents and segments - only referenced here to make explicitly available to eval()
    const sampleEvents = SampleEvents;
    const sampleSegments = SampleSegments;

    const executionLogs = [];
    // const flatten = (val) =>
    //   Array.isArray(val) ? val.reduce((acc, v) => acc + flatten(v), 0) : val;

    const logAndReturn = (label, meta, result) => {
      executionLogs.push({ label, meta, result });
      return result;
    };

    // execute a segment frame, calling outputCallback for each participant in the segment
    // outputCallback is expected to return a value for that participant
    // returns an array of results, one per participant
    // each result is logged with the participant name
    const executeSegmentFrame = function (name, segmentId, outputCallback) {
      const participants = sampleSegments[segmentId] || [];
      const executionContext = {
        ...context,
        participants,
      };
      return participants.map((p, i) =>
        logAndReturn(
          `segment_frame:${i + 1}:${p.name}`,
          { name, participant: p },
          outputCallback({
            ...executionContext,
            ...p,
          })
        )
      );
    };

    // execute a recurrence frame, calling outputCallback for each frame
    // outputCallback is expected to return a value for that frame
    // returns an array of results, one per frame
    // each result is logged with the frame start date
    const executeRecurrenceFrame = function (recurrence, offset, outputCallback) {
      const frames = [];
      const startDate = new Date(recurrence.window_start);
      const endDate = new Date(recurrence.window_end);
      const anchorDate = new Date(recurrence.anchor);
      let currentDate = new Date(anchorDate);

      // TODO: respect offset

      while (currentDate < endDate) {
        // if currentDate is within startDate and endDate, add a frame
        if (currentDate >= startDate && currentDate <= endDate) {
          frames.push({
            start: new Date(currentDate),
            end: new Date(currentDate), // for now, same as start
          });
        }

        // increment currentDate by recurrence.frequency and recurrence.interval
        switch (recurrence.frequency) {
          case 'DAY':
            currentDate.setDate(currentDate.getDate() + (recurrence.interval || 1));
            break;
          case 'WEEK':
            currentDate.setDate(currentDate.getDate() + 7 * (recurrence.interval || 1));
            break;
          case 'HALF_MONTH':
            currentDate.setDate(currentDate.getDate() + 15 * (recurrence.interval || 1));
            break;
          case 'MONTH':
            currentDate.setMonth(currentDate.getMonth() + (recurrence.interval || 1));
            break;
        }
      }

      return frames.map((frame, i) => {
        const date = new Date(frame.start).toISOString().split('T')[0];
        return logAndReturn(`recurrence_frame`, { date }, outputCallback(context));
      });
    };

    const getRatio = function (numerator, denominator) {
      if (denominator === 0) return 0;
      return numerator / denominator;
    };

    const isConditionMet = function (item, type, value) {
      switch (type) {
        case 'equals':
          return item === value;
        case 'not_equals':
          return item !== value;
        case 'greater_than':
          return item > value;
        case 'less_than':
          return item < value;
        case 'greater_than_or_equals':
          return item >= value;
        case 'lesser_than_or_equals':
          return item <= value;
        default:
          console.error(`Unknown condition type: ${type}`);
          return false;
      }
    };

    const getRatioConditionTrue = function (array, conditions) {
      if (!Array.isArray(array) || array.length === 0) return 0;

      const countTrue = array.reduce((acc, item) => {
        let conditionMet = false;
        for (const condition of conditions) {
          const { type, value } = condition;
          if (type) {
            conditionMet = isConditionMet(item, type, value);
          }
        }
        return acc + (conditionMet ? 1 : 0);
      }, 0);

      return logAndReturn(
        `ratio_condition_true:${countTrue}/${array.length}`,
        { array, conditions },
        countTrue / array.length
      );
    };

    const getTargetAchieved = function (params) {
      const {
        input,
        target,
        target_compare,
        return_value,
        target_proration = 1,
        return_value_proration = 1,
      } = params;
      let adjustedTarget = target * target_proration;
      let achieved = isConditionMet(input, target_compare, adjustedTarget);
      let adjustedReturnValue = return_value * return_value_proration;
      return logAndReturn(
        `target_achieved:${achieved}`,
        { input, adjustedTarget },
        achieved ? adjustedReturnValue : 0
      );
    };

    const getTargetAchievedExcess = function (params) {
      const {
        input,
        target,
        target_compare,
        return_value,
        target_proration = 1,
        return_value_proration = 1,
      } = params;
      let adjustedTarget = target * target_proration;
      let achieved = isConditionMet(input, target_compare, adjustedTarget);
      if (!achieved) {
        return logAndReturn(`target_achieved_excess:false`, { ...params, adjustedTarget }, 0);
      }
      // TODO: does backend handle cases of less than ? eg, 50 < 100.. excess should be 50?
      // using Math.abs() for now in case we should
      let excess = Math.abs(input - adjustedTarget);
      let excessValue = excess * return_value;
      let adjustedReturnValue = excessValue * return_value_proration;
      return logAndReturn(
        `target_achieved_excess:true`,
        {
          ...params,
          adjustedTarget,
          excess,
          excessValue,
          adjustedReturnValue,
        },
        adjustedReturnValue
      );
    };

    generatedJs = javascriptGenerator.workspaceToCode(ws);

    try {
      eval(generatedJs);
    } catch (e) {
      console.error('Error during generated code execution', e);
    }

    outputLogs = executionLogs.reverse();

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
</script>
