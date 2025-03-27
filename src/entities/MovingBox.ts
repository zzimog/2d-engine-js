import { rand } from '../utils/math';
import Engine from '../Engine';
import Entity from './Entity';

class MovingBox extends Entity {
  name: string;
  speed_v: number;
  speed_h: number;
  colliders: Array<MovingBox>;

  constructor(engine: Engine) {
    super(engine);

    const randSpeed = rand(1, 5);
    this.speed_v = randSpeed;
    this.speed_h = randSpeed;

    this.size = {
      width: rand(50, 200),
      height: rand(50, 200),
    };

    this.position = {
      x: rand(10, window.innerWidth - this.size.width - 10),
      y: rand(10, window.innerHeight - this.size.height - 10),
    };

    this.name = 'box';
    this.colliders = [];

    this.setColor('lime');
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setColliders(colliders: Array<MovingBox>) {
    this.colliders = colliders;
    return this;
  }

  getNextPosition() {
    return {
      x: this.position.x + this.speed_v,
      y: this.position.y + this.speed_h,
    };
  }

  draw() {
    const pjs = this.getProjections();

    if (pjs.x1 <= 0 || pjs.x2 >= window.innerWidth) {
      this.speed_v *= -1;
    }

    if (pjs.y1 <= 0 || pjs.y2 >= window.innerHeight) {
      this.speed_h *= -1;
    }

    this.setPosition(() => {
      const next = this.getNextPosition();

      for (const box of this.colliders) {
        if (this.willCollide(next, box)) {
          const collisionFrom = this.relativePosition(box);

          switch (collisionFrom) {
            case 'TOP':
            case 'BOTTOM':
              this.speed_h *= -1;
              box.speed_h *= -1;
              break;
            case 'RIGHT':
            case 'LEFT':
              this.speed_v *= -1;
              box.speed_v *= -1;
              break;
          }
        }
      }

      return this.getNextPosition();
    });

    /*
    for (const box of this.colliders) {
      if (this.isColliding(box)) {
        this.setColor('red');
        break;
      }

      this.setColor('lime');
    }
    */

    super.draw();

    this.engine.ctx.fillStyle = 'black';
    this.engine.ctx.font = '24px Consolas, monospace, sans-serif';
    this.engine.ctx.textAlign = 'left';
    this.engine.ctx.textBaseline = 'top';
    this.engine.ctx.fillText(this.name, this.position.x, this.position.y);
  }
}

export default MovingBox;
