// src/index.ts

// Core functions
export { inspect } from './core/inspect';
export { dump, dd, dp } from './dump';
export { trace } from './trace/trace';
export { measure } from './measure/measure';

// Types (for TypeScript users)
export type {
  InspectOptions,
  DumpOptions,
  TraceOptions,
  MeasureOptions,
} from './shared/types/options';