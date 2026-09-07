# MealMind Architecture Decisions

This document records architectural decisions that affect the long-term structure of MealMind. Each entry explains the problem, considered options, selected decision, reasoning, and accepted tradeoffs.

## ADR-001: Use a lightweight npm-workspaces monorepo

- **Status:** Accepted
- **Date:** 2026-09-06

### Problem

MealMind began as a Next.js and TypeScript application scaffolded directly in the repository root. The approved architecture will later include a NestJS API and may include a background worker when asynchronous processing becomes necessary.

Leaving the web application at the repository root would make the root serve two purposes: the complete MealMind repository and one specific runnable application. Frontend dependencies, commands, and configuration would appear repository-wide, while later applications would have different ownership and directory conventions.

### Options considered

1. Keep the Next.js application at the repository root and place later applications in subdirectories.
2. Store the frontend and backend in separate repositories.
3. Use npm workspaces with applications under `apps/`.
4. Introduce a monorepo framework such as Nx or Turborepo.

### Decision

Use a lightweight npm-workspaces monorepo. Preserve the existing Next.js scaffold as `apps/web`. Introduce `apps/api`, `apps/worker`, `packages`, and infrastructure directories only when they acquire real responsibilities.

The repository root owns workspace coordination, repository-wide documentation, the shared lockfile, and cross-workspace commands. Each application owns its direct dependencies and configuration.

### Why

- Gives the web application and future API symmetrical, explicit boundaries.
- Keeps related applications and documentation in one Git history.
- Allows one npm installation and lockfile while preserving dependency ownership.
- Supports shared packages later without requiring package publication.
- Avoids the operational overhead of multiple repositories.
- Avoids introducing a larger monorepo framework before its caching or task-orchestration features solve a demonstrated problem.

### Tradeoffs

- Workspace configuration is more complex than a single root application.
- Commands must identify the relevant workspace or intentionally operate across workspaces.
- CI and deployment must respect application boundaries.
- A shared repository can create coupling if package ownership is not enforced.
- npm workspaces provide fewer orchestration and caching features than Nx or Turborepo; one can be evaluated later if build scale justifies it.

### Resulting structure

```text
mealmind/
├── apps/
│   └── web/
├── docs/
├── package.json
└── package-lock.json
```

The API, worker, shared packages, and infrastructure are intentionally absent until their implementation phases.

## ADR-002: Build the first discovery UI with local state and the existing CSS Modules setup

- **Status:** Accepted for the Day 2 foundation
- **Date:** 2026-09-07

### Problem

The first usable Home section needs reusable cards, basic exploration, and consistent styling before business APIs exist. The user requested faster implementation with concepts documented and fewer intermediate questions.

### Options considered

1. Keep the scaffold's CSS Modules, add shared CSS design tokens, and use local React state for prototype interactions.
2. Install Tailwind CSS now and replace the styling setup.
3. Introduce global state, API fetching, or persistent favorites before the backend phase.

### Decision

Keep CSS Modules for scoped component styles and global CSS for tokens, focus, and resets. Tailwind was an earlier recommendation, not an installed dependency; continuing the existing setup avoids a migration for this small UI. Use a Server Component page for composition and a Client Component explorer for keyword, cuisine, open-only, and saved-only filtering. The explorer owns saved restaurant IDs and passes callbacks and values into cards.

Add optional photo metadata and unrated support to the existing restaurant model using explicit nullable values. Use six clearly fictional local fixtures and stock photos. Display sample-data and session-only favorite disclosures. No order, identity, location, or natural-language functionality is implied.

### Why

The closest common parent can own the interaction state, and filtered results can be computed directly from that state and props. This makes Redux, network-state tooling, synchronization effects, and premature memoization unnecessary. `useRef` has one immediate purpose: moving focus to a stable target when an action removes its own button.

### Tradeoffs

- Favorites and filters reset on refresh; this is a local UI prototype, not the eventual account or shareable-search contract. URL state and server persistence will arrive with their features.
- CSS Modules require explicit CSS and token discipline; a later styling change should be discussed if the approach proves inadequate.
- Client rendering receives the entire six-record sample list. The production API must provide server-side filtering and pagination when data grows.
- Cuisine filters currently use the first listed cuisine as a category; this is a fixture convention, not a final database taxonomy.
- The Home reference is implemented incrementally. Account/cart links, smart search, restaurant routes, and the full mobile navigation await functioning destinations.
- Brighter brand orange is supported by darker text/focus shades for legibility. The current Geist font is retained. Original reference image files are preserved.

### Verification approach

Lint, generated Next.js route types, TypeScript, and a production build precede browser checks. Playwright and axe are development dependencies for focused behavior and automated accessibility tests; they are not runtime application dependencies. The browser suite covers desktop and mobile viewports, combined filtering, saved-state lifecycle, focus recovery, missing-data presentation, images, and viewport overflow. Passing automated checks does not establish full accessibility conformance or measured production performance.
