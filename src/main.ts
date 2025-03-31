import Engine, { EngineRenderInfo } from './Engine';
import Entity from './entities/Entity';
import FrameMeter from './entities/FrameMeter';
import MovingBox from './entities/MovingBox';
import loadImage from './utils/loadImage';
import { clamp } from './utils/math';
import useCursor from './utils/useCursor';
import useKeyboard from './utils/useKeyboard';

const Canvas = document.getElementById('mainframe')! as HTMLCanvasElement;

const Cursor = useCursor(Canvas);
const Keyboard = useKeyboard();

const engine = new Engine(Canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  VSYNC: true,
  HIDE_CURSOR: true,
});

const imageCursor = await loadImage('./diamond_sword.png');
const entityFrameMeter = new FrameMeter(engine);

const player = new Entity(engine)
  .setColor('blue')
  .setSize(200)
  .setPosition({
    x: engine.canvas.width / 2 - 100,
    y: engine.canvas.height / 2 - 100,
  });

const boxes: Array<MovingBox> = [];
const boxesUserInput = Number(prompt('boxes count? (between 5 and 20)', '10'));
const boxesCount = clamp(boxesUserInput, 5, 20);

for (let i = 0; i < boxesCount; i++) {
  const hasCollision = (box: MovingBox) => {
    for (const other of boxes) {
      if (box.isColliding(other)) {
        return true;
      }
    }
    return false;
  };

  let box = null;

  do {
    box = new MovingBox(engine).setName(`${i}`);
  } while (hasCollision(box));

  boxes.push(box!);
}

for (const box of boxes) {
  box.setColliders(boxes.filter((b) => b !== box));
}

engine.render((renderInfo: EngineRenderInfo) => {
  for (const box of boxes) {
    box.draw();
  }

  const speed = 5;
  const vx = Keyboard.keyPressed('KeyD') - Keyboard.keyPressed('KeyA');
  const vy = Keyboard.keyPressed('KeyS') - Keyboard.keyPressed('KeyW');
  const diag = vx != 0 && vy != 0 ? Math.sqrt(2) : 1;

  player
    .setColor(vx != 0 || vy != 0 ? 'red' : 'blue')
    .setPosition((prev) => {
      return {
        x: prev.x + (vx * speed) / diag,
        y: prev.y + (vy * speed) / diag,
      };
    })
    .draw();

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
