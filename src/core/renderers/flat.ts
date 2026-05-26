// src/core/renderers/flat.ts

import { AnalysisNode } from '../analysis/types';
import { shouldUseColors, colorize } from '../../shared/utils/color';
import { DEFAULTS } from '../../shared/constants';

import {
  formatPrimitiveFromNode,
  formatDateFromNode,
  formatErrorFromNode,
  formatRegExpFromNode,
  formatFunctionFromNode,
} from '../primitives';

import {
  formatArrayFromNode,
  formatMapFromNode,
  formatSetFromNode,
  formatTypedArrayFromNode,
  formatWeakMapFromNode,
  formatWeakSetFromNode,
} from '../collections';

import { formatObjectFromNode } from '../object';

function formatNode(node: AnalysisNode, useColors: boolean, indentLevel: number, indentSize: number): string {
  switch (node.type) {
    case 'primitive':
      return formatPrimitiveFromNode(node as any, useColors);
    case 'array':
      return formatArrayFromNode(node as any, useColors, indentLevel, indentSize, formatNode);
    case 'object':
      return formatObjectFromNode(node as any, useColors, indentLevel, indentSize, formatNode);
    case 'map':
      return formatMapFromNode(node as any, useColors, indentLevel, indentSize, formatNode);
    case 'set':
      return formatSetFromNode(node as any, useColors, indentLevel, indentSize, formatNode);
    case 'date':
      return formatDateFromNode(node as any, useColors);
    case 'error':
      return formatErrorFromNode(node as any, useColors);
    case 'regexp':
      return formatRegExpFromNode(node as any, useColors);
    case 'function':
      return formatFunctionFromNode(node as any, useColors);
    case 'typedarray':
      return formatTypedArrayFromNode(node as any, useColors, indentLevel, indentSize, formatNode);
    case 'weakmap':
      return formatWeakMapFromNode(node as any, useColors);
    case 'weakset':
      return formatWeakSetFromNode(node as any, useColors);
    case 'promise':
      return 'Promise { <pending> }';
    case 'circular':
      return colorize(`[Circular *${(node as any).refId}]`, 'yellow', useColors);
    case 'shared':
      return colorize(`[Shared *${(node as any).refId}]`, 'cyan', useColors);
    default:
      return '';
  }
}

export function flat(analysis: AnalysisNode, options?: { colors?: boolean; indent?: number }): string {
  const useColors = shouldUseColors(options?.colors);
  const indentSize = options?.indent ?? DEFAULTS.indent;
  return formatNode(analysis, useColors, 0, indentSize);
}