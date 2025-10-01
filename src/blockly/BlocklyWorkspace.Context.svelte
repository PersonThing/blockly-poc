{#each Object.keys(context) as key}
  <div class="inputItem">
    <label for={key}>{key}:</label>
    <input type="number" id={key} name={key} bind:value={context[key]} onkeyup={runCode} />
    <button onclick={() => { delete context[key]; runCode(); }}>x</button>
  </div>
{/each}

<div class="inputItem">
  <label>
    <button onclick={addItem}>+ Add context variable</button>
  </label>
</div>

<script>
  import context from './context.svelte.js';
  let { runCode = () => {} } = $props();

  function addItem() {
    const newKey = prompt('Enter the name of the new context variable:');
    if (newKey && !context.hasOwnProperty(newKey)) {
      context[newKey] = 0;
      runCode();
    } else if (context.hasOwnProperty(newKey)) {
      alert('This variable already exists.');
    }
  }
</script>

<style>
  button {
    padding: 2px 6px;
  }
</style>