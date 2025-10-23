// ====================
// JAVASCRIPT MAP CLASS
// ====================

console.log('=== 1. CREATING MAPS ===\n');

// Empty map
let m = new Map();
console.log('Empty map:', m);
console.log('Size:', m.size); // 0

// Map from array of [key, value] pairs
let n = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
]);
console.log('\nMap from array:', n);
console.log('Size:', n.size); // 3

// Copying a map
let copy = new Map(n);
console.log('\nCopied map:', copy);
console.log('copy === n?', copy === n); // false

// Map from object entries
let obj = { x: 1, y: 2, z: 3 };
let p = new Map(Object.entries(obj));
console.log('\nMap from object:', p);
console.log('Size:', p.size); // 3

console.log('\n=== 2. SETTING AND GETTING VALUES ===\n');

let myMap = new Map();

// Setting key-value pairs
myMap.set('name', 'Alice');
myMap.set('age', 30);
myMap.set('city', 'New York');
console.log('After setting values:', myMap);
console.log('Size:', myMap.size); // 3

// Getting values
console.log('\nGetting values:');
console.log("get('name'):", myMap.get('name')); // "Alice"
console.log("get('age'):", myMap.get('age')); // 30
console.log("get('country'):", myMap.get('country')); // undefined

// Updating existing key
myMap.set('age', 31);
console.log('\nAfter updating age:', myMap.get('age')); // 31
console.log('Size:', myMap.size); // 3 (no change)

// Method chaining
let chained = new Map().set('a', 1).set('b', 2).set('c', 3);
console.log('\nChained map:', chained);

console.log('\n=== 3. MAP METHODS ===\n');

let testMap = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
  ['key3', 'value3'],
]);

// has() - check if key exists
console.log("has('key1'):", testMap.has('key1')); // true
console.log("has('key4'):", testMap.has('key4')); // false

// delete() - remove key-value pair
console.log("\ndelete('key2'):", testMap.delete('key2')); // true
console.log('Size after delete:', testMap.size); // 2
console.log("delete('key4'):", testMap.delete('key4')); // false

// clear() - remove all
testMap.clear();
console.log('Size after clear():', testMap.size); // 0

console.log('\n=== 4. ANY TYPE AS KEY ===\n');

let anyKeyMap = new Map();

// Primitive keys
anyKeyMap.set('string', 'String key');
anyKeyMap.set(42, 'Number key');
anyKeyMap.set(true, 'Boolean key');
anyKeyMap.set(null, 'Null key');
anyKeyMap.set(undefined, 'Undefined key');
anyKeyMap.set(NaN, 'NaN key');

console.log('Map with various primitive keys:');
console.log('Size:', anyKeyMap.size); // 6

console.log('\nGetting values:');
console.log('get(42):', anyKeyMap.get(42));
console.log('get(true):', anyKeyMap.get(true));
console.log('get(NaN):', anyKeyMap.get(NaN)); // Works correctly!

// Object and array keys
let objKey = { id: 1 };
let arrKey = [1, 2, 3];
let funcKey = function () {};

anyKeyMap.set(objKey, 'Object key');
anyKeyMap.set(arrKey, 'Array key');
anyKeyMap.set(funcKey, 'Function key');

console.log('\nWith object/array/function keys:');
console.log('Size:', anyKeyMap.size); // 9
console.log('get(objKey):', anyKeyMap.get(objKey));
console.log('get(arrKey):', anyKeyMap.get(arrKey));

console.log('\n=== 5. KEY COMPARISON BY IDENTITY ===\n');

let identityMap = new Map();

// Same content, different objects
let obj1 = { x: 1 };
let obj2 = { x: 1 };

identityMap.set(obj1, 'First object');
identityMap.set(obj2, 'Second object');

console.log('Size:', identityMap.size); // 2 (different references)
console.log('get(obj1):', identityMap.get(obj1)); // "First object"
console.log('get(obj2):', identityMap.get(obj2)); // "Second object"
console.log('get({x: 1}):', identityMap.get({ x: 1 })); // undefined (new reference)

// Using map as its own key
let selfMap = new Map();
selfMap.set(selfMap, 'Map as key');
console.log('\nMap as its own key:');
console.log('has(selfMap):', selfMap.has(selfMap)); // true
console.log('get(selfMap):', selfMap.get(selfMap)); // "Map as key"

console.log('\n=== 6. ITERATING MAPS ===\n');

let fruits = new Map([
  ['apple', 5],
  ['banana', 3],
  ['orange', 7],
  ['grape', 12],
]);

// for...of with destructuring
console.log('Using for...of:');
for (let [fruit, count] of fruits) {
  console.log(`${fruit}: ${count}`);
}

// Spread operator
console.log('\nUsing spread operator:');
console.log('Array of entries:', [...fruits]);

// keys() method
console.log('\nIterating keys:');
for (let key of fruits.keys()) {
  console.log(key);
}
console.log('All keys:', [...fruits.keys()]);

// values() method
console.log('\nIterating values:');
for (let value of fruits.values()) {
  console.log(value);
}
console.log('All values:', [...fruits.values()]);

// entries() method (same as iterating map directly)
console.log('\nIterating entries:');
for (let entry of fruits.entries()) {
  console.log(entry);
}

// forEach method (note: value comes before key!)
console.log('\nUsing forEach:');
fruits.forEach((value, key, map) => {
  console.log(`${key} => ${value} (map size: ${map.size})`);
});

console.log('\n=== 7. INSERTION ORDER ===\n');

let ordered = new Map();
ordered.set('z', 26);
ordered.set('a', 1);
ordered.set('m', 13);
ordered.set('c', 3);

console.log('Insertion order is preserved:');
console.log('Keys:', [...ordered.keys()]); // ["z", "a", "m", "c"]

console.log('\n=== 8. PRACTICAL EXAMPLES ===\n');

// Example 1: Frequency counter
console.log('Example 1: Character frequency counter');
function charFrequency(str) {
  let freq = new Map();
  for (let char of str.toLowerCase()) {
    if (char.match(/[a-z]/)) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }
  }
  return freq;
}

let text = 'Hello World';
let frequency = charFrequency(text);
console.log("Character frequencies in 'Hello World':");
for (let [char, count] of frequency) {
  console.log(`'${char}': ${count}`);
}

// Example 2: Caching function results
console.log('\nExample 2: Function result caching');
let cache = new Map();

function expensiveOperation(n) {
  if (cache.has(n)) {
    console.log(`Cache hit for ${n}`);
    return cache.get(n);
  }

  console.log(`Computing for ${n}...`);
  let result = n * n; // Simulate expensive computation
  cache.set(n, result);
  return result;
}

console.log('Result:', expensiveOperation(5));
console.log('Result:', expensiveOperation(5)); // Cache hit
console.log('Result:', expensiveOperation(10));

// Example 3: Group array items
console.log('\nExample 3: Grouping data');
let students = [
  { name: 'Alice', grade: 'A' },
  { name: 'Bob', grade: 'B' },
  { name: 'Charlie', grade: 'A' },
  { name: 'David', grade: 'C' },
  { name: 'Eve', grade: 'B' },
];

function groupBy(array, key) {
  let grouped = new Map();
  for (let item of array) {
    let groupKey = item[key];
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey).push(item);
  }
  return grouped;
}

let byGrade = groupBy(students, 'grade');
console.log('Students grouped by grade:');
for (let [grade, students] of byGrade) {
  console.log(`${grade}: ${students.map((s) => s.name).join(', ')}`);
}

// Example 4: LRU Cache (basic implementation)
console.log('\nExample 4: Simple LRU Cache');
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    let value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Remove oldest if at capacity
    if (this.cache.size >= this.capacity) {
      let firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      console.log(`Evicted: ${firstKey}`);
    }

    this.cache.set(key, value);
  }

  display() {
    console.log('Cache contents:', [...this.cache.keys()]);
  }
}

let lru = new LRUCache(3);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
lru.display();
lru.set('d', 4); // Should evict "a"
lru.display();
lru.get('b'); // Move "b" to end
lru.set('e', 5); // Should evict "c"
lru.display();

// Example 5: Two-way lookup
console.log('\nExample 5: Bidirectional map');
class BiMap {
  constructor() {
    this.keyToValue = new Map();
    this.valueToKey = new Map();
  }

  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }

  getByKey(key) {
    return this.keyToValue.get(key);
  }

  getByValue(value) {
    return this.valueToKey.get(value);
  }
}

let countries = new BiMap();
countries.set('US', 'United States');
countries.set('UK', 'United Kingdom');
countries.set('FR', 'France');

console.log('Code to name:', countries.getByKey('US'));
console.log('Name to code:', countries.getByValue('France'));

console.log('\n=== 9. MAP VS OBJECT ===\n');

console.log('Map advantages:');
console.log('✓ Keys can be any type (not just strings)');
console.log('✓ Guaranteed insertion order');
console.log('✓ Easy to get size with .size property');
console.log('✓ Better performance for frequent additions/deletions');
console.log('✓ No prototype pollution issues');
console.log('✓ Directly iterable');

console.log('\nObject advantages:');
console.log('✓ JSON serialization with JSON.stringify()');
console.log('✓ More compact literal syntax');
console.log('✓ Property access syntax (obj.prop)');

console.log('\n=== 10. CONVERTING BETWEEN MAP AND OBJECT ===\n');

// Map to Object
let map = new Map([
  ['name', 'Alice'],
  ['age', 30],
  ['city', 'NYC'],
]);

let objFromMap = Object.fromEntries(map);
console.log('Map to Object:', objFromMap);

// Object to Map
let obj3 = { a: 1, b: 2, c: 3 };
let mapFromObj = new Map(Object.entries(obj3));
console.log('Object to Map:', mapFromObj);

console.log('\n=== COMPLETE! ===');
console.log('All Map operations demonstrated successfully!');
