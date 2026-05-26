// src/core/renderers/table.ts
import { AnalysisNode } from '../analysis/types';
import { colorize, shouldUseColors } from '../../shared/utils/color';
import { flat } from './flat';

/**
 * Renders an array of homogeneous objects as a table.
 * If the node is not an array of objects, falls back to flat representation.
 */
export function table(analysis: AnalysisNode, options?: { colors?: boolean; indent?: number }): string {
  const useColors = shouldUseColors(options?.colors);
  if (!isArrayOfObjects(analysis)) {
    return flat(analysis, options);
  }

  const items = (analysis as any).items;
  if (items.length === 0) return '(empty array)';

  // Extract column keys from the first object
  const firstItem = items[0];
  const keys = firstItem.properties.map((p: any) => p.key);
  const colWidths = keys.map(key => key.length);

  // Compute column widths based on values
  for (const item of items) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const prop = item.properties.find((p: any) => p.key === key);
      if (prop) {
        const valueStr = getValueString(prop.value, useColors);
        const plainLen = valueStr.replace(/\x1b\[[0-9;]*m/g, '').length;
        colWidths[i] = Math.max(colWidths[i], plainLen);
      }
    }
  }

  function pad(str: string, len: number): string {
    const plain = str.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = Math.max(0, len - plain.length);
    return str + ' '.repeat(padding);
  }

  const header = keys.map((key, i) => pad(colorize(key, 'bold', useColors), colWidths[i])).join(' | ');
  const separator = colWidths.map(w => '─'.repeat(w)).join('─┼─');

  const rows = items.map(item => {
    return keys.map((key, i) => {
      const prop = item.properties.find((p: any) => p.key === key);
      const valueStr = prop ? getValueString(prop.value, useColors) : '';
      return pad(valueStr, colWidths[i]);
    }).join(' | ');
  });

  return [header, separator, ...rows].join('\n');
}

function isArrayOfObjects(node: AnalysisNode): boolean {
  if (node.type !== 'array') return false;
  const items = (node as any).items;
  if (items.length === 0) return true;
  const first = items[0];
  return first.type === 'object';
}

function getValueString(node: AnalysisNode, useColors: boolean): string {
  // Use flat with indent 0 to get a single-line string
  const raw = flat(node, { colors: useColors, indent: 0 });
  return raw.replace(/\n/g, ' ').trim();
}