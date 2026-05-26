// tests/core/renderers/flat.test.ts

import { describe, it, expect } from 'vitest';
import { flat } from '../../../src/core/renderers/flat';
import { analyze } from '../../../src/core/analysis/analyze';

describe('flat renderer', () => {
  it('should render simple object as flat', () => {
    const obj = { name: 'John', age: 30 };
    const analysis = analyze(obj);
    const result = flat(analysis, { colors: false });
    
    expect(result).toContain('name: "John"');
    expect(result).toContain('age: 30');
  });

  it('should render nested object as flat', () => {
    const obj = { user: { name: 'John', age: 30 } };
    const analysis = analyze(obj);
    const result = flat(analysis, { colors: false });
    
    expect(result).toContain('user: Object {');
    expect(result).toContain('name: "John"');
  });

  it('should render array as flat', () => {
    const arr = [1, 2, 3];
    const analysis = analyze(arr);
    const result = flat(analysis, { colors: false });
    
    expect(result).toContain('[');
    expect(result).toContain('1');
    expect(result).toContain('2');
    expect(result).toContain('3');
    expect(result).toContain(']');
  });

  it('should handle circular references', () => {
    const obj: any = { name: 'parent' };
    obj.self = obj;
    const analysis = analyze(obj);
    const result = flat(analysis, { colors: false });
    
    expect(result).toContain('[Circular *1]');
  });

  it('should respect depth option via analyze', () => {
    const obj = { a: { b: { c: { d: 'deep' } } } };
    const analysis = analyze(obj, { depth: 2 });
    const result = flat(analysis, { colors: false });
    
    expect(result).toContain('b: "[Truncated]"');
    expect(result).not.toContain('c:');
  });

  it('should respect colors option', () => {
    const obj = { name: 'John' };
    const analysis = analyze(obj);
    const resultWithColors = flat(analysis, { colors: true });
    const resultWithoutColors = flat(analysis, { colors: false });
    
    expect(resultWithColors).toContain('\x1b');
    expect(resultWithoutColors).not.toContain('\x1b');
  });
});