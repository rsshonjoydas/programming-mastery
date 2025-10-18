# JavaScript Functional Programming

Functional programming treats computation as the evaluation of mathematical functions, avoiding changing state and mutable data. While JavaScript isn't a pure functional language like Haskell or Lisp, it supports functional programming techniques because functions are first-class objects.

---

## Core Concepts

**Key principles of functional programming:**

- Functions as first-class citizens
- Pure functions (no side effects)
- Immutability
- Higher-order functions
- Function composition
- Avoiding loops in favor of array methods

---

## 1. Processing Arrays with Functions

### Traditional Imperative Style

```javascript
let data = [1, 1, 3, 5, 5];

// Calculate mean
let total = 0;
for (let i = 0; i < data.length; i++) {
  total += data[i];
}
let mean = total / data.length; // mean == 3

// Calculate standard deviation
total = 0;
for (let i = 0; i < data.length; i++) {
  let deviation = data[i] - mean;
  total += deviation * deviation;
}
let stddev = Math.sqrt(total / (data.length - 1)); // stddev == 2
```

### Functional Style with Array Methods

```javascript
// Define simple, reusable functions
const sum = (x, y) => x + y;
const square = (x) => x * x;

let data = [1, 1, 3, 5, 5];

// Calculate mean
let mean = data.reduce(sum) / data.length; // mean == 3

// Calculate standard deviation
let deviations = data.map((x) => x - mean);
let stddev = Math.sqrt(deviations.map(square).reduce(sum) / (data.length - 1)); // stddev == 2
```

**Benefits:**

- More concise and readable
- Reusable functions
- No mutable state
- Declarative rather than imperative

### Pure Functional Style

Create functional wrappers for array methods:

```javascript
const map = function (a, ...args) {
  return a.map(...args);
};

const reduce = function (a, ...args) {
  return a.reduce(...args);
};

const sum = (x, y) => x + y;
const square = (x) => x * x;

let data = [1, 1, 3, 5, 5];
let mean = reduce(data, sum) / data.length;
let deviations = map(data, (x) => x - mean);
let stddev = Math.sqrt(
  reduce(map(deviations, square), sum) / (data.length - 1)
);
```

---

## 2. Higher-Order Functions

**Higher-order functions** operate on other functions by:

- Taking functions as arguments
- Returning functions as results
- Or both

### Example: not() Function

Creates a function that negates another function's result:

```javascript
function not(f) {
  return function (...args) {
    let result = f.apply(this, args);
    return !result;
  };
}

const even = (x) => x % 2 === 0;
const odd = not(even);

[1, 1, 3, 5, 5].every(odd); // => true
```

### Example: mapper() Function

Returns a function that maps arrays:

```javascript
function mapper(f) {
  return (a) => map(a, f);
}

const increment = (x) => x + 1;
const incrementAll = mapper(increment);

incrementAll([1, 2, 3]); // => [2, 3, 4]
```

### Example: compose() Function

Combines two functions into one:

```javascript
// Returns f(g(...))
function compose(f, g) {
  return function (...args) {
    return f.call(this, g.apply(this, args));
  };
}

const sum = (x, y) => x + y;
const square = (x) => x * x;

compose(square, sum)(2, 3); // => 25 (square of sum)
```

**How it works:**

1. Takes arguments `(2, 3)`
2. Passes them to `g` (sum): `2 + 3 = 5`
3. Passes result to `f` (square): `5 * 5 = 25`

---

## 3. Partial Application of Functions

**Partial application** creates new functions by fixing some arguments of an existing function.

### partialLeft() - Fix Left Arguments

```javascript
function partialLeft(f, ...outerArgs) {
  return function (...innerArgs) {
    let args = [...outerArgs, ...innerArgs];
    return f.apply(this, args);
  };
}

const f = function (x, y, z) {
  return x * (y - z);
};
partialLeft(f, 2)(3, 4); // => -2 (2 * (3 - 4))
```

### partialRight() - Fix Right Arguments

```javascript
function partialRight(f, ...outerArgs) {
  return function (...innerArgs) {
    let args = [...innerArgs, ...outerArgs];
    return f.apply(this, args);
  };
}

partialRight(f, 2)(3, 4); // => 6 (3 * (4 - 2))
```

### partial() - Template-Based Application

```javascript
function partial(f, ...outerArgs) {
  return function (...innerArgs) {
    let args = [...outerArgs];
    let innerIndex = 0;

    // Fill undefined values with inner args
    for (let i = 0; i < args.length; i++) {
      if (args[i] === undefined) {
        args[i] = innerArgs[innerIndex++];
      }
    }

    // Append remaining inner args
    args.push(...innerArgs.slice(innerIndex));
    return f.apply(this, args);
  };
}

partial(f, undefined, 2)(3, 4); // => -6 (3 * (2 - 4))
```

### Practical Examples

```javascript
const sum = (x, y) => x + y;
const increment = partialLeft(sum, 1);

const cuberoot = partialRight(Math.pow, 1 / 3);
cuberoot(increment(26)); // => 3

// Combining with composition
const not = partialLeft(compose, (x) => !x);
const even = (x) => x % 2 === 0;
const odd = not(even);
const isNumber = not(isNaN);

odd(3) && isNumber(2); // => true
```

### Extreme Functional Style

```javascript
const product = (x, y) => x * y;
const neg = partial(product, -1);
const sqrt = partial(Math.pow, undefined, 0.5);
const reciprocal = partial(Math.pow, undefined, neg(1));

let data = [1, 1, 3, 5, 5];

let mean = product(reduce(data, sum), reciprocal(data.length));

let stddev = sqrt(
  product(
    reduce(map(data, compose(square, partial(sum, neg(mean)))), sum),
    reciprocal(sum(data.length, neg(1)))
  )
);

[mean, stddev]; // => [3, 2]
```

**Note:** This extreme style demonstrates capabilities but isn't recommended for production code due to readability concerns.

---

## 4. Memoization

**Memoization** caches function results to avoid redundant calculations.

### Basic Memoization Function

```javascript
function memoize(f) {
  const cache = new Map();

  return function (...args) {
    // Create cache key from arguments
    let key = args.length + args.join('+');

    if (cache.has(key)) {
      return cache.get(key);
    } else {
      let result = f.apply(this, args);
      cache.set(key, result);
      return result;
    }
  };
}
```

**How it works:**

1. Creates a `Map` to store cached results
2. Converts arguments to a string key
3. Returns cached value if it exists
4. Otherwise, computes, caches, and returns the result

### Example: Greatest Common Divisor

```javascript
function gcd(a, b) {
  if (a < b) {
    [a, b] = [b, a]; // Swap to ensure a >= b
  }

  while (b !== 0) {
    [a, b] = [b, a % b]; // Euclidean algorithm
  }

  return a;
}

const gcdmemo = memoize(gcd);
gcdmemo(85, 187); // => 17 (computed and cached)
gcdmemo(85, 187); // => 17 (returned from cache)
```

### Example: Memoized Factorial

```javascript
const factorial = memoize(function (n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
});

factorial(5); // => 120
// Also caches: factorial(4), factorial(3), factorial(2), factorial(1)
```

**Important:** For recursive functions, recurse to the **memoized version**, not the original.

---

## Key Array Methods for Functional Programming

### map() - Transform Elements

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((x) => x * 2);
// [2, 4, 6, 8]
```

### filter() - Select Elements

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((x) => x % 2 === 0);
// [2, 4]
```

### reduce() - Aggregate Values

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, x) => acc + x, 0);
// 10
```

### every() - Test All Elements

```javascript
const numbers = [2, 4, 6];
const allEven = numbers.every((x) => x % 2 === 0);
// true
```

### some() - Test Any Element

```javascript
const numbers = [1, 3, 5, 6];
const hasEven = numbers.some((x) => x % 2 === 0);
// true
```

### find() - Find First Match

```javascript
const numbers = [1, 3, 5, 6, 7];
const firstEven = numbers.find((x) => x % 2 === 0);
// 6
```

---

## Functional Programming Principles

### 1. Pure Functions

Functions that:

- Always return the same output for the same input
- Have no side effects (don't modify external state)

```javascript
// Pure function
const add = (a, b) => a + b;

// Impure function (modifies external state)
let total = 0;
const addToTotal = (x) => {
  total += x;
};
```

### 2. Immutability

Don't modify data, create new data:

```javascript
// Bad: Mutates original array
const addItem = (arr, item) => {
  arr.push(item);
  return arr;
};

// Good: Creates new array
const addItem = (arr, item) => [...arr, item];
```

### 3. Function Composition

Build complex operations from simple functions:

```javascript
const add = (x) => (y) => x + y;
const multiply = (x) => (y) => x * y;
const square = (x) => x * x;

const addThenSquare = compose(square, add(5));
addThenSquare(3); // => 64 ((3 + 5)²)
```

### 4. Declarative vs Imperative

**Imperative** (how to do it):

```javascript
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}
```

**Declarative** (what to do):

```javascript
const sum = arr.reduce((acc, x) => acc + x, 0);
```

---

## Practical Benefits

✅ **Reusability** - Small, focused functions can be combined
✅ **Testability** - Pure functions are easy to test
✅ **Predictability** - No side effects means predictable behavior
✅ **Parallelization** - Pure functions can run in parallel safely
✅ **Debugging** - Easier to trace and debug
✅ **Composition** - Build complex logic from simple parts

---

## Common Patterns

### Pipeline Pattern

```javascript
const pipeline =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const process = pipeline(
  (x) => x.trim(),
  (x) => x.toLowerCase(),
  (x) => x.split(' ')
);

process('  HELLO WORLD  '); // => ['hello', 'world']
```

### Currying

```javascript
const curry = (f) => {
  return function curried(...args) {
    if (args.length >= f.length) {
      return f.apply(this, args);
    } else {
      return (...moreArgs) => curried(...args, ...moreArgs);
    }
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3); // => 6
curriedAdd(1, 2)(3); // => 6
```

---

## Key Concepts Summary

📌 **Functional programming** treats functions as first-class values
📌 **Higher-order functions** take or return other functions
📌 **Partial application** fixes some arguments to create new functions
📌 **Composition** combines simple functions into complex ones
📌 **Memoization** caches results for performance optimization
📌 **Pure functions** have no side effects and always return the same output
📌 **Immutability** prevents data modification
📌 Array methods like `map()`, `reduce()`, and `filter()` enable functional style
📌 **Declarative code** describes what to do, not how to do it
📌 JavaScript supports functional programming but isn't purely functional
