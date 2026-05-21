// src/trace/trace.ts

import type { TraceOptions } from '../shared/types/options';
import { shouldUseColors, createColorizer } from '../shared/utils/color';
import { getCallerLocation, formatStackFrame, getStackTrace } from '../shared/utils/stack';
import { writeToStream } from '../dump/render';

function isUserFrame(file: string): boolean {
  if (file.includes('node_modules/dumpkit/')) return false;
  if (file.includes('/dumpkit/src/')) return false;
  if (file.includes('/trace/trace.ts')) return false;
  if (file.includes('/dump/pause.ts')) return false;
  if (file.includes('node:internal/')) return false;
  if (file.includes('node_modules/')) return false;
  
  return true;
}

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
    
    let hasUserFrame = false;
    for (const frame of frames) {
      if (isUserFrame(frame.file)) {
        writeToStream(formatStackFrame(frame, useColors) + '\n', stream);
        hasUserFrame = true;
      }
    }
    
    if (!hasUserFrame) {
      writeToStream(c.dim('  (no additional user code in stack)\n'), stream);
    }
  }
}