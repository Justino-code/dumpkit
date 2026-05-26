# Combinações

A `dumpkit` não impõe limites à sua criatividade. Todas as funções são **independentes e puras** – podem ser usadas em qualquer ordem, dentro de condicionais, ciclos, ou combinadas com código nativo do Node.js.

As combinações listadas abaixo são apenas **exemplos** para ilustrar o espírito de composição da biblioteca. Na prática, pode criar inúmeras outras.

---

## Exemplos de combinações

### Dump com stack trace

```js
dump(valor);
trace();
```

### Dump com timing

```js
const { result } = measure('operação', () => fn());
dump(result);
```

### Dump com vista em árvore

```js
dump(estrutura, { view: 'tree' });
```

### Dump com vista em tabela

```js
dump(usuarios, { view: 'table' });
```

### Dump e pausa

```js
await dp(valor);
```

### Dump, stack e pausa

```js
trace();
await dp(valor);
```

### Dump e parar com stack

```js
trace();
dd(valor);
```

### Medir tempo e parar

```js
const { result } = measure('operação', () => fn());
dd(result);
```

### Inspecionar sem cores e guardar

```js
const str = inspect(objeto, { colors: false });
fs.writeFileSync('debug.json', str);
```

### Guardar árvore em ficheiro

```js
const treeStr = inspect(estrutura, { view: 'tree', colors: false });
fs.writeFileSync('arvore.txt', treeStr);
```

### Análise programática

```js
const analysis = analyze(dados);
console.log(analysis.type);
console.log(analysis.properties.length);
```

### Detetar referências circulares

```js
const analysis = analyze(objeto);
const isCircular = analysis.properties.some(p => p.value.type === 'circular');
```

### Múltiplos valores no dump

Atualmente, para mostrar vários valores, agrupe‑os num objeto:

```js
dump({ v1, v2, v3 });
```

### Combinar com código nativo

```js
// Dump condicional
if (process.env.DEBUG) dump(dados);

// Acumular medições
const m1 = measure('A', fnA).measurement;
const m2 = measure('B', fnB).measurement;
dump({ m1, m2 });

// Redirecionar para ficheiro
const stream = createWriteStream('./debug.log');
trace('checkpoint', { stream });
await measure('consulta', () => db.query(sql), { stream });
```

---

## Tabela de combinações

| Nome | Descrição | Código |
|------|-----------|--------|
| `ddd` | Dump com stack trace | `dump(valor); trace()` |
| `ddt` | Dump com timing | `dump(measure('op', () => fn()).result)` |
| `ddtv` | Dump com timing e vista árvore | `dump(measure('op', () => fn()).result, { view: 'tree' })` |
| `dp` | Dump e pausa | `await dp(valor)` |
| `dpp` | Dump, stack e pausa | `trace(); await dp(valor)` |
| `ddds` | Dump, stack e parar | `trace(); dd(valor)` |
| `ddts` | Timing e parar | `dd(measure('op', () => fn()).result)` |
| `dds` | Dump silencioso (sem cores) | `dump(obj, { colors: false })` |
| `ddp` | Dump com profundidade limitada | `dump(obj, { depth: 2 })` |
| `dda` | Dump com limite de array | `dump(arr, { maxArrayLength: 20 })` |
| `tdd` | Trace com stack completo | `trace('ponto', { showStack: true })` |
| `id` | Inspecionar e guardar | `fs.writeFileSync('log', inspect(obj, { colors: false }))` |
| `cd` | Dump condicional | `if (debug) dump(dados)` |
| `cm` | Comparar medições | `const a = measure('A', fnA).measurement; const b = measure('B', fnB).measurement; dump({ a, b })` |
| `tree` | Vista em árvore | `dump(obj, { view: 'tree' })` |
| `table` | Vista em tabela | `dump(arr, { view: 'table' })` |
| `analyze` | Análise programática | `const analysis = analyze(obj)` |

---

## Conclusão

As **7 funções base** – `dump`, `dd`, `dp`, `inspect`, `trace`, `measure`, `analyze` – formam um pequeno vocabulário. Com elas, pode **combinar infinitamente** para resolver qualquer necessidade de debug.

A documentação apenas sugere alguns padrões úteis, **não uma lista exaustiva**. Sinta‑se à vontade para criar as suas próprias combinações e partilhá‑las com a comunidade.