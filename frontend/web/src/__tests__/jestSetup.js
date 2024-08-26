require('@testing-library/jest-dom');
const { expect, test } = require('@jest/globals');

global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

global.expect = expect;
global.test = test;
