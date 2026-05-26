// src/core/analysis/analyze.ts
import { DEFAULTS } from '../../shared/constants';
import { CircularDetector } from '../../shared/utils/circular';
import type { InspectOptions } from '../../shared/types/options';
import type { AnalysisNode, PrimitiveNode } from './types';

export function analyze(value: unknown, options: InspectOptions = {}): AnalysisNode {
  const depth = options.depth ?? DEFAULTS.depth;
  const maxArrayLength = options.maxArrayLength ?? DEFAULTS.maxArrayLength;
  const maxStringLength = options.maxStringLength ?? DEFAULTS.maxStringLength;
  const maxProperties = options.maxProperties ?? DEFAULTS.maxProperties;
  const showHidden = options.showHidden ?? DEFAULTS.showHidden;

  const detector = new CircularDetector();

  function analyzeNode(v: unknown, currentDepth: number, path: string): AnalysisNode {
    if (currentDepth <= 0) {
      return {
        type: 'primitive',
        value: '[Truncated]',
      } as PrimitiveNode;
    }

    // Simple primitives
    if (v === null) {
      return { type: 'primitive', value: null } as PrimitiveNode;
    }
    if (v === undefined) {
      return { type: 'primitive', value: undefined } as PrimitiveNode;
    }

    const type = typeof v;
    if (type === 'string') {
      const str = v as string;
      const truncated = str.length > maxStringLength;
      const strValue = truncated ? str.slice(0, maxStringLength) + '...' : str;
      return { type: 'primitive', value: strValue } as PrimitiveNode;
    }
    if (type === 'number') {
      return { type: 'primitive', value: v as number } as PrimitiveNode;
    }
    if (type === 'boolean') {
      return { type: 'primitive', value: v as boolean } as PrimitiveNode;
    }
    if (type === 'bigint') {
      return { type: 'primitive', value: v as bigint } as PrimitiveNode;
    }
    if (type === 'symbol') {
      return { type: 'primitive', value: v as symbol } as PrimitiveNode;
    }
    if (type === 'function') {
      return { type: 'function', name: (v as Function).name || 'anonymous' };
    }

    // Complex objects
    if (typeof v === 'object' && v !== null) {
      const obj = v as object;

      const { id, isCircular, isShared, originalPath } = detector.enter(obj, path);

      if (isCircular) {
        return {
          type: 'circular',
          refId: id,
          originalPath: originalPath!,
        };
      }
      if (isShared) {
        return {
          type: 'shared',
          refId: id,
          originalPath: originalPath!,
        };
      }

      let result: AnalysisNode;

      // Handle built-in types
      if (v instanceof Date) {
        const isValid = !isNaN(v.getTime());
        result = {
          type: 'date',
          isValid,
          value: isValid ? v.toISOString() : 'Invalid',
        };
      } else if (v instanceof Error) {
        result = {
          type: 'error',
          name: v.name || 'Error',
          message: v.message,
        };
      } else if (v instanceof RegExp) {
        result = {
          type: 'regexp',
          source: v.source,
          flags: v.flags,
        };
      } else if (v instanceof WeakMap) {
        result = { type: 'weakmap' };
      } else if (v instanceof WeakSet) {
        result = { type: 'weakset' };
      } else if (v instanceof Promise) {
        result = { type: 'promise' };
      } else if (ArrayBuffer.isView(v) && !(v instanceof DataView)) {
        const arr = Array.from(v as unknown as Iterable<number>);
        const truncated = arr.length > maxArrayLength;
        const itemsSlice = truncated ? arr.slice(0, maxArrayLength) : arr;
        result = {
          type: 'typedarray',
          className: v.constructor.name,
          items: itemsSlice.map((item, idx) =>
            analyzeNode(item, currentDepth - 1, `${path}[${idx}]`)
          ),
          truncated,
        };
      } else if (Array.isArray(v)) {
        const items = v as unknown[];
        const truncated = items.length > maxArrayLength;
        const itemsSlice = truncated ? items.slice(0, maxArrayLength) : items;
        result = {
          type: 'array',
          length: items.length,
          items: itemsSlice.map((item, idx) =>
            analyzeNode(item, currentDepth - 1, `${path}[${idx}]`)
          ),
          truncated,
        };
      } else if (v instanceof Map) {
        const entries = Array.from(v.entries());
        const truncated = entries.length > maxArrayLength;
        const entriesSlice = truncated ? entries.slice(0, maxArrayLength) : entries;
        result = {
          type: 'map',
          size: v.size,
          entries: entriesSlice.map(([key, val], idx) => ({
            key: analyzeNode(key, currentDepth - 1, `${path}.key${idx}`),
            value: analyzeNode(val, currentDepth - 1, `${path}.val${idx}`),
          })),
          truncated,
        };
      } else if (v instanceof Set) {
        const values = Array.from(v.values());
        const truncated = values.length > maxArrayLength;
        const valuesSlice = truncated ? values.slice(0, maxArrayLength) : values;
        result = {
          type: 'set',
          size: v.size,
          values: valuesSlice.map((val, idx) =>
            analyzeNode(val, currentDepth - 1, `${path}[${idx}]`)
          ),
          truncated,
        };
      } else {
        let keys: Array<string | symbol> = Object.keys(obj);
        if (showHidden) {
          const ownProps = Object.getOwnPropertyNames(obj);
          const symbols = Object.getOwnPropertySymbols(obj);
          keys = [...new Set([...keys, ...ownProps, ...symbols.map(s => s)])];
        }
        const truncatedProps = keys.length > maxProperties;
        const propsSlice = truncatedProps ? keys.slice(0, maxProperties) : keys;
        const properties = propsSlice.map(key => {
          let val: unknown;
          try {
            val = (obj as any)[key];
          } catch {
            val = '[Threw]';
          }
          return {
            key: typeof key === 'symbol' ? key : key,
            value: analyzeNode(val, currentDepth - 1, `${path}.${String(key)}`),
            enumerable: Object.prototype.propertyIsEnumerable.call(obj, key),
          };
        });
        result = {
          type: 'object',
          className: obj.constructor?.name || 'Object',
          properties,
          truncated: truncatedProps,
        };
      }

      detector.leave(obj);
      return result;
    }

    // Fallback
    return { type: 'primitive', value: String(v) } as PrimitiveNode;
  }

  return analyzeNode(value, depth, 'root');
}