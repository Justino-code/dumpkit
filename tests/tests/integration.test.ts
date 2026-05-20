// tests/integration.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { inspect, dump, dd, trace, measure } from '../src/index';

describe('nodedump integration', () => {
  let consoleErrorSpy: any;
  let stderrWriteSpy: any;
  let exitSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    stderrWriteSpy.mockRestore();
    exitSpy.mockRestore();
  });

  describe('complex data structures', () => {
    it('should handle nested objects with mixed types', () => {
      const data = {
        id: 1,
        name: 'John Doe',
        active: true,
        tags: new Set(['admin', 'user']),
        metadata: new Map([['created', new Date('2024-01-01')]]),
        scores: [95, 87, 92],
        profile: {
          age: 30,
          city: 'Lisbon',
          nested: {
            deep: 'value',
          },
        },
      };

      const output = inspect(data);
      
      expect(output).toContain('id: 1');
      expect(output).toContain('name: "John Doe"');
      expect(output).toContain('active: true');
      expect(output).toContain('Set(2) {');
      expect(output).toContain('Map(1) {');
      expect(output).toContain('scores: [');
      expect(output).toContain('profile: {');
    });

    it('should handle circular references in complex objects', () => {
      const user: any = { name: 'John', id: 1 };
      const post: any = { title: 'Hello', author: user };
      user.posts = [post];
      
      const output = inspect(user);
      
      expect(output).toContain('name: "John"');
      expect(output).toContain('[Circular *1]');
      expect(output).not.toThrow();
    });
  });

  describe('all exports work together', () => {
    it('should inspect, dump, and trace without conflicts', () => {
      const data = { step: 1 };
      
      const inspected = inspect(data);
      expect(inspected).toContain('step: 1');
      
      dump(data);
      expect(stderrWriteSpy).toHaveBeenCalled();
      
      trace('integration-test');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('measure should work with dump', async () => {
      const fn = async () => {
        const data = { result: 'success' };
        dump(data);
        return data;
      };
      
      const result = await measure('integrated', fn);
      
      expect(result).toEqual({ result: 'success' });
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle malformed input gracefully', () => {
      const output = inspect(null as any);
      expect(output).toBe('null');
      
      const output2 = inspect(undefined as any);
      expect(output2).toBe('undefined');
    });

    it('should handle functions with side effects', () => {
      let counter = 0;
      const obj = {
        get count() {
          counter++;
          return counter;
        },
      };
      
      const output = inspect(obj);
      
      expect(output).toContain('count:');
      // Getter should only be called once during inspection
      expect(counter).toBe(1);
    });
  });

  describe('performance', () => {
    it('should handle large objects without crashing', () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`prop${i}`] = i;
      }
      
      expect(() => inspect(largeObj)).not.toThrow();
    });

    it('should handle deeply nested objects without stack overflow', () => {
      let deep: any = { value: 'bottom' };
      for (let i = 0; i < 100; i++) {
        deep = { next: deep };
      }
      
      expect(() => inspect(deep, { depth: 10 })).not.toThrow();
    });
  });
});