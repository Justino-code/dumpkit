# Exemplos

## Estruturas de Dados Complexas

### Objetos Aninhados

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

**Saída (vista flat):**
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

### Map e Set

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

### Vista em árvore

```js
dump(config, { view: 'tree' });
```

**Saída:**
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

## Referências Circulares e Partilhadas

A `dumpkit` detecta automaticamente tanto referências circulares como referências partilhadas.

### Referência Circular

Ocorre quando um objeto faz referência a si próprio, formando um ciclo.

```js
const circular = { name: 'parent' };
circular.self = circular;

dump(circular);
```

**Saída:**
```
{
  name: "parent",
  self: [Circular *1]
}
```

### Referência Partilhada

Ocorre quando o mesmo objeto é referenciado por múltiplas propriedades ou objetos.

```js
const shared = { name: 'shared', value: 42 };
const data = {
  first: shared,
  second: shared,
  third: shared
};

dump(data);
```

**Saída:**
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

> `[Circular *1]` indica uma referência circular (o objeto referencia-se a si próprio).  
> `[Shared *1]` indica que o mesmo objeto já foi exibido anteriormente (neste caso, na propriedade `first`).

### Exemplo misto

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

**Saída:**
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

## Debugging com trace()

### Localizar onde o código está a falhar

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

### Mostrar stack completo

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
// Mostra toda a cadeia de chamadas
```

## Medir Performance

### Operações síncronas

```js
function sortLargeArray() {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  return arr.sort();
}

const { result, measurement } = measure('sort-large-array', () => sortLargeArray());
console.log(`Tempo: ${measurement.durationMs}ms`);
```

### Operações assíncronas

```js
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  return response.json();
}

const { result, measurement } = await measure('fetch-users-api', () => fetchUsers());
console.log(`Tempo: ${measurement.durationMs}ms`);
```

### Comparar diferentes abordagens

```js
// Abordagem 1: for loop
const { measurement: m1 } = measure('for-loop', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

// Abordagem 2: reduce
const { measurement: m2 } = measure('array-reduce', () => {
  const arr = Array.from({ length: 1000000 }, (_, i) => i);
  return arr.reduce((acc, val) => acc + val, 0);
});

console.log(`For-loop: ${m1.durationMs}ms, Reduce: ${m2.durationMs}ms`);
```

## Controlo de Output

### Desligar cores

```js
dump(object, { colors: false });
```

### Limitar profundidade

```js
const deepData = { a: { b: { c: { d: { e: 'very deep' } } } } };

dump(deepData, { depth: 2 });
```

**Saída:**
```
{
  a: {
    b: [Object]
  }
}
```

### Vista em tabela (array de objetos)

```js
const users = [
  { name: 'Alice', age: 30, city: 'Lisbon' },
  { name: 'Bob', age: 25, city: 'Porto' }
];

dump(users, { view: 'table' });
```

**Saída:**
```
name   | age | city
───────┼─────┼───────
Alice  | 30  | Lisbon
Bob    | 25  | Porto
```

### Output limpo para testes

```js
import { inspect } from 'dumpkit';

// Num ficheiro de teste
const result = complexFunction();
const output = inspect(result, { colors: false });
expect(output).toContain('expected-value');
```

## Pausa Interativa com dp()

```js
import { dp } from 'dumpkit';

async function debugProcess() {
  const data = { step: 1, status: 'processing' };
  await dp(data, { message: 'Verifique os dados e pressione ENTER' });
  
  // Após ENTER, continua
  console.log('Processo continuando...');
}
```

## Análise Programática com analyze()

```js
import { analyze } from 'dumpkit';

const data = { name: 'John', age: 30 };
const analysis = analyze(data);

console.log(analysis.type);           // 'object'
console.log(analysis.properties[0].key); // 'name'
```

## Integração com Logger

### Enviar debug para ficheiro

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

### Enviar para ficheiro com formato árvore

```js
writeFileSync('tree.txt', inspect(state, { view: 'tree', colors: false }));
```

### Middleware para Express

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

## Debugging Condicional

```js
const DEBUG = process.env.MY_APP_DEBUG === 'true';

function debugOnly(message, data) {
  if (DEBUG) {
    dump({ message, data, timestamp: new Date().toISOString() });
  }
}

debugOnly('Config loaded', config);
```

## Combinar com console.time

```js
console.time('operation');
measure('measured-operation', () => heavyOperation());
console.timeEnd('operation');
// Ambos os métodos funcionam lado a lado
```

## Redirecionar output para ficheiro

```js
import { createWriteStream } from 'fs';
const logStream = createWriteStream('./debug.log');

dump(data, { stream: logStream });
trace('checkpoint', { stream: logStream });
await measure('query', () => db.query(sql), { stream: logStream });
```