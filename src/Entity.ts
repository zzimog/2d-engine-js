class Entity {
  position?: Point;
  size: Size;
  color: string;

  constructor(size: Size) {
    this.size = size;
    this.color = 'black';
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
  }

  setColor(color: string) {
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.position) {
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
}

export default Entity;
