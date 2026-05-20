// src/shared/utils/stack.ts

import type { StackFrame } from '../types/dto';

/**
 * Parses a V8 stack trace line (Node.js format)
 * Example line: "    at functionName (/path/to/file.ts:12:34)"
 * Example line: "    at /path/to/file.ts:12:34"
 * Example line: "    at Object.<anonymous> (/path/to/file.ts:12:34)"
 * 
 * @param line - Raw stack line
 * @returns Parsed stack frame or null if cannot parse
 */
export function parseStackLine(line: string): StackFrame | null {
  // Remove leading whitespace and "at "
  const cleaned = line.trim().replace(/^at\s+/, '');
  
  // Pattern: functionName (file:line:column)
  // or: file:line:column
  // or: Object.<anonymous> (file:line:column)
  
  let functionName = '';
  let filePath = '';
  let lineNumber = 0;
  let columnNumber = 0;
  
  // Check if it has parentheses (function name present)
  const parenMatch = cleaned.match(/^(.*?)\s+\((.*?):(\d+):(\d+)\)$/);
  if (parenMatch) {
    functionName = parenMatch[1];
    filePath = parenMatch[2];
    lineNumber = parseInt(parenMatch[3], 10);
    columnNumber = parseInt(parenMatch[4], 10);
  } else {
    // No function name, just file:line:column
    const simpleMatch = cleaned.match(/^(.*?):(\d+):(\d+)$/);
    if (simpleMatch) {
      filePath = simpleMatch[1];
      lineNumber = parseInt(simpleMatch[2], 10);
      columnNumber = parseInt(simpleMatch[3], 10);
      functionName = '<anonymous>';
    } else {
      // Unknown format
      return null;
    }
  }
  
  // Remove "file://" prefix if present
  if (filePath.startsWith('file://')) {
    filePath = filePath.slice(7);
  }
  
  return {
    file: filePath,
    line: lineNumber,
    column: columnNumber,
    functionName: functionName || '<anonymous>',
    raw: line,
  };
}

/**
 * Gets the stack trace from the current execution point
 * @param framesToSkip - Number of frames to skip (default: 0)
 * @returns Array of stack frames
 */
export function getStackTrace(framesToSkip: number = 0): StackFrame[] {
  const originalLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 50; // Ensure we get enough frames
  
  const stack = new Error().stack || '';
  
  // Restore original limit
  Error.stackTraceLimit = originalLimit;
  
  const lines = stack.split('\n');
  const frames: StackFrame[] = [];
  
  // Skip the first line which is "Error"
  // Then skip requested additional frames
  for (let i = 1 + framesToSkip; i < lines.length; i++) {
    const frame = parseStackLine(lines[i]);
    if (frame) {
      frames.push(frame);
    }
  }
  
  return frames;
}

/**
 * Gets the caller location (where the calling function was invoked)
 * Useful for trace() to show where the debug call was made
 * 
 * @param depth - How many frames to go up (1 = direct caller, 2 = caller's caller, etc)
 * @returns Stack frame of the caller or null if not found
 */
export function getCallerLocation(depth: number = 1): StackFrame | null {
  // We need to skip:
  // - This function itself (getCallerLocation)
  // - The function that called getCallerLocation (usually trace() or similar)
  // - Then the requested depth
  const framesToSkip = depth + 1; // +1 for getCallerLocation itself
  
  const frames = getStackTrace(framesToSkip);
  
  // The first frame after skipping is our caller
  const caller = frames[0];
  
  if (!caller) {
    return null;
  }
  
  // Simplify file path (remove process.cwd() prefix if possible)
  const cwd = process.cwd();
  if (caller.file.startsWith(cwd)) {
    caller.file = caller.file.slice(cwd.length + 1); // +1 for slash
  } else if (caller.file.includes('/node_modules/')) {
    // Keep as is but maybe shorten? Leave for now
  }
  
  return caller;
}

/**
 * Formats a stack frame into a readable string
 * @param frame - Stack frame to format
 * @param useColors - Whether to use ANSI colors
 * @returns Formatted string like "at src/user.ts:12:34"
 */
export function formatStackFrame(frame: StackFrame, useColors: boolean): string {
  const location = `${frame.file}:${frame.line}:${frame.column}`;
  
  if (useColors) {
    const { colorize } = require('./color');
    const functionPart = frame.functionName !== '<anonymous>' 
      ? `${colorize(frame.functionName, 'cyan', true)} ` 
      : '';
    const locationPart = colorize(location, 'gray', true);
    return `  at ${functionPart}${locationPart}`;
  }
  
  const functionPart = frame.functionName !== '<anonymous>' 
    ? `${frame.functionName} ` 
    : '';
  return `  at ${functionPart}${location}`;
}