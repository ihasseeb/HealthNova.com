module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts",
    "**/tests/**/*.test.ts",
  ],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,

  // 👇 YAHAN SE COVERAGE KI SETTINGS SHURU HAIN 👇
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"], // 'text' terminal table ke liye, 'html' UI ke liye
  collectCoverageFrom: [
    "src/**/*.ts", // Sab TS files check karo
    "!src/**/*.d.ts", // Types files ignore karo
    "!src/server.ts", // Server entry file ignore karo
    "!src/lib/prisma.ts", // Prisma connection ignore karo
  ],
};
