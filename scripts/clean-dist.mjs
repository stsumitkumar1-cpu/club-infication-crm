/**
 * Removes the build output before an explicit `npm run build`.
 *
 * Both parts matter. Deleting `dist/` alone is not enough because tsconfig sets
 * `incremental: true`: the leftover `.tsbuildinfo` tells TypeScript the output
 * is already current, so it exits 0 and emits nothing, leaving no dist at all.
 *
 * This is a prebuild step rather than nest-cli's `deleteOutDir`, which also
 * applies to `nest start --watch` — there it wipes dist and then races
 * `node dist/main` against the first compile, failing intermittently with
 * "Cannot find module dist/main".
 */
import { rmSync, readdirSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

for (const entry of readdirSync('.')) {
  if (entry.endsWith('.tsbuildinfo')) {
    rmSync(entry, { force: true });
  }
}

console.log('cleaned dist/ and TypeScript build info');
