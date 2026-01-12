/**
 * Context for the middleware execution.
 */
export interface Context {
  /**
   * The standard Request object.
   */
  request: Request;
}

/**
 * The next function in the middleware chain.
 */
export type Next = () => Promise<Response>;

/**
 * Middleware signature.
 */
export type Middleware = (context: Context, next: Next) => Promise<Response>;

/**
 * Internal representation of a middleware with its unique ID.
 */
export interface RegisteredMiddleware {
  id: number;
  fn: Middleware;
}
