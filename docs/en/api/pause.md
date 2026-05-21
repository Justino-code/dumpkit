# dp() and dpp()

Pause program execution for interactive inspection.

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
| `depth` | `number` | `4` | Maximum nesting depth |
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

## dpp()

Shows a value, displays the stack trace, and pauses execution.

### Syntax

```ts
dpp(value: unknown, options?: PauseWithTraceOptions): Promise<unknown>
```

### Additional options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `"pause"` | Label for the trace |
| `showStack` | `boolean` | `true` | Show full stack trace |

### Examples

#### Basic usage

```js
await dpp(user);
// Shows user, stack trace, and waits for ENTER
```

#### Custom label

```js
await dpp(user, { label: 'auth-checkpoint' });
```

#### Disable full stack

```js
await dpp(user, { showStack: false });
```

## Behavior in CI

In non-interactive environments (CI, GitHub Actions, production), the function **automatically continues** without pausing.

```js
await dp(user); // Does not block in CI
```

## Practical examples

### Interactive debugging

```js
import { dp, dpp } from 'dumpkit';

async function processOrder(order) {
  await dpp(order, { label: 'order-received' });
  
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

## Differences between dp() and dpp()

| Function | Shows value | Shows stack | Pause |
|----------|-------------|-------------|-------|
| `dp()` | ✅ | ❌ | ✅ |
| `dpp()` | ✅ | ✅ | ✅ |