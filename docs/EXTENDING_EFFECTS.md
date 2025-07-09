# (moved from project root)
# Extending the Effect System

This document explains how to add new item effects, trigger UI outcomes, and maintain clean separation between effect logic and UI/business logic in the Galapagods codebase.

---

## Overview

- **Effects** are plain objects with a `name`, `description`, and an `apply` function.
- **UI state** (e.g., popups, highlights) is managed at the screen/component level (e.g., ShopScreen) and passed to effects via a context object.
- **Effect logic** is fully encapsulated in the effect implementation. No effect-specific UI logic should exist in the screen/component code.

---

## Adding a New Effect

1. **Define the Effect**
   - Create a new effect object in `src/utils/units/effects.ts` (or a new file if preferred).
   - The `apply` function receives the target unit and a context object.
   - The context object can include UI state setters (e.g., `setFlashUnitId`, `setHealedUnitId`, `showGeneticPopup`) and any effect-specific config.

```typescript
// Example: src/utils/units/effects.ts
export const MyCustomEffect: Effect = {
  name: 'My Custom Effect',
  description: 'Does something special and shows a popup.',
  apply: (unit, context) => {
    // Your effect logic here
    if (context?.setFlashUnitId && context.unitId) {
      context.setFlashUnitId(context.unitId);
      setTimeout(() => context.setFlashUnitId && context.setFlashUnitId(null as unknown as string), 500);
    }
    // Return the updated unit
    return { ...unit, /* ...changes... */ };
  },
};
```

2. **Assign the Effect to a Shop Item**
   - In `src/data/shopItems.ts`, add your effect to a shop item:

```typescript
import { MyCustomEffect } from '../utils/units/effects';

export const SHOP_ITEMS: ShopItem[] = [
  // ...
  {
    name: 'Special Flash',
    description: 'Flashes the unit.',
    price: 2,
    target: 'character',
    effect: MyCustomEffect,
    effectName: 'MyCustomEffect',
    config: {},
  },
];
```

3. **UI State is Passed Automatically**
   - The ShopScreen passes all relevant UI state setters and the `unitId` to the effect context:

```typescript
const context = {
  ...item.config,
  setFlashUnitId,
  setHealedUnitId,
  showGeneticPopup,
  unitId,
};
```

---

## Best Practices

- **Encapsulate all effect-specific UI logic in the effect implementation.**
- **Do not add effect-specific UI logic to ShopScreen or other screens.**
- **If you need a new UI outcome (e.g., a new popup), add a state variable and setter at the screen level, and pass it to the effect context.**
- **If you give a UI element a name (e.g., "GeneticPopup"), extract it into its own component.**
- **Keep effect logic and UI/business logic decoupled for maintainability and extensibility.**

---

## Example: Genetic Potential Effect

```typescript
export const GeneticPotentialEffect: Effect = {
  name: EffectName.GeneticPotential,
  description: 'Increase a random genome stat grade by one (S is max)',
  apply: (unit, context) => {
    const result = applyGeneticPotentialEffect(unit);
    if (context?.showGeneticPopup && context.unitId && result.stat && result.newGrade) {
      context.showGeneticPopup(context.unitId, result.stat, result.newGrade);
    }
    return result.updated;
  },
};
```

---

## Summary of Current Architecture

- **Effect logic** is defined in `src/utils/units/effects.ts`.
- **Shop items** are defined in `src/data/shopItems.ts` and reference effect objects.
- **UI state** (e.g., popups, highlights) is managed at the screen/component level and passed to effects via context.
- **UI elements** with names (e.g., `GeneticPopup`) are extracted into their own components.
- **Adding new effects** is as simple as defining a new effect object and assigning it to a shop item.

---

For questions or further examples, see the code comments in `src/utils/units/effects.ts` and `src/screens/ShopScreen.tsx`.