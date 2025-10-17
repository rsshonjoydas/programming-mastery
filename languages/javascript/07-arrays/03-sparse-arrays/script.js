// ========================
// JAVASCRIPT SPARSE ARRAYS
// ========================

console.log('=== 1. WHAT ARE SPARSE ARRAYS? ===\n');

// Dense array (normal)
let dense = [1, 2, 3, 4, 5];
console.log('Dense array:', dense);
console.log('Length:', dense.length);
console.log('Element count:', dense.length);

// Sparse array
let sparse = [1, , , , 5];
console.log('\nSparse array:', sparse);
console.log('Length:', sparse.length);
console.log('Actual elements: only at indexes 0 and 4');

console.log('\n=== 2. CREATING SPARSE ARRAYS ===\n');

// Method 1: Array() constructor
console.log('Method 1: Array() constructor');
let a1 = new Array(5);
console.log('new Array(5):', a1);
console.log('Length:', a1.length);
console.log('a1[0]:', a1[0]);
console.log('0 in a1:', 0 in a1);

// Method 2: Assigning to large index
console.log('\nMethod 2: Assigning to large index');
let a2 = [];
a2[1000] = 0;
console.log('a2.length:', a2.length);
console.log('a2[0]:', a2[0]);
console.log('0 in a2:', 0 in a2);
console.log('1000 in a2:', 1000 in a2);

// Method 3: Array literal with omitted values
console.log('\nMethod 3: Array literal with commas');
let a3 = [1, , 3, , 5];
console.log('Array:', a3);
console.log('Length:', a3.length);
console.log('1 in a3:', 1 in a3);
console.log('2 in a3:', 2 in a3);

// Method 4: delete operator
console.log('\nMethod 4: Using delete operator');
let a4 = [1, 2, 3, 4, 5];
console.log('Before delete:', a4);
delete a4[2];
console.log('After delete a4[2]:', a4);
console.log('Length:', a4.length);
console.log('2 in a4:', 2 in a4);
console.log('a4[2]:', a4[2]);

console.log('\n=== 3. EMPTY SLOTS vs UNDEFINED ===\n');

// Empty slot (sparse)
let a1_empty = [,];
console.log('Empty slot array [,]:');
console.log('Length:', a1_empty.length);
console.log('a1_empty[0]:', a1_empty[0]);
console.log('0 in a1_empty:', 0 in a1_empty);
console.log('hasOwnProperty(0):', a1_empty.hasOwnProperty(0));

// Explicit undefined (dense)
let a2_undefined = [undefined];
console.log('\nExplicit undefined array [undefined]:');
console.log('Length:', a2_undefined.length);
console.log('a2_undefined[0]:', a2_undefined[0]);
console.log('0 in a2_undefined:', 0 in a2_undefined);
console.log('hasOwnProperty(0):', a2_undefined.hasOwnProperty(0));

// Comparison
console.log('\nComparison:');
console.log('Both access to undefined?', a1_empty[0] === a2_undefined[0]);
console.log('But element exists?', 0 in a1_empty !== 0 in a2_undefined);

console.log('\n=== 4. ARRAY METHODS WITH SPARSE ARRAYS ===\n');

let testSparse = [1, , 3, , 5];

// Methods that skip empty slots
console.log('Original sparse array:', testSparse);

console.log('\nforEach (skips empty slots):');
testSparse.forEach((val, idx) => {
  console.log(`  Index ${idx}: ${val}`);
});

console.log('\nmap (skips empty slots):');
let mapped = testSparse.map((x) => x * 2);
console.log('  Result:', mapped);

console.log('\nfilter (skips empty slots):');
let filtered = testSparse.filter((x) => x > 2);
console.log('  Result:', filtered);

console.log('\nreduce (skips empty slots):');
let sum = testSparse.reduce((acc, val) => acc + val, 0);
console.log('  Sum:', sum);

// Methods that preserve sparseness
console.log('\nslice (preserves sparseness):');
let sliced = testSparse.slice(0, 3);
console.log('  Result:', sliced);
console.log('  1 in sliced:', 1 in sliced);

console.log('\nconcat (preserves sparseness):');
let concatenated = testSparse.concat([6, 7]);
console.log('  Result:', concatenated);
console.log('  1 in concatenated:', 1 in concatenated);

// Methods that convert to dense
console.log('\nArray.from (converts to dense):');
let dense1 = Array.from(testSparse);
console.log('  Result:', dense1);
console.log('  1 in dense1:', 1 in dense1);

console.log('\nSpread operator (converts to dense):');
let dense2 = [...testSparse];
console.log('  Result:', dense2);
console.log('  1 in dense2:', 1 in dense2);

console.log('\nflat (converts to dense):');
let flattened = testSparse.flat();
console.log('  Result:', flattened);
console.log('  1 in flattened:', 1 in flattened);

console.log('\n=== 5. DETECTING SPARSE ARRAYS ===\n');

// Check individual indexes
let checkArr = [1, , 3];
console.log('Array:', checkArr);
console.log('Index 0 exists (in):', 0 in checkArr);
console.log('Index 1 exists (in):', 1 in checkArr);
console.log('Index 2 exists (in):', 2 in checkArr);

// Count actual elements
function countElements(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) count++;
  }
  return count;
}

console.log('\nCounting elements:');
console.log('Length:', checkArr.length);
console.log('Actual elements:', countElements(checkArr));

// Check if array is sparse
function isSparse(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) return true;
  }
  return false;
}

console.log('\nIs sparse check:');
console.log('[1, 2, 3] is sparse:', isSparse([1, 2, 3]));
console.log('[1, , 3] is sparse:', isSparse([1, , 3]));
console.log('new Array(5) is sparse:', isSparse(new Array(5)));

console.log('\n=== 6. CONVERTING BETWEEN DENSE AND SPARSE ===\n');

// Sparse to dense
let sparseArr = [1, , 3, , 5];
console.log('Original sparse array:', sparseArr);

console.log('\nConverting sparse to dense:');

// Method 1: Array.from
let method1 = Array.from(sparseArr);
console.log('Array.from:', method1);

// Method 2: Spread operator
let method2 = [...sparseArr];
console.log('Spread operator:', method2);

// Method 3: Manual iteration
let method3 = [];
for (let i = 0; i < sparseArr.length; i++) {
  method3[i] = sparseArr[i];
}
console.log('Manual iteration:', method3);

// Method 4: Array.from with mapping
let method4 = Array.from({ length: sparseArr.length }, (_, i) => sparseArr[i]);
console.log('Array.from with mapping:', method4);

// Verify they're dense
console.log('\nVerifying density (1 in array):');
console.log('method1:', 1 in method1);
console.log('method2:', 1 in method2);
console.log('method3:', 1 in method3);

console.log('\n=== 7. COMMON PITFALLS ===\n');

// Pitfall 1: Confusing empty with undefined
console.log('Pitfall 1: Empty vs undefined in iteration');
let emptyArr = [,];
let undefinedArr = [undefined];

console.log('Empty array forEach:');
emptyArr.forEach((x) => console.log('  Value:', x)); // Nothing

console.log('Undefined array forEach:');
undefinedArr.forEach((x) => console.log('  Value:', x)); // Logs undefined

// Pitfall 2: length property
console.log('\nPitfall 2: Length property misleading');
let lengthArr = [];
lengthArr[100] = 1;
console.log('Array with element at index 100:');
console.log('Length:', lengthArr.length);
console.log('Actual elements:', countElements(lengthArr));

// Pitfall 3: JSON serialization
console.log('\nPitfall 3: JSON serialization');
let jsonSparse = [1, , 3];
console.log('Original sparse:', jsonSparse);
let json = JSON.stringify(jsonSparse);
console.log('JSON string:', json);
let parsed = JSON.parse(json);
console.log('Parsed back:', parsed);
console.log('Is still sparse?', isSparse(parsed));
console.log('1 in parsed:', 1 in parsed);

console.log('\n=== 8. PERFORMANCE COMPARISON ===\n');

// Create dense array
let densePerf = Array.from({ length: 10000 }, (_, i) => i);

// Create sparse array
let sparsePerf = new Array(10000);
sparsePerf[0] = 0;
sparsePerf[9999] = 9999;

console.log('Dense array:');
console.log('  Length:', densePerf.length);
console.log('  Elements:', countElements(densePerf));

console.log('\nSparse array:');
console.log('  Length:', sparsePerf.length);
console.log('  Elements:', countElements(sparsePerf));

// Access time comparison
console.log('\nAccess pattern differences:');
console.log('Dense array - accessing middle element:');
console.log('  densePerf[5000]:', densePerf[5000]);

console.log('Sparse array - accessing middle element:');
console.log('  sparsePerf[5000]:', sparsePerf[5000]);
console.log('  5000 in sparsePerf:', 5000 in sparsePerf);

console.log('\n=== 9. PRACTICAL EXAMPLES ===\n');

// Example 1: Sparse matrix representation
console.log('Example 1: Sparse Matrix (only storing non-zero values)');
let sparseMatrix = [];
sparseMatrix[0] = [];
sparseMatrix[0][0] = 1;
sparseMatrix[5] = [];
sparseMatrix[5][10] = 5;
sparseMatrix[10] = [];
sparseMatrix[10][20] = 3;

console.log('Matrix with values at [0,0], [5,10], [10,20]');
console.log('Value at [0,0]:', sparseMatrix[0]?.[0]);
console.log('Value at [5,10]:', sparseMatrix[5]?.[10]);
console.log('Value at [1,1] (empty):', sparseMatrix[1]?.[1]);

// Example 2: Event timeline with gaps
console.log('\nExample 2: Event Timeline');
let timeline = [];
timeline[0] = 'App started';
timeline[100] = 'User logged in';
timeline[500] = 'Purchase completed';
timeline[1000] = 'User logged out';

console.log('Timeline events:');
for (let i = 0; i < timeline.length; i++) {
  if (i in timeline) {
    console.log(`  Time ${i}: ${timeline[i]}`);
  }
}

// Example 3: Avoiding sparse arrays (best practice)
console.log('\nExample 3: Better Alternative - Dense Array');
let betterTimeline = [
  { time: 0, event: 'App started' },
  { time: 100, event: 'User logged in' },
  { time: 500, event: 'Purchase completed' },
  { time: 1000, event: 'User logged out' },
];

console.log('Better timeline structure:');
betterTimeline.forEach((entry) => {
  console.log(`  Time ${entry.time}: ${entry.event}`);
});

console.log('\n=== 10. BEST PRACTICES ===\n');

console.log('❌ BAD: Creating sparse arrays unintentionally');
let bad1 = new Array(1000);
bad1[0] = 1;
console.log('new Array(1000) - sparse:', isSparse(bad1));

console.log('\n✅ GOOD: Create dense arrays');
let good1 = Array.from({ length: 1000 }, () => undefined);
good1[0] = 1;
console.log('Array.from with undefined - dense:', isSparse(good1));

console.log('\n❌ BAD: Using delete on arrays');
let bad2 = [1, 2, 3];
delete bad2[1];
console.log('After delete:', bad2, '- sparse:', isSparse(bad2));

console.log('\n✅ GOOD: Using splice to remove elements');
let good2 = [1, 2, 3];
good2.splice(1, 1);
console.log('After splice:', good2, '- sparse:', isSparse(good2));

console.log('\n✅ GOOD: Using filter to remove values');
let good3 = [1, 2, 3];
good3 = good3.filter((x) => x !== 2);
console.log('After filter:', good3, '- sparse:', isSparse(good3));

console.log('\n=== 11. UTILITY FUNCTIONS ===\n');

// Fill sparse array gaps
function fillGaps(arr, fillValue = 0) {
  return Array.from({ length: arr.length }, (_, i) =>
    i in arr ? arr[i] : fillValue
  );
}

let gappedArray = [1, , 3, , 5];
console.log('Original sparse:', gappedArray);
console.log('Filled with 0:', fillGaps(gappedArray, 0));
console.log('Filled with null:', fillGaps(gappedArray, null));

// Remove sparse gaps (compact array)
function compactArray(arr) {
  return arr.filter(() => true); // filter keeps only existing elements
}

console.log('\nCompacting array:');
console.log('Original:', gappedArray);
console.log('Compacted:', compactArray(gappedArray));

// Get sparse array info
function getSparseInfo(arr) {
  let elementCount = 0;
  let gaps = 0;

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      elementCount++;
    } else {
      gaps++;
    }
  }

  return {
    length: arr.length,
    elements: elementCount,
    gaps: gaps,
    density: ((elementCount / arr.length) * 100).toFixed(2) + '%',
    isSparse: gaps > 0,
  };
}

console.log('\nArray analysis:');
console.log('Dense [1,2,3]:', getSparseInfo([1, 2, 3]));
console.log('Sparse [1,,3]:', getSparseInfo([1, , 3]));
console.log('Very sparse:', getSparseInfo(new Array(1000)));

console.log('\n=== COMPLETE! ===');
console.log('All sparse array concepts demonstrated successfully!');
console.log('\nKey Takeaway: In most cases, avoid sparse arrays and use');
console.log('dense arrays with explicit undefined values instead!');
