# JavaScript Modules in Node

## Overview

Node.js has a built-in module system that allows you to split programs into multiple files. Each file is an **independent module** with its own **private namespace**.

### Key Characteristics

- **One file = One module** with private scope
- Constants, variables, functions, and classes are **private by default**
- Values must be **explicitly exported** to be visible to other modules
- Modules must **explicitly import** what they need from other modules
- No need for bundling (unlike browsers) - Node reads from fast filesystem

---

## Node Exports

Node provides two ways to export values: the `exports` object and `module.exports`.

### 1. Exporting Multiple Values with `exports`

Use the global `exports` object to export multiple functions or values:

```javascript
// stats.js
const sum = (x, y) => x + y;
const square = (x) => x * x;

// Export public functions
exports.mean = (data) => data.reduce(sum) / data.length;

exports.stddev = function (d) {
  let m = exports.mean(d);
  return Math.sqrt(
    d
      .map((x) => x - m)
      .map(square)
      .reduce(sum) /
      (d.length - 1)
  );
};
```

**Result**: Other modules can import an object with `mean` and `stddev` properties.

### 2. Exporting a Single Value with `module.exports`

To export a single function, class, or value, assign it to `module.exports`:

```javascript
// bitset.js
module.exports = class BitSet extends AbstractWritableSet {
  // Implementation omitted
};
```

**Usage**: Import the class directly without an object wrapper.

### 3. Exporting Multiple Values at Once

Define everything privately, then export selected values at the end:

```javascript
// stats.js
// Private functions
const sum = (x, y) => x + y;
const square = (x) => x * x;

// Public functions (still private until exported)
const mean = (data) => data.reduce(sum) / data.length;

const stddev = (d) => {
  let m = mean(d);
  return Math.sqrt(
    d
      .map((x) => x - m)
      .map(square)
      .reduce(sum) /
      (d.length - 1)
  );
};

// Export only public API
module.exports = { mean, stddev };
```

**Benefits**:

- Clear separation between public and private code
- All exports in one place
- Easy to see the module's API

### Understanding `exports` vs `module.exports`

- **`exports`** is a reference to `module.exports` (initially points to the same object)
- **`module.exports`** is what actually gets exported
- Setting `module.exports = ...` replaces the entire export
- Adding properties to `exports` is shorthand for `module.exports.property`

**Rule of thumb**:

- Use `exports.property` when exporting multiple values
- Use `module.exports =` when exporting a single value

---

## Node Imports

Use the `require()` function to import modules.

### Syntax

```javascript
const moduleName = require('module-name-or-path');
```

- **Argument**: Module name (string)
- **Return value**: Whatever the module exports

### 1. Importing Built-in or Installed Modules

Use the **unqualified module name** (no `/` characters):

```javascript
// Built-in Node modules
const fs = require('fs'); // Filesystem module
const http = require('http'); // HTTP module
const path = require('path'); // Path utilities

// Third-party modules (installed via npm)
const express = require('express'); // Express framework
const lodash = require('lodash'); // Lodash utility library
```

### 2. Importing Your Own Modules

Use **relative file paths** starting with `./` or `../`:

```javascript
// Import from current directory
const stats = require('./stats.js');
const BitSet = require('./utils/bitset.js');

// Import from parent directory
const helpers = require('../helpers.js');
```

**Notes**:

- Absolute paths starting with `/` are legal but uncommon
- You can omit the `.js` extension: `require('./stats')` works too
- File extensions are often included explicitly for clarity

### 3. Importing Single vs Multiple Exports

**When module exports a single value**:

```javascript
// bitset.js exports: module.exports = class BitSet {...}

const BitSet = require('./bitset.js');
let set = new BitSet();
```

**When module exports multiple values**:

Option A: Import entire object

```javascript
// stats.js exports: module.exports = { mean, stddev }

const stats = require('./stats.js');
let average = stats.mean(data);
let deviation = stats.stddev(data);
```

**Benefits**:

- Organized namespace (`stats.mean`, `stats.stddev`)
- Clear where functions come from

Option B: Import specific values with destructuring

```javascript
const { mean, stddev } = require('./stats.js');

let average = mean(data);
let deviation = stddev(data);
```

**Benefits**:

- Concise and direct
- Only import what you need
- Cleaner code (but loses namespace context)

---

## Complete Module Examples

### Example 1: Utility Module (Multiple Exports)

```javascript
// utils.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

module.exports = { add, subtract, multiply, divide };
```

```javascript
// main.js
const math = require('./utils.js');

console.log(math.add(5, 3)); // 8
console.log(math.multiply(4, 2)); // 8

// Or with destructuring
const { add, multiply } = require('./utils.js');
console.log(add(5, 3)); // 8
```

### Example 2: Class Module (Single Export)

```javascript
// user.js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

module.exports = User;
```

```javascript
// app.js
const User = require('./user.js');

let user = new User('Alice', 'alice@example.com');
console.log(user.greet()); // "Hello, I'm Alice"
```

### Example 3: Mixed Public/Private Functions

```javascript
// database.js

// Private helper function
function validateConnection(config) {
  return config && config.host && config.port;
}

// Public function
function connect(config) {
  if (!validateConnection(config)) {
    throw new Error('Invalid configuration');
  }
  // Connection logic...
  return { connected: true, config };
}

// Public function
function disconnect() {
  // Disconnection logic...
  return { connected: false };
}

// Export only public API
module.exports = { connect, disconnect };
```

```javascript
// app.js
const db = require('./database.js');

let connection = db.connect({ host: 'localhost', port: 5432 });
// db.validateConnection() is NOT accessible (private)
```

---

## Node-Style Modules on the Web

Historically, Node's module system (`require()` and `exports`) was used for web development with **bundlers** like:

- Webpack
- Browserify
- Parcel

### How It Worked

1. Write code using Node-style modules
2. Run a bundler to combine all modules into a single browser-compatible file
3. Deploy the bundled file

### Current Trend

**Modern web development** now uses **ES6 modules** (`import`/`export`) instead:

```javascript
// Modern ES6 approach (preferred)
import { mean, stddev } from './stats.js';
export default class BitSet {}
```

**Why the shift?**

- ES6 modules are now the **JavaScript standard**
- Native browser support (no bundling required for modern browsers)
- Better static analysis and tree-shaking
- More consistent across Node and browsers (Node now supports ES6 modules too)

**However**: You'll still see Node-style modules in:

- Older codebases
- Legacy Node applications
- Some npm packages

---

## Module System Comparison

| Feature             | Node Modules (CommonJS) | ES6 Modules                               |
| ------------------- | ----------------------- | ----------------------------------------- |
| **Syntax**          | `require()` / `exports` | `import` / `export`                       |
| **Loading**         | Synchronous             | Asynchronous                              |
| **Context**         | Node.js (originally)    | Standard JavaScript                       |
| **File extension**  | `.js`                   | `.mjs` or `.js` (with `"type": "module"`) |
| **Browser support** | Via bundlers only       | Native (modern browsers)                  |
| **Node support**    | Native (always)         | Native (Node 12+)                         |
| **Current status**  | Legacy but still common | Modern standard                           |

---

## Best Practices

✅ **Use `module.exports`** for single exports (classes, functions)
✅ **Use `exports.property`** for multiple exports
✅ **Use relative paths** (`./`, `../`) for your own modules
✅ **Group exports** at the end of the file for clarity
✅ **Keep modules focused** - one module, one responsibility
✅ **Use destructuring** when importing only specific functions
✅ **Include file extensions** for clarity (`.js`)
✅ **Consider ES6 modules** for new projects

---

## Key Concepts Summary

📌 **Each file is a module** with private namespace
📌 **`exports`** is an object for exporting multiple values
📌 **`module.exports`** exports a single value or replaces entire export
📌 **`require()`** imports modules and returns exported values
📌 **Built-in/npm modules**: Use unqualified names (`'fs'`, `'express'`)
📌 **Your modules**: Use relative paths (`'./stats.js'`)
📌 **Destructuring** allows selective imports
📌 **Node-style modules** were common for web (with bundlers)
📌 **ES6 modules** are now the modern standard
📌 **No bundling needed** in Node (fast filesystem access)
