module.exports = {
  preset: 'react-app',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['react-app'] }],
    '^.+\\.m?js$': ['babel-jest', { presets: ['react-app'] }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-router-dom|react-icons)/).+\\.js$'
  ],
};
