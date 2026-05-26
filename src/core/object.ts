// src/core/object.ts

import { colorize } from '../shared/utils/color';

// Forward declaration
type FormatNodeFn = (node: any, useColors: boolean, indentLevel: number, indentSize: number) => string;

/**
 * Get all property keys of an object (including symbols if showHidden is true)
 */
export function getPropertyKeys(obj: object, showHidden: boolean): (string | symbol)[] {
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
export function isNumericIndex(key: string | symbol): boolean {
  if (typeof key !== 'string') return false;
  const num = Number(key);
  return !isNaN(num) && Number.isInteger(num) && num >= 0;
}

/**
 * Format a property key for object output
 */
export function formatKey(key: string | symbol, useColors: boolean): string {
  if (typeof key === 'symbol') {
    const desc = key.description || '';
    return colorize(`[Symbol(${desc})]`, 'cyan', useColors);
  }
  
  if (isNumericIndex(key)) {
    return colorize(key, 'blue', useColors);
  }
  
  const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
  if (isValidIdentifier) {
    return colorize(key, 'blue', useColors);
  }
  
  return colorize(`"${key}"`, 'green', useColors);
}

/**
 * Format object from AnalysisNode
 */
export function formatObjectFromNode(
  node: { className: string; properties: Array<{ key: string | symbol; value: any }>; truncated?: boolean },
  useColors: boolean,
  indentLevel: number,
  indentSize: number,
  formatChild: FormatNodeFn
): string {
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (node.properties.length === 0) return `${node.className} {}`;
  const propsStr = node.properties.map((prop: any) =>
    `${currentIndent}  ${formatKey(prop.key, useColors)}: ${formatChild(prop.value, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `${node.className} {\n${propsStr}\n${currentIndent}}`;
  if (node.truncated) {
    result += ` ${colorize(`... more properties`, 'gray', useColors)}`;
  }
  return result;
}