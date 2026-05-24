// tests/trace/trace.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trace } from '../../src/trace/trace';
import * as stackUtils from '../../src/shared/utils/stack';

// Mock das funções de stack
vi.mock('../../src/shared/utils/stack', async () => {
  const actual = await vi.importActual('../../src/shared/utils/stack');
  return {
    ...actual,
    getCallerLocation: vi.fn(),
    getStackTrace: vi.fn(),
    formatStackFrame: vi.fn(),
  };
});

describe('trace', () => {
  let stderrWriteSpy: any;

  beforeEach(() => {
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    vi.clearAllMocks();
  });

  afterEach(() => {
    stderrWriteSpy.mockRestore();
    vi.restoreAllMocks();
  });

  // Mock de um frame de stack válido
  const mockUserFrame = {
    file: '/project/src/user-code.ts',
    line: 42,
    column: 10,
    functionName: 'userFunction',
    raw: 'at userFunction (/project/src/user-code.ts:42:10)'
  };

  describe('trace without label', () => {
    it('should output trace with caller location', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace();
      
      expect(stderrWriteSpy).toHaveBeenCalledTimes(1);
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
      expect(output).toContain('at userFunction');
      expect(output).not.toContain('Could not determine caller location');
    });
  });

  describe('trace with label', () => {
    it('should output trace with label', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace('checkpoint-1');
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Trace] checkpoint-1');
      expect(output).toContain('at userFunction');
    });

    it('should handle empty string label', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace('');
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
      expect(output).not.toContain('checkpoint-1');
    });
  });

  describe('trace with options', () => {
    it('should respect colors: false', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace('test', { colors: false });
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).not.toContain('\x1b');
    });

    it('should respect colors: true', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace('test', { colors: true });
      
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('\x1b');
    });

    it('should show full stack trace when showStack is true', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');
      
      const mockStackTrace = [
        { file: '/project/src/caller1.ts', line: 10, column: 5, functionName: 'caller1', raw: '' },
        { file: '/project/src/caller2.ts', line: 20, column: 3, functionName: 'caller2', raw: '' }
      ];
      vi.mocked(stackUtils.getStackTrace).mockReturnValue(mockStackTrace);
      vi.mocked(stackUtils.formatStackFrame).mockImplementation((frame) => `  at ${frame.functionName} (${frame.file}:${frame.line}:${frame.column})`);

      trace('test', { showStack: true });
      
      // Deve haver chamadas adicionais para o stack trace
      expect(stderrWriteSpy.mock.calls.length).toBeGreaterThan(1);
      const stackTraceCall = stderrWriteSpy.mock.calls.find(call => call[0].includes('Stack trace:'));
      expect(stackTraceCall).toBeDefined();
    });

    it('should not show full stack trace when showStack is false', () => {
      vi.mocked(stackUtils.getCallerLocation).mockReturnValue(mockUserFrame);
      vi.mocked(stackUtils.formatStackFrame).mockReturnValue('  at userFunction (/project/src/user-code.ts:42:10)');

      trace('test', { showStack: false });
      
      expect(stderrWriteSpy.mock.calls.length).toBe(1);
      const output = stderrWriteSpy.mock.calls[0][0];
      expect(output).toContain('[Trace]');
      expect(output).not.toContain('Stack trace:');
    });
  });
});
