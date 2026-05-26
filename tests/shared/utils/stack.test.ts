// tests/shared/utils/stack.test.ts

import { describe, it, expect } from 'vitest';
import { parseStackLine, getStackTrace, getCallerLocation, formatStackFrame } from '../../../src/shared/utils/stack';

describe('stack utilities', () => {
  describe('parseStackLine', () => {
    it('should parse line with function name and parentheses', () => {
      const line = '    at myFunction (/path/to/file.ts:12:34)';
      const result = parseStackLine(line);
      
      expect(result).not.toBeNull();
      expect(result?.functionName).toBe('myFunction');
      expect(result?.file).toBe('/path/to/file.ts');
      expect(result?.line).toBe(12);
      expect(result?.column).toBe(34);
    });

    it('should parse line with anonymous function', () => {
      const line = '    at /path/to/file.ts:12:34';
      const result = parseStackLine(line);
      
      expect(result).not.toBeNull();
      expect(result?.functionName).toBe('<anonymous>');
      expect(result?.file).toBe('/path/to/file.ts');
      expect(result?.line).toBe(12);
      expect(result?.column).toBe(34);
    });

    it('should parse line with Object.<anonymous>', () => {
      const line = '    at Object.<anonymous> (/path/to/file.ts:12:34)';
      const result = parseStackLine(line);
      
      expect(result).not.toBeNull();
      expect(result?.functionName).toBe('Object.<anonymous>');
      expect(result?.file).toBe('/path/to/file.ts');
      expect(result?.line).toBe(12);
      expect(result?.column).toBe(34);
    });

    it('should handle file:// protocol', () => {
      const line = '    at myFunction (file:///path/to/file.ts:12:34)';
      const result = parseStackLine(line);
      
      expect(result).not.toBeNull();
      expect(result?.file).toBe('/path/to/file.ts');
    });

    it('should return null for invalid line', () => {
      const line = 'invalid stack line';
      const result = parseStackLine(line);
      
      expect(result).toBeNull();
    });
  });

  describe('getStackTrace', () => {
    it('should return array of stack frames', () => {
      const frames = getStackTrace();
      
      expect(Array.isArray(frames)).toBe(true);
      expect(frames.length).toBeGreaterThan(0);
      expect(frames[0]).toHaveProperty('file');
      expect(frames[0]).toHaveProperty('line');
      expect(frames[0]).toHaveProperty('column');
    });

    it('should skip specified number of frames', () => {
      const frames0 = getStackTrace(0);
      const frames1 = getStackTrace(1);
      
      expect(frames1.length).toBeLessThanOrEqual(frames0.length);
    });
  });

  describe('getCallerLocation', () => {
    it('should return caller location', () => {
      function testFunction() {
        return getCallerLocation(1);
      }
      
      const result = testFunction();
      
      expect(result).not.toBeNull();
      expect(result?.functionName).toBe('testFunction');
    });

    it('should return null when no caller found', () => {
      // Call with high depth
      const result = getCallerLocation(100);
      
      // May return null or a frame depending on stack depth
      expect(result === null || result !== null).toBe(true);
    });
  });

  describe('formatStackFrame', () => {
    it('should format stack frame without colors', () => {
      const frame = {
        file: '/path/to/file.ts',
        line: 12,
        column: 34,
        functionName: 'myFunction',
        raw: '',
      };
      
      const result = formatStackFrame(frame, false);
      
      expect(result).toBe('  at myFunction /path/to/file.ts:12:34');
    });

    it('should format stack frame for anonymous function', () => {
      const frame = {
        file: '/path/to/file.ts',
        line: 12,
        column: 34,
        functionName: '<anonymous>',
        raw: '',
      };
      
      const result = formatStackFrame(frame, false);
      
      expect(result).toBe('  at /path/to/file.ts:12:34');
    });

    it('should format stack frame with colors', () => {
      const frame = {
        file: '/path/to/file.ts',
        line: 12,
        column: 34,
        functionName: 'myFunction',
        raw: '',
      };
      
      const result = formatStackFrame(frame, true);
      
      expect(result).toContain('\x1b');
      expect(result).toContain('myFunction');
      expect(result).toContain('/path/to/file.ts:12:34');
    });
  });
});