// src/shared/utils/stack.ts

import type { StackFrame } from '../types/dto';
import { colorize } from './color';

/**
 * Parses a V8 stack trace line from Node.js
 */
export function parseStackLine(line: string): StackFrame | null {
  const cleaned = line.trim().replace(/^at\s+/, '');
  
  let functionName = '';
  let filePath = '';
  let lineNumber = 0;
  let columnNumber = 0;
  
  const parenMatch = cleaned.match(/^(.*?)\s+\((.*?):(\d+):(\d+)\)$/);
  if (parenMatch) {
    functionName = parenMatch[1];
    filePath = parenMatch[2];
    lineNumber = parseInt(parenMatch[3], 10);
    columnNumber = parseInt(parenMatch[4], 10);
  } else {
    const simpleMatch = cleaned.match(/^(.*?):(\d+):(\d+)$/);
    if (simpleMatch) {
      filePath = simpleMatch[1];
      lineNumber = parseInt(simpleMatch[2], 10);
      columnNumber = parseInt(simpleMatch[3], 10);
      functionName = '<anonymous>';
    } else {
      return null;
    }
  }
  
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
 */
export function getStackTrace(framesToSkip: number = 0): StackFrame[] {
  const originalLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 50;
  
  const stack = new Error().stack || '';
  
  Error.stackTraceLimit = originalLimit;
  
  const lines = stack.split('\n');
  const frames: StackFrame[] = [];
  
  for (let i = 1 + framesToSkip; i < lines.length; i++) {
    const frame = parseStackLine(lines[i]);
    if (frame) {
      frames.push(frame);
    }
  }
  
  return frames;
}

/**
 * Gets the caller location where the calling function was invoked
 */
export function getCallerLocation(depth: number = 1): StackFrame | null {
  const framesToSkip = depth + 1;
  const frames = getStackTrace(framesToSkip);
  
  const caller = frames[0];
  
  if (!caller) {
    return null;
  }
  
  const cwd = process.cwd();
  if (caller.file.startsWith(cwd)) {
    caller.file = caller.file.slice(cwd.length + 1);
  }
  
  return caller;
}

/**
 * Formats a stack frame into a readable string
 */
export function formatStackFrame(frame: StackFrame, useColors: boolean): string {
  const location = `${frame.file}:${frame.line}:${frame.column}`;
  
  if (useColors) {
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