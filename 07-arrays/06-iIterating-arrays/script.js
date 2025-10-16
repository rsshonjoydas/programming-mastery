// ===========================
// JAVASCRIPT ITERATING ARRAYS
// ===========================

console.log('=== 1. FOR...OF LOOP (ES6+) ===\n');

// Basic for...of iteration
let letters = [...'Hello world'];
let string = '';

for (let letter of letters) {
  string += letter;
}
console.log('Reassembled string:', string);

// for...of with arrays
let fruits = ['apple', 'banana', 'cherry'];
console.log('\nIterating fruits:');
for (let fruit of fruits) {
  console.log(fruit);
}

// Getting index with entries()
console.log('\nUsing entries() for index access:');
let everyOther = '';
for (let [index, letter] of letters.entries()) {
  console.log(`Index ${index}: ${letter}`);
  if (index % 2 === 0) {
    everyOther += letter;
  }
}
console.log('Every other letter:', everyOther);

// Breaking out of for...of
console.log('\nBreaking early:');
for (let fruit of fruits) {
  if (fruit === 'banana') {
    console.log('Found banana, stopping!');
    break;
  }
  console.log(fruit);
}

console.log('\n=== 2. forEach() METHOD ===\n');

// Basic forEach
let uppercase = '';
letters.forEach((letter) => {
  uppercase += letter.toUpperCase();
});
console.log('Uppercase:', uppercase);

// forEach with index
console.log('\nforEach with index:');
fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});

// forEach with all parameters
console.log('\nforEach with all parameters:');
['a', 'b', 'c'].forEach((element, index, array) => {
  console.log(
    `Element: ${element}, Index: ${index}, Array length: ${array.length}`
  );
});

// forEach is sparse array aware
console.log('\nSparse array with forEach:');
let sparse = [1, , 3, , 5];
console.log('Array:', sparse);
console.log('forEach output (skips gaps):');
sparse.forEach((num, i) => {
  console.log(`Index ${i}: ${num}`);
});

console.log('\n=== 3. TRADITIONAL FOR LOOP ===\n');

// Basic for loop
console.log('Finding vowels:');
let vowels = '';
for (let i = 0; i < letters.length; i++) {
  let letter = letters[i];
  if (/[aeiou]/.test(letter)) {
    vowels += letter;
  }
}
console.log('Vowels found:', vowels);

// For loop with break and continue
console.log('\nUsing break and continue:');
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) continue; // Skip even numbers
  if (numbers[i] > 7) break; // Stop after 7
  console.log(numbers[i]);
}

// Nested loops
console.log('\nNested loops (multiplication table):');
for (let i = 1; i <= 3; i++) {
  let row = '';
  for (let j = 1; j <= 3; j++) {
    row += `${i * j}\t`;
  }
  console.log(row);
}

console.log('\n=== 4. PERFORMANCE OPTIMIZATIONS ===\n');

// Caching array length
console.log('Cached length (modern engines optimize this automatically):');
let largeArray = Array.from({ length: 5 }, (_, i) => i + 1);
for (let i = 0, len = largeArray.length; i < len; i++) {
  console.log(`Item ${i}: ${largeArray[i]}`);
}

// Reverse iteration
console.log('\nReverse iteration:');
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(`${i}: ${fruits[i]}`);
}

console.log('\n=== 5. HANDLING SPARSE ARRAYS ===\n');

let sparseArray = [1, , 3, , 5, undefined, 7];
console.log('Sparse array:', sparseArray);
console.log('Length:', sparseArray.length);

// for...of includes gaps as undefined
console.log('\nfor...of (includes gaps):');
for (let num of sparseArray) {
  console.log(num);
}

// forEach skips gaps
console.log('\nforEach (skips non-existent):');
sparseArray.forEach((num, i) => {
  console.log(`Index ${i}: ${num}`);
});

// Traditional for with undefined check
console.log('\nTraditional for with undefined check:');
for (let i = 0; i < sparseArray.length; i++) {
  if (sparseArray[i] === undefined) {
    console.log(`Index ${i}: skipped (undefined)`);
    continue;
  }
  console.log(`Index ${i}: ${sparseArray[i]}`);
}

// Check if index exists
console.log('\nChecking if index exists:');
for (let i = 0; i < sparseArray.length; i++) {
  if (!(i in sparseArray)) {
    console.log(`Index ${i}: doesn't exist`);
    continue;
  }
  console.log(`Index ${i}: ${sparseArray[i]}`);
}

console.log('\n=== 6. OTHER ITERATION METHODS ===\n');

// map() - transform elements
console.log('map() - double numbers:');
let nums = [1, 2, 3, 4, 5];
let doubled = nums.map((n) => n * 2);
console.log('Original:', nums);
console.log('Doubled:', doubled);

// filter() - select elements
console.log('\nfilter() - even numbers:');
let evens = nums.filter((n) => n % 2 === 0);
console.log('Even numbers:', evens);

// reduce() - accumulate value
console.log('\nreduce() - sum:');
let sum = nums.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

console.log('\nreduce() - product:');
let product = nums.reduce((acc, n) => acc * n, 1);
console.log('Product:', product);

// find() - first matching element
console.log('\nfind() - first number > 3:');
let found = nums.find((n) => n > 3);
console.log('Found:', found);

// findIndex() - index of first match
console.log('\nfindIndex() - index of first > 3:');
let foundIndex = nums.findIndex((n) => n > 3);
console.log('Index:', foundIndex);

// some() - test if any match
console.log('\nsome() - any number > 4?');
console.log(nums.some((n) => n > 4));

// every() - test if all match
console.log('\nevery() - all numbers > 0?');
console.log(nums.every((n) => n > 0));

console.log('\n=== 7. PRACTICAL EXAMPLES ===\n');

// Example 1: Processing user data
console.log('Example 1: User data processing');
let users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Diana', age: 28, active: true },
];

console.log('\nActive users:');
users.forEach((user) => {
  if (user.active) {
    console.log(`${user.name} (${user.age})`);
  }
});

// Example 2: Building HTML
console.log('\nExample 2: Building HTML list');
let items = ['Home', 'About', 'Contact'];
let html = '<ul>\n';
for (let item of items) {
  html += `  <li>${item}</li>\n`;
}
html += '</ul>';
console.log(html);

// Example 3: Finding and removing items
console.log('\nExample 3: Removing negative numbers');
let mixedNums = [1, -2, 3, -4, 5, -6];
console.log('Before:', mixedNums);

for (let i = mixedNums.length - 1; i >= 0; i--) {
  if (mixedNums[i] < 0) {
    mixedNums.splice(i, 1);
  }
}
console.log('After:', mixedNums);

// Example 4: Chaining array methods
console.log('\nExample 4: Method chaining');
let scores = [85, 92, 78, 95, 88, 73, 91];
let result = scores
  .filter((score) => score >= 80)
  .map((score) => score + 5) // Bonus points
  .reduce((sum, score) => sum + score, 0);

console.log(
  'Scores >= 80:',
  scores.filter((s) => s >= 80)
);
console.log(
  'With bonus:',
  scores.filter((s) => s >= 80).map((s) => s + 5)
);
console.log('Total:', result);

console.log('\n=== 8. COMPARISON OF METHODS ===\n');

let testArray = ['a', 'b', 'c', 'd', 'e'];

// Timing comparison (rough)
console.log('Processing array:', testArray);

console.time('for...of');
for (let item of testArray) {
  let temp = item.toUpperCase();
}
console.timeEnd('for...of');

console.time('forEach');
testArray.forEach((item) => {
  let temp = item.toUpperCase();
});
console.timeEnd('forEach');

console.time('for loop');
for (let i = 0; i < testArray.length; i++) {
  let temp = testArray[i].toUpperCase();
}
console.timeEnd('for loop');

console.log('\n=== 9. ADVANCED PATTERNS ===\n');

// Pattern 1: Early exit with for...of
console.log('Pattern 1: Finding first match');
let data = [10, 20, 30, 40, 50];
let target = 30;
let foundValue = null;

for (let value of data) {
  if (value === target) {
    foundValue = value;
    console.log(`Found ${target}!`);
    break;
  }
}

// Pattern 2: Building object from array
console.log('\nPattern 2: Array to object');
let pairs = [
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'NYC'],
];
let obj = {};

for (let [key, value] of pairs) {
  obj[key] = value;
}
console.log('Object:', obj);

// Pattern 3: Grouping data
console.log('\nPattern 3: Grouping by category');
let products = [
  { name: 'Apple', category: 'Fruit' },
  { name: 'Carrot', category: 'Vegetable' },
  { name: 'Banana', category: 'Fruit' },
  { name: 'Broccoli', category: 'Vegetable' },
];

let grouped = {};
products.forEach((product) => {
  if (!grouped[product.category]) {
    grouped[product.category] = [];
  }
  grouped[product.category].push(product.name);
});
console.log('Grouped:', grouped);

// Pattern 4: Parallel iteration
console.log('\nPattern 4: Iterating two arrays together');
let names = ['Alice', 'Bob', 'Charlie'];
let ages = [25, 30, 35];

for (let i = 0; i < Math.min(names.length, ages.length); i++) {
  console.log(`${names[i]} is ${ages[i]} years old`);
}

console.log('\n=== 10. COMMON PITFALLS ===\n');

// Pitfall 1: Modifying array during iteration (dangerous)
console.log('Pitfall 1: Modifying during iteration');
let arr1 = [1, 2, 3, 4, 5];
console.log('Original:', arr1);

// WRONG - skips elements
let wrong = [...arr1];
for (let i = 0; i < wrong.length; i++) {
  if (wrong[i] % 2 === 0) {
    wrong.splice(i, 1); // This shifts remaining elements
  }
}
console.log('Wrong result:', wrong); // Missed element 4!

// RIGHT - iterate backwards
let right = [...arr1];
for (let i = right.length - 1; i >= 0; i--) {
  if (right[i] % 2 === 0) {
    right.splice(i, 1);
  }
}
console.log('Correct result:', right);

// Pitfall 2: forEach cannot break
console.log('\nPitfall 2: Cannot break from forEach');
console.log('(Use for...of or for loop instead)');

// Pitfall 3: Accessing undefined indices
console.log('\nPitfall 3: Accessing out of bounds');
let small = [1, 2, 3];
console.log('small[10]:', small[10]); // undefined, not error

console.log('\n=== COMPLETE! ===');
console.log('All array iteration methods demonstrated successfully!');
