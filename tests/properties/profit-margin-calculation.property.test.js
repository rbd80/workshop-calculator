/**
 * Property-Based Tests for Profit Margin Calculation
 * 
 * Tests correctness properties for profit margin calculations
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbPrice, arbEnrollment, arbFixedCosts, arbVariableCosts } from '../property-test-utils.js';
import { 
  calculateRevenue,
  calculateTotalFixedCosts,
  calculateVariableCostPerStudent,
  calculateTotalCosts,
  calculateProfit,
  calculateProfitMargin
} from '../../src/calculations.js';

describe('Profit Margin Calculation Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 4: Profit margin calculation correctness
   * Validates: Requirements 4.4
   * 
   * For any calculated net profit and total revenue where revenue is positive, 
   * the profit margin should equal net profit divided by total revenue multiplied by 100
   */
  it('Property 4: Profit margin calculation correctness', () => {
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
          
          // Calculate profit margin using the system function
          const profitMargin = calculateProfitMargin(netProfit, totalRevenue);
          
          // Calculate expected profit margin directly
          const expectedMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
          
          // Profit margin should equal (net profit / total revenue) * 100
          // Using toBeCloseTo to handle floating point precision
          expect(profitMargin).toBeCloseTo(expectedMargin, 2);
          
          return true;
        }
      ),
      PBT_CONFIG
    );
  });
});
