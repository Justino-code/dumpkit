# dp()

Pauses program execution for interactive inspection.

## dp()

Shows a value and pauses execution until the user presses ENTER.

### Syntax

```ts
dp(value: unknown, options?: PauseOptions): Promise<unknown>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to display |
| `options` | `PauseOptions` | Configuration options (optional) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | `"Press ENTER to continue..."` | Message to display |
| `timeout` | `number` | `0` | Max wait time in ms (0 = infinite) |
| `autoContinue` | `boolean` | `true` | Auto-continue in CI/non-TTY environment |
| `depth` | `number` | `30` | Maximum nesting depth |
| `colors` | `boolean` | `auto` | Force colors |
| `stream` | `WriteStream` | `stderr` | Output stream |

### Return value

Returns a Promise that resolves with the original value when the pause ends.

### Examples

#### Basic usage

```js
await dp(user);
// Shows user and waits for ENTER
```

#### Custom message

```js
await dp(data, { message: 'Check the data and press ENTER' });
```

#### With timeout

```js
await dp(user, { timeout: 5000 });
// Automatically continues after 5 seconds
```

#### Without colors

```js
await dp(user, { colors: false });
```

## Combination with trace

To get the behavior of the former `dpp()`, combine `trace()` with `dp()`:

```js
trace('my-point');
await dp(value);
```

Or with full stack:

```js
trace('my-point', { showStack: true });
await dp(value);
```

## Behavior in CI

In non-interactive environments (CI, GitHub Actions, production), the function **automatically continues** without pausing.

```js
await dp(user); // Does not block in CI
```

## Practical examples

### Interactive debugging

```js
import { trace, dp } from 'dumpkit';

async function processOrder(order) {
  trace('order-received', { showStack: true });
  await dp(order);
  
  const result = await api.process(order);
  await dp(result, { message: 'Result obtained. Continue?' });
  
  return result;
}
```

### With timeout to prevent blocking

```js
await dp(data, { 
  timeout: 10000,
  message: 'Check the data. Continuing in 10s...' 
});
```

### Redirect to file

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

await dp(user, { stream });
```

## Tips

- Use `dp()` to inspect values interactively
- Combine with `trace()` to see where you are in the code
- Set `timeout` to prevent blocking in production
- Use `autoContinue: false` to force pause even in CI