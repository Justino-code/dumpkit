# analyze()

The semantic core of `dumpkit`. The `analyze()` function traverses any value at runtime and builds a **rich, format-agnostic analysis tree** – not a string, but a data structure that represents the internal shape of the value.

This tree can be used programmatically to understand data structure, detect circular or shared references, and serve as the foundation for different visualizations (`flat`, `tree`, `table`).

---

## Syntax

```ts
analyze(value: unknown, options?: AnalyzeOptions): AnalysisNode
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `unknown` | The value to analyze |
| `options` | `AnalyzeOptions` | Configuration options (depth, limits, etc.) |

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `depth` | `number` | `30` | Maximum analysis depth |
| `maxArrayLength` | `number` | `1000` | Maximum number of array items analyzed |
| `maxStringLength` | `number` | `5000` | Maximum string length |
| `maxProperties` | `number` | `200` | Maximum number of object properties |
| `showHidden` | `boolean` | `false` | Include non-enumerable properties and symbols |

## Return value – `AnalysisNode`

`AnalysisNode` is a node in a tree that semantically describes the value. Each node has a `type` property, which can be:

| Type | Description |
|------|-------------|
| `primitive` | Primitive values (string, number, boolean, null, undefined, bigint, symbol) |
| `object` | Objects (with `className`, `properties` and `truncated` flag) |
| `array` | Arrays (with `length`, `items` and `truncated`) |
| `map` | Map (with `size`, `entries` and `truncated`) |
| `set` | Set (with `size`, `values` and `truncated`) |
| `date` | Date (with `isValid` and ISO `value`) |
| `error` | Error (with `name` and `message`) |
| `regexp` | RegExp (with `source` and `flags`) |
| `function` | Function (with `name`) |
| `typedarray` | TypedArray (with `className`, `items` and `truncated`) |
| `weakmap` | WeakMap (type only) |
| `weakset` | WeakSet (type only) |
| `promise` | Promise (type only) |
| `circular` | Circular reference detected |
| `shared` | Shared object (referenced multiple times) |

## Examples

### Programmatic analysis

```js
import { analyze } from 'dumpkit';

const user = {
  name: 'John',
  age: 30,
  tags: ['admin', 'user']
};

const analysis = analyze(user);
console.log(analysis.type);                // 'object'
console.log(analysis.properties.length);   // 3
console.log(analysis.properties[0].key);   // 'name'
```

### Circular reference detection

```js
const circular = {};
circular.self = circular;

const analysis = analyze(circular);
// analysis.properties[0].value.type === 'circular'
// analysis.properties[0].value.refId === 1
```

### Depth limiting

```js
const deep = { a: { b: { c: 'value' } } };
const shallow = analyze(deep, { depth: 1 });
// shallow.properties[0].value.type === 'object' (not expanded)
```

### Shared object

```js
const shared = { x: 1 };
const data = { a: shared, b: shared };

const analysis = analyze(data);
// analysis.properties[0].value.type === 'object'
// analysis.properties[1].value.type === 'shared'
// analysis.properties[1].value.refId === 1
```

## Why use `analyze()`?

- **Structural understanding** – programmatically obtain the structure of any value
- **Extensibility** – build your own visualizers on top of the analysis
- **Performance** – analysis decoupled from formatting (can be cached)
- **Advanced detection** – identify circular and shared references

## See also

- [`inspect()`](./inspect) – formats values to string using different views
- [`dump()`](./dump) – prints values with `flat`, `tree` and `table` support