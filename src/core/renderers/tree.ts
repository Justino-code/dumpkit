// src/core/renderers/tree.ts
import { AnalysisNode } from '../analysis/types';
import { colorize, shouldUseColors } from '../../shared/utils/color';

function formatLabel(node: AnalysisNode, useColors: boolean): string {
  switch (node.type) {
    case 'primitive':
      const val = (node as any).value;
      if (typeof val === 'string') return colorize(`"${val}"`, 'green', useColors);
      if (val === null) return colorize('null', 'gray', useColors);
      if (val === undefined) return colorize('undefined', 'gray', useColors);
      return colorize(String(val), 'yellow', useColors);
    case 'array':
      return colorize(`Array(${(node as any).length})`, 'blue', useColors);
    case 'object':
      return colorize((node as any).className, 'blue', useColors);
    case 'map':
      return colorize(`Map(${(node as any).size})`, 'magenta', useColors);
    case 'set':
      return colorize(`Set(${(node as any).size})`, 'magenta', useColors);
    case 'circular':
      return colorize(`[Circular *${node.refId}]`, 'yellow', useColors);
    case 'shared':
      return colorize(`[Shared *${node.refId}]`, 'cyan', useColors);
    default:
      return node.type;
  }
}

function renderTree(node: AnalysisNode, useColors: boolean, prefix: string = '', isLast: boolean = true, isRoot: boolean = true): string {
  let result = '';
  const label = formatLabel(node, useColors);
  if (isRoot) {
    result += label + '\n';
  } else {
    result += prefix + (isLast ? '└── ' : '├── ') + label + '\n';
    prefix += (isLast ? '    ' : '│   ');
  }

  let children: AnalysisNode[] = [];
  if (node.type === 'array') {
    children = (node as any).items;
  } else if (node.type === 'object') {
    children = (node as any).properties.map((p: any) => p.value);
  } else if (node.type === 'map') {
    children = (node as any).entries.flatMap((e: any) => [e.key, e.value]);
  } else if (node.type === 'set') {
    children = (node as any).values;
  }

  for (let i = 0; i < children.length; i++) {
    result += renderTree(children[i], useColors, prefix, i === children.length - 1, false);
  }
  return result;
}

export function tree(analysis: AnalysisNode, options?: { colors?: boolean }): string {
  const useColors = shouldUseColors(options?.colors);
  return renderTree(analysis, useColors);
}