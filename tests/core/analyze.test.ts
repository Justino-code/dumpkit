// tests/core/analysis/analyze.test.ts

import { describe, it, expect } from 'vitest';
import { analyze } from '../../src/core/analysis/analyze';

describe('analyze', () => {
  describe('primitive values', () => {
    it('should analyze null', () => {
      const result = analyze(null);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(null);
    });

    it('should analyze undefined', () => {
      const result = analyze(undefined);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(undefined);
    });

    it('should analyze string', () => {
      const result = analyze('hello');
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe('hello');
    });

    it('should truncate long string', () => {
      const longString = 'a'.repeat(6000);
      const result = analyze(longString, { maxStringLength: 100 });
      expect(result.type).toBe('primitive');
      expect((result as any).value.length).toBeLessThan(110);
      expect((result as any).value).toContain('...');
    });

    it('should analyze number', () => {
      const result = analyze(42);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(42);
    });

    it('should analyze boolean', () => {
      const result = analyze(true);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(true);
    });

    it('should analyze bigint', () => {
      const result = analyze(9007199254740991n);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(9007199254740991n);
    });

    it('should analyze symbol', () => {
      const sym = Symbol('test');
      const result = analyze(sym);
      expect(result.type).toBe('primitive');
      expect((result as any).value).toBe(sym);
    });
  });

  describe('functions', () => {
    it('should analyze named function', () => {
      function testFn() {}
      const result = analyze(testFn);
      expect(result.type).toBe('function');
      expect((result as any).name).toBe('testFn');
    });

    it('should analyze anonymous function', () => {
      const fn = () => {};
      const result = analyze(fn);
      expect(result.type).toBe('function');
      // Arrow functions may have name 'fn' or empty string depending on environment
      const name = (result as any).name;
      expect(name === '' || name === 'fn').toBe(true);
    });
  });

  describe('objects', () => {
    it('should analyze simple object', () => {
      const obj = { name: 'John', age: 30 };
      const result = analyze(obj) as any;
      expect(result.type).toBe('object');
      expect(result.className).toBe('Object');
      expect(result.properties).toHaveLength(2);
      expect(result.properties[0].key).toBe('name');
      expect(result.properties[0].value.type).toBe('primitive');
      expect(result.properties[1].key).toBe('age');
    });

    it('should respect depth limit', () => {
      const obj = { a: { b: { c: { d: 'deep' } } } };
      const result = analyze(obj, { depth: 2 }) as any;
      expect(result.type).toBe('object');
      expect(result.properties[0].value.type).toBe('object');
      // At depth limit, deeper values become truncated primitives
      const nestedValue = result.properties[0].value.properties[0].value;
      expect(nestedValue.type).toBe('primitive');
      expect(nestedValue.value).toBe('[Truncated]');
    });

    it('should truncate properties when maxProperties exceeded', () => {
      const obj: Record<string, number> = {};
      for (let i = 0; i < 100; i++) {
        obj[`prop${i}`] = i;
      }
      const result = analyze(obj, { maxProperties: 10 }) as any;
      expect(result.truncated).toBe(true);
      expect(result.properties).toHaveLength(10);
    });
  });

  describe('arrays', () => {
    it('should analyze array', () => {
      const arr = [1, 2, 3];
      const result = analyze(arr) as any;
      expect(result.type).toBe('array');
      expect(result.length).toBe(3);
      expect(result.items).toHaveLength(3);
      expect(result.items[0].type).toBe('primitive');
    });

    it('should truncate long array', () => {
      const arr = Array.from({ length: 200 }, (_, i) => i);
      const result = analyze(arr, { maxArrayLength: 50 }) as any;
      expect(result.truncated).toBe(true);
      expect(result.items).toHaveLength(50);
    });
  });

  describe('Map', () => {
    it('should analyze Map', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      const result = analyze(map) as any;
      expect(result.type).toBe('map');
      expect(result.size).toBe(2);
      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].key.type).toBe('primitive');
      expect(result.entries[0].value.type).toBe('primitive');
    });
  });

  describe('Set', () => {
    it('should analyze Set', () => {
      const set = new Set([1, 2, 3]);
      const result = analyze(set) as any;
      expect(result.type).toBe('set');
      expect(result.size).toBe(3);
      expect(result.values).toHaveLength(3);
    });
  });

  describe('Date', () => {
    it('should analyze valid Date', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const result = analyze(date) as any;
      expect(result.type).toBe('date');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should analyze invalid Date', () => {
      const date = new Date('invalid');
      const result = analyze(date) as any;
      expect(result.type).toBe('date');
      expect(result.isValid).toBe(false);
      expect(result.value).toBe('Invalid');
    });
  });

  describe('Error', () => {
    it('should analyze Error', () => {
      const error = new Error('Something went wrong');
      const result = analyze(error) as any;
      expect(result.type).toBe('error');
      expect(result.name).toBe('Error');
      expect(result.message).toBe('Something went wrong');
    });
  });

  describe('RegExp', () => {
    it('should analyze RegExp', () => {
      const regex = /test/gi;
      const result = analyze(regex) as any;
      expect(result.type).toBe('regexp');
      expect(result.source).toBe('test');
      expect(result.flags).toBe('gi');
    });
  });

  describe('TypedArray', () => {
    it('should analyze Uint8Array', () => {
      const arr = new Uint8Array([1, 2, 3]);
      const result = analyze(arr) as any;
      expect(result.type).toBe('typedarray');
      expect(result.className).toBe('Uint8Array');
      expect(result.items).toHaveLength(3);
    });
  });

  describe('WeakMap / WeakSet / Promise', () => {
    it('should analyze WeakMap', () => {
      const weakMap = new WeakMap();
      const result = analyze(weakMap);
      expect(result.type).toBe('weakmap');
    });

    it('should analyze WeakSet', () => {
      const weakSet = new WeakSet();
      const result = analyze(weakSet);
      expect(result.type).toBe('weakset');
    });

    it('should analyze Promise', () => {
      const promise = Promise.resolve('done');
      const result = analyze(promise);
      expect(result.type).toBe('promise');
    });
  });

  describe('circular references', () => {
    it('should detect circular reference', () => {
      const obj: any = { name: 'parent' };
      obj.self = obj;
      const result = analyze(obj) as any;
      
      const selfProp = result.properties.find((p: any) => p.key === 'self');
      expect(selfProp.value.type).toBe('circular');
      expect(selfProp.value.refId).toBeDefined();
    });
  });

  describe('shared references', () => {
    it('should detect shared reference', () => {
      const shared = { value: 42 };
      const obj = { a: shared, b: shared };
      const result = analyze(obj) as any;
      
      const propA = result.properties.find((p: any) => p.key === 'a');
      const propB = result.properties.find((p: any) => p.key === 'b');
      
      expect(propA.value.type).toBe('object');
      expect(propB.value.type).toBe('shared');
      expect(propB.value.refId).toBeDefined();
    });
  });

  describe('showHidden option', () => {
    it('should show non-enumerable properties when enabled', () => {
      const obj: any = { visible: 1 };
      Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
      
      const resultWithout = analyze(obj, { showHidden: false }) as any;
      expect(resultWithout.properties.map((p: any) => p.key)).not.toContain('hidden');
      
      const resultWith = analyze(obj, { showHidden: true }) as any;
      expect(resultWith.properties.map((p: any) => p.key)).toContain('hidden');
    });
  });
});