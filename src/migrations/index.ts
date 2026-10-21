import * as migration_20261021_125412_baseline from './20261021_125412_baseline';
import * as migration_20261021_130029_editable_footer_and_home_headings from './20261021_130029_editable_footer_and_home_headings';

export const migrations = [
  {
    up: migration_20261021_125412_baseline.up,
    down: migration_20261021_125412_baseline.down,
    name: '20261021_125412_baseline',
  },
  {
    up: migration_20261021_130029_editable_footer_and_home_headings.up,
    down: migration_20261021_130029_editable_footer_and_home_headings.down,
    name: '20261021_130029_editable_footer_and_home_headings'
  },
];
