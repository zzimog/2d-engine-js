import Engine, { EngineRenderInfo } from './Engine';
import FrameMeter from './entities/FrameMeter';
import MovingBox from './entities/MovingBox';
import loadImage from './utils/loadImage';
import useCursor from './utils/useCursor';

const Canvas = document.getElementById('mainframe')! as HTMLCanvasElement;
const Cursor = useCursor(Canvas);

const engine = new Engine(Canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  VSYNC: true,
  HIDE_CURSOR: true,
});

const imageCursor = await loadImage('./diamond_sword.png');
const entityFrameMeter = new FrameMeter(engine);

/*
const entityRect = new Entity(engine)
  .setColor('green')
  .setSize(400)
  .setPosition({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 200,
  });

const entityPlayer = new Entity(engine).setColor('red').setSize(50);
*/

const boxes: Array<MovingBox> = [];
const boxesCount = 5;

for (let i = 0; i < boxesCount; i++) {
  const box = new MovingBox(engine).setName(`${i}`);
  boxes.push(box);
}

for (const box of boxes) {
  box.setColliders(boxes.filter((b) => b !== box));
}

engine.render((renderInfo: EngineRenderInfo) => {
  for (const box of boxes) {
    box.draw();
  }

  const { fps, currentFrame } = renderInfo;
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

/**
 * @experimental
 * entityRect movement with arrow keys
 */
/*
window.addEventListener('keydown', (event: Event) => {
  if (event instanceof KeyboardEvent) {
    const SPEED = 10;

    const nextPosition = { ...entityPlayer.position };
    const directions: Record<string, Function> = {
      ArrowUp: () => (nextPosition.y += -1 * SPEED),
      ArrowLeft: () => (nextPosition.x += -1 * SPEED),
      ArrowDown: () => (nextPosition.y += SPEED),
      ArrowRight: () => (nextPosition.x += SPEED),
    };

    directions[event.code]?.call(null);

    if (entityPlayer.willCollide(nextPosition, entityRect)) {
      const pjs2 = entityRect.getProjections();
      const collisionFrom = entityPlayer.relativePosition(entityRect);

      switch (collisionFrom) {
        case 'TOP':
          nextPosition.y = pjs2.y2;
          break;
        case 'RIGHT':
          nextPosition.x = pjs2.x1 - entityPlayer.size.width;
          break;
        case 'BOTTOM':
          nextPosition.y = pjs2.y1 - entityPlayer.size.height;
          break;
        case 'LEFT':
          nextPosition.x = pjs2.x2;
          break;
      }
    }

    entityPlayer.setPosition(nextPosition);
  }
});
*/
