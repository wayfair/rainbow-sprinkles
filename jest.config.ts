import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  globals: {
    'ts-jest': {
      babelConfig: {
        plugins: ['@vanilla-extract/babel-plugin'],
      },
    },
  },
};

export default config;
