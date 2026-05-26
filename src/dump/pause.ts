// src/dump/pause.ts

import { inspect } from '../core/inspect';
import { writeToStream } from './render';
import type { DumpOptions } from '../shared/types/options';
import * as readline from 'readline';

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

  return new Promise((resolve) => {
    let timer: NodeJS.Timeout | undefined;
    let didResolve = false;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      rl.close();
    };

    const handleResolve = () => {
      if (didResolve) return;
      didResolve = true;
      cleanup();
      resolve();
    };

    const handleTimeout = () => {
      if (didResolve) return;
      didResolve = true;
      const timeoutMsg = `\n[dp] Timeout (${timeout}ms). Continuing...\n`;
      writeToStream(timeoutMsg, options?.stream);
      cleanup();
      resolve();
    };

    if (timeout > 0) {
      timer = setTimeout(handleTimeout, timeout);
    }

    rl.question(`${message} `, () => {
      handleResolve();
    });
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
  // Obter a análise e renderizar conforme a view (flat por padrão)
  const output = inspect(value, options);

  writeToStream(output, options?.stream);
  await waitForUser(options);
  return value;
}