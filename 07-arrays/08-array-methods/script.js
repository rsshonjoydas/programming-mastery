// ========================
// JAVASCRIPT ARRAY METHODS
// ========================

console.log('=== 1. ARRAY ITERATOR METHODS ===\n');

// forEach() - Iterate without return value
console.log('forEach():');
let data = [1, 2, 3, 4, 5];
let sum = 0;

data.forEach((value) => {
  sum += value;
});
console.log('Sum of [1,2,3,4,5]:', sum); // 15

// Modify array in place
data.forEach((v, i, a) => {
  a[i] = v + 1;
});
console.log('After incrementing each element:', data); // [2,3,4,5,6]

// map() - Transform each element
console.log('\nmap():');
let numbers = [1, 2, 3, 4];
let squared = numbers.map((x) => x * x);
console.log('Original:', numbers);
console.log('Squared:', squared);

let names = ['alice', 'bob', 'charlie'];
let uppercase = names.map((name) => name.toUpperCase());
console.log('Uppercase names:', uppercase);

// filter() - Select elements matching condition
console.log('\nfilter():');
let ages = [5, 18, 12, 21, 15, 30];
let adults = ages.filter((age) => age >= 18);
console.log('Adults (>= 18):', adults);

let evenNumbers = [1, 2, 3, 4, 5, 6].filter((x) => x % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Close gaps in sparse array
let sparse = [1, , , 4, , 6];
let dense = sparse.filter(() => true);
console.log('Sparse array:', sparse);
console.log('Dense array:', dense);

// find() and findIndex()
console.log('\nfind() and findIndex():');
let users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
];

let user = users.find((u) => u.id === 2);
console.log('Found user:', user);

let index = users.findIndex((u) => u.name === 'Charlie');
console.log("Charlie's index:", index);

let notFound = users.find((u) => u.age > 100);
console.log('User over 100:', notFound); // undefined

// every() and some()
console.log('\nevery() and some():');
let scores = [85, 92, 78, 95, 88];

console.log(
  'All scores >= 70?',
  scores.every((s) => s >= 70)
); // true
console.log(
  'All scores >= 90?',
  scores.every((s) => s >= 90)
); // false
console.log(
  'Some scores >= 90?',
  scores.some((s) => s >= 90)
); // true
console.log(
  'Any failing scores?',
  scores.some((s) => s < 60)
); // false

// reduce() and reduceRight()
console.log('\nreduce():');
let nums = [1, 2, 3, 4, 5];

let total = nums.reduce((acc, val) => acc + val, 0);
console.log('Sum:', total); // 15

let product = nums.reduce((acc, val) => acc * val, 1);
console.log('Product:', product); // 120

let max = nums.reduce((acc, val) => (acc > val ? acc : val));
console.log('Max:', max); // 5

// Count occurrences
let fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
let count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log('Fruit count:', count);

// reduceRight() - right to left
console.log('\nreduceRight():');
let base = [2, 3, 4];
let result = base.reduceRight((acc, val) => Math.pow(val, acc));
console.log('2^(3^4):', result);

let words = ['world', 'beautiful', 'Hello'];
let sentence = words.reduceRight((acc, word) => acc + ' ' + word);
console.log('Reversed sentence:', sentence);

console.log('\n=== 2. FLATTENING ARRAYS ===\n');

// flat()
console.log('flat():');
let nested1 = [1, [2, 3]];
console.log('[1, [2, 3]].flat():', nested1.flat());

let nested2 = [1, [2, [3, [4]]]];
console.log('Depth 1:', nested2.flat(1));
console.log('Depth 2:', nested2.flat(2));
console.log('Depth 3:', nested2.flat(3));

// flatMap()
console.log('\nflatMap():');
let phrases = ['hello world', 'the definitive guide'];
let allWords = phrases.flatMap((phrase) => phrase.split(' '));
console.log('Words from phrases:', allWords);

// Remove negative numbers, get square roots
let mixed = [-2, -1, 1, 2, 4];
let roots = mixed.flatMap((x) => (x < 0 ? [] : [Math.sqrt(x)]));
console.log('Square roots of non-negative:', roots);

// Duplicate each element
let original = [1, 2, 3];
let duplicated = original.flatMap((x) => [x, x]);
console.log('Duplicated:', duplicated);

console.log('\n=== 3. CONCATENATION ===\n');

console.log('concat():');
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

console.log('arr1.concat(arr2):', arr1.concat(arr2));
console.log('Concat with values:', arr1.concat(7, 8, 9));
console.log('Concat multiple arrays:', arr1.concat(arr2, [7, 8]));
console.log('Nested arrays:', arr1.concat([4, [5, 6]])); // Doesn't flatten nested
console.log('Original arr1:', arr1); // Unchanged

console.log('\n=== 4. STACK AND QUEUE METHODS ===\n');

// Stack (LIFO) - push() and pop()
console.log('Stack operations (LIFO):');
let stack = [];
console.log('Initial:', stack);

stack.push(1, 2);
console.log('After push(1, 2):', stack);

let popped = stack.pop();
console.log('Popped:', popped, 'Stack:', stack);

stack.push(3);
console.log('After push(3):', stack);

stack.push([4, 5]);
console.log('After push([4, 5]):', stack);

stack.pop();
console.log('After pop():', stack);

// Queue (FIFO) - push() and shift()
console.log('\nQueue operations (FIFO):');
let queue = [];

queue.push(1, 2);
console.log('After push(1, 2):', queue);

let shifted = queue.shift();
console.log('Shifted:', shifted, 'Queue:', queue);

queue.push(3);
console.log('After push(3):', queue);

queue.shift();
console.log('After shift():', queue);

// unshift() - add to beginning
console.log('\nunshift():');
let arr = [3, 4];
arr.unshift(1, 2);
console.log('After unshift(1, 2):', arr); // [1, 2, 3, 4]

// unshift order quirk
let a = [];
a.unshift(1);
console.log('After unshift(1):', a);
a.unshift(2);
console.log('After unshift(2):', a); // [2, 1]

a = [];
a.unshift(1, 2);
console.log('After unshift(1, 2) at once:', a); // [1, 2]

console.log('\n=== 5. SUBARRAY METHODS ===\n');

// slice() - extract subarray (non-mutating)
console.log('slice():');
let letters = ['a', 'b', 'c', 'd', 'e'];

console.log('slice(0, 3):', letters.slice(0, 3));
console.log('slice(2):', letters.slice(2));
console.log('slice(1, -1):', letters.slice(1, -1));
console.log('slice(-3, -1):', letters.slice(-3, -1));
console.log('Original:', letters); // Unchanged

// splice() - modify array (mutating)
console.log('\nsplice():');
let items = [1, 2, 3, 4, 5, 6, 7, 8];

console.log('Remove from index 4:', items.splice(4)); // Returns removed
console.log('Array now:', items);

items = [1, 2, 3, 4, 5];
console.log('Remove 2 items from index 1:', items.splice(1, 2));
console.log('Array now:', items);

// Insert without deleting
items = [1, 2, 3, 4, 5];
console.log("Insert 'a', 'b' at index 2:", items.splice(2, 0, 'a', 'b'));
console.log('Array now:', items);

// Replace elements
items = [1, 2, 3, 4, 5];
console.log('Replace 2 items at index 2:', items.splice(2, 2, 'x', 'y', 'z'));
console.log('Array now:', items);

// fill() - fill with static value
console.log('\nfill():');
let arr3 = new Array(5);
console.log('New array(5):', arr3);

arr3.fill(0);
console.log('After fill(0):', arr3);

arr3.fill(9, 1);
console.log('After fill(9, 1):', arr3);

arr3.fill(8, 2, -1);
console.log('After fill(8, 2, -1):', arr3);

// copyWithin() - copy within same array
console.log('\ncopyWithin():');
let arr4 = [1, 2, 3, 4, 5];

console.log('Original:', arr4);
arr4.copyWithin(1);
console.log('copyWithin(1):', arr4);

arr4 = [1, 2, 3, 4, 5];
arr4.copyWithin(2, 3, 5);
console.log('copyWithin(2, 3, 5):', arr4);

arr4 = [1, 2, 3, 4, 5];
arr4.copyWithin(0, -2);
console.log('copyWithin(0, -2):', arr4);

console.log('\n=== 6. SEARCHING AND SORTING ===\n');

// indexOf() and lastIndexOf()
console.log('indexOf() and lastIndexOf():');
let values = [0, 1, 2, 1, 0];

console.log('indexOf(1):', values.indexOf(1));
console.log('lastIndexOf(1):', values.lastIndexOf(1));
console.log('indexOf(3):', values.indexOf(3)); // -1

// Find all occurrences
function findAll(arr, value) {
  let results = [],
    pos = 0;
  while (pos < arr.length) {
    pos = arr.indexOf(value, pos);
    if (pos === -1) break;
    results.push(pos);
    pos++;
  }
  return results;
}

console.log('All occurrences of 1:', findAll(values, 1));

// includes()
console.log('\nincludes():');
let testArr = [1, true, 3, NaN];

console.log('includes(true):', testArr.includes(true));
console.log('includes(2):', testArr.includes(2));
console.log('includes(NaN):', testArr.includes(NaN)); // Works with NaN!
console.log('indexOf(NaN):', testArr.indexOf(NaN)); // Doesn't find NaN

// sort()
console.log('\nsort():');

// Alphabetical (default)
let fruits2 = ['banana', 'cherry', 'apple'];
fruits2.sort();
console.log('Alphabetical:', fruits2);

// Numeric sort (requires comparator!)
let numbers2 = [33, 4, 1111, 222];
console.log('Default sort (wrong!):', [...numbers2].sort());
console.log(
  'Numeric ascending:',
  [...numbers2].sort((a, b) => a - b)
);
console.log(
  'Numeric descending:',
  [...numbers2].sort((a, b) => b - a)
);

// Case-insensitive sort
let animals = ['ant', 'Bug', 'cat', 'Dog'];
console.log('Case-sensitive:', [...animals].sort());

animals.sort((s, t) => {
  let a = s.toLowerCase();
  let b = t.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});
console.log('Case-insensitive:', animals);

// Sort objects
let people = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];

people.sort((a, b) => a.age - b.age);
console.log('Sorted by age:', people);

// reverse()
console.log('\nreverse():');
let sequence = [1, 2, 3, 4, 5];
sequence.reverse();
console.log('Reversed:', sequence);

console.log('\n=== 7. ARRAY TO STRING CONVERSIONS ===\n');

// join()
console.log('join():');
let digits = [1, 2, 3, 4];

console.log('Default (comma):', digits.join());
console.log('Space separator:', digits.join(' '));
console.log('Hyphen separator:', digits.join('-'));
console.log('No separator:', digits.join(''));

let empty = new Array(5);
console.log("Empty array join('-'):", empty.join('-'));

// toString()
console.log('\ntoString():');
console.log('[1, 2, 3].toString():', [1, 2, 3].toString());
console.log("['a', 'b', 'c'].toString():", ['a', 'b', 'c'].toString());
console.log("[1, [2, 'c']].toString():", [1, [2, 'c']].toString());

console.log('\n=== 8. STATIC ARRAY FUNCTIONS ===\n');

// Array.isArray()
console.log('Array.isArray():');
console.log('Array.isArray([]):', Array.isArray([]));
console.log('Array.isArray({}):', Array.isArray({}));
console.log("Array.isArray('string'):", Array.isArray('string'));
console.log('Array.isArray(123):', Array.isArray(123));

// Array.of()
console.log('\nArray.of():');
console.log('Array.of(1, 2, 3):', Array.of(1, 2, 3));
console.log('Array.of(7):', Array.of(7)); // [7], not array of length 7
console.log('Array(7):', Array(7)); // Empty array of length 7

// Array.from()
console.log('\nArray.from():');
console.log('From string:', Array.from('hello'));
console.log('From Set:', Array.from(new Set([1, 2, 2, 3])));
console.log(
  'From arguments:',
  Array.from([1, 2, 3], (x) => x * 2)
);

// Convert array-like to array
function example() {
  console.log('From arguments object:', Array.from(arguments));
}
example(1, 2, 3);

console.log('\n=== 9. PRACTICAL EXAMPLES ===\n');

// Example 1: Data processing pipeline
console.log('Example 1: Data processing pipeline:');
let sales = [
  { product: 'Laptop', price: 1000, quantity: 2 },
  { product: 'Mouse', price: 25, quantity: 10 },
  { product: 'Keyboard', price: 75, quantity: 5 },
  { product: 'Monitor', price: 300, quantity: 3 },
];

let totalRevenue = sales
  .map((item) => item.price * item.quantity)
  .reduce((sum, revenue) => sum + revenue, 0);

console.log('Total revenue:', totalRevenue);

let highValueItems = sales
  .filter((item) => item.price * item.quantity > 500)
  .map((item) => item.product);

console.log('High value items:', highValueItems);

// Example 2: Remove duplicates
console.log('\nExample 2: Remove duplicates:');
let duplicates = [1, 2, 2, 3, 4, 4, 5];
let unique = [...new Set(duplicates)];
console.log('Original:', duplicates);
console.log('Unique:', unique);

// Example 3: Group by property
console.log('\nExample 3: Group by category:');
let products = [
  { name: 'Apple', category: 'Fruit' },
  { name: 'Carrot', category: 'Vegetable' },
  { name: 'Banana', category: 'Fruit' },
  { name: 'Broccoli', category: 'Vegetable' },
];

let grouped = products.reduce((acc, product) => {
  let cat = product.category;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(product.name);
  return acc;
}, {});

console.log('Grouped:', grouped);

// Example 4: Flatten nested arrays
console.log('\nExample 4: Flatten deeply nested:');
let deepNested = [1, [2, [3, [4, [5]]]]];
let flattened = deepNested.flat(Infinity);
console.log('Deep nested:', deepNested);
console.log('Completely flat:', flattened);

// Example 5: Chaining methods
console.log('\nExample 5: Method chaining:');
let result2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter((x) => x % 2 === 0) // Get even numbers
  .map((x) => x * x) // Square them
  .filter((x) => x > 20) // Only > 20
  .reduce((sum, x) => sum + x); // Sum them

console.log('Result:', result2);

console.log('\n=== 10. MUTATING VS NON-MUTATING ===\n');

console.log('Mutating methods (modify original):');
let mut = [1, 2, 3];
console.log('Original:', mut);

mut.push(4);
console.log('After push(4):', mut);

mut.splice(1, 1);
console.log('After splice(1, 1):', mut);

mut.sort((a, b) => b - a);
console.log('After sort (desc):', mut);

console.log('\nNon-mutating methods (return new):');
let nonMut = [1, 2, 3];
console.log('Original:', nonMut);

let mapped = nonMut.map((x) => x * 2);
console.log('map(x => x * 2):', mapped);
console.log('Original still:', nonMut);

let filtered = nonMut.filter((x) => x > 1);
console.log('filter(x => x > 1):', filtered);
console.log('Original still:', nonMut);

console.log('\n=== COMPLETE! ===');
console.log('All array methods demonstrated successfully!');
