import Engine from './Engine';
import loadImage from './utils/loadImage';
import getCursor from './utils/getCursor';

const canvas = document.getElementById('mainframe')!;
const img = await loadImage('./scream.jpg');

const engine = new Engine(canvas! as HTMLCanvasElement, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  FPS: 75,
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

const Cursor = getCursor(canvas);

engine.render(
  (
    ctx: any,
    { currentFrame, viewport }: { currentFrame: number; viewport: any }
  ) => {
    ctx.clearRect(0, 0, viewport.width, viewport.height);

    ctx.drawImage(img, 130, 30);

    MovingObj.draw(ctx, viewport);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 122, 24);

    ctx.fillStyle = 'yellow';
    ctx.font = '24px Consolas, monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Frame: ${currentFrame}`, 0, 0);

    if (Cursor.x && Cursor.y) {
      ctx.fillStyle = 'red';
      ctx.fillRect(Cursor.x - 5, Cursor.y - 5, 10, 10);
    }
  }
);

window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  engine.resize(innerWidth, innerHeight);
});
