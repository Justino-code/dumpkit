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

    it('should respect options', () => {
      const value = { a: { b: { c: { d: 'deep' } } } };
      dump(value, { depth: 1 });
      
      const written = stderrWriteSpy.mock.calls[0][0];
      expect(written).toContain('[Object]');
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

    it('should output before exiting', () => {
      const value = { message: 'Stopping here' };
      
      dd(value);
      
      // Verificar que o output foi chamado
      expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
      
      const written = stderrWriteSpy.mock.calls[0][0];
      expect(written).toContain('message: "Stopping here"');
      
      // Verificar que exit foi chamado DEPOIS do output
      // O mock.calls ordem: primeiro stderrWriteSpy, depois exitSpy
      const stderrCallOrder = stderrWriteSpy.mock.invocationCallOrder?.[0] || 0;
      const exitCallOrder = exitSpy.mock.invocationCallOrder?.[0] || 0;
      
      // Se invocationCallOrder não estiver disponível, apenas verificamos que ambos foram chamados
      if (stderrCallOrder && exitCallOrder) {
        expect(stderrCallOrder).toBeLessThan(exitCallOrder);
      } else {
        // Fallback: apenas verificar que ambos foram chamados
        expect(stderrWriteSpy).toHaveBeenCalled();
        expect(exitSpy).toHaveBeenCalled();
      }
    });

    it('should respect options', () => {
      const value = { a: { b: { c: 'deep' } } };
      
      dd(value, { depth: 1 });
      
      const written = stderrWriteSpy.mock.calls[0][0];
      expect(written).toContain('[Object]');
      expect(exitSpy).toHaveBeenCalled();
    });
  });
});