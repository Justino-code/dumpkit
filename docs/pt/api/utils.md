# Utilitários

A `dumpkit` expõe algumas utilidades internas para casos de uso avançados.

## shouldUseColors()

Determina se as cores devem ser usadas no output.

### Sintaxe

```ts
shouldUseColors(forceColor?: boolean): boolean
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `forceColor` | `boolean` | `true` = forçar cores, `false` = sem cores, `undefined` = auto |

### Retorno

Retorna `true` se as cores devem ser usadas, `false` caso contrário.

### Exemplo

```js
import { shouldUseColors } from 'dumpkit/utils';

if (shouldUseColors()) {
  console.log('Terminal suporta cores');
}
```

---

## colorize()

Aplica cores ANSI a uma string.

### Sintaxe

```ts
colorize(str: string, color: string | ColorKey, useColors: boolean): string
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `str` | `string` | String a colorir |
| `color` | `string \| ColorKey` | Cor ANSI ou chave de cor |
| `useColors` | `boolean` | Se deve aplicar cores |

### Retorno

String colorida se `useColors` for `true`, senão a string original.

### Exemplo

```js
import { colorize, COLORS } from 'dumpkit/utils';

const vermelho = colorize('Erro!', COLORS.red, true);
console.log(vermelho);
```

---

## COLORS

Objeto com códigos ANSI para cores.

### Cores disponíveis

| Chave | Cor |
|-------|-----|
| `reset` | Reset |
| `bold` | Negrito |
| `dim` | Atenuado |
| `red` | Vermelho |
| `green` | Verde |
| `yellow` | Amarelo |
| `blue` | Azul |
| `cyan` | Ciano |
| `magenta` | Magenta |
| `gray` | Cinza |

### Exemplo

```js
import { COLORS } from 'dumpkit/utils';

console.log(`${COLORS.red}Erro${COLORS.reset}: ${mensagem}`);
```

---

## CircularDetector

Deteta referências **circulares** e **partilhadas** durante a travessia de objetos.

### Sintaxe

```ts
class CircularDetector {
  enter(obj: object, path: string): { id: number; isCircular: boolean; isShared: boolean; originalPath?: string };
  leave(obj: object): void;
  reset(): void;
  has(obj: object): boolean;
  getRefId(obj: object): number;
  getOriginalPath(obj: object): string;
}
```

### Métodos

| Método | Descrição |
|--------|-----------|
| `enter(obj, path)` | Regista a entrada num objeto. Retorna estado (circular, partilhado ou novo) |
| `leave(obj)` | Remove o objeto da pilha após processar os seus filhos |
| `reset()` | Limpa o detector para uma nova travessia |
| `has(obj)` | Verifica se o objeto já foi visitado |
| `getRefId(obj)` | Obtém o ID único do objeto |
| `getOriginalPath(obj)` | Obtém o caminho original onde o objeto foi encontrado |

### Exemplo

```js
import { CircularDetector } from 'dumpkit/utils';

const detector = new CircularDetector();

const shared = { valor: 42 };
const obj = { a: shared, b: shared };

// Primeira visita: objeto novo
const result1 = detector.enter(shared, 'obj.a');
console.log(result1.isCircular); // false
console.log(result1.isShared);   // false
console.log(result1.id);         // 1

detector.leave(shared);

// Segunda visita: objeto partilhado
const result2 = detector.enter(shared, 'obj.b');
console.log(result2.isShared);   // true
console.log(result2.originalPath); // 'obj.a'

// Referência circular
const circular = {};
detector.enter(circular, 'root');
const result3 = detector.enter(circular, 'root.self');
console.log(result3.isCircular); // true
```

### Deteção de referências

| Tipo | Condição | Exemplo |
|------|----------|---------|
| **Novo objeto** | Primeira vez que o objeto é encontrado | `{ valor: 42 }` |
| **Circular** | Objeto já está na pilha atual de processamento | `obj.self = obj` |
| **Partilhado** | Objeto já foi visitado noutro ramo da árvore | `{ a: shared, b: shared }` |

---

## getCallerLocation()

Obtém a localização de quem chamou a função atual.

### Sintaxe

```ts
getCallerLocation(depth?: number): StackFrame | null
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `depth` | `number` | Quantos níveis subir (padrão: 1) |

### Retorno

Objeto `StackFrame` ou `null` se não encontrar.

### Exemplo

```js
import { getCallerLocation } from 'dumpkit/utils';

function meuLogger() {
  const caller = getCallerLocation(1);
  console.log(`Chamado de: ${caller.file}:${caller.line}`);
}
```

## StackFrame

Estrutura de um frame da stack.

```ts
type StackFrame = {
  file: string;         // Caminho do ficheiro
  line: number;         // Número da linha
  column: number;       // Número da coluna
  functionName: string; // Nome da função
  raw: string;          // Linha raw original
};
```