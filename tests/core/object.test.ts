// tests/core/object.test.ts (corrigido)

import { describe, it, expect } from 'vitest';
import { formatObjectFromNode, formatKey, isNumericIndex } from '../../src/core/object';

// Mock formatNode para testes que mostra a estrutura aninhada
function mockFormatNode(node: any, useColors: boolean, indentLevel: number, indentSize: number): string {
  if (node.type === 'primitive') {
    const val = node.value;
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  }
  if (node.type === 'object') {
    // Para objetos aninhados, mostra o className
    const className = node.className || 'Object';
    return `${className} { ... }`;
  }
  if (node.type === 'array') return '[Array]';
  return String(node);
}

describe('object', () => {
  describe('isNumericIndex', () => {
    it('should return true for numeric string keys', () => {
      expect(isNumericIndex('123')).toBe(true);
      expect(isNumericIndex('0')).toBe(true);
    });

    it('should return false for non-numeric keys', () => {
      expect(isNumericIndex('abc')).toBe(false);
      expect(isNumericIndex('123abc')).toBe(false);
      expect(isNumericIndex('12.34')).toBe(false);
    });

    it('should return false for symbols', () => {
      expect(isNumericIndex(Symbol('test'))).toBe(false);
    });
  });

  describe('formatKey', () => {
    it('should format numeric keys without quotes', () => {
      const result = formatKey('123', false);
      expect(result).toBe('123');
    });

    it('should format valid identifiers without quotes', () => {
      expect(formatKey('abc', false)).toBe('abc');
      expect(formatKey('_valid', false)).toBe('_valid');
      expect(formatKey('$valid', false)).toBe('$valid');
    });

    it('should format special keys with quotes', () => {
      expect(formatKey('my-key', false)).toBe('"my-key"');
      expect(formatKey('hello world', false)).toBe('"hello world"');
    });

    it('should format symbols with special notation', () => {
      const sym = Symbol('test');
      expect(formatKey(sym, false)).toBe('[Symbol(test)]');
    });
  });

  describe('formatObjectFromNode', () => {
    it('should format empty object', () => {
      const node = { className: 'Object', properties: [], truncated: false };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toBe('Object {}');
    });

    it('should format object with primitive properties', () => {
      const node = {
        className: 'Object',
        properties: [
          { key: 'name', value: { type: 'primitive', value: 'John' } },
          { key: 'age', value: { type: 'primitive', value: 30 } },
          { key: 'active', value: { type: 'primitive', value: true } },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Object {');
      expect(result).toContain('name: "John"');
      expect(result).toContain('age: 30');
      expect(result).toContain('active: true');
    });

    it('should format nested objects', () => {
      const node = {
        className: 'Object',
        properties: [
          {
            key: 'user',
            value: {
              type: 'object',
              className: 'Object',
              properties: [
                { key: 'name', value: { type: 'primitive', value: 'John' } },
                {
                  key: 'address',
                  value: {
                    type: 'object',
                    className: 'Object',
                    properties: [
                      { key: 'city', value: { type: 'primitive', value: 'Lisbon' } },
                    ],
                    truncated: false,
                  },
                },
              ],
              truncated: false,
            },
          },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('user: Object { ... }');
    });

    it('should respect depth limit via mock', () => {
      const node = {
        className: 'Object',
        properties: [
          {
            key: 'a',
            value: {
              type: 'object',
              className: 'Object',
              properties: [
                {
                  key: 'b',
                  value: {
                    type: 'object',
                    className: 'Object',
                    properties: [],
                    truncated: false,
                  },
                },
              ],
              truncated: false,
            },
          },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('a: Object { ... }');
    });

    it('should truncate objects with many properties', () => {
      const properties = Array.from({ length: 100 }, (_, i) => ({
        key: `prop${i}`,
        value: { type: 'primitive', value: i },
      }));
      const node = { className: 'Object', properties: properties.slice(0, 10), truncated: true };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('... more properties');
    });

    it('should format numeric keys without quotes', () => {
      const node = {
        className: 'Object',
        properties: [
          { key: '123', value: { type: 'primitive', value: 'numeric' } },
          { key: '456', value: { type: 'primitive', value: 'value' } },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('123: "numeric"');
      expect(result).not.toContain('"123"');
    });

    it('should format valid identifiers without quotes', () => {
      const node = {
        className: 'Object',
        properties: [
          { key: 'abc', value: { type: 'primitive', value: 'value' } },
          { key: '_valid', value: { type: 'primitive', value: 'test' } },
          { key: '$valid', value: { type: 'primitive', value: 'test' } },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('abc: "value"');
      expect(result).toContain('_valid: "test"');
      expect(result).toContain('$valid: "test"');
    });

    it('should format special keys with quotes', () => {
      const node = {
        className: 'Object',
        properties: [
          { key: 'my-key', value: { type: 'primitive', value: 'value' } },
          { key: 'hello world', value: { type: 'primitive', value: 'foo' } },
        ],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('"my-key": "value"');
      expect(result).toContain('"hello world": "foo"');
    });

    it('should show constructor name for non-plain objects', () => {
      const node = {
        className: 'Person',
        properties: [{ key: 'name', value: { type: 'primitive', value: 'John' } }],
        truncated: false,
      };
      const result = formatObjectFromNode(node, false, 0, 2, mockFormatNode);
      expect(result).toContain('Person {');
      expect(result).toContain('name: "John"');
    });
  });
});