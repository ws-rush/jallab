export interface Context {
  request: Request;
}

export type Next = () => Promise<Response>;

export type Middleware = (context: Context, next: Next) => Promise<Response>;

export type JallabFetch = {
  (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
  use(fn: Middleware): void;
  eject(fn: Middleware): void;
};

export interface CreateFetchOptions {
  middlewares?: (Middleware | boolean | null | undefined)[];
}

declare function createFetch(options?: CreateFetchOptions): JallabFetch;

export default createFetch;