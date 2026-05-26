# analyze()

O núcleo semântico da `dumpkit`. A função `analyze()` percorre qualquer valor em runtime e constrói uma **árvore de análise rica e independente de formatação** – não é uma string, mas sim uma estrutura de dados que representa a forma interna do valor.

Esta árvore pode ser usada programaticamente para compreender a estrutura dos dados, detectar referências circulares ou partilhadas, e servir de base para diferentes visualizações (`flat`, `tree`, `table`).

---

## Sintaxe

```ts
analyze(valor: unknown, opcoes?: AnalyzeOptions): AnalysisNode
```

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser analisado |
| `opcoes` | `AnalyzeOptions` | Opções de configuração (profundidade, limites, etc.) |

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `depth` | `number` | `30` | Profundidade máxima de análise |
| `maxArrayLength` | `number` | `1000` | Número máximo de itens de array analisados |
| `maxStringLength` | `number` | `5000` | Comprimento máximo de string |
| `maxProperties` | `number` | `200` | Número máximo de propriedades de objeto |
| `showHidden` | `boolean` | `false` | Incluir propriedades não enumeráveis e símbolos |

## Retorno – `AnalysisNode`

A `AnalysisNode` é um nó de uma árvore que descreve semanticamente o valor. Cada nó possui uma propriedade `type`, que pode ser:

| Tipo | Descrição |
|------|-----------|
| `primitive` | Valores primitivos (string, número, booleano, null, undefined, bigint, symbol) |
| `object` | Objetos (com `className`, `properties` e flag `truncated`) |
| `array` | Arrays (com `length`, `items` e `truncated`) |
| `map` | Map (com `size`, `entries` e `truncated`) |
| `set` | Set (com `size`, `values` e `truncated`) |
| `date` | Date (com `isValid` e `value` ISO) |
| `error` | Error (com `name` e `message`) |
| `regexp` | RegExp (com `source` e `flags`) |
| `function` | Função (com `name`) |
| `typedarray` | TypedArray (com `className`, `items` e `truncated`) |
| `weakmap` | WeakMap (apenas tipo) |
| `weakset` | WeakSet (apenas tipo) |
| `promise` | Promise (apenas tipo) |
| `circular` | Referência circular detectada |
| `shared` | Objeto partilhado (referenciado múltiplas vezes) |

## Exemplos

### Análise programática

```js
import { analyze } from 'dumpkit';

const user = {
  name: 'João',
  age: 30,
  tags: ['admin', 'user']
};

const analysis = analyze(user);
console.log(analysis.type);                // 'object'
console.log(analysis.properties.length);   // 3
console.log(analysis.properties[0].key);   // 'name'
```

### Deteção de referências circulares

```js
const circular = {};
circular.self = circular;

const analysis = analyze(circular);
// analysis.properties[0].value.type === 'circular'
// analysis.properties[0].value.refId === 1
```

### Limitar profundidade

```js
const deep = { a: { b: { c: 'valor' } } };
const shallow = analyze(deep, { depth: 1 });
// shallow.properties[0].value.type === 'object' (não expandido)
```

### Objecto partilhado

```js
const shared = { x: 1 };
const data = { a: shared, b: shared };

const analysis = analyze(data);
// analysis.properties[0].value.type === 'object'
// analysis.properties[1].value.type === 'shared'
// analysis.properties[1].value.refId === 1
```

## Porquê usar `analyze()`?

- **Compreensão estrutural** – obtenha programaticamente a estrutura de qualquer valor
- **Extensibilidade** – crie os seus próprios visualizadores em cima da análise
- **Performance** – análise isolada da formatação (pode ser cacheada)
- **Deteção avançada** – identifique referências circulares e partilhadas

## Veja também

- [`inspect()`](./inspect) – formata valores para string usando diferentes visualizações
- [`dump()`](./dump) – imprime valores com suporte a `flat`, `tree` e `table`