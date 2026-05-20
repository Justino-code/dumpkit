# Utilitários

O dumpkit expõe algumas utilidades internas para casos de uso avançados.

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

Deteta referências circulares em objetos.

### Sintaxe

```ts
class CircularDetector {
  has(obj: object): boolean;
  add(obj: object, path: string): number;
  get(obj: object, currentPath: string): { marker: string; refId: number; originalPath: string };
  reset(): void;
}
```

### Métodos

| Método | Descrição |
|--------|-----------|
| `has(obj)` | Verifica se objeto já foi visto |
| `add(obj, path)` | Regista um novo objeto |
| `get(obj, currentPath)` | Obtém info circular |
| `reset()` | Limpa o detector |

### Exemplo

```js
import { CircularDetector } from 'dumpkit/utils';

const detector = new CircularDetector();
const obj = { nome: 'teste' };

detector.add(obj, 'root');
console.log(detector.has(obj)); // true

const info = detector.get(obj, 'current');
console.log(info.marker); // [Circular *1]
```

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