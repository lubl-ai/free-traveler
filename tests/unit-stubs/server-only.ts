// Test-only stub for the `server-only` package.
// The real package throws when imported outside Next.js's RSC build
// pipeline, which Vitest isn't — this lets UNIT-MATE-STATE import pure
// functions from src/app/api/mates/*/route.ts (which import
// src/lib/db/client.ts, guarded by `import 'server-only'`) without pulling
// in that guard's Next-specific runtime check. No-op; nothing to export.
export {};
