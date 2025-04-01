function boolToInt(bool?: boolean) {
  return bool ? 1 : 0;
}

function useKeyboard() {
  const keyset = new Map<string, boolean>();
  const released = new Set<string>();

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }

    keyset.set(event.code, true);
    released.delete(event.code);
  });

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    keyset.delete(event.code);
    released.add(event.code);
  });

  for (const type of ['blur', 'contextmenu']) {
    window.addEventListener(type, () => keyset.clear());
  }

  return {
    keyPressed(code: string) {
      return boolToInt(keyset.has(code));
    },

    keyDown(code: string) {
      const keydown = keyset.get(code);

      if (keydown) {
        keyset.set(code, false);
      }

      return boolToInt(keydown);
    },

    keyUp(code: string) {
      const keyup = released.has(code);

      if (keyup) {
        released.delete(code);
      }

      return boolToInt(keyup);
    },

    clear() {
      keyset.clear();
      released.clear();
    },
  };
}

export default useKeyboard;
