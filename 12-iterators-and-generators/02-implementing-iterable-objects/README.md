# JavaScript Implementing Iterable Objects

## What Are Iterable Objects?

**Iterable objects** are objects that can be iterated over using `for...of` loops, the spread operator (`...`), and other iteration protocols introduced in ES6.

### Why Make Objects Iterable?

Making your custom datatypes iterable allows them to work seamlessly with JavaScript's iteration features:

- `for...of` loops
- Spread operator (`...`)
- Destructuring assignment
- `Array.from()`
- `Promise.all()`, `Promise.race()`

---

## The Iteration Protocol

To make a class iterable, you must implement three components:

### 1. Iterable Object

An object with a method named `Symbol.iterator` that returns an iterator.

### 2. Iterator Object

An object with a `next()` method that returns iteration results.

### 3. Iteration Result Object

An object with:

- `value`: The next value in the iteration
- `done`: Boolean indicating if iteration is complete

---

## Basic Implementation: Iterable Range Class

Here's a complete implementation of an iterable `Range` class:

```javascript
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  // Test if a number is in the range
  has(x) {
    return typeof x === 'number' && this.from <= x && x <= this.to;
  }

  // String representation
  toString() {
    return `{ x | ${this.from} ≤ x ≤ ${this.to} }`;
  }

  // Make the class iterable by implementing Symbol.iterator
  [Symbol.iterator]() {
    // State variables for this iterator instance
    let next = Math.ceil(this.from); // Next value to return
    let last = this.to; // Last value to return

    // Return the iterator object
    return {
      // The next() method makes this an iterator
      next() {
        return next <= last
          ? { value: next++ } // Return next value
          : { done: true }; // Indicate completion
      },

      // Make the iterator itself iterable (convenience)
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

// Usage examples
for (let x of new Range(1, 10)) {
  console.log(x); // Logs numbers 1 to 10
}

[...new Range(-2, 2)]; // => [-2, -1, 0, 1, 2]
```

### Key Points

- `Symbol.iterator` is a **special symbol**, not a string
- Each iterator instance must track its own state independently
- The iterator object itself can be made iterable for convenience

---

## Iterable-Based Utility Functions

You can create powerful utility functions that return iterable values:

### Map Function

```javascript
function map(iterable, f) {
  let iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      let v = iterator.next();
      if (v.done) {
        return v;
      } else {
        return { value: f(v.value) };
      }
    },
  };
}

// Usage
[...map(new Range(1, 4), (x) => x * x)]; // => [1, 4, 9, 16]
```

### Filter Function

```javascript
function filter(iterable, predicate) {
  let iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      for (;;) {
        let v = iterator.next();
        if (v.done || predicate(v.value)) {
          return v;
        }
      }
    },
  };
}

// Usage
[...filter(new Range(1, 10), (x) => x % 2 === 0)]; // => [2, 4, 6, 8, 10]
```

---

## Lazy Evaluation

One of the key benefits of iterables is **lazy evaluation**: values are computed only when needed.

### Example: Lazy Word Iterator

```javascript
function words(s) {
  var r = /\s+|$/g; // Match spaces or end
  r.lastIndex = s.match(/[^ ]/).index; // Start at first non-space

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      let start = r.lastIndex; // Resume from last match
      if (start < s.length) {
        let match = r.exec(s); // Match next word boundary
        if (match) {
          return { value: s.substring(start, match.index) };
        }
      }
      return { done: true };
    },
  };
}

// Usage
[...words(' abc def  ghi! ')]; // => ["abc", "def", "ghi!"]
```

**Benefits**:

- Words are processed one at a time
- No need to allocate memory for entire array upfront
- Computation deferred until values are needed

---

## The `return()` Method: Closing Iterators

### Why `return()` is Needed

Iterators don't always run to completion. They may be terminated early by:

- `break` statement in a `for...of` loop
- `return` statement
- Thrown exception
- Destructuring assignment (only needed values extracted)

### Purpose of `return()`

The `return()` method allows iterators to perform cleanup:

- Close open files
- Release memory
- Terminate network connections
- Clean up resources

### Implementation

```javascript
class FileWordIterator {
  constructor(filename) {
    this.filename = filename;
    this.file = null;
  }

  [Symbol.iterator]() {
    // Open the file
    this.file = openFile(this.filename);
    let currentWord = null;

    return {
      next() {
        // Read next word from file
        currentWord = readNextWord(this.file);

        if (currentWord) {
          return { value: currentWord };
        } else {
          closeFile(this.file);
          return { done: true };
        }
      },

      // Cleanup method called when iteration stops early
      return() {
        if (this.file) {
          closeFile(this.file);
          this.file = null;
        }
        return { done: true }; // Must return iterator result object
      },

      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

// Usage - return() is called automatically
for (let word of new FileWordIterator('data.txt')) {
  if (word === 'stop') break; // return() called here
  console.log(word);
}
```

### `return()` Requirements

- Must return an iterator result object
- Properties of the returned object are ignored
- Returning a non-object value is an error
- Called automatically by the interpreter when iteration stops early

---

## Complete Example with All Features

```javascript
class CustomIterable {
  constructor(data) {
    this.data = data;
  }

  [Symbol.iterator]() {
    let index = 0;
    let data = this.data;

    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      },

      return(value) {
        console.log('Cleanup: Iterator stopped early');
        // Perform cleanup here
        return { done: true };
      },

      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

// Normal completion - return() not called
for (let item of new CustomIterable([1, 2, 3])) {
  console.log(item); // 1, 2, 3
}

// Early termination - return() called
for (let item of new CustomIterable([1, 2, 3, 4, 5])) {
  console.log(item);
  if (item === 2) break; // "Cleanup: Iterator stopped early"
}
```

---

## When Iteration Stops Early

The `return()` method is invoked when:

1. **`break` in `for...of` loop**:

   ```javascript
   for (let x of iterable) {
     if (x > 5) break; // return() called
   }
   ```

2. **`return` in `for...of` loop**:

   ```javascript
   for (let x of iterable) {
     if (x > 5) return; // return() called
   }
   ```

3. **Exception thrown**:

   ```javascript
   for (let x of iterable) {
     throw new Error(); // return() called
   }
   ```

4. **Destructuring with fewer variables**:

   ```javascript
   let [a, b] = iterable; // Only 2 values needed, return() called
   ```

---

## Best Practices

### ✅ DO

- Implement `Symbol.iterator` to return a fresh iterator each time
- Track state in the iterator, not the iterable
- Make iterators iterable by implementing `Symbol.iterator() { return this; }`
- Implement `return()` for cleanup when resources are involved
- Use lazy evaluation to defer computation
- Return proper iterator result objects

### ❌ DON'T

- Share state between multiple iterator instances
- Forget to implement `return()` when cleanup is needed
- Return non-object values from `return()`
- Mutate the original iterable during iteration
- Assume iteration will always complete

---

## Comparison: Manual vs Generator

**Manual Implementation** (covered here):

- More verbose and complex
- Full control over iteration logic
- Required for complex cleanup scenarios

**Generator Functions** (covered in later sections):

- Much simpler and cleaner syntax
- Uses `function*` and `yield`
- Automatically handles iterator protocol
- Preferred for most use cases

---

## Key Concepts Summary

📌 **Iterable objects** have a `Symbol.iterator` method that returns an iterator
📌 **Iterator objects** have a `next()` method that returns iteration results
📌 **Iteration results** have `value` and/or `done` properties
📌 **Each iterator** must maintain its own independent state
📌 **Lazy evaluation** defers computation until values are needed
📌 **`return()` method** enables cleanup when iteration stops early
📌 **Iterator convenience**: Making iterators iterable themselves simplifies usage
📌 **Symbol.iterator** is a symbol, not a string property name
📌 Custom iterables work with **`for...of`**, **spread operator**, and **destructuring**
📌 **Generator functions** provide a simpler alternative for most cases
