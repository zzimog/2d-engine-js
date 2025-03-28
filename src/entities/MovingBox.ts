import { rand } from '../utils/math';
import Engine from '../Engine';
import Entity from './Entity';

class MovingBox extends Entity {
  name: string;
  speed_y: number;
  speed_x: number;
  colliders: Array<MovingBox>;

  constructor(engine: Engine) {
    super(engine);

    const randSpeed = rand(1, 5);
    this.speed_y = randSpeed;
    this.speed_x = randSpeed;

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
      x: this.position.x + this.speed_x,
      y: this.position.y + this.speed_y,
    };
  }

  onCollision(entity: MovingBox) {
    console.log(`${this.name} got hit by ${entity.name}`, entity);
  }

  draw() {
    this.setPosition(() => {
      const next = this.getNextPosition();

      for (const box of this.colliders) {
        if (this.willCollide(next, box)) {
          const collisionFrom = this.relativePosition(box);

          switch (collisionFrom) {
            case 'TOP':
            case 'BOTTOM':
              this.speed_y *= -1;
              box.speed_y = -1 * this.speed_y;
              break;
            case 'RIGHT':
            case 'LEFT':
              this.speed_x *= -1;
              box.speed_x = -1 * this.speed_x;
              break;
          }

          box.onCollision(this);
        }
      }

      const pjs = this.getProjections(this.getNextPosition());
      const speed_x_abs = Math.abs(this.speed_x);
      const speed_y_abs = Math.abs(this.speed_y);
      const { canvas } = this.engine;

      if (pjs.x1 <= 0 && pjs.x2 < canvas.width) {
        this.speed_x = speed_x_abs;
        this.position.x = 0;
      } else if (pjs.x1 > 0 && pjs.x2 > canvas.width) {
        this.speed_x = -1 * speed_x_abs;
        this.position.x = canvas.width - this.size.width;
      }

      if (pjs.y1 <= 0 && pjs.y2 < canvas.height) {
        this.speed_y = speed_y_abs;
        this.position.y = 0;
      } else if (pjs.y1 > 0 && pjs.y2 > canvas.height) {
        this.speed_y = -1 * speed_y_abs;
        this.position.y = canvas.height - this.size.height;
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
