// =============================
// JAVASCRIPT ARRAY-LIKE OBJECTS
// =============================

console.log('=== 1. WHAT ARE ARRAY-LIKE OBJECTS? ===\n');

// Real array
let realArray = [1, 2, 3];
console.log('Real array:', realArray);
console.log('Is array?', Array.isArray(realArray));
console.log('Has push method?', typeof realArray.push);

// Array-like object
let arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
};
console.log('\nArray-like object:', arrayLike);
console.log('Is array?', Array.isArray(arrayLike));
console.log('Has push method?', typeof arrayLike.push);

console.log('\n=== 2. CREATING ARRAY-LIKE OBJECTS ===\n');

// Method 1: Manual creation
let manual = {};
let i = 0;
while (i < 10) {
  manual[i] = i * i;
  i++;
}
manual.length = i;
console.log('Manually created array-like:', manual);

// Method 2: Simple object literal
let simple = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
console.log('Simple array-like:', simple);

// Method 3: Custom function
function createRange(start, end) {
  let range = {};
  let idx = 0;

  for (let i = start; i <= end; i++) {
    range[idx] = i;
    idx++;
  }

  range.length = idx;
  return range;
}

let range = createRange(1, 5);
console.log('Range array-like:', range);

console.log('\n=== 3. TESTING FOR ARRAY-LIKE OBJECTS ===\n');

function isArrayLike(o) {
  if (
    o && // Not null/undefined
    typeof o === 'object' && // Is an object
    Number.isFinite(o.length) && // length is finite
    o.length >= 0 && // length is non-negative
    Number.isInteger(o.length) && // length is integer
    o.length < 4294967295 // length < 2^32 - 1
  ) {
    return true;
  } else {
    return false;
  }
}

// Test various objects
console.log('Testing isArrayLike:');
console.log('Real array:', isArrayLike([1, 2, 3]));
console.log('Array-like object:', isArrayLike({ 0: 'a', 1: 'b', length: 2 }));
console.log('Regular object:', isArrayLike({ name: 'John' }));
console.log('String:', isArrayLike('hello'));
console.log('Number:', isArrayLike(42));
console.log('Null:', isArrayLike(null));
console.log('Undefined:', isArrayLike(undefined));

console.log('\n=== 4. ARGUMENTS OBJECT (ARRAY-LIKE) ===\n');

function demoArguments() {
  console.log('arguments object:', arguments);
  console.log('arguments.length:', arguments.length);
  console.log('arguments[0]:', arguments[0]);
  console.log('Is array?', Array.isArray(arguments));
  console.log('Is array-like?', isArrayLike(arguments));

  // Iterate through arguments
  console.log('\nIterating arguments:');
  for (let i = 0; i < arguments.length; i++) {
    console.log(`  Argument ${i}:`, arguments[i]);
  }
}

demoArguments('apple', 'banana', 'cherry');

// Sum function using arguments
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log('\nSum using arguments:', sum(1, 2, 3, 4, 5));

console.log('\n=== 5. ITERATING ARRAY-LIKE OBJECTS ===\n');

let data = { 0: 10, 1: 20, 2: 30, 3: 40, length: 4 };

// Method 1: for loop
console.log('Using for loop:');
for (let i = 0; i < data.length; i++) {
  console.log(`  Index ${i}:`, data[i]);
}

// Method 2: while loop
console.log('\nUsing while loop:');
let j = 0;
let sum1 = 0;
while (j < data.length) {
  sum1 += data[j];
  j++;
}
console.log('  Sum:', sum1);

// Can't use forEach directly (not a method)
try {
  data.forEach((x) => console.log(x));
} catch (e) {
  console.log("\nCan't use forEach directly:", e.message);
}

console.log('\n=== 6. USING ARRAY METHODS WITH .call() ===\n');

let letters = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

// join
let joined = Array.prototype.join.call(letters, '+');
console.log('join.call():', joined);

// map
let upper = Array.prototype.map.call(letters, (x) => x.toUpperCase());
console.log('map.call():', upper);

// filter
let filtered = Array.prototype.filter.call(letters, (x) => x !== 'b');
console.log('filter.call():', filtered);

// reduce
let numbers = { 0: 1, 1: 2, 2: 3, 3: 4, length: 4 };
let sum2 = Array.prototype.reduce.call(numbers, (acc, val) => acc + val, 0);
console.log('reduce.call():', sum2);

// slice (makes a copy)
let sliced = Array.prototype.slice.call(letters, 0);
console.log('slice.call():', sliced);
console.log('Is result an array?', Array.isArray(sliced));

// forEach
console.log('\nforEach.call():');
Array.prototype.forEach.call(letters, (val, idx) => {
  console.log(`  ${idx}: ${val}`);
});

console.log('\n=== 7. CONVERTING TO REAL ARRAYS ===\n');

let arrayLike2 = { 0: 'x', 1: 'y', 2: 'z', length: 3 };

// Method 1: Array.from() (Modern, Recommended)
let converted1 = Array.from(arrayLike2);
console.log('Array.from():', converted1);
console.log('Is array?', Array.isArray(converted1));

// Array.from with mapping
let converted2 = Array.from(arrayLike2, (x) => x.toUpperCase());
console.log('Array.from() with mapping:', converted2);

// Method 2: Array.prototype.slice.call() (Legacy)
let converted3 = Array.prototype.slice.call(arrayLike2);
console.log('slice.call():', converted3);

// Method 3: Spread operator (for iterables only)
function testSpread() {
  let converted = [...arguments];
  console.log('Spread operator:', converted);
  return converted;
}
testSpread('a', 'b', 'c');

// Method 4: Shorthand slice
let converted4 = [].slice.call(arrayLike2);
console.log('Shorthand slice:', converted4);

console.log('\n=== 8. DIFFERENCES: ARRAY VS ARRAY-LIKE ===\n');

let trueArray = ['a', 'b', 'c'];
let fakeArray = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

console.log('True array:');
console.log('  Array.isArray():', Array.isArray(trueArray));
console.log('  Can use .push():', typeof trueArray.push === 'function');
console.log('  Auto-update length:', true);
trueArray.push('d');
console.log('  After push:', trueArray, 'length:', trueArray.length);

console.log('\nArray-like object:');
console.log('  Array.isArray():', Array.isArray(fakeArray));
console.log('  Can use .push():', typeof fakeArray.push === 'function');
console.log('  Auto-update length:', false);
fakeArray[3] = 'd'; // Manual addition
console.log('  After manual add:', fakeArray, 'length:', fakeArray.length);
fakeArray.length = 4; // Must update manually
console.log('  After updating length:', fakeArray.length);

console.log('\n=== 9. PRACTICAL EXAMPLES ===\n');

// Example 1: Sum function with arguments
console.log('Example 1: Flexible sum function');
function flexibleSum() {
  // Convert to array for reduce
  let args = Array.from(arguments);
  return args.reduce((acc, val) => acc + val, 0);
}
console.log('Sum of 10, 20, 30:', flexibleSum(10, 20, 30));
console.log('Sum of 1, 2, 3, 4, 5:', flexibleSum(1, 2, 3, 4, 5));

// Example 2: Custom collection
console.log('\nExample 2: Custom collection');
function Collection() {
  let idx = 0;
  for (let i = 0; i < arguments.length; i++) {
    this[idx] = arguments[i];
    idx++;
  }
  this.length = idx;
}

let collection = new Collection('apple', 'banana', 'cherry');
console.log('Collection:', collection);
console.log('Is array-like?', isArrayLike(collection));

// Use array methods
let upperFruits = Array.prototype.map.call(collection, (x) => x.toUpperCase());
console.log('Uppercase fruits:', upperFruits);

// Example 3: Processing array-like data
console.log('\nExample 3: Data processing');
let scores = { 0: 85, 1: 92, 2: 78, 3: 95, 4: 88, length: 5 };

function analyzeScores(scoreObj) {
  let arr = Array.from(scoreObj);
  let total = arr.reduce((a, b) => a + b, 0);
  let avg = total / arr.length;
  let max = Math.max(...arr);
  let min = Math.min(...arr);

  return { total, average: avg, max, min };
}

let analysis = analyzeScores(scores);
console.log('Score analysis:', analysis);

// Example 4: Building HTML elements list (simulated)
console.log('\nExample 4: Simulated DOM-like collection');
let elements = {
  0: { tag: 'div', id: 'header' },
  1: { tag: 'div', id: 'content' },
  2: { tag: 'div', id: 'footer' },
  length: 3,
};

function getElementIds(collection) {
  return Array.prototype.map.call(collection, (el) => el.id);
}

let ids = getElementIds(elements);
console.log('Element IDs:', ids);

console.log('\n=== 10. COMMON ARRAY-LIKE OBJECTS ===\n');

// 1. arguments
console.log('1. arguments object:');
(function () {
  console.log('   Type:', typeof arguments);
  console.log('   Is array?', Array.isArray(arguments));
  console.log('   Is array-like?', isArrayLike(arguments));
})('a', 'b', 'c');

// 2. String (technically array-like)
console.log('\n2. String:');
let str = 'hello';
console.log('   String:', str);
console.log('   length:', str.length);
console.log('   str[0]:', str[0]);
console.log('   Is array-like?', isArrayLike(str)); // Our function returns false
console.log('   But has array-like properties');

// 3. Custom array-like
console.log('\n3. Custom array-like:');
let custom = {
  0: 'first',
  1: 'second',
  2: 'third',
  length: 3,
  name: 'CustomCollection',
};
console.log('   Is array-like?', isArrayLike(custom));
console.log('   Can iterate:', true);

console.log('\n=== 11. ADVANCED: ARRAY METHOD COMPATIBILITY ===\n');

let testObj = { 0: 5, 1: 10, 2: 15, 3: 20, length: 4 };

console.log('Testing various array methods:');

// every
let allPositive = Array.prototype.every.call(testObj, (x) => x > 0);
console.log('  every (all positive):', allPositive);

// some
let hasLargeNumber = Array.prototype.some.call(testObj, (x) => x > 15);
console.log('  some (has > 15):', hasLargeNumber);

// find
let found = Array.prototype.find.call(testObj, (x) => x === 15);
console.log('  find (value 15):', found);

// findIndex
let foundIdx = Array.prototype.findIndex.call(testObj, (x) => x === 15);
console.log('  findIndex (value 15):', foundIdx);

// includes (needs proper this binding)
let includes = Array.prototype.includes.call(testObj, 10);
console.log('  includes (10):', includes);

// sort (creates array)
let sorted = Array.prototype.sort.call(Array.from(testObj), (a, b) => b - a);
console.log('  sort (descending):', sorted);

console.log('\n=== 12. BEST PRACTICES ===\n');

console.log('✅ DO:');
console.log('  • Use Array.from() to convert to real arrays');
console.log('  • Test with isArrayLike() before treating as array-like');
console.log('  • Prefer rest parameters (...args) over arguments');
console.log('  • Convert early if you need array methods frequently');

console.log("\n❌ DON'T:");
console.log('  • Assume array methods work directly');
console.log('  • Modify length expecting array behavior');
console.log('  • Use Array.isArray() to test array-like objects');
console.log('  • Forget that array-like ≠ array');

console.log('\n=== 13. PERFORMANCE COMPARISON ===\n');

let largeArrayLike = {};
for (let i = 0; i < 1000; i++) {
  largeArrayLike[i] = i;
}
largeArrayLike.length = 1000;

console.log('Converting 1000-element array-like object:');

console.time('Array.from()');
let arr1 = Array.from(largeArrayLike);
console.timeEnd('Array.from()');

console.time('slice.call()');
let arr2 = Array.prototype.slice.call(largeArrayLike);
console.timeEnd('slice.call()');

console.time('Manual loop');
let arr3 = [];
for (let i = 0; i < largeArrayLike.length; i++) {
  arr3[i] = largeArrayLike[i];
}
console.timeEnd('Manual loop');

console.log(
  'All methods produce arrays:',
  Array.isArray(arr1) && Array.isArray(arr2) && Array.isArray(arr3)
);

console.log('\n=== COMPLETE! ===');
console.log('All array-like object concepts demonstrated successfully!');
