# jallab

A lightweight, environment-agnostic fetch wrapper with a powerful middleware system.

**jallab** allows you to intercept and modify requests and responses globally, enabling complex behaviors like authentication, logging, caching, and error handling with a simple, chainable API. It works wherever `fetch` is available (Browser, Node.js, Edge, Deno).

## Features

- 🌍 **Environment Agnostic:** Works in Browsers, Node.js (v18+), Cloudflare Workers, Deno, etc.
- 🧅 **Middleware System:** Intercept requests and responses with an "onion" style execution chain (similar to Koa/Express).
- ⚡ **Async/Await Support:** Fully supports asynchronous operations in middleware (e.g., token refresh).
- 🛡️ **Type Safe:** Written in TypeScript with complete type definitions.
- 📦 **Zero Dependencies:** Extremely lightweight.

## Installation

```bash
pnpm add jallab
# or
npm install jallab
# or
yarn add jallab
```

## Usage

### Basic Example

```typescript
import createFetch from "jallab";

const fetch = createFetch();

// Add a logging middleware
fetch.use(async (context, next) => {
  console.log(`Requesting: ${context.request.url}`);
  const response = await next();
  console.log(`Response status: ${response.status}`);
  return response;
});

// Use it just like standard fetch
const response = await fetch("https://api.example.com/data");
```

### Managing Middleware

You can add and remove middleware dynamically.

```typescript
const fetch = createFetch();

// Add middleware
const middlewareId = fetch.use(async (ctx, next) => {
  ctx.request.headers.set("X-Custom", "123");
  return next();
});

// Remove middleware
fetch.eject(middlewareId);
```

## API

### `createFetch()`

Creates a new `fetch` instance.

**Returns:** A function that behaves like the standard `fetch` API, but with `use` and `eject` methods attached.

### `fetch.use(middleware)`

Registers a middleware function.

**Parameters:**

- `middleware`: `(context: Context, next: Next) => Promise<Response>`

**Returns:** `number` (The middleware ID)

### `fetch.eject(id)`

Removes a registered middleware by its ID.

**Parameters:**

- `id`: `number`

### Types

```typescript
interface Context {
  request: Request;
}

type Next = () => Promise<Response>;
```

## License

MIT
