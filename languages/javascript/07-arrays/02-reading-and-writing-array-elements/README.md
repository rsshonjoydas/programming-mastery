# JavaScript Reading and Writing Arrays

## Array Element Access

Arrays use **bracket notation `[]`** to read and write elements. The brackets contain a **non-negative integer** that represents the array index.

### Basic Syntax

```javascript
let array = [value1, value2, value3];
let element = array[index]; // Reading
array[index] = newValue; // Writing
```

### Reading and Writing Examples

```javascript
let a = ['world']; // Start with one element
let value = a[0]; // Read element 0 → "world"

a[1] = 3.14; // Write element 1
a[2] = 3; // Write element 2
a[3] = 'hello'; // Write element 3

// Using variables as indexes
let i = 2;
a[i] = 3; // Write to index 2
a[i + 1] = 'hello'; // Write to index 3

// Complex expressions
a[a[i]] = a[0]; // Read a[2] (value: 3), use as index
// Then read a[0] and write to a[3]
```

---

## Automatic Length Property

Arrays automatically maintain the `length` property when you assign values at numeric indexes.

```javascript
let a = ['world']; // a.length = 1
a[1] = 3.14; // a.length = 2
a[2] = 3; // a.length = 3
a[3] = 'hello'; // a.length = 4

console.log(a.length); // 4
```

**Key points**:

- Length updates automatically when you write to indexes
- Length is always **one more** than the highest index
- Works only for indexes that are integers between `0` and `2³²-2`

---

## Arrays as Special Objects

Arrays are **specialized objects** where:

- Numeric indexes are converted to strings and used as property names
- Square brackets work the same way as with object properties

### Index to String Conversion

```javascript
let arr = ['a', 'b', 'c'];
arr[1]; // Numeric index
arr['1']; // String index - same result!

// Arrays convert: 1 → "1"
```

### Comparison with Regular Objects

```javascript
let o = {}; // Plain object
o[1] = 'one'; // Integer key → converted to "1"
o['1']; // "one" - same property!

console.log(o[1] === o['1']); // true
```

---

## Array Index vs Object Property

### What is an Array Index?

An **array index** is a property name that:

- Is an integer between **0** and **2³²-2** (4,294,967,294)
- Causes the `length` property to update automatically
- Triggers special array behavior

### What is an Object Property?

Any property name that **doesn't** meet the array index criteria:

- Negative numbers: `-1`, `-5`
- Non-integers: `1.5`, `3.14`
- Strings that aren't numeric: `"name"`, `"foo"`
- Numbers ≥ 2³²-1

### Distinction Example

```javascript
let a = [10, 20, 30];

// Array indexes (special behavior)
a[0]; // 10 - array index
a[1]; // 20 - array index
a[2]; // 30 - array index

// Object properties (regular behavior)
a['name'] = 'myArray'; // Regular property
a[-1] = 'negative'; // Regular property
a[3.14] = 'pi'; // Regular property

console.log(a.length); // 3 (only array indexes count)
console.log(a); // [10, 20, 30, name: "myArray", -1: "negative", 3.14: "pi"]
```

---

## Special Cases

### 1. Negative Indexes

Negative numbers are **not array indexes**, they're regular properties:

```javascript
let a = [1, 2, 3];
a[-1] = 'negative one';
a[-5] = 'negative five';

console.log(a.length); // 3 (unchanged)
console.log(a[-1]); // "negative one"
```

**Why**: `-1` is converted to the string `"-1"`, which is not a valid array index.

### 2. Non-Integer Numbers

Non-integers are treated as regular properties:

```javascript
let a = [1, 2, 3];
a[-1.23] = true; // Property "-1.23"
a[3.14] = 'pi'; // Property "3.14"

console.log(a.length); // 3 (unchanged)
console.log(a[3.14]); // "pi"
```

### 3. String Indexes

Strings that represent non-negative integers **behave as array indexes**:

```javascript
let a = [];
a['1000'] = 0; // Treated as index 1000
console.log(a.length); // 1001 (length updated!)
console.log(a[1000]); // 0
```

### 4. Floating-Point Numbers Equal to Integers

If a floating-point number equals an integer, it's treated as an array index:

```javascript
let a = [];
a[1.0] = 'one'; // Same as a[1]
a[5.0] = 'five'; // Same as a[5]

console.log(a.length); // 6
console.log(a[1]); // "one"
console.log(a[1.0]); // "one" (same as a[1])
```

---

## No "Out of Bounds" Errors

JavaScript arrays have **no concept of out-of-bounds errors**. Accessing non-existent indexes returns `undefined`.

```javascript
let a = [true, false]; // Elements at indexes 0 and 1

a[2]; // undefined (no element)
a[100]; // undefined (no element)
a[-1]; // undefined (no property)
a['foo']; // undefined (no property)
```

**Why**: Arrays are objects, and accessing non-existent object properties returns `undefined` (not an error).

---

## Reading vs Writing Behavior

### Reading Elements

```javascript
let a = [10, 20, 30];

// Existing elements
a[0]; // 10
a[1]; // 20

// Non-existent elements
a[5]; // undefined (not an error)
a[-1]; // undefined
```

### Writing Elements

```javascript
let a = [10, 20, 30];

// Writing to existing index
a[1] = 25; // Updates element
console.log(a); // [10, 25, 30]

// Writing beyond current length
a[5] = 60; // Creates sparse array
console.log(a); // [10, 25, 30, empty × 2, 60]
console.log(a.length); // 6

// Undefined elements in between
console.log(a[3]); // undefined
console.log(a[4]); // undefined
```

---

## Sparse Arrays

When you write to an index beyond the current length, JavaScript creates a **sparse array** with "holes":

```javascript
let a = [1, 2, 3];
a[10] = 11; // Skip indexes 3-9

console.log(a.length); // 11
console.log(a); // [1, 2, 3, empty × 7, 11]

// The "empty" slots
console.log(a[5]); // undefined
console.log(5 in a); // false (no property at index 5)
console.log(10 in a); // true (property exists at index 10)
```

---

## Index Type Conversion Summary

| Input               | Converted To        | Treated As      | Updates Length? |
| ------------------- | ------------------- | --------------- | --------------- |
| `0`, `1`, `2`, etc. | `"0"`, `"1"`, `"2"` | Array index     | ✅ Yes          |
| `"0"`, `"1"`, `"2"` | (already string)    | Array index     | ✅ Yes          |
| `1.0`, `5.0`        | `"1"`, `"5"`        | Array index     | ✅ Yes          |
| `-1`, `-5`          | `"-1"`, `"-5"`      | Object property | ❌ No           |
| `1.5`, `3.14`       | `"1.5"`, `"3.14"`   | Object property | ❌ No           |
| `"name"`, `"foo"`   | (already string)    | Object property | ❌ No           |
| `2³²-1` or higher   | String              | Object property | ❌ No           |

---

## Common Patterns

### 1. Iterating with Indexes

```javascript
let arr = ['a', 'b', 'c'];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### 2. Dynamic Index Access

```javascript
let data = [10, 20, 30, 40, 50];
let index = Math.floor(Math.random() * data.length);
console.log(data[index]); // Random element
```

### 3. Using Expressions as Indexes

```javascript
let arr = [1, 2, 3, 4, 5];
let start = 1;
let end = 3;

console.log(arr[start]); // 2
console.log(arr[end]); // 4
console.log(arr[start + end]); // 5
```

### 4. Multidimensional Arrays

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

## Best Practices

✅ **Use integer indexes** (0, 1, 2, ...) for array elements
✅ **Use `length` property** to find the number of elements
✅ **Check bounds** before accessing if necessary
✅ **Avoid sparse arrays** unless specifically needed (use `push()` or `fill()`)
✅ **Don't use negative or non-integer indexes** for array elements
✅ **Remember**: Arrays are objects with special behavior for numeric indexes

❌ **Don't rely on "out of bounds" errors** - they don't exist in JavaScript
❌ **Don't mix array indexes and object properties** unless you understand the distinction

---

## Key Concepts Summary

📌 **Array elements** are accessed with bracket notation: `array[index]`
📌 **Indexes are converted to strings** and used as property names
📌 **Array indexes** are integers from 0 to 2³²-2 that update `length`
📌 **Object properties** are all other property names (negative, non-integer, strings)
📌 **No out-of-bounds errors**: Non-existent elements return `undefined`
📌 **Automatic length**: Writing to an index updates `length` automatically
📌 **Sparse arrays**: Writing beyond `length` creates "holes" (undefined elements)
📌 **Special conversion**: `1.0` → index 1, but `1.5` → property "1.5"
📌 **String indexes**: `"1000"` behaves like index 1000, not a property
📌 **Arrays are objects**: They have all object capabilities plus special array behavior
