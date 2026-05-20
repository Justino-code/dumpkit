// src/measure/measure.ts

import type { MeasureOptions } from '../shared/types/options';
import { shouldUseColors, createColorizer } from '../shared/utils/color';
import type { MeasureResult } from '../shared/types/dto';

/**
 * Internal function to format and output measurement result
 */
function outputMeasure(
  label: string,
  durationMs: number,
  useColors: boolean
): void {
  const c = createColorizer(useColors);
  
  let formattedDuration: string;
  if (durationMs < 1) {
    formattedDuration = `${(durationMs * 1000).toFixed(2)}µs`;
  } else if (durationMs < 1000) {
    formattedDuration = `${durationMs.toFixed(2)}ms`;
  } else {
    formattedDuration = `${(durationMs / 1000).toFixed(2)}s`;
  }
  
  const output = c.yellow(`[Measure] ${label}: `) + c.green(formattedDuration);
  console.error(output);
}

/**
 * Measure the execution time of a synchronous or asynchronous function
 * 
 * @param label - Identifier for this measurement
 * @param fn - Function to measure (can be sync or async)
 * @param options - Configuration options
 * @returns The return value of the measured function (or Promise)
 * 
 * @example
 * // Synchronous
 * measure('sort-array', () => {
 *   return array.sort();
 * });
 * 
 * @example
 * // Asynchronous
 * await measure('db-query', async () => {
 *   return await db.find({ id: 1 });
 * });
 * 
 * @example
 * // With custom options
 * measure('heavy-op', fn, { colors: false });
 */
export function measure<T>(
  label: string,
  fn: () => T,
  options?: MeasureOptions
): T;
export function measure<T>(
  label: string,
  fn: () => Promise<T>,
  options?: MeasureOptions
): Promise<T>;
export function measure<T>(
  label: string,
  fn: (() => T) | (() => Promise<T>),
  options?: MeasureOptions
): T | Promise<T> {
  const useColors = shouldUseColors(options?.colors);
  const startTime = performance.now();
  
  try {
    const result = fn();
    
    // Check if result is a Promise (async function)
    if (result instanceof Promise) {
      return result.then((value) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        outputMeasure(label, duration, useColors);
        return value;
      }).catch((error) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        outputMeasure(label, duration, useColors);
        throw error;
      }) as Promise<T>;
    }
    
    // Synchronous result
    const endTime = performance.now();
    const duration = endTime - startTime;
    outputMeasure(label, duration, useColors);
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    outputMeasure(label, duration, useColors);
    throw error;
  }
}