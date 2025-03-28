import iif from './iif';

export type Direction = string;

export const Direction = Object.freeze({
  UP: 'up',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  DOWN: 'down',
  LEFT: 'left',
});

export function swapDirection(d: Direction) {
  return iif([
    [d == Direction.TOP, Direction.BOTTOM],
    [d == Direction.UP, Direction.DOWN],
    [d == Direction.BOTTOM, Direction.TOP],
    [d == Direction.DOWN, Direction.UP],
    [d == Direction.RIGHT, Direction.LEFT],
    [d == Direction.LEFT, Direction.RIGHT],
  ]);
}

export default Direction;
