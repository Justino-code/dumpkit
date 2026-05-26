# inspect()

Returns a formatted string representation of a value without printing.

## Syntax

```ts
inspect(value: unknown, options?: InspectOptions): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to inspect |
| `options` | `InspectOptions` | Configuration options (optional) |

## Return value

Returns a formatted string ready to be used as you wish.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Visualisation style |
| `depth` | `number` | `30` | Maximum nesting depth |
| `colors` | `boolean` | `auto` | `true` = force colors, `false` = no colors, `auto` = TTY-based |
| `showHidden` | `boolean` | `false` | Show non-enumerable properties |
| `maxArrayLength` | `number` | `1000` | Maximum array items to display |
| `maxStringLength` | `number` | `5000` | Maximum string length |
| `indent` | `number` | `2` | Spaces per indentation level |

## Examples

### Basic usage (flat view)

```js
const output = inspect({ name: 'John', age: 30 });
console.log(output);
// { name: "John", age: 30 }
```

### Tree view

```js
const tree = inspect(data, { view: 'tree' });
console.log(tree);
// Object
// ├── name: "John"
// └── age: 30
```

### Table view (array of objects)

```js
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];
const table = inspect(users, { view: 'table' });
console.log(table);
// name   | age
// ───────┼─────
// Alice  | 30
// Bob    | 25
```

### Save to file

```js
import { inspect } from 'dumpkit';
import { writeFileSync } from 'fs';

const state = { users: 150, active: true };
writeFileSync('debug.json', inspect(state, { colors: false }));
```

### Send via HTTP

```js
import { inspect } from 'dumpkit';

app.get('/debug/state', (req, res) => {
  const debug = inspect(app.state);
  res.json({ debug });
});
```

### Unit tests

```js
import { inspect } from 'dumpkit';

test('should return correct structure', () => {
  const result = myFunction();
  const output = inspect(result, { colors: false });
  expect(output).toContain('property: "value"');
});
```

## Difference between inspect() and dump()

| Function | Returns string? | Prints to terminal? | Side effects |
|----------|----------------|---------------------|--------------|
| `inspect()` | ✅ Yes | ❌ No | None (pure) |
| `dump()` | ❌ No | ✅ Yes | Writes to stream |

## Why use inspect()?

- **Pure function** - no side effects
- **Multiple views** - `flat`, `tree`, `table` for different needs
- **Reusable** - same formatting for different destinations
- **Testable** - easy to verify output in tests
- **Extensible** - build your own tools on top

## Tips

- Use `inspect()` when you need the string for processing
- Use `dump()` when you just want to quickly see the value
- Disable colors (`colors: false`) when saving to files or sending via HTTP
- Use `view: 'tree'` to understand nested structures
- Use `view: 'table'` for arrays of homogeneous objects