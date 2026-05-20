# measure()

Mede o tempo de execução de funções síncronas ou assíncronas.

## Sintaxe

```ts
measure(rotulo: string, fn: () => T, opcoes?: MeasureOptions): T
measure(rotulo: string, fn: () => Promise<T>, opcoes?: MeasureOptions): Promise<T>
```

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `rotulo` | `string` | Identificador para esta medição |
| `fn` | `() => T` ou `() => Promise<T>` | Função a ser medida |
| `opcoes` | `MeasureOptions` | Opções de configuração (opcional) |

## Retorno

Retorna o mesmo valor que a função medida retorna (ou Promise).

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `colors` | `boolean` | `auto` | `true` = cores ligadas, `false` = desligadas, `auto` = baseado no TTY |

## Exemplos

### Função síncrona

```js
function ordenarArray() {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  return arr.sort();
}

const resultado = measure('ordenacao', () => ordenarArray());
// Output: [Measure] ordenacao: 12.34ms
```

### Função assíncrona

```js
async function buscarUsuarios() {
  const response = await fetch('https://api.exemplo.com/usuarios');
  return response.json();
}

const usuarios = await measure('busca-api', () => buscarUsuarios());
// Output: [Measure] busca-api: 145.67ms
```

### Sem cores

```js
measure('operacao', fn, { colors: false });
```

### Comparar duas abordagens

```js
// Abordagem 1: for loop
measure('for-loop', () => {
  let soma = 0;
  for (let i = 0; i < 1000000; i++) {
    soma += i;
  }
  return soma;
});

// Abordagem 2: reduce
measure('array-reduce', () => {
  const arr = Array.from({ length: 1000000 }, (_, i) => i);
  return arr.reduce((acc, val) => acc + val, 0);
});
```

## Formatação do tempo

O output formata automaticamente a duração:

| Duração | Formato | Exemplo |
|---------|---------|---------|
| < 1ms | microssegundos (µs) | `42.50µs` |
| < 1s | milissegundos (ms) | `234.56ms` |
| ≥ 1s | segundos (s) | `1.23s` |

## Tratamento de erros

Os erros são propagados enquanto o tempo é medido:

```js
try {
  measure('falha', () => {
    throw new Error('Algo correu mal');
  });
} catch (erro) {
  // O erro é lançado, mas a medição ainda é registada
  console.error('Erro capturado:', erro);
}
// Output: [Measure] falha: 0.05ms (mesmo com erro)
```

## Dicas

- Usa `measure()` para identificar bottlenecks de performance
- Compara diferentes implementações da mesma funcionalidade
- Remove `measure()` antes do deploy em produção (ou usa condicionais)
- Para operações muito rápidas (< 1ms), o output mostra em microssegundos