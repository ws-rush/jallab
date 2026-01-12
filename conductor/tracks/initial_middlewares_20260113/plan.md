# Implementation Plan: Support Middlewares in `createFetch` Initialization

This plan outlines the steps to add support for passing an initial array of middlewares to the `createFetch` function using an options object.

## Phase 1: Setup and Baseline [checkpoint: 4eda8fd]
- [x] Task: Create a reproduction test case to verify current behavior and define target behavior. 93be29f
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup and Baseline' (Protocol in workflow.md)

## Phase 2: Type Definitions and API Updates [checkpoint: 2fa3528]
- [x] Task: Update `types.ts` to include `CreateFetchOptions` and update the `createFetch` signature.
- [x] Task: Refactor `createFetch` in `index.ts` to accept the new options object.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Type Definitions and API Updates' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Type Definitions and API Updates' (Protocol in workflow.md)

## Phase 3: Middleware Registration Logic [checkpoint: df334e1]
- [x] Task: Implement logic in `createFetch` to handle the `middlewares` array from options.
- [x] Task: Ensure initial middlewares are stored such that they execute before dynamic ones and are not ejectable.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Middleware Registration Logic' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Middleware Registration Logic' (Protocol in workflow.md)

## Phase 4: Verification and Documentation [checkpoint: 35bf993]
- [x] Task: Add comprehensive unit tests for execution order and non-ejectability of initial middlewares.
- [x] Task: Update `README.md` with the new environment-aware logging middleware example.
- [x] Task: Verify that existing tests pass (backward compatibility).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Verification and Documentation' (Protocol in workflow.md)
- [x] Task: Refactor logic to internalize filtering of falsy middlewares.
- [x] Task: Update types to allow falsy values in middleware array.
- [x] Task: Update README to reflect simplified usage.
