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
- **dp()** – Dump and pause (wait for user input)
- **inspect()** – Get formatted string without printing
- **trace()** – Show stack trace with location
- **measure()** – Time sync/async execution
- **Circular reference safe**
- **Map, Set, Date, Error, RegExp support**
- **Colors with auto-detection (or force on/off)**
- **ESM + CommonJS**

## Function History

| Function | Description | Added | Removed |
|----------|-------------|-------|---------|
| `dump()` | Print formatted value | v0.1.0 | - |
| `dd()` | Dump and exit | v0.1.0 | - |
| `inspect()` | Return formatted string | v0.1.0 | - |
| `trace()` | Show stack trace location | v0.1.0 | - |
| `measure()` | Time execution | v0.1.0 | - |
| `dp()` | Dump and pause (interactive) | v0.2.0-beta | - |
| `dpp()` | Dump, pause and trace (stack) | v0.2.0-beta | v0.2.0 |

> **Note:** `dpp()` was removed in v0.2.0. Use `trace()` + `dp()` instead.

## Installation

```bash
yarn add dumpkit
```

or

```bash
npm install dumpkit
```

Quick start

```js
import { dump, dd, dp, inspect, trace, measure } from 'dumpkit';

const user = { name: 'John', age: 30, tags: new Set(['admin', 'user']) };

dump(user);                           // Pretty print to console

const output = inspect(user);         // Get string without printing
console.log('Debug:', output);

trace('auth-checkpoint');             // Show where you are

measure('db-query', () => {
  // your code here
  return heavyOperation();
});

// Pause execution to inspect state
await dp({ step: 'before processing', user });

dd(user);                             // Dump and exit
```

API

dump(value, options?)

Prints a formatted representation of the value to stderr. Returns the value unchanged (for chaining).

dd(value, options?)

Prints the value and calls process.exit(1).

dp(value, options?)

Prints the value and pauses execution until the user presses ENTER. Perfect for interactive debugging. Returns a Promise that resolves with the original value.

inspect(value, options?)

Returns a formatted string without printing.

Options:

· depth?: number – Maximum nesting depth (default: 30)
· colors?: boolean – Force colors (default: true in TTY)
· showHidden?: boolean – Show non-enumerable properties

trace(label?, options?)

Prints current stack trace with optional label and file:line location.

measure(label, fn, options?)

Measures execution time of a sync or async function.

```js
// Sync
measure('sort', () => array.sort());

// Async
await measure('fetch', async () => await api.call());
```

Philosophy

dumpkit generates debug representations without caring where they go. The same core can be reused for terminal, HTTP responses, files, or custom tooling.

Documentation

· Português
· English

Author

Justino Contingo · GitHub

License

MIT
