---
sidebar: true
---

# nodedump

Zero-dependency debugging for Node.js

<div style="text-align: center; margin: 1rem 0 2rem 0;">
  Inspired by Laravel's dump() and dd()
</div>

<div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem;">
  <a href="/nodedump/en/getting-started" class="btn-primary">Get Started</a>
  <a href="https://github.com/justino-code/nodedump" class="btn-secondary">GitHub</a>
</div>

## Why nodedump?

Have you ever wasted minutes trying to understand complex data structures with `console.log()`?

```js
// What console.log shows
console.log(user);
// { name: 'John', address: [Object], permissions: [Object], metadata: [Object] }
// You can't see what's inside! 😫
```

**With nodedump:**

```js
import { dump } from 'nodedump';

dump(user);
```

**Complete and readable output:**

```js
{
  name: "John",
  address: {
    street: "Augusta Street",
    city: "Lisbon",
    zipCode: "1100-053"
  },
  permissions: ["read", "write", "admin"],
  metadata: Map(2) {
    "created" => Date(2024-01-15T10:30:00.000Z),
    "lastAccess" => Date(2024-12-20T15:45:00.000Z)
  }
}
```

## Debug that stops execution

Need to stop your code at a specific point to inspect?

```js
import { dd } from 'nodedump';

function processOrder(order) {
  // Validation failed? Stop everything and show
  if (!order.valid) {
    dd({ error: 'Invalid order', order });
  }
  
  // If you got here, order is valid
  return process(order);
}
```

`dd()` = **dump and die** - prints the value and terminates the process immediately.

## Features

<div class="features">
  <div class="feature">
    <strong>Simple API</strong>
    <p>dump(), dd(), trace(), measure()</p>
  </div>
  <div class="feature">
    <strong>Zero Dependencies</strong>
    <p>No npm baggage</p>
  </div>
  <div class="feature">
    <strong>Beautiful Output</strong>
    <p>Colorized and readable formatting</p>
  </div>
  <div class="feature">
    <strong>Circular Safe</strong>
    <p>No crash on circular references</p>
  </div>
  <div class="feature">
    <strong>TypeScript Ready</strong>
    <p>Full type definitions included</p>
  </div>
  <div class="feature">
    <strong>Zero Config</strong>
    <p>Works out of the box</p>
  </div>
</div>

## Installation

```bash
yarn add nodedump
```

<style>
.btn-primary {
  display: inline-block;
  background-color: #2c3e50;
  color: white !important;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 0.9rem;
}

.btn-primary:hover {
  background-color: #1a2632;
}

.btn-secondary {
  display: inline-block;
  background-color: transparent;
  color: #2c3e50;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background-color: #f1f5f9;
}

@media (prefers-color-scheme: dark) {
  .btn-primary {
    background-color: #475569;
    color: white;
  }
  .btn-primary:hover {
    background-color: #334155;
  }
  .btn-secondary {
    color: #e2e8f0;
    border-color: #475569;
  }
  .btn-secondary:hover {
    background-color: #334155;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.feature {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .feature {
    border-color: #334155;
  }
}

.feature strong {
  display: block;
  margin-bottom: 0.5rem;
}

.feature p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .feature p {
    color: #94a3b8;
  }
}
</style>