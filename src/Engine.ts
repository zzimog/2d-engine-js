const DEFAULT_OPTIONS = {
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720,
  FPS: 60,
  HIDE_CURSOR: false,
};

class Engine {
  canvas: HTMLCanvasElement;
  ctx: Context2D | null;
  fps: number;

  constructor(canvas: HTMLCanvasElement, opts = {}) {
    const options = {
      ...DEFAULT_OPTIONS,
      ...opts,
    };

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    if (this.ctx === null) {
      throw new Error('Cannot get 2D context from canvas.');
    }

    this.fps = options.FPS;

    this.canvas.width = options.VIEWPORT_WIDTH;
    this.canvas.height = options.VIEWPORT_HEIGHT;

    if (options.HIDE_CURSOR) {
      this.canvas.style.cursor = 'none';
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(callback: Function) {
    const tolerance = 0.1;
    const interval = 1000 / this.fps + tolerance;

    let then = performance.now();
    let currentFrame = 0;

    // Arrow function is required
    const loop = () => {
      const now = performance.now();
      const delta = now - then;

      requestAnimationFrame(loop);

      if (delta >= interval) {
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
