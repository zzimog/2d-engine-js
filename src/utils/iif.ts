type Conditions = {
  [key: string]: boolean;
};

/**
 * Return object key corresponding to first verified condition
 *
 * @example
 * iif({
 *  0: a > b,
 *  1: b < c,
 *  2: a == c
 *  3: a == null
 * })
 */
function iif(conditions: Conditions) {
  for (const [value, condition] of Object.entries(conditions)) {
    if (condition) {
      return value;
    }
  }

  return undefined;
}

export default iif;
