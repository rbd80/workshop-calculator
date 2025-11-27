# Workshop Financial Calculator

A web-based financial modeling tool for workshop organizers to analyze profitability, manage costs, and compare pricing scenarios.

## Project Structure

```
.
├── src/                          # Source code modules
├── tests/
│   ├── unit/                     # Unit tests
│   ├── properties/               # Property-based tests
│   ├── test-utils.js            # Common test utilities
│   └── property-test-utils.js   # PBT generators and config
├── index.html                    # Main application
├── package.json                  # Dependencies and scripts
└── vitest.config.js             # Test configuration
```

## Setup

Install dependencies:

```bash
npm install
```

## Testing

The project uses **Vitest** for unit testing and **fast-check** for property-based testing.

### Run all tests:

```bash
npm test
```

### Run tests in watch mode:

```bash
npm run test:watch
```

### Run tests with UI:

```bash
npm run test:ui
```

### Generate coverage report:

```bash
npm run test:coverage
```

## Testing Strategy

- **Unit Tests**: Test specific examples, edge cases, and integration points
- **Property-Based Tests**: Verify universal properties across 100+ random inputs
- Both approaches complement each other for comprehensive coverage

## Development

The application is being refactored from a monolithic inline script to a modular architecture with the following modules:

- `src/calculations.js` - Financial calculation engine
- `src/cost-management.js` - Cost state management
- `src/scenario-management.js` - Scenario persistence
- `src/ui-updates.js` - UI update logic
- `src/chart-management.js` - Chart visualization
- `src/app.js` - Main application controller

## Requirements

- Node.js 18+ (for Vitest)
- Modern browser with ES6+ support
