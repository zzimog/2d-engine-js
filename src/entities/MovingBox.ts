import Engine from '../Engine';
import Entity from './Entity';

function rand(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function flipCoin(head: number, cross: number) {
  return Math.random() < 0.5 ? head : cross;
}

class MovingBox extends Entity {
  name: string;
  speed_v: number;
  speed_h: number;
  colliders: Array<MovingBox>;

  constructor(engine: Engine) {
    super(engine);

    const randSpeed = flipCoin(-1, 1);
    this.speed_v = randSpeed;
    this.speed_h = randSpeed;

    this.size = {
      width: rand(30, 80),
      height: rand(30, 80),
    };

    this.position = {
      x: rand(10, window.innerWidth - this.size.width - 10),
      y: rand(10, window.innerHeight - this.size.height - 10),
    };

    this.name = 'box';
    this.colliders = [];
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setColliders(colliders: Array<MovingBox>) {
    this.colliders = colliders;
    return this;
  }

  draw() {
    const pjs = this.getProjections();

    if (pjs.x1 <= 0 || pjs.x2 >= window.innerWidth) {
      this.speed_v *= -1;
    }

    if (pjs.y1 <= 0 || pjs.y2 >= window.innerHeight) {
      this.speed_h *= -1;
    }

    this.setPosition((prev) => ({
      x: prev.x + this.speed_v,
      y: prev.y + this.speed_h,
    }));

    for (const box of this.colliders) {
      if (this.isColliding(box)) {
        this.setColor('red');
        break;
      }

      this.setColor('lime');
    }

    super.draw();

    this.engine.ctx.fillStyle = 'black';
    this.engine.ctx.font = '24px Consolas, monospace, sans-serif';
    this.engine.ctx.textAlign = 'left';
    this.engine.ctx.textBaseline = 'top';
    this.engine.ctx.fillText(this.name, this.position.x, this.position.y);
  }
}

export default MovingBox;
