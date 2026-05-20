# dump() & dd()

## dump()

Prints a formatted value to the terminal.

### Syntax

```ts
dump(value: unknown, options?: DumpOptions): unknown
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to dump |
| `options` | `DumpOptions` | Configuration options (optional) |

### Return value

Returns the original `value` unchanged - enables chaining.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `depth` | `number` | `4` | Maximum nesting depth |
| `colors` | `boolean` | `auto` | `true` = force colors, `false` = no colors, `auto` = TTY-based |
| `showHidden` | `boolean` | `false` | Show non-enumerable properties |
| `maxArrayLength` | `number` | `100` | Maximum array items to display |
| `maxStringLength` | `number` | `1000` | Maximum string length |
| `indent` | `number` | `2` | Spaces per indentation level |
| `stream` | `WriteStream` | `stderr` | Output stream |

### Examples

#### Basic usage

```js
dump({ name: 'John', age: 30 });
```

#### With options

```js
dump(obj, { depth: 2, colors: false });
```

#### Chaining

```js
const result = dump(user).process();
```

#### Custom stream

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');
dump(data, { stream });
```

---

## dd()

Dump and die - prints the value and terminates the process.

### Syntax

```ts
dd(value: unknown, options?: DumpOptions): never
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to dump |
| `options` | `DumpOptions` | Configuration options (optional) |

### Return value

Never returns - calls `process.exit(1)`.

### Examples

#### Basic usage

```js
function handler(req) {
  dd(req); // Dumps request and stops
  // This code never runs
}
```

#### Conditional debugging

```js
if (error) {
  dd({ error, context: 'api-failure' });
}
```

---

## Differences between dump() and dd()

| Function | Output | Continues execution? |
|----------|--------|---------------------|
| `dump()` | Prints value | ✅ Yes |
| `dd()` | Prints value | ❌ No (process.exit) |

## Tips

- Use `dump()` to inspect values during normal flow
- Use `dd()` to stop execution at a specific point
- Chaining with `dump()` enables non-intrusive debugging:

```js
const result = dump(process(data)).transform();
// The value of process(data) is shown, but transform() is still called
```