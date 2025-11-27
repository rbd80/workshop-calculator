/**
 * Property-Based Tests for Cost Modifications
 * 
 * Tests correctness properties for modifying costs and ensuring recalculation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbCost, arbPrice, arbEnrollment } from '../property-test-utils.js';
import { 
  updateFixedCostAmount,
  updateFixedCostName,
  updateVariableCostAmount,
  updateVariableCostName,
  getFixedCosts, 
  getVariableCosts,
  setFixedCosts,
  setVariableCosts
} from '../../src/cost-management.js';
import { calculateFinancials } from '../../src/calculations.js';

describe('Cost Modification Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 8: Cost modifications trigger recalculation
   * Validates: Requirements 2.3, 3.3
   * 
   * For any cost item modification (name or amount change), the financial metrics 
   * should be recalculated to reflect the new cost values
   */
  
  describe('Fixed Cost Modifications', () => {
    beforeEach(() => {
      // Reset to a known state
      setFixedCosts([
        { id: 1, name: 'Studio Rental', cost: 1500 },
        { id: 2, name: 'Instructor Fee', cost: 2000 }
      ]);
      setVariableCosts([
        { id: 1, name: 'Materials', cost: 50 }
      ]);
    });

    it('Property 8a: Modifying fixed cost amount triggers recalculation', () => {
      fc.assert(
        fc.property(
          arbPrice(),
          arbEnrollment(),
          arbCost(),
          (price, enrollment, newCostAmount) => {
            // Get initial financial state
            const initialFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // Modify the first fixed cost amount
            const costToModify = getFixedCosts()[0];
            const result = updateFixedCostAmount(costToModify.id, newCostAmount);
            
            expect(result.success).toBe(true);
            
            // Recalculate financials after modification
            const newFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // The cost should be updated in the list
            const updatedCost = getFixedCosts().find(c => c.id === costToModify.id);
            expect(updatedCost.cost).toBe(newCostAmount);
            
            // Calculate expected total fixed cost after modification
            const expectedTotalFixedCost = getFixedCosts().reduce((sum, c) => sum + c.cost, 0);
            
            // Total fixed costs should reflect the change
            expect(newFinancials.totalFixedCost).toBeCloseTo(expectedTotalFixedCost, 2);
            
            // Profit should be affected by the cost change
            const expectedProfit = newFinancials.totalRevenue - newFinancials.totalCosts;
            expect(newFinancials.netProfit).toBeCloseTo(expectedProfit, 2);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });

    it('Property 8b: Modifying fixed cost name preserves calculations', () => {
      fc.assert(
        fc.property(
          arbPrice(),
          arbEnrollment(),
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          (price, enrollment, newName) => {
            // Get initial financial state
            const initialFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // Modify the first fixed cost name
            const costToModify = getFixedCosts()[0];
            const originalAmount = costToModify.cost;
            const result = updateFixedCostName(costToModify.id, newName);
            
            expect(result.success).toBe(true);
            
            // Recalculate financials after modification
            const newFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // The name should be updated
            const updatedCost = getFixedCosts().find(c => c.id === costToModify.id);
            expect(updatedCost.name).toBe(newName);
            
            // The amount should remain unchanged
            expect(updatedCost.cost).toBe(originalAmount);
            
            // Financial calculations should remain the same (name doesn't affect calculations)
            expect(newFinancials.totalFixedCost).toBeCloseTo(initialFinancials.totalFixedCost, 2);
            expect(newFinancials.totalCosts).toBeCloseTo(initialFinancials.totalCosts, 2);
            expect(newFinancials.netProfit).toBeCloseTo(initialFinancials.netProfit, 2);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });

  describe('Variable Cost Modifications', () => {
    beforeEach(() => {
      // Reset to a known state
      setFixedCosts([
        { id: 1, name: 'Studio Rental', cost: 1500 }
      ]);
      setVariableCosts([
        { id: 1, name: 'Materials', cost: 50 },
        { id: 2, name: 'Catering', cost: 100 }
      ]);
    });

    it('Property 8c: Modifying variable cost amount triggers recalculation', () => {
      fc.assert(
        fc.property(
          arbPrice(),
          arbEnrollment(),
          arbCost(1000),
          (price, enrollment, newCostAmount) => {
            // Get initial financial state
            const initialFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // Modify the first variable cost amount
            const costToModify = getVariableCosts()[0];
            const result = updateVariableCostAmount(costToModify.id, newCostAmount);
            
            expect(result.success).toBe(true);
            
            // Recalculate financials after modification
            const newFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // The cost should be updated in the list
            const updatedCost = getVariableCosts().find(c => c.id === costToModify.id);
            expect(updatedCost.cost).toBe(newCostAmount);
            
            // Calculate expected variable cost per student
            const expectedVariableCostPerStudent = getVariableCosts()
              .reduce((sum, c) => sum + c.cost, 0);
            
            // Variable cost per student should reflect the change
            expect(newFinancials.variableCostPerStudent).toBeCloseTo(expectedVariableCostPerStudent, 2);
            
            // Total costs should reflect the change (scaled by enrollment)
            const expectedTotalCosts = newFinancials.totalFixedCost + 
                                      (expectedVariableCostPerStudent * enrollment);
            expect(newFinancials.totalCosts).toBeCloseTo(expectedTotalCosts, 2);
            
            // Profit should be affected by the cost change
            const expectedProfit = newFinancials.totalRevenue - newFinancials.totalCosts;
            expect(newFinancials.netProfit).toBeCloseTo(expectedProfit, 2);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });

    it('Property 8d: Modifying variable cost name preserves calculations', () => {
      fc.assert(
        fc.property(
          arbPrice(),
          arbEnrollment(),
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          (price, enrollment, newName) => {
            // Get initial financial state
            const initialFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // Modify the first variable cost name
            const costToModify = getVariableCosts()[0];
            const originalAmount = costToModify.cost;
            const result = updateVariableCostName(costToModify.id, newName);
            
            expect(result.success).toBe(true);
            
            // Recalculate financials after modification
            const newFinancials = calculateFinancials(
              price, 
              enrollment, 
              getFixedCosts(), 
              getVariableCosts()
            );
            
            // The name should be updated
            const updatedCost = getVariableCosts().find(c => c.id === costToModify.id);
            expect(updatedCost.name).toBe(newName);
            
            // The amount should remain unchanged
            expect(updatedCost.cost).toBe(originalAmount);
            
            // Financial calculations should remain the same (name doesn't affect calculations)
            expect(newFinancials.variableCostPerStudent).toBeCloseTo(initialFinancials.variableCostPerStudent, 2);
            expect(newFinancials.totalCosts).toBeCloseTo(initialFinancials.totalCosts, 2);
            expect(newFinancials.netProfit).toBeCloseTo(initialFinancials.netProfit, 2);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });
});
