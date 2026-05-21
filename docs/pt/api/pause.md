# dp() e dpp()

Pausam a execução do programa para inspeção interativa.

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
| `depth` | `number` | `4` | Profundidade máxima |
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

## dpp()

Mostra um valor, exibe o stack trace e pausa a execução.

### Sintaxe

```ts
dpp(valor: unknown, opcoes?: PauseWithTraceOptions): Promise<unknown>
```

### Opções adicionais

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `label` | `string` | `"pause"` | Rótulo para o trace |
| `showStack` | `boolean` | `true` | Mostrar stack completo |

### Exemplos

#### Uso básico

```js
await dpp(user);
// Mostra user, stack trace e aguarda ENTER
```

#### Com rótulo personalizado

```js
await dpp(user, { label: 'auth-checkpoint' });
```

#### Desativar stack completo

```js
await dpp(user, { showStack: false });
```

## Comportamento em CI

Em ambientes não interativos (CI, GitHub Actions, produção), a função **continua automaticamente** sem pausar.

```js
await dp(user); // Não bloqueia em CI
```

## Exemplos práticos

### Debugging interativo

```js
import { dp, dpp } from 'dumpkit';

async function processarPedido(pedido) {
  await dpp(pedido, { label: 'pedido-recebido' });
  
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

## Diferenças entre dp() e dpp()

| Função | Mostra valor | Mostra stack | Pausa |
|--------|--------------|--------------|-------|
| `dp()` | ✅ | ❌ | ✅ |
| `dpp()` | ✅ | ✅ | ✅ |