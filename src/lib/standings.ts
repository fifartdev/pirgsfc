/**
 * League-table ordering: most points first. Array.prototype.sort is stable, so
 * teams level on points keep their existing relative order — that's the
 * manual tie-break the admin sets with the up/down arrows in club-admin.
 */
export function sortByPoints<T extends { points?: unknown }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => Number(b.points ?? 0) - Number(a.points ?? 0));
}
