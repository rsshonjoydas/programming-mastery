// =====================================
// JAVASCRIPT READING AND WRITING ARRAYS
// =====================================

console.log('=== 1. BASIC READING AND WRITING ===\n');

let a = ['world']; // Start with one element
console.log('Initial array:', a);
console.log('a.length:', a.length);

// Reading elements
let value = a[0];
console.log('Read a[0]:', value);

// Writing elements
a[1] = 3.14;
console.log('After a[1] = 3.14:', a);

let i = 2;
a[i] = 3;
console.log('After a[2] = 3:', a);

a[i + 1] = 'hello';
console.log("After a[3] = 'hello':", a);

// Complex expression
a[a[i]] = a[0]; // a[2] is 3, so a[3] = a[0]
console.log('After a[a[i]] = a[0]:', a);

console.log('Final a.length:', a.length);

console.log('\n=== 2. AUTOMATIC LENGTH PROPERTY ===\n');

let b = ['first'];
console.log('Start - length:', b.length);

b[1] = 'second';
console.log('After b[1] - length:', b.length);

b[2] = 'third';
console.log('After b[2] - length:', b.length);

b[10] = 'eleventh';
console.log('After b[10] - length:', b.length);
console.log('Array b:', b);

console.log('\n=== 3. ARRAYS AS OBJECTS ===\n');

// Array indexes are converted to strings
let arr = ['a', 'b', 'c'];
console.log('arr[1]:', arr[1]);
console.log("arr['1']:", arr['1']);
console.log("arr[1] === arr['1']:", arr[1] === arr['1']);

// Same behavior with regular objects
let o = {};
o[1] = 'one';
o[2] = 'two';
console.log('\nObject o:', o);
console.log('o[1]:', o[1]);
console.log("o['1']:", o['1']);
console.log("o[1] === o['1']:", o[1] === o['1']);

console.log('\n=== 4. ARRAY INDEX VS OBJECT PROPERTY ===\n');

let mixed = [10, 20, 30];
console.log('Initial array:', mixed);
console.log('Initial length:', mixed.length);

// Array indexes (update length)
mixed[3] = 40;
console.log('\nAfter mixed[3] = 40:');
console.log('Array:', mixed);
console.log('Length:', mixed.length);

// Object properties (don't update length)
mixed['name'] = 'myArray';
mixed[-1] = 'negative';
mixed[3.14] = 'pi';
mixed[-5] = 'neg five';

console.log('\nAfter adding object properties:');
console.log('Full object:', mixed);
console.log('Length (unchanged):', mixed.length);

console.log('\nAccessing properties:');
console.log('mixed.name:', mixed.name);
console.log('mixed[-1]:', mixed[-1]);
console.log('mixed[3.14]:', mixed[3.14]);

console.log('\n=== 5. SPECIAL CASES ===\n');

// Negative indexes
console.log('Negative indexes:');
let neg = [1, 2, 3];
neg[-1] = 'negative one';
neg[-1.23] = true;
console.log('Array:', neg);
console.log('Length:', neg.length);
console.log('neg[-1]:', neg[-1]);
console.log('neg[-1.23]:', neg[-1.23]);

// String indexes that are numbers
console.log('\nString indexes:');
let strIdx = [];
strIdx['1000'] = 0;
console.log("After strIdx['1000'] = 0:");
console.log('Length:', strIdx.length);
console.log('strIdx[1000]:', strIdx[1000]);
console.log("strIdx['1000']:", strIdx['1000']);

// Floating-point equals integer
console.log('\nFloating-point indexes:');
let floatIdx = [];
floatIdx[1.0] = 'one';
floatIdx[5.0] = 'five';
console.log('Array:', floatIdx);
console.log('Length:', floatIdx.length);
console.log('floatIdx[1]:', floatIdx[1]);
console.log('floatIdx[1.0]:', floatIdx[1.0]);

console.log('\n=== 6. NO OUT OF BOUNDS ERRORS ===\n');

let bounds = [true, false];
console.log('Array:', bounds);

console.log('\nAccessing non-existent indexes:');
console.log('bounds[2]:', bounds[2]); // undefined
console.log('bounds[100]:', bounds[100]); // undefined
console.log('bounds[-1]:', bounds[-1]); // undefined
console.log("bounds['foo']:", bounds['foo']); // undefined

console.log('\nNo errors thrown - just returns undefined!');

console.log('\n=== 7. SPARSE ARRAYS ===\n');

let sparse = [1, 2, 3];
console.log('Initial:', sparse);

sparse[10] = 11;
console.log('\nAfter sparse[10] = 11:');
console.log('Array:', sparse);
console.log('Length:', sparse.length);

console.log("\nChecking 'holes':");
console.log('sparse[5]:', sparse[5]); // undefined
console.log('5 in sparse:', 5 in sparse); // false - no property
console.log('10 in sparse:', 10 in sparse); // true - property exists

// Iterating shows the holes
console.log('\nIterating with for loop:');
for (let i = 0; i < sparse.length; i++) {
  console.log(`sparse[${i}] = ${sparse[i]}`);
}

console.log('\nUsing forEach (skips holes):');
sparse.forEach((val, idx) => {
  console.log(`sparse[${idx}] = ${val}`);
});

console.log('\n=== 8. INDEX TYPE CONVERSION TABLE ===\n');

let conversion = [];

// Valid array indexes
conversion[0] = 'zero'; // Integer
conversion[5] = 'five'; // Integer
conversion['10'] = 'ten'; // String number
conversion[20.0] = 'twenty'; // Float = integer

// Object properties (not indexes)
conversion[-1] = 'negative'; // Negative
conversion[1.5] = 'float'; // Non-integer
conversion['name'] = 'test'; // Non-numeric string

console.log('Array with mixed properties:', conversion);
console.log('Length:', conversion.length);

console.log('\nProperty types:');
console.log('conversion[0] (index):', conversion[0]);
console.log('conversion[5] (index):', conversion[5]);
console.log("conversion['10'] (index):", conversion['10']);
console.log('conversion[20] (index):', conversion[20]);
console.log('conversion[-1] (property):', conversion[-1]);
console.log('conversion[1.5] (property):', conversion[1.5]);
console.log('conversion.name (property):', conversion.name);

console.log('\n=== 9. COMMON PATTERNS ===\n');

// Pattern 1: Iterating with indexes
console.log('Pattern 1: Iteration');
let fruits = ['apple', 'banana', 'cherry'];
for (let i = 0; i < fruits.length; i++) {
  console.log(`fruits[${i}] = ${fruits[i]}`);
}

// Pattern 2: Dynamic index access
console.log('\nPattern 2: Dynamic access');
let data = [10, 20, 30, 40, 50];
let randomIndex = Math.floor(Math.random() * data.length);
console.log(`Random element at index ${randomIndex}:`, data[randomIndex]);

// Pattern 3: Using expressions as indexes
console.log('\nPattern 3: Expression indexes');
let nums = [1, 2, 3, 4, 5];
let start = 1,
  end = 3;
console.log('nums[start]:', nums[start]);
console.log('nums[end]:', nums[end]);
console.log('nums[start + end]:', nums[start + end]);

// Pattern 4: Multidimensional arrays
console.log('\nPattern 4: Multidimensional arrays');
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log('matrix[0][0]:', matrix[0][0]);
console.log('matrix[1][2]:', matrix[1][2]);
console.log('matrix[2][1]:', matrix[2][1]);

// Pattern 5: Building arrays dynamically
console.log('\nPattern 5: Dynamic building');
let dynamic = [];
for (let i = 0; i < 5; i++) {
  dynamic[i] = i * i;
}
console.log('Squares:', dynamic);

console.log('\n=== 10. READING VS WRITING BEHAVIOR ===\n');

let rw = [10, 20, 30];
console.log('Initial array:', rw);

// Reading
console.log('\nReading:');
console.log('rw[0]:', rw[0]);
console.log('rw[1]:', rw[1]);
console.log("rw[5] (doesn't exist):", rw[5]);
console.log('rw[-1] (not an index):', rw[-1]);

// Writing to existing
console.log('\nWriting to existing index:');
rw[1] = 25;
console.log('After rw[1] = 25:', rw);

// Writing beyond length
console.log('\nWriting beyond length:');
rw[5] = 60;
console.log('After rw[5] = 60:', rw);
console.log('Length:', rw.length);
console.log('rw[3] (hole):', rw[3]);
console.log('rw[4] (hole):', rw[4]);

console.log('\n=== 11. PRACTICAL EXAMPLES ===\n');

// Example 1: Stack operations
console.log('Example 1: Stack simulation');
let stack = [];
stack[stack.length] = 'first'; // Push
stack[stack.length] = 'second'; // Push
stack[stack.length] = 'third'; // Push
console.log('Stack:', stack);
console.log('Top element:', stack[stack.length - 1]);

// Example 2: Circular buffer
console.log('\nExample 2: Circular buffer');
let buffer = new Array(5);
let writePos = 0;

function write(value) {
  buffer[writePos % buffer.length] = value;
  writePos++;
}

write('A');
write('B');
write('C');
write('D');
write('E');
console.log('Buffer after 5 writes:', buffer);

write('F'); // Overwrites 'A'
console.log('Buffer after 6th write:', buffer);

// Example 3: Safe array access function
console.log('\nExample 3: Safe array access');
function safeGet(arr, index, defaultValue = null) {
  if (index >= 0 && index < arr.length) {
    return arr[index];
  }
  return defaultValue;
}

let test = [1, 2, 3];
console.log('safeGet(test, 1):', safeGet(test, 1));
console.log('safeGet(test, 10):', safeGet(test, 10));
console.log('safeGet(test, -1):', safeGet(test, -1));
console.log("safeGet(test, 10, 'default'):", safeGet(test, 10, 'default'));

console.log('\n=== 12. COMMON MISTAKES ===\n');

console.log('Mistake 1: Confusing index types');
let mistake1 = ['a', 'b', 'c'];
mistake1[-1] = 'last'; // Doesn't create last element!
console.log('Array:', mistake1);
console.log('Length:', mistake1.length);
console.log('mistake1[-1]:', mistake1[-1]);

console.log('\nMistake 2: Assuming errors for out of bounds');
let mistake2 = [1, 2, 3];
console.log('mistake2[100]:', mistake2[100]); // No error, just undefined

console.log('\nMistake 3: Creating sparse arrays unintentionally');
let mistake3 = [];
mistake3[0] = 'start';
mistake3[100] = 'end';
console.log('Length:', mistake3.length);
console.log('Actual elements:', mistake3.filter((x) => x !== undefined).length);

console.log('\n=== COMPLETE! ===');
console.log('All array reading and writing concepts demonstrated!');
