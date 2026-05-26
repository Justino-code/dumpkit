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
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Visualisation style |
| `depth` | `number` | `30` | Maximum nesting depth |
| `colors` | `boolean` | `auto` | `true` = force colors, `false` = no colors, `auto` = TTY-based |
| `showHidden` | `boolean` | `false` | Show non-enumerable properties |
| `maxArrayLength` | `number` | `1000` | Maximum array items to display |
| `maxStringLength` | `number` | `5000` | Maximum string length |
| `indent` | `number` | `2` | Spaces per indentation level |
| `stream` | `WriteStream` | `stderr` | Output stream |

### Examples

#### Basic usage (flat view)

```js
dump({ name: 'John', age: 30 });
```

**Output:**
```
{
  name: "John",
  age: 30
}
```

#### Tree view

```js
const data = {
  name: 'John',
  address: {
    city: 'Lisbon',
    street: 'Augusta'
  }
};

dump(data, { view: 'tree' });
```

**Output:**
```
Object
├── name: "John"
└── address: Object
    ├── city: "Lisbon"
    └── street: "Augusta"
```

#### Table view (array of objects)

```js
const users = [
  { name: 'Alice', age: 30, city: 'Lisbon' },
  { name: 'Bob', age: 25, city: 'Porto' }
];

dump(users, { view: 'table' });
```

**Output:**
```
name   | age | city
───────┼─────┼───────
Alice  | 30  | Lisbon
Bob    | 25  | Porto
```

#### With limited depth

```js
const deep = { a: { b: { c: { d: 'deep' } } } };
dump(deep, { depth: 2 });
```

**Output:**
```
{
  a: {
    b: [Object]
  }
}
```

#### Without colors

```js
dump({ error: 'Failed' }, { colors: false });
```

**Output (no ANSI codes):**
```
{
  error: "Failed"
}
```

#### Chaining

```js
const result = dump(user).process();
// The value of user is printed, then process() is called
```

#### Custom stream

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');
dump(data, { stream });
// Output is written to debug.log file
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
  dd(req);
  // This code never runs
}
```

**Output:**
```
{
  method: "GET",
  url: "/api/users"
}
```
(Process terminates after output)

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
- Use `view: 'tree'` to understand nested structures
- Use `view: 'table'` for arrays of homogeneous objects
- Chaining with `dump()` enables non-intrusive debugging:

```js
const result = dump(process(data)).transform();
// The value of process(data) is shown, but transform() is still called
```