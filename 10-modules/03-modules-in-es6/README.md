# JavaScript ES6 Modules

ES6 introduces native module support to JavaScript with `import` and `export` keywords, providing real modularity as a core language feature.

## Key Differences: Modules vs Scripts

| Feature                  | Modules                  | Regular Scripts           |
| ------------------------ | ------------------------ | ------------------------- |
| **Scope**                | Private context per file | Shared global context     |
| **Strict mode**          | Always (automatic)       | Optional (`"use strict"`) |
| **`this` at top level**  | `undefined`              | Global object             |
| **`with` statement**     | Not allowed              | Allowed (non-strict)      |
| **Undeclared variables** | Not allowed              | Allowed (non-strict)      |
| **`import`/`export`**    | Allowed                  | Not allowed               |

---

## 1. Exporting from Modules

### Named Exports

**Method 1: `Export` with declaration**

```javascript
export const PI = Math.PI;
export function degreesToRadians(d) {
  return (d * PI) / 180;
}
export class Circle {
  constructor(r) {
    this.r = r;
  }
  area() {
    return PI * this.r * this.r;
  }
}
```

**Method 2: `Export` at the end**

```javascript
const PI = Math.PI;
function degreesToRadians(d) {
  return (d * PI) / 180;
}
class Circle {
  constructor(r) {
    this.r = r;
  }
  area() {
    return PI * this.r * this.r;
  }
}

// Single export statement at the end
export { Circle, degreesToRadians, PI };
```

### Default Exports

Used when a module exports only one value:

```javascript
export default class BitSet {
  // implementation
}
```

**Key differences**:

- Can export anonymous expressions
- Can export object literals
- Easier to import
- Only **one default export** per module

```javascript
// Export anonymous function
export default function(x) { return x * x; }

// Export object literal
export default { name: "Module", version: "1.0" };

// Export expression
export default 1 + 2 + 3;
```

### Mixed Exports

A module can have both default and named exports (uncommon):

```javascript
export default class Histogram {}
export function mean(data) {}
export function stddev(data) {}
```

### Export Rules

✅ **Exports must be at top level** (not inside functions, loops, or conditionals)
✅ Enables static analysis before execution
✅ Named exports must have identifiers

---

## 2. Importing from Modules

### Importing Default Exports

```javascript
import BitSet from './bitset.js';
```

- Imported identifier is a **constant** (like `const`)
- You choose the name when importing
- No curly braces needed

### Importing Named Exports

```javascript
import { mean, stddev } from './stats.js';
```

- Use exact names from the exporting module
- Curly braces required
- Can import any subset of exports
- All imports are hoisted to the top

### Importing Everything (Wildcard)

```javascript
import * as stats from './stats.js';

// Use as object properties
stats.mean(data);
stats.stddev(data);
```

- Creates an object with all named exports as properties
- Properties are effectively constants (cannot be overwritten)

### Importing Default + Named Exports

```javascript
import Histogram, { mean, stddev } from './histogram-stats.js';
```

### Import for Side Effects Only

For modules that don't export anything but run code:

```javascript
import './analytics.js';
```

- Module runs the first time it's imported
- Subsequent imports do nothing
- Useful for initialization code, event handlers, etc.

---

## 3. Module Specifiers (Import Paths)

Module specifiers must be:

- **Absolute path**: `/path/to/module.js`
- **Relative path**: `./module.js` or `../module.js`
- **Complete URL**: `https://example.com/module.js`

```javascript
import { mean } from './stats.js'; // Same directory
import { mean } from '../lib/stats.js'; // Parent directory
import { mean } from '/utils/stats.js'; // Absolute path
```

**Important**:
❌ Bare module specifiers like `"lodash"` are **not allowed** in ES6 spec (though bundlers like webpack support them)
✅ Always use `"./util.js"` instead of `"util.js"`

---

## 4. Renaming Imports and Exports

### Renaming on Import

```javascript
import { render as renderImage } from './imageutils.js';
import { render as renderUI } from './ui.js';

// Now use: renderImage() and renderUI()
```

### Importing Default with Renaming

```javascript
import { default as Histogram, mean, stddev } from './histogram-stats.js';
```

The `default` keyword is a placeholder for the default export.

### Renaming on Export

```javascript
export { layout as calculateLayout, render as renderLayout };
```

**Note**: Cannot use expressions, only identifiers:

```javascript
// ❌ SyntaxError
export { Math.sin as sin, Math.cos as cos };
```

---

## 5. Re-Exports

Re-exporting allows you to aggregate exports from multiple modules.

### Basic Re-Export

**Without re-export syntax**:

```javascript
import { mean } from './stats/mean.js';
import { stddev } from './stats/stddev.js';
export { mean, stddev };
```

**With re-export syntax** (cleaner):

```javascript
export { mean } from './stats/mean.js';
export { stddev } from './stats/stddev.js';
```

### Re-Export with Wildcard

```javascript
export * from './stats/mean.js';
export * from './stats/stddev.js';
```

### Re-Export with Renaming

```javascript
export { mean, mean as average } from './stats/mean.js';
export { stddev } from './stats/stddev.js';
```

### Re-Exporting Default Exports

**Re-export default as named**:

```javascript
export { default as mean } from './stats/mean.js';
export { default as stddev } from './stats/stddev.js';
```

**Re-export named as default**:

```javascript
export { mean as default } from './stats.js';
```

**Re-export default as default**:

```javascript
export { default } from './stats/mean.js';
```

---

## 6. Modules in Web Browsers

### Using Modules in HTML

Use `<script type="module">`:

```html
<script type="module">
  import './main.js';
</script>
```

Or load a module file:

```html
<script type="module" src="./main.js"></script>
```

### Module Script Behavior

- Automatically in **strict mode**
- Loaded with **defer-like** behavior (wait for HTML parsing)
- Can use **async** attribute for immediate execution
- **Same-origin policy** or CORS required for cross-origin loads

### Browser Compatibility Fallback

```html
<!-- Modern browsers (support modules) -->
<script type="module" src="./app.js"></script>

<!-- Fallback for old browsers (IE11) -->
<script nomodule src="./app-es5.js"></script>
```

- Module-aware browsers ignore `nomodule`
- Old browsers ignore `type="module"`

### File Extensions

- `.js` - Standard JavaScript (works for modules)
- `.mjs` - Module JavaScript (optional, helps Node distinguish module systems)

For browsers, the extension doesn't matter (MIME type does: `text/javascript`).

---

## 7. Dynamic Imports

ES2020 introduces `import()` for **runtime module loading**.

### Syntax

```javascript
import('./stats.js').then((stats) => {
  let average = stats.mean(data);
});
```

### With async/await

```javascript
async function analyzeData(data) {
  let stats = await import('./stats.js');
  return {
    average: stats.mean(data),
    stddev: stats.stddev(data),
  };
}
```

### Dynamic Module Specifiers

Unlike static imports, the specifier can be any expression:

```javascript
let modulePath = './utils.js';
import(modulePath).then((module) => {
  /* ... */
});

// Conditional loading
if (condition) {
  import('./feature.js').then(/* ... */);
}

// Computed path
let locale = 'en';
import(`./i18n/${locale}.js`).then(/* ... */);
```

### Key Points

- `import()` looks like a function but is an **operator**
- Returns a **Promise** that resolves to a module object
- Module object is like `import * as` result
- Enables **code splitting** and **lazy loading**
- Works in browsers and bundlers (webpack)

**Not a function**:

```javascript
console.log(import);      // ❌ SyntaxError
let fn = import;          // ❌ SyntaxError
```

---

## 8. import.meta.url

`import.meta` is an object containing metadata about the current module.

### Primary Use: Resolving Relative URLs

```javascript
function localStringsURL(locale) {
  return new URL(`l10n/${locale}.json`, import.meta.url);
}
```

**Example**:

```javascript
// Module at: https://example.com/modules/app.js
console.log(import.meta.url);
// "https://example.com/modules/app.js"

// Load data file relative to module
let dataURL = new URL('./data.json', import.meta.url);
// "https://example.com/modules/data.json"
```

**Use cases**:

- Loading images, data files, or resources relative to the module
- Constructing paths to assets in the same directory
- In Node.js, returns `file://` URLs

**Only available in**:

- ES6 modules (`<script type="module">`)
- Not in regular scripts or Node `require()` modules

---

## 9. Module Loading Order

### Static Imports (Hoisted)

```javascript
console.log('This runs second');
import { mean } from './stats.js'; // Hoisted to top
console.log('This runs third');
```

All imports are hoisted and available before any code runs.

### HTML Script Execution

```html
<script type="module" src="a.js"></script>
<script type="module" src="b.js"></script>
<script type="module" src="c.js"></script>
```

- Scripts load as soon as encountered
- Execution waits until HTML parsing complete
- Modules execute in order (a → b → c)

With `async`:

```html
<script type="module" src="a.js" async></script>
```

- Executes as soon as loaded (may change order)

---

## 10. Node.js and ES6 Modules

Node.js supports both CommonJS and ES6 modules:

**ES6 Modules** (Node 13+):

- Use `.mjs` extension, or
- Set `"type": "module"` in `package.json`

**CommonJS** (traditional):

- Use `.js` extension (default)
- `require()` and `module.exports`

```javascript
// ES6 Module (file.mjs or "type": "module")
import fs from 'fs';
export function readFile() {}

// CommonJS (file.js)
const fs = require('fs');
module.exports = { readFile };
```

---

## Best Practices

✅ **Use named exports** for multiple values
✅ **Use default export** for single primary value
✅ **Place imports at the top** of files (convention, not required)
✅ **Use static imports** when possible (better optimization)
✅ **Use dynamic imports** for code splitting and lazy loading
✅ **Always use relative paths** (`./` or `../`) for local modules
✅ **Use `.mjs` extension** if writing for Node.js
✅ **Test with a local server**, not `file://` URLs
✅ **Use re-exports** to create aggregated module APIs

---

## Complete Example

**math.js** (exports):

```javascript
export const PI = Math.PI;
export function square(x) {
  return x * x;
}
export default function cube(x) {
  return x * x * x;
}
```

**app.js** (imports):

```javascript
import cube, { PI, square } from './math.js';

console.log(PI); // 3.14159...
console.log(square(5)); // 25
console.log(cube(3)); // 27
```

**HTML**:

```html
<script type="module" src="./app.js"></script>
```

---

## Key Concepts Summary

📌 **ES6 modules** use `import`/`export` for modularity
📌 **Each file** is its own module with private scope
📌 **Automatic strict mode** - no need for `"use strict"`
📌 **Static imports** are hoisted and resolved before execution
📌 **Named exports** use `export { }` syntax
📌 **Default exports** use `export default`
📌 **Module specifiers** must be absolute/relative paths or URLs
📌 **Re-exports** aggregate multiple modules
📌 **`<script type="module">`** loads ES6 modules in browsers
📌 **Dynamic `import()`** enables runtime loading
📌 **`import.meta.url`** provides module location for relative URLs
📌 **Cross-origin** modules require CORS headers
📌 **Node.js** supports both ES6 and CommonJS modules
