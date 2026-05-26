// tests/dump/dump.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dump, dd } from '../../src/dump/dump';

describe('dump', () => {
  let stderrWriteSpy: any;
  let exitSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    stderrWriteSpy.mockRestore();
    exitSpy.mockRestore();
  });

  describe('dump', () => {
    describe('flat view (default)', () => {
      it('should output formatted value to stderr', () => {
        const value = { name: 'John', age: 30 };
        const result = dump(value);
        
        expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('name: "John"');
        expect(written).toContain('age: 30');
        expect(written).toMatch(/\n$/);
      });

      it('should return the original value for chaining', () => {
        const value = { name: 'John' };
        const result = dump(value);
        expect(result).toBe(value);
      });

      it('should handle primitive values', () => {
        dump(42);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('42');
      });

      it('should handle null', () => {
        dump(null);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('null');
      });

      it('should handle undefined', () => {
        dump(undefined);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('undefined');
      });

      it('should respect depth option', () => {
        const value = { a: { b: { c: { d: 'deep' } } } };
        dump(value, { depth: 1 });
        
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('a: "[Truncated]"');
      });

      it('should respect colors option', () => {
        const value = { name: 'John' };
        
        dump(value, { colors: false });
        const withoutColors = stderrWriteSpy.mock.calls[0][0];
        expect(withoutColors).not.toContain('\x1b');
        
        stderrWriteSpy.mockClear();
        
        dump(value, { colors: true });
        const withColors = stderrWriteSpy.mock.calls[0][0];
        expect(withColors).toContain('\x1b');
      });

      it('should write to custom stream when provided', () => {
        const customStream = { write: vi.fn() } as unknown as NodeJS.WriteStream;
        const value = { test: 'data' };
        
        dump(value, { stream: customStream });
        
        expect(customStream.write).toHaveBeenCalledTimes(1);
        expect(process.stderr.write).not.toHaveBeenCalled();
      });

      it('should format arrays correctly', () => {
        dump([1, 2, 3]);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('[');
        expect(written).toContain('1');
        expect(written).toContain('2');
        expect(written).toContain('3');
        expect(written).toContain(']');
      });

      it('should format Maps correctly', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        dump(map);
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('Map(2) {');
        expect(written).toContain('"a" => 1');
      });
    });

    describe('tree view', () => {
      it('should output tree representation', () => {
        const value = { name: 'John', age: 30 };
        dump(value, { view: 'tree', colors: false });
        
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('Object');
        expect(written).toContain('"John"');
        expect(written).toContain('30');
      });

      it('should handle nested objects in tree view', () => {
        const value = { user: { name: 'John', age: 30 } };
        dump(value, { view: 'tree', colors: false });
        
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('Object');
        expect(written).toContain('"John"');
        expect(written).toContain('30');
      });
    });

    describe('table view', () => {
      it('should output table representation for array of objects', () => {
        const users = [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 }
        ];
        dump(users, { view: 'table', colors: false });
        
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('name');
        expect(written).toContain('age');
        expect(written).toContain('Alice');
        expect(written).toContain('Bob');
        expect(written).toContain('30');
        expect(written).toContain('25');
      });

      it('should fallback to flat for non-array input', () => {
        const value = { name: 'John', age: 30 };
        dump(value, { view: 'table', colors: false });
        
        const written = stderrWriteSpy.mock.calls[0][0];
        expect(written).toContain('name: "John"');
        expect(written).toContain('age: 30');
      });
    });
  });

  describe('dd', () => {
    it('should output formatted value and exit process', () => {
      const value = { error: 'Something wrong' };
      
      dd(value);
      
      expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should exit with code 1', () => {
      dd('test');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should respect depth option', () => {
      const value = { a: { b: { c: 'deep' } } };
      
      dd(value, { depth: 1 });
      
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should support tree view', () => {
      const value = { name: 'John', age: 30 };
      
      dd(value, { view: 'tree', colors: false });
      
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should support table view for arrays', () => {
      const users = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ];
      
      dd(users, { view: 'table', colors: false });
      
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});