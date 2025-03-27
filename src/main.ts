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
  HIDE_CURSOR: true,
});

const imageCursor = await loadImage('./diamond_sword.png');
//const imageScream = await loadImage('./scream.jpg');

const entityFrameMeter = new FrameMeter(engine);
const entityRect = new Entity(engine)
  .setColor('green')
  .setSize(400)
  .setPosition({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 200,
  });

const entityMouseFollower = new Entity(engine).setColor('red').setSize(50);

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
type Hitbox = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  width: number;
  height: number;
};

window.addEventListener('mousemove', (event: Event) => {
  if (event instanceof MouseEvent) {
    const { size } = entityMouseFollower;

    function collideX(r1: Hitbox, r2: Hitbox) {
      return r1.x1 < r2.x2 && r1.x2 > r2.x1;
    }
    function collideY(r1: Hitbox, r2: Hitbox) {
      return r1.y2 > r2.y1 && r1.y1 < r2.y2;
    }

    entityMouseFollower.setPosition((prev) => {
      const previousPosition = { ...prev };

      const newPosition = {
        x: Cursor.x - size.width / 2,
        y: Cursor.y - size.height / 2,
      };

      const source = {
        x1: newPosition!.x,
        x2: newPosition!.x + size.width,
        y1: newPosition!.y,
        y2: newPosition!.y + size.height,
        ...size,
      };

      const target = {
        x1: entityRect.position!.x,
        x2: entityRect.position!.x + entityRect.size.width,
        y1: entityRect.position!.y,
        y2: entityRect.position!.y + entityRect.size.height,
        ...entityRect.size,
      };

      if (collideX(source, target) && collideY(source, target)) {
        // Collision from left
        if (previousPosition.x + source.width <= target.x1) {
          newPosition.x = target.x1 - source.width;
        }

        // Collision from right
        if (previousPosition.x >= target.x2) {
          newPosition.x = target.x2;
        }

        // Collision from top
        if (previousPosition.y + source.height <= target.y1) {
          newPosition.y = target.y1 - source.height;
        }

        // Collision from bottom
        if (previousPosition.y >= target.y2) {
          newPosition.y = target.y2;
        }
      }

      return newPosition;
    });
  }
});
