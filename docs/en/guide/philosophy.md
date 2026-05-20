# Philosophy

## Separation of Concerns

dumpkit is built on a simple principle:

> **Generate debug output without caring where it goes.**

This means:

- `inspect()` returns a string - pure, no side effects
- `dump()` uses `inspect()` + writes to stderr
- The same core can be reused for different outputs (terminal, HTTP, files)

## Zero Config

No environment variables. No configuration files. No surprises.

- Colors auto-detect based on TTY (but you can force them)
- No `NODE_ENV` checks - you control when to call dumpkit
- No external dependencies - keeps your project lean

## Predictable API

Every function does exactly what you expect:

| Function | What it does |
|----------|--------------|
| `dump()` | Prints and continues |
| `dd()` | Prints and terminates the process |
| `inspect()` | Returns formatted string |
| `trace()` | Shows where you are in the code |
| `measure()` | Measures execution time |

## Why not just use console.log?

| Feature | console.log | dumpkit |
|---------|-------------|----------|
| Pretty printing | ❌ | ✅ |
| Circular references | 💥 Crash | ✅ Safe |
| Map/Set support | `Map(3)` | ✅ Full expansion |
| Depth control | ❌ | ✅ |
| Chaining | ❌ | ✅ (dump) |
| Stack traces | ❌ | ✅ (trace) |
| Timing | ❌ | ✅ (measure) |
| Dump & die | ❌ | ✅ (dd) |

## Extensibility

The clean separation allows anyone to build on top:

### Example: Custom HTTP debugger

```js
import { inspect } from 'dumpkit';

app.get('/debug/state', (req, res) => {
  const state = inspect(app.state);
  res.json({ debug: state });
});
```

### Example: File logger

```js
import { inspect } from 'dumpkit';
import { appendFile } from 'fs/promises';

await appendFile('debug.log', inspect(data));
```

### Example: Debug middleware

```js
import { dump } from 'dumpkit';

app.use((req, res, next) => {
  dump({ method: req.method, url: req.url });
  next();
});
```

## Minimalist Design

dumpkit does one thing and does it well: **debugging**.

- No structured logging (use Pino/Winston for that)
- No distributed tracing (use OpenTelemetry for that)
- No dashboards (use Datadog/NewRelic for that)

But you can **combine** dumpkit with those tools - `inspect()` gives you the formatted string you can send anywhere.
