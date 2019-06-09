module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['core-js', '<rootDir>/jest.setup.js'],
};
