/**
 * Property-Based Testing Utilities
 * 
 * This module provides custom arbitraries (generators) for fast-check
 * to generate valid test data for the Workshop Financial Calculator.
 */

import fc from 'fast-check';

/**
 * Generates valid price values (500-3000, step 50)
 * @returns {fc.Arbitrary<number>} Price arbitrary
 */
export function arbPrice() {
  return fc.integer({ min: 500, max: 3000 }).map(n => Math.round(n / 50) * 50);
}

/**
 * Generates valid enrollment values (1-20)
 * @returns {fc.Arbitrary<number>} Enrollment arbitrary
 */
export function arbEnrollment() {
  return fc.integer({ min: 1, max: 20 });
}

/**
 * Generates non-negative cost amounts
 * @param {number} max - Maximum cost value (default: 10000)
 * @returns {fc.Arbitrary<number>} Cost arbitrary
 */
export function arbCost(max = 10000) {
  return fc.float({ min: 0, max, noNaN: true }).map(n => Math.round(n * 100) / 100);
}

/**
 * Generates a valid fixed cost object
 * @returns {fc.Arbitrary<Object>} Fixed cost arbitrary
 */
export function arbFixedCost() {
  return fc.record({
    id: fc.integer({ min: 1, max: 1000 }),
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    cost: arbCost()
  });
}

/**
 * Generates a valid variable cost object
 * @returns {fc.Arbitrary<Object>} Variable cost arbitrary
 */
export function arbVariableCost() {
  return fc.record({
    id: fc.integer({ min: 1, max: 1000 }),
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    cost: arbCost(1000) // Variable costs typically smaller
  });
}

/**
 * Generates an array of fixed costs (at least 1)
 * @param {number} minLength - Minimum array length (default: 1)
 * @param {number} maxLength - Maximum array length (default: 10)
 * @returns {fc.Arbitrary<Array>} Fixed costs array arbitrary
 */
export function arbFixedCosts(minLength = 1, maxLength = 10) {
  return fc.array(arbFixedCost(), { minLength, maxLength });
}

/**
 * Generates an array of variable costs (at least 1)
 * @param {number} minLength - Minimum array length (default: 1)
 * @param {number} maxLength - Maximum array length (default: 10)
 * @returns {fc.Arbitrary<Array>} Variable costs array arbitrary
 */
export function arbVariableCosts(minLength = 1, maxLength = 10) {
  return fc.array(arbVariableCost(), { minLength, maxLength });
}

/**
 * Generates a complete financial scenario
 * @returns {fc.Arbitrary<Object>} Scenario arbitrary
 */
export function arbScenario() {
  return fc.record({
    price: arbPrice(),
    enrollment: arbEnrollment(),
    fixedCosts: arbFixedCosts(),
    variableCosts: arbVariableCosts()
  });
}

/**
 * Generates a scenario name (non-empty string)
 * @returns {fc.Arbitrary<string>} Scenario name arbitrary
 */
export function arbScenarioName() {
  return fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
}

/**
 * Generates a profit value (can be negative)
 * @returns {fc.Arbitrary<number>} Profit arbitrary
 */
export function arbProfit() {
  return fc.float({ min: -50000, max: 50000, noNaN: true });
}

/**
 * Generates a profit margin percentage
 * @returns {fc.Arbitrary<number>} Margin arbitrary
 */
export function arbMargin() {
  return fc.float({ min: -100, max: 200, noNaN: true });
}

/**
 * Generates enrollment points for chart data (0, 5, 10, 15, 20)
 * @returns {fc.Arbitrary<Array<number>>} Enrollment points
 */
export function arbEnrollmentPoints() {
  return fc.constant([0, 5, 10, 15, 20]);
}

/**
 * Configuration for property-based tests
 * Sets minimum number of test runs to 100 as per design requirements
 */
export const PBT_CONFIG = {
  numRuns: 100,
  verbose: false
};
