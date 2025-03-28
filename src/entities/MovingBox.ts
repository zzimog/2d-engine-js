import { Direction, swapDirection } from '../utils/directions';
import { flipCoin, rand } from '../utils/math';
import Engine from '../Engine';
import Entity from './Entity';

class MovingBox extends Entity {
  name: string;
  speed_y: number;
  speed_x: number;
  colliders: Array<MovingBox>;

  constructor(engine: Engine) {
    super(engine);

    this.color = 'lime';
    this.name = 'box';
    this.colliders = [];

    this.size = {
      width: rand(50, 200),
      height: rand(50, 200),
    };

    const randSpeed = rand(1, 5);
    this.speed_y = randSpeed * flipCoin(-1, 1);
    this.speed_x = randSpeed * flipCoin(-1, 1);

    const { canvas } = this.engine;
    this.position = {
      x: rand(10, canvas.width - this.size.width - 10),
      y: rand(10, canvas.height - this.size.height - 10),
    };
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setColliders(colliders: Array<MovingBox>) {
    this.colliders = colliders;
    return this;
  }

  onCollision(from: Direction, entity: MovingBox) {
    console.log(`${this.name} got hit by ${entity.name} from ${from}`, entity);

    switch (from) {
      case Direction.TOP:
      case Direction.BOTTOM: {
        this.speed_y = -1 * entity.speed_y;
        break;
      }

      case Direction.LEFT:
      case Direction.RIGHT: {
        this.speed_x = -1 * entity.speed_x;
        break;
      }
    }
  }

  update() {
    const nextPosition = {
      x: this.position.x + this.speed_x,
      y: this.position.y + this.speed_y,
    };

    for (const entity of this.colliders) {
      if (this.willCollide(nextPosition, entity)) {
        const at = this.relativePosition(entity);
        const entityHitbox = entity.getProjections();

        if (at === false) {
          continue;
        }

        switch (at) {
          case Direction.TOP: {
            this.speed_y = entity.speed_y;
            nextPosition.y = entityHitbox.y2;
            break;
          }

          case Direction.BOTTOM: {
            this.speed_y = entity.speed_y;
            nextPosition.y = entityHitbox.y1 - this.size.height;
            break;
          }

          case Direction.RIGHT: {
            this.speed_x = entity.speed_x;
            nextPosition.x = entityHitbox.x1 - this.size.width;
            break;
          }

          case Direction.LEFT: {
            this.speed_x = entity.speed_x;
            nextPosition.x = entityHitbox.x2;
            break;
          }
        }

        entity.onCollision(swapDirection(at), this);
      }
    }

    const nextPjs = this.getProjections(nextPosition);
    const speed_x_abs = Math.abs(this.speed_x);
    const speed_y_abs = Math.abs(this.speed_y);
    const { canvas } = this.engine;

    if (nextPjs.x1 < 0 && nextPjs.x2 < canvas.width) {
      this.speed_x = speed_x_abs;
      nextPosition.x = 0;
    } else if (nextPjs.x1 > 0 && nextPjs.x2 > canvas.width) {
      this.speed_x = -1 * speed_x_abs;
      nextPosition.x = canvas.width - this.size.width;
    }

    if (nextPjs.y1 < 0 && nextPjs.y2 < canvas.height) {
      this.speed_y = speed_y_abs;
      nextPosition.y = 0;
    } else if (nextPjs.y1 > 0 && nextPjs.y2 > canvas.height) {
      this.speed_y = -1 * speed_y_abs;
      nextPosition.y = canvas.height - this.size.height;
    }

    this.setPosition(nextPosition);
  }

  draw() {
    this.update();
    super.draw();

    this.engine.ctx.fillStyle = 'black';
    this.engine.ctx.font = '24px Consolas, monospace, sans-serif';
    this.engine.ctx.textAlign = 'left';
    this.engine.ctx.textBaseline = 'top';
    this.engine.ctx.fillText(this.name, this.position.x, this.position.y);
  }
}

export default MovingBox;
