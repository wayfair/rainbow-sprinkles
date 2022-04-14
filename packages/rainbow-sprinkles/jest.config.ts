import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  automock: true,
  testMatch: ['**/__tests__/*.test.*'],
  globals: {
    'ts-jest': {
      babelConfig: {
        plugins: ['@vanilla-extract/babel-plugin'],
      },
    },
  },
};

export default config;
