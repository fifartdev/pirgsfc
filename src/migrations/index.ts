import * as migration_20261021_125412_baseline from './20261021_125412_baseline';
import * as migration_20261021_130029_editable_footer_and_home_headings from './20261021_130029_editable_footer_and_home_headings';
import * as migration_20261021_131817_academy_content from './20261021_131817_academy_content';
import * as migration_20261021_133010_calendar_events from './20261021_133010_calendar_events';

export const migrations = [
  {
    up: migration_20261021_125412_baseline.up,
    down: migration_20261021_125412_baseline.down,
    name: '20261021_125412_baseline',
  },
  {
    up: migration_20261021_130029_editable_footer_and_home_headings.up,
    down: migration_20261021_130029_editable_footer_and_home_headings.down,
    name: '20261021_130029_editable_footer_and_home_headings',
  },
  {
    up: migration_20261021_131817_academy_content.up,
    down: migration_20261021_131817_academy_content.down,
    name: '20261021_131817_academy_content',
  },
  {
    up: migration_20261021_133010_calendar_events.up,
    down: migration_20261021_133010_calendar_events.down,
    name: '20261021_133010_calendar_events'
  },
];
