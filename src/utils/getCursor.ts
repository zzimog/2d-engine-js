type CursorPosition = {
  x: number | null;
  y: number | null;
};

type CursorTarget = HTMLElement | Window;

function getCursor(target: CursorTarget = window) {
  const position: CursorPosition = {
    x: null,
    y: null,
  };

  target.addEventListener('mousemove', (event: Event) => {
    if (event instanceof MouseEvent) {
      const { clientX, clientY } = event;

      position.x = clientX;
      position.y = clientY;
    }
  });

  target.addEventListener('mouseleave', () => {
    position.x = null;
    position.y = null;
  });

  return position;
}

export default getCursor;
