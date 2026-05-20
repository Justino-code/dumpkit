// src/core/collections.ts

import type { ResolvedFormatOptions } from '../shared/types/dto';
import { colorize } from '../shared/utils/color';
import { formatValue } from './formatter';
import type { CircularDetector } from '../shared/utils/circular';

/**
 * Format an array
 */
export function formatArray(
  value: unknown[],
  options: ResolvedFormatOptions,
  useColors: boolean,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  const maxLength = options.maxArrayLength;
  const currentIndent = ' '.repeat(options.indent * (options.depth - depth + 1));
  
  if (depth <= 0) {
    return { result: colorize('[Array]', 'gray', useColors), truncated: true };
  }
  
  if (circularDetector.has(value)) {
    const circular = circularDetector.get(value, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
  circularDetector.add(value, path);
  
  const length = value.length;
  const itemsToShow = Math.min(length, maxLength);
  const isTruncated = length > maxLength;
  
  if (itemsToShow === 0) {
    return { result: '[]', truncated: false };
  }
  
  const items: string[] = [];
  
  for (let i = 0; i < itemsToShow; i++) {
    const item = value[i];
    const itemPath = `${path}[${i}]`;
    const formatted = formatValue(item, options, depth - 1, circularDetector, itemPath);
    items.push(`${currentIndent}  ${formatted.result}`);
  }
  
  let result = '[\n';
  result += items.join(',\n');
  result += `\n${currentIndent}]`;
  
  if (isTruncated) {
    result += ` ${colorize(`... ${length - maxLength} more items`, 'gray', useColors)}`;
  }
  
  return { result, truncated: isTruncated };
}

/**
 * Format a Map
 */
export function formatMap(
  value: Map<unknown, unknown>,
  options: ResolvedFormatOptions,
  useColors: boolean,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  if (depth <= 0) {
    return { result: colorize('[Map]', 'gray', useColors), truncated: true };
  }
  
  if (circularDetector.has(value)) {
    const circular = circularDetector.get(value, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
  circularDetector.add(value, path);
  
  const size = value.size;
  const maxItems = options.maxArrayLength;
  const itemsToShow = Math.min(size, maxItems);
  const isTruncated = size > maxItems;
  const currentIndent = ' '.repeat(options.indent * (options.depth - depth + 1));
  
  if (itemsToShow === 0) {
    return { result: `Map(${size}) {}`, truncated: false };
  }
  
  const entries: string[] = [];
  let index = 0;
  
  for (const [key, val] of value) {
    if (index >= itemsToShow) break;
    
    const keyPath = `${path}[key:${index}]`;
    const valPath = `${path}[${index}]`;
    
    const formattedKey = formatValue(key, options, depth - 1, circularDetector, keyPath);
    const formattedValue = formatValue(val, options, depth - 1, circularDetector, valPath);
    
    entries.push(`${currentIndent}  ${formattedKey.result} => ${formattedValue.result}`);
    index++;
  }
  
  let result = `Map(${size}) {\n`;
  result += entries.join(',\n');
  result += `\n${currentIndent}}`;
  
  if (isTruncated) {
    result += ` ${colorize(`... ${size - maxItems} more entries`, 'gray', useColors)}`;
  }
  
  return { result, truncated: isTruncated };
}

/**
 * Format a Set
 */
export function formatSet(
  value: Set<unknown>,
  options: ResolvedFormatOptions,
  useColors: boolean,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  if (depth <= 0) {
    return { result: colorize('[Set]', 'gray', useColors), truncated: true };
  }
  
  if (circularDetector.has(value)) {
    const circular = circularDetector.get(value, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
  circularDetector.add(value, path);
  
  const size = value.size;
  const maxItems = options.maxArrayLength;
  const itemsToShow = Math.min(size, maxItems);
  const isTruncated = size > maxItems;
  const currentIndent = ' '.repeat(options.indent * (options.depth - depth + 1));
  
  if (itemsToShow === 0) {
    return { result: `Set(${size}) {}`, truncated: false };
  }
  
  const items: string[] = [];
  let index = 0;
  
  for (const item of value) {
    if (index >= itemsToShow) break;
    
    const itemPath = `${path}[${index}]`;
    const formatted = formatValue(item, options, depth - 1, circularDetector, itemPath);
    
    items.push(`${currentIndent}  ${formatted.result}`);
    index++;
  }
  
  let result = `Set(${size}) {\n`;
  result += items.join(',\n');
  result += `\n${currentIndent}}`;
  
  if (isTruncated) {
    result += ` ${colorize(`... ${size - maxItems} more items`, 'gray', useColors)}`;
  }
  
  return { result, truncated: isTruncated };
}

/**
 * Format WeakMap (cannot iterate, just show type)
 */
export function formatWeakMap(_value: WeakMap<object, unknown>, useColors: boolean): string {
  return colorize('WeakMap { <items cannot be iterated> }', 'gray', useColors);
}

/**
 * Format WeakSet (cannot iterate, just show type)
 */
export function formatWeakSet(_value: WeakSet<object>, useColors: boolean): string {
  return colorize('WeakSet { <items cannot be iterated> }', 'gray', useColors);
}

/**
 * Format a typed array (Uint8Array, etc)
 */
export function formatTypedArray(
  value: ArrayBufferView,
  options: ResolvedFormatOptions,
  useColors: boolean,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  const constructorName = value.constructor.name;
  
  if (depth <= 0) {
    return { result: colorize(`[${constructorName}]`, 'gray', useColors), truncated: true };
  }
  
  if (circularDetector.has(value as unknown as object)) {
    const circular = circularDetector.get(value as unknown as object, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
  const array = Array.from(value as unknown as Iterable<number>);
  const result = formatArray(array, options, useColors, depth, circularDetector, path);
  
  return {
    result: `${constructorName} ${result.result}`,
    truncated: result.truncated,
  };
}