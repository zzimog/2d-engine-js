import useClock from './utils/useClock';

type DrawCallback = (
  ctx: Context2D,
  obj: {
    fps: string;
    currentFrame: number;
    viewport: {
      width: number;
      height: number;
    };
  }
) => void;

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

  render(callback: DrawCallback) {
    const fpsTimer = useClock();

    let fps = 0;
    let frameCount = 0;

    if (!this.ctx) {
      return;
    }

    const loop = () => {
      callback(this.ctx!, {
        fps: fps.toFixed(2),
        currentFrame: frameCount,
        viewport: {
          width: this.canvas.width,
          height: this.canvas.height,
        },
      });

      requestAnimationFrame(loop);
      frameCount++;

      if (fpsTimer.interval >= 1000) {
        fps = (frameCount / fpsTimer.delta()) * 1000;
        frameCount = 0;
      }
    };

    return loop();
  }
}

export default Engine;
