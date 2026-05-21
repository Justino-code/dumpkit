# trace()

Shows the current execution point in the code.

## Syntax

```ts
trace(label?: string, options?: TraceOptions): void
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Optional identifier for this trace point |
| `options` | `TraceOptions` | Configuration options (optional) |

## Return value

Returns nothing (`void`).

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colors` | `boolean` | `auto` | `true` = force colors, `false` = no colors, `auto` = TTY-based |
| `showStack` | `boolean` | `false` | Show full stack trace |
| `stream` | `WriteStream` | `stderr` | Output stream |

## Examples

### Basic usage

```js
function authenticate() {
  trace();
  // Output: [Trace] at src/auth.ts:42:12
}
```

### With label

```js
function login() {
  trace('login-start');
  // Output: [Trace] login-start at src/auth.ts:42:12
}
```

### Full stack

```js
function level3() {
  trace('deep-call', { showStack: true });
}

function level2() {
  level3();
}

function level1() {
  level2();
}

level1();
// Shows the entire call chain
```

### Conditional debugging

```js
function processOrder(order) {
  if (!order.valid) {
    trace('invalid-order', { showStack: true });
    return { error: 'Invalid order' };
  }
  
  trace('order-validated');
  // ... processing
}
```

### Redirect to file

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

trace('checkpoint', { stream });
// Output written to debug.log file
```

## Use cases

| Situation | How to use |
|-----------|------------|
| Verify if a function was called | `trace('here')` |
| Find out who called a function | `trace('called', { showStack: true })` |
| Map execution flow | `trace('step-1')`, `trace('step-2')` |
| Event debugging | `trace('click-event')` |

## Output examples

### Without label
```
[Trace] at src/user/controller.ts:24:8
```

### With label
```
[Trace] auth-checkpoint at src/user/controller.ts:24:8
```

### With full stack
```
[Trace] deep-call at src/nested.ts:15:10
Stack trace:
  at level3 (src/nested.ts:15:10)
  at level2 (src/nested.ts:19:3)
  at level1 (src/nested.ts:23:3)
  at Object.<anonymous> (src/index.ts:10:1)
```

## Tips

- Use `trace()` to understand code flow
- Add descriptive labels to identify specific points
- `showStack` is useful to understand the call chain
- Remove `trace()` calls before deploying to production (or use conditionals)
- Use the `stream` option to redirect logs to a file