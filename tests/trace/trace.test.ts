// tests/trace/trace.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trace } from '../../src/trace/trace';

describe('trace', () => {
  let stderrWriteSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stderrWriteSpy.mockRestore();
  });

  it('should output trace with caller location', () => {
    trace();
    
    expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
    const output = stderrWriteSpy.mock.calls[0][0];
    expect(output).toContain('[Trace]');
    expect(output).toContain('at');
  });

  it('should output trace with label', () => {
    trace('checkpoint-1');
    
    const output = stderrWriteSpy.mock.calls[0][0];
    expect(output).toContain('[Trace] checkpoint-1');
  });

  it('should respect colors: false', () => {
    trace('test', { colors: false });
    
    const output = stderrWriteSpy.mock.calls[0][0];
    expect(output).not.toContain('\x1b');
  });

  it('should show full stack trace when showStack is true', () => {
    trace('test', { showStack: true });
    
    expect(stderrWriteSpy.mock.calls.length).toBeGreaterThan(1);
    const output = stderrWriteSpy.mock.calls[0][0];
    expect(output).toContain('[Trace]');
  });
});