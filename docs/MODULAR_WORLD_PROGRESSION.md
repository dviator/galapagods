# Modular World Progression System

## Overview

The Modular World Progression System enables flexible, extensible roguelike progression through sequential worlds and levels. It supports custom world/level definitions, minibosses, bosses, and dynamic enemy teams, and is designed for easy expansion and maintainability.

---

## Core Data Structures

### World
```typescript
export interface World {
  id: number;
  name: string;
  unlocked: boolean;
  levels: Level[];
}
```

### Level
```typescript
export interface Level {
  id: number;
  type: 'normal' | 'miniboss' | 'boss';
  enemies: Unit[]; // Array of units (including empty slots)
  completed: boolean;
}
```

### Unit
See `src/types/unit.ts` and `src/utils/units/createCharacter.ts` for the full Unit interface and creation utilities.

---

## Defining Worlds and Levels

Worlds are defined in `src/data/worlds.ts` as an array of `World` objects. Each world contains an array of `Level` objects, and each level defines its enemy team as an array of `Unit` objects.

### Example: World 1 with Minibosses and Boss
```typescript
import { createGoob, createSuperGoober, createEmptyUnit } from '../utils/units/createCharacter';

export const worlds: World[] = [
  {
    id: 1,
    name: 'World 1',
    unlocked: true,
    levels: [
      { id: 1, type: 'normal', completed: false, enemies: [createGoob(), createGoob(), createGoob()] },
      { id: 2, type: 'normal', completed: false, enemies: [createGoob(), createGoob(), createGoob()] },
      { id: 3, type: 'miniboss', completed: false, enemies: [createEmptyUnit(), createSuperGoober(), createEmptyUnit()] },
      // ... more levels ...
      { id: 9, type: 'boss', completed: false, enemies: [createGoob(), createSuperGoober(), createGoob()] },
    ],
  },
];
```

- Use `createGoob()` for standard enemies, `createSuperGoober()` for minibosses/bosses, and `createEmptyUnit()` for empty slots.
- You can customize any unit by passing options to `createGoob({ maxHp: 12, attack: customAttack })`.

---

## Enemy Teams and Empty Slots

- Enemy teams are always arrays of `Unit`.
- Use `createEmptyUnit()` to represent an empty slot (e.g., for a solo miniboss in the center position).
- All combat, XP, and targeting logic treats empty units as dead/nonexistent.
- No special handling is needed in most logic or rendering.

---

## Progression Logic

- Progression is managed by the World Progression Manager (`src/utils/worldProgression.ts`).
- Players advance through levels sequentially; on completion, the next level is unlocked.
- Completing the last level in a world unlocks the next world (if defined).
- On player death, progression resets to World 1, Level 1.
- The current world/level and completion state are tracked in memory (persistence is a future enhancement).

---

## Extending the System

- **Add a new world:**
  - Add a new `World` object to the `worlds` array in `src/data/worlds.ts`.
  - Define its levels and enemy teams as needed.
- **Add new enemy types:**
  - Create new unit creation utilities in `src/utils/units/createCharacter.ts`.
  - Use them in level definitions.
- **Customize levels:**
  - Pass options to `createGoob` or other unit creators to adjust stats, attacks, etc.
- **Add minibosses/bosses:**
  - Use `createSuperGoober` or define your own miniboss/boss units.
  - Use `createEmptyUnit()` for empty slots as needed.

---

## Best Practices & Tips

- Keep world and level definitions in `src/data/worlds.ts` for clarity.
- Use the provided unit creation utilities for consistency.
- Avoid using nulls; always use `createEmptyUnit()` for empty slots.
- Document any custom units or attacks for future maintainers.
- Keep data structures and logic decoupled for easy extensibility.

---

## Related Files & References
- `src/data/worlds.ts` — World and level definitions
- `src/types/world.ts` — World and Level interfaces
- `src/types/unit.ts` — Unit interface
- `src/utils/units/createCharacter.ts` — Unit creation utilities
- `src/utils/worldProgression.ts` — Progression manager logic

---

## Enemy Definitions and XP Awards

- **Enemy unit definitions** (including XP awards and other properties) should ultimately be moved to a dedicated `enemies.ts` file in `src/data/`.
- This keeps all enemy constants organized and makes it easy to update or extend enemy types.
- When defining an enemy, include an XP award property as part of the unit definition for extensibility and clarity.
- Example:
  ```typescript
  // src/data/enemies.ts
  export const GoobEnemy = createGoob({ maxHp: 8, baseInitiative: 5, xpAward: 10 });
  export const SuperGooberEnemy = createSuperGoober({ xpAward: 50 });
  ```
- Reference these constants in your world/level definitions instead of inlining enemy creation logic.

---

## Caveats & Future Work
- **Persistence:** Progression state is currently in-memory only. Persistence (e.g., localStorage) is planned for a future task.
- **Scaling:** The system is designed for easy expansion to new worlds, levels, and enemy types.
- **Documentation:** Keep this file updated as the system evolves.

---

For further questions or to extend the system, see the code comments and referenced files.