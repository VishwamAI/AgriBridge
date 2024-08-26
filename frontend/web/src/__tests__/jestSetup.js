import '@testing-library/jest-dom';
import { expect, jest, test } from '@jest/globals';

global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

global.expect = expect;
global.jest = jest;
global.test = test;
