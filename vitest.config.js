import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for DOM testing (lighter alternative to jsdom)
    environment: 'happy-dom',
    
    // Global test setup
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js'
      ]
    },
    
    // Test file patterns
    include: ['tests/**/*.test.js'],
    
    // Timeout for tests (useful for property-based tests)
    testTimeout: 10000
  }
});
