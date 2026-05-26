// src/core/inspect.ts
import { analyze } from './analysis/analyze';
import { flat } from './renderers/flat';
import { tree } from './renderers/tree';
import { table } from './renderers/table';
import type { InspectOptions } from '../shared/types/options';

/**
 * Inspect a value and return a formatted string representation.
 * 
 * This is a pure function – it does NOT print to console, it just returns a string.
 * Supports multiple views: 'flat' (default), 'tree', 'table'.
 * 
 * @param value - The value to inspect
 * @param options - Configuration options (depth, colors, view, etc.)
 * @returns Formatted string representation
 */
export function inspect(value: unknown, options: InspectOptions = {}): string {
  const analysis = analyze(value, options);
  const view = options.view || 'flat';
  switch (view) {
    case 'tree':
      return tree(analysis, options);
    case 'table':
      return table(analysis, options);
    default:
      return flat(analysis, options);
  }
}