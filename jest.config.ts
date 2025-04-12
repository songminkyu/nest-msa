import type { Config } from 'jest'

const config: Config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.(ts|js)$',
    testEnvironment: 'node',
    transform: { '^.+\\.ts$': 'ts-jest' },
    // Start of test environment reset configuration
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    resetModules: true,
    // End of test environment reset configuration
    rootDir: '.',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
        '^common$': '<rootDir>/src/libs/common/index',
        '^testlib$': '<rootDir>/src/libs/testlib/index',
        '^shared$': '<rootDir>/src/apps/shared/index',
        '^apps/(.*)$': '<rootDir>/src/apps/$1'
    },
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageThreshold: { global: { branches: 100, functions: 100, lines: 100, statements: 100 } },
    coverageReporters: ['lcov', 'text'],
    coveragePathIgnorePatterns: [
        '__tests__',
        '\\.controller\\.ts$',
        '/production\\.ts$',
        '/development\\.ts$',
        '/main\\.ts$',
        '/modules/',
        '/index\\.ts$',
        '\\.module\\.ts$',
        '/libs/testlib/'
    ],
    coverageDirectory: '<rootDir>/_output/coverage',
    testTimeout: 30 * 1000
    /*
     * If the number of CPU cores is high relative to available memory,
     * it is recommended to set maxWorkers to roughly (RAM / 4).
     * For example: 8GB RAM → maxWorkers: 2
     */
    // maxWorkers: 2
}

export default config
