// ==========================
// JAVASCRIPT CREATING ARRAYS
// ==========================

console.log('=== 1. ARRAY LITERALS ===\n');

// Basic array literals
let empty = [];
let primes = [2, 3, 5, 7, 11];
let misc = [1.1, true, 'a']; // Mixed types with trailing comma

console.log('Empty array:', empty);
console.log('Primes:', primes);
console.log('Mixed types:', misc);

// Using expressions
let base = 1024;
let table = [base, base + 1, base + 2, base + 3];
console.log('\nArray with expressions:', table);

// Nested arrays and objects
let matrix = [
  [1, { x: 1, y: 2 }],
  [2, { x: 3, y: 4 }],
];
console.log('Nested array:', matrix);
console.log('Accessing nested:', matrix[0][1].x);

// Sparse arrays
let count = [1, , 3]; // Element at index 1 is missing
let undefs = [, ,]; // No elements, but length is 2

console.log("\nSparse array 'count':", count);
console.log('count.length:', count.length);
console.log('count[1]:', count[1]); // undefined
console.log('1 in count:', 1 in count); // false (doesn't exist)

console.log("\nSparse array 'undefs':", undefs);
console.log('undefs.length:', undefs.length);

// Trailing comma
let withTrailing = [1, 2, 3];
console.log('\nArray with trailing comma:', withTrailing);
console.log('Length:', withTrailing.length); // 3, not 4

console.log('\n=== 2. THE SPREAD OPERATOR ===\n');

// Spreading arrays
let a = [1, 2, 3];
let b = [0, ...a, 4];
console.log('Original array a:', a);
console.log('Spread into b:', b);

// Multiple spreads
let arr1 = [1, 2];
let arr2 = [3, 4];
let arr3 = [5, 6];
let combined = [...arr1, ...arr2, ...arr3];
console.log('\nCombining arrays:', combined);

// Shallow copy
let original = [1, 2, 3];
let copy = [...original];
copy[0] = 999;
console.log('\nOriginal after copy modified:', original);
console.log('Modified copy:', copy);

// Shallow copy with nested objects
let nested = [1, { value: 2 }, 3];
let nestedCopy = [...nested];
nestedCopy[1].value = 999;
console.log('\nOriginal nested (affected by copy):', nested);
console.log('Copy nested:', nestedCopy);
console.log('Note: Nested objects are shared (shallow copy)');

// Spreading strings
let digits = [...'0123456789ABCDEF'];
console.log('\nString to array:', digits);

let hello = [...'hello'];
console.log("'hello' spread:", hello);

// Removing duplicates with Set
let letters = [...'hello world'];
let unique = [...new Set(letters)];
console.log('\nLetters with duplicates:', letters);
console.log('Unique letters:', unique);

// Spreading other iterables
let set = new Set([1, 2, 3, 2, 1]);
let setArray = [...set];
console.log('\nSet to array:', setArray);

let map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
let mapArray = [...map];
console.log('Map to array:', mapArray);

console.log('\n=== 3. THE ARRAY() CONSTRUCTOR ===\n');

// No arguments - empty array
let emptyConstructor = new Array();
console.log('new Array():', emptyConstructor);
console.log('Equivalent to []');

// Single numeric argument - preallocate length
let prealloc = new Array(5);
console.log('\nnew Array(5):', prealloc);
console.log('Length:', prealloc.length);
console.log('Element at index 0:', prealloc[0]); // undefined
console.log("Property '0' exists?", 0 in prealloc); // false

// Multiple arguments or single non-numeric
let withElements = new Array(5, 4, 3, 2, 1, 'testing');
console.log("\nnew Array(5, 4, 3, 2, 1, 'testing'):", withElements);

let singleString = new Array('hello');
console.log("new Array('hello'):", singleString);

// Problem: Can't create array with single number
console.log('\nProblem demonstration:');
console.log('new Array(10):', new Array(10)); // Length 10
console.log('Want [10]? Use Array.of() instead');

console.log('\n=== 4. ARRAY.OF() ===\n');

// Solves single numeric argument problem
let ofEmpty = Array.of();
let ofSingle = Array.of(10);
let ofMultiple = Array.of(1, 2, 3);

console.log('Array.of():', ofEmpty);
console.log('Array.of(10):', ofSingle); // [10], not length 10!
console.log('Array.of(1, 2, 3):', ofMultiple);

// Comparison with Array() constructor
console.log('\nComparison:');
console.log('new Array(3):', new Array(3));
console.log('Array.of(3):', Array.of(3));

console.log('\nnew Array(1, 2, 3):', new Array(1, 2, 3));
console.log('Array.of(1, 2, 3):', Array.of(1, 2, 3));

// Use case: Creating array with single numeric element
let scores = Array.of(95);
console.log('\nScore array:', scores);

console.log('\n=== 5. ARRAY.FROM() ===\n');

// From iterable (like spread)
let fromString = Array.from('hello');
console.log("Array.from('hello'):", fromString);

let fromArray = Array.from([1, 2, 3]);
console.log('Array.from([1, 2, 3]):', fromArray);

// Copy array
let originalArray = [1, 2, 3];
let copyArray = Array.from(originalArray);
console.log('\nOriginal:', originalArray);
console.log('Copy:', copyArray);

// From array-like object
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
let trueArray = Array.from(arrayLike);
console.log('\nArray-like object:', arrayLike);
console.log('Converted to array:', trueArray);

// Simulating arguments object
function demonstrateArguments() {
  console.log('\narguments object:', arguments);
  console.log('Is array?', Array.isArray(arguments));

  let argsArray = Array.from(arguments);
  console.log('Converted to array:', argsArray);
  console.log('Is array?', Array.isArray(argsArray));
}
demonstrateArguments('a', 'b', 'c');

// With mapping function (second argument)
console.log('\nWith mapping function:');
let doubled = Array.from([1, 2, 3], (x) => x * 2);
console.log('Array.from([1, 2, 3], x => x * 2):', doubled);

let squared = Array.from([1, 2, 3, 4, 5], (x) => x ** 2);
console.log('Squared:', squared);

let parsed = Array.from('12345', (x) => parseInt(x));
console.log('Parse string digits:', parsed);

// More efficient than separate map
console.log('\nEfficiency comparison:');
console.log('Method 1: Array.from([1,2,3], x => x*2)');
console.log('Method 2: Array.from([1,2,3]).map(x => x*2)');
console.log('Method 1 is more efficient (single pass)');

// Array.from() vs spread operator
console.log('\nArray.from() vs Spread:');

let iterable = new Set([1, 2, 3]);
console.log('With iterable (Set):');
console.log('  Array.from(set):', Array.from(iterable));
console.log('  [...set]:', [...iterable]);

console.log('\nWith array-like:');
console.log('  Array.from(arrayLike):', Array.from(arrayLike));
try {
  console.log('  [...arrayLike]:', [...arrayLike]);
} catch (e) {
  console.log('  [...arrayLike]: Error -', e.message);
}

console.log('\n=== 6. COMPARISON OF ALL METHODS ===\n');

console.log('Creating [1, 2, 3] with different methods:');
console.log('1. Array literal:     ', [1, 2, 3]);
console.log('2. Spread:            ', [...[1, 2, 3]]);
console.log('3. Array():           ', new Array(1, 2, 3));
console.log('4. Array.of():        ', Array.of(1, 2, 3));
console.log('5. Array.from():      ', Array.from([1, 2, 3]));

console.log('\nCreating array with single number 5:');
console.log('1. Array literal:     ', [5]);
console.log('2. Array(5):          ', new Array(5), '❌ Wrong! (length 5)');
console.log('3. Array.of(5):       ', Array.of(5), '✅ Correct!');

console.log('\n=== 7. PRACTICAL EXAMPLES ===\n');

// Example 1: Range function
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
console.log('Example 1: Range function');
console.log('range(1, 5):', range(1, 5));
console.log('range(10, 15):', range(10, 15));

// Example 2: Fill array with values
console.log('\nExample 2: Fill array');
let zeros = Array.from({ length: 5 }, () => 0);
console.log('5 zeros:', zeros);

let randomNumbers = Array.from({ length: 5 }, () =>
  Math.floor(Math.random() * 100)
);
console.log('5 random numbers:', randomNumbers);

// Example 3: Matrix creation
console.log('\nExample 3: Create matrix');
function createMatrix(rows, cols, fillValue = 0) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => fillValue)
  );
}
let matrix3x3 = createMatrix(3, 3, 0);
console.log('3x3 matrix:', matrix3x3);

// Example 4: Flatten nested array (one level)
console.log('\nExample 4: Flatten array');
let nestedArray = [
  [1, 2],
  [3, 4],
  [5, 6],
];
let flattened = [].concat(...nestedArray);
console.log('Nested:', nestedArray);
console.log('Flattened:', flattened);

// Example 5: Clone and modify
console.log('\nExample 5: Clone and modify');
let data = [1, 2, 3, 4, 5];
let doubled2 = [...data].map((x) => x * 2);
console.log('Original:', data);
console.log('Doubled:', doubled2);

// Example 6: Merge and deduplicate
console.log('\nExample 6: Merge and deduplicate');
let arr1Data = [1, 2, 3, 4];
let arr2Data = [3, 4, 5, 6];
let merged = [...arr1Data, ...arr2Data];
let deduped = [...new Set(merged)];
console.log('Array 1:', arr1Data);
console.log('Array 2:', arr2Data);
console.log('Merged:', merged);
console.log('Deduplicated:', deduped);

// Example 7: String manipulation
console.log('\nExample 7: String manipulation');
let text = 'JavaScript';
let chars = [...text];
let reversed = [...text].reverse().join('');
console.log('Original:', text);
console.log('Characters:', chars);
console.log('Reversed:', reversed);

// Example 8: Converting NodeList (simulated)
console.log('\nExample 8: Array-like to Array');
let fakeNodeList = {
  0: { tagName: 'div', id: 'header' },
  1: { tagName: 'div', id: 'main' },
  2: { tagName: 'div', id: 'footer' },
  length: 3,
};
let nodesArray = Array.from(fakeNodeList);
console.log('Fake NodeList:', fakeNodeList);
console.log('Converted array:', nodesArray);
console.log(
  'Can use array methods now:',
  nodesArray.map((n) => n.id)
);

console.log('\n=== 8. PERFORMANCE CONSIDERATIONS ===\n');

console.log('Array creation performance tips:');
console.log('1. Array literals [] are fastest and most readable');
console.log('2. Spread operator [...] is very efficient for copying');
console.log(
  '3. Array.from() with mapper is more efficient than separate .map()'
);
console.log('4. Preallocating with new Array(n) rarely needed in modern JS');
console.log('5. For large datasets, consider typed arrays (Uint8Array, etc.)');

console.log('\n=== 9. COMMON PITFALLS ===\n');

console.log('Pitfall 1: Array() constructor ambiguity');
console.log('  new Array(5) creates length 5, not [5]');
console.log('  Solution: Use Array.of(5) or [5]');

console.log('\nPitfall 2: Shallow copy');
let shallowOriginal = [
  [1, 2],
  [3, 4],
];
let shallowCopy = [...shallowOriginal];
shallowCopy[0][0] = 999;
console.log('  Original affected:', shallowOriginal);
console.log('  Solution: Deep clone with structuredClone() or JSON methods');

console.log('\nPitfall 3: Sparse array gotchas');
let sparseArr = [1, , 3];
console.log('  Sparse array:', sparseArr);
console.log(
  '  .map() skips holes:',
  sparseArr.map((x) => x * 2)
);
console.log('  .forEach() skips holes');
console.log('  Solution: Use Array.from() to create dense arrays');

console.log('\n=== COMPLETE! ===');
console.log('All array creation methods demonstrated successfully!');
