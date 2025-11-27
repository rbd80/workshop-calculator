/**
 * Unit Tests for Calculation Edge Cases
 * 
 * Tests edge cases and boundary conditions for financial calculations:
 * - Zero enrollment scenario
 * - Zero costs scenario
 * - Impossible break-even (price ≤ variable cost)
 * - Division by zero in profit margin
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRevenue,
  calculateTotalFixedCosts,
  calculateVariableCostPerStudent,
  calculateTotalCosts,
  calculateProfit,
  calculateProfitMargin,
  calculateBreakEven,
  calculateFinancials
} from '../../src/calculations.js';

describe('Calculation Edge Cases', () => {
  describe('Zero Enrollment Scenario', () => {
    it('should calculate zero revenue when enrollment is zero', () => {
      const revenue = calculateRevenue(1000, 0);
      expect(revenue).toBe(0);
    });

    it('should calculate zero variable costs when enrollment is zero', () => {
      const totalCosts = calculateTotalCosts(500, 100, 0);
      expect(totalCosts).toBe(500); // Only fixed costs remain
    });

    it('should calculate negative profit when enrollment is zero with fixed costs', () => {
      const revenue = calculateRevenue(1000, 0);
      const costs = calculateTotalCosts(500, 100, 0);
      const profit = calculateProfit(revenue, costs);
      expect(profit).toBe(-500);
    });

    it('should handle complete financial calculation with zero enrollment', () => {
      const fixedCosts = [{ id: 1, name: 'Rent', cost: 500 }];
      const variableCosts = [{ id: 1, name: 'Materials', cost: 50 }];
      
      const result = calculateFinancials(1000, 0, fixedCosts, variableCosts);
      
      expect(result.totalRevenue).toBe(0);
      expect(result.totalCosts).toBe(500);
      expect(result.netProfit).toBe(-500);
      expect(result.profitMargin).toBe(0); // Division by zero handled
    });
  });

  describe('Zero Costs Scenario', () => {
    it('should calculate zero when fixed costs array is empty', () => {
      const totalFixed = calculateTotalFixedCosts([]);
      expect(totalFixed).toBe(0);
    });

    it('should calculate zero when variable costs array is empty', () => {
      const variablePerStudent = calculateVariableCostPerStudent([]);
      expect(variablePerStudent).toBe(0);
    });

    it('should calculate zero total costs when all costs are zero', () => {
      const totalCosts = calculateTotalCosts(0, 0, 10);
      expect(totalCosts).toBe(0);
    });

    it('should calculate 100% profit margin when costs are zero', () => {
      const revenue = 10000;
      const costs = 0;
      const profit = calculateProfit(revenue, costs);
      const margin = calculateProfitMargin(profit, revenue);
      
      expect(profit).toBe(10000);
      expect(margin).toBe(100);
    });

    it('should calculate zero break-even when fixed costs are zero', () => {
      const breakEven = calculateBreakEven(0, 1000, 100);
      expect(breakEven).toBe(0);
    });

    it('should handle complete financial calculation with zero costs', () => {
      const fixedCosts = [];
      const variableCosts = [];
      
      const result = calculateFinancials(1000, 10, fixedCosts, variableCosts);
      
      expect(result.totalRevenue).toBe(10000);
      expect(result.totalCosts).toBe(0);
      expect(result.netProfit).toBe(10000);
      expect(result.profitMargin).toBe(100);
      expect(result.breakEvenPoint).toBe(0);
    });
  });

  describe('Impossible Break-Even Scenario', () => {
    it('should return Infinity when price equals variable cost with positive fixed costs', () => {
      const breakEven = calculateBreakEven(1000, 500, 500);
      expect(breakEven).toBe(Infinity);
    });

    it('should return Infinity when price is less than variable cost with positive fixed costs', () => {
      const breakEven = calculateBreakEven(1000, 400, 500);
      expect(breakEven).toBe(Infinity);
    });

    it('should return zero when price equals variable cost with zero fixed costs', () => {
      const breakEven = calculateBreakEven(0, 500, 500);
      expect(breakEven).toBe(0);
    });

    it('should return zero when price is less than variable cost with zero fixed costs', () => {
      const breakEven = calculateBreakEven(0, 400, 500);
      expect(breakEven).toBe(0);
    });

    it('should handle complete financial calculation with impossible break-even', () => {
      const fixedCosts = [{ id: 1, name: 'Rent', cost: 1000 }];
      const variableCosts = [{ id: 1, name: 'Materials', cost: 600 }];
      
      const result = calculateFinancials(500, 10, fixedCosts, variableCosts);
      
      expect(result.breakEvenPoint).toBe(Infinity);
      expect(result.netProfit).toBeLessThan(0); // Should be negative
    });
  });

  describe('Division by Zero in Profit Margin', () => {
    it('should return 0 when revenue is zero', () => {
      const margin = calculateProfitMargin(100, 0);
      expect(margin).toBe(0);
    });

    it('should return 0 when revenue is negative', () => {
      const margin = calculateProfitMargin(100, -500);
      expect(margin).toBe(0);
    });

    it('should handle zero revenue in complete financial calculation', () => {
      const fixedCosts = [{ id: 1, name: 'Rent', cost: 500 }];
      const variableCosts = [{ id: 1, name: 'Materials', cost: 50 }];
      
      const result = calculateFinancials(1000, 0, fixedCosts, variableCosts);
      
      expect(result.totalRevenue).toBe(0);
      expect(result.profitMargin).toBe(0); // Should handle division by zero
    });

    it('should calculate correct margin when revenue is positive but profit is negative', () => {
      const profit = -500;
      const revenue = 1000;
      const margin = calculateProfitMargin(profit, revenue);
      
      expect(margin).toBe(-50);
    });
  });

  describe('Combined Edge Cases', () => {
    it('should handle zero enrollment with zero costs', () => {
      const result = calculateFinancials(1000, 0, [], []);
      
      expect(result.totalRevenue).toBe(0);
      expect(result.totalCosts).toBe(0);
      expect(result.netProfit).toBe(0);
      expect(result.profitMargin).toBe(0);
      expect(result.breakEvenPoint).toBe(0);
    });

    it('should handle maximum realistic values', () => {
      const fixedCosts = [{ id: 1, name: 'Venue', cost: 10000 }];
      const variableCosts = [{ id: 1, name: 'Materials', cost: 500 }];
      
      const result = calculateFinancials(3000, 20, fixedCosts, variableCosts);
      
      expect(result.totalRevenue).toBe(60000);
      expect(result.totalCosts).toBe(20000);
      expect(result.netProfit).toBe(40000);
      expect(result.profitMargin).toBeCloseTo(66.67, 1);
      expect(result.breakEvenPoint).toBe(4);
    });

    it('should handle multiple cost items with zero values', () => {
      const fixedCosts = [
        { id: 1, name: 'Rent', cost: 0 },
        { id: 2, name: 'Insurance', cost: 0 }
      ];
      const variableCosts = [
        { id: 1, name: 'Materials', cost: 0 },
        { id: 2, name: 'Snacks', cost: 0 }
      ];
      
      const result = calculateFinancials(1000, 10, fixedCosts, variableCosts);
      
      expect(result.totalFixedCost).toBe(0);
      expect(result.variableCostPerStudent).toBe(0);
      expect(result.totalCosts).toBe(0);
      expect(result.netProfit).toBe(10000);
      expect(result.profitMargin).toBe(100);
    });
  });
});
