# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-27

### Added
- `analyze()` function - semantic analysis returning AnalysisNode
- Support for `view` option in `inspect()` and `dump()` (`flat`, `tree`, `table`)
- `dp()` function - dump and pause (wait for user input)
- Shared reference detection (`[Shared *N]`) in addition to circular references
- Support for `stream` option in `trace()` and `measure()` functions
- Support for custom timeout and message in pause functions
- Auto-continue in non-TTY environments (CI/CD)

### Changed
- `inspect()` now returns `AnalysisNode` (breaking change)
- `trace()` now filters internal library frames, showing only user code
- `trace()` and `measure()` now use `writeToStream` instead of `console.error` for consistency
- All functions now support consistent `stream` option for output redirection
- Increased defaults: depth 4→30, maxArrayLength 100→1000, maxStringLength 1000→5000, maxProperties 50→200

### Removed
- `dpp()` function - use `trace()` + `dp()` combination instead

### Fixed
- `trace()` now correctly shows caller location in all environments
- `dp()` now works correctly in Termux and non-TTY environments
- Circular and shared reference detection improved

## [0.2.0-beta] - 2026-05-21

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

## [0.1.1] - 2026-05-20

### Changed
- Removed development warning from README
- Documentation updates

## [0.1.0] - 2026-05-20 (deprecated)

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

> **⚠️ Deprecated:** This version contained a development warning. Please use `0.1.1` or later.