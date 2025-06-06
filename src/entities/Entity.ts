import Direction from '../utils/directions';
import iif from '../utils/iif';
import Engine from '../Engine';
import type Point from '../geometry/Point';

class Entity {
  engine: Engine;
  position: Position;
  size: Size;
  color?: string;

  constructor(engine: Engine) {
    this.engine = engine;

    this.size = {
      width: 0,
      height: 0,
    };

    this.position = {
      x: 0,
      y: 0,
    };

    console.log('Entity initialized.');
  }

  setSize(size: number | Size | ((prev: Size) => Size)) {
    if (typeof size === 'number') {
      size = {
        width: size,
        height: size,
      };
    } else if (typeof size === 'function') {
      size = size({ ...this.size });
    }

    this.size = { ...size };

    return this;
  }

  setPosition(position: Position | ((prev: Position) => Position)) {
    if (typeof position == 'function') {
      position = position({ ...this.position });
    }

    this.position = {
      x: Math.floor(position.x),
      y: Math.floor(position.y),
    };

    return this;
  }

  setColor(color: string | ((prev?: string) => string)) {
    if (typeof color == 'function') {
      color = color(this.color);
    }

    this.color = color;

    return this;
  }

  getProjections(at?: Position): Projection {
    const { x, y } = at || this.position;
    const { width, height } = this.size;

    return {
      x1: x,
      x2: x + width,
      y1: y,
      y2: y + height,
    };
  }

  draw() {
    const ctx = this.engine.ctx;

    if (this.color) {
      ctx.fillStyle = this.color;
    }

    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  willCollide(position: Position, entity: Entity) {
    const pjs1 = this.getProjections(position);
    const pjs2 = entity.getProjections();

    return (
      pjs1.x1 < pjs2.x2 &&
      pjs1.x2 > pjs2.x1 &&
      pjs1.y2 > pjs2.y1 &&
      pjs1.y1 < pjs2.y2
    );
  }

  isColliding(entity: Entity) {
    return this.willCollide(this.position, entity);
  }

  relativePosition(entity: Entity): Direction | false {
    const pjs1 = this.getProjections();
    const pjs2 = entity.getProjections();

    return (
      iif([
        [pjs1.y1 >= pjs2.y2, Direction.TOP],
        [pjs1.x2 <= pjs2.x1, Direction.RIGHT],
        [pjs1.y2 <= pjs2.y1, Direction.BOTTOM],
        [pjs1.x1 >= pjs2.x2, Direction.LEFT],
      ]) || false
    );
  }

  contains(point: Point) {
    return (
      point.x >= this.position.x &&
      point.x < this.position.x + this.size.width &&
      point.y >= this.position.y &&
      point.y < this.position.y + this.size.height
    );
  }
}

export default Entity;
