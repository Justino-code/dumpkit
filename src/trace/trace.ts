// src/trace/trace.ts

import type { TraceOptions } from '../shared/types/options';
import { shouldUseColors, createColorizer } from '../shared/utils/color';
import { getCallerLocation, formatStackFrame, getStackTrace } from '../shared/utils/stack';

/**
 * Shows the current execution point in the code
 */
export function trace(label?: string, options?: TraceOptions): void {
  const useColors = shouldUseColors(options?.colors);
  const c = createColorizer(useColors);
  const showStack = options?.showStack ?? false;
  
  const caller = getCallerLocation(1);
  
  if (!caller) {
    console.error(c.red('[Trace] Could not determine caller location'));
    return;
  }
  
  const location = formatStackFrame(caller, useColors);
  
  let output = '';
  
  if (label) {
    output = c.cyan(`[Trace] ${label} `) + location;
  } else {
    output = c.cyan('[Trace] ') + location;
  }
  
  console.error(output);
  
  if (showStack) {
    console.error(c.dim('\nStack trace:'));
    const frames = getStackTrace(2);
    for (const frame of frames) {
      console.error(formatStackFrame(frame, useColors));
    }
  }
}