import { describe, it, expect, vi } from 'vitest';
import { shouldUseColors, colorize, createColorizer, COLORS } from '../../../src/shared/utils/color';

describe('color', () => {
  describe('shouldUseColors', () => {
    it('should return true when forceColor is true', () => {
      expect(shouldUseColors(true)).toBe(true);
    });

    it('should return false when forceColor is false', () => {
      expect(shouldUseColors(false)).toBe(false);
    });

    it('should auto-detect based on stderr TTY when forceColor is undefined', () => {
      // Verificar se isTTY existe
      const hasTTY = 'isTTY' in process.stderr;
      
      if (hasTTY) {
        // Se existir, testar com mock
        const originalValue = process.stderr.isTTY;
        
        // Mock via Object.defineProperty com configurable: true
        Object.defineProperty(process.stderr, 'isTTY', {
          value: true,
          configurable: true,
          writable: true
        });
        expect(shouldUseColors(undefined)).toBe(true);
        
        Object.defineProperty(process.stderr, 'isTTY', {
          value: false,
          configurable: true,
          writable: true
        });
        expect(shouldUseColors(undefined)).toBe(false);
        
        // Restaurar
        Object.defineProperty(process.stderr, 'isTTY', {
          value: originalValue,
          configurable: true,
          writable: true
        });
      } else {
        // Se não existir, o comportamento padrão deve ser false
        expect(shouldUseColors(undefined)).toBe(false);
      }
    });
  });

  describe('colorize', () => {
    it('should return string without colors when useColors is false', () => {
      const result = colorize('hello', 'red', false);
      expect(result).toBe('hello');
    });

    it('should wrap string with color codes when useColors is true', () => {
      const result = colorize('hello', 'red', true);
      expect(result).toBe(`${COLORS.red}hello${COLORS.reset}`);
    });

    it('should accept color code string directly', () => {
      const result = colorize('hello', '\x1b[35m', true);
      expect(result).toBe(`\x1b[35mhello${COLORS.reset}`);
    });
  });

  describe('createColorizer', () => {
    it('should create colorizer with colors enabled', () => {
      const c = createColorizer(true);
      expect(c.red('test')).toBe(`${COLORS.red}test${COLORS.reset}`);
      expect(c.green('test')).toBe(`${COLORS.green}test${COLORS.reset}`);
      expect(c.blue('test')).toBe(`${COLORS.blue}test${COLORS.reset}`);
    });

    it('should create colorizer with colors disabled', () => {
      const c = createColorizer(false);
      expect(c.red('test')).toBe('test');
      expect(c.green('test')).toBe('test');
      expect(c.blue('test')).toBe('test');
    });
  });
});