export function persistentState(key, initial) {
  let value = $state(load());

  function load() {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  }

  // helper: persist on every mutation
  function save() {
    localStorage.setItem(key, JSON.stringify($state.snapshot(value)));
  }

  // monkeypatch: whenever any property changes, save
  return new Proxy(value, {
    set(target, prop, newVal) {
      target[prop] = newVal;
      save();
      return true;
    },
    deleteProperty(target, prop) {
      delete target[prop];
      save();
      return true;
    }
  });
}