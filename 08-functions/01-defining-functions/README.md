# JavaScript Defining Functions

JavaScript provides multiple ways to define functions, each with specific syntax and use cases.

---

## 1. Function Declarations

The most straightforward way to define a function using the `function` keyword.

### Syntax

```javascript
function functionName(parameters) {
  // function body
  return value; // optional
}
```

### Components

1. **`function` keyword**: Required
2. **Function name**: Required identifier (becomes a variable)
3. **Parameters**: Comma-separated list in parentheses (can be empty)
4. **Function body**: Statements in curly braces

### Examples

```javascript
// Print object properties
function printprops(o) {
  for (let p in o) {
    console.log(`${p}: ${o[p]}\n`);
  }
}

// Compute distance between two points
function distance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Recursive function for factorial
function factorial(x) {
  if (x <= 1) return 1;
  return x * factorial(x - 1);
}
```

### Key Characteristics

**Hoisting**: Function declarations are hoisted to the top of their scope

```javascript
// This works! Function can be called before declaration
console.log(greet('Alice')); // "Hello, Alice"

function greet(name) {
  return `Hello, ${name}`;
}
```

**Return values**:

- `return expression;` - Returns the expression value
- `return;` or no return - Returns `undefined`

**Scope (ES6+)**:

- Top-level: Available throughout the file
- Inside blocks: Only visible within that block (strict mode)

---

## 2. Function Expressions

Functions defined as part of an expression. The name is **optional**.

### **Syntax**

```javascript
const functionName = function (parameters) {
  // function body
};
```

### **Examples**

```javascript
// Anonymous function expression
const square = function (x) {
  return x * x;
};

// Named function expression (useful for recursion)
const f = function fact(x) {
  if (x <= 1) return 1;
  else return x * fact(x - 1);
};

// As argument to another function
[3, 2, 1].sort(function (a, b) {
  return a - b;
});

// Immediately Invoked Function Expression (IIFE)
let tensquared = (function (x) {
  return x * x;
})(10);
```

### **Key Characteristics**

**Not hoisted**: Must be defined before use

```javascript
// This fails! Function doesn't exist yet
console.log(greet('Alice')); // ReferenceError

const greet = function (name) {
  return `Hello, ${name}`;
};
```

**Variable assignment**: You control where the function is stored

```javascript
const myFunc = function () {
  /* ... */
};
```

**Best practice**: Use `const` to prevent accidental reassignment

**Named function expressions**: The name is only visible inside the function

```javascript
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // 'fact' is only accessible here
};

console.log(factorial(5)); // Works
console.log(fact(5)); // ReferenceError: fact is not defined
```

---

## 3. Arrow Functions (ES6)

Compact syntax using `=>` arrow notation. Always anonymous expressions.

### Basic Syntax

```javascript
const functionName = (parameters) => {
  // function body
};
```

### Syntax Variations

**Multiple parameters**:

```javascript
const sum = (x, y) => {
  return x + y;
};
```

**Single expression (implicit return)**:

```javascript
const sum = (x, y) => x + y; // No braces, no return keyword
```

**Single parameter (no parentheses needed)**:

```javascript
const square = (x) => x * x;
const polynomial = (x) => x * x + 2 * x + 3;
```

**No parameters (empty parentheses required)**:

```javascript
const constantFunc = () => 42;
const getRandom = () => Math.random();
```

**Returning object literals (use parentheses)**:

```javascript
const f = (x) => {
  return { value: x };
}; // Explicit return
const g = (x) => ({ value: x }); // Implicit return with parens
const h = (x) => {
  value: x;
}; // Wrong! Returns undefined
```

### Examples

```javascript
// Filter array
let filtered = [1, null, 2, 3].filter((x) => x !== null);
// [1,2,3]

// Map array
let squares = [1, 2, 3, 4].map((x) => x * x);
// [1,4,9,16]

// Reduce array
let sum = [1, 2, 3, 4].reduce((acc, x) => acc + x, 0);
// 10

// Sort array
let sorted = [3, 1, 4, 1, 5].sort((a, b) => a - b);
// [1,1,3,4,5]
```

### Key Characteristics

**Lexical `this`**: Inherits `this` from surrounding context (doesn't define its own)

```javascript
function Person() {
  this.age = 0;

  setInterval(() => {
    this.age++; // 'this' refers to Person object
  }, 1000);
}
```

**No `prototype` property**: Cannot be used as constructors

```javascript
const Func = () => {};
new Func(); // TypeError: Func is not a constructor
```

**Ideal for**: Callbacks, array methods, and inline functions

---

## 4. Nested Functions

Functions defined inside other functions with access to outer function variables.

### Example

```javascript
function hypotenuse(a, b) {
  function square(x) {
    return x * x;
  }
  return Math.sqrt(square(a) + square(b));
}
```

### Scope Rules

Inner functions can access:

- Parameters of outer function
- Variables of outer function
- Their own local variables

```javascript
function outer(x) {
  let outerVar = 10;

  function inner(y) {
    // Can access x, outerVar, and y
    return x + y + outerVar;
  }

  return inner(5);
}

console.log(outer(3)); // 18 (3 + 5 + 10)
```

---

## 5. Method Definition Shorthand

Compact syntax for defining methods in objects and classes.

### Object Literal Shorthand

```javascript
let obj = {
  // Traditional
  method1: function (x) {
    return x * 2;
  },

  // Shorthand (ES6)
  method2(x) {
    return x * 2;
  },
};
```

### Getter and Setter Methods

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
};

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
```

---

## 6. Other Function Types

### Function Constructor (Rarely Used)

```javascript
const sum = new Function('x', 'y', 'return x + y');
console.log(sum(2, 3)); // 5
```

### Generator Functions

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generateSequence();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

### Async Functions

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}
```

---

## Comparison of Function Types

| Feature                | Declaration         | Expression                | Arrow Function           |
| ---------------------- | ------------------- | ------------------------- | ------------------------ |
| **Syntax**             | `function f() {}`   | `const f = function() {}` | `const f = () => {}`     |
| **Name**               | Required            | Optional                  | None                     |
| **Hoisting**           | ✅ Yes              | ❌ No                     | ❌ No                    |
| **`this` binding**     | Own context         | Own context               | Lexical (inherited)      |
| **Constructor**        | ✅ Yes              | ✅ Yes                    | ❌ No                    |
| **`arguments` object** | ✅ Yes              | ✅ Yes                    | ❌ No                    |
| **Best for**           | Top-level functions | Callbacks, conditionals   | Array methods, callbacks |

---

## When to Use Each

### Use Function Declarations when

- Defining top-level utility functions
- Need hoisting behavior
- Function name aids readability

### Use Function Expressions when

- Assigning functions conditionally
- Need named recursion within expression
- Creating IIFEs

### Use Arrow Functions when

- Passing callbacks to array methods
- Need lexical `this` binding
- Want concise syntax for simple functions
- Defining inline functions

### Use Nested Functions when

- Need helper functions with access to outer scope
- Implementing closures
- Organizing complex logic

---

## Best Practices

✅ **Use `const`** for function expressions to prevent reassignment
✅ **Arrow functions** for callbacks and array methods
✅ **Function declarations** for main/utility functions
✅ **Descriptive names** improve code readability
✅ **Single responsibility** - each function should do one thing
✅ **Return explicitly** when function computes a value
✅ **Use arrow functions** when you need lexical `this`
✅ **Avoid Function constructor** - use other methods instead

---

## Key Concepts Summary

📌 **Three main ways**: Declaration, Expression, Arrow
📌 **Hoisting**: Only declarations are hoisted
📌 **Arrow functions**: Compact syntax, lexical `this`, no constructor
📌 **Nested functions**: Access outer scope variables (closures)
📌 **Return statement**: Returns value or `undefined` if omitted
📌 **Function expressions**: Not hoisted, must be defined before use
📌 **Named expressions**: Name only visible inside function
📌 **Method shorthand**: Cleaner syntax in objects/classes
📌 **Special types**: Generators (`function*`), Async (`async function`)
📌 **`this` binding**: Arrow functions inherit, others create own context
