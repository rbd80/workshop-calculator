/**
 * Property-Based Tests for Cost Addition
 * 
 * Tests correctness properties for adding costs to fixed and variable cost lists
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbCost } from '../property-test-utils.js';
import { 
  addFixedCost, 
  addVariableCost, 
  getFixedCosts, 
  getVariableCosts,
  setFixedCosts,
  setVariableCosts
} from '../../src/cost-management.js';

describe('Cost Addition Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 6: Adding costs increases list length
   * Validates: Requirements 2.2, 3.2
   * 
   * For any cost list (fixed or variable) with initial length n, adding a valid cost item 
   * should result in a list of length n+1 containing the new item
   */
  
  describe('Fixed Costs', () => {
    beforeEach(() => {
      // Reset to a known state with at least one cost
      setFixedCosts([
        { id: 1, name: 'Initial Cost', cost: 1000 }
      ]);
    });

    it('Property 6a: Adding fixed costs increases list length', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          arbCost(),
          (name, cost) => {
            const initialLength = getFixedCosts().length;
            const result = addFixedCost(name, cost);
            
            // Addition should succeed
            expect(result.success).toBe(true);
            
            // List length should increase by 1
            const newLength = getFixedCosts().length;
            expect(newLength).toBe(initialLength + 1);
            
            // The new item should be in the list
            const costs = getFixedCosts();
            const addedCost = costs.find(c => c.id === result.cost.id);
            expect(addedCost).toBeDefined();
            expect(addedCost.name).toBe(name.trim());
            expect(addedCost.cost).toBe(cost);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });

  describe('Variable Costs', () => {
    beforeEach(() => {
      // Reset to a known state with at least one cost
      setVariableCosts([
        { id: 1, name: 'Initial Cost', cost: 100 }
      ]);
    });

    it('Property 6b: Adding variable costs increases list length', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          arbCost(),
          (name, cost) => {
            const initialLength = getVariableCosts().length;
            const result = addVariableCost(name, cost);
            
            // Addition should succeed
            expect(result.success).toBe(true);
            
            // List length should increase by 1
            const newLength = getVariableCosts().length;
            expect(newLength).toBe(initialLength + 1);
            
            // The new item should be in the list
            const costs = getVariableCosts();
            const addedCost = costs.find(c => c.id === result.cost.id);
            expect(addedCost).toBeDefined();
            expect(addedCost.name).toBe(name.trim());
            expect(addedCost.cost).toBe(cost);
            
            return true;
          }
        ),
        PBT_CONFIG
      );
    });
  });
});
