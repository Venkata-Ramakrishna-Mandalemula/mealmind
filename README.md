# MealMind

MealMind is a food-discovery and ordering project being built incrementally with a Next.js customer app and a planned NestJS modular backend. The current implementation is a responsive Home-screen demo using fictional restaurant data, local keyword and cuisine filtering, open-only and saved-only filters, and temporary favorites.

The approved visual references are in [docs/design](docs/design). The first UI follows their warm off-white, orange, and dark-text direction while making the demo's limitations explicit.

## Run locally

Install dependencies from the repository root, which coordinates the npm workspaces:

```powershell
npm ci
npm run dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000`. The web application's source is under `apps/web/src`; its dependencies are declared in `apps/web/package.json`. The root lockfile covers the workspaces.

The current demo needs no API keys, database, Docker service, or environment file. Use a Node.js runtime that satisfies the installed Next.js and lint-tool dependency requirements. The previously used Node 20.16.0 runtime has produced a dependency engine warning; that warning should not be interpreted as a supported-runtime guarantee.

## What the demo does

- Renders the Home hero and a responsive restaurant grid.
- Searches the sample catalog by local text and applies cuisine, availability, and saved-only filters.
- Saves or unsaves restaurant IDs in the current page's React state.
- Handles empty results and missing restaurant images or ratings.
- Uses keyboard-accessible native controls, visible focus treatment, and responsive styles.

Restaurant names, ratings, availability, delivery estimates, and fees are illustrative records, not live business data. Food photographs illustrate the interface rather than actual restaurant offerings. Search is local matching, not AI interpretation. Favorites reset on reload and are not synchronized between browsers or users.

Menus, authentication, persisted favorites, an API, database, cart, checkout, payments, order tracking, and AI integrations have not been implemented. A displayed delivery fee is not an authoritative order quote.

## Project structure

```text
mealmind/
  apps/web/
    public/                    Public assets
    src/app/                   Routes, layout, and global styles
    src/components/            Shared layout and UI components
    src/features/restaurants/  Catalog types, sample data, and discovery UI
  docs/
    design/                    Approved visual references
    decisions.md               Architectural decisions and tradeoffs
    learning-log.md            Chronological project and interview guide
  package.json                 Workspace commands
  package-lock.json            Shared dependency lockfile
```

Backend and worker folders will be introduced when their implementation begins. Folder separation alone does not make this a microservices system; the planned NestJS API is one modular backend application.

## Check the code

Run from the repository root:

```powershell
npm run lint
npm run typecheck
npm run build
```

The TypeScript command generates Next.js route types before running `tsc --noEmit`. A production build checks compilation; browser interaction checks are also needed for filtering and favorites.

Run the focused browser suite after building:

```powershell
npm run build
npm run test:e2e
```

Playwright starts and stops its own production server at `http://127.0.0.1:3100`. Keep that port available. It tests desktop and mobile layouts using the installed Microsoft Edge on Windows. On other systems, first install its Chromium browser with `npm exec --workspace=@mealmind/web -- playwright install chromium`. You can choose a supported installed browser channel with `PLAYWRIGHT_CHANNEL`; for example, set `$env:PLAYWRIGHT_CHANNEL = "chrome"` in PowerShell to use Chrome.

The tests exercise combined filters, favorites across hidden/reappearing cards, refresh reset, keyboard focus, image loading, empty states, viewport overflow, reduced motion, and an axe accessibility scan. Automated checks do not replace manual screen-reader or real-device testing. Screenshots and failure traces are written to ignored `apps/web/test-results/`.

`next/font/google` may download the scaffold's Geist fonts during a build if they are not cached. The built app serves the fonts and food images locally to visitors. Photo sources are recorded in [asset credits](docs/design/asset-credits.md).

To run a built production server manually:

```powershell
npm run start --workspace=@mealmind/web
```

## Understand the project

Read [the learning log](docs/learning-log.md) for the chronological story: the original scaffold, repository decisions, TypeScript foundations, and the first React implementation. Each chapter explains the problem, code ownership, alternatives, tradeoffs, verification, common mistakes, and interview answers. New concepts are documented as implementation progresses; completed code does not imply the developer has personally demonstrated every concept.

Read [architecture decisions](docs/decisions.md) for concise records of choices that affect the system's structure. Begin exploring the UI at `apps/web/src/app/page.tsx`, then follow the restaurant explorer into its filters and cards.
