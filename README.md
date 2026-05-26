# dumpkit

> Uma biblioteca minimalista e sem dependências para representação e inspeção de dados em runtime no Node.js.

Inspirada na simplicidade do `dump()` e `dd()` do PHP/Laravel, a **dumpkit** evolui o conceito tradicional de debugging ao focar não apenas na impressão de valores, mas na geração de representações estruturadas e semanticamente legíveis dos dados durante a execução da aplicação.

O núcleo da biblioteca é baseado na ideia de que debugging não deve limitar-se a `console.log()`, mas sim ajudar o desenvolvedor a compreender visualmente o estado, a estrutura e as relações dos dados em runtime.

<div align="center">

[![npm version](https://img.shields.io/npm/v/dumpkit.svg)](https://www.npmjs.com/package/dumpkit)
[![license](https://img.shields.io/github/license/justino-code/dumpkit)](https://github.com/justino-code/dumpkit/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/dumpkit.svg)](https://nodejs.org)
[![build status](https://img.shields.io/github/actions/workflow/status/justino-code/dumpkit/docs.yml?branch=main)](https://github.com/justino-code/dumpkit/actions)
[![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org)

</div>

**Zero dependências · Zero configuração · API pequena e previsível**

---

## Filosofia

- **Zero dependências** – Nada além do Node.js.
- **Zero configuração** – Funciona imediatamente, sem variáveis de ambiente ou ficheiros de setup.
- **API pequena e previsível** – Cada função faz uma única coisa de forma clara.
- **Representação antes de output** – Geramos estruturas semânticas; o destino (terminal, ficheiro, HTTP) é escolhido por si.
- **Estruturas de dados devem ser compreensíveis visualmente** – Mapas, Sets, objetos aninhados, referências circulares são exibidos de forma legível.
- **Simplicidade externa, inteligência interna** – A complexidade fica escondida, a API continua simples.
- **Extensível por design** – O core pode ser usado para construir novos visualizadores.
- **Foco em desenvolvimento e inspeção local** – Ferramenta para depurar, não para produção.

---

## Núcleo da arquitetura

O núcleo da dumpkit é responsável por **gerar representações estruturadas dos dados**, independentemente de onde essas representações serão exibidas.

A biblioteca separa claramente:

- **Representação** → responsabilidade do core (função `inspect()`)
- **Destino/output** → responsabilidade externa (terminal, ficheiro, HTTP, etc.)

Isto permite que diferentes formatos de visualização coexistam sem aumentar a complexidade da API pública.

---

## Representações suportadas

Dependendo da estrutura analisada, a biblioteca pode gerar automaticamente diferentes formas de representação:

- visualização plana
- tabelas
- árvores hierárquicas
- grafos ASCII
- estruturas semânticas
- representações compactas

Essas representações são especialmente úteis para:

- objetos complexos
- ASTs
- árvores binárias e n-árias
- algoritmos de busca
- estruturas recursivas
- análise de fluxo e estado interno

---

## Instalação

```bash
yarn add dumpkit
# ou
npm install dumpkit
```

---

API principal

dump()

Renderiza e exibe representações estruturadas dos dados.

```js
import { dump } from 'dumpkit';

dump({ nome: 'João', tags: new Set(['admin', 'user']) });
```

dd()

Renderiza os dados e encerra imediatamente o processo (dump and die).

```js
dd(erro);
```

dp()

Renderiza os dados e pausa a execução até que o utilizador pressione ENTER.

```js
await dp(estado);
```

inspect()

Gera representações estruturadas sem realizar output. O inspect() funciona como o núcleo semântico da biblioteca, responsável por analisar estruturas e produzir representações intermediárias reutilizáveis por diferentes renderizadores.

```js
const repr = inspect(ast, { depth: 5 });
fs.writeFileSync('ast.json', repr);
```

trace()

Exibe informações de rastreamento e fluxo de execução.

```js
trace('checkpoint-antes-de-validar');
```

measure()

Mede o tempo de execução de operações e blocos de código.

```js
const { result, measurement } = measure('query', () => db.busca(sql));
console.log(`Duração: ${measurement.durationMs}ms`);
```

---

Exemplo rápido

```js
import { dump, dd, inspect, trace, measure, dp } from 'dumpkit';

const utilizador = {
  id: 1,
  nome: 'Maria',
  permissoes: new Set(['ler', 'escrever']),
  ultimoAcesso: new Date()
};

dump(utilizador);                     // mostra estrutura
trace('processamento-iniciado');      // localização no código

const resultado = await measure('calculo', () => algoritmoPesado());
dump({ resultado });

await dp(utilizador);                 // pausa até ENTER

dd(utilizador);                       // mostra e termina processo
```

---

Objetivo

Fornecer uma ferramenta leve e inteligente para compreensão visual de estruturas de dados em runtime, reduzindo o atrito do debugging tradicional e transformando a inspeção de dados em uma experiência mais clara, expressiva e útil para desenvolvimento e aprendizado.

---

## Documentation

- [Português](https://justino-code.github.io/dumpkit/pt/)
- [English](https://justino-code.github.io/dumpkit/en/)

## Author

**Justino Contingo** · [GitHub](https://github.com/justino-code)

License

MIT
