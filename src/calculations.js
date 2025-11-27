/**
 * Financial Calculation Engine
 * Pure functions for workshop financial calculations without DOM dependencies
 */

/**
 * Calculate total revenue
 * @param {number} price - Price per student
 * @param {number} enrollment - Number of enrolled students
 * @returns {number} Total revenue
 */
export function calculateRevenue(price, enrollment) {
  return price * enrollment;
}

/**
 * Calculate total fixed costs
 * @param {Array<{id: number, name: string, cost: number}>} fixedCosts - Array of fixed cost objects
 * @returns {number} Total fixed costs
 */
export function calculateTotalFixedCosts(fixedCosts) {
  return fixedCosts.reduce((sum, fc) => sum + fc.cost, 0);
}

/**
 * Calculate variable cost per student
 * @param {Array<{id: number, name: string, cost: number}>} variableCosts - Array of variable cost objects
 * @returns {number} Variable cost per student
 */
export function calculateVariableCostPerStudent(variableCosts) {
  return variableCosts.reduce((sum, vc) => sum + vc.cost, 0);
}

/**
 * Calculate total costs
 * @param {number} totalFixedCost - Total fixed costs
 * @param {number} variableCostPerStudent - Variable cost per student
 * @param {number} enrollment - Number of enrolled students
 * @returns {number} Total costs
 */
export function calculateTotalCosts(totalFixedCost, variableCostPerStudent, enrollment) {
  const totalVariableCost = variableCostPerStudent * enrollment;
  return totalFixedCost + totalVariableCost;
}

/**
 * Calculate net profit
 * @param {number} totalRevenue - Total revenue
 * @param {number} totalCosts - Total costs
 * @returns {number} Net profit
 */
export function calculateProfit(totalRevenue, totalCosts) {
  return totalRevenue - totalCosts;
}

/**
 * Calculate profit margin as a percentage
 * @param {number} netProfit - Net profit
 * @param {number} totalRevenue - Total revenue
 * @returns {number} Profit margin percentage
 */
export function calculateProfitMargin(netProfit, totalRevenue) {
  if (totalRevenue <= 0) {
    return 0;
  }
  return (netProfit / totalRevenue) * 100;
}

/**
 * Calculate break-even point in number of students
 * @param {number} totalFixedCost - Total fixed costs
 * @param {number} price - Price per student
 * @param {number} variableCostPerStudent - Variable cost per student
 * @returns {number} Break-even point (Infinity if impossible)
 */
export function calculateBreakEven(totalFixedCost, price, variableCostPerStudent) {
  if (price > variableCostPerStudent) {
    return totalFixedCost / (price - variableCostPerStudent);
  } else if (totalFixedCost > 0) {
    return Infinity;
  }
  return 0;
}

/**
 * Build cost breakdown object
 * @param {number} totalFixedCost - Total fixed costs
 * @param {Array<{id: number, name: string, cost: number}>} fixedCosts - Array of fixed cost objects
 * @param {Array<{id: number, name: string, cost: number}>} variableCosts - Array of variable cost objects
 * @param {number} enrollment - Number of enrolled students
 * @returns {Object} Cost breakdown with fixed and individual cost items
 */
export function buildCostBreakdown(totalFixedCost, fixedCosts, variableCosts, enrollment) {
  const breakdown = {
    fixed: totalFixedCost
  };
  
  // Add each fixed cost to breakdown
  fixedCosts.forEach(fc => {
    breakdown[fc.name] = fc.cost;
  });
  
  // Add each variable cost to breakdown (scaled by enrollment)
  variableCosts.forEach(vc => {
    breakdown[vc.name] = vc.cost * enrollment;
  });
  
  return breakdown;
}

/**
 * Main calculation function that orchestrates all financial calculations
 * @param {number} price - Price per student
 * @param {number} enrollment - Number of enrolled students
 * @param {Array<{id: number, name: string, cost: number}>} fixedCosts - Array of fixed cost objects
 * @param {Array<{id: number, name: string, cost: number}>} variableCosts - Array of variable cost objects
 * @returns {Object} Complete financial data object
 */
export function calculateFinancials(price, enrollment, fixedCosts, variableCosts) {
  const totalFixedCost = calculateTotalFixedCosts(fixedCosts);
  const variableCostPerStudent = calculateVariableCostPerStudent(variableCosts);
  const totalRevenue = calculateRevenue(price, enrollment);
  const totalCosts = calculateTotalCosts(totalFixedCost, variableCostPerStudent, enrollment);
  const netProfit = calculateProfit(totalRevenue, totalCosts);
  const profitMargin = calculateProfitMargin(netProfit, totalRevenue);
  const breakEvenPoint = calculateBreakEven(totalFixedCost, price, variableCostPerStudent);
  const breakdown = buildCostBreakdown(totalFixedCost, fixedCosts, variableCosts, enrollment);
  
  return {
    price,
    enrollment,
    totalFixedCost,
    variableCostPerStudent,
    totalCosts,
    totalRevenue,
    netProfit,
    profitMargin,
    breakEvenPoint,
    breakdown
  };
}
