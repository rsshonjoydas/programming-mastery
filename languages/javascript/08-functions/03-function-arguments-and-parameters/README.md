# JavaScript Function Arguments and Parameters

## Overview

JavaScript functions are **highly flexible** with arguments and parameters:

- ❌ **No type checking** on parameter types
- ❌ **No validation** of the number of arguments
- ✅ Functions can be called with fewer or more arguments than declared parameters

---

## 1. Optional Parameters and Defaults

### The Problem: Missing Arguments

When a function is invoked with **fewer arguments** than declared parameters, missing parameters are set to `undefined`.

```javascript
function greet(name, greeting) {
  console.log(greeting + ', ' + name);
}

greet('Alice'); // "undefined, Alice" - greeting is undefined
```

### Solution 1: Manual Default Check (Old Way)

```javascript
function getPropertyNames(o, a) {
  if (a === undefined) a = []; // Provide default if undefined
  for (let property in o) a.push(property);
  return a;
}

let o = { x: 1 },
  p = { y: 2, z: 3 };
let a = getPropertyNames(o); // a = ["x"]
getPropertyNames(p, a); // a = ["x", "y", "z"]
```

### Solution 2: Using || Operator (Idiomatic)

```javascript
function getPropertyNames(o, a) {
  a = a || []; // Use a if truthy, otherwise use []
  for (let property in o) a.push(property);
  return a;
}
```

**How it works**: `||` returns the first truthy value or the second value if the first is falsy.

**⚠️ Caveat**: This approach treats all falsy values (`null`, `0`, `""`, `false`) as missing, not just `undefined`.

### Solution 3: ES6+ Default Parameters (Best)

```javascript
function getPropertyNames(o, a = []) {
  for (let property in o) a.push(property);
  return a;
}
```

**Key points about default parameters**:

- Evaluated **when the function is called**, not when defined
- Each invocation creates a new default value
- Can use variables or function calls for defaults
- Can reference previous parameters

```javascript
const rectangle = (width, height = width * 2) => ({ width, height });
rectangle(1); // {width: 1, height: 2}
```

### Best Practices for Optional Parameters

✅ **Put optional parameters at the end** of the parameter list
✅ Use ES6+ default parameters for clarity
✅ To skip an argument, explicitly pass `undefined`

```javascript
function createUser(name, age = 18, country = 'USA') {
  return { name, age, country };
}

createUser('Alice', undefined, 'Canada'); // Skip age, provide country
```

---

## 2. Rest Parameters and Variable-Length Argument Lists

### Rest Parameters (...rest)

Rest parameters allow functions to accept **any number of arguments** beyond the declared parameters.

**Syntax**: `...parameterName` (must be the **last parameter**)

```javascript
function max(first = -Infinity, ...rest) {
  let maxValue = first;

  for (let n of rest) {
    if (n > maxValue) {
      maxValue = n;
    }
  }

  return maxValue;
}

max(1, 10, 100, 2, 3, 1000, 4, 5, 6); // 1000
```

**Key characteristics**:

- Rest parameter is **always an array** (never `undefined`)
- Can be empty: `[]`
- Cannot have a default value (not legal or useful)
- Must be the **last** parameter

**Terminology**: Functions accepting any number of arguments are called:

- **Variadic functions**
- **Variable arity functions**
- **Varargs functions**

---

## 3. The Arguments Object (Legacy)

Before ES6, variable-length arguments were handled with the **`arguments` object**.

### What is Arguments?

An **array-like object** (not a true array) available inside all functions that contains all passed arguments.

```javascript
function max(x) {
  let maxValue = -Infinity;

  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] > maxValue) maxValue = arguments[i];
  }

  return maxValue;
}

max(1, 10, 100, 2, 3, 1000); // 1000
```

### Why Avoid Arguments Object?

❌ **Legacy baggage**: Inefficient and hard to optimize
❌ **Not a real array**: Missing array methods (must convert with `Array.from()`)
❌ **Reserved word** in strict mode
❌ **Confusing behavior** outside strict mode

### Migration Path

**Replace** `arguments` **with rest parameters** when refactoring:

```javascript
// Old way
function oldFunc() {
  console.log(arguments);
}

// New way
function newFunc(...args) {
  console.log(args); // Real array!
}
```

---

## 4. The Spread Operator for Function Calls

The **spread operator** (`...`) unpacks arrays (or iterables) into individual values.

### Basic Usage

```javascript
let numbers = [5, 2, 10, -1, 9, 100, 1];
Math.min(...numbers); // -1
// Equivalent to: Math.min(5, 2, 10, -1, 9, 100, 1)
```

### Spread vs Rest

| Context                 | Syntax              | Purpose                             |
| ----------------------- | ------------------- | ----------------------------------- |
| **Function call**       | `func(...array)`    | Spread: unpack array into arguments |
| **Function definition** | `function(...args)` | Rest: collect arguments into array  |

### Combining Rest and Spread

```javascript
// Wrapper function that logs timing
function timed(f) {
  return function (...args) {
    // Collect arguments
    console.log(`Entering ${f.name}`);
    let startTime = Date.now();

    try {
      return f(...args); // Spread arguments to original function
    } finally {
      console.log(`Exiting ${f.name} after ${Date.now() - startTime}ms`);
    }
  };
}

function benchmark(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}

timed(benchmark)(1000000); // 500000500000
```

---

## 5. Destructuring Function Arguments

Destructuring allows you to **unpack arrays or objects** directly into function parameters.

### Array Destructuring

```javascript
// Without destructuring
function vectorAdd(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

// With destructuring
function vectorAdd([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

vectorAdd([1, 2], [3, 4]); // [4, 6]
```

### Object Destructuring

```javascript
function vectorMultiply({ x, y }, scalar) {
  return { x: x * scalar, y: y * scalar };
}

vectorMultiply({ x: 1, y: 2 }, 2); // {x: 2, y: 4}
```

### Renaming Properties During Destructuring

```javascript
function vectorAdd(
  { x: x1, y: y1 }, // Unpack 1st object: property x → param x1
  { x: x2, y: y2 } // Unpack 2nd object: property x → param x2
) {
  return { x: x1 + x2, y: y1 + y2 };
}

vectorAdd({ x: 1, y: 2 }, { x: 3, y: 4 }); // {x: 4, y: 6}
```

**Remember**: Property names are on the **left** of the colon, parameter names on the **right**.

### Default Values with Destructuring

```javascript
function vectorMultiply({ x, y, z = 0 }, scalar) {
  return { x: x * scalar, y: y * scalar, z: z * scalar };
}

vectorMultiply({ x: 1, y: 2 }, 2); // {x: 2, y: 4, z: 0}
```

### Named Parameters Pattern

Simulate Python-style named parameters using object destructuring:

```javascript
function arraycopy({
  from,
  to = from,
  n = from.length,
  fromIndex = 0,
  toIndex = 0,
}) {
  let valuesToCopy = from.slice(fromIndex, fromIndex + n);
  to.splice(toIndex, 0, ...valuesToCopy);
  return to;
}

let a = [1, 2, 3, 4, 5],
  b = [9, 8, 7, 6, 5];
arraycopy({ from: a, n: 3, to: b, toIndex: 4 }); // [9,8,7,6,1,2,3,5]
```

### Rest Parameters with Destructuring

**Array destructuring**:

```javascript
function f([x, y, ...coords], ...rest) {
  return [x + y, ...rest, ...coords];
}

f([1, 2, 3, 4], 5, 6); // [3, 5, 6, 3, 4]
```

**Object destructuring (ES2018+)**:

```javascript
function vectorMultiply({ x, y, z = 0, ...props }, scalar) {
  return { x: x * scalar, y: y * scalar, z: z * scalar, ...props };
}

vectorMultiply({ x: 1, y: 2, w: -1 }, 2); // {x: 2, y: 4, z: 0, w: -1}
```

### Complex Destructuring

```javascript
// Destructure nested structures
function drawCircle({ x, y, radius, color: [r, g, b] }) {
  console.log(`Circle at (${x}, ${y}) with radius ${radius}`);
  console.log(`Color: rgb(${r}, ${g}, ${b})`);
}

drawCircle({ x: 10, y: 20, radius: 5, color: [255, 0, 0] });
```

**⚠️ Warning**: Overly complex destructuring can make code harder to read. Use simple property access when clarity suffers.

---

## 6. Argument Type Checking

### The Challenge

JavaScript has **no built-in type checking** for function parameters.

```javascript
function add(a, b) {
  return a + b;
}

add(5, 10); // 15
add('5', '10'); // "510" (string concatenation)
add(5, '10'); // "510" (automatic type conversion)
```

### Why Type Checking Matters

✅ **Fail fast**: Better to fail immediately than produce unexpected results
✅ **Clear errors**: Explicit type errors are easier to debug
✅ **Documentation**: Type checks serve as inline documentation

### Manual Type Checking

```javascript
function sum(a) {
  let total = 0;

  for (let element of a) {
    // Throws TypeError if not iterable
    if (typeof element !== 'number') {
      throw new TypeError('sum(): elements must be numbers');
    }
    total += element;
  }

  return total;
}

sum([1, 2, 3]); // 6
sum(1, 2, 3); // TypeError: 1 is not iterable
sum([1, 2, '3']); // TypeError: element 2 is not a number
```

### Type Checking Strategies

**1. Using `typeof`**:

```javascript
function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a * b;
}
```

**2. Using `instanceof`**:

```javascript
function processArray(arr) {
  if (!(arr instanceof Array)) {
    throw new TypeError('Argument must be an array');
  }
  // Process array...
}
```

**3. Using `Array.isArray()`**:

```javascript
function sumArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Argument must be an array');
  }
  return arr.reduce((sum, val) => sum + val, 0);
}
```

**4. Duck typing** (check for specific methods/properties):

```javascript
function processIterable(iterable) {
  if (typeof iterable[Symbol.iterator] !== 'function') {
    throw new TypeError('Argument must be iterable');
  }
  for (let item of iterable) {
    // Process items...
  }
}
```

### Documentation and Self-Documenting Code

Even without type checking, good practices help:

✅ **Descriptive parameter names**
✅ **Comprehensive JSDoc comments**
✅ **TypeScript** (for compile-time type checking)

```javascript
/**
 * Calculates the area of a rectangle
 * @param {number} width - The width of the rectangle
 * @param {number} height - The height of the rectangle
 * @returns {number} The area
 */
function calculateArea(width, height) {
  return width * height;
}
```

---

## Summary: Key Concepts

| Feature                  | Description                                  | Syntax Example         |
| ------------------------ | -------------------------------------------- | ---------------------- |
| **Default Parameters**   | Provide default values for missing arguments | `function(a, b = 10)`  |
| **Rest Parameters**      | Collect extra arguments into array           | `function(...args)`    |
| **Spread Operator**      | Unpack array into individual arguments       | `func(...array)`       |
| **Arguments Object**     | Legacy array-like object (avoid)             | `arguments[0]`         |
| **Array Destructuring**  | Unpack arrays into parameters                | `function([x, y])`     |
| **Object Destructuring** | Unpack objects into parameters               | `function({x, y})`     |
| **Type Checking**        | Validate argument types manually             | `typeof`, `instanceof` |

---

## Best Practices

✅ Use **ES6+ default parameters** instead of manual checks
✅ Use **rest parameters** instead of `arguments` object
✅ Place **optional parameters at the end** of parameter lists
✅ Use **descriptive parameter names** as documentation
✅ Add **type checks** for public APIs and critical functions
✅ Keep **destructuring simple** to maintain readability
✅ Use **spread operator** to pass arrays as function arguments
✅ Consider **TypeScript** for large projects needing type safety
