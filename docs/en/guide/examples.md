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

## Circular References

nodedump automatically handles objects that reference themselves:

```js
const person = { name: 'John' };
const company = { name: 'TechCorp', owner: person };
person.company = company;  // Circular reference!

dump(person);
// Output: { name: "John", company: { name: "TechCorp", owner: [Circular *1] } }
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

const sorted = measure('sort-large-array', () => sortLargeArray());
```

### Asynchronous operations

```js
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  return response.json();
}

const users = await measure('fetch-users-api', () => fetchUsers());
```

### Compare different approaches

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

## Output Control

### Disable colors

```js
dump(object, { colors: false });
```

### Limit depth

```js
const deepData = { a: { b: { c: { d: { e: 'very deep' } } } } };

dump(deepData, { depth: 2 });
// Output: { a: { b: [Object] } }
```

### Clean output for testing

```js
import { inspect } from 'nodedump';

// In a test file
const result = complexFunction();
const output = inspect(result, { colors: false });
expect(output).toContain('expected-value');
```

## Integration with Logger

### Send debug to file

```js
import { inspect } from 'nodedump';
import { writeFileSync } from 'fs';

const state = {
  timestamp: new Date().toISOString(),
  memory: process.memoryUsage(),
  uptime: process.uptime()
};

writeFileSync('debug.json', inspect(state, { colors: false }));
```

### Express middleware

```js
import { dump } from 'nodedump';

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