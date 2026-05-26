// tests/core/renderers/table.test.ts

import { describe, it, expect } from 'vitest';
import { table } from '../../../src/core/renderers/table';
import { analyze } from '../../../src/core/analysis/analyze';

describe('table renderer', () => {
  it('should render array of objects as table', () => {
    const users = [
      { name: 'Alice', age: 30, city: 'Lisbon' },
      { name: 'Bob', age: 25, city: 'Porto' },
    ];
    const analysis = analyze(users);
    const result = table(analysis, { colors: false });
    
    expect(result).toContain('name');
    expect(result).toContain('age');
    expect(result).toContain('city');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
    expect(result).toContain('30');
    expect(result).toContain('25');
    expect(result).toContain('Lisbon');
    expect(result).toContain('Porto');
  });

  it('should handle empty array', () => {
    const users: any[] = [];
    const analysis = analyze(users);
    const result = table(analysis, { colors: false });
    
    expect(result).toBe('(empty array)');
  });

  it('should fallback to flat for non-array input', () => {
    const obj = { name: 'John', age: 30 };
    const analysis = analyze(obj);
    const result = table(analysis, { colors: false });
    
    expect(result).toContain('name: "John"');
    expect(result).toContain('age: 30');
  });

  it('should handle array of single object', () => {
    const users = [{ name: 'Alice', age: 30 }];
    const analysis = analyze(users);
    const result = table(analysis, { colors: false });
    
    expect(result).toContain('name');
    expect(result).toContain('age');
    expect(result).toContain('Alice');
    expect(result).toContain('30');
  });

  it('should respect colors option', () => {
    const users = [{ name: 'Alice', age: 30 }];
    const analysis = analyze(users);
    const resultWithColors = table(analysis, { colors: true });
    const resultWithoutColors = table(analysis, { colors: false });
    
    expect(resultWithColors).toContain('\x1b');
    expect(resultWithoutColors).not.toContain('\x1b');
  });
});