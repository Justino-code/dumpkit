// tests/core/collections.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatArray,
  formatMap,
  formatSet,
  formatWeakMap,
  formatWeakSet,
  formatTypedArray,
} from '../../src/core/collections';
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

describe('collections', () => {
  let circularDetector: CircularDetector;

  beforeEach(() => {
    circularDetector = new CircularDetector();
  });

  describe('formatArray', () => {
    it('should format empty array', () => {
      const result = formatArray([], defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toBe('[]');
      expect(result.truncated).toBe(false);
    });

    it('should format array with primitive values', () => {
      const arr = [1, 'two', true];
      const result = formatArray(arr, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('[');
      expect(result.result).toContain('1');
      expect(result.result).toContain('"two"');
      expect(result.result).toContain('true');
    });

    it('should truncate array when exceeding maxArrayLength', () => {
      const arr = Array.from({ length: 150 }, (_, i) => i);
      const options = { ...defaultOptions, maxArrayLength: 10 };
      const result = formatArray(arr, options, false, 4, circularDetector, 'root');
      expect(result.truncated).toBe(true);
      expect(result.result).toContain('... 140 more items');
    });

    it('should handle depth limit', () => {
      const arr = [[[[[1]]]]];
      const result = formatArray(arr, defaultOptions, false, 1, circularDetector, 'root');
      expect(result.result).toContain('[Array]');
    });

    it('should detect circular references in array', () => {
      const arr: any[] = [];
      arr.push(arr);
      
      const result = formatArray(arr, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('[Circular *1]');
    });
  });

  describe('formatMap', () => {
    it('should format empty Map', () => {
      const map = new Map();
      const result = formatMap(map, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toBe('Map(0) {}');
      expect(result.truncated).toBe(false);
    });

    it('should format Map with entries', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const result = formatMap(map, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('Map(2) {');
      expect(result.result).toContain('"a" => 1');
      expect(result.result).toContain('"b" => 2');
    });

    it('should truncate large Map', () => {
      const map = new Map();
      for (let i = 0; i < 150; i++) {
        map.set(`key${i}`, i);
      }
      const options = { ...defaultOptions, maxArrayLength: 10 };
      const result = formatMap(map, options, false, 4, circularDetector, 'root');
      expect(result.truncated).toBe(true);
      expect(result.result).toContain('... 140 more entries');
    });
  });

  describe('formatSet', () => {
    it('should format empty Set', () => {
      const set = new Set();
      const result = formatSet(set, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toBe('Set(0) {}');
    });

    it('should format Set with values', () => {
      const set = new Set([1, 2, 3]);
      const result = formatSet(set, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('Set(3) {');
      expect(result.result).toContain('1');
      expect(result.result).toContain('2');
      expect(result.result).toContain('3');
    });
  });

  describe('formatWeakMap', () => {
    it('should format WeakMap without iterating', () => {
      const weakMap = new WeakMap();
      const result = formatWeakMap(weakMap, false);
      expect(result).toBe('WeakMap { <items cannot be iterated> }');
    });
  });

  describe('formatWeakSet', () => {
    it('should format WeakSet without iterating', () => {
      const weakSet = new WeakSet();
      const result = formatWeakSet(weakSet, false);
      expect(result).toBe('WeakSet { <items cannot be iterated> }');
    });
  });

  describe('formatTypedArray', () => {
    it('should format Uint8Array', () => {
      const arr = new Uint8Array([1, 2, 3]);
      const result = formatTypedArray(arr, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('Uint8Array [');
      expect(result.result).toContain('1');
      expect(result.result).toContain('2');
      expect(result.result).toContain('3');
    });

    it('should format Int32Array', () => {
      const arr = new Int32Array([10, 20, 30]);
      const result = formatTypedArray(arr, defaultOptions, false, 4, circularDetector, 'root');
      expect(result.result).toContain('Int32Array [');
    });
  });
});