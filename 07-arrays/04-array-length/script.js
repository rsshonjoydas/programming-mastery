// =======================
// JAVASCRIPT ARRAY LENGTH
// =======================

console.log('=== 1. BASIC ARRAY LENGTH ===\n');

// Empty array
let empty = [];
console.log('Empty array length:', empty.length);

// Dense array
let dense = ['a', 'b', 'c'];
console.log('Dense array:', dense);
console.log('Length:', dense.length);
console.log('Highest index: 2, Length: 3 (index + 1)');

// Multiple elements
let numbers = [10, 20, 30, 40, 50];
console.log('\nNumbers array:', numbers);
console.log('Length:', numbers.length);

console.log('\n=== 2. DENSE vs SPARSE ARRAYS ===\n');

// Dense array - all indices filled
let denseArr = [1, 2, 3, 4, 5];
console.log('Dense array:', denseArr);
console.log('Length:', denseArr.length);
console.log('Element count:', denseArr.length);

// Sparse array - some indices missing
let sparseArr = [1, , , 4];
console.log('\nSparse array:', sparseArr);
console.log('Length:', sparseArr.length);
console.log('sparseArr[0]:', sparseArr[0]);
console.log('sparseArr[1]:', sparseArr[1], '(undefined slot)');
console.log('sparseArr[2]:', sparseArr[2], '(undefined slot)');
console.log('sparseArr[3]:', sparseArr[3]);

// Count actual elements
let actualElements = sparseArr.filter(() => true);
console.log('Actual element count:', actualElements.length);

console.log('\n=== 3. AUTOMATIC LENGTH EXTENSION ===\n');

let arr = ['a', 'b', 'c'];
console.log('Initial array:', arr);
console.log('Initial length:', arr.length);

// Assign at index 5 (index >= current length)
arr[5] = 'f';
console.log("\nAfter arr[5] = 'f':");
console.log('Array:', arr);
console.log('Length automatically updated to:', arr.length);
console.log('Created sparse array with empty slots at indices 3 and 4');

// Assign at index 10
arr[10] = 'k';
console.log("\nAfter arr[10] = 'k':");
console.log('Array:', arr);
console.log('Length:', arr.length);

console.log('\n=== 4. TRUNCATION BY REDUCING LENGTH ===\n');

let a = [1, 2, 3, 4, 5];
console.log('Original array:', a);
console.log('Original length:', a.length);

// Reduce length to 3
a.length = 3;
console.log('\nAfter a.length = 3:');
console.log('Array:', a);
console.log('Elements at indices >= 3 were deleted');

// Reduce to 0 (empty array)
a.length = 0;
console.log('\nAfter a.length = 0:');
console.log('Array:', a);
console.log('All elements deleted');

console.log('\n=== 5. INCREASING LENGTH (SPARSE ARRAY) ===\n');

let b = [1, 2, 3];
console.log('Original array:', b);
console.log('Original length:', b.length);

// Increase length to 5
b.length = 5;
console.log('\nAfter b.length = 5:');
console.log('Array:', b);
console.log('Length:', b.length);
console.log('b[3]:', b[3]);
console.log('b[4]:', b[4]);
console.log('No new elements added, just empty slots');

// Equivalent to new Array(5)
let c = new Array(5);
console.log('\nnew Array(5):', c);
console.log('Length:', c.length);

console.log('\n=== 6. PRACTICAL EXAMPLES ===\n');

// Example 1: Empty an array
console.log('Example 1: Emptying an array');
let arr1 = [1, 2, 3, 4, 5];
console.log('Before:', arr1);
arr1.length = 0;
console.log('After arr1.length = 0:', arr1);

// Example 2: Remove last N elements
console.log('\nExample 2: Remove last 2 elements');
let arr2 = [1, 2, 3, 4, 5];
console.log('Before:', arr2);
arr2.length = arr2.length - 2;
console.log('After:', arr2);

// Example 3: Access last element
console.log('\nExample 3: Access last element');
let arr3 = [10, 20, 30, 40];
let last = arr3[arr3.length - 1];
console.log('Array:', arr3);
console.log('Last element (arr3[arr3.length - 1]):', last);

// Example 4: Add to end (alternative to push)
console.log('\nExample 4: Add to end without push()');
let arr4 = [1, 2, 3];
console.log('Before:', arr4);
arr4[arr4.length] = 4;
console.log('After arr4[arr4.length] = 4:', arr4);

// Example 5: Check if empty
console.log('\nExample 5: Check if array is empty');
let arr5 = [];
if (arr5.length === 0) {
  console.log('Array is empty');
}

console.log('\n=== 7. LENGTH WITH ITERATION ===\n');

console.log('Iterating dense array:');
let denseIter = [1, 2, 3, 4, 5];
for (let i = 0; i < denseIter.length; i++) {
  console.log(`Index ${i}: ${denseIter[i]}`);
}

console.log('\nIterating sparse array with for loop:');
let sparseIter = [1, , , 4];
console.log('Array:', sparseIter);
for (let i = 0; i < sparseIter.length; i++) {
  console.log(`Index ${i}: ${sparseIter[i]}`);
}

console.log('\nIterating sparse array with forEach (skips empty):');
sparseIter.forEach((val, idx) => {
  console.log(`Index ${idx}: ${val}`);
});

console.log('\n=== 8. EDGE CASES AND GOTCHAS ===\n');

// Negative indices
console.log('Negative indices:');
let arr6 = [1, 2, 3];
arr6[-1] = 99;
console.log('After arr6[-1] = 99:');
console.log('arr6:', arr6);
console.log('arr6.length:', arr6.length, '(unchanged)');
console.log('arr6[-1]:', arr6[-1], '(treated as object property)');

// Non-integer indices
console.log('\nNon-integer indices:');
let arr7 = [1, 2, 3];
arr7['foo'] = 'bar';
console.log("After arr7['foo'] = 'bar':");
console.log('arr7:', arr7);
console.log('arr7.length:', arr7.length, '(unchanged)');
console.log('arr7.foo:', arr7.foo, '(object property)');

// Invalid length values
console.log('\nInvalid length values:');

// Negative length
try {
  let arr8 = [1, 2, 3];
  arr8.length = -1;
} catch (e) {
  console.log('arr.length = -1 throws:', e.message);
}

// Length >= 2^32
try {
  let arr9 = [1, 2, 3];
  arr9.length = 4294967296;
} catch (e) {
  console.log('arr.length = 2^32 throws:', e.message);
}

// Non-integer gets converted
console.log('\nNon-integer length:');
let arr10 = [1, 2, 3];
arr10.length = 5.7;
console.log('After arr10.length = 5.7:');
console.log('Converted to:', arr10.length);

console.log('\n=== 9. LENGTH PROPERTY CHARACTERISTICS ===\n');

let arr11 = [1, 2, 3];
let descriptor = Object.getOwnPropertyDescriptor(arr11, 'length');
console.log('Length property descriptor:');
console.log('  writable:', descriptor.writable);
console.log('  enumerable:', descriptor.enumerable);
console.log('  configurable:', descriptor.configurable);

// Length doesn't appear in for...in
console.log('\nfor...in loop (length not enumerable):');
for (let key in arr11) {
  console.log(`  key: ${key}`);
}

console.log('\n=== 10. SPARSE ARRAY CREATION METHODS ===\n');

// Method 1: Skip indices
let sparse1 = [1, , , 4];
console.log('Method 1 - Skip indices:', sparse1);
console.log('Length:', sparse1.length);

// Method 2: Assign to high index
let sparse2 = [];
sparse2[10] = 'x';
console.log('\nMethod 2 - High index:', sparse2);
console.log('Length:', sparse2.length);

// Method 3: Array constructor
let sparse3 = new Array(5);
console.log('\nMethod 3 - Array(5):', sparse3);
console.log('Length:', sparse3.length);

// Method 4: Increase length
let sparse4 = [1, 2];
sparse4.length = 10;
console.log('\nMethod 4 - Increase length:', sparse4);
console.log('Length:', sparse4.length);

console.log('\n=== 11. REAL-WORLD USE CASES ===\n');

// Use case 1: Dynamic array building
console.log('Use Case 1: Building array dynamically');
let dynamicArr = [];
for (let i = 0; i < 5; i++) {
  dynamicArr[dynamicArr.length] = i * 2;
}
console.log('Result:', dynamicArr);

// Use case 2: Batch truncation
console.log('\nUse Case 2: Truncate to keep first N items');
let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('Original:', items);
items.length = 3;
console.log('Keep first 3:', items);

// Use case 3: Pre-allocate array size
console.log('\nUse Case 3: Pre-allocate for performance');
let preAlloc = new Array(1000);
console.log('Pre-allocated array length:', preAlloc.length);
console.log('Fill later with values...');

// Use case 4: Check if array has elements
console.log('\nUse Case 4: Validation');
function processArray(arr) {
  if (arr.length === 0) {
    return 'Array is empty, nothing to process';
  }
  return `Processing ${arr.length} elements`;
}
console.log(processArray([]));
console.log(processArray([1, 2, 3]));

console.log('\n=== 12. LENGTH VS ELEMENT COUNT ===\n');

let mixed = [];
mixed[0] = 'a';
mixed[2] = 'c';
mixed[5] = 'f';

console.log('Sparse array:', mixed);
console.log('Length:', mixed.length);

// Count actual elements
let count = 0;
for (let i = 0; i < mixed.length; i++) {
  if (i in mixed) count++;
}
console.log("Actual element count (using 'in'):", count);

// Alternative method
let count2 = mixed.filter(() => true).length;
console.log('Actual element count (using filter):', count2);

// Object.keys shows only defined indices
console.log('Defined indices:', Object.keys(mixed));

console.log('\n=== 13. PERFORMANCE COMPARISON ===\n');

console.log('Emptying array methods:');

// Method 1: Set length to 0 (fastest)
let perf1 = new Array(1000).fill(1);
console.time('length = 0');
perf1.length = 0;
console.timeEnd('length = 0');

// Method 2: splice (slower)
let perf2 = new Array(1000).fill(1);
console.time('splice(0)');
perf2.splice(0);
console.timeEnd('splice(0)');

// Method 3: pop in loop (slowest)
let perf3 = new Array(1000).fill(1);
console.time('pop loop');
while (perf3.length > 0) perf3.pop();
console.timeEnd('pop loop');

console.log('\n=== COMPLETE! ===');
console.log('All array length concepts demonstrated successfully!');
console.log('\nKey Takeaways:');
console.log('✓ length = highest index + 1');
console.log('✓ Setting length truncates or creates sparse arrays');
console.log('✓ Assigning to high index automatically updates length');
console.log('✓ Sparse arrays have length > actual element count');
console.log('✓ length is writable but not enumerable');
