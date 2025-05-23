/**
 * Rounds a number to the specified number of decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0)
 */
export const roundNumber = (value: number, decimals: number = 0): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}; 