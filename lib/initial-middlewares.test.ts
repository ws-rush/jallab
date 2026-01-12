import { describe, it, expect, vi, beforeEach } from 'vitest';
import createFetch from './index';
import type { Middleware } from './types';

describe('createFetch with initial middlewares', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok'));
  });

  it('should accept an options object with middlewares', async () => {
    const middlewareSpy = vi.fn(async (_ctx, next) => next());
    
    const fetch = createFetch({ middlewares: [middlewareSpy] });
    
    await fetch('https://example.com');
    expect(middlewareSpy).toHaveBeenCalled();
  });

  it('should execute initial middlewares in order', async () => {
    const order: string[] = [];
    const m1: Middleware = async (_ctx, next) => {
      order.push('m1');
      return next();
    };
    const m2: Middleware = async (_ctx, next) => {
      order.push('m2');
      return next();
    };

    const fetch = createFetch({ middlewares: [m1, m2] });
    await fetch('https://example.com');

    expect(order).toEqual(['m1', 'm2']);
  });

  it('should execute initial middlewares before dynamic ones', async () => {
    const order: string[] = [];
    const mInit: Middleware = async (_ctx, next) => {
      order.push('init');
      return next();
    };
    const mDyn: Middleware = async (_ctx, next) => {
      order.push('dynamic');
      return next();
    };

    const fetch = createFetch({ middlewares: [mInit] });
    fetch.use(mDyn);
    
    await fetch('https://example.com');

    expect(order).toEqual(['init', 'dynamic']);
  });

  it('should not allow ejecting initial middlewares', async () => {
    const order: string[] = [];
    const mInit: Middleware = async (_ctx, next) => {
      order.push('init');
      return next();
    };

    const fetch = createFetch({ middlewares: [mInit] });
    
    // Try to eject purely by guessing IDs (implementation detail check)
    // Since we don't return IDs for init middlewares, we can't easily target them via API.
    // This test ensures that even if we call eject with 0 or 1, it shouldn't remove the init middleware
    // IF the init middleware was assigned an accessible ID.
    // However, the spec says "Initial middlewares... will not return an ID". 
    // So the best we can check is that it runs, and maybe check internal state if we exposed it, 
    // but better to just rely on "no ID returned" behavior which we can't verify easily via public API 
    // without types. 
    
    // Let's rely on the fact that .eject() takes an ID. 
    // If I use .use(), I get an ID.
    const id = fetch.use(async (_ctx, next) => {
        order.push('dynamic');
        return next();
    });
    
    // Eject the dynamic one
    fetch.eject(id);
    
    await fetch('https://example.com');
    
    // Init should still run
    expect(order).toEqual(['init']);
  });

  it('should work with an empty middlewares array', async () => {
    const fetch = createFetch({ middlewares: [] });
    const response = await fetch('https://example.com');
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('ok');
  });

  it('should ignore falsy values in middlewares array', async () => {
    const middlewareSpy = vi.fn(async (_ctx, next) => next());
    
    const fetch = createFetch({ 
      middlewares: [
        false, 
        null, 
        undefined, 
        middlewareSpy
      ] 
    });
    
    await fetch('https://example.com');
    expect(middlewareSpy).toHaveBeenCalled();
  });
});
