const config = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
  },
};

export default config;
