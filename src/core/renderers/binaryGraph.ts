// src/core/renderers/binaryGraph.ts
import { AnalysisNode } from '../analysis/types';
import { colorize, shouldUseColors } from '../../shared/utils/color';

export function binaryGraph(analysis: AnalysisNode, options?: { colors?: boolean }): string {
  const useColors = shouldUseColors(options?.colors);
  if (!isBinaryTree(analysis)) {
    return fallbackTree(analysis, useColors);
  }
  const lines: string[] = [];
  buildGraph(analysis, '', true, lines, useColors);
  return lines.join('\n');
}

function isBinaryTree(node: AnalysisNode): boolean {
  if (node.type !== 'object') return false;
  const props = (node as any).properties.map((p: any) => p.key);
  return props.includes('left') && props.includes('right');
}

function getChild(node: AnalysisNode, key: string): AnalysisNode | null {
  if (node.type !== 'object') return null;
  const prop = (node as any).properties.find((p: any) => p.key === key);
  return prop ? prop.value : null;
}

function getLabel(node: AnalysisNode, useColors: boolean): string {
  switch (node.type) {
    case 'primitive':
      const val = (node as any).value;
      if (typeof val === 'string') return colorize(`"${val}"`, 'green', useColors);
      if (val === null) return colorize('null', 'gray', useColors);
      if (val === undefined) return colorize('undefined', 'gray', useColors);
      return colorize(String(val), 'yellow', useColors);
    case 'object':
      return colorize((node as any).className, 'blue', useColors);
    default:
      return colorize(node.type, 'gray', useColors);
  }
}

function buildGraph(node: AnalysisNode, prefix: string, isRoot: boolean, lines: string[], useColors: boolean): void {
  const label = getLabel(node, useColors);
  if (isRoot) {
    lines.push(label);
  } else {
    lines.push(prefix + label);
  }
  const left = getChild(node, 'left');
  const right = getChild(node, 'right');
  if (!left && !right) return;

  const indent = isRoot ? '' : prefix;
  if (left && right) {
    lines.push(indent + ' / \\');
    const leftLabel = getLabel(left, useColors);
    const rightLabel = getLabel(right, useColors);
    lines.push(indent + leftLabel + '   ' + rightLabel);
    const newPrefix = indent + ' '.repeat(Math.max(leftLabel.length, 3));
    buildGraph(left, newPrefix, false, lines, useColors);
    buildGraph(right, newPrefix, false, lines, useColors);
  } else if (left) {
    lines.push(indent + ' |');
    const leftLabel = getLabel(left, useColors);
    lines.push(indent + leftLabel);
    buildGraph(left, indent + ' ', false, lines, useColors);
  } else if (right) {
    lines.push(indent + ' |');
    const rightLabel = getLabel(right, useColors);
    lines.push(indent + rightLabel);
    buildGraph(right, indent + ' ', false, lines, useColors);
  }
}

function fallbackTree(node: AnalysisNode, useColors: boolean): string {
  // Usa o formato tree normal
  function formatLabel(n: AnalysisNode): string {
    return getLabel(n, useColors);
  }
  function walk(n: AnalysisNode, prefix: string, isLast: boolean): string {
    let res = prefix + (isLast ? '└── ' : '├── ') + formatLabel(n) + '\n';
    let children: AnalysisNode[] = [];
    if (n.type === 'object') children = (n as any).properties.map((p: any) => p.value);
    else if (n.type === 'array') children = (n as any).items;
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    for (let i = 0; i < children.length; i++) {
      res += walk(children[i], newPrefix, i === children.length - 1);
    }
    return res;
  }
  return formatLabel(node) + '\n' + walk(node, '', true);
}