module.exports = {
  preset: "@lwc/jest-preset",
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^(cds)/(.+)$": "<rootDir>/src/elements/$1/$2/$2"
  },
  setupFilesAfterEnv: ["./jest/setup.ts"],
  testEnvironment: "jest-environment-jsdom-sixteen"
};
