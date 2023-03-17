/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [
    "node-server",
    "packages/use-interval-time",
    {
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/**/src/**/*.test.ts?(x)"],
      testPathIgnorePatterns: ["node-server", "packages/use-interval-time"],
      moduleNameMapper: {
        "^[./a-zA-Z0-9$_-]+\\.css$": "<rootDir>/test/mockStyle.js",
      },
    },
  ],
};
