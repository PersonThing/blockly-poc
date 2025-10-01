import { persistentState } from "./persistent-state.svelte.js";

export const context = persistentState("context_variables", {
  // default context variables... UI allows editing / adding to it
  base_pay: 150000,
  clinical_fte: 0.1,
  hour_bonus_threshold: 20,
  hours: 40,
  wrvu_bonus_threshold: 200,
  wrvu: 400,
});

export default context;
