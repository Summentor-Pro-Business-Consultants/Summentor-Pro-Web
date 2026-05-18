/**
 * string.util.ts — General-purpose string transformation helpers
 *
 * Centralising string utilities here prevents the same logic from being
 * re-implemented (and subtly differently) across multiple modules.
 *
 * Current utilities:
 *   toTitleCase — Normalises user-provided names before storing them in the
 *                 database, ensuring consistent capitalisation regardless of
 *                 how the user typed their name on a form.
 */

/**
 * Converts a string to Title Case, normalising irregular whitespace and
 * mixed capitalisation in the process.
 *
 * Steps:
 *   1. Trim leading/trailing whitespace.
 *   2. Lower-case the entire string so that ALL-CAPS input is handled correctly.
 *   3. Split on one or more consecutive whitespace characters (`/\s+/`) so
 *      that multiple internal spaces are collapsed to a single word boundary.
 *   4. Capitalise the first character of every word and rejoin with a single space.
 *
 * @param name - Raw name string as entered by the user (any casing, any spacing).
 * @returns      The name in Title Case with normalised whitespace.
 *
 * @example
 *   toTitleCase('  jOHN   doe  ')  // → 'John Doe'
 *   toTitleCase('MARY ANN')        // → 'Mary Ann'
 */
export function toTitleCase(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      // Split on any run of whitespace so "John  Doe" → ["John", "Doe"]
      .split(/\s+/)
      // Capitalise just the first character of each word; leave the rest lower-cased.
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
