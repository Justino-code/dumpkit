// src/trace/trace.ts

import type { TraceOptions } from '../shared/types/options';
import { shouldUseColors, createColorizer } from '../shared/utils/color';
import { getCallerLocation, formatStackFrame, getStackTrace } from '../shared/utils/stack';
import { writeToStream } from '../dump/render';

/**
 * Shows the current execution point in the code
 */
export function trace(label?: string, options?: TraceOptions): void {
  const useColors = shouldUseColors(options?.colors);
  const c = createColorizer(useColors);
  const showStack = options?.showStack ?? false;
  const stream = options?.stream ?? process.stderr;
  
  const caller = getCallerLocation(1);
  
  if (!caller) {
    writeToStream(c.red('[Trace] Could not determine caller location\n'), stream);
    return;
  }
  
  const location = formatStackFrame(caller, useColors);
  
  let output = '';
  
  if (label) {
    output = c.cyan(`[Trace] ${label} `) + location + '\n';
  } else {
    output = c.cyan('[Trace] ') + location + '\n';
  }
  
  writeToStream(output, stream);
  
  if (showStack) {
    writeToStream(c.dim('\nStack trace:\n'), stream);
    const frames = getStackTrace(2);
    for (const frame of frames) {
      writeToStream(formatStackFrame(frame, useColors) + '\n', stream);
    }
  }
}