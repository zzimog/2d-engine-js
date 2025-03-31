function useKeyboard() {
  const keyset = new Set();

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    keyset.add(event.code);
  });

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    keyset.delete(event.code);
  });

  return {
    keyPressed(code: string) {
      return keyset.has(code) ? 1 : 0;
    },
  };
}

export default useKeyboard;
