# inspect()

Retorna uma representação formatada de um valor como string, sem imprimir.

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

Retorna uma string formatada pronta a ser usada como desejar.

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `view` | `'flat' \| 'tree' \| 'table'` | `'flat'` | Estilo de visualização |
| `depth` | `number` | `30` | Profundidade máxima de aninhamento |
| `colors` | `boolean` | `auto` | `true` = forçar cores, `false` = sem cores, `auto` = baseado no TTY |
| `showHidden` | `boolean` | `false` | Mostrar propriedades não enumeráveis |
| `maxArrayLength` | `number` | `1000` | Máximo de itens do array a mostrar |
| `maxStringLength` | `number` | `5000` | Comprimento máximo da string |
| `indent` | `number` | `2` | Espaços por nível de indentação |

## Exemplos

### Uso básico (vista flat)

```js
const output = inspect({ nome: 'João', idade: 30 });
console.log(output);
// { nome: "João", idade: 30 }
```

### Vista em árvore

```js
const arvore = inspect(dados, { view: 'tree' });
console.log(arvore);
// Object
// ├── nome: "João"
// └── idade: 30
```

### Vista em tabela (array de objetos)

```js
const usuarios = [
  { nome: 'Alice', idade: 30 },
  { nome: 'Bob', idade: 25 }
];
const tabela = inspect(usuarios, { view: 'table' });
console.log(tabela);
// nome   | idade
// ───────┼───────
// Alice  | 30
// Bob    | 25
```

### Guardar em ficheiro

```js
import { inspect } from 'dumpkit';
import { writeFileSync } from 'fs';

const estado = { usuarios: 150, ativo: true };
writeFileSync('debug.json', inspect(estado, { colors: false }));
```

### Enviar via HTTP

```js
import { inspect } from 'dumpkit';

app.get('/debug/estado', (req, res) => {
  const debug = inspect(app.state);
  res.json({ debug });
});
```

### Testes unitários

```js
import { inspect } from 'dumpkit';

test('deve retornar estrutura correta', () => {
  const resultado = minhaFuncao();
  const output = inspect(resultado, { colors: false });
  expect(output).toContain('propriedade: "valor"');
});
```

## Diferença entre inspect() e dump()

| Função | Retorna string? | Imprime no terminal? | Efeitos secundários |
|--------|----------------|---------------------|---------------------|
| `inspect()` | ✅ Sim | ❌ Não | Nenhum (pura) |
| `dump()` | ❌ Não | ✅ Sim | Escreve no stream |

## Porquê usar inspect()?

- **Função pura** - sem efeitos secundários
- **Múltiplas vistas** - `flat`, `tree`, `table` para diferentes necessidades
- **Reutilizável** - mesma formatação para diferentes destinos
- **Testável** - fácil de verificar output em testes
- **Extensível** - construa as suas próprias ferramentas em cima

## Dicas

- Use `inspect()` quando precisa da string para processamento
- Use `dump()` quando quer apenas ver o valor rapidamente
- Desligue as cores (`colors: false`) ao guardar em ficheiros ou enviar via HTTP
- Use `view: 'tree'` para compreender estruturas aninhadas
- Use `view: 'table'` para arrays de objetos homogéneos