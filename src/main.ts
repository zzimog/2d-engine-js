import Engine from './Engine';
import Entity from './Entity';
import loadImage from './utils/loadImage';
import useCursor from './utils/useCursor';

const canvas = document.getElementById('mainframe')! as HTMLCanvasElement;

const Cursor = useCursor(canvas);

const imageCursor = await loadImage('./diamond_sword.png');
const imageScream = await loadImage('./scream.jpg');

const engine = new Engine(canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  FPS: 75,
  HIDE_CURSOR: true,
});

const entityRect = new Entity()
  .setColor('green')
  .setSize(300, 150)
  .setPosition(600, 300);

engine.render((ctx, renderObj) => {
  const { currentFrame, fps, viewport } = renderObj;

  // disable images scaling antialiasing
  ctx.imageSmoothingEnabled = false;

  // clear the screen
  ctx.clearRect(0, 0, viewport.width, viewport.height);

  // scream painting image
  ctx.drawImage(imageScream, 130, 30);

  // line: begin
  ctx.beginPath();
  // line: set start point
  ctx.moveTo(300, 550);
  // line: draw first line
  ctx.lineTo(900, 800);
  // line: draw second line
  ctx.lineTo(900, 700);
  // line: render the line
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'yellow';
  ctx.stroke();

  // line: (again) set start point
  ctx.beginPath();
  ctx.moveTo(300, 550);
  // line: draw last line
  ctx.lineTo(900, 700);
  // line: render the line
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'blue';
  ctx.stroke();

  entityRect.draw(ctx);

  // fps: black box
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 135, 24);
  // fps: text
  ctx.fillStyle = 'yellow';
  ctx.font = '24px Consolas, monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`FPS: ${fps}`, 0, 0);

  // frame counter: black box
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 25, 122, 24);
  // frame counter: text
  ctx.fillStyle = 'yellow';
  ctx.font = '24px Consolas, monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Frame: ${currentFrame}`, 0, 25);

  if (Cursor.active) {
    ctx.drawImage(
      imageCursor,
      Cursor.x,
      Cursor.y,
      imageCursor.width * 4,
      imageCursor.height * 4
    );
  }
});

window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  engine.resize(innerWidth, innerHeight);
});

/**
 * @experimental
 * entityRect movement with arrow keys
 */
window.addEventListener('keydown', (event: Event) => {
  if (event instanceof KeyboardEvent) {
    const { code, repeat } = event;
    const SPEED = 10;

    console.log(code, repeat);

    if (!entityRect.position) {
      return;
    }

    const nextPosition = { ...entityRect.position };
    const directions: Record<string, Function> = {
      ArrowUp: () => (nextPosition.y += -1 * SPEED),
      ArrowLeft: () => (nextPosition.x += -1 * SPEED),
      ArrowDown: () => (nextPosition.y += SPEED),
      ArrowRight: () => (nextPosition.x += SPEED),
    };

    directions[code]?.call(null);
    entityRect.position = nextPosition;
  }
});

/**
 * @experimental
 * mouse click on entityRect to change color to random
 */
window.addEventListener('click', (event: Event) => {
  if (event instanceof MouseEvent) {
    if (entityRect.visible && entityRect.isInBound(Cursor)) {
      const r = Math.random() * 0xff;
      const g = Math.random() * 0xff;
      const b = Math.random() * 0xff;

      entityRect.setColor(`rgb(${r}, ${g}, ${b})`);
    }
  }
});
