# VTEX Store Framework - AI Coding Agent Instructions

## Project Overview

This is **vtex.store**, the foundational VTEX IO app required by all VTEX ecommerce stores. It provides the Store Builder architecture, SEO infrastructure, analytics/pixel integration, and core page wrappers (Product, Search, Home). **Critical: This app must never be forked - stores depend on the canonical version.**

## Architecture

### VTEX IO Store Builder Concepts

This app uses VTEX's declarative store builder system:

- **Interfaces** (`store/interfaces.json`): Contracts defining React components and their composition. Examples: `store.product`, `store.search`, `store.home`
- **Blocks** (`store/blocks.json`): Configured instances of interfaces that can be extended via CMS
- **Routes** (`store/routes.json`): URL path mappings to interfaces (e.g., `/:slug/p` → `store.product`)
- **Wrappers**: React components that provide context and handle data fetching for page types

### Key Component Patterns

**Wrapper Components** inject contexts and handle page-specific logic:
- `ProductWrapper.js`: Wraps product pages with `ProductContextProvider`, handles SSR/loading states
- `SearchWrapper.tsx`: Provides search data, handles pixel events for category/department/search pages  
- `HomeWrapper.js`: Home page wrapper
- `StoreWrapper.js`: Root wrapper providing global contexts (PixelProvider, OrderFormProvider, ToastProvider, PWAProvider)

**Context Providers**: Contexts are sourced from external dependencies:
- Product data: `vtex.product-context` (via `useProduct` hook)
- Order/cart data: `vtex.store-resources` (via `OrderFormContext`)
- Pixels: `vtex.pixel-manager` (via `usePixel` hook from `PixelContext`)

### Pixel/Analytics Architecture

Pixels are dispatched via `vtex.pixel-manager`. Key patterns:

- Use `useDataPixel` hook (`hooks/useDataPixel.tsx`) to push events with caching by `pageIdentifier`
- Page view events: `homeView`, `productView`, `categoryView`, `departmentView`, `internalSiteSearchView`
- Ecommerce events: `addToCart`, `removeFromCart`, `orderPlaced`
- Wrappers handle automatic event dispatching (e.g., `ProductTitleAndPixel.tsx` sends `productView`)

## Project Structure

```
store/                    # Store Builder declarations
├── interfaces.json       # Interface definitions with context/composition rules
├── blocks.json          # Block configurations
└── routes.json          # URL routing to interfaces

react/                    # React components (builder: react 3.x)
├── *Wrapper.js          # Page-level wrappers (Product, Search, Home, Store)
├── components/          # Shared components (OrderFormProvider, pixels, etc.)
├── hooks/               # Custom hooks (useDataPixel, useCanonicalLink)
├── modules/             # Utilities (search metadata, navigation)
├── __mocks__/           # Mocks for vtex.* dependencies
└── __tests__/           # Jest tests using @vtex/test-tools

messages/                # i18n message files (builder: messages 1.x)
manifest.json            # App metadata, dependencies, builders
```

## Development Workflows

### Testing

```bash
cd react/
yarn test              # Run Jest tests with @vtex/test-tools
yarn lint              # ESLint with vtex-react config
yarn format            # Prettier formatting
```

Tests use `@vtex/test-tools/react` for rendering and mocks in `__mocks__/vtex.*` directories simulate VTEX dependencies.

### Building & Deployment

This is a VTEX IO app - deployment requires VTEX Toolbelt (not in this repo):
```bash
vtex link              # Link for local development
vtex publish           # Publish new version
vtex deploy            # Deploy to production
```

### Dependencies

External VTEX apps are declared in `manifest.json` dependencies and accessed via module imports like `vtex.product-context/useProduct`. TypeScript typings are fetched from `vtex.vtexassets.com` URLs in `react/package.json` devDependencies.

## Conventions & Patterns

### Module Imports from VTEX Dependencies

Import from scoped modules matching dependency names:
```typescript
import useProduct from 'vtex.product-context/useProduct'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useRuntime } from 'vtex.render-runtime'
```

### Interface Composition

Interfaces define `before`, `after`, and `around` hooks for composition:
```json
"store.product": {
  "around": ["productWrapper"],
  "before": ["header.full"],
  "context": "ProductContext"
}
```

The `around` wrapper provides context; `before`/`after` inject layout elements.

### SEO & Metadata

- Canonical links: Use `useCanonicalLink` hook
- Open Graph: Automatic via `vtex.open-graph` (ProductOpenGraph, SearchOpenGraph)
- Structured data: Automatic via `vtex.structured-data` (Product, ProductList)
- Page titles: Set via `Helmet` from `vtex.render-runtime`

### Route Patterns

Routes support segment routing with canonical paths:
```json
"store.product": {
  "path": "/_v/segment/routing/vtex.store@2.x/product/:id/:slug/p",
  "canonical": "/:slug/p"
}
```

### Mocking for Tests

Mock VTEX dependencies in `__mocks__/vtex.*` folders using Jest's module mocking:
```javascript
jest.mock('vtex.pixel-manager/PixelContext', () => ({
  usePixel: () => ({ push: jest.fn() })
}))
```

## Common Tasks

**Adding a new pixel event**: Use `useDataPixel` in the relevant wrapper, provide event data and cache key.

**Extending an interface**: Create new blocks in `store/blocks.json` with format `interface#label` (e.g., `store.product#custom`).

**Adding settings**: Update `settingsSchema` in `manifest.json` and access via `useRuntime().getSettings('vtex.store')`.

**Modifying page metadata**: Edit wrapper components' Helmet usage or metadata generation functions in `modules/searchMetadata.ts`.

## Critical Constraints

- **Never remove or modify core interfaces** in `interfaces.json` - stores depend on them
- **SSR compatibility**: Use `canUseDOM` checks when accessing browser APIs
- **Message translations**: Use `messages/*.json` files, not hardcoded strings
- **Dependency versions**: Use ranges like `"0.x"` for compatibility across stores
