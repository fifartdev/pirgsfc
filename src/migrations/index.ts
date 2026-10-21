import * as migration_20261021_125412_baseline from './20261021_125412_baseline';

export const migrations = [
  {
    up: migration_20261021_125412_baseline.up,
    down: migration_20261021_125412_baseline.down,
    name: '20261021_125412_baseline'
  },
];
