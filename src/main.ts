import Engine, { EngineRenderInfo } from './Engine';
import Entity from './entities/Entity';
import FrameMeter from './entities/FrameMeter';
import loadImage from './utils/loadImage';
import useCursor from './utils/useCursor';

const canvas = document.getElementById('mainframe')! as HTMLCanvasElement;

const Cursor = useCursor(canvas);

const engine = new Engine(canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  VSYNC: true,
  FPS: 75,
  HIDE_CURSOR: true,
});

const imageCursor = await loadImage('./diamond_sword.png');
//const imageScream = await loadImage('./scream.jpg');

const entityFrameMeter = new FrameMeter(engine);
const entityRect = new Entity(engine)
  .setColor('green')
  .setSize(300, 150)
  .setPosition(600, 300);

const entityMouseFollower = new Entity(engine).setColor('red').setSize(50, 50);

engine.render((renderInfo: EngineRenderInfo) => {
  const { fps, currentFrame } = renderInfo;

  entityRect.draw();

  entityMouseFollower.draw();

  entityFrameMeter.update(fps, currentFrame);
  entityFrameMeter.draw();

  if (Cursor.active) {
    engine.ctx.drawImage(
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

/**
 * @experimental
 * move entityMouseFollower on mousemove event
 */
window.addEventListener('mousemove', (event: Event) => {
  if (event instanceof MouseEvent) {
    const { size } = entityMouseFollower;

    const newPosition = {
      x: Cursor.x - size.width / 2,
      y: Cursor.y - size.height / 2,
    };

    const source = {
      x1: newPosition!.x,
      x2: newPosition!.x + size.width,
      y1: newPosition!.y,
      y2: newPosition!.y + size.height,
    };

    const target = {
      x1: entityRect.position!.x,
      x2: entityRect.position!.x + entityRect.size.width,
      y1: entityRect.position!.y,
      y2: entityRect.position!.y + entityRect.size.height,
    };

    entityMouseFollower.setPosition(newPosition.x, newPosition.y);
  }
});
