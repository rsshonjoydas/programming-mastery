# JavaScript Iterators and Generators

## What Are Iterators?

An **iterator** is an object that provides a standardized way to traverse through a sequence of values. Iterators are a core feature of ES6 that enable consistent iteration across different data structures.

### Iterable Objects

Objects that can be iterated are called **iterable objects**. Built-in iterables include:

- **Arrays** (including TypedArrays)
- **Strings**
- **Set** and **Map** objects
- **NodeList**, **arguments** object
- Generator objects

---

## Using Iterators

### 1. for...of Loop

The most common way to use iterators:

```javascript
let sum = 0;
for (let i of [1, 2, 3]) {
  // Loop once for each value
  sum += i;
}
console.log(sum); // 6
```

### 2. Spread Operator (...)

Expand iterables into arrays or function arguments:

```javascript
// Array expansion
let chars = [...'abcd']; // ["a", "b", "c", "d"]

// Function arguments
let data = [1, 2, 3, 4, 5];
Math.max(...data); // 5

// Copying arrays
let copy = [...data];

// Combining arrays
let combined = [...data, 6, 7];
```

### 3. Destructuring Assignment

Extract values from iterables:

```javascript
let purpleHaze = Uint8Array.of(255, 0, 255, 128);
let [r, g, b, a] = purpleHaze; // a == 128

// With strings
let [first, second] = 'ab'; // first = "a", second = "b"

// Skipping values
let [x, , z] = [1, 2, 3]; // x = 1, z = 3
```

### 4. Map Iteration with Destructuring

```javascript
let m = new Map([
  ['one', 1],
  ['two', 2],
]);

// Iterate key-value pairs
for (let [k, v] of m) {
  console.log(k, v); // Logs 'one 1' and 'two 2'
}
```

### 5. Map Methods: keys(), values(), entries()

```javascript
let m = new Map([
  ['one', 1],
  ['two', 2],
]);

[...m]; // [["one", 1], ["two", 2]] - default iteration
[...m.entries()]; // [["one", 1], ["two", 2]] - same as default
[...m.keys()]; // ["one", "two"] - keys only
[...m.values()]; // [1, 2] - values only
```

### 6. Built-in Functions Accept Iterators

Many ES6+ APIs accept any iterable, not just arrays:

```javascript
// Set constructor
new Set('abc'); // Set(3) {"a", "b", "c"}
new Set([1, 2, 2, 3]); // Set(3) {1, 2, 3}

// Array.from()
Array.from('hello'); // ["h", "e", "l", "l", "o"]

// Promise.all()
Promise.all([promise1, promise2]);
```

---

## How Iterators Work

### The Iterator Protocol

An **iterator** is an object with a `next()` method that returns objects with two properties:

- **value**: The next value in the sequence
- **done**: Boolean indicating if iteration is complete

```javascript
let iterable = [1, 2, 3];
let iterator = iterable[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### The Iterable Protocol

An object is **iterable** if it has a method with the key `Symbol.iterator` that returns an iterator.

```javascript
let iterable = [1, 2, 3];
let iterator = iterable[Symbol.iterator]();

// The iterator is what gets used by for...of
for (let value of iterable) {
  console.log(value);
}
```

---

## Creating Custom Iterators

### Example 1: Range Iterator

```javascript
// A range object that iterates from start to end
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  // Make the object iterable
  [Symbol.iterator]() {
    let current = this.start;
    let end = this.end;

    // Return an iterator object
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}

// Using the custom iterable
let range = new Range(1, 5);
for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

[...range]; // [1, 2, 3, 4, 5]
```

### Example 2: Iterating Object Properties

```javascript
// Make any object iterable over its own properties
class IterableObject {
  constructor(obj) {
    this.obj = obj;
  }

  [Symbol.iterator]() {
    let keys = Object.keys(this.obj);
    let index = 0;

    return {
      next: () => {
        if (index < keys.length) {
          let key = keys[index++];
          return { value: [key, this.obj[key]], done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}

let obj = new IterableObject({ a: 1, b: 2, c: 3 });
for (let [key, value] of obj) {
  console.log(`${key}: ${value}`);
}
```

---

## Generators

**Generators** are special functions that can pause execution and resume later, making them perfect for creating iterators easily.

### Generator Syntax

Use `function*` (with asterisk) to declare a generator:

```javascript
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

let gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### Key Features of Generators

1. **`yield` keyword**: Pauses execution and returns a value
2. **Automatic iterator**: Generator functions return iterator objects
3. **State preservation**: Variables maintain their values between yields
4. **Lazy evaluation**: Values are computed on demand

### Generator Examples

#### Example 1: Range Generator

```javascript
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// Much simpler than the class-based iterator!
for (let num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

[...range(1, 3)]; // [1, 2, 3]
```

#### Example 2: Fibonacci Sequence

```javascript
function* fibonacci() {
  let a = 0,
    b = 1;

  while (true) {
    // Infinite generator
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take first 10 Fibonacci numbers
let fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}

// Or use with a limit
function* take(n, iterable) {
  let count = 0;
  for (let value of iterable) {
    if (count++ >= n) return;
    yield value;
  }
}

[...take(8, fibonacci())]; // [0, 1, 1, 2, 3, 5, 8, 13]
```

#### Example 3: Iterating Object Properties

```javascript
function* objectEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

let person = { name: 'Alice', age: 30, city: 'NYC' };
for (let [key, value] of objectEntries(person)) {
  console.log(`${key}: ${value}`);
}
```

#### Example 4: Filtering with Generators

```javascript
function* filter(iterable, predicate) {
  for (let item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* map(iterable, transform) {
  for (let item of iterable) {
    yield transform(item);
  }
}

// Usage
let numbers = [1, 2, 3, 4, 5, 6];
let evens = filter(numbers, (n) => n % 2 === 0);
let doubled = map(evens, (n) => n * 2);

[...doubled]; // [4, 8, 12]
```

### Generator Methods

#### 1. Generator.prototype.next(value)

Resumes execution and optionally sends a value back into the generator:

```javascript
function* generator() {
  let x = yield 1;
  console.log('Received:', x);
  yield 2;
}

let gen = generator();
gen.next(); // { value: 1, done: false }
gen.next(100); // Logs "Received: 100", returns { value: 2, done: false }
```

#### 2. Generator.prototype.return(value)

Terminates the generator early:

```javascript
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

let gen = generator();
gen.next(); // { value: 1, done: false }
gen.return(99); // { value: 99, done: true }
gen.next(); // { value: undefined, done: true }
```

#### 3. Generator.prototype.throw(error)

Throws an error inside the generator:

```javascript
function* generator() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log('Caught:', e);
  }
  yield 3;
}

let gen = generator();
gen.next(); // { value: 1, done: false }
gen.throw('Error!'); // Logs "Caught: Error!", returns { value: 3, done: false }
```

### yield\* (Delegating to Another Generator)

The `yield*` expression delegates to another iterable or generator:

```javascript
function* inner() {
  yield 2;
  yield 3;
}

function* outer() {
  yield 1;
  yield* inner(); // Delegate to inner generator
  yield 4;
}

[...outer()]; // [1, 2, 3, 4]
```

**Practical example with arrays:**

```javascript
function* flatten(arr) {
  for (let item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item); // Recursive flattening
    } else {
      yield item;
    }
  }
}

let nested = [1, [2, [3, 4], 5], 6];
[...flatten(nested)]; // [1, 2, 3, 4, 5, 6]
```

---

## Generator Expressions (Not in JavaScript)

**Note**: JavaScript does NOT have generator expressions. You must use generator functions.

```javascript
// This does NOT exist in JavaScript:
// let gen = (x * 2 for x in range(10));  // Python syntax, not JS

// In JavaScript, use a generator function:
function* doubleRange(n) {
  for (let i = 0; i < n; i++) {
    yield i * 2;
  }
}
```

---

## Advanced Use Cases

### 1. Async Iteration (for await...of)

Generators can be async too:

```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

(async () => {
  for await (let value of asyncGenerator()) {
    console.log(value); // 1, 2, 3
  }
})();
```

### 2. State Machines

```javascript
function* stateMachine() {
  let state = 'START';

  while (true) {
    if (state === 'START') {
      state = yield 'Starting...';
    } else if (state === 'RUNNING') {
      state = yield 'Running...';
    } else if (state === 'STOP') {
      return 'Stopped';
    }
  }
}

let machine = stateMachine();
machine.next(); // { value: 'Starting...', done: false }
machine.next('RUNNING'); // { value: 'Running...', done: false }
machine.next('STOP'); // { value: 'Stopped', done: true }
```

### 3. Infinite Sequences

```javascript
function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

// Safe to create, values generated on demand
let numbers = naturalNumbers();
numbers.next().value; // 1
numbers.next().value; // 2
numbers.next().value; // 3
```

---

## Comparison: Iterator vs Generator

| Feature              | Custom Iterator                  | Generator                         |
| -------------------- | -------------------------------- | --------------------------------- |
| **Syntax**           | Class with `[Symbol.iterator]()` | `function*` with `yield`          |
| **Complexity**       | More verbose                     | Concise and readable              |
| **State management** | Manual (instance variables)      | Automatic (local variables)       |
| **Control flow**     | Manual `next()` logic            | Natural control flow with `yield` |
| **Best for**         | Complex iteration logic          | Simple to moderate iteration      |

---

## Key Concepts Summary

✅ **Iterators** provide a standard way to traverse sequences
✅ **Iterable objects** have a `[Symbol.iterator]()` method
✅ **for...of** loops work with any iterable
✅ **Spread operator (...)** expands iterables
✅ **Destructuring** extracts values from iterables
✅ **Generators** (`function*`) make creating iterators easy
✅ **`yield`** pauses execution and returns values
✅ **`yield*`** delegates to another iterable
✅ Generators enable **lazy evaluation** and **infinite sequences**
✅ Built-in objects like **Set, Map, Array** accept any iterable
✅ **Async generators** enable asynchronous iteration

---

## Best Practices

✅ Use **generators** for simple iterators (cleaner code)
✅ Use **custom iterators** for complex stateful iteration
✅ Leverage **lazy evaluation** with generators for large datasets
✅ Combine generators with **`yield*`** for composition
✅ Use **`for...of`** instead of traditional loops when possible
✅ Remember generators are **one-time use** (create new instances to re-iterate)
✅ Use **async generators** for streaming data or async operations
