/**
 * Pick a random item from an array
 * @param list - The array to pick from
 * @returns A random item from the list
 */
export function pickRandomItem<T>(list: T[]): T {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx]
}

/**
 * Roll a random initiative value (d8)
 * @returns A random number between 1 and 8 inclusive
 */
export function rollD8(): number {
  return Math.floor(Math.random() * 8) + 1;
}