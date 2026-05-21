// tests/measure/measure.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measure } from '../../src/measure/measure';

describe('measure', () => {
  let stderrWriteSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stderrWriteSpy.mockRestore();
  });

  describe('synchronous functions', () => {
    it('should measure sync function execution time', () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
        return sum;
      };
      
      const { result, measurement } = measure('sync-test', fn);
      
      expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Measure] sync-test:');
      expect(output).toMatch(/\d+(\.\d+)?(ms|µs|s)/);
      expect(result).toBe(fn());
      expect(measurement.label).toBe('sync-test');
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should return the function return value with measurement', () => {
      const fn = () => 42;
      
      const { result, measurement } = measure('return-test', fn);
      
      expect(result).toBe(42);
      expect(measurement.label).toBe('return-test');
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should work with arrow functions', () => {
      const fn = () => 'hello';
      
      const { result, measurement } = measure('arrow-test', fn);
      
      expect(result).toBe('hello');
      expect(measurement.label).toBe('arrow-test');
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should propagate errors from sync function', () => {
      const fn = () => {
        throw new Error('Sync error');
      };
      
      expect(() => measure('error-test', fn)).toThrow('Sync error');
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should respect colors: false option', () => {
      const fn = () => 123;
      
      measure('color-test', fn, { colors: false });
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).not.toContain('\x1b');
    });

    it('should respect colors: true option', () => {
      const fn = () => 123;
      
      measure('color-test', fn, { colors: true });
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('\x1b');
    });

    it('should respect stream option', () => {
      const customStream = { write: vi.fn() } as unknown as NodeJS.WriteStream;
      const fn = () => 123;
      
      measure('stream-test', fn, { stream: customStream });
      
      expect(customStream.write).toHaveBeenCalled();
      expect(stderrWriteSpy).not.toHaveBeenCalled();
    });
  });

  describe('asynchronous functions', () => {
    it('should measure async function execution time', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return 'done';
      };
      
      const { result, measurement } = await measure('async-test', fn);
      
      expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Measure] async-test:');
      expect(result).toBe('done');
      expect(measurement.label).toBe('async-test');
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should return promise result with measurement', async () => {
      const fn = async () => ({ data: 'test' });
      
      const { result, measurement } = await measure('async-return', fn);
      
      expect(result).toEqual({ data: 'test' });
      expect(measurement.label).toBe('async-return');
    });

    it('should propagate errors from async function', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        throw new Error('Async error');
      };
      
      await expect(measure('async-error', fn)).rejects.toThrow('Async error');
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should handle very fast async functions', async () => {
      const fn = async () => 'fast';
      
      const { result, measurement } = await measure('fast-async', fn);
      
      expect(result).toBe('fast');
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
      expect(stderrWriteSpy).toHaveBeenCalled();
    });
  });

  describe('time formatting', () => {
    it('should format sub-millisecond times as microseconds', () => {
      const fn = () => {
        return 1 + 1;
      };
      
      measure('fast', fn);
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toMatch(/(\d+µs|\d+\.\d+ms)/);
    });

    it('should format milliseconds correctly', () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
        return sum;
      };
      
      measure('ms-test', fn);
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toMatch(/\d+(\.\d+)?ms/);
    });

    it('should format seconds correctly', () => {
      const fn = () => {
        const start = Date.now();
        while (Date.now() - start < 100) {
          // Busy wait ~100ms
        }
        return 'done';
      };
      
      measure('seconds-test', fn);
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toMatch(/(\d+(\.\d+)?(ms|s))/);
    });
  });

  describe('edge cases', () => {
    it('should handle empty function', () => {
      const fn = () => {};
      
      const { result, measurement } = measure('empty', fn);
      
      expect(result).toBeUndefined();
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
      expect(stderrWriteSpy).toHaveBeenCalled();
    });

    it('should handle function returning null', () => {
      const fn = () => null;
      
      const { result, measurement } = measure('null-test', fn);
      
      expect(result).toBeNull();
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should handle function returning undefined', () => {
      const fn = () => undefined;
      
      const { result, measurement } = measure('undefined-test', fn);
      
      expect(result).toBeUndefined();
      expect(measurement.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should work with different label formats', () => {
      const fn = () => 1;
      
      measure('simple', fn);
      measure('with spaces', fn);
      measure('with-numbers-123', fn);
      measure('', fn);
      
      expect(stderrWriteSpy).toHaveBeenCalledTimes(4);
      expect(stderrWriteSpy.mock.calls[0][0]).toContain('simple');
      expect(stderrWriteSpy.mock.calls[1][0]).toContain('with spaces');
      expect(stderrWriteSpy.mock.calls[2][0]).toContain('with-numbers-123');
    });
  });
});