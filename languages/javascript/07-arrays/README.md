# JavaScript Arrays

## What Are Arrays?

An **array** is an ordered collection of values where:

- Each value is called an **element**
- Each element has a numeric position called its **index**
- Arrays are fundamental data structures in JavaScript

## Key Characteristics of JavaScript Arrays

### 1. **Untyped**

Array elements can be of **any type**, and different elements can have **different types**:

```javascript
let mixed = [1, 'hello', true, null, { name: 'John' }, [1, 2, 3]];
```

### 2. **Zero-Based Indexing**

- First element is at index `0`
- Last element is at index `length - 1`

```javascript
let fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "orange"
```

### 3. **32-bit Indexes**

- **Minimum index**: `0`
- **Maximum index**: `4,294,967,294` (2³² − 2)
- **Maximum array length**: `4,294,967,295` elements

### 4. **Dynamic**

Arrays automatically grow or shrink as needed:

```javascript
let arr = []; // Empty array
arr[0] = 'first'; // Length becomes 1
arr[100] = 'last'; // Length becomes 101
```

No need to:

- Declare a fixed size
- Reallocate memory when size changes

### 5. **Can Be Sparse**

Elements don't need contiguous indexes; gaps are allowed:

```javascript
let sparse = [];
sparse[0] = 'first';
sparse[10] = 'eleventh';
// Indexes 1-9 are undefined (gaps exist)
console.log(sparse.length); // 11
console.log(sparse[5]); // undefined
```

### 6. **Length Property**

Every array has a `length` property:

- **Non-sparse arrays**: Number of elements
- **Sparse arrays**: One more than the highest index

```javascript
let arr = [1, 2, 3];
console.log(arr.length); // 3

let sparse = [];
sparse[99] = 'value';
console.log(sparse.length); // 100 (not 1!)
```

---

## Creating Arrays

### 1. Array Literals

The most common way to create arrays:

```javascript
let empty = [];
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, 'two', true, null, { x: 1 }];
let nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
```

**Trailing commas** are allowed:

```javascript
let colors = ['red', 'green', 'blue']; // Legal
```

### 2. Array Constructor

```javascript
let arr1 = new Array(); // Empty array
let arr2 = new Array(5); // Array of length 5 (sparse)
let arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

**Warning**: Single numeric argument creates empty array of that length!

### 3. Array.of() (ES6)

Creates array from arguments (avoids constructor ambiguity):

```javascript
Array.of(5); // [5] (not array of length 5)
Array.of(1, 2, 3); // [1, 2, 3]
```

### 4. Array.from() (ES6)

Creates array from iterable or array-like object:

```javascript
Array.from('hello'); // ["h", "e", "l", "l", "o"]
Array.from([1, 2, 3], (x) => x * 2); // [2, 4, 6]
```

### 5. Spread Operator (ES6)

```javascript
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
let copy = [...arr1]; // Shallow copy
```

---

## Accessing Array Elements

### Reading Elements

```javascript
let fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]); // "apple"
console.log(fruits[1]); // "banana"
console.log(fruits[5]); // undefined (doesn't exist)
```

### Setting Elements

```javascript
fruits[1] = 'grape'; // Replace "banana" with "grape"
fruits[3] = 'mango'; // Add new element
fruits.length; // 4
```

### Negative Indexes

JavaScript doesn't support negative indexes like some languages:

```javascript
let arr = [1, 2, 3];
console.log(arr[-1]); // undefined (not last element!)
```

Use `arr[arr.length - 1]` for last element, or `arr.at(-1)` (ES2022).

---

## Array Length

The `length` property is special:

### Reading Length

```javascript
let arr = [1, 2, 3];
console.log(arr.length); // 3
```

### Setting Length

You can **modify** the length property:

```javascript
let arr = [1, 2, 3, 4, 5];

// Truncate array
arr.length = 3;
console.log(arr); // [1, 2, 3]

// Extend array (creates sparse array)
arr.length = 5;
console.log(arr); // [1, 2, 3, undefined, undefined]
```

### Length Behavior

- Always one more than the highest index
- Setting length smaller **deletes elements**
- Setting length larger creates **sparse array**

---

## Arrays Are Objects

Arrays are specialized JavaScript objects:

```javascript
let arr = [1, 2, 3];
console.log(typeof arr); // "object"
console.log(Array.isArray(arr)); // true (proper check)

// Array indexes are property names
arr[0]; // Same as arr["0"]
arr['1']; // Same as arr[1]
```

### Why Arrays Are Special

- **Optimized**: Numeric indexes are faster than regular object properties
- **`length` property**: Automatically maintained
- **Inheritance**: Arrays inherit from `Array.prototype`

---

## Array.prototype Methods

Arrays inherit many powerful methods from `Array.prototype`.

### Adding/Removing Elements

**At the end**:

```javascript
let arr = [1, 2, 3];
arr.push(4); // [1, 2, 3, 4] - returns new length
arr.pop(); // [1, 2, 3] - returns removed element (4)
```

**At the beginning**:

```javascript
arr.unshift(0); // [0, 1, 2, 3] - returns new length
arr.shift(); // [1, 2, 3] - returns removed element (0)
```

**At any position**:

```javascript
arr.splice(1, 1); // Remove 1 element at index 1
arr.splice(1, 0, 'a', 'b'); // Insert 'a', 'b' at index 1
arr.splice(1, 2, 'x'); // Replace 2 elements with 'x'
```

### Iterating Arrays

**forEach()**:

```javascript
arr.forEach((element, index) => {
  console.log(`${index}: ${element}`);
});
```

**map()** (transform elements):

```javascript
let doubled = arr.map((x) => x * 2);
```

**filter()** (select elements):

```javascript
let evens = arr.filter((x) => x % 2 === 0);
```

**reduce()** (accumulate values):

```javascript
let sum = arr.reduce((acc, val) => acc + val, 0);
```

### Searching Arrays

**indexOf() / lastIndexOf()**:

```javascript
let index = arr.indexOf(3); // First occurrence
let lastIdx = arr.lastIndexOf(3); // Last occurrence
```

**includes()** (ES2016):

```javascript
arr.includes(3); // true or false
```

**find() / findIndex()**:

```javascript
let found = arr.find((x) => x > 2); // First element > 2
let idx = arr.findIndex((x) => x > 2); // Index of first element > 2
```

**some() / every()**:

```javascript
arr.some((x) => x > 5); // true if ANY element satisfies
arr.every((x) => x > 0); // true if ALL elements satisfy
```

### Sorting and Reversing

```javascript
let arr = [3, 1, 4, 1, 5];
arr.sort(); // [1, 1, 3, 4, 5] (modifies original)
arr.reverse(); // [5, 4, 3, 1, 1] (modifies original)

// Custom sort
arr.sort((a, b) => b - a); // Descending order
```

### Combining and Slicing

**concat()**:

```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
let combined = arr1.concat(arr2); // [1, 2, 3, 4]
```

**slice()** (extract portion):

```javascript
let arr = [1, 2, 3, 4, 5];
let portion = arr.slice(1, 4); // [2, 3, 4] (doesn't modify original)
```

**join()** (create string):

```javascript
let arr = ['a', 'b', 'c'];
let str = arr.join('-'); // "a-b-c"
```

### Flattening Arrays

**flat()** (ES2019):

```javascript
let nested = [1, [2, 3], [4, [5, 6]]];
nested.flat(); // [1, 2, 3, 4, [5, 6]] (depth 1)
nested.flat(2); // [1, 2, 3, 4, 5, 6] (depth 2)
```

**flatMap()**:

```javascript
let arr = [1, 2, 3];
arr.flatMap((x) => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

---

## Array-Like Objects

Objects that have:

- Numeric indexes
- A `length` property

```javascript
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

// Convert to real array
let realArray = Array.from(arrayLike);
Array.prototype.forEach.call(arrayLike, console.log);
```

**Most array methods are generic** and work on array-like objects!

---

## Strings as Arrays

Strings behave like **read-only arrays** of characters:

```javascript
let str = 'hello';
console.log(str[0]); // "h"
console.log(str.length); // 5
console.log(str.charAt(1)); // "e"

// Array methods work on strings
Array.prototype.forEach.call(str, (char) => console.log(char));
```

---

## Multidimensional Arrays

JavaScript doesn't have true multidimensional arrays, but you can create **arrays of arrays**:

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(matrix[0][0]); // 1
console.log(matrix[1][2]); // 6
console.log(matrix[2][1]); // 8
```

---

## Typed Arrays (ES6)

For **high-performance** numeric operations and binary data:

```javascript
let int8 = new Int8Array(10); // 8-bit signed integers
let uint32 = new Uint32Array(10); // 32-bit unsigned integers
let float64 = new Float64Array(10); // 64-bit floats
```

**Characteristics**:

- **Fixed length**: Cannot grow or shrink
- **Fixed type**: All elements are the same numeric type
- **High performance**: Direct memory access
- **Byte-level access**: For binary data manipulation

**Common typed arrays**:

- `Int8Array`, `Uint8Array`
- `Int16Array`, `Uint16Array`
- `Int32Array`, `Uint32Array`
- `Float32Array`, `Float64Array`

---

## Performance Considerations

### Arrays Are Optimized

JavaScript engines optimize arrays when:

- Elements are stored contiguously (not sparse)
- All elements are the same type
- Numeric indexes are used

### When Arrays Are Slow

- Very sparse arrays
- Storing mixed types
- Using non-numeric properties

### Use Typed Arrays When

- Working with binary data
- Need maximum performance for numeric operations
- Working with WebGL, Canvas, or audio data

---

## Common Patterns

### Creating a Range

```javascript
// Array of 0-9
let range = Array.from({ length: 10 }, (_, i) => i);
// or
let range2 = [...Array(10).keys()];
```

### Removing Duplicates

```javascript
let unique = [...new Set(arr)];
```

### Cloning an Array

```javascript
let copy1 = [...original];
let copy2 = Array.from(original);
let copy3 = original.slice();
```

### Checking if Value is Array

```javascript
Array.isArray(value); // ✅ Correct way
typeof value === 'object'; // ❌ Not reliable
```

---

## Key Concepts Summary

✅ **Arrays are ordered collections** with numeric indexes starting at 0
✅ **Untyped**: Elements can be any type (mixed types allowed)
✅ **Dynamic**: Automatically grow/shrink, no fixed size needed
✅ **Can be sparse**: Gaps between indexes are allowed
✅ **`length` property**: Number of elements (or highest index + 1)
✅ **Arrays are objects**: Indexes are properties, optimized for performance
✅ **Inherit from Array.prototype**: Rich set of manipulation methods
✅ **Array methods are generic**: Work on array-like objects
✅ **Strings behave like arrays**: Read-only character arrays
✅ **Typed arrays**: Fixed-length, fixed-type for high performance

---

## Best Practices

🎯 Use **array literals** `[]` instead of `new Array()`
🎯 Check with **`Array.isArray()`** instead of `typeof`
🎯 Use **spread operator** for copying/combining arrays
🎯 Use **iteration methods** (map, filter, reduce) over loops
🎯 Use **typed arrays** for binary data and performance-critical code
🎯 Avoid **sparse arrays** unless necessary
🎯 Use **const** for arrays that won't be reassigned (elements can still change)
