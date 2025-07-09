import type { World } from '../types/world';
import { createEmptyUnit } from '../utils/units/createCharacter';
import { createGoober, createGoobLvl2, createSuperGoober } from './enemies';

export const worlds: World[] = [
  {
    id: 1,
    name: 'World 1',
    unlocked: true,
    levels: [
      // Levels 1-2: normal
      { id: 1, type: 'normal', completed: false, enemies: [createGoober(), createGoober(), createGoober()] },
      { id: 2, type: 'normal', completed: false, enemies: [createGoober(), createGoober(), createGoober()] },
      // Level 3: miniboss
      { id: 3, type: 'miniboss', completed: false, enemies: [createEmptyUnit(), createSuperGoober(), createEmptyUnit()] },
      // Levels 4-5: normal
      { id: 4, type: 'normal', completed: false, enemies: [createGoober(), createGoobLvl2(), createGoober()] },
      { id: 5, type: 'normal', completed: false, enemies: [createGoobLvl2(), createGoober(), createGoobLvl2()] },
      // Level 6: miniboss
      { id: 6, type: 'miniboss', completed: false, enemies: [createGoober(), createSuperGoober(), createGoober()] },
      // Levels 7-8: normal
      { id: 7, type: 'normal', completed: false, enemies: [createGoobLvl2(), createGoober(), createGoobLvl2()] },
      { id: 8, type: 'normal', completed: false, enemies: [createGoobLvl2(), createGoobLvl2(), createGoobLvl2()] },
      // Level 9: boss
      { id: 9, type: 'boss', completed: false, enemies: [createGoobLvl2(), createSuperGoober(), createGoobLvl2()] },
    ],
  },
];

