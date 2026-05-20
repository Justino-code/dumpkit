# measure()

Measures execution time of synchronous or asynchronous functions.

## Syntax

```ts
measure(label: string, fn: () => T, options?: MeasureOptions): T
measure(label: string, fn: () => Promise<T>, options?: MeasureOptions): Promise<T>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Identifier for this measurement |
| `fn` | `() => T` or `() => Promise<T>` | Function to measure |
| `options` | `MeasureOptions` | Configuration options (optional) |

## Return value

Returns the same value that the measured function returns (or Promise).

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colors` | `boolean` | `auto` | `true` = force colors, `false` = no colors, `auto` = TTY-based |

## Examples

### Synchronous function

```js
function sortArray() {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  return arr.sort();
}

const result = measure('sorting', () => sortArray());
// Output: [Measure] sorting: 12.34ms
```

### Asynchronous function

```js
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  return response.json();
}

const users = await measure('api-fetch', () => fetchUsers());
// Output: [Measure] api-fetch: 145.67ms
```

### Without colors

```js
measure('operation', fn, { colors: false });
```

### Compare two approaches

```js
// Approach 1: for loop
measure('for-loop', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

// Approach 2: reduce
measure('array-reduce', () => {
  const arr = Array.from({ length: 1000000 }, (_, i) => i);
  return arr.reduce((acc, val) => acc + val, 0);
});
```

## Time formatting

Output automatically formats the duration:

| Duration | Format | Example |
|----------|--------|---------|
| < 1ms | microseconds (µs) | `42.50µs` |
| < 1s | milliseconds (ms) | `234.56ms` |
| ≥ 1s | seconds (s) | `1.23s` |

## Error handling

Errors are propagated while time is still measured:

```js
try {
  measure('failing', () => {
    throw new Error('Something went wrong');
  });
} catch (error) {
  // Error is thrown, but measurement is still logged
  console.error('Caught error:', error);
}
// Output: [Measure] failing: 0.05ms (even with error)
```

## Tips

- Use `measure()` to identify performance bottlenecks
- Compare different implementations of the same functionality
- Remove `measure()` before deploying to production (or use conditionals)
- For very fast operations (< 1ms), output shows in microseconds