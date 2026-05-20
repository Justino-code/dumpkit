# Getting Started

## Installation

```bash
yarn add nodedump
# or
npm install nodedump
```

## Basic Usage

### Import what you need

```js
import { dump, dd, inspect, trace, measure } from 'nodedump';
```

### Dump a value

```js
const user = { name: 'John', age: 30, tags: ['admin', 'user'] };

dump(user);
```

**Output:**
```
{
  name: "John",
  age: 30,
  tags: ["admin", "user"]
}
```

### Dump and die

```js
dd(user); // Dumps the value and terminates the process
```

### Get formatted string without printing

```js
const output = inspect(user);
console.log('Debug:', output);
```

### Trace execution flow

```js
function authenticate() {
  trace('auth-user');
  // ... authentication logic
}

authenticate();
```

**Output:**
```
[Trace] auth-user at src/auth.ts:42:12
```

### Measure performance

```js
// Synchronous
measure('sort-array', () => {
  return array.sort();
});

// Asynchronous
await measure('db-query', async () => {
  return await database.find({ id: 1 });
});
```

**Output:**
```
[Measure] sort-array: 2.35ms
[Measure] db-query: 45.23ms
```

## Next Steps

- Check the [API Reference](/en/api/dump) for detailed options
- See [Examples](/en/guide/examples) for advanced usage
- Read about the [Philosophy](/en/guide/philosophy) behind nodedump