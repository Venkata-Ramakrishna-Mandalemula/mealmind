# MealMind Learning and Interview Log

This is the living technical story of MealMind. It is written for both the project's developer and a new reader who wants to understand what MealMind is, why its architecture evolved as it did, how its important code works, and which engineering concepts were learned along the way.

Update it whenever a significant concept is taught or implemented. Do not record concepts as isolated definitions: connect each one to the problem that introduced it, the MealMind decision, the implementation, the alternatives and tradeoffs, and the way the result was verified. A concept is not marked as understood merely because related code exists.

## How to read this document

A new contributor can read this document from top to bottom as the chronological story of the project. Each concept should answer:

1. What problem did we encounter?
2. What does the concept mean in plain language?
3. How does it work?
4. Why did MealMind choose it?
5. What alternatives did we consider?
6. What was implemented, and where?
7. How did we verify it?
8. What mistakes or tradeoffs should a developer know?
9. How could the concept be discussed in an interview?

Architecture decisions are recorded in [decisions.md](decisions.md). This document remains the readable learning narrative and links those decisions to the order in which the system was built. [The project README](../README.md) provides the current setup and demo scope.

### Working agreement from Day 2 onward

On 2026-09-07, the developer requested faster implementation and fewer questions between changes. Work now proceeds in coherent implementation steps, with the reasoning, code references, verification, alternatives, and interview answers recorded here as part of the same change. Routine concepts do not require a quiz before implementation can continue. Questions are reserved for choices that materially change the requested product or cannot safely be resolved from the agreed scope.

Self-check exercises remain available for later study. An implementation completed by the assistant is evidence about the code, not evidence that the developer has personally demonstrated that concept. Future entries distinguish implementation status from learning status; new concepts remain introduced until the developer provides evidence of understanding.

## The project story so far

MealMind began as a Next.js and TypeScript scaffold created directly in the repository root. That layout was valid for a frontend-only project, but the approved architecture will eventually include a customer web application, a NestJS API, and a background worker when one is justified.

The first architectural decision was therefore to preserve the scaffold while reorganizing the repository as a lightweight npm-workspaces monorepo. The existing Next.js application became `apps/web`; it was not regenerated. The repository root now coordinates workspaces, while each application owns its direct dependencies.

Next, the App Router moved from `apps/web/app` to `apps/web/src/app`. This separates frontend source code from application configuration. The approved visual references were preserved in `docs/design`, but no MealMind UI was implemented during the structural phase.

Before creating product screens, development moved into TypeScript foundations. A small restaurant summary model introduced object types, arrays, nested types, literal types, integer minor currency units, nullability, runtime-validation boundaries, and feature-based ownership. That model currently lives with the restaurant feature rather than in a global collection of unrelated types.

At the end of Day 1, the workspace structure and first domain types were established. The customer UI, backend, database, authentication, state libraries, and AI functionality had not been introduced. The Day 2 chapter continues the story from that checkpoint.

## How progress is recorded

| Status | Meaning |
| --- | --- |
| Introduced | The concept has been explained. |
| Practiced | The developer has attempted an exercise or implementation. |
| Demonstrated | The concept has been explained correctly in the learner's own words. |
| Revisit | The concept needs another exercise or later review. |

Understanding can be demonstrated by explaining a concept, predicting behavior, implementing a small example, diagnosing mistakes, comparing alternatives, or revisiting it later. These are optional study activities as development progresses, not mandatory gates before every change.

Implementation status is recorded separately in each chapter. A successful build verifies a property of the software; it does not change the learner's status to demonstrated.

## Current progress

| Concept | Status | Evidence |
| --- | --- | --- |
| Repository, application, and workspace boundaries | Demonstrated | Correctly classified root, frontend, and generated files. |
| npm workspace dependency ownership | Demonstrated | Explained why frontend dependencies belong to `apps/web`. |
| Monolith, modular monolith, and microservices | Demonstrated | Explained that one deployable NestJS API is a monolith. |
| Node.js and NestJS relationship | Demonstrated | Explained that NestJS runs on Node.js. |
| Next.js project organization | Practiced | Reviewed `src/app`, feature folders, shared components, and configuration boundaries. |
| TypeScript object and array types | Practiced | Attempted and corrected `RestaurantSummary`. |
| Nested types and money representation | Demonstrated | Explained why money contains minor units and currency. |
| Literal and union types | Practiced | Correctly explained that only listed union members are valid after correction. |
| Required, optional, and nullable properties | Demonstrated | Correctly selected a required nullable image property. |
| Compile-time types versus runtime validation | Demonstrated | Explained that API responses require runtime validation such as Zod. |
| Feature-based type ownership | Demonstrated | Explained why restaurant types belong near the restaurant feature. |
| `type` versus `interface` | Demonstrated | Selected a type alias for a string-literal union and explained the contract distinction. |
| Type composition and intersections | Demonstrated | Explained that an intersected value must satisfy every combined type. |
| Function parameter and return types | Demonstrated | Explained that numeric business constraints still require runtime validation. |
| Type narrowing and control-flow analysis | Demonstrated | Explained that returning from the null branch leaves only `RestaurantSummary`. |
| `unknown` versus `any` | Demonstrated | Explained that unknown LLM output must be validated before safe application use. |
| Domain models, API DTOs, and UI state | Demonstrated | Classified filter-panel visibility as temporary UI interaction state. |
| Architecture decision records | Demonstrated | Explained the ownership tradeoff of keeping Next.js at the repository root. |
| React components, JSX, typed props, and composition | Introduced | Illustrated by the Day 2 Home, cards, and shared button; personal exercise not recorded. |
| Local state, controlled inputs, and immutable updates | Introduced | Illustrated by the restaurant explorer and temporary favorites. |
| Derived data, rendering purity, and stable list keys | Introduced | Illustrated by combined filtering, counts, and restaurant ID keys. |
| Server/Client Component boundaries and hydration | Introduced | Explained through the server page and interactive explorer. |
| CSS Modules, design tokens, responsive layout, and images | Introduced | Explained through the first Home implementation. |
| Accessible controls and UI verification | Introduced | Explained through labels, toggles, focus, empty states, and browser checks. |

---

## 1. Repository, applications, and workspaces

### The problem

MealMind will eventually contain a customer web application, an API, and possibly a background worker. Keeping frontend-specific files at the repository root would blur ownership as the system grows.

### Core terms

- **Repository:** The complete MealMind codebase and Git history.
- **Application:** A runnable program, such as the Next.js web app or future NestJS API.
- **Workspace package:** A package with its own `package.json` managed from the repository root.

### MealMind decision

Use a lightweight npm-workspaces monorepo:

```text
mealmind/
├── apps/
│   └── web/       # Next.js customer application
├── docs/
├── package.json   # Workspace coordinator
└── package-lock.json
```

The API and worker directories will be introduced only when those applications exist. We are not creating empty architecture for appearance.

### Dependency ownership

A dependency belongs to the package that directly uses it:

- `apps/web` declares Next.js and React.
- The future `apps/api` will declare NestJS.
- The future worker will declare BullMQ when required.
- The root coordinates workspace-level commands.

npm may physically hoist dependencies into the root `node_modules`. Physical installation location does not change logical ownership.

### Why this matters in interviews

Clear ownership reduces accidental coupling, makes builds reproducible, and shows which application requires each dependency.

### Interview questions

1. What is the difference between a repository, an application, and a workspace package?
2. Why should a dependency be declared by the package that directly uses it?
3. Does putting several applications in one repository make them microservices?
4. What is dependency hoisting, and does it change dependency ownership?

---

## 2. Monoliths, modular monoliths, and microservices

### Monolith

A monolith is one backend application that is built and deployed as a unit. Its features usually communicate through in-process calls and can use one database.

### Modular monolith

A modular monolith is one deployable backend with deliberate internal domain boundaries:

```text
NestJS API
├── restaurant module
├── cart module
├── pricing module
├── order module
└── AI orchestration module
```

The modules are logically separated, but they run and deploy together.

MealMind starts as a modular monolith because it provides clear organization without introducing distributed-system complexity.

### Microservices

Microservices are independently running and deployable services. They commonly communicate over a network and may own separate data.

They introduce concerns such as:

- Network failures and timeouts
- Distributed transactions
- Eventual consistency
- Cross-service authentication
- Message retries and idempotency
- Distributed logging and tracing
- More complex testing and deployment

Microservices are justified when independent scaling, deployment, ownership, or reliability boundaries solve a real problem. Folder names alone do not determine the architecture.

### MealMind decision

The Month-1 NestJS API will be one modular monolith. We will not introduce microservices, Kafka, or Kubernetes without an explicitly approved requirement.

### Interview questions

1. What distinguishes a modular monolith from microservices?
2. What benefits does a modular monolith retain?
3. What distributed-system problems appear with microservices?
4. When would splitting a module into an independent service be justified?

---

## 3. Node.js and NestJS

### Relationship

```text
Operating system
└── Node.js runtime
    └── NestJS framework
        └── MealMind API
```

Node.js executes JavaScript outside the browser and provides runtime capabilities such as HTTP, file access, environment variables, networking, and asynchronous I/O.

NestJS is a backend framework that runs on Node.js. It adds conventions and tools for larger applications:

- Modules group related capabilities.
- Controllers receive requests.
- Services/providers contain application behavior.
- Dependency injection supplies dependencies.
- Guards enforce authentication and authorization.
- Pipes transform and validate input.
- Exception filters centralize error handling.
- Interceptors wrap request processing.

NestJS does not replace Node.js. We will learn Node.js fundamentals before depending heavily on NestJS abstractions.

### Interview questions

1. Is NestJS an alternative to Node.js?
2. What does Node.js provide that NestJS runs on top of?
3. What problem does a structured framework solve compared with a basic HTTP server?
4. What responsibilities belong in a controller versus a service?

---

## 4. Next.js application organization

### Frontend structure at the Day 1 checkpoint

```text
apps/web/
├── public/
├── src/
│   ├── app/
│   └── features/
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

Folders are added when they acquire a real responsibility.

### `public`

Contains files served directly by the web application, such as public images and icons. It must not contain secrets, React components, or private data.

### `src/app`

The Next.js App Router directory. It owns route entry points and route-level behavior.

Important conventions:

- `page.tsx` makes a route accessible.
- `layout.tsx` wraps child routes with shared UI.
- `loading.tsx` defines a route loading state.
- `error.tsx` defines an error boundary and recovery UI.
- `not-found.tsx` represents missing resources.
- `[restaurantId]` is a dynamic route segment.
- `(customer)` is a route group and does not appear in the URL.

### `src/features`

Contains product-specific frontend behavior grouped by capability:

```text
features/
├── restaurants/
├── search/
├── cart/
└── orders/
```

Feature-specific components, hooks, schemas, API functions, and types remain near their owning feature.

### Route versus feature responsibility

`src/app/restaurants/[restaurantId]/page.tsx` defines how the URL enters the application. The restaurant feature contains the restaurant-specific presentation and behavior composed by that route.

Route files should not grow into large files containing presentation, data access, forms, and business rules together.

### Generated directories

- `.next` contains generated Next.js development and build output.
- `node_modules` contains installed dependencies.

They are reproducible artifacts rather than application source and are not committed.

### Next.js generated route types

Next.js 16 generates route-aware helpers such as `LayoutProps`. A clean standalone TypeScript check must generate these types first:

```text
next typegen
→ tsc --noEmit
```

`next dev` and `next build` also generate them.

### Interview questions

1. What is the difference between `src/app` and `src/features`?
2. What makes an App Router folder publicly routable?
3. What is the purpose of a route group?
4. Why should generated output not be committed?
5. Why might `next typegen` run before `tsc` in CI?

---

## 5. TypeScript foundations

### The problem TypeScript solves

JavaScript discovers many type mistakes only while code is running. TypeScript analyzes source code before execution and reports incompatible operations earlier.

```ts
function calculateTotal(priceInCents: number, quantity: number): number {
  return priceInCents * quantity;
}

calculateTotal("fourteen dollars", 2); // Compile-time error
```

### Type inference

TypeScript can infer obvious local types:

```ts
const restaurantName = "Spice Route";
```

An explicit `: string` annotation adds little here. Explicit types are most valuable at important boundaries, function parameters, return values, and domain models.

### Object and array types

The first Day 1 model was intentionally small; the Day 2 chapter records the later image and nullable-rating additions:

```ts
type RestaurantSummary = {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  deliveryMinutes: number;
  deliveryFee: Money;
  isOpen: boolean;
};
```

`string[]` means an array whose elements must be strings. `deliveryFee: Money` is a nested object type.

### Money and integer minor units

Binary floating-point arithmetic can produce surprising decimal results:

```ts
0.1 + 0.2; // 0.30000000000000004
```

MealMind represents authoritative monetary amounts using integer minor units:

```ts
type Money = {
  amountInCents: number;
  currency: "USD";
};

const deliveryFee: Money = {
  amountInCents: 249,
  currency: "USD",
};
```

`249` represents `$2.49`. Formatting is a display responsibility; deterministic backend logic will eventually own authoritative calculations.

The TypeScript `number` type does not itself enforce integer cents, safe numeric range, or nonnegative prices. Runtime validation must enforce the applicable constraints when external data and business calculations are introduced. USD is the only currency in this model; a future currency expansion must account for each currency's minor-unit rules.

### Literal and union types

A literal type permits one exact value:

```ts
currency: "USD";
```

A union permits one member from an explicit set:

```ts
type RestaurantStatus = "OPEN" | "CLOSED" | "CLOSING_SOON";
```

`"BUSY"` and `"closed"` are invalid. Literal values are exact and case-sensitive.

### Required, optional, and nullable properties

```ts
description: string;        // Required string
description?: string;       // May be absent
description: string | null; // Required property; value may be null
```

“Not provided” and “known to have no value” can represent different domain states.

### Compile-time types versus runtime validation

TypeScript types are erased when JavaScript runs. They can reject incorrect values written in checked source code:

```ts
const rating: RestaurantSummary["rating"] = "four"; // Compile-time error
```

TypeScript cannot automatically prove that external API, form, environment, database, or LLM data is valid at runtime.

```text
Untrusted external value
→ runtime schema validation
→ trusted typed value
→ application behavior
```

MealMind will later use Zod at appropriate boundaries. This is especially important for LLM output because all model output is untrusted.

### Type ownership

Types should remain near the feature that owns them:

```text
src/features/restaurants/types/restaurant-summary.ts
```

A global `src/types` folder should contain only definitions genuinely shared across unrelated features. `Money` can move to shared ownership when another real feature needs it; it should not be abstracted prematurely.

### `type` versus `interface`

Both constructs can describe an object:

```ts
type Restaurant = {
  id: string;
  name: string;
};

interface RestaurantContract {
  id: string;
  name: string;
}
```

A type alias can name any TypeScript type, including primitives, object types, tuples, unions, and intersections:

```ts
type RestaurantId = string;
type Coordinates = [number, number];
type RestaurantStatus = "OPEN" | "CLOSED" | "CLOSING_SOON";
```

An interface primarily declares an object contract. Interfaces can extend other interfaces and support declaration merging. They cannot directly represent a union of string values.

MealMind generally uses `type` for domain data, aliases, unions, and composition. An `interface` remains appropriate when an intentionally extendable object contract is clearer. This is a convention rather than a claim that one construct is universally better.

### Type composition and intersections

An intersection combines the requirements of multiple types:

```ts
type RestaurantIdentity = {
  id: string;
  name: string;
};

type DeliveryDetails = {
  deliveryMinutes: number;
  deliveryFee: Money;
};

type RestaurantCard = RestaurantIdentity &
  DeliveryDetails & {
    rating: number;
  };
```

A `RestaurantCard` must satisfy every intersected member. Omitting `rating` is therefore a compile-time error. Composition is useful when meaningful concepts are genuinely reused; dividing every object into tiny types creates indirection without useful reuse.

### Function parameter and return types

Function annotations define a contract for inputs and output:

```ts
function calculateLineTotal(
  unitPrice: Money,
  quantity: number,
): Money {
  return {
    amountInCents: unitPrice.amountInCents * quantity,
    currency: unitPrice.currency,
  };
}
```

TypeScript rejects callers that pass the wrong input types and rejects an implementation that returns a plain number instead of `Money`. However, `quantity: number` does not prove that the value is positive, finite, or an integer. Those are runtime business rules and must be validated separately.

### Type narrowing and control-flow analysis

A value may initially have a union type:

```ts
RestaurantSummary | null
```

TypeScript uses runtime checks and control flow to narrow that union:

```ts
function getRestaurantName(
  restaurant: RestaurantSummary | null,
): string {
  if (restaurant === null) {
    return "Restaurant unavailable";
  }

  return restaurant.name;
}
```

The null branch returns immediately. Only a `RestaurantSummary` can reach the final line, so property access is safe there. Common narrowing evidence includes equality checks, `typeof`, property checks, and discriminant values.

### `unknown` versus `any`

Both types can receive values of any runtime type, but they provide different safety guarantees.

`any` disables checking for the value and permits unsafe operations:

```ts
function handleResponse(value: any) {
  return value.restaurant.name.toUpperCase();
}
```

`unknown` requires evidence before the value can be used:

```ts
function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return "Unsupported value";
}
```

MealMind treats untrusted API and LLM output as `unknown`, validates it with a runtime schema, and only then exposes a trusted application type. Using `any` at that boundary would silently remove the protection we need most.

### Domain models, API DTOs, and UI state

These types serve different purposes:

- **Domain model:** Represents a meaningful MealMind business concept, such as `RestaurantSummary` or `Money`.
- **API DTO:** Describes data transferred across an API boundary. DTO means Data Transfer Object.
- **UI state:** Represents temporary presentation or interaction state, such as whether a filter panel is open.

An external response may be validated as an API DTO and then transformed into a domain model:

```text
API response
→ validate DTO
→ transform
→ domain model
→ render with separate UI state
```

The models may resemble one another, but they are not required to be identical. A field such as `isFilterPanelOpen` should not be added to `RestaurantSummary`: opening a panel does not change the restaurant, and the backend does not need that transient browser state.

Keeping these concerns separate lets the network contract, business representation, and interface behavior evolve for different reasons.

### Architecture decision records

Code shows the current implementation, but often does not preserve why an architectural choice was made. An Architecture Decision Record captures the problem, options considered, decision, reasoning, and accepted tradeoffs.

MealMind separates two documentation responsibilities:

- `docs/learning-log.md` tells the chronological learning and implementation story.
- `docs/decisions.md` preserves concise architectural decisions for future contributors.

The first decision records why the existing Next.js scaffold moved into `apps/web` under npm workspaces. Keeping it at the repository root would mix frontend-specific ownership with repository-wide coordination and create asymmetric commands, dependencies, and deployment boundaries when the API is introduced.

### Common mistakes

- Assuming TypeScript validates network data at runtime
- Using `any` to silence an error instead of understanding it
- Storing monetary amounts as floating-point values
- Making every property optional
- Confusing `undefined`, an absent property, and `null`
- Creating one global file containing unrelated types
- Adding explicit annotations where inference is already clear
- Forcing data into a type with an unsafe assertion

### Interview questions

1. What is the difference between static typing and runtime validation?
2. What happens to TypeScript types when the application runs?
3. What is a string literal type?
4. How does a union type restrict possible values?
5. What is the difference between an optional and nullable property?
6. Why should monetary amounts use integer minor units?
7. When should TypeScript infer a type, and when is an annotation valuable?
8. Why should feature-specific types remain near their feature?
9. When would you choose a type alias instead of an interface?
10. What is interface declaration merging, and when can it be undesirable?
11. How does an intersection differ from a union?
12. When can type composition overcomplicate a model?
13. What does an explicit function return type protect?
14. Why does `quantity: number` not guarantee a valid cart quantity?
15. What is type narrowing?
16. How does an early return help TypeScript narrow a union?
17. How does `unknown` differ from `any`?
18. Why should raw LLM output start as `unknown`?
19. How does an API DTO differ from a domain model?
20. Why should transient UI state not be stored in a restaurant domain object?
21. What problem does an Architecture Decision Record solve?
22. Why did MealMind choose npm workspaces without Nx or Turborepo?

---

## 6. Implemented evidence

The first frontend domain definitions currently live at:

```text
apps/web/src/features/restaurants/types/restaurant-summary.ts
```

Recorded Day 1 checks:

- ESLint passed.
- TypeScript passed after Next.js route-type generation.
- The Next.js production build passed after workspace restructuring.

These checks provide evidence for the concerns they cover: lint rules, static types, and production compilation. They do not establish runtime business correctness, complete accessibility, or conceptual understanding. The exercises and explanations recorded above provide the learning evidence. Results for later work belong in the relevant chapter rather than being inferred from this historical checkpoint.

## Next concepts

- Revisit Day 1 concepts after later implementation

## 7. Day 2: Turning the Home reference into React components

### First lesson: component boundaries

**Learning status: Introduced.** This chapter began with a component-design lesson before any Day 2 UI was implemented. The developer then requested that implementation proceed with fewer questions. The original lesson is preserved below, followed by the resulting implementation story. The optional exercises have not been personally demonstrated.

With the workspace and initial types established, our next problem is translating the approved Home reference into maintainable React code. The reference includes navigation, a discovery/search area, cuisine choices, and repeated restaurant cards. Each area has a different responsibility.

A React component is a reusable unit of UI, commonly written as a function that returns JSX. JSX describes the UI; React uses the component output to render it. Component names start with a capital letter so JSX can distinguish them from built-in elements such as `section` and `button`.

We identify component boundaries using a clear responsibility, repeated structure, or a meaningful interaction. A visual box alone does not require its own component. A component can be useful even if it is used only once, when it makes a complex page easier to understand.

For example, a restaurant section can contain several instances of one `RestaurantCard`. Each instance receives different restaurant data through props, which are inputs supplied by its parent. Changing the shared card layout then updates all instances consistently.

Composition means combining smaller components into a larger interface. Our first design exercise is to identify repeated parts of the Home reference and distinguish them from page-level organization. These are candidate boundaries, not a requirement to create every component immediately.

### Alternatives and tradeoffs

- One large page component is quick to begin but becomes harder to understand as data and interactions accumulate.
- Extracting every heading or wrapper creates unnecessary files and indirection.
- Components with clear responsibilities offer useful organization while keeping related markup together.

### Interview reference

**How do you decide when to extract a component?** Look for repeated structure, a coherent responsibility, or behavior that benefits from being understood and tested independently. Avoid using line count or every visual container as the only rule.

**What are props?** Inputs passed from a parent to a component. A restaurant card can use props to display a different restaurant while keeping the same structure.

### Optional self-check

The Home reference shows several restaurant cards and a cuisine chooser. Identify a reusable component, the data that changes between its instances, and whether cuisine selection belongs inside that component or in a separate part of the page.

**Reference answer:** Spice Route and Bowl Theory use two instances of `RestaurantCard`; their names, cuisines, pictures, delivery estimates, and fees differ. The cuisine chooser belongs to the restaurant explorer because it controls which cards appear, rather than describing a single restaurant.

### From the design reference to the first working screen

Day 2 turns the existing restaurant type into a small customer-facing discovery demo. The reference establishes a warm off-white surface, orange accents, strong dark text, a food-led hero, cuisine choices, and a responsive restaurant grid. The first implementation focuses on browsing sample restaurants, filtering them, and saving favorites in the current page session.

The restaurants are fictional sample records and their photographs illustrate the interface. Search matches local text; it does not interpret natural language, contact an LLM, or look up real restaurants. The displayed rating, availability, delivery estimate, and fee come from those records. Favorites are temporary UI state and reset on a page reload. Restaurant menus, accounts, orders, checkout, payments, real delivery, and AI are still future capabilities.

This distinction matters for onboarding: a polished screen can look more capable than the underlying system. The implementation and interface must make the current demo scope understandable.

### Component ownership and the reading order

The page assembles the static shell and supplies the restaurant data to an interactive explorer:

```text
RootLayout
  Home (page.tsx)
    SiteHeader
    Hero and page sections
    RestaurantsExplorer
      Search and filter controls
      CuisineFilters
      RestaurantCard (one instance per visible restaurant)
      Button (empty-state recovery action)
```

Start reading the source in this order:

| File | Responsibility |
| --- | --- |
| `apps/web/src/app/layout.tsx` | Document shell, page metadata, and global stylesheet. |
| `apps/web/src/app/page.tsx` | Home route composition, hero, and local sample-data handoff. |
| `apps/web/src/components/layout/site-header.tsx` | Shared page navigation and identity. |
| `apps/web/src/features/restaurants/data/demo-restaurants.ts` | Typed sample catalog used by this demo. |
| `apps/web/src/features/restaurants/types/restaurant-summary.ts` | Restaurant and money data contracts. |
| `apps/web/src/features/restaurants/components/restaurants-explorer.tsx` | Interactive search, filters, saved IDs, and the derived result list. |
| `apps/web/src/features/restaurants/components/cuisine-filters.tsx` | Cuisine-selection controls driven by props. |
| `apps/web/src/features/restaurants/components/restaurant-card.tsx` | One restaurant's presentation and favorite callback. |
| `apps/web/src/components/ui/button.tsx` | Shared native-button styling and prop contract. |
| `apps/web/src/app/globals.css` and adjacent `*.module.css` files | Shared design tokens and locally scoped component styling. |

The explorer is a feature component, so it stays with restaurant discovery. A generic button belongs in shared UI because it does not know what a restaurant or favorite is. Extracting every wrapper would obscure this simple structure; keeping everything in `page.tsx` would hide the interaction ownership.

### JSX, expressions, and typed props

JSX is syntax used to describe React elements. Files that combine TypeScript and JSX use the `.tsx` extension; plain type and data modules use `.ts`. Lowercase names such as `<section>` refer to built-in elements; capitalized names such as `<RestaurantCard>` refer to components. Curly braces embed JavaScript expressions in the markup. For example, `{restaurant.name}` renders a property rather than the literal text `restaurant.name`.

Props are inputs supplied by a parent. The card's contract brings the restaurant data, its current favorite state, and a callback together. A simplified version of the pattern is:

```tsx
type RestaurantCardProps = {
  restaurant: RestaurantSummary;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
};

function RestaurantCard({
  restaurant,
  isSaved,
  onToggleSave,
}: RestaurantCardProps) {
  return (
    <article>
      <h3>{restaurant.name}</h3>
      <button
        type="button"
        aria-pressed={isSaved}
        onClick={() => onToggleSave(restaurant.id)}
      >
        Save {restaurant.name}
      </button>
    </article>
  );
}
```

This teaching example omits the actual card styling and other fields. The source file is the authority for the complete implementation. The callback type describes a function that accepts a restaurant ID and whose return value is not used by this contract.

The card reads its props; it does not mutate the restaurant object. React renders the same card structure for different data, eliminating separate Spice Route and Bowl Theory implementations. Typed props let the editor and compiler catch missing or incorrectly typed inputs at component boundaries.

### Composition, `children`, and a reusable native button

Composition builds a larger interface from smaller components. `children` is the prop containing content placed between a component's opening and closing JSX tags:

```tsx
<Button variant="secondary">Explore all restaurants</Button>
```

Here, the text is passed as `children`. Content could also include an icon and text without requiring a separate button component for every label.

The shared button builds on `ComponentProps<"button">`, which gives it React's native button prop types, including `type`, `disabled`, `onClick`, accessibility attributes, and `children`. An intersection adds a small `variant` option for the project's visual styles. Default values keep call sites concise. Destructuring picks out those custom values; the rest parameter collects remaining native props and JSX spread forwards them to the actual button. A default `type="button"` prevents an ordinary action button from accidentally submitting a containing form; an intentional submit action explicitly uses `type="submit"`.

A native button already supplies keyboard activation and semantics. Replacing it with a clickable `div` would require manually rebuilding those behaviors. The abstraction remains small enough that native capabilities are still available to callers.

### Extending the domain model when the screen needs it

Day 1 deliberately avoided speculative fields. The card now has a concrete image requirement, so `RestaurantSummary` gains a required nullable `image` containing `src` and `alt`, and its rating can represent missing data with `number | null`.

```ts
image: { src: string; alt: string } | null;
rating: number | null;
```

A missing image produces a designed placeholder; a missing rating is displayed as unavailable or new rather than invented as zero. The object must still contain these properties. This puts the earlier lesson about nullability into practice.

The sample catalog is exposed as a readonly array of typed records. Readonly typing prevents array mutation through that typed reference during development; it does not deeply freeze every object at runtime. Sample data remains data, while favorites and filters stay in component state. `Money` remains the USD amount-and-currency contract introduced on Day 1.

### Local state and controlled inputs

State remembers information between renders. `useState` provides the current value and a setter that requests an update. The two returned values are unpacked with array destructuring, as in `[query, setQuery]`. Hooks are called at the component's top level, in a consistent order, rather than conditionally inside a loop or event handler. The explorer owns the current search text, cuisine selection, open-only filter, saved-only filter, and saved restaurant IDs because those values affect several controls and the displayed list.

A controlled input receives its displayed value from React state and updates that state through an event handler. The search field follows this pattern:

```tsx
const [query, setQuery] = useState("");

<input
  value={query}
  onChange={(event) => setQuery(event.target.value)}
/>;
```

This shortened example illustrates the data flow; the real input also needs its label and other attributes. Every keystroke updates state, then the next render reflects that value. The browser still handles ordinary text editing. This implementation filters immediately as the user types, so it does not require a submit step. Checkboxes use `checked` and `event.target.checked` for the same controlled-input pattern.

Event handlers are passed as functions. `onClick={() => toggleFavorite(id)}` waits for a click; `onClick={toggleFavorite(id)}` would invoke the function while rendering and pass its result instead.

### State ownership, immutable updates, and saved restaurants

Favorites belong in the explorer because the cards, saved-only filter, and saved count need a consistent answer. Each card receives `isSaved` and calls back when the user requests a change. This is a controlled component: its parent owns the state that drives it.

The update is based on the previous state and creates a new array:

```tsx
setSavedIds((previous) =>
  previous.includes(id)
    ? previous.filter((savedId) => savedId !== id)
    : [...previous, id],
);
```

The functional updater receives the pending state when React processes the update. `filter` creates a new array without the selected ID; spread creates one containing the earlier IDs plus the new ID. Mutating with `push` or `splice` would change an existing state value and undermine React's state model.

Saved IDs stay in the parent even when a filter hides or unmounts a card. When that card returns, its favorite state is computed from the same parent list. If state lived only inside each card, removing the card from the tree would discard that state. Stable list keys help React identify items still present; they do not preserve a removed component's state indefinitely.

Favorites currently reset on reload because they exist only in React memory. Persistence will require a separate decision about browser storage, user identity, API behavior, and synchronization. None of those exist merely because a heart button works.

### Derived data, rendering purity, and why there is no effect

The visible restaurant list can be calculated from the catalog and current filters during rendering. Its count comes from the resulting array's `length`. Neither needs its own state variable.

The text query is trimmed and lowercased, then matched against restaurant names and every cuisine tag using `some` and `includes`. This is case-insensitive substring matching. Cuisine, open-only, and saved-only conditions combine with it using logical AND, so a record must satisfy every active filter. Empty search text matches all records before the other conditions are applied. Clearing filters resets those conditions but deliberately leaves saved IDs intact.

Cuisine buttons are also derived. The implementation takes each restaurant's first cuisine as its primary category, removes empty values with a type-predicate filter, and uses `Set` to deduplicate the labels. Spreading the set produces an array for rendering. The type predicate tells TypeScript that retained values are strings and is backed by the runtime check; it is not a substitute for validating a future external response. Secondary cuisine tags remain searchable even when they are not separate category buttons.

```text
Sample catalog + search + cuisine + open-only + saved-only + saved IDs
  -> filter records
  -> visible restaurants
  -> cards and result count
```

Maintaining another state value for the filtered list would duplicate information and create synchronization work. An effect that copies filtered results into state would add an avoidable render and a risk of stale results. The current catalog is small, so ordinary calculations are sufficient; `useMemo` and `useCallback` are not added without a demonstrated performance or reference-stability need.

A pure render calculates UI from its inputs without changing unrelated data or causing external actions. Filtering the catalog and formatting a fee are render calculations. Writing storage, sending a request, or setting state unconditionally during render would be side effects. Event handlers own the user-triggered updates in this implementation. Effects become appropriate later when synchronizing with something outside React, not as a default home for calculations.

### Lists, stable keys, and conditional rendering

The explorer uses `map` to create a card for each visible restaurant and uses the restaurant's stable `id` as its React key. Keys identify siblings across renders, which matters when filtering changes their positions. An array index can start identifying a different restaurant after a reorder; a random key changes identity on every render. React's `key` is special metadata and is not forwarded as an ordinary prop.

Conditional rendering handles meaningful states: active filters, saved buttons, unavailable images or ratings, and a result list with no matches. The empty state explains the absence and offers a way to reset filtering. It is part of the normal UI, not an exception or a failed network request.

Type narrowing makes nullable fields safe to use. Once the card checks that `restaurant.image` exists, the image branch can read its `src` and `alt`. The fallback branch does not pretend to have those values.

### The first Server/Client Component boundary

The App Router's page and layout are Server Components by default. The static page composition does not need browser state. `RestaurantsExplorer` starts with `"use client"` because it owns state, event handlers, and controlled inputs. Modules imported through that boundary, including its interactive children, join the client module graph even if each child file does not repeat the directive.

The server page passes serializable sample records into the explorer. A browser click handler cannot be passed from an ordinary Server Component as though it were serializable data; the favorite callback is created inside the client boundary and then passed to client children.

Client Component does not mean the initial HTML can only be created in the browser. Next.js can prerender its initial HTML on the server and React then hydrates the interactive part in the browser. Hydration connects the rendered interface to its event handlers and state. The first render must agree across environments, which is another reason to avoid random values, current-time guesses, or browser-storage reads during the initial render.

We keep this boundary close to the interactive restaurant area to limit the client module graph. Deep rendering strategies, caching, authenticated server data, and streaming are later lessons.

### Design tokens, CSS Modules, and responsive layout

The global stylesheet defines the visual vocabulary: colors, surfaces, spacing, typography, radii, and focus treatment. Named CSS custom properties let multiple components use the same choices and make a future palette or spacing adjustment consistent. Orange is an accent from the reference; readable dark text and sufficient contrast still determine where that accent is appropriate.

Component styles use `*.module.css`. Next.js generates scoped class names, so a card's class does not accidentally style another component with the same local name. The project continues its existing CSS Modules setup; Tailwind and a component framework are not required for this first screen. The tradeoff is more authored CSS in exchange for no extra styling dependency and direct practice with layout fundamentals.

Responsive layout changes the number of grid columns and rearranges controls according to available width. A mobile screen is the same content adapting to its container, not a second hard-coded copy of every component. Flexible sizing and wrapping also matter when text is longer or a user zooms. Reduced-motion styles respect users who request less animation.

### Images and layout stability

Restaurant photographs use `next/image` with local public-asset paths. The card reserves an image area with CSS `aspect-ratio`; its positioned wrapper lets the image's `fill` mode occupy that area. `object-fit: cover` crops the picture to the available shape. Reserving space keeps the text below from jumping when the image arrives.

The `sizes` prop describes the expected displayed image width at each layout range so the browser can choose an appropriate image candidate. CSS still determines the actual layout. A photograph's `alt` text belongs with its data, and a null image chooses the fallback branch. Asset provenance belongs in the project's image credits so a future contributor can trace the source without guessing from the filename.

The large hero image is requested eagerly with a high fetch priority because it is part of the initial view. Card images keep the component's normal lazy-loading behavior. Prioritizing every image would make that signal less useful and compete for the same connection resources.

### Accessibility as implementation behavior

The page uses semantic landmarks and headings so its structure can be understood beyond its visual layout. Inputs have accessible labels; placeholders are only hints. Buttons perform actions and links navigate. Favorite and filter toggles communicate their state with native attributes or `aria-pressed`, and icon-only controls have names that explain their action.

A skip link lets keyboard users move directly to the main content. The result count is a polite live region, allowing assistive technology to announce a filtering result without forcing focus away from the control being used. These attributes support the underlying semantic elements rather than replacing them.

Keyboard users must be able to reach controls, see focus, and activate them. Touch controls use a minimum 44-pixel target in this implementation as a usability design choice. Informative images have descriptive alternative text; decorative visuals should not create repetitive announcements. An empty state communicates why no cards are visible and exposes a clear recovery action.

These choices establish an accessible foundation. They do not certify complete accessibility: automated checks and keyboard inspection cover only part of the experience, and screen-reader and user testing remain valuable.

### Focus recovery and the first use of `useRef`

The saved-only view exposed a concrete focus problem: unsaving a restaurant removes its card and the button that currently has keyboard focus. Empty-state recovery likewise removes its own button. We now keep references to the persistent results heading and search input using `useRef<HTMLHeadingElement>(null)` and `useRef<HTMLInputElement>(null)`.

React assigns the DOM element to the ref's `current` property after mounting. Updating a ref does not request a render, unlike a state setter. The unsave event moves focus to the results heading before the card disappears; clearing filters moves focus to the search input. `tabIndex={-1}` lets the heading receive programmatic focus without adding another ordinary Tab stop. These event-driven actions need no effect.

This is an example of adding a hook because an interaction requires it. A ref is appropriate for a DOM focus target; state remains appropriate for values that determine visible UI. Rating text also includes visually hidden “out of 5 stars” so its meaning does not depend on a star icon or an unsupported label on a generic span.

### Route links and same-page anchors

The MealMind home link uses Next.js `Link` for route navigation. The skip link and collection links use native anchors with fragment destinations inside the current document. This preserves semantic navigation and avoids pretending that unimplemented menu, cart, or account routes already exist. The first lint run caught the root route's plain anchor, which was corrected to the installed framework convention before handoff.

### Browser verification as an executable example

Playwright and axe are development dependencies used to exercise behavior and accessibility in a browser. They are not shipped as application features. The suite starts a built Next.js server on port 3100 and runs the same five scenarios at desktop and mobile viewport sizes, producing ten checks. The Windows setup uses installed Edge; other systems can install Playwright's Chromium browser.

Tests locate controls by their accessible roles and names, then assert the result visible to a user. They cover combined text/cuisine/open filters, saved IDs surviving card removal and reappearance, favorites resetting on refresh, keyboard activation, focus recovery, missing-image/unrated cases, actual image loading, and no horizontal overflow at 320, 768, and 1440 pixels. The axe scan checks its selected WCAG A/AA rules. Reduced-motion behavior and a 44-pixel favorite target are also checked.

The spec is `apps/web/tests/discovery.spec.ts`; configuration is `apps/web/playwright.config.ts`. Run `npm run build`, then `npm run test:e2e` from the root. Screenshot artifacts live under ignored `apps/web/test-results/`. Browser emulation and automated scans leave manual screen-reader, zoom, and physical-device checks outstanding; they do not establish a Lighthouse score or full conformance.

### Display formatting does not establish authoritative pricing

The card uses `Intl.NumberFormat` to display an amount such as 249 USD cents as `$2.49`. Dividing by 100 belongs to the presentation step for the current USD model; stored values remain integer cents. A named locale and currency make the intended display explicit.

This is not the eventual TruePrice engine. It does not calculate taxes, enforce fee rules, validate a cart, or quote a real order. Those future calculations belong to deterministic business logic behind an authoritative API. Formatting sample data is a frontend responsibility, while deciding what a customer must pay is a business responsibility.

### Implementation boundaries and alternatives

| Choice today | Why it fits this step | When an alternative may be needed |
| --- | --- | --- |
| Typed local sample data | Lets UI behavior be developed without an unavailable API. | Replace with validated API responses when the catalog backend exists. |
| State in the restaurant explorer | The explorer is the closest common owner of the controls and cards. | Shared state across unrelated routes may justify a broader owner or state tool. |
| Derive filtered records during render | Small, deterministic calculation with one source of truth. | Measured expensive filtering may justify memoization or server-side search. |
| Favorites in memory | Makes the interaction explicit without pretending accounts exist. | Persistent favorites require storage and identity decisions. |
| CSS Modules and global tokens | Continues the existing styling setup and supports the approved visual direction. | Reassess tooling if broader design-system requirements justify it. |
| Narrow client boundary | Keeps browser behavior near the UI that needs it. | Expand only when another interaction requires client execution. |

### Interview answers tied to this implementation

**How are props different from state?** Props are inputs received from a parent; state is memory owned by a component. MealMind passes restaurant data as props and keeps current filters and saved IDs in explorer state. The child requests changes through a callback.

**Why lift state to a parent?** Put shared state at the closest common owner of the components that need a consistent value. The explorer owns favorites because cards, saved count, and saved filtering depend on the same IDs.

**What is composition and how does `children` help?** Composition combines components into a larger UI. `children` provides a content slot, allowing the shared button to wrap different labels or icons while keeping its behavior and styling consistent.

**Why derive the filtered list instead of storing it?** The list is already determined by the catalog and filter state. Storing it again duplicates information, introduces synchronization paths, and can make counts and cards disagree.

**Why use a functional state update?** When the next value depends on the previous value, a functional updater lets React supply the pending state. The favorite toggle then returns a new array rather than mutating an old state snapshot.

**Why should a list key be a stable ID?** React uses it to match siblings between renders. Filtering and reordering can change indices, while an ID continues to identify the same restaurant. A key does not restore local state after a component has been removed.

**What makes an input controlled?** Its value comes from React state and an event handler updates that state. The rendered field and the rest of the interface therefore use the same value.

**Why is `useEffect` absent?** The current behavior is either a render calculation or a response to a user event. No external system needs synchronization. Adding an effect to calculate filtered restaurants would duplicate derived data.

**Why are the page and the explorer different component types?** The page composes the static route, while the explorer needs state and events. The client boundary marks the module graph needed in the browser; initial HTML can still be prerendered before hydration.

**Does a readonly TypeScript array prevent all mutation?** It prevents mutation through that typed array reference during checking. It does not deeply freeze nested objects at runtime. Immutable update practices and runtime validation solve different problems.

**What makes an icon button accessible?** Use a native button with a clear accessible name, appropriate state semantics, visible keyboard focus, and a usable target size. An icon or color change by itself does not provide that contract.

**Does a passing TypeScript check prove the filtering experience works?** No. It checks type compatibility. Browser tests exercise the rendered controls and state changes; responsive and keyboard checks examine additional behavior. None of them alone proves every accessibility or business requirement.

**When would you use a ref instead of state?** Use a ref to retain a value or DOM reference that does not itself determine rendering. Here it points to a focus target. Use state for the saved IDs and filters because changes to those values must update the UI.

**Why can a removal action cause an accessibility bug?** If the focused trigger unmounts, keyboard focus can fall back to the document. Move it to a logical, stable destination as part of that action, and verify the resulting keyboard flow.

### Optional review exercises

1. Save a restaurant, hide it with a cuisine filter, then restore the filter. Explain which component remembered the saved ID.
2. Predict what changes when the saved-only filter is active and the last saved card is unsaved.
3. Trace one search keystroke from the input event through state to the rendered count.
4. Explain why no-results UI and a missing image need different conditional branches.
5. Identify which files must be included in the explorer's client module graph and which can remain server-rendered.
6. Explain the difference between displaying a sample delivery fee and calculating an authoritative order total.

These prompts can be used for interview practice without blocking the next implementation. The developer's answers have not been recorded as demonstrated.

### Verification and chapter status

The Day 2 Home foundation was verified on 2026-09-07:

| Check | Result |
| --- | --- |
| ESLint, including browser test code | Passed after correcting the header's route link. |
| Next.js route generation and standalone TypeScript check | Passed. The final production rebuild also completed TypeScript checking. |
| Production build | Passed; the Home route is prerendered. |
| Playwright desktop/mobile suite | All 10 checks passed against the final production build (20.5 seconds for that test run, not a page-performance measurement). |
| Automated axe accessibility scan | No violations of the selected WCAG A/AA rules detected on the tested default desktop/mobile screen. |
| Screenshot review | Desktop and mobile captures reviewed; layout, loaded food photos, and card fallbacks confirmed. |
| Git whitespace check | Passed. Changes remain uncommitted for review. |
| Approved design references | SHA-256 hashes unchanged from their original copies. |

The installed Node runtime remains 20.16.0 and npm reports an engine warning from a transitive lint dependency requiring a newer compatible runtime. Today's passing checks do not remove that compatibility warning. No system runtime was changed.

This checkpoint completes the first discovery UI implementation. It does not complete the entire approved Home design or the production customer journey. Keyword search uses fictional fixtures; saved state resets on reload; restaurant routes, AI search, accounts, menus, cart, pricing quotes, and order flows await their phases. Manual screen-reader and physical-device testing remain outstanding. The implementation and tests are ready for review and a separate Git commit.

**Learning status:** The concepts above are introduced and illustrated in code. Personal practice and independent explanation are not yet recorded for Day 2.

### Reference material used for this step

- [React: Thinking in React](https://react.dev/learn/thinking-in-react) explains the progression from a component hierarchy to minimal state and ownership.
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) explains redundant and duplicated state.
- The installed Next.js guides at `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `11-css.md`, and `12-images.md` were checked against this project's installed version for the client boundary, prerendering, CSS Modules, and image behavior. Dependency documentation is generated installation material, so these files are not committed.
