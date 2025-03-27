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
    const TARGET = entityMouseFollower;
    const SPEED = 10;

    const previousPosition = { ...TARGET.position };
    const nextPosition = { ...TARGET.position };

    const directions: Record<string, Function> = {
      ArrowUp: () => (nextPosition.y += -1 * SPEED),
      ArrowLeft: () => (nextPosition.x += -1 * SPEED),
      ArrowDown: () => (nextPosition.y += SPEED),
      ArrowRight: () => (nextPosition.x += SPEED),
    };

    directions[event.code]?.call(null);

    TARGET.setPosition(nextPosition);

    if (TARGET.collide(entityRect)) {
      TARGET.setColor('blue');
    } else {
      TARGET.setColor('red');
    }
  }
});

/**
 * @experimental
 * move entityMouseFollower on mousemove event
 */
function checkCollision() {
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
    ...size,
  };

  const target = {
    x1: entityRect.position!.x,
    x2: entityRect.position!.x + entityRect.size.width,
    y1: entityRect.position!.y,
    y2: entityRect.position!.y + entityRect.size.height,
    ...entityRect.size,
  };

  entityMouseFollower.setPosition((prev) => {
    const previousPosition = { ...prev };

    if (entityMouseFollower.collide(entityRect)) {
      console.log('collision!', previousPosition.x, source.x1);
      console.log(previousPosition.x + source.width, target.x1);

      // Collision from left
      if (previousPosition.x + source.width <= target.x1) {
        //newPosition.x = target.x1 - source.width;

        entityRect.setPosition((prev) => ({
          ...prev,
          x: source.x2,
        }));
      }

      // Collision from right
      if (previousPosition.x >= target.x2) {
        //newPosition.x = target.x2;

        entityRect.setPosition((prev) => ({
          ...prev,
          x: source.x1 - entityRect.size.width,
        }));
      }

      // Collision from top
      if (previousPosition.y + source.height <= target.y1) {
        //newPosition.y = target.y1 - source.height;

        entityRect.setPosition((prev) => ({
          ...prev,
          y: source.y2,
        }));
      }

      // Collision from bottom
      if (previousPosition.y >= target.y2) {
        //newPosition.y = target.y2;

        entityRect.setPosition((prev) => ({
          ...prev,
          y: source.y1 - entityRect.size.height,
        }));
      }
    }

    return newPosition;
  });
}
