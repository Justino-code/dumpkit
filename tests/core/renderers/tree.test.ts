// tests/core/renderers/tree.test.ts

import { describe, it, expect } from 'vitest';
import { tree } from '../../../src/core/renderers/tree';
import { analyze } from '../../../src/core/analysis/analyze';

describe('tree renderer', () => {
  it('should render simple object as tree (showing values only)', () => {
    const obj = { name: 'John', age: 30 };
    const analysis = analyze(obj);
    const result = tree(analysis, { colors: false });
    
    expect(result).toContain('Object');
    expect(result).toContain('"John"');
    expect(result).toContain('30');
  });

  it('should render nested object as tree', () => {
    const obj = { user: { name: 'John', age: 30 } };
    const analysis = analyze(obj);
    const result = tree(analysis, { colors: false });
    
    expect(result).toContain('Object');
    expect(result).toContain('"John"');
    expect(result).toContain('30');
  });

  it('should render array as tree', () => {
    const arr = [1, 2, 3];
    const analysis = analyze(arr);
    const result = tree(analysis, { colors: false });
    
    expect(result).toContain('Array(3)');
    expect(result).toContain('1');
    expect(result).toContain('2');
    expect(result).toContain('3');
  });

  it('should handle circular references', () => {
    const obj: any = { name: 'parent' };
    obj.self = obj;
    const analysis = analyze(obj);
    const result = tree(analysis, { colors: false });
    
    expect(result).toContain('[Circular *1]');
  });

  it('should respect colors option', () => {
    const obj = { name: 'John' };
    const analysis = analyze(obj);
    const resultWithColors = tree(analysis, { colors: true });
    const resultWithoutColors = tree(analysis, { colors: false });
    
    expect(resultWithColors).toContain('\x1b');
    expect(resultWithoutColors).not.toContain('\x1b');
  });
});