# GSD Execution Model

Use this directory to translate specs into discrete delivery slices.

## Workflow

1. Pick the active spec from `specs/`
2. Convert the next slice into an executable brief
3. Implement the slice
4. Verify with tests or fixtures
5. Record the result and next slice

## Rules

- One slice should produce a demonstrable outcome.
- Prefer vertical slices over broad horizontal setup.
- Every execution brief should reference a specific spec and task scope.
