# JavaScript Functions as Namespaces

## What Are Function Namespaces?

**Function namespaces** use functions to create isolated scopes, preventing variables from cluttering the global namespace. Variables declared within a function are not visible outside of it, making functions perfect temporary containers for code.

## The Problem: Global Namespace Pollution

When you write reusable code that will be used across multiple programs or web pages, you risk variable name conflicts:

```javascript
// Problem: These variables are global
var count = 0;
var data = [];
var result = null;

// If another script also uses 'count', 'data', or 'result',
// there will be conflicts!
```

## Solution 1: Named Function Namespace

Wrap your code in a function and invoke it immediately:

```javascript
function chunkNamespace() {
  // Chunk of code goes here
  var count = 0;
  var data = [];
  var result = null;

  // All variables are local to this function
  // They don't pollute the global namespace

  // Your code logic here...
}

chunkNamespace(); // Don't forget to invoke it!
```

**Result**: Only one global variable is created: `chunkNamespace`

**Limitation**: Still creates one global variable (the function name)

---

## Solution 2: Immediately Invoked Function Expression (IIFE)

Define and invoke an **anonymous function** in a single expression to avoid creating any global variables:

```javascript
(function () {
  // Chunk of code goes here
  var count = 0;
  var data = [];
  var result = null;

  // All variables are local
  // No global namespace pollution at all!
})();
```

### Why the Parentheses?

**Without parentheses** (syntax error):

```javascript
function() {
  // code
}();
// SyntaxError: Function statements require a name
```

**With parentheses** (correct):

```javascript
(function () {
  // code
})();
// Parentheses tell JavaScript this is an expression, not a declaration
```

### Alternative IIFE Syntax

Both forms are valid and commonly used:

```javascript
// Style 1: Parentheses wrap everything
(function () {
  // code
})();

// Style 2: Parentheses wrap function only
(function () {
  // code
})();
```

---

## How IIFE Works

### Step-by-Step Breakdown

```javascript
(function () {
  var message = 'Hello from IIFE';
  console.log(message);
})();

console.log(message); // ReferenceError: message is not defined
```

1. **Function definition**: `(function() { ... })` creates an anonymous function
2. **Immediate invocation**: `()` executes the function right away
3. **Scope isolation**: Variables inside are not accessible outside

---

## Passing Arguments to IIFE

You can pass values into the IIFE:

```javascript
(function (name, age) {
  console.log(`Name: ${name}, Age: ${age}`);
})('Alice', 30);

// Output: Name: Alice, Age: 30
```

### Common Pattern: Passing Global Objects

```javascript
(function (window, document, undefined) {
  // Use window and document as local variables
  // Faster property lookup and safer undefined reference

  var element = document.getElementById('app');
  window.myApp = {
    /* ... */
  };
})(window, document);
```

**Benefits**:

- Faster property access (local vs global)
- Protection against `undefined` being overwritten (in older JavaScript)
- Clear dependencies

---

## Returning Values from IIFE

IIFEs can return values, creating **closures**:

```javascript
var counter = (function () {
  var count = 0; // Private variable

  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getCount: function () {
      return count;
    },
  };
})();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
console.log(count); // ReferenceError: count is not defined
```

**Key concept**: The returned functions have access to the private `count` variable through **closure**.

---

## Understanding Closures

**Closure**: A function that has access to variables from its parent scope, even after the parent function has finished executing.

```javascript
var createGreeter = (function () {
  var greeting = 'Hello'; // Private variable

  return function (name) {
    return greeting + ', ' + name + '!';
  };
})();

console.log(createGreeter('Alice')); // "Hello, Alice!"
console.log(greeting); // ReferenceError
```

The returned function "closes over" the `greeting` variable, maintaining access to it.

---

## Practical Use Cases

### 1. Module Pattern

Create private and public members:

```javascript
var Calculator = (function () {
  // Private variables and functions
  var history = [];

  function log(operation) {
    history.push(operation);
  }

  // Public API
  return {
    add: function (a, b) {
      var result = a + b;
      log(`${a} + ${b} = ${result}`);
      return result;
    },

    subtract: function (a, b) {
      var result = a - b;
      log(`${a} - ${b} = ${result}`);
      return result;
    },

    getHistory: function () {
      return history.slice(); // Return copy
    },
  };
})();

Calculator.add(5, 3); // 8
Calculator.subtract(10, 4); // 6
console.log(Calculator.getHistory()); // ["5 + 3 = 8", "10 - 4 = 6"]
console.log(Calculator.history); // undefined (private)
```

### 2. Avoiding Global Variables

```javascript
// BAD: Global pollution
var config = { apiUrl: 'https://api.example.com' };
var users = [];
var currentUser = null;

// GOOD: Isolated namespace
(function () {
  var config = { apiUrl: 'https://api.example.com' };
  var users = [];
  var currentUser = null;

  // Only expose what's needed
  window.UserManager = {
    login: function (user) {
      currentUser = user;
    },
    getUsers: function () {
      return users.slice();
    },
  };
})();
```

### 3. Initialization Code

Run code once without polluting global scope:

```javascript
(function () {
  // Setup code that runs immediately
  var isDevelopment = true;
  var apiEndpoint = isDevelopment
    ? 'http://localhost:3000'
    : 'https://api.production.com';

  // Initialize app
  console.log('App initialized with endpoint:', apiEndpoint);

  // Set up event listeners
  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM ready');
  });
})();
```

### 4. Library/Plugin Pattern

Create self-contained libraries:

```javascript
var MyLibrary = (function () {
  // Private
  var version = '1.0.0';

  function privateHelper() {
    return 'Helper function';
  }

  // Public API
  return {
    init: function (config) {
      console.log('Initializing v' + version);
    },

    doSomething: function () {
      return privateHelper();
    },
  };
})();

MyLibrary.init();
MyLibrary.doSomething();
```

---

## Modern Alternatives

### ES6 Block Scope (let/const)

With ES6+, you can use block scope instead of function scope:

```javascript
// Old way: IIFE
(function () {
  var temp = 42;
  console.log(temp);
})();

// Modern way: Block scope
{
  let temp = 42;
  console.log(temp);
}

console.log(temp); // ReferenceError (both examples)
```

### ES6 Modules

Modern JavaScript uses modules for namespace isolation:

```javascript
// module.js
const privateVar = 'private';

export function publicFunction() {
  return privateVar;
}

// main.js
import { publicFunction } from './module.js';
```

**Note**: Modules are the preferred approach in modern JavaScript, but IIFEs are still useful for:

- Browser scripts without module support
- Creating closures
- One-time initialization code
- Legacy codebases

---

## Key Concepts Summary

✅ **Function namespaces** prevent global namespace pollution
✅ **IIFE** (Immediately Invoked Function Expression) creates isolated scope without global variables
✅ **Parentheses** are required to make the function an expression, not a declaration
✅ **IIFEs can accept parameters** for dependency injection
✅ **IIFEs can return values** to create public APIs with private data
✅ **Closures** allow returned functions to access private variables
✅ **Module pattern** uses IIFEs to create objects with private/public members
✅ **Modern alternatives** include `let`/`const` block scope and ES6 modules

---

## Common Patterns Cheat Sheet

```javascript
// Basic IIFE
(function () {
  // code
})();

// IIFE with parameters
(function (param) {
  console.log(param);
})('value');

// IIFE returning value
var result = (function () {
  return 'result';
})();

// Module pattern
var Module = (function () {
  var private = 'private';
  return {
    public: function () {
      return private;
    },
  };
})();

// Named IIFE (useful for debugging)
(function myFunction() {
  // Function name appears in stack traces
})();
```

---

## Best Practices

✅ Use IIFEs to avoid polluting the global namespace
✅ Return objects from IIFEs to create modules with public APIs
✅ Use closures to keep data private
✅ Pass global objects as parameters for better performance
✅ Use named IIFEs for easier debugging
✅ Consider modern alternatives (modules, `let`/`const`) for new projects
✅ Use IIFEs for initialization code that should run once
