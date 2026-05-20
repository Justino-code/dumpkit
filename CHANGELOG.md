# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026

### Added
- Core formatter with circular reference detection
- `inspect()` function - pure string formatter
- `dump()` function - print to stderr with chaining
- `dd()` function - dump and die (process.exit)
- `trace()` function - show caller location with stack option
- `measure()` function - sync/async performance timing
- Support for Map, Set, WeakMap, WeakSet
- Support for Date, Error, RegExp
- Support for TypedArrays (Uint8Array, Int32Array, etc)
- TypeScript type definitions
- ESM and CommonJS builds
- Zero dependencies
- Auto color detection (TTY)
- Force colors on/off via options