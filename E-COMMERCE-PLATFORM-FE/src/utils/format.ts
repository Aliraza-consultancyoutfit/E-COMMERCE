/** Formats a number as USD currency, e.g. 1299 -> "$1,299". */
export const formatCurrency = (value: number): string =>
  `$${value.toLocaleString("en-US")}`;
