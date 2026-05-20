// src/core/primitives.ts

import type { ResolvedFormatOptions } from '../shared/types/dto';
import { colorize } from '../shared/utils/color';

/**
 * Format null value
 */
export function formatNull(useColors: boolean): string {
  return colorize('null', 'gray', useColors);
}

/**
 * Format undefined value
 */
export function formatUndefined(useColors: boolean): string {
  return colorize('undefined', 'gray', useColors);
}

/**
 * Format boolean value
 */
export function formatBoolean(value: boolean, useColors: boolean): string {
  const str = value ? 'true' : 'false';
  return colorize(str, 'yellow', useColors);
}

/**
 * Format number value
 */
export function formatNumber(value: number, useColors: boolean): string {
  if (Number.isNaN(value)) {
    return colorize('NaN', 'yellow', useColors);
  }
  if (!Number.isFinite(value)) {
    return value > 0 ? colorize('Infinity', 'yellow', useColors) : colorize('-Infinity', 'yellow', useColors);
  }
  return colorize(String(value), 'yellow', useColors);
}

/**
 * Format bigint value
 */
export function formatBigInt(value: bigint, useColors: boolean): string {
  return colorize(`${value}n`, 'yellow', useColors);
}

/**
 * Format string value with quotes and escaping
 */
export function formatString(value: string, options: ResolvedFormatOptions, useColors: boolean): string {
  const maxLength = options.maxStringLength;
  let str = value;
  let truncated = false;
  
  if (str.length > maxLength) {
    str = str.slice(0, maxLength);
    truncated = true;
  }
  
  const escaped = str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  
  let result = `"${escaped}"`;
  
  if (truncated) {
    result += colorize('...', 'gray', useColors);
  }
  
  return colorize(result, 'green', useColors);
}

/**
 * Format symbol value
 */
export function formatSymbol(value: symbol, useColors: boolean): string {
  const description = value.description ? `(${value.description})` : '';
  return colorize(`Symbol${description}`, 'cyan', useColors);
}

/**
 * Format function value
 */
export function formatFunction(value: Function, useColors: boolean): string {
  const name = value.name;
  const hasValidName = name && name !== '' && name !== 'fn';
  const displayName = hasValidName ? name : 'anonymous';
  return colorize(`[Function: ${displayName}]`, 'cyan', useColors);
}

/**
 * Format date value
 */
export function formatDate(value: Date, useColors: boolean): string {
  const valid = !isNaN(value.getTime());
  
  if (!valid) {
    return colorize('Date(Invalid)', 'red', useColors);
  }
  
  const isoString = value.toISOString();
  return colorize(`Date(${isoString})`, 'magenta', useColors);
}

/**
 * Format error value
 */
export function formatError(value: Error, useColors: boolean): string {
  const name = value.name || 'Error';
  const message = value.message || '';
  
  let result = name;
  if (message) {
    result += `: ${message}`;
  }
  
  return colorize(result, 'red', useColors);
}

/**
 * Format regular expression
 */
export function formatRegExp(value: RegExp, useColors: boolean): string {
  return colorize(value.toString(), 'magenta', useColors);
}

/**
 * Format primitive values - main dispatcher
 */
export function formatPrimitive(
  value: unknown,
  options: ResolvedFormatOptions,
  useColors: boolean
): { result: string; truncated: boolean } {
  if (value === null) {
    return { result: formatNull(useColors), truncated: false };
  }
  
  if (value === undefined) {
    return { result: formatUndefined(useColors), truncated: false };
  }
  
  if (typeof value === 'boolean') {
    return { result: formatBoolean(value, useColors), truncated: false };
  }
  
  if (typeof value === 'number') {
    return { result: formatNumber(value, useColors), truncated: false };
  }
  
  if (typeof value === 'bigint') {
    return { result: formatBigInt(value, useColors), truncated: false };
  }
  
  if (typeof value === 'string') {
    return { result: formatString(value, options, useColors), truncated: false };
  }
  
  if (typeof value === 'symbol') {
    return { result: formatSymbol(value, useColors), truncated: false };
  }
  
  if (typeof value === 'function') {
    return { result: formatFunction(value, useColors), truncated: false };
  }
  
  if (value instanceof Date) {
    return { result: formatDate(value, useColors), truncated: false };
  }
  
  if (value instanceof Error) {
    return { result: formatError(value, useColors), truncated: false };
  }
  
  if (value instanceof RegExp) {
    return { result: formatRegExp(value, useColors), truncated: false };
  }
  
  return { result: '', truncated: false };
}