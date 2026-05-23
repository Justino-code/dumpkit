<p align="center">
  <img src="https://raw.githubusercontent.com/justino-code/dumpkit/main/docs/public/logo.svg" alt="dumpkit logo" width="400">
</p>

# dumpkit

> Debugging library for Node.js inspired by Laravel's `dump()` and `dd()`

<div align="center">

[![npm version](https://img.shields.io/npm/v/dumpkit.svg)](https://www.npmjs.com/package/dumpkit)
[![license](https://img.shields.io/github/license/justino-code/dumpkit)](https://github.com/justino-code/dumpkit/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/dumpkit.svg)](https://nodejs.org)
[![build status](https://img.shields.io/github/actions/workflow/status/justino-code/dumpkit/docs.yml?branch=main)](https://github.com/justino-code/dumpkit/actions)
[![coverage](https://img.shields.io/codecov/c/github/justino-code/dumpkit)](https://codecov.io/gh/justino-code/dumpkit)
[![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org)
</div>

**Zero dependencies · Zero config · Simple by design**

## Features

- **dump()** – Display structured values instantly
- **dd()** – Dump and die (exits process)
- **dp()** - Dumo and pause
- **inspect()** – Get formatted string without printing
- **trace()** – Show stack trace with location
- **measure()** – Time sync/async execution
- **Circular reference safe**
- **Map, Set, Date, Error, RegExp support**
- **Colors with auto-detection (or force on/off)**
- **ESM + CommonJS**

## Installation

```bash
yarn add dumpkit
```

or

```bash
npm install dumpkit
```

## Quick start

```js
import { dump, dd, inspect, trace, measure } from 'dumpkit';

const user = { name: 'John', age: 30, tags: new Set(['admin', 'user']) };

dump(user);                           // Pretty print to console

const output = inspect(user);         // Get string without printing
console.log('Debug:', output);

trace('auth-checkpoint');             // Show where you are

measure('db-query', () => {
  // your code here
  return heavyOperation();
});

dd(user);                             // Dump and exit
```

## API

### `dump(value, options?)`
Prints a formatted representation of the value to stderr. Returns the value unchanged (for chaining).

### `dd(value, options?)`
Prints the value and calls `process.exit(1)`.

### `inspect(value, options?)`
Returns a formatted string without printing.

Options:
- `depth?: number` – Maximum nesting depth (default: `30`)
- `colors?: boolean` – Force colors (default: `true` in TTY)
- `showHidden?: boolean` – Show non-enumerable properties

### `trace(label?, options?)`
Prints current stack trace with optional label and file:line location.

### `measure(label, fn, options?)`
Measures execution time of a sync or async function.

```js
// Sync
measure('sort', () => array.sort());

// Async
await measure('fetch', async () => await api.call());
```

## Philosophy

dumpkit **generates** debug representations without caring **where** they go. The same core can be reused for terminal, HTTP responses, files, or custom tooling.

## Documentation

- [Português](https://justino-code.github.io/dumpkit/pt/)
- [English](https://justino-code.github.io/dumpkit/en/)

## Author

**Justino Contingo** · [GitHub](https://github.com/justino-code)

## License

MIT
