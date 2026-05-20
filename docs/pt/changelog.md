# Changelog

Todas as alterações importantes neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026

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