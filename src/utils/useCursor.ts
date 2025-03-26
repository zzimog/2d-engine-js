type CursorPosition = {
  x: number;
  y: number;
  active: boolean;
};

type CursorTarget = HTMLElement | Window;

function useCursor(target: CursorTarget = window) {
  const position: CursorPosition = {
    x: 0,
    y: 0,
    active: false,
  };

  target.addEventListener('mousemove', (event: Event) => {
    if (event instanceof MouseEvent) {
      const { clientX, clientY } = event;

      position.x = clientX;
      position.y = clientY;
      position.active = true;
    }
  });

  target.addEventListener('mouseleave', () => {
    position.active = false;
  });

  return position;
}

export default useCursor;
