// tests/trace/trace.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trace } from '../../src/trace/trace';

describe('trace', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('trace without label', () => {
    it('should output trace with caller location', () => {
      trace();
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
      expect(output).toContain('at');
    });
  });

  describe('trace with label', () => {
    it('should output trace with label', () => {
      trace('checkpoint-1');
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('[Trace] checkpoint-1');
      expect(output).toContain('at');
    });

    it('should handle empty string label', () => {
      trace('');
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
    });
  });

  describe('trace with options', () => {
    it('should respect colors: false', () => {
      trace('test', { colors: false });
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).not.toContain('\x1b');
    });

    it('should respect colors: true', () => {
      trace('test', { colors: true });
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
    });

    it('should show full stack trace when showStack is true', () => {
      trace('test', { showStack: true });
      
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1);
    });

    it('should not show full stack trace when showStack is false', () => {
      trace('test', { showStack: false });
      
      expect(consoleErrorSpy.mock.calls.length).toBe(1);
    });
  });
});