/**
 * Property-Based Tests for Profit Calculation
 * 
 * Tests correctness properties for profit calculations
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbPrice, arbEnrollment, arbFixedCosts, arbVariableCosts } from '../property-test-utils.js';
import { 
  calculateRevenue,
  calculateTotalFixedCosts,
  calculateVariableCostPerStudent,
  calculateTotalCosts,
  calculateProfit
} from '../../src/calculations.js';

describe('Profit Calculation Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 3: Profit calculation correctness
   * Validates: Requirements 4.3
   * 
   * For any calculated revenue and costs, the net profit should equal 
   * total revenue minus total costs
   */
  it('Property 3: Profit calculation correctness', () => {
    fc.assert(
      fc.property(
        arbPrice(),
        arbEnrollment(),
        arbFixedCosts(),
        arbVariableCosts(),
        (price, enrollment, fixedCosts, variableCosts) => {
          // Calculate revenue and costs using the system functions
          const totalRevenue = calculateRevenue(price, enrollment);
          const totalFixedCost = calculateTotalFixedCosts(fixedCosts);
          const variableCostPerStudent = calculateVariableCostPerStudent(variableCosts);
          const totalCosts = calculateTotalCosts(totalFixedCost, variableCostPerStudent, enrollment);
          
          // Calculate profit using the system function
          const netProfit = calculateProfit(totalRevenue, totalCosts);
          
          // Calculate expected profit directly
          const expectedProfit = totalRevenue - totalCosts;
          
          // Net profit should equal total revenue minus total costs
          expect(netProfit).toBeCloseTo(expectedProfit, 2);
          
          return true;
        }
      ),
      PBT_CONFIG
    );
  });
});
