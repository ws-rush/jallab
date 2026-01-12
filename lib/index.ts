import type { Middleware, RegisteredMiddleware, Context, CreateFetchOptions } from './types';

/**
 * Creates a fetch instance with middleware support.
 */
export default function createFetch(options: CreateFetchOptions = {}) {
  const middlewares: RegisteredMiddleware[] = [];
  let nextId = 0;

  // Register initial middlewares
  if (options.middlewares) {
    for (const fn of options.middlewares) {
      // Initial middlewares have a special ID that cannot be ejected
      middlewares.push({ id: -1, fn });
    }
  }

  const fetchInstance = async (input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    // Environment check
    const nativeFetch = globalThis.fetch;
    if (typeof nativeFetch !== 'function') {
      throw new Error('No fetch implementation found in this environment.');
    }

    // Create a new Request object to be passed around and modified by middleware
    const initialRequest = new Request(input, init);
    const context: Context = { request: initialRequest };

    const dispatch = async (i: number): Promise<Response> => {
      if (i < middlewares.length) {
        const middleware = middlewares[i];
        return middleware.fn(context, () => dispatch(i + 1));
      } else {
        // Final call to the native fetch
        // Note: We use the modified request from context
        return fetch(context.request);
      }
    };

    return dispatch(0);
  };

  /**
   * Registers a new middleware.
   * @returns A unique ID for the registered middleware.
   */
  fetchInstance.use = (fn: Middleware): number => {
    const id = nextId++;
    middlewares.push({ id, fn });
    return id;
  };

  /**
   * Removes a middleware by its ID.
   */
  fetchInstance.eject = (id: number): void => {
    if (id < 0) return;
    const index = middlewares.findIndex(m => m.id === id);
    if (index !== -1) {
      middlewares.splice(index, 1);
    }
  };

  return fetchInstance;
}