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

You can add and remove middleware dynamically. Middleware functions are registered only once; subsequent calls to `.use()` with the same function will be ignored.

```typescript
const fetch = createFetch();

const customHeaderMiddleware = async (ctx, next) => {
  ctx.request.headers.set("X-Custom", "123");
  return next();
};

// Add middleware
fetch.use(customHeaderMiddleware);

// Remove middleware using the same function reference
fetch.eject(customHeaderMiddleware);
```

### Initial Middlewares

You can also provide a set of middlewares at initialization.

```typescript
import createFetch from "jallab";

// Example: Performance logging middleware for development
const performanceLogger = async (ctx, next) => {
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;

  if (duration > 3000) {
    console.error(`🔴 Critical Slowness: ${ctx.request.url} took ${duration}ms`);
  } else if (duration > 1000) {
    console.warn(`🟡 Slow Request: ${ctx.request.url} took ${duration}ms`);
  }

  return response;
};

const isDev = process.env.NODE_ENV === "development";

const fetch = createFetch({
  middlewares: [
    isDev && performanceLogger
  ]
});
```

## API

### `createFetch(options?)`

Creates a new `fetch` instance.

**Parameters:**

- `options`: `CreateFetchOptions` (Optional)
  - `middlewares`: `(Middleware | boolean | null | undefined)[]` - Initial set of middlewares. Falsy values are ignored.

**Returns:** A function that behaves like the standard `fetch` API, but with `use` and `eject` methods attached.

### `fetch.use(middleware)`

Registers a middleware function. If the function is already registered, it does nothing.

**Parameters:**

- `middleware`: `(context: Context, next: Next) => Promise<Response>`

**Returns:** `void`

### `fetch.eject(middleware)`

Removes a registered middleware by its function reference.

**Parameters:**

- `middleware`: `(context: Context, next: Next) => Promise<Response>`

**Returns:** `void`

### Types

```typescript
interface Context {
  request: Request;
}

type Next = () => Promise<Response>;
```

## License

MIT
