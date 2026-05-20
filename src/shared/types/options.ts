// src/shared/types/options.ts

import type { DEFAULTS } from '../constants';

export type InspectOptions = {
  /** Maximum nesting depth (default: 4) */
  depth?: number;
  
  /** Force colors? undefined = auto (TTY), true/false = force */
  colors?: boolean;
  
  /** Show non-enumerable properties (default: false) */
  showHidden?: boolean;
  
  /** Maximum array items to display (default: 100) */
  maxArrayLength?: number;
  
  /** Maximum string length to display (default: 1000) */
  maxStringLength?: number;
  
  /** Number of spaces for indentation (default: 2) */
  indent?: number;
  
  /** Maximum properties to show in object (default: 50) */
  maxProperties?: number;
};

export type DumpOptions = InspectOptions & {
  /** Output stream (default: process.stderr) */
  stream?: NodeJS.WriteStream;
};

export type TraceOptions = {
  /** Force colors? undefined = auto (TTY), true/false = force */
  colors?: boolean;
  
  /** Number of spaces for indentation (default: 2) */
  indent?: number;
  
  /** Show full stack trace instead of just caller (default: false) */
  showStack?: boolean;
};

export type MeasureOptions = {
  /** Force colors? undefined = auto (TTY), true/false = force */
  colors?: boolean;
  
  /** Number of spaces for indentation (default: 2) */
  indent?: number;
};

export type FormatOptions = Required<Omit<InspectOptions, 'colors'>> & {
  colors: boolean;
};

export type {
  InspectOptions as InspectOptionsType,
  DumpOptions as DumpOptionsType,
  TraceOptions as TraceOptionsType,
  MeasureOptions as MeasureOptionsType,
  FormatOptions as FormatOptionsType,
};