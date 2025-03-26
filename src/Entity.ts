class Entity {
  position?: Point;
  size: Size;
  color: string;
  visible: boolean;

  constructor() {
    this.size = {
      width: 0,
      height: 0,
    };

    this.color = 'black';
    this.visible = true;

    console.log('Entity initialized.');
  }

  setSize(width: number, height: number) {
    this.size = { width, height };
    return this;
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    return this;
  }

  draw(ctx: Context2D) {
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
