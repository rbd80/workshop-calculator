/**
 * Cost Management Module
 * Handles fixed and variable cost state management with validation
 */

/**
 * Cost state - these will be managed by the module
 */
let fixedCosts = [
  { id: 1, name: 'Studio Rental (2 Days)', cost: 1500 },
  { id: 2, name: 'Instructor Fee/Planning', cost: 2000 },
  { id: 3, name: 'Marketing/Ad Spend', cost: 300 }
];
let nextFixedCostId = 4;

let variableCosts = [
  { id: 1, name: 'Model Fee Allocation', cost: 150 },
  { id: 2, name: 'Catering/Refreshments', cost: 100 },
  { id: 3, name: 'Materials/Swag', cost: 50 }
];
let nextVariableCostId = 4;

/**
 * Get all fixed costs
 * @returns {Array<{id: number, name: string, cost: number}>} Array of fixed cost objects
 */
export function getFixedCosts() {
  return fixedCosts;
}

/**
 * Get all variable costs
 * @returns {Array<{id: number, name: string, cost: number}>} Array of variable cost objects
 */
export function getVariableCosts() {
  return variableCosts;
}

/**
 * Add a new fixed cost
 * @param {string} name - Cost name
 * @param {number} cost - Cost amount (must be non-negative)
 * @returns {{success: boolean, message?: string, cost?: object}} Result object
 */
export function addFixedCost(name, cost) {
  // Validate name
  if (!name || !name.trim()) {
    return { success: false, message: 'Cost name cannot be empty' };
  }
  
  // Validate cost amount
  if (isNaN(cost) || cost < 0) {
    return { success: false, message: 'Cost amount must be a non-negative number' };
  }
  
  const newCost = {
    id: nextFixedCostId++,
    name: name.trim(),
    cost: cost
  };
  
  fixedCosts.push(newCost);
  
  return { success: true, cost: newCost };
}

/**
 * Add a new variable cost
 * @param {string} name - Cost name
 * @param {number} cost - Cost amount per student (must be non-negative)
 * @returns {{success: boolean, message?: string, cost?: object}} Result object
 */
export function addVariableCost(name, cost) {
  // Validate name
  if (!name || !name.trim()) {
    return { success: false, message: 'Cost name cannot be empty' };
  }
  
  // Validate cost amount
  if (isNaN(cost) || cost < 0) {
    return { success: false, message: 'Cost amount must be a non-negative number' };
  }
  
  const newCost = {
    id: nextVariableCostId++,
    name: name.trim(),
    cost: cost
  };
  
  variableCosts.push(newCost);
  
  return { success: true, cost: newCost };
}

/**
 * Remove a fixed cost by ID
 * @param {number} id - Cost ID to remove
 * @returns {{success: boolean, message?: string}} Result object
 */
export function removeFixedCost(id) {
  // Validate minimum items
  if (fixedCosts.length === 1) {
    return { success: false, message: 'You must have at least one fixed cost item.' };
  }
  
  const initialLength = fixedCosts.length;
  fixedCosts = fixedCosts.filter(fc => fc.id !== id);
  
  if (fixedCosts.length === initialLength) {
    return { success: false, message: 'Fixed cost not found' };
  }
  
  return { success: true };
}

/**
 * Remove a variable cost by ID
 * @param {number} id - Cost ID to remove
 * @returns {{success: boolean, message?: string}} Result object
 */
export function removeVariableCost(id) {
  // Validate minimum items
  if (variableCosts.length === 1) {
    return { success: false, message: 'You must have at least one variable cost item.' };
  }
  
  const initialLength = variableCosts.length;
  variableCosts = variableCosts.filter(vc => vc.id !== id);
  
  if (variableCosts.length === initialLength) {
    return { success: false, message: 'Variable cost not found' };
  }
  
  return { success: true };
}

/**
 * Update a fixed cost name
 * @param {number} id - Cost ID to update
 * @param {string} name - New name
 * @returns {{success: boolean, message?: string}} Result object
 */
export function updateFixedCostName(id, name) {
  const fc = fixedCosts.find(f => f.id === id);
  
  if (!fc) {
    return { success: false, message: 'Fixed cost not found' };
  }
  
  fc.name = name;
  return { success: true };
}

/**
 * Update a fixed cost amount
 * @param {number} id - Cost ID to update
 * @param {number} amount - New amount (must be non-negative)
 * @returns {{success: boolean, message?: string}} Result object
 */
export function updateFixedCostAmount(id, amount) {
  const fc = fixedCosts.find(f => f.id === id);
  
  if (!fc) {
    return { success: false, message: 'Fixed cost not found' };
  }
  
  // Validate and coerce to non-negative
  fc.cost = Math.max(0, parseFloat(amount) || 0);
  return { success: true };
}

/**
 * Update a variable cost name
 * @param {number} id - Cost ID to update
 * @param {string} name - New name
 * @returns {{success: boolean, message?: string}} Result object
 */
export function updateVariableCostName(id, name) {
  const vc = variableCosts.find(v => v.id === id);
  
  if (!vc) {
    return { success: false, message: 'Variable cost not found' };
  }
  
  vc.name = name;
  return { success: true };
}

/**
 * Update a variable cost amount
 * @param {number} id - Cost ID to update
 * @param {number} amount - New amount per student (must be non-negative)
 * @returns {{success: boolean, message?: string}} Result object
 */
export function updateVariableCostAmount(id, amount) {
  const vc = variableCosts.find(v => v.id === id);
  
  if (!vc) {
    return { success: false, message: 'Variable cost not found' };
  }
  
  // Validate and coerce to non-negative
  vc.cost = Math.max(0, parseFloat(amount) || 0);
  return { success: true };
}

/**
 * Set fixed costs (used for loading scenarios)
 * @param {Array<{id: number, name: string, cost: number}>} costs - Array of fixed cost objects
 */
export function setFixedCosts(costs) {
  fixedCosts = JSON.parse(JSON.stringify(costs)); // Deep copy
  const maxId = Math.max(...fixedCosts.map(fc => fc.id), 0);
  nextFixedCostId = maxId + 1;
}

/**
 * Set variable costs (used for loading scenarios)
 * @param {Array<{id: number, name: string, cost: number}>} costs - Array of variable cost objects
 */
export function setVariableCosts(costs) {
  variableCosts = JSON.parse(JSON.stringify(costs)); // Deep copy
  const maxId = Math.max(...variableCosts.map(vc => vc.id), 0);
  nextVariableCostId = maxId + 1;
}
