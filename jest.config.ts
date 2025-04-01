import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
  },
};

export default config;