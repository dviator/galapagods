import { HealEffect, GeneticPotentialEffect, TemporaryStatBoostEffect } from './effects';
import { ALL_STATS } from '../../types/stats';

export const SHOP_ITEMS = [
  {
    name: 'Health Potion',
    description: 'Restore HP to a character.',
    price: 3,
    target: 'character',
    effect: HealEffect,
    config: { amount: 4 },
  },
  {
    name: 'Genetic Potential',
    description: 'Permanently boost a random stat grade.',
    price: 5,
    target: 'character',
    effect: GeneticPotentialEffect,
    config: {},
  },
  // The temporary stat boost item is generated dynamically below
  {}, {}, {}, {}, {}, {}
];

// Utility to generate a temporary stat boost item with random stat and amount
export function getTemporaryStatBoostItem() {
  const stat = ALL_STATS[Math.floor(Math.random() * ALL_STATS.length)];
  const amount = Math.floor(Math.random() * 3) + 1; // 1-3
  const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
  return {
    name: `${statLabel} Boost`,
    description: `Gain +${amount} ${statLabel} for one run.`,
    price: 2,
    target: 'character',
    effect: TemporaryStatBoostEffect,
    config: { stat, amount },
  };
}