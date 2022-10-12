module.exports = {
  transform: {
    "^.+\\.(m?j|t)s$": "@swc/jest",
  },
  transformIgnorePatterns: [],
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules/"],
  testTimeout: 90000,
};
