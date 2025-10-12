# JavaScript `for...of` Loop

## Overview

The `for...of` loop is an **ES6 feature** that provides a clean, modern way to iterate over iterable objects. It's completely different from both the regular `for` loop and the older `for...in` loop.

## Basic Syntax

```javascript
for (variable of iterable) statement;
```

The syntax includes:

- The `for` keyword followed by parentheses
- A variable declaration (or variable name) inside the parentheses
- The `of` keyword
- An expression that evaluates to an iterable object
- The loop body (typically in curly braces)

## What You Can Loop Over (Iterables)

- ✅ **Arrays**
- ✅ **Strings**
- ✅ **Maps**
- ✅ **Sets**
- ✅ **Typed Arrays**
- ✅ **NodeLists** (from DOM queries)
- ✅ Any object that implements the iterable protocol
- ❌ **Plain objects** (not iterable by default)

---

## Working with Arrays

### Basic Array Iteration

```javascript
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let sum = 0;

for (let element of data) {
  sum += element;
}

console.log(sum); // => 45
```

**How it works:**

- Loop body runs once for each element
- Array elements are assigned to the variable in order (first to last)
- Elements are iterated in sequence

### ⚠️ Live Iteration Warning

Arrays are iterated **"live"** - changes made during iteration affect the outcome:

```javascript
let data = [1, 2, 3, 4, 5];
let sum = 0;

for (let element of data) {
  sum += element;
  data.push(sum); // ⚠️ Creates infinite loop!
}
```

Adding elements during iteration can cause infinite loops because the iteration never reaches the last element.

---

## Working with Objects

### Plain Objects Are NOT Iterable

```javascript
let o = { x: 1, y: 2, z: 3 };
for (let element of o) {
  // ❌ Throws TypeError because o is not iterable
  console.log(element);
}
```

### Solution 1: Iterate Over Keys with `Object.keys()`

```javascript
let o = { x: 1, y: 2, z: 3 };
let keys = '';

for (let k of Object.keys(o)) {
  keys += k;
}

console.log(keys); // => "xyz"
```

**Note:** This iteration is **not live** - changes to the object during the loop won't affect the iteration.

### Solution 2: Iterate Over Values with `Object.values()`

```javascript
let o = { x: 1, y: 2, z: 3 };
let sum = 0;

for (let v of Object.values(o)) {
  sum += v;
}

console.log(sum); // => 6
```

### Solution 3: Iterate Over Key-Value Pairs with `Object.entries()`

```javascript
let o = { x: 1, y: 2, z: 3 };
let pairs = '';

for (let [k, v] of Object.entries(o)) {
  pairs += k + v;
}

console.log(pairs); // => "x1y2z3"
```

**How it works:**

- `Object.entries()` returns an array of arrays: `[['x', 1], ['y', 2], ['z', 3]]`
- Destructuring assignment unpacks each inner array into `k` and `v` variables

---

## Working with Strings

Strings are iterable **character-by-character** in ES6:

```javascript
let frequency = {};

for (let letter of 'mississippi') {
  if (frequency[letter]) {
    frequency[letter]++;
  } else {
    frequency[letter] = 1;
  }
}

console.log(frequency); // => {m: 1, i: 4, s: 4, p: 2}
```

### Important: Unicode Codepoint Iteration

Strings iterate by **Unicode codepoint**, not UTF-16 character:

```javascript
let str = 'I💜🐈‍⬛';
console.log(str.length); // => 5 (UTF-16 characters)

// But for...of iterates 3 times (codepoints)
for (let char of str) {
  console.log(char); // I, 💜, 🐈‍⬛
}
```

---

## Working with Set

Sets iterate once for each unique element:

```javascript
let text = 'Na na na na na na na na Batman!';
let wordSet = new Set(text.split(' '));
let unique = [];

for (let word of wordSet) {
  unique.push(word);
}

console.log(unique); // => ["Na", "na", "Batman!"]
```

---

## Working with Map

Maps iterate over **key-value pairs** (not just keys or values):

```javascript
let m = new Map([
  [1, 'one'],
  [2, 'two'],
]);

for (let [key, value] of m) {
  console.log(key); // => 1, 2
  console.log(value); // => "one", "two"
}
```

**How it works:**

- Each iteration returns an array: `[key, value]`
- Destructuring assignment unpacks the key and value

---

## `for...of` vs `for...in`

```javascript
let arr = ['a', 'b', 'c'];

// for...of gives VALUES
for (let value of arr) {
  console.log(value); // a, b, c
}

// for...in gives KEYS/INDEXES
for (let index in arr) {
  console.log(index); // 0, 1, 2
}
```

---

## Getting Index When Needed

Use `.entries()` to get both index and value:

```javascript
let fruits = ['apple', 'banana', 'orange'];

for (let [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
// Output: 0: apple, 1: banana, 2: orange
```

---

## Asynchronous Iteration with `for...await`

**ES2018** introduces `for...await` for asynchronous iterators:

```javascript
// Read chunks from an asynchronously iterable stream
async function printStream(stream) {
  for await (let chunk of stream) {
    console.log(chunk);
  }
}
```

---

## Key Characteristics

✅ **Direct value access** - You get actual values, not indexes
✅ **Clean and readable** - Simple, intuitive syntax
✅ **Works with any iterable** - Arrays, strings, Maps, Sets, etc.
✅ **Live iteration for arrays** - Changes during iteration affect outcome
❌ **No index access** - Can't easily get current position (use `.entries()`)
❌ **Can't loop over plain objects** - Use `for...in`, `Object.keys()`, `Object.values()`, or `Object.entries()`

---

## When to Use `for...of`

- ✅ When you need to iterate over **values** in an iterable
- ✅ When you don't need the index
- ✅ When working with arrays, strings, Maps, Sets
- ✅ When you want clean, readable code
- ✅ When you need to iterate through object properties (with `Object.keys()`, `Object.values()`, or `Object.entries()`)

## When NOT to Use `for...of`

- ❌ When looping over plain objects directly (throws TypeError)
- ❌ When you need fine control over the loop (use regular `for` loop)
- ❌ When you need the index frequently without destructuring

---

## Key Takeaways

- `for...of` is an **ES6 feature** for iterating over iterable objects
- It loops through **values**, not keys/indexes
- Arrays are iterated **live** - modifications during iteration affect the loop
- Plain objects are **not iterable** - use `Object.keys()`, `Object.values()`, or `Object.entries()`
- Strings iterate by **Unicode codepoint**, not UTF-16 character
- Maps iterate over **key-value pairs** as arrays
- Use destructuring to unpack arrays and key-value pairs
- Modern, preferred way for clean iteration in JavaScript
