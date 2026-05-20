// src/dump/dump.ts

import { inspect } from '../core/inspect';
import { writeToStream } from './render';
import type { DumpOptions } from '../shared/types/options';

/**
 * Dump a value to the console in a formatted, readable way
 * 
 * Prints the formatted value to stderr and returns the original value
 * for chaining or further use.
 * 
 * @param value - The value to dump
 * @param options - Configuration options (depth, colors, etc)
 * @returns The original value (unchanged)
 * 
 * @example
 * const user = { name: 'John', age: 30 };
 * dump(user);
 * // Output: { name: "John", age: 30 }
 * 
 * @example
 * // With custom options
 * dump(user, { depth: 1, colors: false });
 */
export function dump(value: unknown, options?: DumpOptions): unknown {
  const output = inspect(value, options);
  writeToStream(output, options?.stream);
  return value;
}

/**
 * Dump a value and terminate the process (dump and die)
 * 
 * Prints the formatted value and then calls process.exit(1)
 * Useful for debugging to stop execution at a specific point.
 * 
 * @param value - The value to dump
 * @param options - Configuration options (depth, colors, etc)
 * @returns Never returns (process exits)
 * 
 * @example
 * const user = { name: 'John', age: 30 };
 * dd(user);
 * // Output: { name: "John", age: 30 }
 * // Process exits
 */
export function dd(value: unknown, options?: DumpOptions): never {
  dump(value, options);
  process.exit(1);
}