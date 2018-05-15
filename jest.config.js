
module.exports = {
    modulePaths: ['.'],
    modulePathIgnorePatterns: [],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    automock: false,
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
        '.(ts|tsx)': './node_modules/ts-jest/preprocessor.js'
    },
    testRegex: '^(((?!(AccessibilitySpec|ViewSpec)).)*Spec).*\\.(ts|tsx)$',
    testResultsProcessor: './node_modules/jest-junit',
    collectCoverage: true,
    coverageReporters: ['cobertura', 'json', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/setupJest.js/']
};
