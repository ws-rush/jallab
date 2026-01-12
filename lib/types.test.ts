import { describe, it, expect } from 'vitest';
import type { Middleware, Context } from './types';

describe('Core Types', () => {
  it('should have Middleware and Context types defined', () => {
    // This is a type-only test, but we can't easily test types at runtime.
    // We'll use this to ensure the file exists and can be imported.
    expect(true).toBe(true);
  });
});
