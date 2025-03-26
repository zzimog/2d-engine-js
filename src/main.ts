import Engine from './Engine';
import Entity from './Entity';
import loadImage from './utils/loadImage';
import getCursor from './utils/getCursor';

const canvas = document.getElementById('mainframe')! as HTMLCanvasElement;

const Cursor = getCursor(canvas);

const imageCursor = await loadImage('./diamond_sword.png');
const imageScream = await loadImage('./scream.jpg');

const engine = new Engine(canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  FPS: 75,
  HIDE_CURSOR: true,
});

const MovingObj = {
  x: 0,
  y: 500,
  size: 10,
  speed: 10,
  color: 'red',
  direction: 1,
  draw(ctx: any, vp: any) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    this.x += this.speed * this.direction;

    if (this.x <= 0 || this.x >= vp.width - this.size) {
      this.direction *= -1;
    }
  },
};

const entityRect = new Entity()
  .setColor('green')
  .setSize(300, 150)
  .setPosition(600, 300);

engine.render(
  (
    ctx: Context2D,
    { currentFrame, viewport }: { currentFrame: number; viewport: any }
  ) => {
    // disable images scaling antialiasing
    ctx.imageSmoothingEnabled = false;

    // clear the screen
    ctx.clearRect(0, 0, viewport.width, viewport.height);

    // scream painting image
    ctx.drawImage(imageScream, 130, 30);

    // moving red square
    MovingObj.draw(ctx, viewport);

    // frame counter: black box
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 122, 24);

    // frame counter: text
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Consolas, monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Frame: ${currentFrame}`, 0, 0);

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

    if (Cursor.active) {
      ctx.drawImage(
        imageCursor,
        Cursor.x,
        Cursor.y,
        imageCursor.width * 4,
        imageCursor.height * 4
      );
    }
  }
);

window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  engine.resize(innerWidth, innerHeight);
});

/**
 * @experimental
 * entityRect movement with arrow keys
 */
const SPEED = 10;
window.addEventListener('keydown', (event: Event) => {
  if (event instanceof KeyboardEvent) {
    const { code, repeat } = event;
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

    directions[code].call(null);
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
