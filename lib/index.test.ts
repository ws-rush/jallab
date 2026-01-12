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

    expect(globalThis.fetch).toHaveBeenCalledWith('https://example.com', undefined);
    expect(await response.text()).toBe('ok');
  });

  it('should accept Request objects', async () => {
    const fetch = createFetch();
    const request = new Request('https://example.com', { method: 'POST' });
    await fetch(request);

    expect(globalThis.fetch).toHaveBeenCalledWith(request, undefined);
  });
});
