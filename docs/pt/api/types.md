# Tipos TypeScript

A `dumpkit` inclui tipos TypeScript completos para todas as APIs.

## InspectOptions

Opções para a função `inspect()`.

```ts
type InspectOptions = {
  view?: 'flat' | 'tree' | 'table'; // Estilo de visualização (padrão: 'flat')
  depth?: number;                    // Profundidade máxima (padrão: 30)
  colors?: boolean;                  // Forçar cores (padrão: auto)
  showHidden?: boolean;              // Mostrar propriedades não enumeráveis (padrão: false)
  maxArrayLength?: number;           // Máx. itens do array (padrão: 1000)
  maxStringLength?: number;          // Máx. comprimento da string (padrão: 5000)
  indent?: number;                   // Espaços por indentação (padrão: 2)
  maxProperties?: number;            // Máx. propriedades do objeto (padrão: 200)
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
  stream?: NodeJS.WriteStream; // Stream de saída (padrão: stderr)
};
```

## MeasureOptions

Opções para a função `measure()`.

```ts
type MeasureOptions = {
  colors?: boolean;    // Forçar cores (padrão: auto)
  indent?: number;     // Espaços por indentação (padrão: 2)
  stream?: NodeJS.WriteStream; // Stream de saída (padrão: stderr)
};
```

## PauseOptions

Opções para a função `dp()`.

```ts
type PauseOptions = InspectOptions & {
  message?: string;         // Mensagem a mostrar (padrão: 'Press ENTER to continue...')
  timeout?: number;         // Tempo máximo em ms (0 = infinito, padrão: 0)
  autoContinue?: boolean;   // Auto-continuar em CI/ambiente não TTY (padrão: true)
};
```

## AnalyzeOptions

Opções para a função `analyze()`.

```ts
type AnalyzeOptions = {
  depth?: number;           // Profundidade máxima (padrão: 30)
  maxArrayLength?: number;  // Máx. itens do array (padrão: 1000)
  maxStringLength?: number; // Máx. comprimento da string (padrão: 5000)
  maxProperties?: number;   // Máx. propriedades do objeto (padrão: 200)
  showHidden?: boolean;     // Mostrar propriedades não enumeráveis (padrão: false)
};
```

## AnalysisNode

Estrutura de um nó da análise semântica.

```ts
type AnalysisNode = 
  | PrimitiveNode
  | ObjectNode
  | ArrayNode
  | MapNode
  | SetNode
  | DateNode
  | ErrorNode
  | RegExpNode
  | FunctionNode
  | TypedArrayNode
  | WeakMapNode
  | WeakSetNode
  | PromiseNode
  | CircularNode
  | SharedNode;

// Exemplo: ObjectNode
type ObjectNode = {
  type: 'object';
  className: string;
  properties: { key: string | symbol; value: AnalysisNode; enumerable: boolean }[];
  truncated?: boolean;
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
  view: 'tree',
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
import type { StackFrame, AnalysisNode } from 'dumpkit';

function processFrame(frame: StackFrame) {
  console.log(`${frame.file}:${frame.line}`);
}

function isObjectNode(node: AnalysisNode): node is ObjectNode {
  return node.type === 'object';
}
```