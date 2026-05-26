// src/core/primitives.ts

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
export function formatString(value: string, maxLength: number, useColors: boolean): string {
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
  return colorize(`Date(${value.toISOString()})`, 'magenta', useColors);
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

// ============================================
// Funções para formatar a partir de AnalysisNode
// ============================================

/**
 * Format primitive value from AnalysisNode
 */
export function formatPrimitiveFromNode(node: { value: unknown }, useColors: boolean): string {
  const val = node.value;
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

/**
 * Format date from AnalysisNode
 */
export function formatDateFromNode(node: { isValid: boolean; value: string }, useColors: boolean): string {
  if (!node.isValid) return colorize('Date(Invalid)', 'red', useColors);
  return colorize(`Date(${node.value})`, 'magenta', useColors);
}

/**
 * Format error from AnalysisNode
 */
export function formatErrorFromNode(node: { name: string; message: string }, useColors: boolean): string {
  return colorize(`${node.name}: ${node.message}`, 'red', useColors);
}

/**
 * Format regexp from AnalysisNode
 */
export function formatRegExpFromNode(node: { source: string; flags: string }, useColors: boolean): string {
  return colorize(`/${node.source}/${node.flags}`, 'magenta', useColors);
}

/**
 * Format function from AnalysisNode
 */
export function formatFunctionFromNode(node: { name: string }, useColors: boolean): string {
  const displayName = node.name || 'anonymous';
  return colorize(`[Function: ${displayName}]`, 'cyan', useColors);
}