# Galapagods Project Guidelines

## Type System

### Never use `as any` - Always prefer proper typing
When you need to cast a type, use a specific type instead of `any`. Examples:
- **Bad**: `{ ferocity: 'A' as any }`
- **Good**: `{ ferocity: GeneGrade.A }` (import the enum)

If you must cast, be very explicit about what type you're casting to. Document *why* the cast is necessary.

### Use enums directly in type definitions
Always import and use available enums instead of string/number literals:
- **Bad**: `genome: { ferocity: 'A', survival: 'A' }`
- **Good**: `genome: { ferocity: GeneGrade.A, survival: GeneGrade.A }`

See `/src/types/stats.ts` for the `GeneGrade` enum.

## Variable Declaration

### Prefer `const` over `let`
Only use `let` when the variable will be reassigned. ESLint will catch this with `prefer-const`.

## Code Style

- Use available enums directly in type definitions whenever possible
- Do not add comments that do not provide significant value beyond reading the code
- Clarify major design decisions that affect the system architecture for the user before proceeding to implement the code

## Testing

- Use Vitest for unit tests (configured in `vite.config.ts`)
- Tests should be properly typed with no `as any` casts
- Target >90% code coverage for critical systems
- Run `npm test` to execute all tests
