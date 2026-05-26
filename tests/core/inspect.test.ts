// tests/core/inspect.test.ts

import { describe, it, expect } from 'vitest';
import { inspect } from '../../src/core/inspect';

describe('inspect', () => {
  describe('flat view (default)', () => {
    it('should return formatted string for primitive values', () => {
      expect(inspect('hello')).toBe('"hello"');
      expect(inspect(42)).toBe('42');
      expect(inspect(true)).toBe('true');
      expect(inspect(null)).toBe('null');
      expect(inspect(undefined)).toBe('undefined');
    });

    it('should format simple objects', () => {
      const obj = { name: 'John', age: 30 };
      const result = inspect(obj);
      expect(result).toContain('name: "John"');
      expect(result).toContain('age: 30');
    });

    it('should format nested objects', () => {
      const obj = { user: { name: 'John', address: { city: 'Lisbon' } } };
      const result = inspect(obj);
      expect(result).toContain('user: Object {');
      expect(result).toContain('address: Object {');
      expect(result).toContain('city: "Lisbon"');
    });

    it('should respect depth option', () => {
      const obj = { a: { b: { c: { d: 'deep' } } } };
      const result = inspect(obj, { depth: 2 });
      expect(result).toContain('b: "[Truncated]"');
      expect(result).not.toContain('d:');
    });

    it('should respect colors option', () => {
      const obj = { name: 'John' };
      const resultWithColors = inspect(obj, { colors: true });
      const resultWithoutColors = inspect(obj, { colors: false });
      
      expect(resultWithColors).toContain('\x1b');
      expect(resultWithoutColors).not.toContain('\x1b');
    });

    it('should format arrays', () => {
      const arr = [1, 2, 3];
      const result = inspect(arr);
      expect(result).toContain('[');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
      expect(result).toContain(']');
    });

    it('should format Maps', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      const result = inspect(map);
      expect(result).toContain('Map(2) {');
      expect(result).toContain('"a" => 1');
      expect(result).toContain('"b" => 2');
    });

    it('should format Sets', () => {
      const set = new Set([1, 2, 3]);
      const result = inspect(set);
      expect(result).toContain('Set(3) {');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should handle circular references gracefully', () => {
      const obj: any = { name: 'parent' };
      obj.self = obj;
      
      const result = inspect(obj);
      expect(result).toContain('[Circular *1]');
    });

    it('should format Date objects', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const result = inspect(date);
      expect(result).toContain('Date(');
    });

    it('should format Error objects', () => {
      const error = new Error('Test error');
      const result = inspect(error);
      expect(result).toContain('Error: Test error');
    });

    it('should format RegExp objects', () => {
      const regex = /test/gi;
      const result = inspect(regex);
      expect(result).toBe('/test/gi');
    });

    it('should handle functions', () => {
      function testFn() {}
      const result = inspect(testFn);
      expect(result).toBe('[Function: testFn]');
    });

    it('should handle null and undefined', () => {
      expect(inspect(null)).toBe('null');
      expect(inspect(undefined)).toBe('undefined');
    });

    it('should respect maxArrayLength option', () => {
      const arr = Array.from({ length: 200 }, (_, i) => i);
      const result = inspect(arr, { maxArrayLength: 10 });
      expect(result).toContain('... 190 more items');
    });

    it('should respect maxStringLength option', () => {
      const longString = 'a'.repeat(500);
      const result = inspect(longString, { maxStringLength: 50 });
      expect(result.length).toBeLessThan(200);
    });
  });

  describe('tree view', () => {
    it('should return tree representation', () => {
      const obj = { name: 'John', age: 30 };
      const result = inspect(obj, { view: 'tree', colors: false });
      expect(result).toContain('Object');
      // The tree view shows property values without keys in this implementation
      expect(result).toContain('"John"');
      expect(result).toContain('30');
    });

    it('should handle nested objects in tree view', () => {
      const obj = { user: { name: 'John', age: 30 } };
      const result = inspect(obj, { view: 'tree', colors: false });
      expect(result).toContain('Object');
      expect(result).toContain('"John"');
      expect(result).toContain('30');
    });
  });

  describe('table view', () => {
    it('should return table representation for array of objects', () => {
      const users = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ];
      const result = inspect(users, { view: 'table', colors: false });
      expect(result).toContain('name');
      expect(result).toContain('age');
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
      expect(result).toContain('30');
      expect(result).toContain('25');
    });

    it('should fallback to flat for non-array input', () => {
      const obj = { name: 'John', age: 30 };
      const result = inspect(obj, { view: 'table', colors: false });
      // Should return flat representation
      expect(result).toContain('name: "John"');
      expect(result).toContain('age: 30');
    });
  });
});