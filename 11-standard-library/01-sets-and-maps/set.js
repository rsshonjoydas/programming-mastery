// ====================
// JAVASCRIPT SET CLASS
// ====================

console.log('=== 1. CREATING SETS ===\n');

// Empty set
let s = new Set();
console.log('Empty set:', s);
console.log('Size:', s.size); // 0

// Set from array
let t = new Set([1, 2, 3, 4, 5]);
console.log('\nSet from array:', t);
console.log('Size:', t.size); // 5

// Set from another set (copy)
let u = new Set(t);
console.log('\nCopied set:', u);
console.log('u === t?', u === t); // false (different objects)

// Set from string (unique characters)
let unique = new Set('Mississippi');
console.log("\nSet from 'Mississippi':", unique);
console.log('Unique characters:', [...unique]); // ['M', 'i', 's', 'p']
console.log('Size:', unique.size); // 4

console.log('\n=== 2. ADDING AND REMOVING ELEMENTS ===\n');

let mySet = new Set();
console.log('Initial size:', mySet.size); // 0

// Adding elements
mySet.add(1);
console.log('After add(1), size:', mySet.size); // 1

// Adding duplicate (no effect)
mySet.add(1);
console.log('After add(1) again, size:', mySet.size); // 1 (no change)

// Adding different types
mySet.add(true);
mySet.add('hello');
mySet.add(null);
mySet.add(undefined);
console.log('After adding various types:', mySet);
console.log('Size:', mySet.size); // 5

// Adding objects/arrays
mySet.add([1, 2, 3]);
mySet.add({ name: 'John' });
console.log('After adding array and object, size:', mySet.size); // 7

// Method chaining
let chained = new Set();
chained.add('a').add('b').add('c').add('d');
console.log('\nChained additions:', chained);

// Deleting elements
console.log('\nDeleting elements:');
console.log('delete(1):', mySet.delete(1)); // true
console.log('Size after deletion:', mySet.size); // 6
console.log("delete('test'):", mySet.delete('test')); // false (not in set)

// Cannot delete array by value (different reference)
console.log('delete([1, 2, 3]):', mySet.delete([1, 2, 3])); // false
console.log('Size:', mySet.size); // 6 (array still in set)

// Clear all elements
mySet.clear();
console.log('After clear(), size:', mySet.size); // 0

console.log('\n=== 3. STRICT EQUALITY (===) ===\n');

let equalitySet = new Set();

// Numbers and strings are different
equalitySet.add(1);
equalitySet.add('1');
console.log("Set with 1 and '1':", equalitySet);
console.log('Size:', equalitySet.size); // 2

// NaN is treated as equal to NaN (special case)
equalitySet.add(NaN);
equalitySet.add(NaN);
console.log('After adding NaN twice, size:', equalitySet.size); // 3 (only one NaN)

// Objects are compared by reference
let obj1 = { x: 1 };
let obj2 = { x: 1 };
equalitySet.add(obj1);
equalitySet.add(obj2);
console.log(
  'After adding two objects with same content, size:',
  equalitySet.size
); // 5 (different references)

// Same reference works
equalitySet.add(obj1);
console.log('After adding obj1 again, size:', equalitySet.size); // 5 (no change)

console.log('\n=== 4. MEMBERSHIP TESTING ===\n');

let primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);

console.log('Testing membership:');
console.log('has(2):', primes.has(2)); // true
console.log('has(4):', primes.has(4)); // false
console.log('has(7):', primes.has(7)); // true
console.log("has('7'):", primes.has('7')); // false (type matters)

// Performance comparison
console.log('\nPerformance note:');
console.log('Set.has() is O(1) - constant time, very fast!');
console.log(
  'Array.includes() is O(n) - linear time, slower for large collections'
);

console.log('\n=== 5. ITERATING SETS ===\n');

let numbers = new Set([10, 20, 30, 40, 50]);

// for...of loop
console.log('Using for...of:');
for (let num of numbers) {
  console.log(num);
}

// Spread operator
console.log('\nUsing spread operator:');
console.log('Array:', [...numbers]);
console.log('Max value:', Math.max(...numbers));
console.log('Min value:', Math.min(...numbers));

// forEach method
console.log('\nUsing forEach:');
let sum = 0;
numbers.forEach((n) => {
  sum += n;
  console.log(`Adding ${n}, sum is now ${sum}`);
});
console.log('Total sum:', sum);

// forEach receives value twice (no index in sets)
console.log('\nforEach parameters:');
numbers.forEach((value, key, set) => {
  console.log(`value: ${value}, key: ${key}, same: ${value === key}`);
});

console.log('\n=== 6. INSERTION ORDER ===\n');

let ordered = new Set();
ordered.add(3);
ordered.add(1);
ordered.add(4);
ordered.add(1); // Duplicate, ignored
ordered.add(5);
ordered.add(9);

console.log('Insertion order is preserved:');
console.log([...ordered]); // [3, 1, 4, 5, 9] - order maintained

console.log('\n=== 7. PRACTICAL EXAMPLES ===\n');

// Example 1: Remove duplicates from array
console.log('Example 1: Remove duplicates');
let arrayWithDuplicates = [1, 2, 2, 3, 4, 4, 4, 5, 1];
let uniqueArray = [...new Set(arrayWithDuplicates)];
console.log('Original:', arrayWithDuplicates);
console.log('Unique:', uniqueArray);

// Example 2: Check if arrays have common elements
console.log('\nExample 2: Common elements');
function hasCommonElements(arr1, arr2) {
  let set1 = new Set(arr1);
  return arr2.some((item) => set1.has(item));
}
console.log(
  'hasCommonElements([1,2,3], [4,5,6]):',
  hasCommonElements([1, 2, 3], [4, 5, 6])
);
console.log(
  'hasCommonElements([1,2,3], [3,4,5]):',
  hasCommonElements([1, 2, 3], [3, 4, 5])
);

// Example 3: Set operations (union, intersection, difference)
console.log('\nExample 3: Set operations');
let setA = new Set([1, 2, 3, 4, 5]);
let setB = new Set([4, 5, 6, 7, 8]);

// Union
let union = new Set([...setA, ...setB]);
console.log('Union:', [...union]);

// Intersection
let intersection = new Set([...setA].filter((x) => setB.has(x)));
console.log('Intersection:', [...intersection]);

// Difference (A - B)
let difference = new Set([...setA].filter((x) => !setB.has(x)));
console.log('Difference (A-B):', [...difference]);

// Example 4: Track unique visitors
console.log('\nExample 4: Unique visitors');
let visitors = new Set();

function recordVisit(userId) {
  visitors.add(userId);
  console.log(
    `User ${userId} visited. Total unique visitors: ${visitors.size}`
  );
}

recordVisit('user1');
recordVisit('user2');
recordVisit('user1'); // Duplicate
recordVisit('user3');
console.log('All unique visitors:', [...visitors]);

// Example 5: Valid characters in password
console.log('\nExample 5: Password validation');
function hasValidChars(password) {
  let allowedChars = new Set(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  );
  return [...password].every((char) => allowedChars.has(char));
}

console.log("hasValidChars('Hello123'):", hasValidChars('Hello123'));
console.log("hasValidChars('Hello<script>'):", hasValidChars('Hello<script>'));

// Example 6: Count unique words
console.log('\nExample 6: Unique word counter');
function countUniqueWords(text) {
  let words = text.toLowerCase().match(/\b\w+\b/g) || [];
  return new Set(words).size;
}

let text =
  'The quick brown fox jumps over the lazy dog. The dog was very lazy.';
console.log('Text:', text);
console.log('Unique words:', countUniqueWords(text));

console.log('\n=== 8. CONVERTING BETWEEN SET AND ARRAY ===\n');

// Set to Array
let mySet2 = new Set([1, 2, 3, 4, 5]);
let array1 = [...mySet2];
let array2 = Array.from(mySet2);
console.log('Set to Array (spread):', array1);
console.log('Set to Array (Array.from):', array2);

// Array to Set (with transformation)
let numbers2 = [1, 2, 3, 4, 5];
let squaredSet = new Set(numbers2.map((n) => n * n));
console.log('Squared numbers set:', [...squaredSet]);

console.log('\n=== 9. SET WITH OBJECTS ===\n');

let users = new Set();
let user1 = { id: 1, name: 'Alice' };
let user2 = { id: 2, name: 'Bob' };
let user3 = { id: 1, name: 'Alice' }; // Same content as user1

users.add(user1);
users.add(user2);
users.add(user3); // Different reference, so it's added

console.log('Users set size:', users.size); // 3 (all three added)

// To check if user already exists, need to do manual comparison
function addUserIfNotExists(usersSet, newUser) {
  for (let user of usersSet) {
    if (user.id === newUser.id) {
      console.log(`User with id ${newUser.id} already exists`);
      return false;
    }
  }
  usersSet.add(newUser);
  console.log(`Added user: ${newUser.name}`);
  return true;
}

let users2 = new Set();
addUserIfNotExists(users2, { id: 1, name: 'Alice' });
addUserIfNotExists(users2, { id: 2, name: 'Bob' });
addUserIfNotExists(users2, { id: 1, name: 'Charlie' }); // Same id

console.log('\n=== COMPLETE! ===');
console.log('All Set operations demonstrated successfully!');
