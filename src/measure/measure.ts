// src/measure/measure.ts

import type { MeasureOptions } from '../shared/types/options';
import { shouldUseColors, createColorizer } from '../shared/utils/color';
import type { MeasureResult } from '../shared/types/dto';

function outputMeasure(label: string, durationMs: number, useColors: boolean): void {
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

function createMeasureResult(label: string, startTime: number, endTime: number): MeasureResult {
  return {
    label,
    durationMs: endTime - startTime,
    startTime,
    endTime,
  };
}

export function measure<T>(
  label: string,
  fn: () => T,
  options?: MeasureOptions
): { result: T; measurement: MeasureResult };
export function measure<T>(
  label: string,
  fn: () => Promise<T>,
  options?: MeasureOptions
): Promise<{ result: T; measurement: MeasureResult }>;
export function measure<T>(
  label: string,
  fn: (() => T) | (() => Promise<T>),
  options?: MeasureOptions
): { result: T; measurement: MeasureResult } | Promise<{ result: T; measurement: MeasureResult }> {
  const useColors = shouldUseColors(options?.colors);
  const startTime = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then((value) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        outputMeasure(label, duration, useColors);
        return {
          result: value,
          measurement: createMeasureResult(label, startTime, endTime),
        };
      }).catch((error) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        outputMeasure(label, duration, useColors);
        throw error;
      }) as Promise<{ result: T; measurement: MeasureResult }>;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    outputMeasure(label, duration, useColors);
    return {
      result: result as T,
      measurement: createMeasureResult(label, startTime, endTime),
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    outputMeasure(label, duration, useColors);
    throw error;
  }
}