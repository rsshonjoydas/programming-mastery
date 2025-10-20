# JavaScript Modules

Modules are the foundation of modular programming in JavaScript, enabling large programs to be assembled from code written by different authors while maintaining encapsulation and preventing naming conflicts.

---

## What Are Modules?

**Purpose of Modules**:

- **Encapsulation**: Hide private implementation details
- **Namespace management**: Keep the global namespace clean
- **Prevent conflicts**: Stop modules from accidentally modifying each other's variables, functions, and classes
- **Code organization**: Break large codebases into manageable pieces
- **Reusability**: Share code across different parts of an application

---

## Evolution of JavaScript Modules

| Era             | Module System                    | Description                                     |
| --------------- | -------------------------------- | ----------------------------------------------- |
| **Pre-ES6**     | DIY (Classes, Objects, Closures) | Manual encapsulation patterns                   |
| **Node.js**     | CommonJS (`require()`)           | Server-side standard, never official JavaScript |
| **ES6+ (2015)** | ES Modules (`import`/`export`)   | Official JavaScript standard                    |
| **Modern**      | ES Modules + Bundlers            | Current best practice with build tools          |

---

## 1. DIY Modules (Pre-ES6)

Before built-in module support, developers used **classes, objects, and closures** to create modularity.

### Module Pattern with Closures (IIFE)

```javascript
// Creating a module with an Immediately Invoked Function Expression
const Calculator = (function () {
  // Private variables and functions
  let result = 0;

  function validate(num) {
    if (typeof num !== 'number') {
      throw new Error('Invalid number');
    }
  }

  // Public API (returned object)
  return {
    add: function (num) {
      validate(num);
      result += num;
      return this;
    },

    subtract: function (num) {
      validate(num);
      result -= num;
      return this;
    },

    getResult: function () {
      return result;
    },

    reset: function () {
      result = 0;
      return this;
    },
  };
})();

// Usage
Calculator.add(10).subtract(3).add(5);
console.log(Calculator.getResult()); // 12
// Calculator.result is inaccessible (private)
// Calculator.validate() is inaccessible (private)
```

**Advantages**:

- Private variables and functions
- Clean public API
- No global namespace pollution

**Disadvantages**:

- No dependency management
- Manual namespace management
- No standardized way to load modules

### Namespace Pattern

```javascript
// Create namespace object
const MyApp = MyApp || {};

// Add module to namespace
MyApp.Utils = {
  formatDate: function (date) {
    return date.toISOString();
  },

  capitalize: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

MyApp.Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// Usage
console.log(MyApp.Utils.capitalize('hello'));
console.log(MyApp.Config.apiUrl);
```

### Revealing Module Pattern

```javascript
const DataStore = (function () {
  // Private
  let data = [];

  function findById(id) {
    return data.find((item) => item.id === id);
  }

  function add(item) {
    data.push(item);
  }

  function remove(id) {
    data = data.filter((item) => item.id !== id);
  }

  function getAll() {
    return [...data]; // Return copy to protect internal data
  }

  // Reveal public methods
  return {
    add: add,
    remove: remove,
    getAll: getAll,
    // findById remains private
  };
})();

// Usage
DataStore.add({ id: 1, name: 'Item 1' });
DataStore.add({ id: 2, name: 'Item 2' });
console.log(DataStore.getAll());
```

---

## 2. Node.js Modules (CommonJS)

Node.js adopted the **CommonJS** module system using `require()` and `module.exports`.

### Exporting from a Module

**Method 1: `module.exports` (single export)**

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add: add,
  subtract: subtract,
};

// Or export a single function
module.exports = function multiply(a, b) {
  return a * b;
};
```

**Method 2: `exports` shorthand (multiple exports)**

```javascript
// utils.js
exports.formatDate = function (date) {
  return date.toISOString();
};

exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Note: Don't reassign exports directly!
// exports = { ... } won't work
// Use module.exports = { ... } instead
```

### Importing a Module

```javascript
// app.js

// Import entire module
const math = require('./math');
console.log(math.add(5, 3)); // 8

// Destructure specific functions
const { add, subtract } = require('./math');
console.log(add(10, 5)); // 15

// Import built-in Node modules
const fs = require('fs');
const path = require('path');

// Import third-party modules (from node_modules)
const express = require('express');
const lodash = require('lodash');
```

### How require() Works

1. **Resolve**: Find the file path
2. **Load**: Read file contents
3. **Wrap**: Wrap in a function (creates scope)
4. **Evaluate**: Execute the wrapped function
5. **Cache**: Store in `require.cache` (loaded only once)

```javascript
// Module wrapper (what Node does internally)
(function (exports, require, module, __filename, __dirname) {
  // Your module code here
});
```

### Module Caching

```javascript
// counter.js
let count = 0;

module.exports = {
  increment: function () {
    count++;
  },
  getCount: function () {
    return count;
  },
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
counter1.increment();

console.log(counter1.getCount()); // 2
console.log(counter2.getCount()); // 2 (same instance, cached)
console.log(counter1 === counter2); // true
```

**Characteristics of CommonJS**:

- ✅ Synchronous loading (good for server-side)
- ✅ Simple syntax
- ✅ Automatic caching
- ❌ Not native JavaScript (Node-specific)
- ❌ Not ideal for browsers (synchronous)
- ❌ Never became official JavaScript standard

---

## 3. ES6 Modules (ESM)

ES6 introduced **native module support** using `import` and `export` keywords. This is now the **official JavaScript standard**.

### Named Exports

```javascript
// math.js

// Method 1: Export as you declare
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Method 2: Export list at the end
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

export { multiply, divide };

// Method 3: Export with aliases
function power(base, exp) {
  return Math.pow(base, exp);
}

export { power as pow };
```

### Default Export

```javascript
// calculator.js

// Method 1: Default export inline
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Method 2: Default export at the end
class Calculator {
  add(a, b) {
    return a + b;
  }
}

export default Calculator;

// Method 3: Default export expression
export default function(a, b) {
  return a + b;
}

// Note: Only ONE default export per module
```

### Importing Modules

```javascript
// app.js

// Import named exports
import { add, subtract, PI } from './math.js';
console.log(add(5, 3)); // 8
console.log(PI); // 3.14159

// Import with aliases
import { pow as power } from './math.js';
console.log(power(2, 3)); // 8

// Import all as namespace
import * as Math from './math.js';
console.log(Math.add(5, 3)); // 8
console.log(Math.PI); // 3.14159

// Import default export
import Calculator from './calculator.js';
const calc = new Calculator();

// Import default with custom name
import MyCalculator from './calculator.js';

// Combine default and named imports
import Calculator, { add, subtract } from './calculator.js';

// Import for side effects only (no bindings)
import './polyfills.js';
```

### Re-exporting

```javascript
// index.js - Create a barrel file

// Re-export named exports
export { add, subtract } from './math.js';
export { default as Calculator } from './calculator.js';

// Re-export everything
export * from './utils.js';

// Re-export with rename
export { add as sum } from './math.js';
```

### Dynamic Imports (import())

Dynamic imports allow **asynchronous** loading of modules at runtime.

```javascript
// Traditional static import (top-level only)
import { add } from './math.js';

// Dynamic import (returns a Promise)
async function loadModule() {
  const math = await import('./math.js');
  console.log(math.add(5, 3)); // 8
}

// Conditional loading
if (condition) {
  import('./feature.js')
    .then((module) => {
      module.initialize();
    })
    .catch((err) => {
      console.error('Failed to load module:', err);
    });
}

// Lazy loading for performance
button.addEventListener('click', async () => {
  const { animate } = await import('./animations.js');
  animate();
});

// Dynamic path
const lang = 'en';
const messages = await import(`./i18n/${lang}.js`);
```

---

## Comparison: CommonJS vs ES Modules

| Feature             | CommonJS (Node)                | ES Modules (ESM)              |
| ------------------- | ------------------------------ | ----------------------------- |
| **Syntax**          | `require()` / `module.exports` | `import` / `export`           |
| **Loading**         | Synchronous                    | Asynchronous                  |
| **Standard**        | Node-specific                  | Official JavaScript           |
| **Browser Support** | ❌ No (needs bundler)          | ✅ Yes (modern browsers)      |
| **Static Analysis** | ❌ Difficult                   | ✅ Easy (tree-shaking)        |
| **Top-level await** | ❌ No                          | ✅ Yes                        |
| **Dynamic imports** | ✅ Yes                         | ✅ Yes                        |
| **When to use**     | Legacy Node projects           | Modern JavaScript (preferred) |

---

## Using ES Modules

### In Node.js

**Method 1: Use `.mjs` extension**

```javascript
// math.mjs
export function add(a, b) {
  return a + b;
}

// app.mjs
import { add } from './math.mjs';
```

**Method 2: Add `"type": "module"` to `package.json`**

```json
{
  "name": "my-app",
  "type": "module"
}
```

```javascript
// Now .js files are treated as ESM
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from './math.js';
```

### In Browsers

**Method 1: `Module` script tag**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ES Modules</title>
  </head>
  <body>
    <!-- type="module" enables ES modules -->
    <script type="module">
      import { add } from './math.js';
      console.log(add(5, 3));
    </script>

    <!-- External module -->
    <script type="module" src="app.js"></script>
  </body>
</html>
```

**Module scripts characteristics**:

- Automatically in strict mode
- Deferred by default (like `defer` attribute)
- Have their own scope (not global)
- Can use `import` and `export`
- CORS restrictions apply

**Method 2: `Import` from CDN**

```html
<script type="module">
  import confetti from 'https://cdn.skypack.dev/canvas-confetti';
  confetti();
</script>
```

---

## Module Bundlers

In practice, JavaScript modules depend on **bundlers** for production:

### Popular Bundlers

| Bundler     | Description                     | Use Case             |
| ----------- | ------------------------------- | -------------------- |
| **Webpack** | Most popular, feature-rich      | Complex applications |
| **Rollup**  | Efficient, tree-shaking focused | Libraries            |
| **Parcel**  | Zero-config, fast               | Simple projects      |
| **Vite**    | Lightning fast, modern          | Modern development   |
| **esbuild** | Extremely fast                  | Performance-critical |

### What Bundlers Do

1. **Resolve dependencies**: Find all imported modules
2. **Transform**: Convert modern JS to compatible versions
3. **Bundle**: Combine multiple files into fewer files
4. **Optimize**: Minify, tree-shake unused code
5. **Code splitting**: Split into chunks for lazy loading

### Example: Basic Webpack Config

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

---

## Best Practices

### Module Organization

```text
project/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Modal.js
│   │   └── index.js      # Barrel file
│   ├── utils/
│   │   ├── math.js
│   │   ├── string.js
│   │   └── index.js      # Barrel file
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   └── index.js          # Main entry
└── package.json
```

### Barrel Files (index.js)

```javascript
// components/index.js
export { default as Button } from './Button.js';
export { default as Modal } from './Modal.js';

// Now you can import like this:
import { Button, Modal } from './components';
// Instead of:
import Button from './components/Button.js';
import Modal from './components/Modal.js';
```

### Circular Dependencies

**Avoid circular dependencies**:

```javascript
// ❌ Bad: Circular dependency
// a.js
import { b } from './b.js';
export const a = 'A';

// b.js
import { a } from './a.js'; // Circular!
export const b = 'B';

// ✅ Good: Extract shared code
// shared.js
export const shared = 'shared';

// a.js
import { shared } from './shared.js';
export const a = 'A';

// b.js
import { shared } from './shared.js';
export const b = 'B';
```

### Named vs Default Exports

```javascript
// ✅ Prefer named exports (better refactoring, IDE support)
export function add(a, b) {
  return a + b;
}

// ✅ Use default for main class/component
export default class Calculator {
  // ...
}

// ❌ Avoid mixing too many default + named exports
```

---

## Key Concepts Summary

📌 **Modules enable encapsulation** and prevent global namespace pollution
📌 **Pre-ES6**: Used closures (IIFE), objects, and classes for modularity
📌 **CommonJS** (`require()`): Node.js standard, synchronous, not official JS
📌 **ES Modules** (`import`/`export`): Official standard, asynchronous, modern
📌 **Named exports**: Export multiple values with specific names
📌 **Default exports**: Export one main value per module
📌 **Dynamic imports** (`import()`): Load modules asynchronously at runtime
📌 **Static imports**: Analyzed at build time (enables tree-shaking)
📌 **Module bundlers**: Essential for production (Webpack, Rollup, Vite)
📌 **Browser support**: ES modules work in modern browsers with `<script type="module">`
📌 **Node.js**: Use `.mjs` or `"type": "module"` in package.json
📌 **Best practice**: Use ES Modules for all new JavaScript projects
