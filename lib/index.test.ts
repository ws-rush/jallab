import { describe, it, expect, vi, beforeEach } from 'vitest';
import createFetch from './index';

describe('createFetch', () => {
  beforeEach(() => {
    // Mock global fetch
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok'));
  });

  it('should return a function', () => {
    const fetch = createFetch();
    expect(typeof fetch).toBe('function');
  });

  it('should behave like native fetch when no middleware is used', async () => {
    const fetch = createFetch();
    const response = await fetch('https://example.com');

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.any(Request));
    const lastCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const request = lastCall[0] as Request;
    expect(request.url).toBe('https://example.com/');
    expect(await response.text()).toBe('ok');
  });

  it('should accept Request objects', async () => {
    const fetch = createFetch();
    const request = new Request('https://example.com', { method: 'POST' });
    await fetch(request);

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.any(Request));
    const lastCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const passedRequest = lastCall[0] as Request;
    expect(passedRequest.method).toBe('POST');
    expect(passedRequest.url).toBe('https://example.com/');
  });

  it('should execute middleware in the correct order', async () => {
    const fetch = createFetch();
    const order: string[] = [];

    fetch.use(async (_ctx, next) => {
      order.push('m1-start');
      const res = await next();
      order.push('m1-end');
      return res;
    });

    fetch.use(async (_ctx, next) => {
      order.push('m2-start');
      const res = await next();
      order.push('m2-end');
      return res;
    });

    await fetch('https://example.com');

    expect(order).toEqual(['m1-start', 'm2-start', 'm2-end', 'm1-end']);
  });

  it('should allow middleware to modify the request', async () => {
    const fetch = createFetch();

    fetch.use(async (ctx, next) => {
      ctx.request.headers.set('X-Test', 'true');
      return next();
    });

    await fetch('https://example.com');

    const lastCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const request = lastCall[0] as Request;
    expect(request.headers.get('X-Test')).toBe('true');
  });

  it('should allow middleware to modify the response', async () => {
    const fetch = createFetch();

    fetch.use(async (_, next) => {
      await next();
      return new Response('intercepted', { status: 201 });
    });

    const response = await fetch('https://example.com');
    expect(response.status).toBe(201);
    expect(await response.text()).toBe('intercepted');
  });

  it('should allow ejecting middleware by reference', async () => {
    const fetch = createFetch();
    const order: string[] = [];

    const m1 = async (_ctx: any, next: any) => {
      order.push('m1');
      return next();
    };

    const m2 = async (_ctx: any, next: any) => {
      order.push('m2');
      return next();
    };

    fetch.use(m1);
    fetch.use(m2);

    await fetch('https://example.com');
    expect(order).toEqual(['m1', 'm2']);

    fetch.eject(m1);
    order.length = 0; // Clear order

    await fetch('https://example.com');
    expect(order).toEqual(['m2']);
    
    // Ejecting non-existent middleware should do nothing
    const m3 = async (_ctx: any, next: any) => next();
    fetch.eject(m3);
    order.length = 0;
    
    await fetch('https://example.com');
    expect(order).toEqual(['m2']);
  });

  it('should register middleware only once', async () => {
    const fetch = createFetch();
    const order: string[] = [];

    const m1 = async (_ctx: any, next: any) => {
      order.push('m1');
      return next();
    };

    fetch.use(m1);
    fetch.use(m1); // Should be ignored

    await fetch('https://example.com');
    expect(order).toEqual(['m1']);
  });

  it('should return void from use', () => {
    const fetch = createFetch();
    const result = fetch.use(async (_ctx, next) => next());
    expect(result).toBeUndefined();
  });

  it('should throw if no fetch implementation is found', async () => {
    const originalFetch = globalThis.fetch;
    // @ts-ignore
    delete globalThis.fetch;

    const fetch = createFetch();
    await expect(fetch('https://example.com')).rejects.toThrow('No fetch implementation found');

    globalThis.fetch = originalFetch;
  });
});
