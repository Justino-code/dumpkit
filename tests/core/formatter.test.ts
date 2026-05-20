import { describe, it, expect } from 'vitest';
import { formatValue } from '../../src/core/formatter';
import { CircularDetector } from '../../src/shared/utils/circular';
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

describe('formatter', () => {
  describe('formatValue', () => {
    it('should format primitive values', () => {
      const detector = new CircularDetector();
      
      // String
      const strResult = formatValue('hello', defaultOptions, 4, detector, 'root');
      expect(strResult.result).toBe('"hello"');
      
      // Number
      const numResult = formatValue(42, defaultOptions, 4, detector, 'root');
      expect(numResult.result).toBe('42');
      
      // Boolean
      const boolResult = formatValue(true, defaultOptions, 4, detector, 'root');
      expect(boolResult.result).toBe('true');
      
      // Null
      const nullResult = formatValue(null, defaultOptions, 4, detector, 'root');
      expect(nullResult.result).toBe('null');
      
      // Undefined
      const undefResult = formatValue(undefined, defaultOptions, 4, detector, 'root');
      expect(undefResult.result).toBe('undefined');
    });

    it('should format arrays', () => {
      const detector = new CircularDetector();
      const arr = [1, 2, 3];
      
      const result = formatValue(arr, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('[');
      expect(result.result).toContain('1');
      expect(result.result).toContain('2');
      expect(result.result).toContain('3');
      expect(result.result).toContain(']');
    });

    it('should format objects', () => {
      const detector = new CircularDetector();
      const obj = { name: 'John', age: 30 };
      
      const result = formatValue(obj, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('{');
      expect(result.result).toContain('name: "John"');
      expect(result.result).toContain('age: 30');
      expect(result.result).toContain('}');
    });

    it('should respect depth limit', () => {
      const detector = new CircularDetector();
      const obj = { a: { b: { c: { d: 'deep' } } } };
      
      const result = formatValue(obj, defaultOptions, 1, detector, 'root');
      expect(result.result).toContain('[Object]');
    });

    it('should handle circular references', () => {
      const detector = new CircularDetector();
      const obj: any = { name: 'parent' };
      obj.self = obj;
      
      const result = formatValue(obj, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('self:');
    });

    it('should format Date objects', () => {
      const detector = new CircularDetector();
      const date = new Date('2024-01-01T00:00:00Z');
      
      const result = formatValue(date, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('Date(');
    });

    it('should format Map objects', () => {
      const detector = new CircularDetector();
      const map = new Map([['a', 1], ['b', 2]]);
      
      const result = formatValue(map, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('Map(2) {');
    });

    it('should format Set objects', () => {
      const detector = new CircularDetector();
      const set = new Set([1, 2, 3]);
      
      const result = formatValue(set, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('Set(3) {');
    });

    it('should format RegExp objects', () => {
      const detector = new CircularDetector();
      const regex = /test/gi;
      
      const result = formatValue(regex, defaultOptions, 4, detector, 'root');
      expect(result.result).toBe('/test/gi');
    });

    it('should format Error objects', () => {
      const detector = new CircularDetector();
      const error = new Error('Something went wrong');
      
      const result = formatValue(error, defaultOptions, 4, detector, 'root');
      expect(result.result).toContain('Error: Something went wrong');
    });

    it('should format functions', () => {
      const detector = new CircularDetector();
      function testFn() {}
      
      const result = formatValue(testFn, defaultOptions, 4, detector, 'root');
      expect(result.result).toBe('[Function: testFn]');
    });

    it('should format with colors', () => {
      const detector = new CircularDetector();
      const options = { ...defaultOptions, colors: true };
      const obj = { name: 'John' };
      
      const result = formatValue(obj, options, 4, detector, 'root');
      expect(result.result).toContain('\x1b');
    });

    it('should truncate long strings', () => {
      const detector = new CircularDetector();
      const longString = 'a'.repeat(200);
      const options = { ...defaultOptions, maxStringLength: 50 };
      
      const result = formatValue(longString, options, 4, detector, 'root');
      expect(result.result.length).toBeLessThan(100);
    });
  });
});