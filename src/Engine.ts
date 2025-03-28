import useClock from './utils/useClock';

declare global {
  interface Window {
    ENGINE: Engine;
  }
}

export type EngineRenderInfo = {
  fps: number | string;
  currentFrame: number;
};

const DEFAULT_OPTIONS = {
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720,
  VSYNC: false,
  FPS: 60,
  HIDE_CURSOR: false,
};

function getContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    throw new Error('Cannot get 2D context from canvas.');
  }

  return ctx as Context2D;
}

class Engine {
  options: typeof DEFAULT_OPTIONS;
  canvas: HTMLCanvasElement;
  ctx: Context2D;
  fps: number;
  run: boolean;
  drawFrame?: Function;

  constructor(canvas: HTMLCanvasElement, opts = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...opts,
    };

    this.canvas = canvas;
    this.ctx = getContext(this.canvas);

    this.fps = this.options.FPS;
    this.run = true;

    this.setup();
  }

  setup() {
    this.canvas.width = this.options.VIEWPORT_WIDTH;
    this.canvas.height = this.options.VIEWPORT_HEIGHT;

    if (this.options.HIDE_CURSOR) {
      this.canvas.style.cursor = 'none';
    }

    window.ENGINE = this;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    // disable images scaling antialiasing
    this.ctx.imageSmoothingEnabled = false;
  }

  render(callback: (renderInfo: EngineRenderInfo) => void) {
    const fpsTimer = useClock();

    let fps = 0;
    let frameCount = 0;

    this.drawFrame = () => {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      callback({
        fps: 0,
        currentFrame: 0,
      });
    };

    // disable images scaling antialiasing
    this.ctx.imageSmoothingEnabled = false;

    const loop = () => {
      if (this.run) {
        // clear the screen before every render
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        callback({
          fps: fps.toFixed(2),
          currentFrame: frameCount,
        } as EngineRenderInfo);
      }

      frameCount++;

      if (fpsTimer.interval > 1000) {
        fps = (frameCount / fpsTimer.delta()) * 1000;
        frameCount = 0;
      }

      if (this.options.VSYNC) {
        requestAnimationFrame(loop);
      } else {
        setTimeout(loop, 1000 / this.options.FPS);
      }
    };

    return loop();
  }
}

export default Engine;
