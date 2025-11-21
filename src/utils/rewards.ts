import type { Unit } from '../types/unit';

/**
 * Calculate gold earned from defeated enemies
 * Awards 1 gold per level of enemy defeated
 */
export function calculateGoldReward(defeatedEnemies: Unit[]): number {
  return defeatedEnemies.reduce(
    (sum, enemy) => sum + (enemy.character?.levelProgression?.level || 1),
    0
  );
}
