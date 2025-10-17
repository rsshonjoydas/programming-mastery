# JavaScript Creating Arrays

JavaScript provides multiple methods to create arrays, each suited for different use cases.

---

## 1. Array Literals

The **simplest and most common** way to create arrays.

### Basic Syntax

```javascript
let empty = []; // Empty array
let primes = [2, 3, 5, 7, 11]; // Array with 5 elements
let misc = [1.1, true, 'a']; // Mixed types with trailing comma
```

### Using Expressions

Values don't need to be constants—they can be any expressions:

```javascript
let base = 1024;
let table = [base, base + 1, base + 2, base + 3];
// [1024, 1025, 1026, 1027]
```

### Nested Arrays and Objects

```javascript
let matrix = [
  [1, { x: 1, y: 2 }],
  [2, { x: 3, y: 4 }],
];
```

### Sparse Arrays

Multiple commas in a row create sparse arrays with "holes":

```javascript
let count = [1, , 3]; // Elements at index 0 and 2; index 1 is empty
let undefs = [, ,]; // No elements, but length is 2
```

**Note**: Missing elements don't exist but return `undefined` when queried.

### Trailing Commas

Trailing commas are allowed and recommended:

```javascript
let arr = [1, 2, 3]; // Length is 3, not 4
let sparse = [, ,]; // Length is 2, not 3
```

---

## 2. The Spread Operator (...)

**ES6+** spread operator includes elements from iterable objects.

### Spreading Arrays

```javascript
let a = [1, 2, 3];
let b = [0, ...a, 4]; // [0, 1, 2, 3, 4]
```

The `...a` expands to the individual elements of array `a`.

### Shallow Copy

Create a copy of an array:

```javascript
let original = [1, 2, 3];
let copy = [...original];

copy[0] = 0; // Modifying copy doesn't affect original
console.log(original[0]); // 1
```

### Spreading Strings

Strings are iterable, so you can convert them to character arrays:

```javascript
let digits = [...'0123456789ABCDEF'];
// ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
```

### Removing Duplicates

Combine with Set to remove duplicates:

```javascript
let letters = [...'hello world'];
let unique = [...new Set(letters)];
// ["h","e","l","o"," ","w","r","d"]
```

### Works with Any Iterable

```javascript
// Spread a Set
let set = new Set([1, 2, 3]);
let arr = [...set]; // [1, 2, 3]

// Spread a Map (creates array of [key, value] pairs)
let map = new Map([
  ['a', 1],
  ['b', 2],
]);
let pairs = [...map]; // [['a', 1], ['b', 2]]
```

---

## 3. The Array() Constructor

Create arrays using the `Array()` constructor in three ways:

### No Arguments (Empty Array)

```javascript
let a = new Array(); // []
// Equivalent to: let a = [];
```

### Single Numeric Argument (Preallocate Length)

```javascript
let a = new Array(10); // Array with length 10, but no elements
```

**Important**:

- Creates sparse array with specified length
- No values are stored
- Index properties are not defined
- Elements will be `undefined` when accessed

```javascript
let arr = new Array(3);
console.log(arr.length); // 3
console.log(arr[0]); // undefined
console.log(0 in arr); // false (property doesn't exist)
```

### Multiple Arguments or Single Non-Numeric (Elements)

```javascript
let a = new Array(5, 4, 3, 2, 1, 'testing');
// [5, 4, 3, 2, 1, 'testing']
```

**Note**: Array literals are almost always preferred over this usage.

---

## 4. Array.of()

**ES6** factory method that addresses the `Array()` constructor's ambiguity with single numeric arguments.

### Purpose

Creates an array with argument values as elements, regardless of type or count:

```javascript
Array.of(); // []
Array.of(10); // [10] (not an array of length 10!)
Array.of(1, 2, 3); // [1, 2, 3]
```

### Comparison with Array()

| Code                 | Result                   |
| -------------------- | ------------------------ |
| `new Array(3)`       | `[empty × 3]` (length 3) |
| `Array.of(3)`        | `[3]` (one element)      |
| `new Array(1, 2, 3)` | `[1, 2, 3]`              |
| `Array.of(1, 2, 3)`  | `[1, 2, 3]`              |

**Use `Array.of()`** when you need to create an array with a single numeric element.

---

## 5. Array.from()

**ES6** factory method that creates arrays from iterable or array-like objects.

### Basic Usage

```javascript
let copy = Array.from(original);
```

### From Iterables

Works like the spread operator for iterables:

```javascript
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
Array.from([1, 2, 3]); // [1, 2, 3]

let set = new Set([1, 2, 3]);
Array.from(set); // [1, 2, 3]
```

### From Array-Like Objects

**Array-like objects** have:

- A numeric `length` property
- Integer-indexed properties
- But are **not** true arrays

```javascript
let arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
let trueArray = Array.from(arrayLike);
// ['a', 'b', 'c']
```

**Common array-like objects**:

- `arguments` object in functions
- DOM NodeLists (e.g., `document.querySelectorAll()`)
- HTMLCollection objects

### Mapping Function (Optional Second Argument)

Transform elements while creating the array:

```javascript
// Syntax: Array.from(iterable, mapFunction)

Array.from([1, 2, 3], (x) => x * 2);
// [2, 4, 6]

Array.from('12345', (x) => parseInt(x));
// [1, 2, 3, 4, 5]

// More efficient than:
// Array.from([1, 2, 3]).map(x => x * 2)
```

### Array.from() vs Spread Operator

| Feature               | `Array.from()`  | Spread `[...]` |
| --------------------- | --------------- | -------------- |
| Works with iterables  | ✅ Yes          | ✅ Yes         |
| Works with array-like | ✅ Yes          | ❌ No          |
| Mapping function      | ✅ Yes          | ❌ No          |
| Syntax                | `Array.from(x)` | `[...x]`       |

---

## Comparison of All Methods

| Method              | Syntax                  | Use Case                      |
| ------------------- | ----------------------- | ----------------------------- |
| **Array Literal**   | `[1, 2, 3]`             | Most common, simplest         |
| **Spread Operator** | `[...iterable]`         | Copy arrays, spread iterables |
| **Array()**         | `new Array(length)`     | Preallocate size (rare)       |
| **Array.of()**      | `Array.of(1, 2, 3)`     | Single numeric element        |
| **Array.from()**    | `Array.from(arrayLike)` | Convert array-like objects    |

---

## When to Use Each Method

### Use Array Literals `[]` when

✅ Creating arrays with known elements
✅ Writing most array creation code
✅ You need the simplest, most readable syntax

```javascript
let numbers = [1, 2, 3, 4, 5];
```

### Use Spread Operator `...` when

✅ Copying arrays (shallow copy)
✅ Combining multiple arrays
✅ Converting iterables (strings, Sets, Maps) to arrays
✅ Removing duplicates with Set

```javascript
let combined = [...arr1, ...arr2];
let copy = [...original];
let chars = [...'hello'];
```

### Use Array() Constructor when

✅ Preallocating array size for performance (rare)
⚠️ Avoid for general use—use literals instead

```javascript
let preallocated = new Array(1000);
```

### Use Array.of() when

✅ Creating an array with a single numeric element
✅ Avoiding Array() constructor ambiguity

```javascript
let singleNumber = Array.of(5); // [5], not array of length 5
```

### Use Array.from() when

✅ Converting array-like objects to true arrays
✅ Converting iterables with a mapping function
✅ Working with DOM NodeLists or arguments objects

```javascript
let divs = Array.from(document.querySelectorAll('div'));
let doubled = Array.from([1, 2, 3], (x) => x * 2);
```

---

## Key Concepts Summary

✅ **Array literals `[]`** are the simplest and most common method
✅ **Spread operator `...`** works with any iterable object
✅ **Sparse arrays** have "holes" created by missing elements
✅ **Trailing commas** are legal and recommended
✅ **Array() constructor** has three different behaviors based on arguments
✅ **Array.of()** solves single numeric element problem
✅ **Array.from()** converts array-like objects and applies mapping
✅ **Array-like objects** have length and indexed properties but aren't arrays
✅ **Shallow copies** with spread or Array.from() don't copy nested objects
✅ Spread operator can only be used in array literals (not a true operator)

---

## Practical Examples

```javascript
// Creating arrays
let literal = [1, 2, 3];
let spread = [...literal, 4, 5];
let copy = [...literal];
let fromString = [...'abc'];
let withOf = Array.of(10);
let fromArrayLike = Array.from({ 0: 'a', 1: 'b', length: 2 });

// Combining arrays
let combined = [...arr1, ...arr2, ...arr3];

// Removing duplicates
let unique = [...new Set([1, 2, 2, 3, 3, 3])]; // [1, 2, 3]

// Converting and mapping
let doubled = Array.from([1, 2, 3], (x) => x * 2); // [2, 4, 6]

// Sparse arrays
let sparse = [1, , , 4]; // Holes at index 1 and 2
```
