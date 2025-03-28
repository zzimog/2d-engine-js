type Conditions<T> = Array<[boolean, T]>;

/**
 * Return object key corresponding to first verified condition
 *
 * @example
 * iif([
 *  [a > b, 0],
 *  [b < c, 1],
 *  [a == c, 2],
 *  [a == null, 3]
 * ])
 */
function iif<T>(conditions: Conditions<T>) {
  for (const [condition, value] of conditions) {
    if (condition) {
      return typeof value === 'function' ? value() : value;
    }
  }

  return undefined;
}

export default iif;
