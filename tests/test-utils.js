/**
 * Test Utilities and Helpers
 * 
 * This module provides common utilities for both unit and property-based tests.
 */

/**
 * Creates a mock DOM element with the specified id and value
 * @param {string} id - Element ID
 * @param {string|number} value - Element value
 * @returns {HTMLElement} Mock element
 */
export function createMockInput(id, value) {
  const input = document.createElement('input');
  input.id = id;
  input.value = value;
  return input;
}

/**
 * Creates a mock DOM structure for testing
 * @returns {Object} Object containing references to mock elements
 */
export function createMockDOM() {
  // Create container
  const container = document.createElement('div');
  container.innerHTML = `
    <input type="range" id="price" value="1500" />
    <input type="range" id="enrollment" value="8" />
    <span id="price-display">1500</span>
    <span id="enrollment-display">8</span>
    <span id="output-revenue">0</span>
    <span id="output-costs">0</span>
    <span id="output-profit">0</span>
    <span id="output-margin">0%</span>
    <span id="output-break-even">0</span>
    <div id="profit-card"></div>
    <div id="fixed-costs-container"></div>
    <div id="variable-costs-container"></div>
    <div id="scenarios-list"></div>
  `;
  
  document.body.appendChild(container);
  
  return {
    container,
    priceInput: document.getElementById('price'),
    enrollmentInput: document.getElementById('enrollment'),
    priceDisplay: document.getElementById('price-display'),
    enrollmentDisplay: document.getElementById('enrollment-display'),
    revenueOutput: document.getElementById('output-revenue'),
    costsOutput: document.getElementById('output-costs'),
    profitOutput: document.getElementById('output-profit'),
    marginOutput: document.getElementById('output-margin'),
    breakEvenOutput: document.getElementById('output-break-even'),
    profitCard: document.getElementById('profit-card')
  };
}

/**
 * Cleans up mock DOM elements
 * @param {HTMLElement} container - Container element to remove
 */
export function cleanupMockDOM(container) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

/**
 * Creates a mock Local Storage implementation for testing
 * @returns {Object} Mock storage object
 */
export function createMockLocalStorage() {
  let store = {};
  
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index) => Object.keys(store)[index] || null
  };
}

/**
 * Formats a number as currency for comparison
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`;
}

/**
 * Formats a number as percentage for comparison
 * @param {number} value - Number to format
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

/**
 * Creates a sample fixed cost object
 * @param {number} id - Cost ID
 * @param {string} name - Cost name
 * @param {number} cost - Cost amount
 * @returns {Object} Fixed cost object
 */
export function createFixedCost(id, name, cost) {
  return { id, name, cost };
}

/**
 * Creates a sample variable cost object
 * @param {number} id - Cost ID
 * @param {string} name - Cost name
 * @param {number} cost - Cost per student
 * @returns {Object} Variable cost object
 */
export function createVariableCost(id, name, cost) {
  return { id, name, cost };
}

/**
 * Creates a sample scenario object
 * @param {Object} inputs - Scenario inputs
 * @param {Object} outputs - Scenario outputs
 * @returns {Object} Scenario object
 */
export function createScenario(inputs, outputs) {
  return {
    id: Date.now(),
    name: 'Test Scenario',
    timestamp: new Date().toISOString(),
    inputs: inputs || {
      price: 1500,
      enrollment: 8,
      fixedCosts: [createFixedCost(1, 'Test Fixed', 1000)],
      variableCosts: [createVariableCost(1, 'Test Variable', 100)]
    },
    outputs: outputs || {
      revenue: 12000,
      costs: 1800,
      profit: 10200,
      margin: 85,
      breakEven: 2
    }
  };
}

/**
 * Asserts that two numbers are approximately equal (within epsilon)
 * @param {number} actual - Actual value
 * @param {number} expected - Expected value
 * @param {number} epsilon - Tolerance (default: 0.01)
 * @returns {boolean} True if approximately equal
 */
export function approximatelyEqual(actual, expected, epsilon = 0.01) {
  return Math.abs(actual - expected) < epsilon;
}
