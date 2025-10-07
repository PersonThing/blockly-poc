import { persistentState } from "./persistent-state.svelte.js";
import { sampleContext } from './mock_data/sample_blocks.js';
export default persistentState("context_variables", sampleContext);
