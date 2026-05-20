// src/core/object.ts

import type { ResolvedFormatOptions } from '../shared/types/dto';
import { colorize } from '../shared/utils/color';
import { formatValue } from './formatter';
import type { CircularDetector } from '../shared/utils/circular';

/**
 * Get all property keys of an object (including symbols if showHidden is true)
 */
function getPropertyKeys(obj: object, showHidden: boolean): (string | symbol)[] {
  const keys: (string | symbol)[] = Object.keys(obj);
  
  if (showHidden) {
    // Add symbol properties
    const symbols = Object.getOwnPropertySymbols(obj);
    keys.push(...symbols);
    
    // Add non-enumerable string properties?
    // This would be more expensive, skip for now
  }
  
  return keys;
}

/**
 * Check if a property key should be displayed as a number index
 */
function isNumericIndex(key: string | symbol): boolean {
  if (typeof key !== 'string') return false;
  const num = Number(key);
  return !isNaN(num) && Number.isInteger(num) && num >= 0;
}

/**
 * Format a property key (for object output)
 */
function formatKey(key: string | symbol, useColors: boolean): string {
  if (typeof key === 'symbol') {
    const desc = key.description || '';
    return colorize(`[Symbol(${desc})]`, 'cyan', useColors);
  }
  
  // Valid identifier? If not, wrap in quotes
  const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
  if (isValidIdentifier) {
    return colorize(key, 'blue', useColors);
  }
  
  return colorize(`"${key}"`, 'green', useColors);
}

/**
 * Format a generic object
 */
export function formatObject(
  value: object,
  options: ResolvedFormatOptions,
  useColors: boolean,
  depth: number,
  circularDetector: CircularDetector,
  path: string
): { result: string; truncated: boolean } {
  // Check if we've reached max depth
  if (depth <= 0) {
    const constructorName = value.constructor?.name || 'Object';
    return { result: colorize(`[${constructorName}]`, 'gray', useColors), truncated: true };
  }
  
  // Check for circular reference
  if (circularDetector.has(value)) {
    const circular = circularDetector.get(value, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
  // Register this object
  circularDetector.add(value, path);
  
  const keys = getPropertyKeys(value, options.showHidden);
  const maxProperties = options.maxProperties;
  const propertiesToShow = Math.min(keys.length, maxProperties);
  const isTruncated = keys.length > maxProperties;
  
  const constructorName = value.constructor?.name;
  const isPlainObject = constructorName === 'Object' || constructorName === undefined;
  
  const currentIndent = ' '.repeat(options.indent * (options.depth - depth + 1));
  
  if (propertiesToShow === 0) {
    const typeLabel = isPlainObject ? '{}' : `${constructorName} {}`;
    return { result: typeLabel, truncated: false };
  }
  
  const properties: string[] = [];
  
  for (let i = 0; i < propertiesToShow; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    
    // Skip if it's a getter without a value and we're not showing getters
    // For now, just try to get the value
    let propValue: unknown;
    let isGetter = false;
    
    try {
      if (descriptor?.get && !descriptor?.set && !descriptor?.value) {
        isGetter = true;
        propValue = '[Getter]';
      } else {
        propValue = (value as any)[key];
      }
    } catch (err) {
      propValue = `[Threw: ${err instanceof Error ? err.message : String(err)}]`;
    }
    
    const formattedKey = formatKey(key, useColors);
    const propPath = `${path}.${typeof key === 'string' ? key : key.toString()}`;
    const formattedValue = formatValue(propValue, options, depth - 1, circularDetector, propPath);
    
    let line = `${currentIndent}  ${formattedKey}: ${formattedValue.result}`;
    if (isGetter) {
      line = colorize(line, 'dim', useColors);
    }
    
    properties.push(line);
  }
  
  const openBrace = isPlainObject ? '{' : `${constructorName} {`;
  let result = `${openBrace}\n`;
  result += properties.join(',\n');
  result += `\n${currentIndent}}`;
  
  if (isTruncated) {
    result += ` ${colorize(`... ${keys.length - maxProperties} more properties`, 'gray', useColors)}`;
  }
  
  return { result, truncated: isTruncated };
}