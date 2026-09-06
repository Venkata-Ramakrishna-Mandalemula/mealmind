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
