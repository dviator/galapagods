// Shop item data/config for the shop system
// Only data/config, no effect logic
import { StatEnum, ALL_STATS } from '../types/stats';
import { HealEffect, GeneticPotentialEffect, TemporaryStatBoostEffect, EffectName } from '../utils/units/effects';

import type { Effect } from '../utils/units/effects';

export type ShopItemTarget = 'character' | 'team' | 'global';

export interface ShopItemConfig {
  amount?: number;
  stat?: StatEnum;
}

export interface ShopItem {
  name: string;
  description: string;
  price: number;
  target: ShopItemTarget;
  effect: Effect;
  effectName: EffectName;
  config?: ShopItemConfig;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    name: 'Health Potion',
    description: 'Restore HP to a character.',
    price: 3,
    target: 'character',
    effect: HealEffect,
    effectName: EffectName.Heal,
    config: { amount: 4 },
  },
  {
    name: 'Genetic Potential',
    description: 'Permanently boost a random stat grade.',
    price: 5,
    target: 'character',
    effect: GeneticPotentialEffect,
    effectName: EffectName.GeneticPotential,
    config: {},
  }
  // The temporary stat boost item is generated dynamically below
];

// Utility to generate a temporary stat boost item with random stat and amount
export function getTemporaryStatBoostItem(): ShopItem {
  const stat = ALL_STATS[Math.floor(Math.random() * ALL_STATS.length)];
  const amount = Math.floor(Math.random() * 3) + 1; // 1-3
  const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
  return {
    name: `${statLabel} Boost`,
    description: `Gain +${amount} ${statLabel} for one run.`,
    price: 2,
    target: 'character',
    effect: TemporaryStatBoostEffect,
    effectName: EffectName.TemporaryStatBoost,
    config: { stat, amount },
  };
}