# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-21

### Added
- `dp()` function - dump and pause (wait for user input)
- `dpp()` function - dump, pause and trace (with stack trace)
- Support for `stream` option in `trace()` and `measure()` functions
- Support for custom timeout and message in pause functions
- Auto-continue in non-TTY environments (CI/CD)

### Changed
- `trace()` now uses `writeToStream` instead of `console.error` for consistency
- `measure()` now uses `writeToStream` instead of `console.error` for consistency
- All functions now support consistent `stream` option for output redirection
- Increased default depth from 4 to 30
- Increased default maxArrayLength from 100 to 1000
- Increased default maxStringLength from 1000 to 5000
- Increased default maxProperties from 50 to 200

### Documentation
- Added Combinations guide with useful function compositions
- Added documentation for `dp()` and `dpp()`
- Updated `trace()` and `measure()` docs with `stream` option
- Added examples for redirecting output to files
- Portuguese and English versions maintained

## [0.1.0] - 2026-05-20

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