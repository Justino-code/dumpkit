# dump() & dd()

## dump()

Mostra um valor formatado no terminal.

### Sintaxe

```ts
dump(valor: unknown, opcoes?: DumpOptions): unknown
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser mostrado |
| `opcoes` | `DumpOptions` | Opções de configuração (opcional) |

### Retorno

Retorna o `valor` original inalterado - permite encadeamento.

### Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Estilo de visualização |
| `depth` | `number` | `30` | Profundidade máxima de aninhamento |
| `colors` | `boolean` | `auto` | `true` = cores ligadas, `false` = desligadas, `auto` = baseado no TTY |
| `showHidden` | `boolean` | `false` | Mostrar propriedades não enumeráveis |
| `maxArrayLength` | `number` | `1000` | Máximo de itens do array a mostrar |
| `maxStringLength` | `number` | `5000` | Comprimento máximo da string |
| `indent` | `number` | `2` | Espaços por nível de indentação |
| `stream` | `WriteStream` | `stderr` | Stream de saída |

### Exemplos

#### Uso básico (vista flat)

```js
dump({ nome: 'João', idade: 30 });
```

**Saída:**
```
{
  nome: "João",
  idade: 30
}
```

#### Vista em árvore

```js
const dados = {
  nome: 'João',
  endereco: {
    cidade: 'Lisboa',
    rua: 'Augusta'
  }
};

dump(dados, { view: 'tree' });
```

**Saída:**
```
Object
├── nome: "João"
└── endereco: Object
    ├── cidade: "Lisboa"
    └── rua: "Augusta"
```

#### Vista em tabela (array de objetos)

```js
const usuarios = [
  { nome: 'Alice', idade: 30, cidade: 'Lisboa' },
  { nome: 'Bob', idade: 25, cidade: 'Porto' }
];

dump(usuarios, { view: 'table' });
```

**Saída:**
```
nome   | idade | cidade
───────┼───────┼────────
Alice  | 30    | Lisboa
Bob    | 25    | Porto
```

#### Com profundidade limitada

```js
const profundo = { a: { b: { c: { d: 'fundo' } } } };
dump(profundo, { depth: 2 });
```

**Saída:**
```
{
  a: {
    b: [Object]
  }
}
```

#### Sem cores

```js
dump({ erro: 'Falha' }, { colors: false });
```

**Saída (sem códigos ANSI):**
```
{
  erro: "Falha"
}
```

#### Encadeamento

```js
const resultado = dump(user).processar();
// O valor de user é mostrado, depois processar() é chamado
```

#### Stream personalizado

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');
dump(dados, { stream });
// O output é escrito no ficheiro debug.log
```

---

## dd()

Dump and die - mostra o valor e termina o processo.

### Sintaxe

```ts
dd(valor: unknown, opcoes?: DumpOptions): never
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser mostrado |
| `opcoes` | `DumpOptions` | Opções de configuração (opcional) |

### Retorno

Nunca retorna - chama `process.exit(1)`.

### Exemplos

#### Uso básico

```js
function handler(req) {
  dd(req);
  // Este código nunca é executado
}
```

**Saída:**
```
{
  method: "GET",
  url: "/api/users"
}
```
(O processo termina após a saída)

#### Debugging condicional

```js
if (erro) {
  dd({ erro, contexto: 'falha-na-api' });
}
```

---

## Diferenças entre dump() e dd()

| Função | Output | Continua execução? |
|--------|--------|-------------------|
| `dump()` | Mostra o valor | ✅ Sim |
| `dd()` | Mostra o valor | ❌ Não (process.exit) |

## Dicas

- Usa `dump()` para inspecionar valores durante o fluxo normal
- Usa `dd()` para parar a execução num ponto específico
- Usa `view: 'tree'` para compreender estruturas aninhadas
- Usa `view: 'table'` para arrays de objetos homogéneos
- O encadeamento com `dump()` permite debug não intrusivo:

```js
const resultado = dump(processar(dados)).transformar();
// O valor de processar(dados) é mostrado, mas transformar() ainda é chamado
```