import Engine from '../Engine';

class Entity {
  engine: Engine;
  position: Position;
  size: Size;
  color: string;

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

    this.color = 'transparent';

    console.log('Entity initialized.');
  }

  setSize(width: number, height?: number) {
    this.size = {
      width,
      height: height ?? width,
    };

    return this;
  }

  setPosition(position: Point | ((previous: Point) => Point)) {
    if (typeof position == 'function') {
      position = position(this.position);
    }

    this.position = {
      x: Math.floor(position.x),
      y: Math.floor(position.y),
    };

    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  get projections() {
    const { x, y } = this.position;
    const { width, height } = this.size;

    return {
      x1: x,
      x2: x + width,
      y1: y,
      y2: y + height,
    };
  }

  collideX(target: Entity) {
    const h1 = this.projections;
    const h2 = target.projections;

    return h1.x1 < h2.x2 && h1.x2 > h2.x1;
  }

  collideY(target: Entity) {
    const h1 = this.projections;
    const h2 = target.projections;

    return h1.y2 > h2.y1 && h1.y1 < h2.y2;
  }

  collide(target: Entity) {
    return this.collideX(target) && this.collideY(target);
  }

  draw() {
    const ctx = this.engine.ctx;

    ctx.fillStyle = this.color;

    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  /**
   * @experimental
   * check if given point is inside Entity area
   */
  isInBound(point: Point) {
    return (
      point.x >= this.position.x &&
      point.x < this.position.x + this.size.width &&
      point.y >= this.position.y &&
      point.y < this.position.y + this.size.height
    );
  }
}

export default Entity;
