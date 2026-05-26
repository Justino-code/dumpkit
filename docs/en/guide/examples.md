# Examples

## Complex Data Structures

### Nested Objects

```js
const user = {
  id: 1,
  name: 'John Smith',
  email: 'john@example.com',
  profile: {
    age: 30,
    city: 'Lisbon',
    address: {
      street: 'Augusta Street',
      zipCode: '1100-053'
    }
  },
  interests: ['programming', 'music', 'photography']
};

dump(user);
```

**Output (flat view):**
```
{
  id: 1,
  name: "John Smith",
  email: "john@example.com",
  profile: {
    age: 30,
    city: "Lisbon",
    address: {
      street: "Augusta Street",
      zipCode: "1100-053"
    }
  },
  interests: [
    "programming",
    "music",
    "photography"
  ]
}
```

### Map and Set

```js
const permissions = new Map([
  ['admin', ['create', 'read', 'update', 'delete']],
  ['user', ['read']]
]);

const tags = new Set(['nodejs', 'debugging', 'opensource']);

const config = {
  permissions,
  tags,
  meta: {
    version: '1.0.0',
    environment: 'development'
  }
};

dump(config);
```

### Tree view

```js
dump(config, { view: 'tree' });
```

**Output:**
```
Object
├── permissions: Map(2)
│   ├── "admin" => Array(4)
│   │   ├── "create"
│   │   ├── "read"
│   │   ├── "update"
│   │   └── "delete"
│   └── "user" => Array(1)
│       └── "read"
├── tags: Set(3)
│   ├── "nodejs"
│   ├── "debugging"
│   └── "opensource"
└── meta: Object
    ├── version: "1.0.0"
    └── environment: "development"
```

## Circular and Shared References

`dumpkit` automatically detects both circular references and shared references.

### Circular Reference

Occurs when an object references itself, forming a cycle.

```js
const circular = { name: 'parent' };
circular.self = circular;

dump(circular);
```

**Output:**
```
{
  name: "parent",
  self: [Circular *1]
}
```

### Shared Reference

Occurs when the same object is referenced by multiple properties or objects.

```js
const shared = { name: 'shared', value: 42 };
const data = {
  first: shared,
  second: shared,
  third: shared
};

dump(data);
```

**Output:**
```
{
  first: {
    name: "shared",
    value: 42
  },
  second: [Shared *1],
  third: [Shared *1]
}
```

> `[Circular *1]` indicates a circular reference (the object references itself).  
> `[Shared *1]` indicates that the same object was already displayed earlier (in this case, in property `first`).

### Mixed example

```js
const shared = { value: 42 };
const circular = { name: 'circ' };
circular.self = circular;

const data = {
  sharedA: shared,
  sharedB: shared,
  circular: circular
};

dump(data);
```

**Output:**
```
{
  sharedA: {
    value: 42
  },
  sharedB: [Shared *1],
  circular: {
    name: "circ",
    self: [Circular *1]
  }
}
```

## Debugging with trace()

### Locate where code is failing

```js
function processOrder(order) {
  trace('process-order-start');
  
  if (!order.valid) {
    trace('invalid-order');
    return { error: 'Invalid order' };
  }
  
  trace('process-order-end');
  return { success: true };
}
```

### Show full stack

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

## Measuring Performance

### Synchronous operations

```js
function sortLargeArray() {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  return arr.sort();
}

const { result, measurement } = measure('sort-large-array', () => sortLargeArray());
console.log(`Time: ${measurement.durationMs}ms`);
```

### Asynchronous operations

```js
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  return response.json();
}

const { result, measurement } = await measure('fetch-users-api', () => fetchUsers());
console.log(`Time: ${measurement.durationMs}ms`);
```

### Compare different approaches

```js
// Approach 1: for loop
const { measurement: m1 } = measure('for-loop', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

// Approach 2: reduce
const { measurement: m2 } = measure('array-reduce', () => {
  const arr = Array.from({ length: 1000000 }, (_, i) => i);
  return arr.reduce((acc, val) => acc + val, 0);
});

console.log(`For-loop: ${m1.durationMs}ms, Reduce: ${m2.durationMs}ms`);
```

## Output Control

### Disable colors

```js
dump(object, { colors: false });
```

### Limit depth

```js
const deepData = { a: { b: { c: { d: { e: 'very deep' } } } } };

dump(deepData, { depth: 2 });
```

**Output:**
```
{
  a: {
    b: [Object]
  }
}
```

### Table view (array of objects)

```js
const users = [
  { name: 'Alice', age: 30, city: 'Lisbon' },
  { name: 'Bob', age: 25, city: 'Porto' }
];

dump(users, { view: 'table' });
```

**Output:**
```
name   | age | city
───────┼─────┼───────
Alice  | 30  | Lisbon
Bob    | 25  | Porto
```

### Clean output for testing

```js
import { inspect } from 'dumpkit';

// In a test file
const result = complexFunction();
const output = inspect(result, { colors: false });
expect(output).toContain('expected-value');
```

## Interactive Pause with dp()

```js
import { dp } from 'dumpkit';

async function debugProcess() {
  const data = { step: 1, status: 'processing' };
  await dp(data, { message: 'Check the data and press ENTER' });
  
  // After ENTER, continues
  console.log('Process continuing...');
}
```

## Programmatic Analysis with analyze()

```js
import { analyze } from 'dumpkit';

const data = { name: 'John', age: 30 };
const analysis = analyze(data);

console.log(analysis.type);           // 'object'
console.log(analysis.properties[0].key); // 'name'
```

## Integration with Logger

### Send debug to file

```js
import { inspect } from 'dumpkit';
import { writeFileSync } from 'fs';

const state = {
  timestamp: new Date().toISOString(),
  memory: process.memoryUsage(),
  uptime: process.uptime()
};

writeFileSync('debug.json', inspect(state, { colors: false }));
```

### Send tree format to file

```js
writeFileSync('tree.txt', inspect(state, { view: 'tree', colors: false }));
```

### Express middleware

```js
import { dump } from 'dumpkit';

app.use((req, res, next) => {
  dump({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query
  });
  next();
});
```

## Conditional Debugging

```js
const DEBUG = process.env.MY_APP_DEBUG === 'true';

function debugOnly(message, data) {
  if (DEBUG) {
    dump({ message, data, timestamp: new Date().toISOString() });
  }
}

debugOnly('Config loaded', config);
```

## Combine with console.time

```js
console.time('operation');
measure('measured-operation', () => heavyOperation());
console.timeEnd('operation');
// Both methods work side by side
```

## Redirect output to file

```js
import { createWriteStream } from 'fs';
const logStream = createWriteStream('./debug.log');

dump(data, { stream: logStream });
trace('checkpoint', { stream: logStream });
await measure('query', () => db.query(sql), { stream: logStream });
```