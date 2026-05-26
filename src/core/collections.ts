// src/core/collections.ts

import { colorize } from '../shared/utils/color';

// Forward declaration para evitar circular
type FormatNodeFn = (node: any, useColors: boolean, indentLevel: number, indentSize: number) => string;

/**
 * Format array from AnalysisNode
 */
export function formatArrayFromNode(
  node: { items: any[]; length: number; truncated?: boolean },
  useColors: boolean,
  indentLevel: number,
  indentSize: number,
  formatChild: FormatNodeFn
): string {
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (node.items.length === 0) return '[]';
  const itemsStr = node.items.map((item: any) =>
    formatChild(item, useColors, indentLevel + 1, indentSize)
  ).join(',\n' + currentIndent + '  ');
  let result = `[\n${currentIndent}  ${itemsStr}\n${currentIndent}]`;
  if (node.truncated) {
    result += ` ${colorize(`... ${node.length - node.items.length} more items`, 'gray', useColors)}`;
  }
  return result;
}

/**
 * Format map from AnalysisNode
 */
export function formatMapFromNode(
  node: { size: number; entries: Array<{ key: any; value: any }>; truncated?: boolean },
  useColors: boolean,
  indentLevel: number,
  indentSize: number,
  formatChild: FormatNodeFn
): string {
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (node.entries.length === 0) return `Map(${node.size}) {}`;
  const entriesStr = node.entries.map((entry: any) =>
    `${currentIndent}  ${formatChild(entry.key, useColors, indentLevel + 1, indentSize)} => ${formatChild(entry.value, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `Map(${node.size}) {\n${entriesStr}\n${currentIndent}}`;
  if (node.truncated) {
    result += ` ${colorize(`... ${node.size - node.entries.length} more entries`, 'gray', useColors)}`;
  }
  return result;
}

/**
 * Format set from AnalysisNode
 */
export function formatSetFromNode(
  node: { size: number; values: any[]; truncated?: boolean },
  useColors: boolean,
  indentLevel: number,
  indentSize: number,
  formatChild: FormatNodeFn
): string {
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (node.values.length === 0) return `Set(${node.size}) {}`;
  const valuesStr = node.values.map((val: any) =>
    `${currentIndent}  ${formatChild(val, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `Set(${node.size}) {\n${valuesStr}\n${currentIndent}}`;
  if (node.truncated) {
    result += ` ${colorize(`... ${node.size - node.values.length} more items`, 'gray', useColors)}`;
  }
  return result;
}

/**
 * Format typed array from AnalysisNode
 */
export function formatTypedArrayFromNode(
  node: { className: string; items: any[]; truncated?: boolean },
  useColors: boolean,
  indentLevel: number,
  indentSize: number,
  formatChild: FormatNodeFn
): string {
  const arrayStr = formatArrayFromNode(
    { items: node.items, length: node.items.length, truncated: node.truncated },
    useColors,
    indentLevel,
    indentSize,
    formatChild
  );
  return `${node.className} ${arrayStr}`;
}

/**
 * Format weak map from AnalysisNode
 */
export function formatWeakMapFromNode(_node: unknown, useColors: boolean): string {
  return colorize('WeakMap { <items cannot be iterated> }', 'gray', useColors);
}

/**
 * Format weak set from AnalysisNode
 */
export function formatWeakSetFromNode(_node: unknown, useColors: boolean): string {
  return colorize('WeakSet { <items cannot be iterated> }', 'gray', useColors);
}