# trace()

Mostra o ponto atual de execução no código.

## Sintaxe

```ts
trace(rotulo?: string, opcoes?: TraceOptions): void
```

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `rotulo` | `string` | Identificador opcional para este ponto de rastreamento |
| `opcoes` | `TraceOptions` | Opções de configuração (opcional) |

## Retorno

Não retorna valor (`void`).

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `colors` | `boolean` | `auto` | `true` = cores ligadas, `false` = desligadas, `auto` = baseado no TTY |
| `showStack` | `boolean` | `false` | Mostrar stack trace completo |
| `stream` | `WriteStream` | `stderr` | Stream de saída |

## Exemplos

### Uso básico

```js
function autenticar() {
  trace();
  // Output: [Trace] at src/auth.ts:42:12
}
```

### Com rótulo

```js
function login() {
  trace('login-inicio');
  // Output: [Trace] login-inicio at src/auth.ts:42:12
}
```

### Stack completo

```js
function nivel3() {
  trace('chamada-profunda', { showStack: true });
}

function nivel2() {
  nivel3();
}

function nivel1() {
  nivel2();
}

nivel1();
// Mostra toda a cadeia de chamadas
```

### Debugging condicional

```js
function processarPedido(pedido) {
  if (!pedido.valido) {
    trace('pedido-invalido', { showStack: true });
    return { erro: 'Pedido inválido' };
  }
  
  trace('pedido-validado');
  // ... processamento
}
```

### Redirecionar para ficheiro

```js
import { createWriteStream } from 'fs';
const stream = createWriteStream('./debug.log');

trace('checkpoint', { stream });
// Output escrito no ficheiro debug.log
```

## Casos de uso

| Situação | Como usar |
|----------|-----------|
| Verificar se uma função foi chamada | `trace('aqui')` |
| Descobrir quem chamou uma função | `trace('chamado', { showStack: true })` |
| Mapear fluxo de execução | `trace('passo-1')`, `trace('passo-2')` |
| Debugging de eventos | `trace('evento-click')` |

## Output examples

### Sem rótulo
```
[Trace] at src/user/controller.ts:24:8
```

### Com rótulo
```
[Trace] auth-checkpoint at src/user/controller.ts:24:8
```

### Com stack completo
```
[Trace] deep-call at src/nested.ts:15:10
Stack trace:
  at nivel3 (src/nested.ts:15:10)
  at nivel2 (src/nested.ts:19:3)
  at nivel1 (src/nested.ts:23:3)
  at Object.<anonymous> (src/index.ts:10:1)
```

## Dicas

- Usa `trace()` para entender o fluxo do código
- Adiciona rótulos descritivos para identificar pontos específicos
- `showStack` é útil para perceber a cadeia de chamadas
- Remove os `trace()` antes de fazer deploy para produção (ou usa condicionais)
- Usa a opção `stream` para redirecionar logs para ficheiro