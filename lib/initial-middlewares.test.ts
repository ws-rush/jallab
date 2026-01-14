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

  it('should persist initial middlewares when ejecting dynamic ones', async () => {
    const order: string[] = [];
    const mInit: Middleware = async (_ctx, next) => {
      order.push('init');
      return next();
    };

    const fetch = createFetch({ middlewares: [mInit] });
    
    const mDyn: Middleware = async (_ctx, next) => {
        order.push('dynamic');
        return next();
    };

    fetch.use(mDyn);
    
    // Eject the dynamic one
    fetch.eject(mDyn);
    
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
