/**
 * Property-Based Tests for Revenue Calculation
 * 
 * Tests correctness properties for financial calculations
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PBT_CONFIG, arbPrice, arbEnrollment } from '../property-test-utils.js';
import { calculateRevenue } from '../../src/calculations.js';

describe('Revenue Calculation Properties', () => {
  /**
   * Feature: workshop-financial-calculator, Property 1: Revenue calculation correctness
   * Validates: Requirements 4.1
   * 
   * For any valid price and enrollment values, the calculated total revenue 
   * should equal price multiplied by enrollment
   */
  it('Property 1: Revenue calculation correctness', () => {
    fc.assert(
      fc.property(
        arbPrice(),
        arbEnrollment(),
        (price, enrollment) => {
          const revenue = calculateRevenue(price, enrollment);
          const expected = price * enrollment;
          
          // Revenue should equal price * enrollment
          expect(revenue).toBe(expected);
          
          return true;
        }
      ),
      PBT_CONFIG
    );
  });
});
