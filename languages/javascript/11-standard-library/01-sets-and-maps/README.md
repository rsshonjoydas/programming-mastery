# JavaScript Sets and Maps

## Why Sets and Maps?

Before ES6, JavaScript only had **objects** for key-value storage, but this had limitations:

- ❌ Keys must be strings (or converted to strings)
- ❌ Objects inherit properties like `toString()` that may interfere
- ❌ No built-in way to track collection size efficiently
- ❌ Poor performance for membership testing

**ES6 introduced** `Set` and `Map` to solve these problems with optimized, purpose-built data structures.

---

## The Set Class

A **Set** is a collection of **unique values** (no duplicates allowed).

### Key Characteristics

- ✅ Not ordered or indexed (no `set[0]`)
- ✅ No duplicates (values are unique)
- ✅ Fast membership testing with `has()`
- ✅ Remembers insertion order for iteration
- ✅ Can contain any type of value

### Creating Sets

```javascript
let s = new Set(); // Empty set
let t = new Set([1, 2, 3]); // From array
let u = new Set(t); // Copy another set
let unique = new Set('Mississippi'); // From string: M, i, s, p (4 unique)
```

**Note**: Any iterable object can initialize a Set.

### Set Properties and Methods

| Method/Property | Description                  | Returns |
| --------------- | ---------------------------- | ------- |
| `size`          | Number of values in set      | Number  |
| `add(value)`    | Add value to set (chainable) | Set     |
| `delete(value)` | Remove value from set        | Boolean |
| `has(value)`    | Check if value exists        | Boolean |
| `clear()`       | Remove all values            | void    |

### Adding and Removing Elements

```javascript
let s = new Set();
s.size; // 0

s.add(1); // Add number
s.size; // 1

s.add(1); // Add duplicate (no effect)
s.size; // 1 (still)

s.add(true); // Add boolean
s.add([1, 2, 3]); // Add array (adds the array itself, not elements)
s.size; // 3

s.delete(1); // true (successfully removed)
s.delete('test'); // false ("test" wasn't in set)
s.delete([1, 2, 3]); // false (different array reference)

s.clear(); // Remove everything
s.size; // 0
```

### Method Chaining

```javascript
let s = new Set();
s.add('a').add('b').add('c'); // add() returns the set
```

### Membership Testing (Most Important Operation)

```javascript
let oneDigitPrimes = new Set([2, 3, 5, 7]);

oneDigitPrimes.has(2); // true
oneDigitPrimes.has(4); // false
oneDigitPrimes.has('5'); // false (type matters!)
```

**Performance**: `has()` is **very fast** regardless of set size, much faster than `array.includes()`.

### Set Equality: Strict Identity (===)

Sets use **strict equality** (like `===`):

```javascript
let s = new Set();
s.add(1);
s.add('1');
s.size; // 2 (number 1 and string "1" are different)

s.add([1, 2]);
s.delete([1, 2]); // false (different array reference)
```

**Important**: Objects/arrays are compared by **reference**, not by content.

### Iterating Sets

**for...of loop**:

```javascript
let sum = 0;
for (let p of oneDigitPrimes) {
  sum += p;
}
sum; // 17 (2 + 3 + 5 + 7)
```

**Spread operator**:

```javascript
[...oneDigitPrimes]; // [2, 3, 5, 7]
Math.max(...oneDigitPrimes); // 7
```

**forEach() method**:

```javascript
let product = 1;
oneDigitPrimes.forEach((n) => {
  product *= n;
});
product; // 210 (2 * 3 * 5 * 7)
```

**Note**: `forEach()` passes the element as both first and second arguments (sets have no indexes).

### Insertion Order

Sets remember **insertion order** during iteration:

```javascript
let s = new Set();
s.add(3).add(1).add(2);
[...s]; // [3, 1, 2] (insertion order preserved)
```

---

## The Map Class

A **Map** is a collection of **key-value pairs** where keys can be **any type** (not just strings).

### **Key Characteristics**

- ✅ Keys can be any type (objects, functions, primitives)
- ✅ Fast lookups (faster than objects for frequent additions/deletions)
- ✅ Remembers insertion order
- ✅ Keys are compared by identity (===)
- ✅ Easy to get size with `size` property

### Creating Maps

```javascript
let m = new Map(); // Empty map

let n = new Map([
  // From array of [key, value] pairs
  ['one', 1],
  ['two', 2],
]);

let copy = new Map(n); // Copy another map

let o = { x: 1, y: 2 };
let p = new Map(Object.entries(o)); // From object
```

### Map Properties and Methods

| Method/Property   | Description                           | Returns            |
| ----------------- | ------------------------------------- | ------------------ |
| `size`            | Number of key-value pairs             | Number             |
| `set(key, value)` | Add/update key-value pair (chainable) | Map                |
| `get(key)`        | Get value for key                     | Value or undefined |
| `has(key)`        | Check if key exists                   | Boolean            |
| `delete(key)`     | Remove key-value pair                 | Boolean            |
| `clear()`         | Remove all pairs                      | void               |
| `keys()`          | Iterator of keys                      | Iterator           |
| `values()`        | Iterator of values                    | Iterator           |
| `entries()`       | Iterator of [key, value] pairs        | Iterator           |

### Basic Operations

```javascript
let m = new Map();
m.size; // 0

m.set('one', 1); // Add key-value pair
m.set('two', 2);
m.size; // 2

m.get('two'); // 2
m.get('three'); // undefined (key doesn't exist)

m.set('one', true); // Update existing key
m.size; // 2 (size unchanged)

m.has('one'); // true
m.has(true); // false

m.delete('one'); // true
m.delete('three'); // false

m.clear(); // Remove all
```

### **Method Chaining**

```javascript
let m = new Map().set('one', 1).set('two', 2).set('three', 3);

m.size; // 3
m.get('two'); // 2
```

### Any Value as Key or Value

```javascript
let m = new Map();

// Primitive keys
m.set(null, 'null key');
m.set(undefined, 'undefined key');
m.set(NaN, 'NaN key');

// Object/array keys
m.set({}, 1); // Empty object as key
m.set({}, 2); // Different empty object
m.size; // 2 (different object references)

m.get({}); // undefined (different reference)

m.set(m, undefined); // Map itself as key
m.has(m); // true
```

**Key comparison**: Uses identity (`===`), not equality.

### Iterating Maps

**for...of with destructuring**:

```javascript
let m = new Map([
  ['x', 1],
  ['y', 2],
]);

for (let [key, value] of m) {
  console.log(key, value);
}
// x 1
// y 2
```

**Spread operator**:

```javascript
[...m]; // [["x", 1], ["y", 2]]
```

**keys(), values(), entries()**:

```javascript
[...m.keys()]; // ["x", "y"]
[...m.values()]; // [1, 2]
[...m.entries()]; // [["x", 1], ["y", 2]] (same as [...m])
```

**forEach() method**:

```javascript
m.forEach((value, key) => {
  console.log(key, value);
});
// Note: value comes BEFORE key (like arrays: element before index)
```

### **Insertion Order**

Maps iterate in **insertion order**:

```javascript
let m = new Map();
m.set('z', 3).set('a', 1).set('m', 2);

[...m.keys()]; // ["z", "a", "m"] (insertion order)
```

---

## WeakMap and WeakSet

**Weak collections** don't prevent their contents from being **garbage collected**.

### WeakMap

A variant of Map with **weak references** to keys.

#### Key Differences from Map

| Feature                | Map      | WeakMap                                    |
| ---------------------- | -------- | ------------------------------------------ |
| **Key types**          | Any      | Objects/arrays only                        |
| **Iterable**           | ✅ Yes   | ❌ No                                      |
| **Methods**            | All      | Only `get()`, `set()`, `has()`, `delete()` |
| **size property**      | ✅ Yes   | ❌ No                                      |
| **Garbage collection** | Prevents | Allows                                     |

#### Why Use WeakMap?

**Prevent memory leaks** when associating data with objects:

```javascript
let cache = new WeakMap();

function computeExpensive(obj) {
  if (cache.has(obj)) {
    return cache.get(obj); // Return cached result
  }

  let result = /* expensive computation */;
  cache.set(obj, result);  // Cache for later
  return result;
}

// When obj is no longer used, it can be garbage collected
// (along with its cached value in WeakMap)
```

**Use case**: Caching computed values without preventing garbage collection.

#### Creating WeakMap

```javascript
let wm = new WeakMap();

let obj = { id: 1 };
wm.set(obj, 'metadata');

wm.get(obj); // "metadata"
wm.has(obj); // true
wm.delete(obj); // true

// Cannot use primitives as keys
wm.set('string', 1); // TypeError
```

### WeakSet

A variant of Set with **weak references** to values.

#### Key Differences from Set

| Feature                | Set      | WeakSet                           |
| ---------------------- | -------- | --------------------------------- |
| **Value types**        | Any      | Objects/arrays only               |
| **Iterable**           | ✅ Yes   | ❌ No                             |
| **Methods**            | All      | Only `add()`, `has()`, `delete()` |
| **size property**      | ✅ Yes   | ❌ No                             |
| **Garbage collection** | Prevents | Allows                            |

#### Why Use WeakSet?

**Mark/brand objects** without preventing garbage collection:

```javascript
let markedObjects = new WeakSet();

function markAsProcessed(obj) {
  markedObjects.add(obj);
}

function isProcessed(obj) {
  return markedObjects.has(obj);
}

let obj = { data: 'test' };
markAsProcessed(obj);
isProcessed(obj); // true

// When obj is no longer referenced, it can be garbage collected
```

**Use case**: Tagging objects with metadata without memory leaks.

#### Creating WeakSet

```javascript
let ws = new WeakSet();

let obj1 = {};
let obj2 = [];

ws.add(obj1);
ws.add(obj2);

ws.has(obj1); // true
ws.delete(obj1); // true

// Cannot use primitives
ws.add(1); // TypeError
```

---

## Comparison: Object vs Map

| Feature         | Object                          | Map                               |
| --------------- | ------------------------------- | --------------------------------- |
| **Key types**   | Strings/Symbols only            | Any type                          |
| **Iteration**   | for...in (includes prototype)   | for...of (clean iteration)        |
| **Size**        | Manual counting                 | `size` property                   |
| **Performance** | Slower for frequent add/delete  | Optimized for frequent operations |
| **Prototype**   | Inherits properties             | No default keys                   |
| **Ordering**    | Not guaranteed (mostly ordered) | Guaranteed insertion order        |

**When to use Map**:

- ✅ Keys are not strings
- ✅ Frequent additions/deletions
- ✅ Need to track size easily
- ✅ Need guaranteed iteration order

**When to use Object**:

- ✅ JSON serialization needed
- ✅ Keys are always strings
- ✅ Simple, static structure

---

## Key Concepts Summary

### Set

✅ **Unique values** collection (no duplicates)
✅ **Fast membership testing** with `has()`
✅ Uses **strict equality** (===) for comparison
✅ Preserves **insertion order** during iteration
✅ Cannot be indexed like arrays
✅ Ideal for removing duplicates and checking membership

### Map

✅ **Key-value pairs** with any type as key
✅ **Fast lookups** regardless of size
✅ Uses **strict identity** for key comparison
✅ Preserves **insertion order** during iteration
✅ Better than objects for frequent add/delete operations
✅ `forEach()` passes value before key (like arrays)

### WeakMap/WeakSet

✅ Allow **garbage collection** of keys/values
✅ **Not iterable** and have no `size` property
✅ Keys/values must be **objects or arrays**
✅ Prevent **memory leaks** in caching scenarios
✅ Used for **private data** and **object metadata**

---

## Practical Use Cases

**Set**: Remove duplicates, check membership, unique collections
**Map**: Caching, object metadata, frequency counters, complex keys
**WeakMap**: Private object data, DOM node metadata, caching without leaks
**WeakSet**: Object tagging, marking processed items, tracking state
