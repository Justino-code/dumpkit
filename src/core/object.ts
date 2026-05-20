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
    const symbols = Object.getOwnPropertySymbols(obj);
    keys.push(...symbols);
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
 * Format a property key for object output
 */
function formatKey(key: string | symbol, useColors: boolean): string {
  if (typeof key === 'symbol') {
    const desc = key.description || '';
    return colorize(`[Symbol(${desc})]`, 'cyan', useColors);
  }
  
  // Chaves numéricas não precisam de aspas
  if (isNumericIndex(key)) {
    return colorize(key, 'blue', useColors);
  }
  
  // Identificadores válidos não precisam de aspas
  const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
  if (isValidIdentifier) {
    return colorize(key, 'blue', useColors);
  }
  
  // Strings com espaços ou caracteres especiais vão entre aspas
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
  if (depth <= 0) {
    const constructorName = value.constructor?.name || 'Object';
    return { result: colorize(`[${constructorName}]`, 'gray', useColors), truncated: true };
  }
  
  if (circularDetector.has(value)) {
    const circular = circularDetector.get(value, path);
    return { result: colorize(circular.marker, 'yellow', useColors), truncated: true };
  }
  
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