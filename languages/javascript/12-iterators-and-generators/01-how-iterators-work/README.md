# JavaScript Iterators

## Overview

To understand iteration in JavaScript, you need to understand **three separate types**:

1. **Iterable objects** - Objects that can be iterated (Array, Set, Map, String, etc.)
2. **Iterator objects** - Objects that perform the iteration
3. **Iteration result objects** - Objects that hold each step's result

---

## The Three Components

### 1. Iterable Objects

An **iterable object** is any object with a special iterator method that returns an iterator object.

**Built-in iterables**:

- Arrays
- Strings
- Sets
- Maps
- TypedArrays
- Arguments object

**Key characteristic**: Has a method named `Symbol.iterator`

```javascript
let arr = [1, 2, 3];
let str = 'hello';
let set = new Set([1, 2, 3]);

// All have Symbol.iterator method
console.log(typeof arr[Symbol.iterator]); // "function"
console.log(typeof str[Symbol.iterator]); // "function"
console.log(typeof set[Symbol.iterator]); // "function"
```

### 2. Iterator Objects

An **iterator** is any object with a `next()` method that returns an iteration result object.

**Characteristics**:

- Has a `next()` method
- Each call to `next()` returns an iteration result object
- Maintains state between calls

```javascript
let arr = [1, 2, 3];
let iterator = arr[Symbol.iterator]();

console.log(typeof iterator.next); // "function"
```

### 3. Iteration Result Objects

An **iteration result object** has two properties:

- **`value`**: The current iteration value
- **`done`**: Boolean indicating if iteration is complete

```javascript
let arr = [99];
let iterator = arr[Symbol.iterator]();

let result = iterator.next();
console.log(result); // { value: 99, done: false }

result = iterator.next();
console.log(result); // { value: undefined, done: true }
```

---

## How Iteration Works

### Step-by-Step Process

1. Call the iterable's `Symbol.iterator` method to get an iterator object
2. Call the iterator's `next()` method repeatedly
3. Each `next()` call returns `{ value: ..., done: ... }`
4. Continue until `done` is `true`

### Manual Iteration Example

```javascript
let iterable = [99];
let iterator = iterable[Symbol.iterator]();

for (let result = iterator.next(); !result.done; result = iterator.next()) {
  console.log(result.value); // 99
}
```

This is equivalent to:

```javascript
for (let value of [99]) {
  console.log(value); // 99
}
```

---

## The for/of Loop (Behind the Scenes)

When you write:

```javascript
for (let item of iterable) {
  console.log(item);
}
```

JavaScript does this:

```javascript
let iterator = iterable[Symbol.iterator]();
let result = iterator.next();

while (!result.done) {
  let item = result.value;
  console.log(item);
  result = iterator.next();
}
```

---

## Iterator Objects Are Iterable

**Important**: The iterator object itself is iterable. It has a `Symbol.iterator` method that returns itself.

```javascript
let arr = [1, 2, 3];
let iterator = arr[Symbol.iterator]();

// The iterator is iterable
console.log(iterator[Symbol.iterator]() === iterator); // true
```

### Practical Use: Partially Used Iterators

This allows you to iterate through a "partially used" iterator:

```javascript
let list = [1, 2, 3, 4, 5];
let iter = list[Symbol.iterator]();

let head = iter.next().value; // head == 1
let tail = [...iter]; // tail == [2, 3, 4, 5]

console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

**What happened**:

1. `iter.next()` consumed the first element (1)
2. Spread operator `[...iter]` iterated the remaining elements
3. This works because `iter` itself is iterable

---

## Complete Examples

### Example 1: Manual Iteration of an Array

```javascript
let arr = ['a', 'b', 'c'];
let iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 'a', done: false }
console.log(iterator.next()); // { value: 'b', done: false }
console.log(iterator.next()); // { value: 'c', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Example 2: Manual Iteration of a String

```javascript
let str = 'Hi';
let iterator = str[Symbol.iterator]();

console.log(iterator.next()); // { value: 'H', done: false }
console.log(iterator.next()); // { value: 'i', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Example 3: Manual Iteration of a Set

```javascript
let set = new Set([10, 20, 30]);
let iterator = set[Symbol.iterator]();

let result;
while (!(result = iterator.next()).done) {
  console.log(result.value); // 10, 20, 30
}
```

### Example 4: Consuming Part of an Iterator

```javascript
let numbers = [1, 2, 3, 4, 5, 6];
let iter = numbers[Symbol.iterator]();

// Take first two elements
let first = iter.next().value; // 1
let second = iter.next().value; // 2

// Get the rest
let rest = [...iter]; // [3, 4, 5, 6]

console.log({ first, second, rest });
// { first: 1, second: 2, rest: [3, 4, 5, 6] }
```

### Example 5: Using Spread Operator with Partial Iterator

```javascript
let arr = [10, 20, 30, 40, 50];
let iter = arr[Symbol.iterator]();

// Skip first element
iter.next();

// Create new array from remaining elements
let newArr = [...iter];
console.log(newArr); // [20, 30, 40, 50]
```

---

## Creating Custom Iterables

You can make any object iterable by adding a `Symbol.iterator` method:

```javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,

      next() {
        if (this.current <= this.last) {
          return { value: this.current++, done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};

// Now it's iterable!
for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

console.log([...range]); // [1, 2, 3, 4, 5]
```

### Simpler Custom Iterable (Using Generator)

```javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  },
};

console.log([...range]); // [1, 2, 3, 4, 5]
```

---

## Built-in Operations That Use Iterators

All of these work with any iterable object:

```javascript
let set = new Set([1, 2, 3]);

// for/of loop
for (let value of set) {
  console.log(value);
}

// Spread operator
let arr = [...set]; // [1, 2, 3]

// Destructuring
let [a, b, c] = set; // a=1, b=2, c=3

// Array.from()
let arr2 = Array.from(set); // [1, 2, 3]

// Map and Set constructors
let map = new Map([
  [1, 'one'],
  [2, 'two'],
]);
let newSet = new Set(map.keys());
```

---

## Iterator Protocol Summary

### Iterable Protocol

An object is iterable if:

- It has a method with key `Symbol.iterator`
- That method returns an iterator object

```javascript
iterable[Symbol.iterator]() → returns iterator
```

### Iterator Protocol

An object is an iterator if:

- It has a `next()` method
- `next()` returns an object with `value` and `done` properties

```javascript
iterator.next() → returns { value: any, done: boolean }
```

---

## Key Concepts

✅ **Three types**: Iterable objects, Iterator objects, Iteration result objects
✅ **Iterable objects** have a `Symbol.iterator` method
✅ **Iterator objects** have a `next()` method
✅ **Iteration results** have `value` and `done` properties
✅ **for/of loops** and **spread operators** use the iterator protocol
✅ **Iterator objects are themselves iterable** (return themselves from `Symbol.iterator`)
✅ You can **partially consume** an iterator and continue with the rest
✅ **Custom objects** can be made iterable by implementing `Symbol.iterator`
✅ **Generators** provide an easy way to create iterators

---

## Comparison: for/of vs Manual Iteration

| Aspect             | for/of Loop      | Manual Iteration                  |
| ------------------ | ---------------- | --------------------------------- |
| **Syntax**         | Clean and simple | Verbose                           |
| **Use case**       | Full iteration   | Partial iteration, custom control |
| **Error handling** | Automatic        | Manual                            |
| **Control**        | Less             | More (can skip, peek, etc.)       |

**Use for/of when**: You want to iterate all elements simply

**Use manual iteration when**: You need fine-grained control over iteration (peeking, skipping, partial consumption)

---

## Practical Tips

💡 Use `for/of` for simple full iterations
💡 Use manual iteration when you need to consume part of an iterable
💡 Remember iterators maintain state - calling `next()` progresses the iterator
💡 Once `done: true`, the iterator is exhausted
💡 Iterators themselves are iterable (useful with spread operator)
💡 Use generators (`function*`) to easily create custom iterables
