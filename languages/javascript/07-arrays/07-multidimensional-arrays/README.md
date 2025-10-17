# JavaScript Multidimensional Arrays

## Overview

JavaScript **does not support true multidimensional arrays**, but you can **approximate them using arrays of arrays** (also called jagged arrays or nested arrays).

## What Are Multidimensional Arrays?

A multidimensional array is an array whose elements are themselves arrays. The most common type is a **2D array** (array of arrays), which can represent tables, matrices, or grids.

```javascript
// Conceptual 2D array (3x3 grid)
// [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ]
```

---

## Creating Multidimensional Arrays

### Method 1: Array Literal (Best for Small Arrays)

```javascript
// 2D array (3 rows, 3 columns)
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 3D array
let cube = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
];
```

**Advantages**:

- Simple and readable
- Best for small, known-size arrays
- Immediately initialized with values

### Method 2: Using Loops (Dynamic Size)

```javascript
// Create 10x10 array
let table = new Array(10); // 10 rows

for (let i = 0; i < table.length; i++) {
  table[i] = new Array(10); // Each row has 10 columns
}

// Initialize with values
for (let row = 0; row < table.length; row++) {
  for (let col = 0; col < table[row].length; col++) {
    table[row][col] = row * col;
  }
}
```

**Advantages**:

- Works for dynamic/large arrays
- Size determined at runtime
- Can initialize with computed values

### Method 3: Array.from() with map()

```javascript
// Create 5x5 array initialized to 0
let grid = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0));

// Create with computed values
let table = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => row * col)
);
```

**Advantages**:

- Concise and functional
- Can initialize in one expression
- Modern JavaScript approach

### Method 4: fill() and map() (⚠️ Caution Required)

```javascript
// ❌ WRONG - Creates references to same array
let wrong = new Array(3).fill(new Array(3));
wrong[0][0] = 1;
console.log(wrong); // All rows affected!

// ✅ CORRECT - Create separate arrays
let correct = new Array(3).fill(null).map(() => new Array(3).fill(0));
```

**Warning**: Using `fill()` with arrays creates **references**, not copies!

---

## Accessing Elements

Use the **bracket operator (`[]`) multiple times** to access nested elements.

### 2D Array Access

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Syntax: array[row][column]
console.log(matrix[0][0]); // 1 (first row, first column)
console.log(matrix[1][2]); // 6 (second row, third column)
console.log(matrix[2][1]); // 8 (third row, second column)
```

### 3D Array Access

```javascript
let cube = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
];

// Syntax: array[layer][row][column]
console.log(cube[0][0][0]); // 1
console.log(cube[1][1][0]); // 7
```

### Accessing Entire Rows

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
];

console.log(matrix[0]); // [1, 2, 3] (entire first row)
console.log(matrix[1]); // [4, 5, 6] (entire second row)
```

---

## Modifying Elements

### Setting Individual Values

```javascript
let grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

grid[1][1] = 5; // Set center value
grid[0][2] = 3; // Set top-right value

console.log(grid);
// [
//   [0, 0, 3],
//   [0, 5, 0],
//   [0, 0, 0]
// ]
```

### Replacing Entire Rows

```javascript
matrix[0] = [10, 20, 30]; // Replace first row
```

---

## Iterating Over Multidimensional Arrays

### Nested for Loops (Traditional)

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[row].length; col++) {
    console.log(`[${row}][${col}] = ${matrix[row][col]}`);
  }
}
```

### for...of Loop (Modern)

```javascript
for (let row of matrix) {
  for (let value of row) {
    console.log(value);
  }
}
```

### forEach() Method

```javascript
matrix.forEach((row, rowIndex) => {
  row.forEach((value, colIndex) => {
    console.log(`[${rowIndex}][${colIndex}] = ${value}`);
  });
});
```

### map() for Transformation

```javascript
// Double all values
let doubled = matrix.map((row) => row.map((value) => value * 2));
```

---

## Common Operations

### 1. Multiplication Table

```javascript
// Create a 10x10 multiplication table
let table = new Array(10);

for (let i = 0; i < table.length; i++) {
  table[i] = new Array(10);
}

for (let row = 0; row < table.length; row++) {
  for (let col = 0; col < table[row].length; col++) {
    table[row][col] = row * col;
  }
}

console.log(table[5][7]); // 35 (5 * 7)
```

### 2. Sum All Elements

```javascript
function sum2D(arr) {
  let total = 0;
  for (let row of arr) {
    for (let value of row) {
      total += value;
    }
  }
  return total;
}

let matrix = [
  [1, 2],
  [3, 4],
];
console.log(sum2D(matrix)); // 10
```

### 3. Find Element

```javascript
function find2D(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === target) {
        return [i, j]; // Return position
      }
    }
  }
  return null; // Not found
}

let pos = find2D(matrix, 5);
console.log(pos); // [1, 1]
```

### 4. Transpose Matrix

```javascript
function transpose(matrix) {
  let rows = matrix.length;
  let cols = matrix[0].length;
  let result = Array.from({ length: cols }, () => Array(rows));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

let matrix = [
  [1, 2, 3],
  [4, 5, 6],
];

let transposed = transpose(matrix);
// [
//   [1, 4],
//   [2, 5],
//   [3, 6]
// ]
```

### 5. Flatten Array

```javascript
// Convert 2D to 1D
let flat = matrix.flat();
console.log(flat); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Flatten any depth
let deep = [[[1, 2]], [[3, 4]]];
console.log(deep.flat(2)); // [1, 2, 3, 4]
console.log(deep.flat(Infinity)); // Flatten completely
```

---

## Jagged Arrays (Non-Rectangular)

JavaScript arrays can have rows of different lengths:

```javascript
let jagged = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8, 9],
];

console.log(jagged[0].length); // 3
console.log(jagged[1].length); // 2
console.log(jagged[2].length); // 4

// Safe iteration
for (let row of jagged) {
  for (let value of row) {
    console.log(value);
  }
}
```

---

## Common Pitfalls

### 1. Reference vs Copy

```javascript
// ❌ Creates reference
let a = [
  [1, 2],
  [3, 4],
];
let b = a; // b references same array
b[0][0] = 99;
console.log(a[0][0]); // 99 (both changed!)

// ✅ Shallow copy
let c = a.map((row) => [...row]);
c[0][0] = 5;
console.log(a[0][0]); // 99 (a unchanged)

// ✅ Deep copy (for nested arrays)
let d = JSON.parse(JSON.stringify(a));
```

### 2. fill() Creates References

```javascript
// ❌ WRONG
let wrong = new Array(3).fill([0, 0, 0]);
wrong[0][0] = 1;
console.log(wrong); // All rows have [1, 0, 0]!

// ✅ CORRECT
let correct = Array.from({ length: 3 }, () => [0, 0, 0]);
```

### 3. Bounds Checking

```javascript
let matrix = [
  [1, 2],
  [3, 4],
];

// Check before access
if (matrix[5] && matrix[5][0]) {
  console.log(matrix[5][0]); // Won't execute
}

// Or use optional chaining
console.log(matrix[5]?.[0]); // undefined
```

---

## Performance Considerations

### Memory Layout

JavaScript arrays of arrays are **not contiguous in memory** like true multidimensional arrays in C/C++.

```javascript
// Each row is a separate array object
let matrix = [
  [1, 2, 3], // Array object 1
  [4, 5, 6], // Array object 2
  [7, 8, 9], // Array object 3
];
```

### For Large Arrays

For better performance with large numeric arrays, consider **TypedArrays**:

```javascript
// Flatten 2D into 1D typed array
let rows = 1000,
  cols = 1000;
let data = new Float64Array(rows * cols);

// Access using: data[row * cols + col]
function get(row, col) {
  return data[row * cols + col];
}

function set(row, col, value) {
  data[row * cols + col] = value;
}
```

---

## Practical Examples

### Game Board (Tic-Tac-Toe)

```javascript
let board = [
  ['X', 'O', 'X'],
  ['O', 'X', 'O'],
  ['O', 'X', 'X'],
];

function printBoard(board) {
  for (let row of board) {
    console.log(row.join(' | '));
  }
}
```

### Image Representation (Pixels)

```javascript
// 3x3 grayscale image (0-255)
let image = [
  [0, 128, 255],
  [64, 192, 32],
  [255, 128, 0],
];
```

### Spreadsheet Data

```javascript
let spreadsheet = [
  ['Name', 'Age', 'City'],
  ['Alice', 30, 'NYC'],
  ['Bob', 25, 'LA'],
  ['Charlie', 35, 'Chicago'],
];

// Access header
console.log(spreadsheet[0]); // ['Name', 'Age', 'City']

// Access data
console.log(spreadsheet[1][0]); // 'Alice'
```

---

## Key Concepts Summary

✅ JavaScript uses **arrays of arrays** (not true multidimensional arrays)
✅ Access elements with **multiple bracket operators**: `array[row][col]`
✅ Create with **literals**, **loops**, or **Array.from()**
✅ **Avoid `fill()` with objects/arrays** (creates references)
✅ Arrays can be **jagged** (different row lengths)
✅ Use **nested loops** to iterate over all elements
✅ **Copy carefully** - arrays hold references, not values
✅ **flat()** method flattens nested arrays
✅ Common operations: sum, find, transpose, flatten
✅ For large numeric arrays, consider **TypedArrays** for performance
