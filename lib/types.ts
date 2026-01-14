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
 * Options for creating a fetch instance.
 */
export interface CreateFetchOptions {
  /**
   * Initial set of middlewares to register.
   * Falsy values (false, null, undefined) are ignored.
   */
  middlewares?: (Middleware | boolean | null | undefined)[];
}
