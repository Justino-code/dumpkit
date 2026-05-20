# inspect()

Retorna uma string formatada de um valor sem imprimir.

## Sintaxe

```ts
inspect(valor: unknown, opcoes?: InspectOptions): string
```

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valor` | `unknown` | O valor a ser inspecionado |
| `opcoes` | `InspectOptions` | Opções de configuração (opcional) |

## Retorno

Retorna uma string formatada pronta para ser usada como desejar.

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `depth` | `number` | `4` | Profundidade máxima de aninhamento |
| `colors` | `boolean` | `auto` | `true` = cores ligadas, `false` = desligadas, `auto` = baseado no TTY |
| `showHidden` | `boolean` | `false` | Mostrar propriedades não enumeráveis |
| `maxArrayLength` | `number` | `100` | Máximo de itens do array a mostrar |
| `maxStringLength` | `number` | `1000` | Comprimento máximo da string |
| `indent` | `number` | `2` | Espaços por nível de indentação |

## Exemplos

### Uso básico

```js
const output = inspect({ nome: 'João', idade: 30 });
console.log(output);
// { nome: "João", idade: 30 }
```

### Guardar em ficheiro

```js
import { inspect } from 'nodedump';
import { writeFileSync } from 'fs';

const estado = { usuarios: 150, ativo: true };
writeFileSync('debug.json', inspect(estado, { colors: false }));
```

### Enviar via HTTP

```js
import { inspect } from 'nodedump';

app.get('/debug/estado', (req, res) => {
  const debug = inspect(app.state);
  res.json({ debug });
});
```

### Testes unitários

```js
import { inspect } from 'nodedump';

test('deve retornar estrutura correta', () => {
  const resultado = minhaFuncao();
  const output = inspect(resultado, { colors: false });
  expect(output).toContain('propriedade: "valor"');
});
```

## Diferença entre inspect() e dump()

| Função | Retorna string? | Imprime no terminal? |
|--------|----------------|---------------------|
| `inspect()` | ✅ Sim | ❌ Não |
| `dump()` | ❌ Não | ✅ Sim |

## Porquê usar inspect()?

- **Função pura** - sem efeitos secundários
- **Reutilizável** - mesma formatação para diferentes destinos
- **Testável** - fácil de verificar output em testes
- **Extensível** - constrói as tuas próprias ferramentas em cima

## Dicas

- Usa `inspect()` quando precisas da string para processamento
- Usa `dump()` quando queres apenas ver o valor rapidamente
- Desliga as cores (`colors: false`) ao guardar em ficheiros ou enviar via HTTP