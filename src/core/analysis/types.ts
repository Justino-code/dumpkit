// src/core/analysis/types.ts
export type AnalysisNode =
  | PrimitiveNode
  | ObjectNode
  | ArrayNode
  | MapNode
  | SetNode
  | DateNode
  | ErrorNode
  | RegExpNode
  | FunctionNode
  | TypedArrayNode
  | WeakMapNode
  | WeakSetNode
  | PromiseNode
  | CircularNode
  | SharedNode;

export interface PrimitiveNode {
  type: 'primitive';
  value: string | number | boolean | null | undefined | bigint | symbol;
}

export interface ObjectNode {
  type: 'object';
  className: string;
  properties: { key: string | symbol; value: AnalysisNode; enumerable: boolean }[];
  truncated?: boolean;
}

export interface ArrayNode {
  type: 'array';
  length: number;
  items: AnalysisNode[];
  truncated?: boolean;
}

export interface MapNode {
  type: 'map';
  size: number;
  entries: { key: AnalysisNode; value: AnalysisNode }[];
  truncated?: boolean;
}

export interface SetNode {
  type: 'set';
  size: number;
  values: AnalysisNode[];
  truncated?: boolean;
}

export interface DateNode {
  type: 'date';
  isValid: boolean;
  value: string;
}

export interface ErrorNode {
  type: 'error';
  name: string;
  message: string;
}

export interface RegExpNode {
  type: 'regexp';
  source: string;
  flags: string;
}

export interface FunctionNode {
  type: 'function';
  name: string;
}

export interface TypedArrayNode {
  type: 'typedarray';
  className: string;
  items: AnalysisNode[];
  truncated?: boolean;
}

export interface WeakMapNode {
  type: 'weakmap';
}

export interface WeakSetNode {
  type: 'weakset';
}

export interface PromiseNode {
  type: 'promise';
}

export interface CircularNode {
  type: 'circular';
  refId: number;
  originalPath: string;
}

export interface SharedNode {
  type: 'shared';
  refId: number;
  originalPath: string;
}