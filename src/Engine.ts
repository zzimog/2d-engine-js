const DEFAULT = {
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720,
  FPS: 60,
};

class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  fps: number;

  constructor(canvas: HTMLCanvasElement, opts = {}) {
    const options = {
      ...DEFAULT,
      ...opts,
    };

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.fps = options.FPS;

    this.canvas.width = options.VIEWPORT_WIDTH;
    this.canvas.height = options.VIEWPORT_HEIGHT;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(callback: Function) {
    const interval = 1000 / this.fps;
    const tolerance = 0.1;

    let then = performance.now();
    let currentFrame = 0;

    const loop = () => {
      const now = performance.now();
      const delta = now - then;

      requestAnimationFrame(loop);

      if (delta >= interval + tolerance) {
        callback(this.ctx, {
          currentFrame,
          viewport: {
            width: this.canvas.width,
            height: this.canvas.height,
          },
        });

        then = now - (delta % interval);
        currentFrame++;

        if (currentFrame == this.fps) {
          currentFrame = 0;
        }
      }
    };

    return loop();
  }
}

export default Engine;
