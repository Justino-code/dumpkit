// src/core/renderers/flat.ts
import { AnalysisNode } from '../analysis/types';
import { colorize, shouldUseColors } from '../../shared/utils/color';
import { DEFAULTS } from '../../shared/constants';

function formatPrimitive(node: AnalysisNode, useColors: boolean): string {
  const val = (node as any).value;
  if (val === null) return colorize('null', 'gray', useColors);
  if (val === undefined) return colorize('undefined', 'gray', useColors);
  if (typeof val === 'string') return colorize(`"${val}"`, 'green', useColors);
  if (typeof val === 'number' || typeof val === 'bigint') {
    const str = String(val);
    if (str === 'NaN' || str === 'Infinity' || str === '-Infinity')
      return colorize(str, 'yellow', useColors);
    return colorize(str, 'yellow', useColors);
  }
  if (typeof val === 'boolean') return colorize(String(val), 'yellow', useColors);
  if (typeof val === 'symbol') {
    const desc = val.description ? `(${val.description})` : '';
    return colorize(`Symbol${desc}`, 'cyan', useColors);
  }
  return String(val);
}

function formatArray(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  const n = node as any;
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (n.items.length === 0) return '[]';
  const itemsStr = n.items.map((item: AnalysisNode) =>
    formatNode(item, useColors, indentLevel + 1, indentSize)
  ).join(',\n' + currentIndent + '  ');
  let result = `[\n${currentIndent}  ${itemsStr}\n${currentIndent}]`;
  if (n.truncated) {
    result += ` ${colorize(`... ${n.length - n.items.length} more items`, 'gray', useColors)}`;
  }
  return result;
}

function formatObject(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  const n = node as any;
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (n.properties.length === 0) return `${n.className} {}`;
  const propsStr = n.properties.map((prop: any) =>
    `${currentIndent}  ${prop.key}: ${formatNode(prop.value, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `${n.className} {\n${propsStr}\n${currentIndent}}`;
  if (n.truncated) {
    result += ` ${colorize(`... more properties`, 'gray', useColors)}`;
  }
  return result;
}

function formatMap(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  const n = node as any;
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (n.entries.length === 0) return `Map(${n.size}) {}`;
  const entriesStr = n.entries.map((entry: any) =>
    `${currentIndent}  ${formatNode(entry.key, useColors, indentLevel + 1, indentSize)} => ${formatNode(entry.value, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `Map(${n.size}) {\n${entriesStr}\n${currentIndent}}`;
  if (n.truncated) {
    result += ` ${colorize(`... ${n.size - n.entries.length} more entries`, 'gray', useColors)}`;
  }
  return result;
}

function formatSet(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  const n = node as any;
  const currentIndent = ' '.repeat(indentLevel * indentSize);
  if (n.values.length === 0) return `Set(${n.size}) {}`;
  const valuesStr = n.values.map((val: AnalysisNode) =>
    `${currentIndent}  ${formatNode(val, useColors, indentLevel + 1, indentSize)}`
  ).join(',\n');
  let result = `Set(${n.size}) {\n${valuesStr}\n${currentIndent}}`;
  if (n.truncated) {
    result += ` ${colorize(`... ${n.size - n.values.length} more items`, 'gray', useColors)}`;
  }
  return result;
}

function formatDate(node: AnalysisNode, useColors: boolean): string {
  const n = node as any;
  if (!n.isValid) return colorize('Date(Invalid)', 'red', useColors);
  return colorize(`Date(${n.value})`, 'magenta', useColors);
}

function formatError(node: AnalysisNode, useColors: boolean): string {
  const n = node as any;
  return colorize(`${n.name}: ${n.message}`, 'red', useColors);
}

function formatRegExp(node: AnalysisNode, useColors: boolean): string {
  const n = node as any;
  return colorize(`/${n.source}/${n.flags}`, 'magenta', useColors);
}

function formatFunction(node: AnalysisNode, useColors: boolean): string {
  const n = node as any;
  return colorize(`[Function: ${n.name}]`, 'cyan', useColors);
}

function formatTypedArray(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  const n = node as any;
  const arrayStr = formatArray({ type: 'array', items: n.items, length: n.items.length, truncated: n.truncated } as any, useColors, indentLevel, indentSize);
  return `${n.className} ${arrayStr}`;
}

function formatWeakMap(_node: AnalysisNode, useColors: boolean): string {
  return colorize('WeakMap { <items cannot be iterated> }', 'gray', useColors);
}

function formatWeakSet(_node: AnalysisNode, useColors: boolean): string {
  return colorize('WeakSet { <items cannot be iterated> }', 'gray', useColors);
}

function formatPromise(_node: AnalysisNode): string {
  return 'Promise { <pending> }';
}

function formatCircular(node: AnalysisNode, useColors: boolean): string {
  return colorize(`[Circular *${node.refId}]`, 'yellow', useColors);
}

function formatShared(node: AnalysisNode, useColors: boolean): string {
  return colorize(`[Shared *${node.refId}]`, 'cyan', useColors);
}

function formatNode(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  switch (node.type) {
    case 'primitive': return formatPrimitive(node, useColors);
    case 'array': return formatArray(node, useColors, indentLevel, indentSize);
    case 'object': return formatObject(node, useColors, indentLevel, indentSize);
    case 'map': return formatMap(node, useColors, indentLevel, indentSize);
    case 'set': return formatSet(node, useColors, indentLevel, indentSize);
    case 'date': return formatDate(node, useColors);
    case 'error': return formatError(node, useColors);
    case 'regexp': return formatRegExp(node, useColors);
    case 'function': return formatFunction(node, useColors);
    case 'typedarray': return formatTypedArray(node, useColors, indentLevel, indentSize);
    case 'weakmap': return formatWeakMap(node, useColors);
    case 'weakset': return formatWeakSet(node, useColors);
    case 'promise': return formatPromise(node);
    case 'circular': return formatCircular(node, useColors);
    case 'shared': return formatShared(node, useColors);
    default: return '';
  }
}

export function flat(analysis: AnalysisNode, options?: { colors?: boolean; indent?: number }): string {
  const useColors = shouldUseColors(options?.colors);
  const indentSize = options?.indent ?? DEFAULTS.indent;
  return formatNode(analysis, useColors, 0, indentSize);
}