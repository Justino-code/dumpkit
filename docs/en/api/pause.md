# dp()

> **⚠️ WARNING:** The `dp()` function currently prevents the process from terminating naturally after the last pause. You may need to press `Ctrl+C` to exit. This issue will be fixed in a future release. As a workaround, you can call `process.exit(0)` after the last `dp()` call.

Pauses program execution for interactive inspection.

---

## Syntax

```ts
dp(value: unknown, options?: PauseOptions): Promise<unknown>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to display |
| `options` | `PauseOptions` | Configuration options (optional) |

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Visualisation style |
| `message` | `string` | `"Press ENTER to continue..."` | Message to display |
| `timeout` | `number` | `0` | Max wait time in ms (0 = infinite) |
| `autoContinue` | `boolean` | `true` | Auto-continue in CI/non-TTY environment |
| `depth` | `number` | `30` | Maximum nesting depth |
| `colors` | `boolean` | `auto` | Force colors |
| `stream` | `WriteStream` | `stderr` | Output stream |

## Return value

Returns a Promise that resolves with the original value when the pause ends.

---

## Examples

### Basic usage

```js
await dp({ name: 'John', age: 30 });
```

**Output:**
```
{
  name: "John",
  age: 30
}

Press ENTER to continue... _
```

(After pressing ENTER, the program continues)

### Custom message

```js
await dp(data, { message: 'Check the data and press ENTER' });
```

**Output:**
```
{
  status: "processing",
  step: 2
}

Check the data and press ENTER _
```

### With timeout

```js
await dp(user, { timeout: 5000 });
```

**Output:**
```
{
  name: "John",
  age: 30
}

Press ENTER to continue... _ (or continues after 5 seconds)
```

### Tree view

```js
const data = {
  name: 'John',
  address: { city: 'Lisbon' }
};

await dp(data, { view: 'tree' });
```

**Output:**
```
Object
├── name: "John"
└── address: Object
    └── city: "Lisbon"

Press ENTER to continue... _
```

### Table view

```js
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

await dp(users, { view: 'table' });
```

**Output:**
```
name   | age
───────┼─────
Alice  | 30
Bob    | 25

Press ENTER to continue... _
```

### Without colors

```js
await dp(user, { colors: false });
```

**Output (no ANSI codes):**
```
{
  name: "John",
  age: 30
}

Press ENTER to continue... _
```

### Redirect to file

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

await dp(user, { stream });
// Output is written to debug.log file
// The pause message remains in the terminal
```

---

## Combination with trace

For debugging with stack trace before pausing:

```js
trace('checkpoint-before-pause');
await dp(value);
```

## Behavior in CI

In non-interactive environments (CI, GitHub Actions, production), the function **automatically continues** without pausing.

```js
await dp(user); // Does not block in CI
```

**Output in CI:**
```
{
  name: "John",
  age: 30
}

[dp] Non-interactive environment detected. Continuing automatically...
```

---

## Known Issues

### Process does not exit naturally after `dp()`

Currently, after the last `dp()` call, the process does not terminate on its own – you may need to press `Ctrl+C`. This will be fixed in a future release.

**Workaround:**
```js
await dp(lastValue);
process.exit(0);
```

---

## Tips

- Use `dp()` to inspect values interactively
- Combine with `trace()` to see where you are in the code
- Set `timeout` to prevent blocking in production
- Use `autoContinue: false` to force pause even in CI
- Use `view: 'tree'` for nested structures
- Use `view: 'table'` for arrays of objects