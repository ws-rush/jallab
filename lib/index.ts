import type { Middleware, Context, CreateFetchOptions } from './types';

/**
 * Creates a fetch instance with middleware support.
 */
export default function createFetch(options: CreateFetchOptions = {}) {
  const middlewares: Middleware[] = [];

  // Register initial middlewares
  if (options.middlewares) {
    for (const fn of options.middlewares) {
      if (typeof fn === 'function') {
        middlewares.push(fn);
      }
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
        return middleware(context, () => dispatch(i + 1));
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
   * Enforces that a middleware function is registered only once.
   */
  fetchInstance.use = (fn: Middleware): void => {
    if (!middlewares.includes(fn)) {
      middlewares.push(fn);
    }
  };

  /**
   * Removes a middleware by its function reference.
   */
  fetchInstance.eject = (fn: Middleware): void => {
    const index = middlewares.indexOf(fn);
    if (index !== -1) {
      middlewares.splice(index, 1);
    }
  };

  return fetchInstance;
}