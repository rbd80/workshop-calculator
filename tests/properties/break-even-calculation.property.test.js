/**
 * Property-Based Tests for Break-Even Calculation
 * 
 * Tests correctness properties for break-even point calculations
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbPrice, arbCost } from '../property-test-utils.js';
import { calculateBreakEven } from '../../src/calculations.js';

describe('Break-Even Calculation Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 5: Break-even calculation correctness
   * Validates: Requirements 4.5
   * 
   * For any total fixed costs, price, and variable cost per student where price exceeds 
   * variable cost per student, the break-even point should equal total fixed costs 
   * divided by the difference between price and variable cost per student
   */
  it('Property 5: Break-even calculation correctness', () => {
    fc.assert(
      fc.property(
        arbCost(),
        arbPrice(),
        arbCost(1000),
        (totalFixedCost, price, variableCostPerStudent) => {
          const breakEven = calculateBreakEven(totalFixedCost, price, variableCostPerStudent);
          
          if (price > variableCostPerStudent) {
            // When price exceeds variable cost, break-even should be calculable
            const expected = totalFixedCost / (price - variableCostPerStudent);
            expect(breakEven).toBeCloseTo(expected, 5);
          } else if (totalFixedCost > 0) {
            // When price <= variable cost and fixed costs are positive, break-even is impossible
            expect(breakEven).toBe(Infinity);
          } else {
            // When fixed costs are zero and price <= variable cost, break-even is 0
            expect(breakEven).toBe(0);
          }
          
          return true;
        }
      ),
      PBT_CONFIG
    );
  });
});
