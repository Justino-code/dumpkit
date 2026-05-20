// src/shared/utils/color.ts

import { DEFAULTS } from '../constants';

/**
 * ANSI color codes for terminal output
 */
export const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  
  // Foreground (text) colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Bright variants
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightCyan: '\x1b[96m',
} as const;

export type ColorKey = keyof typeof COLORS;

/**
 * Determines whether colors should be used in output
 * @param forceColor - Explicit user preference
 * @returns true if colors should be used
 */
export function shouldUseColors(forceColor?: boolean): boolean {
  // User explicitly set colors preference
  if (forceColor !== undefined) {
    return forceColor;
  }
  
  // Auto-detect: check if we're in a TTY (interactive terminal)
  // Using stderr because that's where we output by default
  return process.stderr.isTTY === true;
}

/**
 * Wrap a string with ANSI color codes
 * @param str - The string to color
 * @param color - Color code or key from COLORS
 * @param useColors - Whether to actually apply colors
 * @returns Colored string if useColors is true, otherwise original string
 */
export function colorize(
  str: string,
  color: string | ColorKey,
  useColors: boolean
): string {
  if (!useColors) {
    return str;
  }
  
  const colorCode = typeof color === 'string' && color in COLORS
    ? COLORS[color as ColorKey]
    : color;
  
  return `${colorCode}${str}${COLORS.reset}`;
}

/**
 * Create a colorizer function bound to a specific color mode
 * @param useColors - Whether to use colors
 * @returns Object with colorize methods for each color
 */
export function createColorizer(useColors: boolean) {
  return {
    red: (str: string) => colorize(str, 'red', useColors),
    green: (str: string) => colorize(str, 'green', useColors),
    yellow: (str: string) => colorize(str, 'yellow', useColors),
    blue: (str: string) => colorize(str, 'blue', useColors),
    cyan: (str: string) => colorize(str, 'cyan', useColors),
    gray: (str: string) => colorize(str, 'gray', useColors),
    dim: (str: string) => colorize(str, 'dim', useColors),
    bold: (str: string) => colorize(str, 'bold', useColors),
    reset: (str: string) => useColors ? `${str}${COLORS.reset}` : str,
  };
}