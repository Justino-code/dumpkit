# Utilities

`dumpkit` exposes some internal utilities for advanced use cases.

## shouldUseColors()

Determines whether colors should be used in output.

### Syntax

```ts
shouldUseColors(forceColor?: boolean): boolean
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `forceColor` | `boolean` | `true` = force colors, `false` = no colors, `undefined` = auto |

### Returns

Returns `true` if colors should be used, `false` otherwise.

### Example

```js
import { shouldUseColors } from 'dumpkit/utils';

if (shouldUseColors()) {
  console.log('Terminal supports colors');
}
```

---

## colorize()

Applies ANSI colors to a string.

### Syntax

```ts
colorize(str: string, color: string | ColorKey, useColors: boolean): string
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `str` | `string` | String to color |
| `color` | `string \| ColorKey` | ANSI color code or color key |
| `useColors` | `boolean` | Whether to apply colors |

### Returns

Colored string if `useColors` is `true`, otherwise original string.

### Example

```js
import { colorize, COLORS } from 'dumpkit/utils';

const red = colorize('Error!', COLORS.red, true);
console.log(red);
```

---

## COLORS

Object with ANSI color codes.

### Available colors

| Key | Color |
|-----|-------|
| `reset` | Reset |
| `bold` | Bold |
| `dim` | Dim |
| `red` | Red |
| `green` | Green |
| `yellow` | Yellow |
| `blue` | Blue |
| `cyan` | Cyan |
| `magenta` | Magenta |
| `gray` | Gray |

### Example

```js
import { COLORS } from 'dumpkit/utils';

console.log(`${COLORS.red}Error${COLORS.reset}: ${message}`);
```

---

## CircularDetector

Detects **circular** and **shared** references during object traversal.

### Syntax

```ts
class CircularDetector {
  enter(obj: object, path: string): { id: number; isCircular: boolean; isShared: boolean; originalPath?: string };
  leave(obj: object): void;
  reset(): void;
  has(obj: object): boolean;
  getRefId(obj: object): number;
  getOriginalPath(obj: object): string;
}
```

### Methods

| Method | Description |
|--------|-------------|
| `enter(obj, path)` | Called when entering an object. Returns state (circular, shared, or new) |
| `leave(obj)` | Called when leaving an object after processing its children |
| `reset()` | Resets the detector for a new traversal |
| `has(obj)` | Checks if an object has ever been visited |
| `getRefId(obj)` | Returns the unique ID of a visited object |
| `getOriginalPath(obj)` | Returns the original path where the object was first encountered |

### Example

```js
import { CircularDetector } from 'dumpkit/utils';

const detector = new CircularDetector();

const shared = { value: 42 };
const obj = { a: shared, b: shared };

// First visit: new object
const result1 = detector.enter(shared, 'obj.a');
console.log(result1.isCircular); // false
console.log(result1.isShared);   // false
console.log(result1.id);         // 1

detector.leave(shared);

// Second visit: shared object
const result2 = detector.enter(shared, 'obj.b');
console.log(result2.isShared);   // true
console.log(result2.originalPath); // 'obj.a'

// Circular reference
const circular = {};
detector.enter(circular, 'root');
const result3 = detector.enter(circular, 'root.self');
console.log(result3.isCircular); // true
```

### Reference detection

| Type | Condition | Example |
|------|-----------|---------|
| **New object** | First time the object is encountered | `{ value: 42 }` |
| **Circular** | Object is already in the current stack | `obj.self = obj` |
| **Shared** | Object was visited elsewhere in the tree | `{ a: shared, b: shared }` |

---

## getCallerLocation()

Gets the location of who called the current function.

### Syntax

```ts
getCallerLocation(depth?: number): StackFrame | null
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `depth` | `number` | How many levels to go up (default: 1) |

### Returns

`StackFrame` object or `null` if not found.

### Example

```js
import { getCallerLocation } from 'dumpkit/utils';

function myLogger() {
  const caller = getCallerLocation(1);
  console.log(`Called from: ${caller.file}:${caller.line}`);
}
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