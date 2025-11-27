/**
 * Property-Based Tests for Cost Calculation
 * 
 * Tests correctness properties for cost calculations
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbEnrollment, arbFixedCosts, arbVariableCosts } from '../property-test-utils.js';
import { 
  calculateTotalFixedCosts, 
  calculateVariableCostPerStudent, 
  calculateTotalCosts 
} from '../../src/calculations.js';

describe('Cost Calculation Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 2: Cost calculation correctness
   * Validates: Requirements 4.2
   * 
   * For any set of fixed costs, variable costs, and enrollment value, 
   * the calculated total costs should equal the sum of all fixed costs 
   * plus the sum of all variable costs multiplied by enrollment
   */
  it('Property 2: Cost calculation correctness', () => {
    fc.assert(
      fc.property(
        arbFixedCosts(),
        arbVariableCosts(),
        arbEnrollment(),
        (fixedCosts, variableCosts, enrollment) => {
          // Calculate using the system functions
          const totalFixedCost = calculateTotalFixedCosts(fixedCosts);
          const variableCostPerStudent = calculateVariableCostPerStudent(variableCosts);
          const totalCosts = calculateTotalCosts(totalFixedCost, variableCostPerStudent, enrollment);
          
          // Calculate expected value directly
          const expectedFixedCost = fixedCosts.reduce((sum, fc) => sum + fc.cost, 0);
          const expectedVariableCostPerStudent = variableCosts.reduce((sum, vc) => sum + vc.cost, 0);
          const expectedTotalCosts = expectedFixedCost + (expectedVariableCostPerStudent * enrollment);
          
          // Total costs should equal sum of fixed costs + (sum of variable costs * enrollment)
          expect(totalCosts).toBeCloseTo(expectedTotalCosts, 2);
          
          return true;
        }
      ),
      PBT_CONFIG
    );
  });
});
