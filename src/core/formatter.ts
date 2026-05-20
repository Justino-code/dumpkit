// src/core/formatter.ts

import type { ResolvedFormatOptions } from '../shared/types/dto';
import { CircularDetector } from '../shared/utils/circular';
import { formatPrimitive } from './primitives';
import { formatArray, formatMap, formatSet, formatWeakMap, formatWeakSet, formatTypedArray } from './collections';
import { formatObject } from './object';

/**
 * Format any value into a string representation
 * This is the core orchestrator that dispatches to specific formatters
 */
export function formatValue(
  value: unknown,
  options: ResolvedFormatOptions,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  // Handle null and undefined first
  if (value === null || value === undefined) {
    return formatPrimitive(value, options, options.colors);
  }
  
  const type = typeof value;
  
  // Primitive types
  if (type === 'boolean' || type === 'number' || type === 'bigint' || type === 'string' || type === 'symbol' || type === 'function') {
    return formatPrimitive(value, options, options.colors);
  }
  
  // Date, Error, RegExp
  if (value instanceof Date || value instanceof Error || value instanceof RegExp) {
    return formatPrimitive(value, options, options.colors);
  }
  
  // Collections
  if (Array.isArray(value)) {
    return formatArray(value, options, options.colors, depth, circularDetector, path);
  }
  
  if (value instanceof Map) {
    return formatMap(value, options, options.colors, depth, circularDetector, path);
  }
  
  if (value instanceof Set) {
    return formatSet(value, options, options.colors, depth, circularDetector, path);
  }
  
  if (value instanceof WeakMap) {
    return { result: formatWeakMap(value, options.colors), truncated: false };
  }
  
  if (value instanceof WeakSet) {
    return { result: formatWeakSet(value, options.colors), truncated: false };
  }
  
  // Typed arrays (Uint8Array, Int32Array, etc)
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return formatTypedArray(value, options, options.colors, depth, circularDetector, path);
  }
  
  // Promise
  if (value instanceof Promise) {
    const state = 'Promise { <pending> }'; // Can't sync determine state
    return { result: state, truncated: false };
  }
  
  // Generic object
  if (typeof value === 'object') {
    return formatObject(value, options, options.colors, depth, circularDetector, path);
  }
  
  // Fallback
  return { result: String(value), truncated: false };
}