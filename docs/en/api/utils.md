# Utilities

nodedump exposes some internal utilities for advanced use cases.

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
import { shouldUseColors } from 'nodedump/utils';

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
import { colorize, COLORS } from 'nodedump/utils';

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
import { COLORS } from 'nodedump/utils';

console.log(`${COLORS.red}Error${COLORS.reset}: ${message}`);
```

---

## CircularDetector

Detects circular references in objects.

### Syntax

```ts
class CircularDetector {
  has(obj: object): boolean;
  add(obj: object, path: string): number;
  get(obj: object, currentPath: string): { marker: string; refId: number; originalPath: string };
  reset(): void;
}
```

### Methods

| Method | Description |
|--------|-------------|
| `has(obj)` | Checks if object has been seen before |
| `add(obj, path)` | Registers a new object |
| `get(obj, currentPath)` | Gets circular info |
| `reset()` | Clears the detector |

### Example

```js
import { CircularDetector } from 'nodedump/utils';

const detector = new CircularDetector();
const obj = { name: 'test' };

detector.add(obj, 'root');
console.log(detector.has(obj)); // true

const info = detector.get(obj, 'current');
console.log(info.marker); // [Circular *1]
```

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
import { getCallerLocation } from 'nodedump/utils';

function myLogger() {
  const caller = getCallerLocation(1);
  console.log(`Called from: ${caller.file}:${caller.line}`);
}
```