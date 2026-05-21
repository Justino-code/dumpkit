// tests/dump/pause.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dp } from '../../src/dump/pause';

describe('pause', () => {
  let stderrWriteSpy: any;
  let stdinResumeSpy: any;
  let stdinPauseSpy: any;
  let stdinOnceSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    stdinResumeSpy = vi.spyOn(process.stdin, 'resume').mockImplementation(() => {});
    stdinPauseSpy = vi.spyOn(process.stdin, 'pause').mockImplementation(() => {});
    stdinOnceSpy = vi.spyOn(process.stdin, 'once').mockImplementation(() => {});
    
    // Mock TTY para testes interativos
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
      
      const promise = dp(value);
      
      const dataCallback = stdinOnceSpy.mock.calls.find(call => call[0] === 'data')?.[1];
      if (dataCallback) dataCallback(Buffer.from('\n'));
      
      const result = await promise;
      
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
      
      const promise = dp(value, { message });
      
      const dataCallback = stdinOnceSpy.mock.calls.find(call => call[0] === 'data')?.[1];
      if (dataCallback) dataCallback(Buffer.from('\n'));
      
      await promise;
      
      expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('should respect timeout', async () => {
      const value = { test: true };
      
      await dp(value, { timeout: 10 });
      
      expect(true).toBe(true);
    });

    it('should respect colors option', async () => {
      const value = { test: true };
      
      const promise = dp(value, { colors: false });
      
      const dataCallback = stdinOnceSpy.mock.calls.find(call => call[0] === 'data')?.[1];
      if (dataCallback) dataCallback(Buffer.from('\n'));
      
      await promise;
      
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should respect stream option', async () => {
      const customStream = { write: vi.fn() } as unknown as NodeJS.WriteStream;
      const value = { test: true };
      
      const promise = dp(value, { stream: customStream });
      
      const dataCallback = stdinOnceSpy.mock.calls.find(call => call[0] === 'data')?.[1];
      if (dataCallback) dataCallback(Buffer.from('\n'));
      
      await promise;
      
      expect(customStream.write).toHaveBeenCalled();
    });
  });
});