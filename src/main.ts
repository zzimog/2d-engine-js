import Engine, { EngineRenderInfo } from './Engine';
import FrameMeter from './entities/FrameMeter';
import MovingBox from './entities/MovingBox';
import loadImage from './utils/loadImage';
import { clamp } from './utils/math';
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
