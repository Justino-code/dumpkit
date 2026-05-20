// tests/core/object.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { formatObject } from '../../../src/core/object';
import { CircularDetector } from '../../../src/shared/utils/circular';
import type { ResolvedFormatOptions } from '../../../src/shared/types/dto';

const defaultOptions: ResolvedFormatOptions = {
  depth: 4,
  colors: false,
  showHidden: false,
  maxArrayLength: 100,
  maxStringLength: 100,
  indent: 2,
  maxProperties: 50,
};

describe('object', () => {
  let circularDetector: CircularDetector;

  beforeEach(() => {
    circularDetector = new CircularDetector();
  });

  describe('formatObject', () => {
    it('should format empty object', () => {
      const obj = {};
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toBe('{}');
      expect(result.truncated).toBe(false);
    });

    it('should format object with primitive properties', () => {
      const obj = { name: 'John', age: 30, active: true };
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('{');
      expect(result.result).toContain('name: "John"');
      expect(result.result).toContain('age: 30');
      expect(result.result).toContain('active: true');
    });

    it('should format nested objects', () => {
      const obj = { user: { name: 'John', address: { city: 'Lisbon' } } };
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('user: {');
      expect(result.result).toContain('address: {');
      expect(result.result).toContain('city: "Lisbon"');
    });

    it('should respect depth limit', () => {
      const obj = { a: { b: { c: { d: { e: 'deep' } } } } };
      const result = formatObject(obj, defaultOptions, false, 2, circularDetector, 'root');
      expect(result.result).toContain('[Object]');
    });

    it('should truncate objects with many properties', () => {
      const obj: Record<string, number> = {};
      for (let i = 0; i < 100; i++) {
        obj[`prop${i}`] = i;
      }
      const options = { ...defaultOptions, maxProperties: 10 };
      const result = formatObject(obj, options, false, 4, circularDetector, 'root');
      expect(result.truncated).toBe(true);
      expect(result.result).toContain('... 90 more properties');
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'parent' };
      obj.self = obj;
      
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('[Circular *1]');
    });

    it('should format objects with numeric keys', () => {
      const obj = { '123': 'numeric', 'abc': 'string' };
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('"123": "numeric"');
      expect(result.result).toContain('abc: "string"');
    });

    it('should format objects with special characters in keys', () => {
      const obj = { 'my-key': 'value', 'hello world': 'foo' };
      const result = formatObject(obj, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('"my-key": "value"');
      expect(result.result).toContain('"hello world": "foo"');
    });

    it('should show constructor name for non-plain objects', () => {
      class Person {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }
      const person = new Person('John');
      const result = formatObject(person, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('Person {');
      expect(result.result).toContain('name: "John"');
    });
  });
});