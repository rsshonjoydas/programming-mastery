# JavaScript Generators

## What Are Generators?

**Generators** are a special type of iterator defined with ES6 syntax. They're particularly useful when values to be iterated are **computed on-demand** rather than stored in a data structure.

### Key Characteristics

- Defined with `function*` syntax (note the asterisk)
- Return a generator object (which is an iterator)
- Use `yield` to produce values
- Execution pauses at each `yield` and resumes on next `next()` call
- Can generate infinite sequences efficiently

---

## Defining Generator Functions

### Basic Syntax

Generator functions use `function*` instead of `function`:

```javascript
function* oneDigitPrimes() {
  yield 2;
  yield 3;
  yield 5;
  yield 7;
}
```

**Important**: Invoking a generator function doesn't execute the code—it returns a generator object.

---

## Using Generators

### The Generator Object

```javascript
let primes = oneDigitPrimes(); // Returns generator object

// Call next() to execute until the next yield
primes.next().value; // 2
primes.next().value; // 3
primes.next().value; // 5
primes.next().value; // 7
primes.next().done; // true (no more values)
```

**`next()` returns**: `{ value: any, done: boolean }`

### Generators are Iterable

Generators have a `Symbol.iterator` method, making them iterable:

```javascript
primes[Symbol.iterator](); // Returns primes itself

// Use with spread operator
[...oneDigitPrimes()]; // [2, 3, 5, 7]

// Use with for...of loop
let sum = 0;
for (let prime of oneDigitPrimes()) {
  sum += prime;
}
console.log(sum); // 17
```

---

## Generator Expression Forms

### Function Expression

```javascript
const seq = function* (from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
};

[...seq(3, 5)]; // [3, 4, 5]
```

### Method Shorthand (in Objects/Classes)

Use an asterisk before the method name:

```javascript
let o = {
  x: 1,
  y: 2,
  z: 3,

  *g() {
    for (let key of Object.keys(this)) {
      yield key;
    }
  },
};

[...o.g()]; // ["x", "y", "z", "g"]
```

### In Classes

```javascript
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  }
}

let range = new Range(1, 5);
[...range]; // [1, 2, 3, 4, 5]
```

**Note**: Cannot use arrow functions to create generators.

---

## Generator Examples

### 1. Fibonacci Sequence (Infinite Generator)

```javascript
function* fibonacciSequence() {
  let x = 0,
    y = 1;
  for (;;) {
    // Infinite loop
    yield y;
    [x, y] = [y, x + y]; // Destructuring assignment
  }
}

// Get nth Fibonacci number
function fibonacci(n) {
  for (let f of fibonacciSequence()) {
    if (n-- <= 0) return f;
  }
}

fibonacci(20); // 10946
```

**Warning**: Using infinite generators with spread operator (`...`) can crash your program!

### 2. take() - Limit Generator Output

```javascript
function* take(n, iterable) {
  let it = iterable[Symbol.iterator]();

  while (n-- > 0) {
    let next = it.next();
    if (next.done)
      return; // No more values
    else yield next.value;
  }
}

// First 5 Fibonacci numbers
[...take(5, fibonacciSequence())]; // [1, 1, 2, 3, 5]
```

### 3. zip() - Interleave Multiple Iterables

```javascript
function* zip(...iterables) {
  let iterators = iterables.map((i) => i[Symbol.iterator]());
  let index = 0;

  while (iterators.length > 0) {
    if (index >= iterators.length) {
      index = 0; // Wrap around to first iterator
    }

    let item = iterators[index].next();

    if (item.done) {
      iterators.splice(index, 1); // Remove exhausted iterator
    } else {
      yield item.value;
      index++;
    }
  }
}

[...zip(oneDigitPrimes(), 'ab', [0])];
// [2, "a", 0, 3, "b", 5, 7]
```

---

## yield\* - Delegating to Another Generator

The `yield*` keyword delegates to another iterable, yielding all its values.

### Without yield\*

```javascript
function* sequence(...iterables) {
  for (let iterable of iterables) {
    for (let item of iterable) {
      yield item; // Yield each item individually
    }
  }
}

[...sequence('abc', oneDigitPrimes())];
// ["a", "b", "c", 2, 3, 5, 7]
```

### With yield\* (Simplified)

```javascript
function* sequence(...iterables) {
  for (let iterable of iterables) {
    yield* iterable; // Yield all items from iterable
  }
}

[...sequence('abc', oneDigitPrimes())];
// ["a", "b", "c", 2, 3, 5, 7]
```

**Key Difference**: `yield*` iterates the iterable and yields each value automatically.

---

## Important Restrictions

### yield and yield\* Must Be Directly in Generator Functions

**This DOES NOT work**:

```javascript
function* sequence(...iterables) {
  iterables.forEach((iterable) => yield * iterable); // ERROR!
}
```

**Why**: The arrow function is a regular function, not a generator. `yield` and `yield*` can only be used directly within `function*` generators.

**This WORKS**:

```javascript
function* sequence(...iterables) {
  for (let iterable of iterables) {
    yield* iterable; // OK - directly in generator
  }
}
```

---

## Recursive Generators

`yield*` enables recursive generators for tree structures or nested data:

```javascript
function* traverseTree(node) {
  yield node.value;

  if (node.children) {
    for (let child of node.children) {
      yield* traverseTree(child); // Recursive delegation
    }
  }
}

let tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3 },
  ],
};

[...traverseTree(tree)]; // [1, 2, 4, 5, 3]
```

---

## How Generators Work

### Execution Flow

1. **Invoke generator function** → Returns generator object
2. **Call `next()`** → Executes code until first `yield`
3. **`yield` expression** → Pauses execution, returns `{ value, done: false }`
4. **Call `next()` again** → Resumes from last `yield`
5. **Function ends** → Returns `{ value: undefined, done: true }`

### Visual Example

```javascript
function* demo() {
  console.log('Start');
  yield 1;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 3;
  console.log('End');
}

let gen = demo();
gen.next(); // Logs: "Start", returns { value: 1, done: false }
gen.next(); // Logs: "After first yield", returns { value: 2, done: false }
gen.next(); // Logs: "After second yield", returns { value: 3, done: false }
gen.next(); // Logs: "End", returns { value: undefined, done: true }
```

---

## Use Cases for Generators

### 1. Lazy Evaluation

Generate values on-demand instead of pre-computing:

```javascript
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}
```

### 2. Infinite Sequences

Represent infinite sequences without memory issues:

```javascript
function* infiniteSequence() {
  let i = 0;
  while (true) yield i++;
}
```

### 3. Stateful Iteration

Maintain state between iterations:

```javascript
function* idGenerator() {
  let id = 0;
  while (true) yield id++;
}
```

### 4. Asynchronous Programming

Handle async operations (with `async` generators):

```javascript
async function* asyncGenerator() {
  yield await fetch('/api/1');
  yield await fetch('/api/2');
}
```

### 5. Custom Iterators

Easy implementation of iterable classes:

```javascript
class CustomIterable {
  *[Symbol.iterator]() {
    // Define iteration logic
  }
}
```

---

## Key Concepts Summary

✅ **Generator functions** use `function*` syntax
✅ **Calling a generator function** returns a generator object, not execution
✅ **`yield`** pauses execution and returns a value
✅ **`next()`** resumes execution until the next `yield`
✅ **Generators are iterators** with `Symbol.iterator` method
✅ **`yield*`** delegates to another iterable
✅ **Cannot use arrow functions** for generators
✅ **`yield` must be directly** in generator functions (not nested regular functions)
✅ **Infinite generators** are possible and memory-efficient
✅ **Recursive generators** work with `yield*`

---

## Syntax Quick Reference

```javascript
// Function declaration
function* gen() {
  yield 1;
}

// Function expression
const gen = function* () {
  yield 1;
};

// Method in object
let obj = {
  *gen() {
    yield 1;
  },
};

// Method in class
class MyClass {
  *gen() {
    yield 1;
  }
}

// Iterator method
class MyClass {
  *[Symbol.iterator]() {
    yield 1;
  }
}

// Delegate to another iterable
function* gen() {
  yield* [1, 2, 3];
}
```
