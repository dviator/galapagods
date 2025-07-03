# Galapagods

A roguelike auto-battler prototype built with React, Vite, and Tailwind CSS.

---

## 🚀 Live Demo

The latest production build is always available at:

👉 [https://galapagods.vercel.app/](https://galapagods.vercel.app/)

---

## 🛠️ Tech Stack
- [React](https://react.dev/) (TypeScript)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🧑‍💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the dev server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Production Deployment

This project is deployed using [Vercel](https://vercel.com/):

- **Automatic Deployments:** Every push to the `main` branch triggers a new deployment.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Custom Domain:** [https://galapagods.vercel.app/](https://galapagods.vercel.app/)

### Manual Production Build

To test the production build locally:

```bash
npm run build
npm run preview
```

---

## 📄 Project Structure

- `src/` — Main application source code
- `public/` — Static assets
- `package.json` — Project scripts and dependencies
- `vite.config.ts` — Vite configuration

---

## 📝 License

MIT

# Design & Architecture Overview

## 1. Project Structure & Organization

- **Component-Driven UI**: All UI elements are React components, organized in `src/components/` for atomic UI (e.g., `UnitCard`, `HealthBar`, `InitiativeDisplay`, `ControlPanel`) and `src/screens/` for high-level views (`CombatScreen`, `ShopScreen`, `LabScreen`, `DeathScreen`).
- **State Management**: Centralized via React Context (`GameStateContext.tsx`), which manages the entire game state, including teams, rounds, combat log, phase transitions, and core game logic.
- **Domain Modeling**: All core game entities (units, attacks, stats, abilities) are strongly typed in `src/types/`, ensuring type safety and clear domain boundaries.
- **Data & Configuration**: Static data (character sheets, attacks) is separated into `src/data/`, making it easy to update or expand the roster and abilities.
- **Utilities & Core Logic**: Game mechanics (combat, unit creation, leveling, targeting) are encapsulated in `src/utils/units/`, promoting reuse and testability.
- **Custom Hooks**: Reusable logic (e.g., XP summary) is implemented as hooks in `src/hooks/`.

## 2. Key Architectural Decisions

- **Explicit Game Phases**: The game loop is modeled as explicit phases (`combat`, `shop`, `lab`, `death`), with transitions managed by context and phase-specific screens. This separation makes it easy to add new phases or modify flow.
- **Immutable State Updates**: All state changes (especially for teams and units) use deep cloning (`lodash.clonedeep`) to avoid mutation bugs and ensure React state updates propagate correctly.
- **Unit Abstraction**: Both player characters and enemies are modeled as `Unit`, with shared fields for stats, health, initiative, attacks, and abilities. This enables generic combat and UI logic.
- **Attack & Targeting System**: Attacks are defined as objects with name, base damage, direction, and a targeting rule. Targeting rules are pluggable functions, allowing for flexible attack patterns (e.g., AOE, front, right).
- **Stat-Driven Design**: All core mechanics (damage, initiative, health) are stat-driven, with clear separation between base stats (from character sheets) and derived/combat stats (e.g., current health, initiative).
- **Leveling & Progression**: Leveling logic is encapsulated in utility functions, with stat growth determined by genome grades, supporting future extensibility for evolution and gene editing.

## 3. UI/UX Patterns

- **Card-Based Display**: Units are displayed as cards (`UnitCard`), showing name, image, health bar, level, XP, attack, and initiative. Attack name and base damage are shown together for clarity.
- **Health & Initiative Visualization**: Health is visualized with a dynamic bar and numeric display; initiative is shown in both the card and initiative order list.
- **Phase-Driven Layout**: The main layout (`GameLayout`) adapts to the current phase, showing the appropriate screen and a persistent control panel and log area.

## 4. Extensibility & Guidance for New Work

- **Adding New Units/Attacks**: Define new character sheets and attacks in `src/data/`, then use them in team initialization or spawning logic.
- **Expanding Combat Mechanics**: Add new targeting rules or attack effects in `src/utils/units/attackTargeting.ts` and `src/data/attacks.ts`.
- **New Phases or Screens**: Add a new screen in `src/screens/`, update the phase enum/context, and add transitions in `GameStateContext.tsx`.
- **Stat/Evolution System**: Extend the `Genome` and `CharacterSheet` types, and update leveling logic in `src/utils/units/leveling.ts` for new progression mechanics.
- **UI Consistency**: Follow the card-based, stat-driven display patterns for new UI elements. Use Tailwind utility classes for styling.

## 5. Best Practices & Learnings

- **Type Safety**: Always extend and use the type system for new entities and mechanics.
- **Separation of Concerns**: Keep UI, state management, data, and core logic in their respective folders.
- **Immutability**: Never mutate state directly; always use cloning or new objects.
- **Reusability**: Encapsulate logic in utilities or hooks for reuse across components and screens.
- **Documentation**: Add comments and JSDoc to new types, utilities, and complex logic for future maintainers.

## 6. Open Questions & Next Steps

- **Passive Abilities & Triggers**: The system is ready for passive abilities, but the trigger/effect system needs to be fleshed out.
- **Evolution & Gene Editing**: The groundwork is laid for a gene-based progression system, but UI and logic for gene editing are still to be implemented.
- **Testing & Validation**: As the system grows, consider adding unit tests for core utilities and combat logic.
