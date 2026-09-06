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

Detailed architecture decisions may also be recorded in `docs/decisions.md` later. This document remains the readable learning narrative and links those decisions to the order in which the system was built.

## The project story so far

MealMind began as a Next.js and TypeScript scaffold created directly in the repository root. That layout was valid for a frontend-only project, but the approved architecture will eventually include a customer web application, a NestJS API, and a background worker when one is justified.

The first architectural decision was therefore to preserve the scaffold while reorganizing the repository as a lightweight npm-workspaces monorepo. The existing Next.js application became `apps/web`; it was not regenerated. The repository root now coordinates workspaces, while each application owns its direct dependencies.

Next, the App Router moved from `apps/web/app` to `apps/web/src/app`. This separates frontend source code from application configuration. The approved visual references were preserved in `docs/design`, but no MealMind UI was implemented during the structural phase.

Before creating product screens, development moved into TypeScript foundations. A small restaurant summary model introduced object types, arrays, nested types, literal types, integer minor currency units, nullability, runtime-validation boundaries, and feature-based ownership. That model currently lives with the restaurant feature rather than in a global collection of unrelated types.

At this point, the workspace structure is established and verified. The customer UI, backend, database, authentication, state libraries, and AI functionality have not been introduced yet.

## How progress is recorded

| Status | Meaning |
| --- | --- |
| Introduced | The concept has been explained. |
| Practiced | An exercise or implementation has been attempted. |
| Demonstrated | The concept has been explained correctly in the learner's own words. |
| Revisit | The concept needs another exercise or later review. |

Understanding is verified by explaining the concept, predicting behavior, implementing a small example, diagnosing mistakes, comparing alternatives, and revisiting it later.

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

### Current frontend structure

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
const restaurant: RestaurantSummary = {
  rating: "four", // Compile-time error
};
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

Current checks:

- ESLint passes.
- TypeScript passes after Next.js route-type generation.
- The Next.js production build passed after workspace restructuring.

These checks prove that the code is valid. They do not, by themselves, prove conceptual understanding; the exercises and explanations recorded above provide that evidence.

## Next concepts

- Revisit Day 1 concepts after later implementation
