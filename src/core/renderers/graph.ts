// src/core/renderers/graph.ts
import { AnalysisNode } from '../analysis/types';

/**
 * Desenha uma árvore binária (objetos com left/right) ou n-ária (propriedade children)
 * usando caracteres de barra. Para estruturas genéricas, usa o formato tree.
 */
export function graph(analysis: AnalysisNode): string {
  // Simplificação: se o nó tem propriedades 'left' e 'right', assume árvore binária.
  // Caso contrário, cai no renderizador tree.
  if (isBinaryTree(analysis)) {
    return renderBinaryTree(analysis);
  }
  // Para outros, usar representação hierárquica com barras (genérica)
  return renderGenericTree(analysis);
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

function renderBinaryTree(node: AnalysisNode, prefix: string = '', isLeft: boolean = false): string {
  if (!node) return '';
  const value = getNodeValue(node);
  let result = prefix;
  if (prefix) {
    result += isLeft ? '├── ' : '└── ';
  }
  result += value + '\n';
  const left = getChild(node, 'left');
  const right = getChild(node, 'right');
  if (left || right) {
    const newPrefix = prefix + (isLeft ? '│   ' : '    ');
    if (left) result += renderBinaryTree(left, newPrefix, true);
    if (right) result += renderBinaryTree(right, newPrefix, false);
  }
  return result;
}

function getNodeValue(node: AnalysisNode): string {
  switch (node.type) {
    case 'primitive': return String((node as any).value);
    case 'object': return (node as any).className;
    case 'array': return `Array(${(node as any).length})`;
    default: return node.type;
  }
}

function renderGenericTree(node: AnalysisNode, prefix: string = ''): string {
  // usa mesma lógica do tree mas com caracteres de barra (simples)
  let result = prefix + getNodeValue(node) + '\n';
  let children: AnalysisNode[] = [];
  if (node.type === 'array') {
    children = (node as any).items;
  } else if (node.type === 'object') {
    children = (node as any).properties.map((p: any) => p.value);
  } else if (node.type === 'map') {
    children = (node as any).entries.flatMap((e: any) => [e.key, e.value]);
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLast = i === children.length - 1;
    result += renderGenericTree(child, prefix + (isLast ? '    ' : '│   '));
  }
  return result;
}