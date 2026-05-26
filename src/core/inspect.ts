// src/core/inspect.ts
import { analyze } from './analysis/analyze';
import type { InspectOptions } from '../shared/types/options';
import type { AnalysisNode } from './analysis/types';

export function inspect(value: unknown, options: InspectOptions = {}): AnalysisNode {
  return analyze(value, options);
}