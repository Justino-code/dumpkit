// src/core/inspect.ts

import type { InspectOptions } from '../shared/types/options';
import type { ResolvedFormatOptions } from '../shared/types/dto';
import { DEFAULTS } from '../shared/constants';
import { shouldUseColors } from '../shared/utils/color';
import { CircularDetector } from '../shared/utils/circular';
import { formatValue } from './formatter';

/**
 * Merge user options with defaults
 */
function resolveOptions(options?: InspectOptions): ResolvedFormatOptions {
  const colors = shouldUseColors(options?.colors);
  
  return {
    depth: options?.depth ?? DEFAULTS.depth,
    colors,
    showHidden: options?.showHidden ?? DEFAULTS.showHidden,
    maxArrayLength: options?.maxArrayLength ?? DEFAULTS.maxArrayLength,
    maxStringLength: options?.maxStringLength ?? DEFAULTS.maxStringLength,
    indent: options?.indent ?? DEFAULTS.indent,
    maxProperties: options?.maxProperties ?? DEFAULTS.maxProperties,
  };
}

/**
 * Inspect a value and return a formatted string representation
 * 
 * This is a pure function - it does NOT print to console, it just returns a string.
 * 
 * @param value - The value to inspect
 * @param options - Configuration options
 * @returns Formatted string representation
 * 
 * @example
 * const output = inspect({ name: 'John', age: 30 });
 * console.log(output); // { name: "John", age: 30 }
 */
export function inspect(value: unknown, options?: InspectOptions): string {
  const resolvedOptions = resolveOptions(options);
  const circularDetector = new CircularDetector();
  
  const result = formatValue(
    value,
    resolvedOptions,
    resolvedOptions.depth,
    circularDetector,
    'root'
  );
  
  return result.result;
}