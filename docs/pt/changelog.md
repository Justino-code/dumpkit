# Changelog

Todas as alterações importantes neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - A definir

### Alterado
- Stack trace agora filtra frames internos da lib, mostrando apenas código do utilizador

### Removido
- Função `dpp()` - use a combinação `trace()` + `dp()` em vez disso

## [0.2.0-beta] - 2026-05-21

### Adicionado
- Função `dp()` - dump e pausa (aguarda input do utilizador)
- Função `dpp()` - dump, pausa e trace (com stack trace)
- Suporte para opção `stream` nas funções `trace()` e `measure()`
- Suporte para timeout e mensagem personalizada nas funções de pausa
- Auto-continuação em ambientes não TTY (CI/CD)

### Alterado
- `trace()` agora usa `writeToStream` em vez de `console.error` para consistência
- `measure()` agora usa `writeToStream` em vez de `console.error` para consistência
- Todas as funções agora suportam a opção `stream` consistente para redirecionamento
- Aumentada profundidade padrão de 4 para 30
- Aumentado `maxArrayLength` padrão de 100 para 1000
- Aumentado `maxStringLength` padrão de 1000 para 5000
- Aumentado `maxProperties` padrão de 50 para 200

### Documentação
- Adicionado guia de Combinações com composições úteis de funções
- Adicionada documentação para `dp()` e `dpp()`
- Atualizada documentação de `trace()` e `measure()` com opção `stream`
- Adicionados exemplos de redirecionamento para ficheiros
- Versões em Português e Inglês mantidas

## [0.1.1] - 2026-05-20

## [0.1.0] - 2026-05-20 (depreciada)

### Adicionado
- Formatador core com deteção de referências circulares
- Função `inspect()` - formatador puro de strings
- Função `dump()` - imprime no stderr com encadeamento
- Função `dd()` - dump e die (process.exit)
- Função `trace()` - mostra localização do caller com opção de stack
- Função `measure()` - medição de performance síncrona/assíncrona
- Suporte para Map, Set, WeakMap, WeakSet
- Suporte para Date, Error, RegExp
- Suporte para TypedArrays (Uint8Array, Int32Array, etc)
- Definições de tipos TypeScript
- Builds ESM e CommonJS
- Zero dependências
- Deteção automática de cores (TTY)
- Forçar cores ligado/desligado via opções

> **⚠️ Depreciada:** Use a versão `0.1.1` ou superior.