// src/dump/dump.ts

import { inspect } from '../core/inspect';
import { flat } from '../core/renderers/flat';
import { tree } from '../core/renderers/tree';
import { table } from '../core/renderers/table';
import { writeToStream } from './render';
import type { DumpOptions } from '../shared/types/options';

/**
 * Dump a value to the console in a formatted, readable way
 * 
 * Prints the formatted value to stderr and returns the original value
 * for chaining or further use.
 * 
 * @param value - The value to dump
 * @param options - Configuration options (depth, colors, view, etc)
 * @returns The original value (unchanged)
 * 
 */
export function dump(value: unknown, options?: DumpOptions): unknown {
  const analysis = inspect(value, options);
  const view = options?.view || 'flat';
  let output: string;
  switch (view) {
    case 'tree':
      output = tree(analysis, options);
      break;
    case 'table':
      output = table(analysis, options);
      break;
    default:
      output = flat(analysis, options);
  }
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
 * @param options - Configuration options (depth, colors, view, etc)
 * @returns Never returns (process exits)
 * 
 */
export function dd(value: unknown, options?: DumpOptions): never {
  dump(value, options);
  process.exit(1);
}