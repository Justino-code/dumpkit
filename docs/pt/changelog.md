# Changelog

Todas as alterações importantes neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-27

### Adicionado
- Função `analyze()` - análise semântica que retorna AnalysisNode
- Suporte para opção `view` em `inspect()` e `dump()` (`flat`, `tree`, `table`)
- Deteção de referências partilhadas (`[Shared *N]`) além das circulares

### Alterado
- `inspect()` agora suporta múltiplas vistas (`flat`, `tree`, `table`) via opção `view`
- `trace()` agora filtra frames internos da lib, mostrando apenas código do utilizador

### Removido
- Função `dpp()` - use a combinação `trace()` + `dp()` em vez disso

### Corrigido
- `trace()` agora mostra corretamente a localização em todos os ambientes
- `dp()` agora funciona corretamente no Termux e ambientes não TTY
- Processo agora termina naturalmente após a última chamada `dp()`
- Deteção de referências circulares e partilhadas melhorada

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

> **⚠️ Depreciada:** Por favor, use a versão `0.1.1` ou superior.