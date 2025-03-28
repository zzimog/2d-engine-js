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
  IMAGE_SMOOTHING: false,
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
  run: boolean;
  fps: number;
  currentFrame: number;
  drawFrame?: Function;

  constructor(canvas: HTMLCanvasElement, opts = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...opts,
    };

    this.canvas = canvas;
    this.ctx = getContext(this.canvas);
    this.run = true;
    this.fps = 0;
    this.currentFrame = -1;

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
  }

  render(callback: (renderInfo: EngineRenderInfo) => void) {
    const fpsTimer = useClock();

    this.fps = 0;
    this.currentFrame = 0;

    this.drawFrame = () => {
      this.ctx.imageSmoothingEnabled = this.options.IMAGE_SMOOTHING;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      callback({
        fps: this.fps.toFixed(2),
        currentFrame: this.currentFrame,
      });

      this.currentFrame++;
    };

    const loop = () => {
      if (this.drawFrame && this.run) {
        this.drawFrame();
      }

      if (fpsTimer.interval > 1000) {
        this.fps = (this.currentFrame / fpsTimer.delta()) * 1000;
        this.currentFrame = 0;
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
