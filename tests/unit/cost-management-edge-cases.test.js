/**
 * Cost Management Edge Cases Unit Tests
 * 
 * Tests edge cases for cost management functionality:
 * - Preventing removal of last cost item
 * - Non-negative amount validation
 * - Empty name handling
 * 
 * Requirements: 2.4, 3.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFixedCosts,
  getVariableCosts,
  addFixedCost,
  addVariableCost,
  removeFixedCost,
  removeVariableCost,
  setFixedCosts,
  setVariableCosts
} from '../../src/cost-management.js';

describe('Cost Management Edge Cases', () => {
  describe('Preventing removal of last cost item', () => {
    beforeEach(() => {
      // Reset to a single fixed cost
      setFixedCosts([{ id: 1, name: 'Test Fixed Cost', cost: 100 }]);
      // Reset to a single variable cost
      setVariableCosts([{ id: 1, name: 'Test Variable Cost', cost: 50 }]);
    });

    it('should prevent removal of the last fixed cost item', () => {
      const fixedCosts = getFixedCosts();
      expect(fixedCosts).toHaveLength(1);
      
      const result = removeFixedCost(fixedCosts[0].id);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('at least one');
      expect(getFixedCosts()).toHaveLength(1);
    });

    it('should prevent removal of the last variable cost item', () => {
      const variableCosts = getVariableCosts();
      expect(variableCosts).toHaveLength(1);
      
      const result = removeVariableCost(variableCosts[0].id);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('at least one');
      expect(getVariableCosts()).toHaveLength(1);
    });

    it('should allow removal when there are multiple fixed costs', () => {
      // Add another fixed cost
      addFixedCost('Second Fixed Cost', 200);
      expect(getFixedCosts()).toHaveLength(2);
      
      const fixedCosts = getFixedCosts();
      const result = removeFixedCost(fixedCosts[0].id);
      
      expect(result.success).toBe(true);
      expect(getFixedCosts()).toHaveLength(1);
    });

    it('should allow removal when there are multiple variable costs', () => {
      // Add another variable cost
      addVariableCost('Second Variable Cost', 75);
      expect(getVariableCosts()).toHaveLength(2);
      
      const variableCosts = getVariableCosts();
      const result = removeVariableCost(variableCosts[0].id);
      
      expect(result.success).toBe(true);
      expect(getVariableCosts()).toHaveLength(1);
    });
  });

  describe('Non-negative amount validation', () => {
    beforeEach(() => {
      // Reset to default state
      setFixedCosts([{ id: 1, name: 'Test Fixed Cost', cost: 100 }]);
      setVariableCosts([{ id: 1, name: 'Test Variable Cost', cost: 50 }]);
    });

    it('should reject negative amounts when adding fixed costs', () => {
      const result = addFixedCost('Negative Fixed Cost', -100);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('non-negative');
    });

    it('should reject negative amounts when adding variable costs', () => {
      const result = addVariableCost('Negative Variable Cost', -50);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('non-negative');
    });

    it('should accept zero as a valid fixed cost amount', () => {
      const result = addFixedCost('Zero Fixed Cost', 0);
      
      expect(result.success).toBe(true);
      expect(result.cost.cost).toBe(0);
    });

    it('should accept zero as a valid variable cost amount', () => {
      const result = addVariableCost('Zero Variable Cost', 0);
      
      expect(result.success).toBe(true);
      expect(result.cost.cost).toBe(0);
    });

    it('should reject NaN when adding fixed costs', () => {
      const result = addFixedCost('Invalid Fixed Cost', NaN);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('non-negative');
    });

    it('should reject NaN when adding variable costs', () => {
      const result = addVariableCost('Invalid Variable Cost', NaN);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('non-negative');
    });

    it('should accept positive amounts for fixed costs', () => {
      const result = addFixedCost('Valid Fixed Cost', 500);
      
      expect(result.success).toBe(true);
      expect(result.cost.cost).toBe(500);
    });

    it('should accept positive amounts for variable costs', () => {
      const result = addVariableCost('Valid Variable Cost', 150);
      
      expect(result.success).toBe(true);
      expect(result.cost.cost).toBe(150);
    });
  });

  describe('Empty name handling', () => {
    beforeEach(() => {
      // Reset to default state
      setFixedCosts([{ id: 1, name: 'Test Fixed Cost', cost: 100 }]);
      setVariableCosts([{ id: 1, name: 'Test Variable Cost', cost: 50 }]);
    });

    it('should reject empty string as fixed cost name', () => {
      const result = addFixedCost('', 100);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject empty string as variable cost name', () => {
      const result = addVariableCost('', 50);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject whitespace-only string as fixed cost name', () => {
      const result = addFixedCost('   ', 100);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject whitespace-only string as variable cost name', () => {
      const result = addVariableCost('   ', 50);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject null as fixed cost name', () => {
      const result = addFixedCost(null, 100);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject null as variable cost name', () => {
      const result = addVariableCost(null, 50);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject undefined as fixed cost name', () => {
      const result = addFixedCost(undefined, 100);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject undefined as variable cost name', () => {
      const result = addVariableCost(undefined, 50);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should accept valid names with leading/trailing whitespace (trimmed)', () => {
      const fixedResult = addFixedCost('  Valid Fixed Cost  ', 100);
      const variableResult = addVariableCost('  Valid Variable Cost  ', 50);
      
      expect(fixedResult.success).toBe(true);
      expect(fixedResult.cost.name).toBe('Valid Fixed Cost');
      
      expect(variableResult.success).toBe(true);
      expect(variableResult.cost.name).toBe('Valid Variable Cost');
    });
  });
});
