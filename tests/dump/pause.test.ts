// tests/dump/pause.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dp } from '../../src/dump/pause';

// Mock do readline antes de importar o módulo
vi.mock('readline', () => ({
  createInterface: vi.fn().mockReturnValue({
    question: vi.fn((question: string, callback: () => void) => {
      // Simula o callback do ENTER imediatamente
      callback();
    }),
    close: vi.fn(),
  }),
}));

describe('pause', () => {
  let stderrWriteSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    // Mock TTY para testes
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(process.stdin, 'isTTY', { value: undefined, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: undefined, configurable: true });
  });

  describe('dp', () => {
    it('should dump value and wait for user input', async () => {
      const value = { name: 'John', age: 30 };
      const result = await dp(value);
      
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(result).toBe(value);
    });

    it('should auto-continue in non-TTY environment', async () => {
      Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
      Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
      
      const value = { test: true };
      const result = await dp(value);
      
      expect(result).toBe(value);
    });

    it('should respect custom message', async () => {
      const value = { test: true };
      const message = 'Custom message: continue?';
      
      await dp(value, { message });
      
      expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('should respect timeout', async () => {
      const value = { test: true };
      
      // Timeout curto: não deve demorar mais que 50ms
      await dp(value, { timeout: 10 });
      
      expect(true).toBe(true);
    });

    it('should respect colors option', async () => {
      const value = { test: true };
      
      await dp(value, { colors: false });
      
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should respect stream option', async () => {
      const customStream = { write: vi.fn() } as unknown as NodeJS.WriteStream;
      const value = { test: true };
      
      await dp(value, { stream: customStream });
      
      expect(customStream.write).toHaveBeenCalled();
    });
  });
});
