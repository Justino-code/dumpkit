# Philosophy

## Separation of Concerns

dumpkit is built on a simple principle:

> **Generate debug output without caring where it goes.**

This means:

- `inspect()` returns a formatted string (supports multiple views: `flat`, `tree`, `table`) - pure, no side effects
- `dump()` uses `inspect()` + writes to stderr
- `analyze()` returns a rich data structure (`AnalysisNode`) for programmatic analysis
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
| `dump()` | Prints and continues (supports `flat`, `tree`, `table`) |
| `dd()` | Prints and terminates the process |
| `dp()` | Prints and pauses until ENTER |
| `inspect()` | Returns formatted string (`flat`, `tree`, `table`) |
| `analyze()` | Returns `AnalysisNode` (rich data structure) |
| `trace()` | Shows where you are in the code |
| `measure()` | Measures execution time |

## Why not just use console.log?

| Feature | console.log | dumpkit |
|---------|-------------|---------|
| Pretty formatting | ❌ | ✅ |
| Multiple views (tree, table) | ❌ | ✅ |
| Programmatic analysis | ❌ | ✅ (analyze) |
| Interactive pause | ❌ | ✅ (dp) |
| Circular references | 💥 Crash | ✅ Safe |
| Shared references | ❌ | ✅ (`[Shared *N]`) |
| Map/Set support | `Map(3)` | ✅ Full expansion |
| Depth control | ❌ | ✅ |
| Chaining | ❌ | ✅ (dump) |
| Stack traces | ❌ | ✅ (trace) |
| Timing | ❌ | ✅ (measure) |
| Dump and die | ❌ | ✅ (dd) |

## Extensibility

The clean separation allows anyone to build on top:

### Example: Custom HTTP debugger

```js
import { inspect } from 'dumpkit';

app.get('/debug/state', (req, res) => {
  const state = inspect(app.state, { view: 'tree' });
  res.json({ debug: state });
});
```

### Example: File logger

```js
import { inspect } from 'dumpkit';
import { appendFile } from 'fs/promises';

await appendFile('debug.log', inspect(data, { view: 'flat', colors: false }));
```

### Example: Programmatic analysis

```js
import { analyze } from 'dumpkit';

const analysis = analyze(data);
console.log(`Type: ${analysis.type}`);
console.log(`Properties: ${analysis.properties.length}`);
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

But you can **combine** dumpkit with those tools - `inspect()` gives you the formatted string you can send anywhere, and `analyze()` gives you the data structure for advanced processing.