# JavaScript Immutable Primitives vs Mutable Objects

## Fundamental Difference

JavaScript values fall into two categories with **fundamentally different behaviors**:

**Primitive Values** (immutable):

- undefined
- null
- booleans
- numbers
- strings
- symbols

**Objects** (mutable):

- Objects (including plain objects)
- Arrays
- Functions
- All other object types (Date, RegExp, Map, Set, etc.)

## Primitive Values: Immutable

### What Immutable Means

**There is no way to change (mutate) a primitive value.**

### Numbers and Booleans

```javascript
let x = 5;
x = 10; // This REPLACES x, doesn't "change" the number 5
// The number 5 itself cannot be modified

let flag = true;
flag = false; // REPLACES the value, doesn't change true to false
```

It doesn't even make sense to talk about changing a number or boolean.

### Strings: The Less Obvious Case

**Strings SEEM like arrays of characters, but they're immutable:**

```javascript
let s = 'hello'; // Start with some lowercase text
s.toUpperCase(); // Returns "HELLO", but doesn't alter s
s; // => "hello": the original string has not changed
```

**All string methods return NEW strings, never modify the original:**

```javascript
let str = 'hello';
str.toUpperCase(); // Returns "HELLO", str still "hello"
str.toLowerCase(); // Returns "hello", str still "hello"
str.replace('h', 'H'); // Returns "Hello", str still "hello"
str.concat(' world'); // Returns "hello world", str still "hello"

// You cannot modify individual characters
str[0] = 'H'; // Does nothing (fails silently, or throws error in strict mode)
console.log(str); // Still "hello"
```

**To "change" a string, you must reassign:**

```javascript
let s = 'hello';
s = s.toUpperCase(); // Reassign s to a NEW string
console.log(s); // "HELLO"
```

### Primitives Compared by Value

**Two primitive values are equal if they have the same value:**

```javascript
// Numbers, booleans, null, undefined
5 === 5; // true
true === true; // true
null === null; // true
undefined === undefined; // true

// Strings
let a = 'hello';
let b = 'hello';
a === b; // true: same length, same characters at each index
```

**Strings are equal if:**

- They have the same length
- The character at each index is the same

```javascript
'test' === 'test'; // true
'test' === 'Test'; // false (different character at index 0)
'abc' === 'ab' + 'c'; // true (same result)
```

## Object Values: Mutable

### What Mutable Means

**Object values CAN change - their properties/elements can be modified:**

```javascript
let o = { x: 1 }; // Start with an object
o.x = 2; // Mutate it by changing the value of a property
o.y = 3; // Mutate it again by adding a new property

let a = [1, 2, 3]; // Arrays are also mutable
a[0] = 0; // Change the value of an array element
a[3] = 4; // Add a new array element
```

The object/array itself is modified, not replaced.

### Objects Compared by Reference (NOT Value)

**Two distinct objects are NOT equal, even with identical content:**

```javascript
let o = { x: 1 },
  p = { x: 1 }; // Two objects with the same properties
o === p; // => false: distinct objects are never equal

let a = [],
  b = []; // Two distinct, empty arrays
a === b; // => false: distinct arrays are never equal
```

**Why?** Objects are **reference types** - they're compared by reference, not content.

### How References Work

**Object values are references to underlying objects:**

```javascript
let a = []; // Variable a refers to an empty array
let b = a; // Now b refers to the SAME array (not a copy!)
b[0] = 1; // Mutate the array referred to by variable b
a[0]; // => 1: the change is visible through variable a
a === b; // => true: a and b refer to the same object
```

**Visual representation:**

```
a ──┐
    ├──> [1] (single array in memory)
b ──┘
```

**Two object values are equal if and only if they refer to the same underlying object.**

## Assignment Behavior

### Primitives: Copy by Value

```javascript
let x = 5;
let y = x; // y gets a COPY of the value
x = 10; // Changing x doesn't affect y
console.log(y); // 5 (unchanged)
```

### Objects: Copy by Reference

```javascript
let obj1 = { value: 5 };
let obj2 = obj1; // obj2 gets a REFERENCE (not a copy!)
obj1.value = 10; // Changing through obj1
console.log(obj2.value); // 10 (same object!)
```

**Assignment assigns the reference, NOT a copy of the object.**

## Copying Objects and Arrays

### Manual Copying with Loop

```javascript
let a = ['a', 'b', 'c']; // An array we want to copy
let b = []; // A distinct array we'll copy into
for (let i = 0; i < a.length; i++) {
  // For each index of a[]
  b[i] = a[i]; // Copy an element of a into b
}
```

### Modern Copying Methods

**Arrays:**

```javascript
let a = [1, 2, 3];

// ES6: Array.from()
let b = Array.from(a);

// Spread operator
let c = [...a];

// slice()
let d = a.slice();

// All create NEW arrays
a[0] = 99;
console.log(b[0]); // 1 (unchanged)
console.log(c[0]); // 1 (unchanged)
console.log(d[0]); // 1 (unchanged)
```

**Objects:**

```javascript
let obj = { x: 1, y: 2 };

// Object.assign()
let copy1 = Object.assign({}, obj);

// Spread operator
let copy2 = { ...obj };

// Both create NEW objects
obj.x = 99;
console.log(copy1.x); // 1 (unchanged)
console.log(copy2.x); // 1 (unchanged)
```

**Important:** These are **shallow copies** - nested objects are still references!

```javascript
let original = { a: 1, nested: { b: 2 } };
let copy = { ...original };

copy.nested.b = 99;
console.log(original.nested.b); // 99 (nested object is shared!)
```

## Comparing Objects and Arrays

### You Must Compare Properties/Elements Manually

**Comparing two distinct objects:**

```javascript
function equalObjects(a, b) {
  // Check if same reference
  if (a === b) return true;

  // Check if both are objects
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  // Compare properties
  let keysA = Object.keys(a);
  let keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (a[key] !== b[key]) return false; // Shallow comparison
  }

  return true;
}
```

**Comparing two arrays (from the document):**

```javascript
function equalArrays(a, b) {
  if (a === b) return true; // Identical arrays are equal
  if (a.length !== b.length) return false; // Different-size arrays not equal
  for (let i = 0; i < a.length; i++) {
    // Loop through all elements
    if (a[i] !== b[i]) return false; // If any differ, arrays not equal
  }
  return true; // Otherwise they are equal
}
```

**Usage:**

```javascript
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];

arr1 === arr2; // false (different references)
equalArrays(arr1, arr2); // true (same content)
```

## Practical Implications

### Function Parameters

**Primitives: Pass by Value**

```javascript
function changeValue(x) {
  x = 10; // Only changes local copy
}

let num = 5;
changeValue(num);
console.log(num); // 5 (unchanged)
```

**Objects: Pass by Reference**

```javascript
function changeObject(obj) {
  obj.value = 10; // Modifies the actual object
}

let myObj = { value: 5 };
changeObject(myObj);
console.log(myObj.value); // 10 (changed!)
```

**Reassigning parameters doesn't affect original:**

```javascript
function replaceObject(obj) {
  obj = { value: 99 }; // Creates new object, doesn't affect original
}

let myObj = { value: 5 };
replaceObject(myObj);
console.log(myObj.value); // 5 (unchanged)
```

### Avoiding Unintended Mutations

```javascript
// BAD: Function mutates input
function addItem(arr, item) {
  arr.push(item); // Modifies original array!
  return arr;
}

let original = [1, 2, 3];
let modified = addItem(original, 4);
console.log(original); // [1, 2, 3, 4] - MUTATED!

// GOOD: Function returns new array
function addItem(arr, item) {
  return [...arr, item]; // Creates new array
}

let original = [1, 2, 3];
let modified = addItem(original, 4);
console.log(original); // [1, 2, 3] - unchanged
console.log(modified); // [1, 2, 3, 4]
```

### Const with Objects

```javascript
// const prevents reassignment, NOT mutation
const arr = [1, 2, 3];
arr.push(4); // Allowed! Mutates the array
arr = [5, 6, 7]; // Error! Cannot reassign

const obj = { x: 1 };
obj.x = 2; // Allowed! Mutates the object
obj.y = 3; // Allowed! Adds property
obj = { x: 99 }; // Error! Cannot reassign
```

## Summary Table

| Feature            | Primitives                     | Objects                     |
| ------------------ | ------------------------------ | --------------------------- |
| **Mutability**     | Immutable (cannot change)      | Mutable (can change)        |
| **Comparison**     | By value (content)             | By reference (identity)     |
| **Assignment**     | Copies the value               | Copies the reference        |
| **Equality**       | Same value = equal             | Same reference = equal      |
| **String methods** | Return new strings             | Methods can mutate object   |
| **Examples**       | `5`, `"hello"`, `true`, `null` | `{}`, `[]`, `function() {}` |

## Key Takeaways

1. **Primitives are immutable** - string methods return new strings, never modify originals
2. **Objects are mutable** - properties and elements can be changed
3. **Primitives compared by value** - `"hello" === "hello"` is `true`
4. **Objects compared by reference** - `{x:1} === {x:1}` is `false`
5. **Assignment copies references** - `let b = a` doesn't copy objects/arrays
6. **Must explicitly copy** - use spread operator, `Array.from()`, or manual loops
7. **Must manually compare** - write functions to compare properties/elements
8. **const doesn't prevent mutation** - only prevents reassignment

**Best Practice:** Be aware of whether you're working with primitives or objects, and handle copying/comparison accordingly!
