# JavaScript Modules with Classes, Objects, and Closures

## Overview

Modules help organize code and prevent namespace pollution. JavaScript provides several approaches to modularity, from simple object-based organization to sophisticated closure-based patterns and modern ES6 modules.

---

## 1. Classes as Modules

### Natural Modularity

Classes naturally provide modularity because methods are defined as properties of independent prototype objects.

```javascript
class SingletonSet {
  constructor(value) {
    this.value = value;
  }

  has(x) {
    return x === this.value;
  }
}

class BitSet {
  constructor(max) {
    this.bits = new Uint8Array(Math.ceil(max / 8));
  }

  has(n) {
    // Different implementation, no conflict with SingletonSet.has()
    let byte = Math.floor(n / 8);
    let bit = n % 8;
    return (this.bits[byte] & (1 << bit)) !== 0;
  }
}

// No naming conflicts - each class has its own 'has' method
let s1 = new SingletonSet(5);
let s2 = new BitSet(100);
console.log(s1.has(5)); // true
console.log(s2.has(5)); // false
```

**Why this works**: Each method belongs to a different prototype object, so they don't interfere with each other.

---

## 2. Object-Based Modularity

### Grouping Related Functionality

Instead of creating global classes, group them as properties of a single object:

```javascript
// Instead of global classes
class SingletonSet { ... }
class BitSet { ... }
class RangeSet { ... }

// Group them in a namespace object
const Sets = {
  Singleton: class {
    constructor(value) {
      this.value = value;
    }
    has(x) {
      return x === this.value;
    }
  },

  Bit: class {
    constructor(max) {
      this.bits = new Uint8Array(Math.ceil(max / 8));
    }
    has(n) {
      // Implementation...
    }
  },

  Range: class {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }
    has(x) {
      return x >= this.from && x <= this.to;
    }
  }
};

// Usage
let s1 = new Sets.Singleton(5);
let s2 = new Sets.Bit(100);
let s3 = new Sets.Range(1, 10);
```

### Math Object Pattern

JavaScript's built-in `Math` object demonstrates this pattern:

```javascript
// Instead of global functions
function sqrt(x) { ... }
function sin(x) { ... }
function cos(x) { ... }

// Grouped as properties
Math.sqrt(16);   // 4
Math.sin(0);     // 0
Math.PI;         // 3.14159...
```

---

## 3. Closure-Based Modularity

### Hiding Implementation Details

Simple object-based modularity doesn't hide internal details. **Closures** solve this by creating private variables and functions.

### IIFE (Immediately Invoked Function Expression) Pattern

```javascript
const BitSet = (function () {
  // Private implementation details
  function isValid(set, n) {
    return Number.isInteger(n) && n >= 0 && n < set.max;
  }

  function has(set, byte, bit) {
    return (set.bits[byte] & (1 << bit)) !== 0;
  }

  // Private constants
  const BITS = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
  const MASKS = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);

  // Public API: the BitSet class
  return class BitSet {
    constructor(max) {
      this.max = max;
      this.bits = new Uint8Array(Math.ceil(max / 8));
    }

    insert(n) {
      if (isValid(this, n)) {
        // Uses private function
        let byte = Math.floor(n / 8);
        this.bits[byte] |= BITS[n % 8]; // Uses private constant
      }
    }

    has(n) {
      if (isValid(this, n)) {
        let byte = Math.floor(n / 8);
        return has(this, byte, n % 8); // Uses private function
      }
      return false;
    }
  };
})();

// Usage
let bitset = new BitSet(100);
bitset.insert(10);
console.log(bitset.has(10)); // true

// Private functions are not accessible
// console.log(isValid);  // ReferenceError
```

**Key benefits**:

- ✅ Private functions (`isValid`, `has`)
- ✅ Private constants (`BITS`, `MASKS`)
- ✅ Clean public API (only `BitSet` class)

---

## 4. Multi-Item Modules

### Exporting Multiple Functions

```javascript
const stats = (function () {
  // Private utility functions
  const sum = (x, y) => x + y;
  const square = (x) => x * x;

  // Public function
  function mean(data) {
    return data.reduce(sum) / data.length;
  }

  // Public function
  function stddev(data) {
    let m = mean(data);
    return Math.sqrt(
      data
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
        (data.length - 1)
    );
  }

  // Export public API
  return { mean, stddev };
})();

// Usage
console.log(stats.mean([1, 3, 5, 7, 9])); // 5
console.log(stats.stddev([1, 3, 5, 7, 9])); // Math.sqrt(10)

// Private functions are hidden
// console.log(stats.sum);  // undefined
```

---

## 5. Automating Closure-Based Modularity

### The Problem

Manually wrapping code in IIFEs is tedious. **Build tools** automate this process.

### Manual Transformation

**Before** (sets.js):

```javascript
class BitSet {
  // Implementation...
}
```

**After** (wrapped):

```javascript
const BitSet = (function () {
  // Private details...
  return class BitSet {
    // Implementation...
  };
})();
```

### Module Bundler Pattern

Build tools like **webpack** and **Parcel** bundle multiple files:

```javascript
// Bundled output
const modules = {};

function require(moduleName) {
  return modules[moduleName];
}

modules['sets.js'] = (function () {
  const exports = {};

  // Contents of sets.js
  exports.BitSet = class BitSet {
    constructor(max) {
      this.max = max;
      this.bits = new Uint8Array(Math.ceil(max / 8));
    }
    // Methods...
  };

  return exports;
})();

modules['stats.js'] = (function () {
  const exports = {};

  // Contents of stats.js
  const sum = (x, y) => x + y;
  const square = (x) => x * x;

  exports.mean = function (data) {
    return data.reduce(sum) / data.length;
  };

  exports.stddev = function (data) {
    let m = exports.mean(data);
    return Math.sqrt(
      data
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
        (data.length - 1)
    );
  };

  return exports;
})();
```

### Using Bundled Modules

```javascript
// Import modules
const stats = require('stats.js');
const BitSet = require('sets.js').BitSet;

// Use them
let s = new BitSet(100);
s.insert(10);
s.insert(20);
s.insert(30);

let average = stats.mean([...s]); // 20
```

---

## 6. Modern ES6 Modules

### Native JavaScript Modules

ES6 introduced built-in module syntax:

**sets.js**:

```javascript
// Private helper functions
function isValid(set, n) {
  return Number.isInteger(n) && n >= 0 && n < set.max;
}

// Export public class
export class BitSet {
  constructor(max) {
    this.max = max;
    this.bits = new Uint8Array(Math.ceil(max / 8));
  }

  insert(n) {
    if (isValid(this, n)) {
      // Implementation...
    }
  }
}

export class RangeSet {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  has(x) {
    return x >= this.from && x <= this.to;
  }
}
```

**stats.js**:

```javascript
// Private utilities
const sum = (x, y) => x + y;
const square = (x) => x * x;

// Named exports
export function mean(data) {
  return data.reduce(sum) / data.length;
}

export function stddev(data) {
  let m = mean(data);
  return Math.sqrt(
    data
      .map((x) => x - m)
      .map(square)
      .reduce(sum) /
      (data.length - 1)
  );
}
```

**main.js** (using the modules):

```javascript
// Import specific exports
import { BitSet, RangeSet } from './sets.js';
import { mean, stddev } from './stats.js';

// Or import everything
import * as stats from './stats.js';

// Usage
let s = new BitSet(100);
s.insert(10);
s.insert(20);

let average = mean([10, 20]);
console.log(average); // 15
```

---

## Comparison of Module Patterns

| Pattern                | Privacy | Syntax                | Browser Support | Use Case              |
| ---------------------- | ------- | --------------------- | --------------- | --------------------- |
| **Object-based**       | ❌ None | Simple                | ✅ All          | Simple namespacing    |
| **IIFE**               | ✅ Yes  | Manual                | ✅ All          | Hiding implementation |
| **CommonJS (require)** | ✅ Yes  | `require()`/`exports` | ❌ Node only    | Server-side (Node.js) |
| **ES6 Modules**        | ✅ Yes  | `import`/`export`     | ✅ Modern       | Modern applications   |

---

## Key Concepts Summary

📌 **Classes are naturally modular** - methods don't conflict across classes
📌 **Object-based modules** group related functionality (e.g., `Math` object)
📌 **Closures enable privacy** - hide implementation details with IIFEs
📌 **Module bundlers** automate wrapping code in closures
📌 **CommonJS** uses `require()` and `exports` (Node.js pattern)
📌 **ES6 modules** use `import`/`export` (modern standard)
📌 **Private details** (utilities, constants) stay hidden in closures
📌 **Public API** is explicitly exported/returned

---

## Best Practices

✅ Use **ES6 modules** (`import`/`export`) for modern projects
✅ Use **object namespaces** for simple grouping without privacy needs
✅ Use **IIFEs with closures** when you need privacy without build tools
✅ Keep **implementation details private** (helper functions, constants)
✅ Export **only the public API** users need
✅ Use **build tools** (webpack, Parcel) to bundle modules for browsers
✅ Follow **one module per file** convention for maintainability
