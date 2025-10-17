# JavaScript Array Methods

JavaScript arrays have powerful built-in methods that make working with collections easier. This guide covers all essential array methods organized by category.

---

## Overview: Method Behaviors

Before diving in, understand these key points:

- **Some methods modify the original array** (mutating methods)
- **Some methods return a new array** (non-mutating methods)
- **Iterator methods** accept a function as the first argument
- **Most iterator methods** invoke your function with three arguments: `(value, index, array)`
- **Sparse arrays**: Iterator methods skip non-existent elements
- **Optional `this` argument**: Many methods accept a second argument to set the `this` value inside your function

---

## 1. Array Iterator Methods

These methods iterate over arrays, invoking a function you specify on each element.

### forEach()

Iterates through an array, invoking a function for each element. **No return value**, **cannot break early**.

```javascript
let data = [1, 2, 3, 4, 5];
let sum = 0;

// Sum array elements
data.forEach((value) => {
  sum += value;
}); // sum = 15

// Modify array in place
data.forEach((v, i, a) => {
  a[i] = v + 1;
}); // [2, 3, 4, 5, 6]
```

**Key points**:

- No way to terminate iteration early (no `break`)
- Often use only the first parameter (value)
- Modifies original array if you change `a[i]`

### map()

Creates a **new array** by transforming each element with your function.

```javascript
let a = [1, 2, 3];
let squared = a.map((x) => x * x); // [1, 4, 9]

// Original array unchanged
console.log(a); // [1, 2, 3]
```

**Key points**:

- Returns a new array of the same length
- Original array is not modified
- Sparse arrays remain sparse in the result
- Your function's return value becomes the new element

### filter()

Creates a **new array** containing only elements that pass a test (predicate returns truthy).

```javascript
let a = [5, 4, 3, 2, 1];

a.filter((x) => x < 3); // [2, 1]
a.filter((x, i) => i % 2 === 0); // [5, 3, 1] - every other value
```

**Practical uses**:

```javascript
// Close gaps in sparse array
let dense = sparse.filter(() => true);

// Remove null and undefined
a = a.filter((x) => x !== undefined && x !== null);
```

**Key points**:

- Returns a new array (subset of original)
- Always returns a dense array (no gaps)
- Skips missing elements in sparse arrays

### find() and findIndex()

Find the **first element** (or its index) that matches your condition. **Stops iterating** when found.

```javascript
let a = [1, 2, 3, 4, 5];

a.find((x) => x === 3); // 3
a.findIndex((x) => x === 3); // 2 (index)

a.find((x) => x < 0); // undefined
a.findIndex((x) => x < 0); // -1

a.find((x) => x % 5 === 0); // 5
```

**Key points**:

- `find()` returns the element or `undefined`
- `findIndex()` returns the index or `-1`
- Stop at first match (more efficient than `filter()`)

### every() and some()

Array predicates that test whether **all** or **some** elements satisfy a condition.

**every()** - "for all" (∀):

```javascript
let a = [1, 2, 3, 4, 5];

a.every((x) => x < 10); // true (all values < 10)
a.every((x) => x % 2 === 0); // false (not all even)
```

**some()** - "there exists" (∃):

```javascript
let a = [1, 2, 3, 4, 5];

a.some((x) => x % 2 === 0); // true (has even numbers)
a.some(isNaN); // false (no non-numbers)
```

**Key points**:

- Both stop early when result is determined
- `every()` returns `true` for empty arrays (mathematical convention)
- `some()` returns `false` for empty arrays

### reduce() and reduceRight()

Combine all elements into a single value using an accumulator function.

```javascript
let a = [1, 2, 3, 4, 5];

// Sum
a.reduce((x, y) => x + y, 0); // 15

// Product
a.reduce((x, y) => x * y, 1); // 120

// Find max
a.reduce((x, y) => (x > y ? x : y)); // 5
```

**How it works**:

- **First argument**: Reduction function `(accumulator, currentValue, index, array)`
- **Second argument (optional)**: Initial value
- Without initial value, uses first element as initial value

**Execution flow** (sum example):

```javascript
// a.reduce((acc, val) => acc + val, 0)
// Call 1: (0, 1) -> 1
// Call 2: (1, 2) -> 3
// Call 3: (3, 3) -> 6
// Call 4: (6, 4) -> 10
// Call 5: (10, 5) -> 15
```

**reduceRight()** - processes from right to left:

```javascript
// Compute 2^(3^4) with right-to-left precedence
let a = [2, 3, 4];
a.reduceRight((acc, val) => Math.pow(val, acc));
// 2.4178516392292583e+24
```

**Key points**:

- Empty array with no initial value throws `TypeError`
- Single value (no reduction needed) returns that value
- Can build complex operations, but may reduce readability

---

## 2. Flattening Arrays

### flat()

Flattens nested arrays by the specified depth (default: 1 level).

```javascript
[1, [2, 3]].flat(); // [1, 2, 3]
[1, [2, [3]]].flat(); // [1, 2, [3]] - only 1 level

let a = [1, [2, [3, [4]]]];
a.flat(1); // [1, 2, [3, [4]]]
a.flat(2); // [1, 2, 3, [4]]
a.flat(3); // [1, 2, 3, 4]
```

### flatMap()

Maps each element, then flattens the result by 1 level. More efficient than `map().flat()`.

```javascript
let phrases = ['hello world', 'the definitive guide'];
let words = phrases.flatMap((phrase) => phrase.split(' '));
// ["hello", "world", "the", "definitive", "guide"]
```

**Advanced use** - map to variable-length output:

```javascript
// Map non-negative numbers to square roots, remove negatives
[-2, -1, 1, 2].flatMap((x) => (x < 0 ? [] : Math.sqrt(x)));
// [1, 1.4142135623730951]
```

---

## 3. Array Concatenation

### concat()

Creates a **new array** by concatenating the original array with additional values/arrays.

```javascript
let a = [1, 2, 3];

a.concat(4, 5); // [1, 2, 3, 4, 5]
a.concat([4, 5], [6, 7]); // [1, 2, 3, 4, 5, 6, 7]
a.concat(4, [5, [6, 7]]); // [1, 2, 3, 4, 5, [6, 7]] - doesn't flatten nested

console.log(a); // [1, 2, 3] - original unchanged
```

**Key points**:

- Flattens array arguments (1 level only)
- Does not modify original array
- Creates a copy (expensive operation)
- Consider `push()` or `splice()` for in-place modification

---

## 4. Stack and Queue Methods

### push() and pop() - Stack (LIFO)

**push()** - Add elements to the **end**, returns new length.
**pop()** - Remove and return the **last** element.

```javascript
let stack = [];
stack.push(1, 2); // [1, 2]; returns 2
stack.pop(); // [1]; returns 2
stack.push(3); // [1, 3]
stack.pop(); // [1]; returns 3
stack.push([4, 5]); // [1, [4, 5]]
stack.pop(); // [1]; returns [4, 5]
```

**Spreading values**:

```javascript
a.push(...values); // Push all elements from another array
```

### unshift() and shift() - Queue (FIFO)

**unshift()** - Add elements to the **beginning**, returns new length.
**shift()** - Remove and return the **first** element.

```javascript
let q = [];
q.push(1, 2); // [1, 2] - add to end
q.shift(); // [2]; returns 1 - remove from start
q.push(3); // [2, 3]
q.shift(); // [3]; returns 2
```

**unshift() order quirk**:

```javascript
let a = [];
a.unshift(1); // [1]
a.unshift(2); // [2, 1]

a = [];
a.unshift(1, 2); // [1, 2] - different order!
```

**Performance note**: `unshift()`/`shift()` are less efficient than `push()`/`pop()` because elements must be shifted.

---

## 5. Subarray Methods

### slice()

Extracts a portion of an array **without modifying** the original.

```javascript
let a = [1, 2, 3, 4, 5];

a.slice(0, 3); // [1, 2, 3]
a.slice(3); // [4, 5] - from index 3 to end
a.slice(1, -1); // [2, 3, 4] - negative = offset from end
a.slice(-3, -2); // [3]
```

**Arguments**:

- **First**: Start index (inclusive)
- **Second**: End index (exclusive)
- Negative values count from the end

### splice()

General-purpose method for **modifying** arrays (insert, delete, or replace elements).

```javascript
let a = [1, 2, 3, 4, 5, 6, 7, 8];

// Delete from index 4 to end
a.splice(4); // Returns [5, 6, 7, 8]; a = [1, 2, 3, 4]

// Delete 2 elements starting at index 1
a.splice(1, 2); // Returns [2, 3]; a = [1, 4]

// Insert without deleting (0 deletions)
a = [1, 2, 3, 4, 5];
a.splice(2, 0, 'a', 'b'); // Returns []; a = [1, 2, "a", "b", 3, 4, 5]

// Replace elements
a.splice(2, 2, [1, 2], 3); // Returns ["a", "b"]; a = [1, 2, [1, 2], 3, 3, 4, 5]
```

**Arguments**:

- **First**: Start index
- **Second**: Number of elements to delete
- **Rest**: Elements to insert at that position

**Key difference from slice()**:

- `slice()` second arg = end index
- `splice()` second arg = count (length)

### fill()

Fills array elements with a static value. **Modifies** the array.

```javascript
let a = new Array(5); // [empty × 5]

a.fill(0); // [0, 0, 0, 0, 0]
a.fill(9, 1); // [0, 9, 9, 9, 9] - from index 1
a.fill(8, 2, -1); // [0, 9, 8, 8, 9] - indexes 2-3
```

**Arguments**:

- **First**: Value to fill
- **Second (optional)**: Start index (default: 0)
- **Third (optional)**: End index (exclusive, default: length)

### copyWithin()

Copies a slice of the array to another position **within the same array**. **Modifies** in place.

```javascript
let a = [1, 2, 3, 4, 5];

a.copyWithin(1); // [1, 1, 2, 3, 4]
a.copyWithin(2, 3, 5); // [1, 1, 3, 4, 4]
a.copyWithin(0, -2); // [4, 4, 3, 4, 4]
```

**Arguments**:

- **First**: Destination index
- **Second**: Source start index (default: 0)
- **Third**: Source end index (default: length)

**Key points**:

- Does not change array length
- Handles overlapping regions correctly
- High-performance method (modeled after C's `memmove()`)

---

## 6. Searching and Sorting

### indexOf() and lastIndexOf()

Find the index of an element using strict equality (`===`).

```javascript
let a = [0, 1, 2, 1, 0];

a.indexOf(1); // 1 (first occurrence)
a.lastIndexOf(1); // 3 (last occurrence)
a.indexOf(3); // -1 (not found)
```

**Optional second argument** - start index:

```javascript
// Find all occurrences
function findAll(a, x) {
  let results = [],
    pos = 0;

  while (pos < a.length) {
    pos = a.indexOf(x, pos);
    if (pos === -1) break;
    results.push(pos);
    pos++;
  }

  return results;
}
```

**Key points**:

- Uses `===` for comparison
- Returns `-1` if not found
- Negative second argument = offset from end

### includes()

Tests whether an array contains a value (returns boolean).

```javascript
let a = [1, true, 3, NaN];

a.includes(true); // true
a.includes(2); // false
a.includes(NaN); // true (special case!)
a.indexOf(NaN); // -1 (can't find NaN)
```

**Key difference from indexOf()**:

- `includes()` can find `NaN` (considers `NaN === NaN`)
- `indexOf()` cannot find `NaN` (uses strict `===`)

### sort()

Sorts array **in place** and returns the sorted array.

**Default: alphabetical order**:

```javascript
let a = ['banana', 'cherry', 'apple'];
a.sort(); // ["apple", "banana", "cherry"]
```

**Numeric sort** (requires comparator):

```javascript
let a = [33, 4, 1111, 222];

a.sort(); // [1111, 222, 33, 4] - alphabetical!

a.sort((a, b) => a - b); // [4, 33, 222, 1111] - ascending
a.sort((a, b) => b - a); // [1111, 222, 33, 4] - descending
```

**Comparator function rules**:

- Return **< 0** if `a` should come before `b`
- Return **> 0** if `a` should come after `b`
- Return **0** if order doesn't matter

**Case-insensitive sort**:

```javascript
let a = ['ant', 'Bug', 'cat', 'Dog'];

a.sort(); // ["Bug", "Dog", "ant", "cat"] - case-sensitive

a.sort((s, t) => {
  let a = s.toLowerCase();
  let b = t.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}); // ["ant", "Bug", "cat", "Dog"]
```

### reverse()

Reverses the array **in place**.

```javascript
let a = [1, 2, 3];
a.reverse(); // [3, 2, 1]
```

---

## 7. Array to String Conversions

### join()

Converts array elements to strings and concatenates them with a separator.

```javascript
let a = [1, 2, 3];

a.join(); // "1,2,3" (default comma)
a.join(' '); // "1 2 3"
a.join(''); // "123"

let b = new Array(10);
b.join('-'); // "---------" (9 hyphens)
```

**Key points**:

- Inverse of `String.split()`
- Default separator is comma

### toString()

Converts array to string (same as `join()` with no arguments).

```javascript
[1, 2, 3].toString(); // "1,2,3"
['a', 'b', 'c'].toString(); // "a,b,c"
[1, [2, 'c']].toString(); // "1,2,c" (flattens nested)
```

### toLocaleString()

Localized version of `toString()` - calls `toLocaleString()` on each element.

---

## 8. Static Array Functions

### Array.isArray()

Determines whether a value is an array.

```javascript
Array.isArray([]); // true
Array.isArray({}); // false
Array.isArray('not array'); // false
```

### Array.of()

Creates an array from arguments.

```javascript
Array.of(1, 2, 3); // [1, 2, 3]
Array.of(7); // [7] (not a length-7 array)
```

### Array.from()

Creates an array from an array-like or iterable object.

```javascript
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
Array.from(new Set([1, 2, 3])); // [1, 2, 3]
Array.from([1, 2, 3], (x) => x * 2); // [2, 4, 6] (with map function)
```

---

## Quick Reference: Mutating vs Non-Mutating

### Mutating (modify original array)

- `push()`, `pop()`, `shift()`, `unshift()`
- `splice()`, `fill()`, `copyWithin()`
- `sort()`, `reverse()`

### Non-Mutating (return new array/value)

- `map()`, `filter()`, `slice()`, `concat()`
- `flat()`, `flatMap()`
- `join()`, `toString()`
- `indexOf()`, `lastIndexOf()`, `includes()`
- `find()`, `findIndex()`
- `every()`, `some()`, `reduce()`

---

## Best Practices

✅ Use `map()` for transformations
✅ Use `filter()` for subsets
✅ Use `find()` instead of `filter()[0]`
✅ Use `some()`/`every()` for boolean tests
✅ Prefer `includes()` over `indexOf() !== -1`
✅ Use `slice()` for copying (non-destructive)
✅ Use `splice()` for in-place modifications
✅ Always provide a comparator to `sort()` for numbers
✅ Use spread operator `...` with `push()` to flatten arrays
✅ Consider readability when using `reduce()` for complex operations
