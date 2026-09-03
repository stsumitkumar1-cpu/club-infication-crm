import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

// Path aliases (e.g. the ones added by `nest g library`) live in tsconfig.json,
// so they are read from there instead of being duplicated here.
const { config: tsconfig } = ts.readConfigFile(
  './tsconfig.json',
  ts.sys.readFile,
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

// Nest 12 ships as ESM ("type": "module"), so the test runner has to run in
// real ESM mode — hence useESM, extensionsToTreatAsEsm, and the mapper that
// strips the .js suffix from our own relative TypeScript imports.
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      { tsconfig: 'tsconfig.spec.json', useESM: true },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
    'apps/**/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',

  /*
   * Jest's ESM mode (--experimental-vm-modules, required because Nest 12 is
   * ESM) holds each test file's module graph for the lifetime of its worker and
   * does not release it between files. With a big node_modules that adds up: the
   * suite started dying with "Jest worker ran out of memory" once exceljs was
   * installed, even though only one file imports it.
   *
   * Restarting a worker once it passes this ceiling costs a little startup time
   * and fixes it properly. Raising --max-old-space-size alone would only move
   * the cliff further out.
   */
  workerIdleMemoryLimit: '600MB',

  /*
   * Bounded rather than one worker per core.
   *
   * Each ESM worker holds its own copy of the module graph, so on a many-core
   * machine the workers together ask for far more memory than the box has —
   * which is how the suite came to die with "Jest worker ran out of memory".
   * Two workers plus the raised heap in the `test` script run all 14 suites in
   * about 7 seconds, so there is nothing to gain from more.
   */
  maxWorkers: 2,
};

export default config;
