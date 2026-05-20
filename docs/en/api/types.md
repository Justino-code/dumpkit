# TypeScript Types

dumpkit includes complete TypeScript types for all APIs.

## InspectOptions

Options for the `inspect()` function.

```ts
type InspectOptions = {
  depth?: number;           // Maximum depth (default: 30)
  colors?: boolean;         // Force colors (default: auto)
  showHidden?: boolean;     // Show non-enumerable properties (default: false)
  maxArrayLength?: number;  // Max array items (default: 1000)
  maxStringLength?: number; // Max string length (default: 1000)
  indent?: number;          // Spaces per indentation (default: 2)
  maxProperties?: number;   // Max object properties (default: 200)
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
};
```

## MeasureOptions

Options for the `measure()` function.

```ts
type MeasureOptions = {
  colors?: boolean; // Force colors (default: auto)
  indent?: number;  // Spaces per indentation (default: 2)
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
import type { StackFrame } from 'dumpkit';

function processFrame(frame: StackFrame) {
  console.log(`${frame.file}:${frame.line}`);
}
```