export { inspect } from './core/inspect';
export { dump, dd, dp } from './dump';
export { trace } from './trace/trace';
export { measure } from './measure/measure';
export { analyze } from './core/analysis/analyze';

export type { AnalysisNode } from './core/analysis/types';

export type { 
  InspectOptions, 
  DumpOptions, 
  TraceOptions, 
  MeasureOptions, 
  PauseOptions 
} from './shared/types/options';