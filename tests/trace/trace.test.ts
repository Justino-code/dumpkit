// tests/trace/trace.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trace } from '../../../src/trace/trace';

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
      expect(output).toContain('.test.ts'); // should show test file
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

    it('should handle special characters in label', () => {
      trace('user-auth @ step#2');
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('user-auth @ step#2');
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
      expect(output).toContain('\x1b');
    });

    it('should show full stack trace when showStack is true', () => {
      trace('test', { showStack: true });
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('Stack trace:');
      // Should have multiple lines (more than just the first trace)
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1);
    });

    it('should not show full stack trace when showStack is false', () => {
      trace('test', { showStack: false });
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).not.toContain('Stack trace:');
      expect(consoleErrorSpy.mock.calls.length).toBe(1);
    });
  });

  describe('trace call location accuracy', () => {
    it('should show correct line number', () => {
      // This test verifies that the line number is approximately correct
      trace('location-test');
      
      const output = consoleErrorSpy.mock.calls[0][0];
      // The trace should point to the line above (or near it)
      expect(output).toMatch(/\.test\.ts:\d+:\d+/);
    });

    it('should work when called from nested function', () => {
      function nestedFunction() {
        trace('from-nested');
      }
      
      nestedFunction();
      
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain('nestedFunction');
    });
  });
});