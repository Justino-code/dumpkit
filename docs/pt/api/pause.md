# dp()

> **⚠️ ATENÇÃO:** A função `dp()` atualmente impede o processo de terminar naturalmente após a última pausa. É necessário pressionar `Ctrl+C` para encerrar. Este problema será corrigido numa próxima versão. Como alternativa, pode usar `process.exit(0)` após a última chamada.

Pausa a execução do programa para inspeção interativa.

---

## Sintaxe

```ts
dp(valor: unknown, opcoes?: PauseOptions): Promise<unknown>
```

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser mostrado |
| `opcoes` | `PauseOptions` | Opções de configuração (opcional) |

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Estilo de visualização |
| `message` | `string` | `"Pressione ENTER para continuar..."` | Mensagem a mostrar |
| `timeout` | `number` | `0` | Tempo máximo em ms (0 = infinito) |
| `autoContinue` | `boolean` | `true` | Auto-continuar em CI/ambiente não TTY |
| `depth` | `number` | `30` | Profundidade máxima |
| `colors` | `boolean` | `auto` | Forçar cores |
| `stream` | `WriteStream` | `stderr` | Stream de saída |

## Retorno

Retorna uma Promise que resolve com o valor original quando a pausa terminar.

---

## Exemplos

### Uso básico

```js
await dp({ nome: 'João', idade: 30 });
```

**Saída:**
```
{
  nome: "João",
  idade: 30
}

Pressione ENTER para continuar... _
```

(Após pressionar ENTER, o programa continua)

### Com mensagem personalizada

```js
await dp(dados, { message: 'Verifique os dados e pressione ENTER' });
```

**Saída:**
```
{
  status: "processando",
  etapa: 2
}

Verifique os dados e pressione ENTER _
```

### Com timeout

```js
await dp(user, { timeout: 5000 });
```

**Saída:**
```
{
  nome: "João",
  idade: 30
}

Pressione ENTER para continuar... _ (ou continua após 5 segundos)
```

### Vista em árvore

```js
const dados = {
  nome: 'João',
  endereco: { cidade: 'Lisboa' }
};

await dp(dados, { view: 'tree' });
```

**Saída:**
```
Object
├── nome: "João"
└── endereco: Object
    └── cidade: "Lisboa"

Pressione ENTER para continuar... _
```

### Vista em tabela

```js
const usuarios = [
  { nome: 'Alice', idade: 30 },
  { nome: 'Bob', idade: 25 }
];

await dp(usuarios, { view: 'table' });
```

**Saída:**
```
nome   | idade
───────┼───────
Alice  | 30
Bob    | 25

Pressione ENTER para continuar... _
```

### Sem cores

```js
await dp(user, { colors: false });
```

**Saída (sem códigos ANSI):**
```
{
  nome: "João",
  idade: 30
}

Pressione ENTER para continuar... _
```

### Redirecionar para ficheiro

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

await dp(user, { stream });
// O output é escrito no ficheiro debug.log
// A mensagem de pausa continua no terminal
```

---

## Combinação com trace

Para depurar com stack trace antes da pausa:

```js
trace('checkpoint-antes-da-pausa');
await dp(valor);
```

## Comportamento em CI

Em ambientes não interativos (CI, GitHub Actions, produção), a função **continua automaticamente** sem pausar.

```js
await dp(user); // Não bloqueia em CI
```

**Saída em CI:**
```
{
  nome: "João",
  idade: 30
}

[dp] Non-interactive environment detected. Continuing automatically...
```

---

## Problemas conhecidos

### Processo não termina naturalmente após `dp()`

Atualmente, após a última chamada `dp()`, o processo não termina sozinho – é necessário pressionar `Ctrl+C`. Este comportamento será corrigido numa versão futura.

**Solução temporária:**
```js
await dp(ultimoValor);
process.exit(0);
```

---

## Dicas

- Usa `dp()` para inspecionar valores interativamente
- Combina com `trace()` para ver onde estás no código
- Define `timeout` para evitar bloqueios em produção
- Usa `autoContinue: false` para forçar pausa mesmo em CI
- Usa `view: 'tree'` para estruturas aninhadas
- Usa `view: 'table'` para arrays de objetos
