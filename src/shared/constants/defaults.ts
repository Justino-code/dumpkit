// src/shared/constants/defaults.ts

export const DEFAULTS = {
  /** Maximum nesting depth when inspecting objects */
  depth: 4,
  
  /** Maximum number of array items to display */
  maxArrayLength: 100,
  
  /** Maximum string length to display (truncates with ...) */
  maxStringLength: 1000,
  
  /** Force colors? undefined = auto (based on TTY), true/false = force */
  colors: undefined as boolean | undefined,
  
  /** Show non-enumerable properties (Symbols, internal slots) */
  showHidden: false,
  
  /** Number of spaces for indentation */
  indent: 2,
  
  /** Maximum number of properties to show in an object */
  maxProperties: 50,
} as const;

export type Defaults = typeof DEFAULTS;