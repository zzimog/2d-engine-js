/**
 * @param {number} value The value
 * @param {number} min Min allowed value
 * @returns Min if value is lower, otherwise the value itself
 */
export function floor(value: number, min: number) {
  return Math.max(value, min);
}

/**
 * @param {number} value The value
 * @param {number} max Max allowed value
 * @returns Max if value is higher, otherwise the value itself
 */
export function ceil(value: number, max: number) {
  return Math.min(value, max);
}

/**
 * @param {number} value The value
 * @param {number} min Min value
 * @param {number} max Max value
 * @returns Min or max if value is lower or higher, otherwise the value itself
 */
export function clamp(value: number, min: number, max: number) {
  return floor(ceil(value, max), min);
}

/**
 * @param {number} min Min allowed value
 * @param {number} max Max allowed value
 * @returns Random value between min and max
 */
export function rand(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {any} head Head value
 * @param {any} cross Cross value
 * @returns Flip a coin and return one of the two parameters
 */
export function flipCoin<T>(head: T, cross: T) {
  return Math.random() < 0.5 ? head : cross;
}

/**
 * @param {number} a Side A
 * @param {number} b Side B
 * @param {number} hypo Whether one of the sides is hypotenuse
 * @returns Result from applied pythagore theorem
 */
export function pythagore(a: number, b: number, hypo: boolean = false) {
  if (hypo) {
    const h = Math.max(a, b);
    const l = Math.min(a, b);

    return Math.sqrt(h * h - l * l);
  }

  return Math.sqrt(a * a + b * b);
}
