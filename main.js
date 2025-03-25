import Engine from './Engine.js';
import loadImage from './loadImage.js';

const canvas = document.getElementById('mainframe');
const img = await loadImage('./scream.jpg');

const engine = new Engine(canvas, {
  VIEWPORT_WIDTH: window.innerWidth,
  VIEWPORT_HEIGHT: window.innerHeight,
  FPS: 60,
});

const MovingObj = {
  x: 0,
  y: 500,
  size: 10,
  speed: 10,
  color: 'red',
  direction: 1,
  draw(ctx, vp) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    this.x += this.speed * this.direction;

    if (this.x <= 0 || this.x >= vp.width - this.size) {
      this.direction *= -1;
    }
  },
};

engine.render((ctx, { currentFrame, viewport }) => {
  ctx.clearRect(0, 0, viewport.width, viewport.height);

  ctx.drawImage(img, 130, 30);

  MovingObj.draw(ctx, viewport);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 93, 24);

  ctx.fillStyle = 'yellow';
  ctx.font = '24px Consolas, monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`FPS: ${currentFrame}`, 0, 0);
});

window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  engine.resize(innerWidth, innerHeight);
});
