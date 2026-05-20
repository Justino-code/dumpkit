# nodedump

> **⚠️ WARNING:** This package is under development. API may change.
> **Not recommended for production use at this time.**

> Debugging library for Node.js inspired by Laravel's `dump()` and `dd()`

<div align="center">

[![npm version](https://img.shields.io/npm/v/nodedump.svg)](https://www.npmjs.com/package/nodedump)
[![npm downloads](https://img.shields.io/npm/dm/nodedump.svg)](https://www.npmjs.com/package/nodedump)
[![license](https://img.shields.io/npm/l/nodedump.svg)](https://github.com/justino-code/nodedump/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/nodedump.svg)](https://nodejs.org)
[![build status](https://img.shields.io/github/actions/workflow/status/justino-code/nodedump/docs.yml?branch=main)](https://github.com/justino-code/nodedump/actions)
[![coverage](https://img.shields.io/codecov/c/github/justino-code/nodedump)](https://codecov.io/gh/justino-code/nodedump)
[![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org)
[![status](https://img.shields.io/badge/status-alpha-orange)](https://github.com/justino-code/nodedump)

</div>

**Zero dependencies · Zero config · Simple by design**

## Features

- **dump()** – Display structured values instantly
- **dd()** – Dump and die (exits process)
- **inspect()** – Get formatted string without printing
- **trace()** – Show stack trace with location
- **measure()** – Time sync/async execution
- **Circular reference safe**
- **Map, Set, Date, Error, RegExp support**
- **Colors with auto-detection (or force on/off)**
- **ESM + CommonJS**

## Installation

```bash
yarn add nodedump
# or
npm install nodedump
```

## Quick start

```js
import { dump, dd, inspect, trace, measure } from 'nodedump';

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
- `depth?: number` – Maximum nesting depth (default: `4`)
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

nodedump **generates** debug representations without caring **where** they go. The same core can be reused for terminal, HTTP responses, files, or custom tooling.

## Documentation

- [Português](https://justino-code.github.io/nodedump/pt/)
- [English](https://justino-code.github.io/nodedump/en/)

## Author

**Justino Contingo** · [GitHub](https://github.com/justino-code)

## License

MIT