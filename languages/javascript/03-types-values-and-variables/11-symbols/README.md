# JavaScript Symbols

## What Are Symbols?

**Symbols** were introduced in **ES6** to serve as **non-string property names**.

**Core Purpose:**

- Provide unique, non-string property keys for objects
- Prevent property name collisions
- Enable language extension mechanisms without breaking existing code

## Creating Symbols

### Basic Creation

```javascript
let strname = 'string name'; // A string property name
let symname = Symbol('propname'); // A Symbol property name

typeof strname; // => "string"
typeof symname; // => "symbol"
```

**No literal syntax** - must use `Symbol()` function

### Symbol() Function Characteristics

```javascript
let sym1 = Symbol('description');
let sym2 = Symbol('description');

sym1 === sym2; // => false (ALWAYS unique!)
```

**Key behavior:** `Symbol()` **never returns the same value twice**, even with identical arguments.

## Using Symbols as Property Names

```javascript
let o = {}; // Create a new object
o[strname] = 1; // Define property with string name
o[symname] = 2; // Define property with Symbol name

o[strname]; // => 1: access the string-named property
o[symname]; // => 2: access the symbol-named property
```

**Why this matters:**

- Safe to add properties without overwriting existing ones
- If you don't share the Symbol, other code can't accidentally access/overwrite your property
- Perfect for private/internal properties

## Symbol Methods

### toString()

```javascript
let s = Symbol('sym_x');
s.toString(); // => "Symbol(sym_x)"
```

`toString()` is the **only interesting method** of Symbol instances.

## Global Symbol Registry

### Symbol.for() - Shared Symbols

```javascript
let s = Symbol.for('shared');
let t = Symbol.for('shared');

s === t; // => true (returns SAME Symbol!)
```

**How it works:**

- Takes a string argument
- Returns Symbol associated with that string
- If no Symbol exists for that string → creates new one and returns it
- If Symbol already exists → returns the existing one

**Key difference from Symbol():**

- `Symbol()` → never returns same value twice
- `Symbol.for()` → always returns same value for same string

### Symbol.keyFor() - Retrieve Key

```javascript
let s = Symbol.for('shared');
s.toString(); // => "Symbol(shared)"
Symbol.keyFor(s); // => "shared"
```

Gets the string key associated with a global Symbol.

## When to Use Each Type

### Symbol() - Private Symbols

**Use when:**

- You want symbols private to your code
- Guarantee your properties won't conflict with other code
- Creating internal/implementation details

```javascript
// Private property that other code can't access
const _privateData = Symbol('private');

class MyClass {
  constructor() {
    this[_privateData] = 'secret';
  }
}
```

### Symbol.for() - Shared Symbols

**Use when:**

- Defining extensions for other code to use
- Creating cross-module/cross-realm symbols
- Need same Symbol value in different parts of codebase

```javascript
// Multiple modules can access same Symbol
const LOG_LEVEL = Symbol.for('app.logLevel');

// In module A
obj[LOG_LEVEL] = 'debug';

// In module B - same Symbol!
console.log(obj[Symbol.for('app.logLevel')]);
```

## Practical Use Case: Language Extension

**Problem ES6 faced:**

- Needed to define standard iterator method for `for/of` loops
- Standardizing any string name would break existing code
- Solution: **Symbol.iterator**

```javascript
// Symbol.iterator is a well-known Symbol
let iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        if (i < 3) {
          return { value: i++, done: false };
        }
        return { done: true };
      },
    };
  },
};

for (let val of iterable) {
  console.log(val); // 0, 1, 2
}
```

This allows objects to become iterable without risking name collisions with existing properties.

## Well-Known Symbols

JavaScript defines several built-in Symbols for language behavior:

```javascript
Symbol.iterator; // Make objects iterable
Symbol.toStringTag; // Customize Object.prototype.toString()
Symbol.hasInstance; // Customize instanceof behavior
Symbol.species; // Control derived object creation
// ...and more
```

## Key Characteristics Summary

| Feature             | Symbol()           | Symbol.for()             |
| ------------------- | ------------------ | ------------------------ |
| **Returns**         | Always unique      | Same Symbol for same key |
| **Use case**        | Private properties | Shared/public Symbols    |
| **Registry**        | No                 | Global Symbol registry   |
| **Retrievable key** | No                 | Yes (Symbol.keyFor())    |

## Important Points

**Uniqueness:**

- Every `Symbol()` call creates a unique value
- Even identical descriptions produce different Symbols
- `Symbol.for()` with same string returns same Symbol

**Type:**

- `typeof Symbol()` returns `"symbol"`
- Not a string, number, or object

**Property enumeration:**

- Symbol properties are **not** enumerated in `for...in` loops
- Not returned by `Object.keys()`
- Not included in `JSON.stringify()`
- Use `Object.getOwnPropertySymbols()` to access them

**No coercion:**

- Symbols cannot be implicitly converted to strings or numbers
- Must explicitly call `.toString()` or `.valueOf()`

## Common Patterns

### Creating Private Properties

```javascript
const _private = Symbol('private');

class Example {
  constructor() {
    this[_private] = 'hidden data';
  }

  getPrivate() {
    return this[_private];
  }
}
```

### Defining Custom Iterator

```javascript
const obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.data[index],
        done: index++ >= this.data.length,
      }),
    };
  },
};
```

### Creating Shared Constants

```javascript
// config.js
export const CONFIG_KEY = Symbol.for('app.config');

// module-a.js
import { CONFIG_KEY } from './config.js';
globalThis[CONFIG_KEY] = { theme: 'dark' };

// module-b.js - can access same Symbol
const config = globalThis[Symbol.for('app.config')];
```

## Bottom Line

- **Symbols provide unique property keys** that won't collide with strings
- Use `Symbol()` for **private properties** (always unique)
- Use `Symbol.for()` for **shared symbols** across modules
- Primary use: **language extensions** and **preventing property name conflicts**
- The **only interesting method** is `toString()`
- Essential for making objects iterable via `Symbol.iterator`
