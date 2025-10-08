# JavaScript

## What is JavaScript?

- **Most-deployed programming language in history** - runs in all modern web browsers (desktops, tablets, phones)
- **Most-used programming language among developers** thanks to Node.js success
- **High-level, dynamic, interpreted** language supporting object-oriented and functional programming
- **Untyped variables** with syntax loosely based on Java (but languages are completely unrelated)
- **First-class functions** from Scheme, **prototype-based inheritance** from Self
- **Misleading name**: Despite syntactic resemblance, JavaScript is completely different from Java
- Evolved from scripting roots to **robust, general-purpose language** for serious software engineering

## Language Versions & Standards

- **JavaScript vs ECMAScript**: "JavaScript" is Oracle trademark; standardized by ECMA as "ECMAScript (ES)"
- **ES5**: Compatibility baseline (2010s standard supported by all browsers)
- **ES6 (2015)**: Revolutionary update - added classes and modules, transformed JavaScript into serious general-purpose language
- **ES2016-2020+**: Yearly release cadence, versions identified by year
- **Strict mode**: `"use strict"` directive corrects early language flaws
  - Automatically enabled in ES6+ classes and modules
  - Disables legacy flawed features
  - Maintains backward compatibility while improving code quality

## Host Environments

### Core JavaScript

- **Minimal API**: Numbers, text, arrays, sets, maps
- **No built-in I/O**: Input/output depends on host environment

### Web Browsers (Original Environment)

- Most common execution environment
- **Input**: Mouse, keyboard, HTTP requests
- **Output**: HTML, CSS rendering
- User interaction and display

### Node.js (Since 2010)

- Full operating system access
- Read/write files
- Network send/receive data
- HTTP server implementation
- **Use cases**: Web servers, utility scripts (shell script alternative)

## Basic Syntax

### Variables & Types

```javascript
let x = 0; // Numbers
x = 'hello'; // Strings
x = true; // Booleans
x = null; // Null value
x = undefined; // Undefined value
```

### Objects & Arrays

```javascript
// Objects: name/value pairs
let book = {
  topic: 'JavaScript',
  edition: 7,
};
book.topic; // Dot notation
book['edition']; // Bracket notation
book.author = 'Flanagan'; // Create properties
book.contents?.ch01?.sect1; // Optional chaining (ES2020)

// Arrays: numerically indexed lists
let primes = [2, 3, 5, 7];
primes[0]; // => 2 (first element)
primes.length; // => 4
primes[4] = 9; // Add by assignment

// Nested structures
let points = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];
```

### Operators

```javascript
// Arithmetic
3 + 2; // Addition
3 - 2; // Subtraction
3 * 2; // Multiplication
3 / 2; // Division
'3' + '2'; // => "32" (concatenation)

// Shorthand
count++; // Increment
count--; // Decrement
count += 2; // Add and assign
count *= 3; // Multiply and assign

// Equality & Relational
x === y; // Equality
x !== y; // Inequality
x < y, x <= y; // Less than (or equal)
x > y,
  (x >=
    y(
      // Greater than (or equal)

      // Logical
      x === 2
    ) &&
    (y === 3)(
      // AND
      x > 3
    )) ||
    y < 3; // OR
!(x === y); // NOT
```

### Functions

```javascript
// Traditional function
function plus1(x) {
  return x + 1;
}

// Function as value
let square = function (x) {
  return x * x;
};

// Arrow function (ES6+)
const plus1 = (x) => x + 1;
const square = (x) => x * x;

// Methods on objects/arrays
let a = [];
a.push(1, 2, 3); // Add elements
a.reverse(); // Reverse order

// Custom methods (this keyword)
points.dist = function () {
  let p1 = this[0];
  let p2 = this[1];
  let a = p2.x - p1.x;
  let b = p2.y - p1.y;
  return Math.sqrt(a * a + b * b);
};
```

### Control Structures

```javascript
// Conditionals (if/else)
function abs(x) {
  if (x >= 0) {
    return x;
  } else {
    return -x;
  }
}

// For...of loop
function sum(array) {
  let sum = 0;
  for (let x of array) {
    sum += x;
  }
  return sum;
}

// While loop
function factorial(n) {
  let product = 1;
  while (n > 1) {
    product *= n;
    n--;
  }
  return product;
}

// Traditional for loop
for (i = 2; i <= n; i++) {
  product *= i;
}
```

### Classes (ES6+)

```javascript
class Point {
  constructor(x, y) {
    // Initialize new instances
    this.x = x; // this = new object
    this.y = y;
  }

  distance() {
    // Method
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

let p = new Point(1, 1); // Create instance
p.distance(); // Call method
```

## Key Concepts

- **Expressions**: Compute values, don't alter state
- **Statements**: Alter program state, don't have values
- **Methods**: Functions assigned to object properties
- **this keyword**: Refers to object on which method is invoked
- **Initializer expressions**: Array `[]` and object `{}` literal syntax

## Development Tools

### Browser Console

- Open with F12, Ctrl-Shift-I, or Command-Option-I
- Console tab for testing code
- Detachable as separate window

### Node.js REPL

```bash
$ node
> let x = 2, y = 3;
> x + y
5
```

### Running Files

```bash
node snippet.js           # Execute file
```

### Console Output

```javascript
console.log('Hello World!'); // Print to console

// In HTML
<script src='hello.js'></script>;
```

## Book Structure Overview

1. **Low-level fundamentals**: Comments, variables, types
2. **Core concepts**: Expressions, statements, objects, functions
3. **Advanced features**: Classes, modules
4. **Standard library**: Built-in functions, data structures, regex
5. **Iterators & Generators**: for/of loops, yield
6. **Asynchronous JavaScript**: Callbacks, Promises, async/await
7. **Metaprogramming**: Advanced features for library authors
8. **Web Browsers**: Browser environment and APIs
9. **Node.js**: Server-side programming
10. **Tools & Extensions**: Productivity enhancements

## Learning Approach

- **Bottom-up structure**: Low-level details → high-level abstractions
- **Non-linear learning**: Cross-references throughout, skip sections if needed
- **Detailed coverage**: True mastery requires understanding details
- **Practical examples**: Real-world code demonstrations
- **Progressive complexity**: Return to master details after gaining working knowledge
