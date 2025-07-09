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
  // Health potion is now generated dynamically below
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

// Utility to generate a random health potion item (1/3/5 health for 1/2/3 gold)
export function getRandomHealthPotionItem(): ShopItem {
  const potionTypes = [
    { amount: 1, price: 1 },
    { amount: 3, price: 2 },
    { amount: 5, price: 3 },
  ];
  const idx = Math.floor(Math.random() * potionTypes.length);
  const { amount, price } = potionTypes[idx];
  return {
    name: `Health Potion (+${amount})`,
    description: `Restore ${amount} HP to a character.`,
    price,
    target: 'character',
    effect: HealEffect,
    effectName: EffectName.Heal,
    config: { amount },
  };
}

// Utility to generate a random temporary stat boost item (2/4/6 stat for 1/2/3 gold)
export function getRandomTemporaryStatBoostItem(): ShopItem {
  const boostTypes = [
    { amount: 1, price: 1 },
    { amount: 2, price: 2 },
    { amount: 4, price: 3 },
  ];
  const idx = Math.floor(Math.random() * boostTypes.length);
  const { amount, price } = boostTypes[idx];
  const stat = ALL_STATS[Math.floor(Math.random() * ALL_STATS.length)];
  const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
  return {
    name: `${statLabel} Boost (+${amount})`,
    description: `Gain +${amount} ${statLabel} for one run.`,
    price,
    target: 'character',
    effect: TemporaryStatBoostEffect,
    effectName: EffectName.TemporaryStatBoost,
    config: { stat, amount },
  };
}