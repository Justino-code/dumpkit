# Tipos TypeScript

O dumpkit inclui tipos TypeScript completos para todas as APIs.

## InspectOptions

Opções para a função `inspect()`.

```ts
type InspectOptions = {
  depth?: number;           // Profundidade máxima (padrão: 4)
  colors?: boolean;         // Forçar cores (padrão: auto)
  showHidden?: boolean;     // Mostrar propriedades não enumeráveis (padrão: false)
  maxArrayLength?: number;  // Máx. itens do array (padrão: 100)
  maxStringLength?: number; // Máx. comprimento string (padrão: 1000)
  indent?: number;          // Espaços por indentação (padrão: 2)
  maxProperties?: number;   // Máx. propriedades objeto (padrão: 50)
};
```

## DumpOptions

Opções para as funções `dump()` e `dd()`.

```ts
type DumpOptions = InspectOptions & {
  stream?: NodeJS.WriteStream; // Stream de saída (padrão: stderr)
};
```

## TraceOptions

Opções para a função `trace()`.

```ts
type TraceOptions = {
  colors?: boolean;    // Forçar cores (padrão: auto)
  indent?: number;     // Espaços por indentação (padrão: 2)
  showStack?: boolean; // Mostrar stack completo (padrão: false)
};
```

## MeasureOptions

Opções para a função `measure()`.

```ts
type MeasureOptions = {
  colors?: boolean; // Forçar cores (padrão: auto)
  indent?: number;  // Espaços por indentação (padrão: 2)
};
```

## StackFrame

Estrutura de um frame da stack.

```ts
type StackFrame = {
  file: string;         // Caminho do ficheiro
  line: number;         // Número da linha
  column: number;       // Número da coluna
  functionName: string; // Nome da função
  raw: string;          // Linha raw original
};
```

## MeasureResult

Resultado de uma medição.

```ts
type MeasureResult = {
  label: string;        // Rótulo da medição
  durationMs: number;   // Duração em milissegundos
  startTime: number;    // Timestamp de início
  endTime: number;      // Timestamp de fim
};
```

## Uso em projetos TypeScript

### Importar tipos

```ts
import { inspect, dump } from 'dumpkit';
import type { InspectOptions, DumpOptions } from 'dumpkit';

const opts: InspectOptions = {
  depth: 2,
  colors: false
};

const output = inspect(dados, opts);
```

### Extender tipos

```ts
import type { DumpOptions } from 'dumpkit';

interface MyDumpOptions extends DumpOptions {
  myCustomOption?: boolean;
}
```

### Type guards

```ts
import type { StackFrame } from 'dumpkit';

function processFrame(frame: StackFrame) {
  console.log(`${frame.file}:${frame.line}`);
}
```