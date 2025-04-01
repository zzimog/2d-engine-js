import Point from './Point';

class Line {
  m: number;
  q: number;

  constructor(m: number, q: number) {
    this.m = m;
    this.q = q;
  }

  static checkPoint(l: Line, p: Point) {
    return p.x * l.m + l.q == p.y;
  }

  checkPoint(p: Point) {
    return Line.checkPoint(this, p);
  }
}

export default Line;
