// src/shared/types/dto.ts

/** Stack frame information from trace() */
export type StackFrame = {
  /** File path (relative or absolute) */
  file: string;
  
  /** Line number in the file */
  line: number;
  
  /** Column number in the line */
  column: number;
  
  /** Function name (if available) */
  functionName: string;
  
  /** Raw stack line */
  raw: string;
};

/** Result of measure() execution */
export type MeasureResult = {
  /** Label identifying the measurement */
  label: string;
  
  /** Duration in milliseconds */
  durationMs: number;
  
  /** Start timestamp (high-res) */
  startTime: number;
  
  /** End timestamp (high-res) */
  endTime: number;
};

/** Internal representation of a value being formatted */
export type FormattedValue = {
  /** The formatted string */
  string: string;
  
  /** Original value type */
  type: string;
  
  /** Current depth in recursion */
  depth: number;
  
  /** Whether this value was truncated */
  truncated: boolean;
};

/** Configuration after merging defaults and user options */
export type ResolvedFormatOptions = {
  depth: number;
  colors: boolean;
  showHidden: boolean;
  maxArrayLength: number;
  maxStringLength: number;
  indent: number;
  maxProperties: number;
};