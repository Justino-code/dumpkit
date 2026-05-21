# Combinations

`dumpkit` places no limits on your creativity. All functions are **independent and pure** – you can use them in any order, inside conditionals, loops, or combined with native Node.js code.

The combinations listed below are just **examples** to illustrate the composable spirit of the library. In practice, you can create countless others.

---

## Examples of combinations

### Dump with stack trace

```js
dump(value);
trace();
```

### Dump with timing

```js
const { result } = measure('operation', () => fn());
dump(result);
```

### Dump and pause

```js
await dp(value);
```

### Dump, stack and pause

```js
await dpp(value);
```

### Dump and die with stack

```js
trace();
dd(value);
```

### Measure and die

```js
const { result } = measure('operation', () => fn());
dd(result);
```

### Inspect without colors and save

```js
const str = inspect(object, { colors: false });
fs.writeFileSync('debug.json', str);
```

### Multiple values in dump

Currently, to display multiple values, group them in an object:

```js
dump({ v1, v2, v3 });
```

### Combine with native code

```js
// Conditional dump
if (process.env.DEBUG) dump(data);

// Accumulate measurements
const m1 = measure('A', fnA).measurement;
const m2 = measure('B', fnB).measurement;
dump({ m1, m2 });

// Redirect to file
const stream = createWriteStream('./debug.log');
trace('checkpoint', { stream });
await measure('query', () => db.query(sql), { stream });
```

---

## Combinations table

| Name | Description | Code |
|------|-------------|------|
| `ddd` | Dump with stack trace | `dump(value); trace()` |
| `ddt` | Dump with timing | `dump(measure('op', () => fn()).result)` |
| `dp` | Dump and pause | `await dp(value)` |
| `dpp` | Dump, stack and pause | `await dpp(value)` |
| `ddds` | Dump, stack and die | `trace(); dd(value)` |
| `ddts` | Timing and die | `dd(measure('op', () => fn()).result)` |
| `dds` | Silent dump (no colors) | `dump(obj, { colors: false })` |
| `ddp` | Dump with limited depth | `dump(obj, { depth: 2 })` |
| `dda` | Dump with array limit | `dump(arr, { maxArrayLength: 20 })` |
| `tdd` | Trace with full stack | `trace('point', { showStack: true })` |
| `id` | Inspect and save | `fs.writeFileSync('log', inspect(obj, { colors: false }))` |
| `cd` | Conditional dump | `if (debug) dump(data)` |
| `cm` | Compare measurements | `const a = measure('A', fnA).measurement; const b = measure('B', fnB).measurement; dump({ a, b })` |

---

## Conclusion

The **7 base functions** – `dump`, `dd`, `dp`, `dpp`, `inspect`, `trace`, `measure` – form a small vocabulary. With them, you can **combine infinitely** to solve any debugging need.

This documentation only suggests some useful patterns, **not an exhaustive list**. Feel free to create your own combinations and share them with the community.