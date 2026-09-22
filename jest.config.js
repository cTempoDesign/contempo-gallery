module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)', '<rootDir>/src/**/?(*.)(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/index.ts', '!src/types.ts', '!src/setupTests.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { branches: 90, functions: 85, lines: 90, statements: 90 }
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'commonjs', moduleResolution: 'node10', ignoreDeprecations: '6.0' } }]
  }
};
