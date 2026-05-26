// tests/core/collections.test.ts

import { describe, it, expect } from 'vitest';
import {
  formatArrayFromNode,
  formatMapFromNode,
  formatSetFromNode,
  formatWeakMapFromNode,
  formatWeakSetFromNode,
  formatTypedArrayFromNode,
} from '../../src/core/collections';

// Mock formatNode para testes
function mockFormatNode(node: any, useColors: boolean, indentLevel: number, indentSize: number): string {
  if (node.type === 'primitive') {
    const val = node.value;
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  }
  if (node.type === 'array') return '[Array]';
  if (node.type === 'object') return '{Object}';
  return String(node);
}

describe('collections', () => {
  describe('formatArrayFromNode', () => {
    it('should format empty array', () => {
      const node = { items: [], length: 0, truncated: false };
      const result = formatArrayFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toBe('[]');
    });

    it('should format array with primitive values', () => {
      const node = {
        items: [
          { type: 'primitive', value: 1 },
          { type: 'primitive', value: 'two' },
          { type: 'primitive', value: true },
        ],
        length: 3,
        truncated: false,
      };
      const result = formatArrayFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('[');
      expect(result).toContain('1');
      expect(result).toContain('"two"');
      expect(result).toContain('true');
    });

    it('should truncate array when exceeding maxArrayLength', () => {
      const items = Array.from({ length: 150 }, (_, i) => ({ type: 'primitive', value: i }));
      const node = { items: items.slice(0, 10), length: 150, truncated: true };
      const result = formatArrayFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('... 140 more items');
    });
  });

  describe('formatMapFromNode', () => {
    it('should format empty Map', () => {
      const node = { size: 0, entries: [], truncated: false };
      const result = formatMapFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toBe('Map(0) {}');
    });

    it('should format Map with entries', () => {
      const node = {
        size: 2,
        entries: [
          { key: { type: 'primitive', value: 'a' }, value: { type: 'primitive', value: 1 } },
          { key: { type: 'primitive', value: 'b' }, value: { type: 'primitive', value: 2 } },
        ],
        truncated: false,
      };
      const result = formatMapFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Map(2) {');
      expect(result).toContain('"a" => 1');
      expect(result).toContain('"b" => 2');
    });

    it('should truncate large Map', () => {
      const entries = Array.from({ length: 150 }, (_, i) => ({
        key: { type: 'primitive', value: `key${i}` },
        value: { type: 'primitive', value: i },
      }));
      const node = { size: 150, entries: entries.slice(0, 10), truncated: true };
      const result = formatMapFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('... 140 more entries');
    });
  });

  describe('formatSetFromNode', () => {
    it('should format empty Set', () => {
      const node = { size: 0, values: [], truncated: false };
      const result = formatSetFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toBe('Set(0) {}');
    });

    it('should format Set with values', () => {
      const node = {
        size: 3,
        values: [
          { type: 'primitive', value: 1 },
          { type: 'primitive', value: 2 },
          { type: 'primitive', value: 3 },
        ],
        truncated: false,
      };
      const result = formatSetFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Set(3) {');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });
  });

  describe('formatWeakMapFromNode', () => {
    it('should format WeakMap without iterating', () => {
      const result = formatWeakMapFromNode(null, false);
      expect(result).toBe('WeakMap { <items cannot be iterated> }');
    });
  });

  describe('formatWeakSetFromNode', () => {
    it('should format WeakSet without iterating', () => {
      const result = formatWeakSetFromNode(null, false);
      expect(result).toBe('WeakSet { <items cannot be iterated> }');
    });
  });

  describe('formatTypedArrayFromNode', () => {
    it('should format Uint8Array', () => {
      const node = {
        className: 'Uint8Array',
        items: [
          { type: 'primitive', value: 1 },
          { type: 'primitive', value: 2 },
          { type: 'primitive', value: 3 },
        ],
        truncated: false,
      };
      const result = formatTypedArrayFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Uint8Array [');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should format Int32Array', () => {
      const node = {
        className: 'Int32Array',
        items: [
          { type: 'primitive', value: 10 },
          { type: 'primitive', value: 20 },
          { type: 'primitive', value: 30 },
        ],
        truncated: false,
      };
      const result = formatTypedArrayFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Int32Array [');
    });
  });
});