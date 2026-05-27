// src/dump/pause.ts

import { inspect } from '../core/inspect';
import { writeToStream } from './render';
import type { DumpOptions } from '../shared/types/options';

export interface PauseOptions extends DumpOptions {
  /** Message to display (default: 'Press ENTER to continue...') */
  message?: string;
  /** Max wait time in ms (0 = infinite, default: 0) */
  timeout?: number;
  /** Auto-continue if not TTY (default: true) */
  autoContinue?: boolean;
}

async function waitForUser(options?: PauseOptions): Promise<void> {
  const message = options?.message ?? 'Press ENTER to continue...';
  const timeout = options?.timeout ?? 0;
  const autoContinue = options?.autoContinue ?? true;

  const isTTY = process.stdin.isTTY && process.stdout.isTTY;

  if (autoContinue && !isTTY) {
    const warning = '\n[dp] Non-interactive environment detected. Continuing automatically...\n';
    writeToStream(warning, options?.stream);
    return;
  }

  // For non-TTY or when stdin is not available, continue immediately
  if (!isTTY) {
    return;
  }

  return new Promise((resolve) => {
    let timer: NodeJS.Timeout | undefined;
    let resolved = false;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode?.(false);
      }
      process.stdin.removeAllListeners('data');
      process.stdin.pause();
    };

    const onData = (chunk: Buffer) => {
      const input = chunk.toString();
      // Check for ENTER (\\n, \\r\\n, or \\r)
      if (input === '\n' || input === '\r\n' || input === '\r') {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      }
    };

    const onTimeout = () => {
      if (!resolved) {
        resolved = true;
        const timeoutMsg = `\n[dp] Timeout (${timeout}ms). Continuing...\n`;
        writeToStream(timeoutMsg, options?.stream);
        cleanup();
        resolve();
      }
    };

    if (timeout > 0) {
      timer = setTimeout(onTimeout, timeout);
    }

    // Setup stdin to capture ENTER
    process.stdin.resume();
    if (process.stdin.isTTY) {
      process.stdin.setRawMode?.(true);
    }
    process.stdin.once('data', onData);

    // Write the prompt
    writeToStream(`\n${message} `, options?.stream);
  });
}

/**
 * Dump a value and pause execution until user presses ENTER.
 *
 * @param value - The value to dump
 * @param options - Configuration options (depth, colors, view, etc.)
 * @returns A promise that resolves with the original value when resumed
 */
export async function dp(value: unknown, options?: PauseOptions): Promise<unknown> {
  const output = inspect(value, options);
  writeToStream(output, options?.stream);
  await waitForUser(options);
  return value;
}