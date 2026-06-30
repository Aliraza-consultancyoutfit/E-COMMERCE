/** Escapes user input so it can be used safely inside a RegExp (no injection). */
export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
