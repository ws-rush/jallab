import type { Middleware, RegisteredMiddleware } from './types';

/**
 * Creates a fetch instance with middleware support.
 */
export default function createFetch() {
  const middlewares: RegisteredMiddleware[] = [];
  let nextId = 0;

  const fetchInstance = async (input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    // Basic implementation that just calls the environment's fetch
    return fetch(input, init);
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
    const index = middlewares.findIndex(m => m.id === id);
    if (index !== -1) {
      middlewares.splice(index, 1);
    }
  };

  return fetchInstance;
}
