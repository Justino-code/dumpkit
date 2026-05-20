// tests/core/primitives.test.ts

import { describe, it, expect } from 'vitest';
import {
  formatNull,
  formatUndefined,
  formatBoolean,
  formatNumber,
  formatBigInt,
  formatString,
  formatSymbol,
  formatFunction,
  formatDate,
  formatError,
  formatRegExp,
  formatPrimitive,
} from '../../src/core/primitives';
import type { ResolvedFormatOptions } from '../../src/shared/types/dto';

const defaultOptions: ResolvedFormatOptions = {
  depth: 4,
  colors: false,
  showHidden: false,
  maxArrayLength: 100,
  maxStringLength: 100,
  indent: 2,
  maxProperties: 50,
};

describe('primitives', () => {
  describe('formatNull', () => {
    it('should return "null"', () => {
      expect(formatNull(false)).toBe('null');
    });
  });

  describe('formatUndefined', () => {
    it('should return "undefined"', () => {
      expect(formatUndefined(false)).toBe('undefined');
    });
  });

  describe('formatBoolean', () => {
    it('should return "true" for true', () => {
      expect(formatBoolean(true, false)).toBe('true');
    });
    it('should return "false" for false', () => {
      expect(formatBoolean(false, false)).toBe('false');
    });
  });

  describe('formatNumber', () => {
    it('should format regular numbers', () => {
      expect(formatNumber(42, false)).toBe('42');
      expect(formatNumber(-3.14, false)).toBe('-3.14');
    });
    it('should format NaN', () => {
      expect(formatNumber(NaN, false)).toBe('NaN');
    });
    it('should format Infinity', () => {
      expect(formatNumber(Infinity, false)).toBe('Infinity');
      expect(formatNumber(-Infinity, false)).toBe('-Infinity');
    });
  });

  describe('formatBigInt', () => {
    it('should format bigint with n suffix', () => {
      expect(formatBigInt(9007199254740991n, false)).toBe('9007199254740991n');
    });
  });

  describe('formatString', () => {
    it('should wrap strings in double quotes', () => {
      const result = formatString('hello', defaultOptions, false);
      expect(result).toBe('"hello"');
    });

    it('should escape special characters', () => {
      const result = formatString('he"llo', defaultOptions, false);
      expect(result).toBe('"he\\"llo"');
    });

    it('should truncate long strings and add ellipsis', () => {
      const longString = 'a'.repeat(200);
      const options = { ...defaultOptions, maxStringLength: 50 };
      const result = formatString(longString, options, false);

      expect(result).toContain('...');
      expect(result.length).toBeLessThan(100);
    });
  });

  describe('formatSymbol', () => {
    it('should format Symbol with description', () => {
      const sym = Symbol('test');
      expect(formatSymbol(sym, false)).toBe('Symbol(test)');
    });
  });

  describe('formatFunction', () => {
    it('should format named function', () => {
      function test() { }
      expect(formatFunction(test, false)).toBe('[Function: test]');
    });

    it('should format anonymous function', () => {
      const fn = () => { };
      const result = formatFunction(fn, false);
      // Pode ser 'anonymous' ou 'fn' dependendo da implementação
      expect(result).toMatch(/\[Function: (anonymous|fn)\]/);
    });
  });

  describe('formatDate', () => {
    it('should format valid date', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date, false)).toContain('Date(');
      expect(formatDate(date, false)).toContain('2024');
    });

    it('should format invalid date', () => {
      const date = new Date('invalid');
      expect(formatDate(date, false)).toBe('Date(Invalid)');
    });
  });

  describe('formatError', () => {
    it('should format Error', () => {
      const error = new Error('Something went wrong');
      expect(formatError(error, false)).toBe('Error: Something went wrong');
    });
  });

  describe('formatRegExp', () => {
    it('should format RegExp', () => {
      const regex = /test/gi;
      expect(formatRegExp(regex, false)).toBe('/test/gi');
    });
  });

  describe('formatPrimitive', () => {
    it('should dispatch to correct formatter', () => {
      const result = formatPrimitive('hello', defaultOptions, false);
      expect(result.result).toBe('"hello"');
      expect(result.truncated).toBe(false);
    });
  });
});