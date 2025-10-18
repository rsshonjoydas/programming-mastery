# JavaScript Functions as Values

## Core Concept

In JavaScript, **functions are not just syntax—they are values**. This means functions can be:

- Assigned to variables
- Stored in object properties
- Stored in array elements
- Passed as arguments to other functions
- Returned from functions

This is a fundamental feature that makes JavaScript a **functional programming language**.

---

## Functions as Variables

### Basic Assignment

```javascript
function square(x) {
  return x * x;
}

let s = square; // Assign function to another variable
square(4); // 16
s(4); // 16 (same function, different name)
```

**Key point**: The function name is just a variable that refers to the function object. The name itself is not special.

---

## Functions as Object Properties (Methods)

When functions are assigned to object properties, they're called **methods**:

```javascript
let o = {
  square: function (x) {
    return x * x;
  },
};

let y = o.square(16); // 256
```

**Modern syntax** (ES6 shorthand):

```javascript
let o = {
  square(x) {
    return x * x;
  },
};
```

---

## Functions in Arrays

Functions can be stored as array elements:

```javascript
let a = [(x) => x * x, 20]; // Array with function and number
a[0](a[1]); // 400 (calls function with 20)
```

The syntax `a[0](a[1])` looks unusual but is a valid function invocation:

- `a[0]` retrieves the function
- `(a[1])` invokes it with the second array element as argument

---

## Functions as Arguments (Higher-Order Functions)

Functions that accept other functions as arguments are called **higher-order functions**.

### Example: Array.sort()

```javascript
let numbers = [3, 1, 4, 1, 5, 9];

// Sort numerically (ascending)
numbers.sort((a, b) => a - b);
// [1, 1, 3, 4, 5, 9]

// Sort numerically (descending)
numbers.sort((a, b) => b - a);
// [9, 5, 4, 3, 1, 1]
```

The `sort()` method is flexible because it accepts a **comparator function** that defines the sort order.

### Custom Example: operate() Function

```javascript
// Define simple operation functions
function add(x, y) {
  return x + y;
}
function subtract(x, y) {
  return x - y;
}
function multiply(x, y) {
  return x * y;
}
function divide(x, y) {
  return x / y;
}

// Higher-order function that takes a function as argument
function operate(operator, operand1, operand2) {
  return operator(operand1, operand2);
}

// Use it
operate(add, 2, 3); // 5
operate(multiply, 4, 5); // 20

// Nested invocations: (2+3) + (4*5)
let result = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));
// result = 25
```

### Storing Functions in Objects

```javascript
const operators = {
  add: (x, y) => x + y,
  subtract: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
  pow: Math.pow, // Can reference existing functions
};

// Function that looks up operator by name
function operate2(operation, operand1, operand2) {
  if (typeof operators[operation] === 'function') {
    return operators[operation](operand1, operand2);
  } else {
    throw 'unknown operator';
  }
}

// Use it
operate2('add', 'hello', operate2('add', ' ', 'world')); // "hello world"
operate2('pow', 10, 2); // 100
```

---

## Function Properties (Static Variables)

Functions are **specialized objects**, so they can have properties. This is useful for creating **static variables** that persist across invocations.

### Example 1: Unique Integer Generator

```javascript
// Initialize counter property before function definition
// (function declarations are hoisted)
uniqueInteger.counter = 0;

function uniqueInteger() {
  return uniqueInteger.counter++; // Return and increment
}

uniqueInteger(); // 0
uniqueInteger(); // 1
uniqueInteger(); // 2
```

**Why use function properties?**

- Avoids global variables
- Data is encapsulated with the function
- Persists across invocations

### Example 2: Memoization (Caching Results)

Factorial function that caches computed results:

```javascript
function factorial(n) {
  if (Number.isInteger(n) && n > 0) {
    if (!(n in factorial)) {
      // Check if result cached
      factorial[n] = n * factorial(n - 1); // Compute and cache
    }
    return factorial[n]; // Return cached result
  } else {
    return NaN;
  }
}

factorial[1] = 1; // Initialize base case

factorial(6); // 720 (computes and caches 2, 3, 4, 5, 6)
factorial[5]; // 120 (already cached from previous call)
factorial(3); // 6 (uses cached value, no recomputation)
```

**Benefits of memoization**:

- Improves performance for expensive computations
- Avoids redundant calculations
- Uses the function itself as storage

---

## Practical Use Cases

### 1. Callback Functions

```javascript
// Event handlers
button.addEventListener('click', function () {
  console.log('Button clicked!');
});

// Asynchronous operations
setTimeout(() => console.log('Delayed message'), 1000);

// Array methods
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]
let evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
```

### 2. Function Factories

Functions that return other functions:

```javascript
function makeMultiplier(factor) {
  return function (x) {
    return x * factor;
  };
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);

double(5); // 10
triple(5); // 15
```

### 3. Strategy Pattern

```javascript
const strategies = {
  credit: (amount) => amount * 1.03, // 3% fee
  debit: (amount) => amount * 1.01, // 1% fee
  cash: (amount) => amount, // No fee
};

function processPayment(method, amount) {
  return strategies[method](amount);
}

processPayment('credit', 100); // 103
processPayment('cash', 100); // 100
```

### 4. Function Composition

```javascript
const compose = (f, g) => (x) => f(g(x));

const addOne = (x) => x + 1;
const double = (x) => x * 2;

const addOneThenDouble = compose(double, addOne);
addOneThenDouble(5); // 12 (5 + 1 = 6, 6 * 2 = 12)
```

---

## Anonymous Functions

Functions don't require names when used as values:

```javascript
// Anonymous function in array
let operations = [
  function (x, y) {
    return x + y;
  },
  function (x, y) {
    return x - y;
  },
];

operations[0](5, 3); // 8

// Anonymous arrow function
setTimeout(() => console.log('Hello'), 1000);

// Immediately Invoked Function Expression (IIFE)
(function () {
  console.log('I run immediately!');
})();
```

---

## Key Differences: Functions vs Other Values

| Feature         | Functions                   | Other Values                   |
| --------------- | --------------------------- | ------------------------------ |
| **Callable**    | ✅ Can be invoked with `()` | ❌ Cannot be invoked           |
| **Type**        | `"function"`                | `"object"`, `"string"`, etc.   |
| **Properties**  | ✅ Can have properties      | Objects can, primitives cannot |
| **First-class** | ✅ Full first-class support | ✅ Also first-class            |

---

## Best Practices

✅ **Use function properties** for static data instead of global variables
✅ **Pass functions as arguments** to create flexible, reusable code
✅ **Store functions in data structures** (objects, arrays) for dynamic behavior
✅ **Use memoization** for expensive, repeated computations
✅ **Leverage higher-order functions** for cleaner, more declarative code
✅ **Name functions appropriately** when used as values for better debugging
✅ **Use arrow functions** for concise anonymous functions

---

## Key Concepts Summary

📌 **Functions are values**, not just syntax
📌 Can be **assigned to variables**, stored in **objects/arrays**
📌 Can be **passed as arguments** (callbacks, higher-order functions)
📌 Can be **returned from functions** (function factories)
📌 Functions are **objects** and can have **properties**
📌 Function properties enable **static variables** and **memoization**
📌 **Anonymous functions** don't need names when used as values
📌 This enables **functional programming** patterns in JavaScript
📌 Examples: `Array.sort()`, event handlers, callbacks, `map/filter/reduce`
📌 Functions as values enable **flexible, dynamic, reusable code**
