// src/trace/trace.ts

import type { TraceOptions } from '../shared/types/options';
import { shouldUseColors, colorize, createColorizer } from '../shared/utils/color';
import { getCallerLocation, formatStackFrame, getStackTrace } from '../shared/utils/stack';

/**
 * Trace the current execution point
 * 
 * Shows where in the code this function was called, including file,
 * line number, and function name. Useful for understanding code flow.
 * 
 * @param label - Optional label to identify this trace point
 * @param options - Configuration options (colors, indent, showStack)
 * 
 * @example
 * trace('user-auth');
 * // Output: [Trace] user-auth at src/auth.ts:42:12
 * 
 * @example
 * trace(); // Just shows location without label
 * // Output: [Trace] at src/auth.ts:42:12
 */
export function trace(label?: string, options?: TraceOptions): void {
  const useColors = shouldUseColors(options?.colors);
  const c = createColorizer(useColors);
  const showStack = options?.showStack ?? false;
  
  // Get the caller location (skip trace function itself)
  const caller = getCallerLocation(1);
  
  if (!caller) {
    // Fallback: show full stack
    console.error(c.red('[Trace] Could not determine caller location'));
    return;
  }
  
  const location = formatStackFrame(caller, useColors);
  
  let output = '';
  
  if (label) {
    output = c.cyan(`[Trace] ${label} `);
    output += location;
  } else {
    output = c.cyan('[Trace] ');
    output += location;
  }
  
  console.error(output);
  
  // Show full stack trace if requested
  if (showStack) {
    console.error(c.dim('\nStack trace:'));
    const frames = getStackTrace(2); // Skip trace and getStackTrace itself
    for (const frame of frames) {
      console.error(formatStackFrame(frame, useColors));
    }
  }
}