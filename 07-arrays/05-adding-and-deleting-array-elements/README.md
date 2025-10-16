# JavaScript Adding and Deleting Array Elements

## Adding Elements to Arrays

JavaScript provides multiple methods to add elements to arrays at different positions.

### 1. Direct Index Assignment

Assign values to specific indexes:

```javascript
let a = []; // Start with an empty array
a[0] = 'zero'; // Add element at index 0
a[1] = 'one'; // Add element at index 1
a[5] = 'five'; // Creates sparse array (indexes 2-4 are empty)

console.log(a); // ['zero', 'one', empty × 3, 'five']
console.log(a.length); // 6
```

**Characteristics**:

- Can create **sparse arrays** (gaps in indexes)
- Length automatically adjusts to highest index + 1
- Simple but not always the best choice

---

### 2. push() - Add to End

Adds one or more elements to the **end** of an array:

```javascript
let a = [];
a.push('zero'); // a = ['zero']
a.push('one', 'two'); // a = ['zero', 'one', 'two']
let newLength = a.push('three'); // Returns new length: 4

console.log(a); // ['zero', 'one', 'two', 'three']
console.log(newLength); // 4
```

**Equivalent to**: `a[a.length] = value`

**Characteristics**:

- **Modifies** the original array
- Returns the **new length** of the array
- Most common method for adding elements
- Can add multiple elements at once

---

### 3. unshift() - Add to Beginning

Inserts one or more elements at the **beginning** of an array:

```javascript
let a = ['two', 'three'];
a.unshift('one'); // a = ['one', 'two', 'three']
a.unshift('zero', 'point-five'); // a = ['zero', 'point-five', 'one', 'two', 'three']

console.log(a); // ['zero', 'point-five', 'one', 'two', 'three']
```

**Characteristics**:

- **Shifts all existing elements** to higher indexes
- Returns the **new length** of the array
- Less efficient than `push()` (requires reindexing)
- Can add multiple elements at once

---

### 4. splice() - Add at Any Position

General-purpose method for inserting, deleting, or replacing elements:

```javascript
let a = ['a', 'b', 'e'];
// splice(start, deleteCount, item1, item2, ...)
a.splice(2, 0, 'c', 'd'); // Insert 'c' and 'd' at index 2

console.log(a); // ['a', 'b', 'c', 'd', 'e']
```

**Syntax**: `array.splice(startIndex, deleteCount, item1, item2, ...)`

**Characteristics**:

- **Modifies** the original array
- Shifts elements as needed
- Most versatile method
- Returns an array of deleted elements

---

## Removing Elements from Arrays

### 1. pop() - Remove from End

Removes and returns the **last element**:

```javascript
let a = ['zero', 'one', 'two'];
let last = a.pop(); // Returns 'two'

console.log(a); // ['zero', 'one']
console.log(last); // 'two'
console.log(a.length); // 2
```

**Characteristics**:

- **Opposite of push()**
- Reduces length by 1
- Returns the removed element
- Returns `undefined` if array is empty

---

### 2. shift() - Remove from Beginning

Removes and returns the **first element**:

```javascript
let a = ['zero', 'one', 'two'];
let first = a.shift(); // Returns 'zero'

console.log(a); // ['one', 'two']
console.log(first); // 'zero'
console.log(a.length); // 2
```

**Characteristics**:

- **Opposite of unshift()**
- **Shifts all remaining elements** down by one index
- Reduces length by 1
- Returns the removed element
- Less efficient than `pop()` (requires reindexing)

---

### 3. delete Operator - Creates Sparse Arrays

Deletes an element but **does not** adjust length or shift elements:

```javascript
let a = [1, 2, 3, 4, 5];
delete a[2]; // Removes element at index 2

console.log(a); // [1, 2, empty, 4, 5]
console.log(2 in a); // false (no element at index 2)
console.log(a.length); // 5 (length unchanged!)
console.log(a[2]); // undefined
```

**Characteristics**:

- Creates a **sparse array** (hole in the array)
- **Does NOT change length**
- **Does NOT shift** other elements
- Similar to assigning `undefined`, but subtly different
- Generally **not recommended** for arrays

**Difference from undefined**:

```javascript
let a = [1, 2, 3];
delete a[1]; // Creates a hole
let b = [1, 2, 3];
b[1] = undefined; // Element exists, but value is undefined

console.log(1 in a); // false (no element)
console.log(1 in b); // true (element exists)
```

---

### 4. Setting length Property

Truncate an array by reducing its length:

```javascript
let a = [1, 2, 3, 4, 5];
a.length = 3; // Remove elements from end

console.log(a); // [1, 2, 3]
console.log(a.length); // 3
```

**Increasing length**:

```javascript
let a = [1, 2, 3];
a.length = 5; // Creates sparse array

console.log(a); // [1, 2, 3, empty × 2]
console.log(a[4]); // undefined
```

**Characteristics**:

- Directly modifies the array
- Setting to smaller value **removes elements**
- Setting to larger value creates **sparse array**
- Fast and efficient

---

### 5. splice() - Remove from Any Position

Remove elements from anywhere in the array:

```javascript
let a = ['a', 'b', 'c', 'd', 'e'];
let removed = a.splice(1, 2); // Remove 2 elements starting at index 1

console.log(a); // ['a', 'd', 'e']
console.log(removed); // ['b', 'c']
```

**Syntax**: `array.splice(startIndex, deleteCount)`

**Characteristics**:

- **Modifies** the original array
- **Shifts remaining elements** to fill gap
- Returns array of removed elements
- Adjusts length automatically

---

## splice() - The Swiss Army Knife

The `splice()` method is the most versatile method for array manipulation.

### Syntax

```javascript
array.splice(start, deleteCount, item1, item2, ...)
```

**Parameters**:

- `start`: Index where changes begin
- `deleteCount`: Number of elements to remove (optional)
- `item1, item2, ...`: Elements to add (optional)

### Examples

**Insert elements (no deletion)**:

```javascript
let a = [1, 2, 5];
a.splice(2, 0, 3, 4); // Insert 3 and 4 at index 2
console.log(a); // [1, 2, 3, 4, 5]
```

**Delete elements**:

```javascript
let a = [1, 2, 3, 4, 5];
a.splice(2, 2); // Delete 2 elements starting at index 2
console.log(a); // [1, 2, 5]
```

**Replace elements**:

```javascript
let a = [1, 2, 3, 4, 5];
a.splice(1, 2, 'a', 'b'); // Replace 2 elements with 'a' and 'b'
console.log(a); // [1, 'a', 'b', 4, 5]
```

**Remove all elements from index**:

```javascript
let a = [1, 2, 3, 4, 5];
a.splice(2); // Remove everything from index 2 onward
console.log(a); // [1, 2]
```

**Negative indexes** (count from end):

```javascript
let a = [1, 2, 3, 4, 5];
a.splice(-2, 1); // Remove 1 element, 2 positions from end
console.log(a); // [1, 2, 3, 5]
```

---

## Method Comparison

| Method       | Position  | Modifies Array | Shifts Elements | Returns          | Performance |
| ------------ | --------- | -------------- | --------------- | ---------------- | ----------- |
| `push()`     | End       | ✅ Yes         | ❌ No           | New length       | Fast        |
| `pop()`      | End       | ✅ Yes         | ❌ No           | Removed element  | Fast        |
| `unshift()`  | Beginning | ✅ Yes         | ✅ Yes          | New length       | Slow        |
| `shift()`    | Beginning | ✅ Yes         | ✅ Yes          | Removed element  | Slow        |
| `splice()`   | Any       | ✅ Yes         | ✅ Yes          | Removed elements | Moderate    |
| `delete`     | Any       | ✅ Yes\*       | ❌ No           | `true`           | Fast        |
| `length = n` | End       | ✅ Yes         | ❌ No           | -                | Fast        |

\*Creates sparse array without changing length

---

## Quick Reference

### Adding Elements

```javascript
arr.push(item); // Add to end
arr.unshift(item); // Add to beginning
arr.splice(i, 0, item); // Add at index i
arr[i] = item; // Add at specific index
```

### Removing Elements

```javascript
arr.pop(); // Remove from end
arr.shift(); // Remove from beginning
arr.splice(i, 1); // Remove at index i
delete arr[i]; // Remove but leave hole (avoid!)
arr.length = n; // Truncate to length n
```

### Replacing Elements

```javascript
arr[i] = newValue; // Replace single element
arr.splice(i, 1, newValue); // Replace at index i
```

---

## Best Practices

✅ **Use `push()` and `pop()`** for stack operations (LIFO)
✅ **Use `shift()` and `unshift()`** for queue operations (FIFO)
✅ **Use `splice()`** for complex insertions, deletions, or replacements
✅ **Avoid `delete`** operator on arrays (creates sparse arrays)
✅ **Use `length` property** to quickly truncate arrays
✅ **Prefer methods that maintain array continuity** (no holes)
✅ **Consider performance**: Methods that shift elements (`unshift`, `shift`, `splice`) are slower on large arrays

---

## Key Concepts Summary

📌 **push()/pop()**: Add/remove from end (fast, most common)
📌 **unshift()/shift()**: Add/remove from beginning (slower, shifts all elements)
📌 **splice()**: Versatile method for any position (insert, delete, replace)
📌 **delete operator**: Creates sparse arrays, doesn't change length (avoid!)
📌 **length property**: Can truncate or expand arrays
📌 **Direct assignment**: Creates sparse arrays if indexes skipped
📌 **Sparse arrays**: Have "holes" where indexes don't exist
📌 **All methods except `delete`**: Maintain continuous array structure
📌 **Performance matters**: Operations at array beginning are slower than at end
