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
  return new Promise((resolve, reject) => {
    const message = options?.message ?? 'Press ENTER to continue...';
    const timeout = options?.timeout ?? 0;
    const autoContinue = options?.autoContinue ?? true;
    
    const isTTY = process.stdin.isTTY && process.stdout.isTTY;
    
    if (autoContinue && !isTTY) {
      const warning = '\n[dp] Non-interactive environment detected. Continuing automatically...\n';
      writeToStream(warning, options?.stream);
      resolve();
      return;
    }
    
    let timer: NodeJS.Timeout | undefined;
    let didResolve = false;
    
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      process.stdin.pause();
    };
    
    const onError = (err: Error) => {
      if (didResolve) return;
      didResolve = true;
      cleanup();
      reject(err);
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
    
    const inputListener = (chunk: Buffer) => {
      const input = chunk.toString();
      if (input === '\n' || input === '\r\n') {
        process.stdin.off('data', inputListener);
        process.stdin.off('error', onError);
        handleResolve();
      }
    };
    
    if (timeout > 0) {
      timer = setTimeout(handleTimeout, timeout);
    }
    
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', inputListener);
    process.stdin.once('error', onError);
    
    writeToStream(`\n${message} `, options?.stream);
  });
}

export async function dp(value: unknown, options?: PauseOptions): Promise<unknown> {
  const output = inspect(value, options);
  writeToStream(output, options?.stream);
  await waitForUser(options);
  return value;
}