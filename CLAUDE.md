# Pocket Quant — Development Rules

These rules govern all development on this codebase. Follow all 100 rules — no exceptions.

---

## Part 1: Architecture & Code Quality (50 Rules)

### Architecture & Project Structure

**1.** Define clear module boundaries from day one. Design a generic data layer that takes parameters — never hardcode identifiers into the filesystem.

**2.** Never store business data in TypeScript files. The database is the single source of truth. No dual data sources.

**3.** Cap file length at 300 lines. No exceptions. Split by responsibility.

**4.** One API route = one responsibility. No multi-job route files.

**5.** Establish a consistent folder convention before writing code. Feature-based or layer-based — pick one and stick to it.

**6.** No page should import more than 5–7 direct dependencies. If wiring together 15+ things, you're missing an abstraction layer.

**7.** Separate "plumbing" from "porcelain." API routes are thin controllers that call service functions. No raw SQL, business logic, caching, error handling, and response formatting mixed together.

### Data Layer & Database

**8.** Use a migration system from the start. Use Drizzle Kit migrations properly — `drizzle-kit generate` and `drizzle-kit migrate`.

**9.** Validate ALL incoming data at the boundary. Every API route accepting JSON must validate with Zod schemas. No request body reaches business logic unvalidated.

**10.** Create a shared query layer — never call `db.select()` directly in routes. Define repository functions in a data access layer. Routes call those functions, not the ORM directly.

**11.** Don't use `ALTER TABLE IF NOT EXISTS` in application code. Schema changes belong in migrations, run at deploy time.

**12.** Add pagination to every list endpoint from day one. Always accept `limit` and `offset` (or cursor) params.

**13.** Define indexes based on query patterns. Review every WHERE clause and ensure a matching index exists.

**14.** Never use `as any` to shove data into an insert. Create proper mapper functions that produce the exact insert type.

**15.** Use transactions for multi-table writes. Partial inserts corrupt state.

**16.** Unbounded in-memory caches will eventually OOM. Use an LRU cache with a max size, or move caching to the database/Redis.

### Component Design

**17.** Default to server components. Only add `'use client'` when you need interactivity. Rethink what actually needs client-side state.

**18.** Extract data fetching from UI components. Separate fetch calls, state management, UI rendering, and business logic.

**19.** Use React Server Components for data loading. Instead of `useEffect` → `fetch` → `setState` → loading spinner, load data in server components and pass it down.

**20.** No component should manage more than 3–4 pieces of state. Decompose or lift state into a proper state management solution.

**21.** Create a component library with atomic building blocks. Before building features, build: Button, Card, Input, Select, Modal, Table, Badge, Tabs. Then compose features from these.

**22.** Never duplicate components. One source of truth per concept.

**23.** Separate "smart" containers from "dumb" presentational components. Presentational components only render. Containers fetch and pass data.

### State Management

**24.** Use URL state for anything the user should be able to bookmark or share. Tab selection, filters, sort orders, and search queries should be in the URL (searchParams), not useState.

**25.** Use server state libraries (SWR) instead of manual fetch + useState. SWR gives caching, revalidation, deduplication, and optimistic updates for free.

**26.** Minimize client-side state. Ask for every `useState`: can this be derived? Can this be a server component? Can this live in the URL? Only what's left should be `useState`.

**27.** Never store derived state. If you can compute it from other state, compute it. Don't `useState` it and try to keep it in sync.

### API Design

**28.** Design your API as a contract first. Define request/response types with Zod before writing implementation. Export these types for both server and client to share.

**29.** Use consistent error response format across all routes. One error shape: `{ error: string, code?: string }`. Every route returns this on failure.

**30.** Use proper HTTP methods and status codes. GET for reads, POST for creates, PATCH for updates, DELETE for deletes. Return 201 for created, 204 for no-content, 400 for bad input, 404 for not found.

**31.** Never let API routes leak implementation details. Internal error messages, stack traces, and database column names never appear in API responses.

**32.** Version your API from the start if you expect breaking changes. Even a simple `/api/v1/` prefix saves painful migrations later.

### Type Safety

**33.** Zero `as any` policy. Every `as any` is a future runtime error. If the types don't match, fix the types — don't cast.

**34.** Define types from the database schema, not alongside it. Use `$inferInsert` and `$inferSelect` consistently. Don't maintain parallel type definitions that drift.

**35.** Use discriminated unions for variant data. Model variants as TypeScript discriminated unions — not optional fields on both.

**36.** Make impossible states unrepresentable. Use union types so invalid combinations can't compile.

### Testing

**37.** Write tests from day one. No test debt. Before you write a feature, write the test. At minimum: one test per API route, one test per critical business logic function.

**38.** Test business logic in isolation, not through API routes. Extract logic into pure functions. Test those directly.

**39.** Set up CI that runs lint + typecheck + tests on every push. `npm run lint && npx tsc --noEmit && npm test` should gate every merge.

**40.** Add integration tests for critical flows. End-to-end workflows should be automated tests, not manual verification.

### Error Handling & Observability

**41.** Replace console.log with structured logging. Use the logger with levels (debug/info/warn/error), timestamps, and context.

**42.** Handle errors at the boundary, not everywhere. Use error boundaries for React components and a global error handler for API routes. Individual functions should throw, not try/catch and swallow.

**43.** Never swallow errors silently. `catch (e) {}` hides bugs. Either handle the error meaningfully or let it propagate.

**44.** Add request tracing. Generate a request ID at the middleware level, pass it through to all logs.

### Security

**45.** Move from PIN auth to a real auth system. Consider NextAuth/Auth.js with proper sessions, CSRF protection, and role-based access.

**46.** Validate and sanitize all user inputs. This should be systemic (middleware-level), not per-route.

**47.** Never store secrets in code or data files. Environment variables only, validated at startup. If a required env var is missing, fail fast with a clear error.

### Performance & DX

**48.** Set a bundle budget and measure it. Track client JS bundle size. Set a budget (e.g., 200KB gzipped).

**49.** Use code splitting and lazy loading for heavy features. Large components should not be in the initial bundle. Dynamic import them.

**50.** Delete dead code aggressively. Every line in the codebase should earn its place. If you're not sure it's used, delete it and see what breaks (tests will catch it).

### Priority Order (Top 10)

If you only do 10: **9** (validate inputs), **37** (write tests), **3** (small files), **8** (use migrations), **1** (module boundaries), **17** (server components), **10** (query layer), **25** (SWR), **33** (zero `as any`), **41** (structured logging).

---

## Part 2: Entity Implementation Rules (50 Rules)

Rules for adding new entities, maintaining existing ones, and evolving the analysis platform.

### Registry & Scaffolding (Rules 1–8)

**E1.** Every entity must exist in exactly four registries: `src/lib/entities.ts` (EntityMeta), `src/data/entity-context.ts` (EntityContext), `src/data/tab-registry.ts` (TabConfig[]), and `src/data/{entityId}/index.ts` (barrel exports). Missing any registry causes silent feature breakage.

**E2.** The entity registry (`entities.ts`) is the single source of truth for "does this entity exist?" API routes validate identifiers against `VALID_ENTITIES`. Coverage pages read from `COVERAGE_ENTITIES`. Detail pages check `hasFullProfile`. Never hardcode entity lists anywhere else.

**E3.** Use the scaffolding route to create entity data files, then fill in manually. Never manually create entity data directories. Scaffolding guarantees consistent structure.

**E4.** Set `hasFullProfile: true` only when the entity has both complete data files AND a working analysis component. A `GenericProfile.tsx` fallback renders for partial coverage.

**E5.** Every new entity must have an `EntityContext` entry containing at minimum: id, name, category, domain, description, primaryFocus. Empty arrays for optional fields are acceptable at first. Use `createStarterContext()` for boilerplate.

**E6.** New entities receive `defaultTabs` from the tab registry. Entity-specific tabs are added only after the corresponding custom component is implemented.

**E7.** When adding an entity to advanced coverage, register its id in `COVERAGE_ENTITIES` exactly once. All views import this single list.

**E8.** Any external identifier mapping must be updated when an entity requires integration with a third-party source. Missing mappings = no data.

### Data Files & Barrel Exports (Rules 9–18)

**E9.** Barrel export rule is absolute: every export in `src/data/{entityId}/*.ts` MUST be re-exported in that entity's `index.ts`. Unexported items are invisible. This is the #1 cause of "data exists but does not appear" bugs.

**E10.** Never add a data file without immediately updating the barrel. This is not a "later" task.

**E11.** Data file structure must be identical across all entities. Every entity receives the same core files. Domain-specific files are additive only — never replacements.

**E12.** Every data file must export a `DataMetadata` constant first: `{ lastUpdated, source, nextExpectedUpdate, notes? }` — powers freshness indicators.

**E13.** Use shared types from `src/data/shared/types.ts` for all structures. No one-off interfaces in entity files. Add new types to the shared file first.

**E14.** Truly entity-unique types live in `shared/types.ts` with descriptive names that reveal their scope.

**E15.** All data arrays must be explicitly typed with shared interfaces. `const UPCOMING_EVENTS: Event[] = [...]` — catches drift at compile time.

**E16.** Dates in data files use ISO format only: `YYYY-MM-DD`. Enables reliable sorting, comparison, and formatting.

**E17.** Quantitative values follow a consistent unit convention (documented in JSDoc). Never mix units within one entity's data set.

**E18.** Every data file begins with a structured freshness comment block: `LAST UPDATED: YYYY-MM-DD` / `NEXT UPDATE: description`. AI-assisted maintenance tools rely on this.

### No Hardcoding (Rules 19–28)

**E19–E24.** Never hardcode entity identifiers, names, categories, stakeholders, peers, domain metrics, or similar attributes in components, prompts, logic, or conditions. Always read from `EntityContext` via prop or registry lookup.

**E25.** Workflow/analysis prompts use `{{PLACEHOLDER}}` templates. One template per workflow type. A resolver populates placeholders from `EntityContext` at runtime.

**E26.** Shared visual/style mappings (colors, badges, filters, icons) live in one central config file. Never duplicate per entity.

**E27.** Important numbers/values belong in data files — never hardcoded in JSX or logic.

**E28.** All magic numbers appearing in calculations must be named constants with explanatory comments.

### Shared Components (Rules 29–38)

**E29.** Every standard tab/analysis view has exactly one shared component. Use it. Never duplicate tab implementations per entity.

**E30.** Shared tab components are pure and receive prepared data via props. Entity-specific pages import + transform data, then pass it down.

**E31.** Entity-specific tabs are the only acceptable place for truly unique UI/logic. If a pattern applies to 2+ entities, extract it to shared/.

**E32–E33.** Core UI building blocks (header, chart, navigation, live indicators, freshness display) are shared and prop-driven.

**E34.** Extract repeating patterns from entity-specific tabs into `src/components/shared/`.

**E35.** Shared component props use typed interfaces from dedicated type files in `src/components/shared/*Types.ts`.

**E36.** Wrap every entity analysis root in an error boundary.

**E37.** Use the shared `UpdateIndicators` component for all freshness/last-updated display.

**E38.** Global banners/disclaimers are imported from shared — never duplicated.

### Content Ingestion & Updates (Rules 39–44)

**E39.** Follow the mandatory ingestion checklist for every update. Missing updates = data inconsistency.

**E40.** Chronological content (news, events, updates) is added newest-first (reverse chronological order).

**E41.** New items default to untracked/advisory status. Production tracking status comes from the database.

**E42.** Important ingested items include cross-references to affected data sections.

**E43.** Timeline / historical entries are append-only and immutable. Never edit or delete past entries — add clarifying follow-up entries when interpretation changes.

**E44.** When a tracked event completes/moves to history, relocate it to the completed section rather than deleting it. Preserves context and accuracy history.

### Component Architecture (Rules 45–50)

**E45.** Entity detail components must not exceed 500 lines. Break monoliths into data-prep, tab-dispatcher, and per-tab wrapper layers (each < 300 lines).

**E46.** Entity pages are thin orchestrators: import data, map to shared component props, render active tab.

**E47.** Entity-specific UI state (active tab, filters, expanded sections) lives in URL search params — never local `useState`.

**E48.** Every entity component follows the unified maintenance protocol (documented update procedure).

**E49.** Analysis archives are append-only. Each update creates a dated, complete snapshot of prior state. Never overwrite or delete history.

**E50.** Structural improvements must be applied uniformly across all entities. Divergence creates compounding maintenance debt.

### Entity Priority Order (Top 10)

If you can only follow 10: **E9** (barrel exports), **E19** (no hardcoding identifiers), **E25** (template-based prompts), **E29** (use shared tab components), **E1** (four registries), **E11** (identical core file structure), **E39** (ingestion checklist), **E45** (500 line cap), **E13** (shared types everywhere), **E43** (append-only timeline/history).

---

## Part 3: Engineering Discipline & Execution Standards

Core operating principles for all development work on this codebase.

### Execution Mode

**X1.** Plan first. Enter planning mode for any non-trivial task (3+ steps or architectural impact). Create a structured plan BEFORE writing code. Save plan as checklist-style steps.

**X2.** Re-plan on failure. If something breaks, assumptions fail, or output diverges: STOP, diagnose root cause, create a new plan. Never continue executing a broken plan.

**X3.** No blind execution. Do NOT jump into coding without understanding the system.

### System Understanding

**X4.** Before making changes, identify: entry points, core modules, data flow, dependencies. Map: Users → Frontend → Backend → Data Stores → External Services.

**X5.** If information is missing, state assumptions explicitly. Minimize hallucination.

### Architecture Documentation

**X6.** When analyzing the codebase, maintain `ARCHITECTURE.md` with: project structure, system diagram, core components, data stores, external integrations, deployment/infra, security considerations, dev/testing setup, future considerations, and glossary. Use strict Markdown, be specific not generic, mark assumptions clearly.

### Subagent Strategy

**X7.** Decompose complex problems. Assign ONE responsibility per sub-task. Parallelize when useful (research, debugging, refactoring analysis). Keep reasoning structured and isolated.

### Implementation Standards

**X8.** Write clean, maintainable, idiomatic code. Follow existing project conventions. Prefer clarity over cleverness.

**X9.** Change minimization. Modify ONLY what is necessary. Avoid ripple effects.

**X10.** Root cause focus. Never implement superficial fixes. Solve underlying issues.

### Verification

**X11.** Validate before declaring success: run tests, check logs/outputs, compare expected vs actual behavior, consider edge cases. Ask: "Would a staff engineer approve this?" If NO → iterate.

### Debugging

**X12.** When given a bug: do NOT ask unnecessary questions. Investigate logs, errors, failing tests. Identify root cause. Implement fix. Verify with evidence.

### Engineering Judgment

**X13.** For non-trivial changes, evaluate: Is there a simpler solution? Is this scalable? Is this maintainable? If solution feels hacky → redesign. Avoid over-engineering simple problems and premature abstraction.

### Task Management Discipline

**X14.** Follow this workflow for every task: (1) PLAN — define clear steps, (2) VERIFY PLAN — ensure correctness before execution, (3) EXECUTE — implement step-by-step, (4) TRACK PROGRESS — mark completed steps, (5) EXPLAIN — provide high-level reasoning, (6) DOCUMENT — record results and decisions, (7) LEARN — capture mistakes and improvements.

### Self-Improvement Loop

**X15.** After mistakes, failed assumptions, or corrections: extract the lesson, generalize into a rule, apply it going forward. Goal: reduce repeated errors over time.

### Security & Safety

**X16.** Always consider: authentication & authorization, data protection (in transit & at rest), secrets handling, input validation, OWASP risks.

### Output Style

**X17.** Be structured and technical. Use headings, bullet points, code blocks. Avoid fluff and vague statements. Be concise but complete.

### Core Principles

- **Simplicity First** → minimal, effective solutions
- **No Laziness** → fix root causes
- **Minimal Impact** → avoid unnecessary changes
- **High Accountability** → prove correctness
- **Clarity Over Cleverness**
