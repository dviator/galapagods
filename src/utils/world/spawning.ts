import type { Unit } from '../../types/unit';
import type { World } from '../../types/world';

/**
 * Get the enemy team for a specific level in a world
 * @param world The world containing the level
 * @param levelId The ID of the level to get enemies for
 * @returns Array of enemy units, or empty array if level not found
 */
export function getEnemiesForLevel(world: World, levelId: number): Unit[] {
  const level = world.levels.find(l => l.id === levelId);
  if (!level) return [];
  return level.enemies;
}
