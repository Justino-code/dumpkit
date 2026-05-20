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
| `depth` | `number` | `30` | Profundidade máxima de aninhamento |
| `colors` | `boolean` | `auto` | `true` = cores ligadas, `false` = desligadas, `auto` = baseado no TTY |
| `showHidden` | `boolean` | `false` | Mostrar propriedades não enumeráveis |
| `maxArrayLength` | `number` | `1000` | Máximo de itens do array a mostrar |
| `maxStringLength` | `number` | `5000` | Comprimento máximo da string |
| `indent` | `number` | `2` | Espaços por nível de indentação |
| `stream` | `WriteStream` | `stderr` | Stream de saída |

### Exemplos

#### Uso básico

```js
dump({ nome: 'João', idade: 30 });
```

#### Com opções

```js
dump(obj, { depth: 2, colors: false });
```

#### Encadeamento

```js
const resultado = dump(user).processar();
```

#### Stream personalizado

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');
dump(dados, { stream });
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
  dd(req); // Mostra o request e para
  // Este código nunca é executado
}
```

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
- O encadeamento com `dump()` permite debug não intrusivo:

```js
const resultado = dump(processar(dados)).transformar();
// O valor de processar(dados) é mostrado, mas transformar() ainda é chamado
```