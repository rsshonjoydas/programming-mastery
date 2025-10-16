// ==================================
// JAVASCRIPT MULTIDIMENSIONAL ARRAYS
// ==================================

console.log('=== 1. CREATING MULTIDIMENSIONAL ARRAYS ===\n');

// Method 1: Array Literal (best for small arrays)
console.log('Method 1: Array Literal');
let matrix1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log('2D matrix:', matrix1);

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
console.log('3D cube:', cube);

// Method 2: Using loops (dynamic size)
console.log('\nMethod 2: Using Loops');
let table = new Array(10); // 10 rows

for (let i = 0; i < table.length; i++) {
  table[i] = new Array(10); // Each row has 10 columns
}

// Initialize with multiplication table values
for (let row = 0; row < table.length; row++) {
  for (let col = 0; col < table[row].length; col++) {
    table[row][col] = row * col;
  }
}
console.log('10x10 multiplication table created');
console.log('table[5][7] =', table[5][7]); // 35

// Method 3: Array.from() with map
console.log('\nMethod 3: Array.from()');
let grid1 = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0));
console.log('5x5 grid initialized to 0:', grid1);

let table2 = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => row * col)
);
console.log('5x5 multiplication table:', table2);

// Method 4: fill() and map (with caution)
console.log('\nMethod 4: fill() - CAUTION!');

// ❌ WRONG - Creates references
let wrong = new Array(3).fill(new Array(3));
wrong[0][0] = 1;
console.log('WRONG way (all rows affected):', wrong);

// ✅ CORRECT - Create separate arrays
let correct = new Array(3).fill(null).map(() => new Array(3).fill(0));
correct[0][0] = 1;
console.log('CORRECT way (only first row affected):', correct);

console.log('\n=== 2. ACCESSING ELEMENTS ===\n');

let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log('Matrix:', matrix);
console.log('matrix[0][0] =', matrix[0][0]); // 1
console.log('matrix[1][2] =', matrix[1][2]); // 6
console.log('matrix[2][1] =', matrix[2][1]); // 8

console.log('\nAccessing entire rows:');
console.log('matrix[0] =', matrix[0]); // [1, 2, 3]
console.log('matrix[1] =', matrix[1]); // [4, 5, 6]

console.log('\n3D array access:');
console.log('cube[0][0][0] =', cube[0][0][0]); // 1
console.log('cube[1][1][0] =', cube[1][1][0]); // 7

console.log('\n=== 3. MODIFYING ELEMENTS ===\n');

let grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

console.log('Original grid:', grid);

grid[1][1] = 5; // Center
grid[0][2] = 3; // Top-right
grid[2][0] = 7; // Bottom-left

console.log('Modified grid:', grid);

// Replace entire row
grid[0] = [10, 20, 30];
console.log('After replacing first row:', grid);

console.log('\n=== 4. ITERATING OVER ARRAYS ===\n');

let data = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log('Method 1: Traditional for loops');
for (let row = 0; row < data.length; row++) {
  for (let col = 0; col < data[row].length; col++) {
    console.log(`[${row}][${col}] = ${data[row][col]}`);
  }
}

console.log('\nMethod 2: for...of loops');
for (let row of data) {
  for (let value of row) {
    console.log(value);
  }
}

console.log('\nMethod 3: forEach');
data.forEach((row, rowIndex) => {
  row.forEach((value, colIndex) => {
    console.log(`[${rowIndex}][${colIndex}] = ${value}`);
  });
});

console.log('\nMethod 4: map for transformation');
let doubled = data.map((row) => row.map((value) => value * 2));
console.log('Original:', data);
console.log('Doubled:', doubled);

console.log('\n=== 5. COMMON OPERATIONS ===\n');

// Operation 1: Sum all elements
console.log('Operation 1: Sum all elements');
function sum2D(arr) {
  let total = 0;
  for (let row of arr) {
    for (let value of row) {
      total += value;
    }
  }
  return total;
}
console.log('Sum of matrix:', sum2D(matrix));

// Operation 2: Find element
console.log('\nOperation 2: Find element');
function find2D(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}
let position = find2D(matrix, 5);
console.log('Position of 5:', position);

// Operation 3: Transpose matrix
console.log('\nOperation 3: Transpose matrix');
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

let original = [
  [1, 2, 3],
  [4, 5, 6],
];
let transposed = transpose(original);
console.log('Original:', original);
console.log('Transposed:', transposed);

// Operation 4: Flatten array
console.log('\nOperation 4: Flatten array');
let nested = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
let flat = nested.flat();
console.log('Nested:', nested);
console.log('Flattened:', flat);

let deep = [[[1, 2]], [[3, 4]], [[5, 6]]];
console.log('Deep nested:', deep);
console.log('Flat(2):', deep.flat(2));
console.log('Flat(Infinity):', deep.flat(Infinity));

// Operation 5: Get row/column
console.log('\nOperation 5: Get specific row/column');
function getRow(arr, rowIndex) {
  return arr[rowIndex];
}

function getColumn(arr, colIndex) {
  return arr.map((row) => row[colIndex]);
}

console.log('Row 1:', getRow(matrix, 1));
console.log('Column 1:', getColumn(matrix, 1));

console.log('\n=== 6. JAGGED ARRAYS (NON-RECTANGULAR) ===\n');

let jagged = [[1, 2, 3], [4, 5], [6, 7, 8, 9], [10]];

console.log('Jagged array:', jagged);
console.log('Row lengths:');
jagged.forEach((row, i) => {
  console.log(`Row ${i}: length = ${row.length}`);
});

console.log('\nIterating safely over jagged array:');
for (let row of jagged) {
  console.log(row.join(', '));
}

console.log('\n=== 7. COMMON PITFALLS ===\n');

// Pitfall 1: Reference vs Copy
console.log('Pitfall 1: Reference vs Copy');
let a = [
  [1, 2],
  [3, 4],
];
let b = a; // Reference
b[0][0] = 99;
console.log("Original 'a' after modifying 'b':", a);

// Shallow copy
let c = a.map((row) => [...row]);
c[0][0] = 5;
console.log("Original 'a' after modifying shallow copy 'c':", a);

// Deep copy
let d = JSON.parse(JSON.stringify(a));
d[0][0] = 1;
console.log("Deep copy 'd':", d);

// Pitfall 2: fill() creates references
console.log('\nPitfall 2: fill() with arrays');
let wrongFill = new Array(3).fill([0, 0]);
wrongFill[0][0] = 1;
console.log('Using fill (WRONG):', wrongFill);

let correctFill = Array.from({ length: 3 }, () => [0, 0]);
correctFill[0][0] = 1;
console.log('Using Array.from (CORRECT):', correctFill);

// Pitfall 3: Bounds checking
console.log('\nPitfall 3: Bounds checking');
let small = [
  [1, 2],
  [3, 4],
];
console.log('Accessing out of bounds:');
console.log('small[5]:', small[5]); // undefined
console.log('small[5]?.[0]:', small[5]?.[0]); // undefined (safe)

console.log('\n=== 8. PRACTICAL EXAMPLES ===\n');

// Example 1: Tic-Tac-Toe Board
console.log('Example 1: Tic-Tac-Toe Board');
let board = [
  ['X', 'O', 'X'],
  ['O', 'X', 'O'],
  ['O', 'X', 'X'],
];

function printBoard(board) {
  console.log('-------------');
  for (let row of board) {
    console.log('| ' + row.join(' | ') + ' |');
    console.log('-------------');
  }
}
printBoard(board);

// Example 2: Image representation (grayscale)
console.log('\nExample 2: Grayscale Image (3x3)');
let image = [
  [0, 128, 255],
  [64, 192, 32],
  [255, 128, 0],
];

function printImage(img) {
  for (let row of img) {
    console.log(row.map((val) => val.toString().padStart(3, ' ')).join(' '));
  }
}
printImage(image);

// Example 3: Spreadsheet data
console.log('\nExample 3: Spreadsheet Data');
let spreadsheet = [
  ['Name', 'Age', 'City'],
  ['Alice', 30, 'NYC'],
  ['Bob', 25, 'LA'],
  ['Charlie', 35, 'Chicago'],
];

console.log('Header:', spreadsheet[0]);
console.log('Data:');
for (let i = 1; i < spreadsheet.length; i++) {
  console.log(
    `${spreadsheet[i][0]}, ${spreadsheet[i][1]}, ${spreadsheet[i][2]}`
  );
}

// Example 4: Matrix multiplication
console.log('\nExample 4: Matrix Multiplication');
function multiplyMatrices(a, b) {
  let rowsA = a.length,
    colsA = a[0].length;
  let rowsB = b.length,
    colsB = b[0].length;

  if (colsA !== rowsB) {
    throw new Error('Invalid matrix dimensions');
  }

  let result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

let matrixA = [
  [1, 2],
  [3, 4],
];
let matrixB = [
  [5, 6],
  [7, 8],
];
let product = multiplyMatrices(matrixA, matrixB);
console.log('Matrix A:', matrixA);
console.log('Matrix B:', matrixB);
console.log('A × B:', product);

// Example 5: Spiral matrix
console.log('\nExample 5: Create Spiral Matrix');
function createSpiral(n) {
  let matrix = Array.from({ length: n }, () => Array(n).fill(0));
  let num = 1;
  let top = 0,
    bottom = n - 1,
    left = 0,
    right = n - 1;

  while (top <= bottom && left <= right) {
    // Right
    for (let i = left; i <= right; i++) {
      matrix[top][i] = num++;
    }
    top++;

    // Down
    for (let i = top; i <= bottom; i++) {
      matrix[i][right] = num++;
    }
    right--;

    // Left
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        matrix[bottom][i] = num++;
      }
      bottom--;
    }

    // Up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        matrix[i][left] = num++;
      }
      left++;
    }
  }

  return matrix;
}

let spiral = createSpiral(4);
console.log('4x4 Spiral Matrix:');
spiral.forEach((row) => console.log(row.join(' ').padStart(12)));

console.log('\n=== 9. PERFORMANCE CONSIDERATION ===\n');

// Using TypedArray for large numeric data
console.log('Using TypedArray for better performance:');
let rows = 100,
  cols = 100;
let typedData = new Float64Array(rows * cols);

function getTyped(row, col) {
  return typedData[row * cols + col];
}

function setTyped(row, col, value) {
  typedData[row * cols + col] = value;
}

// Set some values
setTyped(0, 0, 1.5);
setTyped(5, 7, 3.14);
setTyped(99, 99, 2.718);

console.log('typedData[0][0] =', getTyped(0, 0));
console.log('typedData[5][7] =', getTyped(5, 7));
console.log('typedData[99][99] =', getTyped(99, 99));

console.log('\n=== 10. ADVANCED OPERATIONS ===\n');

// Rotate matrix 90 degrees clockwise
console.log('Rotate Matrix 90° Clockwise:');
function rotate90(matrix) {
  let n = matrix.length;
  let result = Array.from({ length: n }, () => Array(n));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[j][n - 1 - i] = matrix[i][j];
    }
  }

  return result;
}

let toRotate = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
let rotated = rotate90(toRotate);
console.log('Original:', toRotate);
console.log('Rotated:', rotated);

// Check if matrix is symmetric
console.log('\nCheck if Matrix is Symmetric:');
function isSymmetric(matrix) {
  let n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        return false;
      }
    }
  }
  return true;
}

let symmetric = [
  [1, 2, 3],
  [2, 4, 5],
  [3, 5, 6],
];
let notSymmetric = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log('Symmetric matrix:', symmetric, '->', isSymmetric(symmetric));
console.log('Not symmetric:', notSymmetric, '->', isSymmetric(notSymmetric));

console.log('\n=== COMPLETE! ===');
console.log('All multidimensional array concepts demonstrated!');
