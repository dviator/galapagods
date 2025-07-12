import { HealEffect, GeneticPotentialEffect, TemporaryStatBoostEffect, EffectName } from './effects';
import { ALL_STATS } from '../../types/stats';
import type { ShopItem, ShopItemConfig } from '../../types/shop';
import { pickRandomItem } from '../random';
import { ItemTargetEnum } from '../../data/items';

export function getRandomHealthPotionItem(configs: ShopItemConfig[]): ShopItem {
  const config = pickRandomItem(configs)
  const amount = config.amount
  return {
    name: `Health Potion (+${amount})`,
    description: `Restore ${amount} HP to a character.`,
    price: config.price,
    target: ItemTargetEnum.Character,
    effect: HealEffect,
    effectName: EffectName.Heal,
    config: config,
  };
}

export function getRandomTemporaryStatBoostItem(config: ShopItemConfig[]): ShopItem {
  const { amount, price } = pickRandomItem(config);
  const stat = ALL_STATS[Math.floor(Math.random() * ALL_STATS.length)];
  const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
  return {
    name: `${statLabel} Boost (+${amount})`,
    description: `Gain +${amount} ${statLabel} for one run.`,
    price,
    target: ItemTargetEnum.Character,
    effect: TemporaryStatBoostEffect,
    effectName: EffectName.TemporaryStatBoost,
    config: { price, stat, amount },
  };
}

export function getRandomGeneticPotentialItem(config: ShopItemConfig[]): ShopItem {
  const { price } = pickRandomItem(config)
  return {
    name: 'Genetic Potential',
    description: 'Permanently boost a random stat grade.',
    price: price,
    target: ItemTargetEnum.Character,
    effect: GeneticPotentialEffect,
    effectName: EffectName.GeneticPotential,
    config: { price },
  }
}

