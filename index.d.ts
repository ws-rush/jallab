export interface Context {
  request: Request;
}

export type Next = () => Promise<Response>;

export type Middleware = (context: Context, next: Next) => Promise<Response>;

export type JallabFetch = {
  (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
  use(fn: Middleware): number;
  eject(id: number): void;
};

export interface CreateFetchOptions {
  middlewares?: Middleware[];
}

declare function createFetch(options?: CreateFetchOptions): JallabFetch;

export default createFetch;