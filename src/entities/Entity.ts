import Engine from '../Engine';

class Entity {
  engine: Engine;
  position: Point;
  size: Size;
  color: string;
  visible: boolean;

  constructor(engine: Engine) {
    this.engine = engine;

    this.position = { x: 0, y: 0 };

    this.size = {
      width: 0,
      height: 0,
    };

    this.color = 'transparent';
    this.visible = true;

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

  getPosition() {
    return this.position;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    return this;
  }

  draw() {
    const ctx = this.engine.ctx;

    if (!this.visible || !this.position) {
      return;
    }

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
    if (
      !this.position ||
      point.x < this.position.x ||
      point.x >= this.position.x + this.size.width ||
      point.y < this.position.y ||
      point.y >= this.position.y + this.size.height
    ) {
      return false;
    }

    return true;
  }
}

export default Entity;
