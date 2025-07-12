// Shop item data/config for the shop system
// Only data/config, no effect logic
import type { ShopItem as Item } from '../types/shop';
import { getRandomGeneticPotentialItem, getRandomHealthPotionItem, getRandomTemporaryStatBoostItem } from '../utils/units/shopItems';

export const SHOP_SIZE = 8;

export type ItemTarget =
  ItemTargetEnum.Character |
  ItemTargetEnum.Global |
  ItemTargetEnum.Team

export enum ItemTargetEnum {
  Character = 'character',
  Team = 'team',
  Global = 'global'
}

const healthPotionConfig = [
  { price: 2, amount: 3},
  { price: 3, amount: 5},
  { price: 5, amount: 10}
]

const tmpStatBoostConfig = [
  { price: 2, amount: 2 },
  { price: 3, amount: 4 },
  { price: 5, amount: 7 },
]

const geneticPotentialConfig = [
  { price: 5, amount: 1}
]

export function InitializeShopItems(): Item[] {
  return [
    getRandomHealthPotionItem(healthPotionConfig),
    getRandomTemporaryStatBoostItem(tmpStatBoostConfig),
    getRandomGeneticPotentialItem(geneticPotentialConfig)
  ]
}



