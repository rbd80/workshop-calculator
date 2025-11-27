/**
 * Property-Based Tests for Cost Removal
 * 
 * Tests correctness properties for removing costs from fixed and variable cost lists
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbFixedCost, arbVariableCost } from '../property-test-utils.js';
import { 
  removeFixedCost, 
  removeVariableCost, 
  getFixedCosts, 
  getVariableCosts,
  setFixedCosts,
  setVariableCosts
} from '../../src/cost-management.js';

describe('Cost Removal Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 7: Removing costs decreases list length
   * Validates: Requirements 2.5, 3.5
   * 
   * For any cost list (fixed or variable) with more than one item and initial length n, 
   * removing a cost item should result in a list of length n-1 not containing the removed item
   */
  
  describe('Fixed Costs', () => {
    it('Property 7a: Removing fixed costs decreases list length', () => {
      fc.assert(
        fc.property(
          fc.array(arbFixedCost(), { minLength: 2, maxLength: 10 }),
          (initialCosts) => {
            // Ensure unique IDs
            const costsWithUniqueIds = initialCosts.map((cost, index) => ({
              ...cost,
              id: index + 1
            }));
            
            // Set up the initial state
            setFixedCosts(costsWithUniqueIds);
            
            const initialLength = getFixedCosts().length;
            
            // Pick a random cost to remove
            const costToRemove = costsWithUniqueIds[0];
            const result = removeFixedCost(costToRemove.id);
            
            // Removal should succeed (we have more than one item)
            expect(result.success).toBe(true);
            
            // List length should decrease by 1
            const newLength = getFixedCosts().length;
            expect(newLength).toBe(initialLength - 1);
            
            // The removed item should not be in the list
            const costs = getFixedCosts();
            const removedCost = costs.find(c => c.id === costToRemove.id);
            expect(removedCost).toBeUndefined();
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });

    it('Property 7a-edge: Removing last fixed cost should fail', () => {
      fc.assert(
        fc.property(
          arbFixedCost(),
          (singleCost) => {
            // Set up state with only one cost
            setFixedCosts([{ ...singleCost, id: 1 }]);
            
            const initialLength = getFixedCosts().length;
            expect(initialLength).toBe(1);
            
            // Attempt to remove the only cost
            const result = removeFixedCost(1);
            
            // Removal should fail
            expect(result.success).toBe(false);
            expect(result.message).toContain('at least one');
            
            // List length should remain unchanged
            const newLength = getFixedCosts().length;
            expect(newLength).toBe(initialLength);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });

  describe('Variable Costs', () => {
    it('Property 7b: Removing variable costs decreases list length', () => {
      fc.assert(
        fc.property(
          fc.array(arbVariableCost(), { minLength: 2, maxLength: 10 }),
          (initialCosts) => {
            // Ensure unique IDs
            const costsWithUniqueIds = initialCosts.map((cost, index) => ({
              ...cost,
              id: index + 1
            }));
            
            // Set up the initial state
            setVariableCosts(costsWithUniqueIds);
            
            const initialLength = getVariableCosts().length;
            
            // Pick a random cost to remove
            const costToRemove = costsWithUniqueIds[0];
            const result = removeVariableCost(costToRemove.id);
            
            // Removal should succeed (we have more than one item)
            expect(result.success).toBe(true);
            
            // List length should decrease by 1
            const newLength = getVariableCosts().length;
            expect(newLength).toBe(initialLength - 1);
            
            // The removed item should not be in the list
            const costs = getVariableCosts();
            const removedCost = costs.find(c => c.id === costToRemove.id);
            expect(removedCost).toBeUndefined();
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });

    it('Property 7b-edge: Removing last variable cost should fail', () => {
      fc.assert(
        fc.property(
          arbVariableCost(),
          (singleCost) => {
            // Set up state with only one cost
            setVariableCosts([{ ...singleCost, id: 1 }]);
            
            const initialLength = getVariableCosts().length;
            expect(initialLength).toBe(1);
            
            // Attempt to remove the only cost
            const result = removeVariableCost(1);
            
            // Removal should fail
            expect(result.success).toBe(false);
            expect(result.message).toContain('at least one');
            
            // List length should remain unchanged
            const newLength = getVariableCosts().length;
            expect(newLength).toBe(initialLength);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });
});
