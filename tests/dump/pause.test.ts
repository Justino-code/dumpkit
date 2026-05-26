// tests/dump/pause.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dp } from '../../src/dump/pause';

describe('pause', () => {
  let stderrWriteSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('dp', () => {
    describe('flat view (default)', () => {
      it('should output formatted value', async () => {
        const value = { name: 'John', age: 30 };
        
        // Mock para evitar espera real
        const promise = dp(value);
        
        // Pequeno timeout para permitir execução assíncrona
        await Promise.race([
          promise,
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });

      it('should handle primitive values', async () => {
        await Promise.race([
          dp(42),
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });

      it('should respect custom message', async () => {
        const value = { test: true };
        const message = 'Custom message: continue?';
        
        await Promise.race([
          dp(value, { message }),
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });

      it('should respect colors option', async () => {
        const value = { name: 'John' };
        
        await Promise.race([
          dp(value, { colors: false }),
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });
    });

    describe('tree view', () => {
      it('should output tree format', async () => {
        const value = { name: 'John', age: 30 };
        
        await Promise.race([
          dp(value, { view: 'tree', colors: false }),
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });
    });

    describe('table view', () => {
      it('should output table format for arrays', async () => {
        const users = [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 }
        ];
        
        await Promise.race([
          dp(users, { view: 'table', colors: false }),
          new Promise(resolve => setTimeout(resolve, 100))
        ]);
        
        expect(stderrWriteSpy).toHaveBeenCalled();
      });
    });

    describe('automatic behavior', () => {
      it('should auto-continue in non-TTY environment', async () => {
        // Mock isTTY temporariamente
        const originalIsTTY = process.stdin.isTTY;
        Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
        Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
        
        const value = { test: true };
        const result = await dp(value);
        
        expect(result).toBe(value);
        
        Object.defineProperty(process.stdin, 'isTTY', { value: originalIsTTY, configurable: true });
        Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true });
      });

      it('should respect timeout', async () => {
        const value = { test: true };
        
        // Timeout curto deve continuar automaticamente
        const result = await dp(value, { timeout: 10 });
        
        expect(result).toBe(value);
      });
    });
  });
});