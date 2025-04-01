import { pythagore } from '../utils/math';

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static getDistance(p1: Point, p2: Point) {
    const x = p2.x - p1.x;
    const y = p2.y - p1.y;

    return pythagore(x, y);
  }

  getDistance(p: Point) {
    return Point.getDistance(this, p);
  }
}

export default Point;
