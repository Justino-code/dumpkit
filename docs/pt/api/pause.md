# dp()

Pausa a execução do programa para inspeção interativa.

## dp()

Mostra um valor e pausa a execução até o utilizador pressionar ENTER.

### Sintaxe

```ts
dp(valor: unknown, opcoes?: PauseOptions): Promise<unknown>
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser mostrado |
| `opcoes` | `PauseOptions` | Opções de configuração (opcional) |

### Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `message` | `string` | `"Pressione ENTER para continuar..."` | Mensagem a mostrar |
| `timeout` | `number` | `0` | Tempo máximo em ms (0 = infinito) |
| `autoContinue` | `boolean` | `true` | Auto-continuar em CI/ambiente não TTY |
| `depth` | `number` | `30` | Profundidade máxima |
| `colors` | `boolean` | `auto` | Forçar cores |
| `stream` | `WriteStream` | `stderr` | Stream de saída |

### Retorno

Retorna uma Promise que resolve com o valor original quando a pausa terminar.

### Exemplos

#### Uso básico

```js
await dp(user);
// Mostra o user e aguarda ENTER
```

#### Com mensagem personalizada

```js
await dp(dados, { message: 'Verifique os dados e pressione ENTER' });
```

#### Com timeout

```js
await dp(user, { timeout: 5000 });
// Continua automaticamente após 5 segundos
```

#### Sem cores

```js
await dp(user, { colors: false });
```

## Combinação com trace

Para obter o comportamento do antigo `dpp()`, combine `trace()` com `dp()`:

```js
trace('meu-ponto');
await dp(valor);
```

Ou com stack completo:

```js
trace('meu-ponto', { showStack: true });
await dp(valor);
```

## Comportamento em CI

Em ambientes não interativos (CI, GitHub Actions, produção), a função **continua automaticamente** sem pausar.

```js
await dp(user); // Não bloqueia em CI
```

## Exemplos práticos

### Debugging interativo

```js
import { trace, dp } from 'dumpkit';

async function processarPedido(pedido) {
  trace('pedido-recebido', { showStack: true });
  await dp(pedido);
  
  const resultado = await api.processar(pedido);
  await dp(resultado, { message: 'Resultado obtido. Continuar?' });
  
  return resultado;
}
```

### Com timeout para evitar bloqueio

```js
await dp(dados, { 
  timeout: 10000,
  message: 'Verifique os dados. Continuando em 10s...' 
});
```

### Redirecionar para ficheiro

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

await dp(user, { stream });
```

## Dicas

- Usa `dp()` para inspecionar valores interativamente
- Combina com `trace()` para ver onde estás no código
- Define `timeout` para evitar bloqueios em produção
- Usa `autoContinue: false` para forçar pausa mesmo em CI