import Engine from '../Engine';
import Entity from './Entity';

class FrameMeter extends Entity {
  fps?: string;
  currentFrame?: number;

  constructor(engine: Engine) {
    super(engine);
    this.setPosition(0, 0);
  }

  update(fps: string, currentFrame: number) {
    this.fps = fps;
    this.currentFrame = currentFrame;
  }

  draw() {
    const ctx = this.engine.ctx;
    const { x, y } = this.position!;

    // black boxes
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 135, 24);
    ctx.fillRect(x, y + 25, 122, 24);

    // setup text
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Consolas, monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // draw text
    ctx.fillText(`FPS: ${this.fps}`, x, y);
    ctx.fillText(`Frame: ${this.currentFrame}`, x, y + 25);
  }
}

export default FrameMeter;
