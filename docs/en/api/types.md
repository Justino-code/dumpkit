# TypeScript Types

`dumpkit` includes complete TypeScript types for all APIs.

## InspectOptions

Options for the `inspect()` function.

```ts
type InspectOptions = {
  view?: 'flat' | 'tree' | 'table'; // Visualisation style (default: 'flat')
  depth?: number;                    // Maximum depth (default: 30)
  colors?: boolean;                  // Force colors (default: auto)
  showHidden?: boolean;              // Show non-enumerable properties (default: false)
  maxArrayLength?: number;           // Max array items (default: 1000)
  maxStringLength?: number;          // Max string length (default: 5000)
  indent?: number;                   // Spaces per indentation (default: 2)
  maxProperties?: number;            // Max object properties (default: 200)
};
```

## DumpOptions

Options for `dump()` and `dd()` functions.

```ts
type DumpOptions = InspectOptions & {
  stream?: NodeJS.WriteStream; // Output stream (default: stderr)
};
```

## TraceOptions

Options for the `trace()` function.

```ts
type TraceOptions = {
  colors?: boolean;    // Force colors (default: auto)
  indent?: number;     // Spaces per indentation (default: 2)
  showStack?: boolean; // Show full stack (default: false)
  stream?: NodeJS.WriteStream; // Output stream (default: stderr)
};
```

## MeasureOptions

Options for the `measure()` function.

```ts
type MeasureOptions = {
  colors?: boolean;    // Force colors (default: auto)
  indent?: number;     // Spaces per indentation (default: 2)
  stream?: NodeJS.WriteStream; // Output stream (default: stderr)
};
```

## PauseOptions

Options for the `dp()` function.

```ts
type PauseOptions = InspectOptions & {
  message?: string;         // Message to display (default: 'Press ENTER to continue...')
  timeout?: number;         // Max wait time in ms (0 = infinite, default: 0)
  autoContinue?: boolean;   // Auto-continue in CI/non-TTY environment (default: true)
};
```

## AnalyzeOptions

Options for the `analyze()` function.

```ts
type AnalyzeOptions = {
  depth?: number;           // Maximum depth (default: 30)
  maxArrayLength?: number;  // Max array items (default: 1000)
  maxStringLength?: number; // Max string length (default: 5000)
  maxProperties?: number;   // Max object properties (default: 200)
  showHidden?: boolean;     // Show non-enumerable properties (default: false)
};
```

## AnalysisNode

Structure of a semantic analysis node.

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

// Example: ObjectNode
type ObjectNode = {
  type: 'object';
  className: string;
  properties: { key: string | symbol; value: AnalysisNode; enumerable: boolean }[];
  truncated?: boolean;
};
```

## StackFrame

Structure of a stack frame.

```ts
type StackFrame = {
  file: string;         // File path
  line: number;         // Line number
  column: number;       // Column number
  functionName: string; // Function name
  raw: string;          // Raw stack line
};
```

## MeasureResult

Result of a measurement.

```ts
type MeasureResult = {
  label: string;        // Measurement label
  durationMs: number;   // Duration in milliseconds
  startTime: number;    // Start timestamp
  endTime: number;      // End timestamp
};
```

## Usage in TypeScript projects

### Import types

```ts
import { inspect, dump } from 'dumpkit';
import type { InspectOptions, DumpOptions } from 'dumpkit';

const opts: InspectOptions = {
  view: 'tree',
  depth: 2,
  colors: false
};

const output = inspect(data, opts);
```

### Extend types

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