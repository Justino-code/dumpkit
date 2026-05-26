// src/dump/pause.ts

import { inspect } from '../core/inspect';
import { flat } from '../core/renderers/flat';
import { tree } from '../core/renderers/tree';
import { table } from '../core/renderers/table';
import { writeToStream } from './render';
import type { DumpOptions } from '../shared/types/options';

export interface PauseOptions extends DumpOptions {
  message?: string;
  timeout?: number;
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
    let resolved = false;

    const onData = (chunk: Buffer) => {
      const input = chunk.toString();
      // Detecta ENTER (pode ser \n, \r\n, \r)
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

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      process.stdin.removeListener('data', onData);
      // Não pausar o stdin globalmente; apenas remover o listener.
    };

    if (timeout > 0) {
      timer = setTimeout(onTimeout, timeout);
    }

    // Adiciona listener temporário
    process.stdin.on('data', onData);
    // Mostra a mensagem
    writeToStream(`\n${message} `, options?.stream);
  });
}

export async function dp(value: unknown, options?: PauseOptions): Promise<unknown> {
  const output: string = inspect(value, options);
  
  writeToStream(output, options?.stream);
  await waitForUser(options);
  return value;
}