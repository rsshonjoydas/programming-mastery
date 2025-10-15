// =================================
// JAVASCRIPT ENUMERATING PROPERTIES
// =================================

console.log('=== 1. FOR/IN LOOP ===\n');

let o = { x: 1, y: 2, z: 3 };

console.log('Object:', o);
console.log('\nUsing for/in loop:');
for (let p in o) {
  console.log(`Property: ${p}, Value: ${o[p]}`);
}

// Checking enumerability
console.log('\nEnumerability checks:');
console.log("o.propertyIsEnumerable('x'):", o.propertyIsEnumerable('x'));
console.log(
  "o.propertyIsEnumerable('toString'):",
  o.propertyIsEnumerable('toString')
);

console.log('\n=== 2. FILTERING IN FOR/IN ===\n');

// Create object with prototype
let parent = { inherited: 'from parent' };
let child = Object.create(parent);
child.own1 = 'own property 1';
child.own2 = 'own property 2';
child.greet = function () {
  return 'Hello';
};

console.log('Child object with inherited properties:');
console.log('for/in (includes inherited):');
for (let p in child) {
  console.log(`  ${p}: ${child[p]}`);
}

console.log('\nSkipping inherited properties:');
for (let p in child) {
  if (!child.hasOwnProperty(p)) continue;
  console.log(`  ${p}: ${child[p]}`);
}

console.log('\nSkipping methods:');
for (let p in child) {
  if (typeof child[p] === 'function') continue;
  console.log(`  ${p}: ${child[p]}`);
}

console.log('\nSkipping both inherited and methods:');
for (let p in child) {
  if (!child.hasOwnProperty(p)) continue;
  if (typeof child[p] === 'function') continue;
  console.log(`  ${p}: ${child[p]}`);
}

console.log('\n=== 3. Object.keys() ===\n');

let obj = { a: 1, b: 2, c: 3 };
console.log('Object:', obj);
console.log('Object.keys(obj):', Object.keys(obj));

// Using with for/of
console.log('\nIterating with for/of:');
for (let key of Object.keys(obj)) {
  console.log(`${key}: ${obj[key]}`);
}

// Only enumerable own properties
let objWithNonEnum = { a: 1, b: 2 };
Object.defineProperty(objWithNonEnum, 'c', {
  value: 3,
  enumerable: false,
});
console.log("\nObject with non-enumerable property 'c':");
console.log('Object.keys():', Object.keys(objWithNonEnum));
console.log('Direct access to c:', objWithNonEnum.c);

console.log('\n=== 4. Object.getOwnPropertyNames() ===\n');

let obj2 = { a: 1, b: 2 };
Object.defineProperty(obj2, 'hidden', {
  value: 'secret',
  enumerable: false,
});

console.log('Object with hidden property:');
console.log('Object.keys():', Object.keys(obj2));
console.log('Object.getOwnPropertyNames():', Object.getOwnPropertyNames(obj2));
console.log('Hidden property value:', obj2.hidden);

console.log('\n=== 5. Object.getOwnPropertySymbols() ===\n');

let sym1 = Symbol('first');
let sym2 = Symbol('second');
let sym3 = Symbol('third');

let objWithSymbols = {
  regular: 'string property',
  [sym1]: 'symbol value 1',
  [sym2]: 'symbol value 2',
};

Object.defineProperty(objWithSymbols, sym3, {
  value: 'non-enumerable symbol',
  enumerable: false,
});

console.log('Object with Symbol properties:');
console.log('Object.keys():', Object.keys(objWithSymbols));
console.log(
  'Object.getOwnPropertySymbols():',
  Object.getOwnPropertySymbols(objWithSymbols)
);

console.log('\nAccessing Symbol properties:');
for (let sym of Object.getOwnPropertySymbols(objWithSymbols)) {
  console.log(`${sym.toString()}: ${objWithSymbols[sym]}`);
}

console.log('\n=== 6. Reflect.ownKeys() ===\n');

let sym = Symbol('test');
let comprehensiveObj = {
  a: 1,
  b: 2,
  [sym]: 'symbol value',
};

Object.defineProperty(comprehensiveObj, 'hidden', {
  value: 'hidden value',
  enumerable: false,
});

console.log('Object with all types of properties:');
console.log('Object.keys():', Object.keys(comprehensiveObj));
console.log(
  'Object.getOwnPropertyNames():',
  Object.getOwnPropertyNames(comprehensiveObj)
);
console.log(
  'Object.getOwnPropertySymbols():',
  Object.getOwnPropertySymbols(comprehensiveObj)
);
console.log('Reflect.ownKeys():', Reflect.ownKeys(comprehensiveObj));

console.log('\n=== 7. PROPERTY ENUMERATION ORDER ===\n');

// Array-like indices come first (numeric order)
let ordered = {
  z: 'last string',
  2: 'index 2',
  a: 'first string',
  1: 'index 1',
  0: 'index 0',
  m: 'middle string',
};

console.log('Object with mixed property names:');
console.log('Object.keys() order:', Object.keys(ordered));
console.log('\nNotice: numeric indices (0,1,2) come first in order,');
console.log('then string properties in insertion order (z,a,m)');

// With Symbols
let s1 = Symbol('first');
let s2 = Symbol('second');
let orderedWithSymbols = {
  normal: 'string',
  2: 'two',
  [s2]: 'symbol 2',
  1: 'one',
  [s1]: 'symbol 1',
  zebra: 'last',
};

console.log('\nWith Symbols:');
console.log('Reflect.ownKeys():', Reflect.ownKeys(orderedWithSymbols));
console.log('Order: numeric (1,2) → strings (normal,zebra) → Symbols');

console.log('\n=== 8. Object.values() and Object.entries() ===\n');

let person = {
  name: 'Alice',
  age: 30,
  city: 'New York',
};

console.log('Object:', person);
console.log('\nObject.values():', Object.values(person));
console.log('\nObject.entries():', Object.entries(person));

console.log('\nIterating with Object.entries():');
for (let [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`);
}

// Destructuring in loop
console.log('\nDestructuring in loop:');
for (let [k, v] of Object.entries(person)) {
  console.log(`Key="${k}" → Value="${v}"`);
}

console.log('\n=== 9. COMPARISON OF ALL METHODS ===\n');

let testObj = {
  a: 1,
  b: 2,
};

// Add non-enumerable property
Object.defineProperty(testObj, 'c', {
  value: 3,
  enumerable: false,
});

// Add Symbol property
let testSym = Symbol('test');
testObj[testSym] = 'symbol';

// Create prototype
let proto = { inherited: 'value' };
Object.setPrototypeOf(testObj, proto);

console.log('Test object with various property types:\n');

console.log('for/in loop:');
let forInProps = [];
for (let p in testObj) {
  forInProps.push(p);
}
console.log('  Result:', forInProps);

console.log('\nfor/in with hasOwnProperty:');
let ownForIn = [];
for (let p in testObj) {
  if (testObj.hasOwnProperty(p)) ownForIn.push(p);
}
console.log('  Result:', ownForIn);

console.log('\nObject.keys():', Object.keys(testObj));
console.log(
  'Object.getOwnPropertyNames():',
  Object.getOwnPropertyNames(testObj)
);
console.log(
  'Object.getOwnPropertySymbols():',
  Object.getOwnPropertySymbols(testObj)
);
console.log('Reflect.ownKeys():', Reflect.ownKeys(testObj));

console.log('\n=== 10. PRACTICAL EXAMPLES ===\n');

// Example 1: Copy own properties
console.log('Example 1: Copying own properties');
function copyOwnProperties(source, target = {}) {
  for (let key of Object.keys(source)) {
    target[key] = source[key];
  }
  return target;
}

let original = { x: 1, y: 2, z: 3 };
let copy = copyOwnProperties(original);
console.log('Original:', original);
console.log('Copy:', copy);
console.log('Are they the same object?', original === copy);

// Example 2: Count properties
console.log('\nExample 2: Counting properties');
function countProperties(obj, includeInherited = false) {
  if (includeInherited) {
    let count = 0;
    for (let p in obj) count++;
    return count;
  }
  return Object.keys(obj).length;
}

let countObj = Object.create({ inherited1: 1, inherited2: 2 });
countObj.own1 = 'a';
countObj.own2 = 'b';

console.log('Own properties:', countProperties(countObj, false));
console.log(
  'All properties (including inherited):',
  countProperties(countObj, true)
);

// Example 3: Filter object properties
console.log('\nExample 3: Filtering object properties');
function filterObject(obj, predicate) {
  let result = {};
  for (let [key, value] of Object.entries(obj)) {
    if (predicate(key, value)) {
      result[key] = value;
    }
  }
  return result;
}

let numbers = { a: 1, b: 2, c: 3, d: 4, e: 5 };
let evens = filterObject(numbers, (k, v) => v % 2 === 0);
let odds = filterObject(numbers, (k, v) => v % 2 !== 0);

console.log('Original:', numbers);
console.log('Even values:', evens);
console.log('Odd values:', odds);

// Example 4: Object to Map
console.log('\nExample 4: Converting object to Map');
function objectToMap(obj) {
  let map = new Map();
  for (let [key, value] of Object.entries(obj)) {
    map.set(key, value);
  }
  return map;
}

let objToConvert = { name: 'Alice', age: 30, city: 'NYC' };
let mapResult = objectToMap(objToConvert);
console.log('Original object:', objToConvert);
console.log('Converted Map:', mapResult);
console.log('Map size:', mapResult.size);

// Example 5: Merge objects
console.log('\nExample 5: Merging objects');
function mergeObjects(...objects) {
  let result = {};
  for (let obj of objects) {
    for (let key of Object.keys(obj)) {
      result[key] = obj[key];
    }
  }
  return result;
}

let obj1 = { a: 1, b: 2 };
let obj2 = { b: 3, c: 4 };
let obj3 = { c: 5, d: 6 };
let merged = mergeObjects(obj1, obj2, obj3);

console.log('obj1:', obj1);
console.log('obj2:', obj2);
console.log('obj3:', obj3);
console.log('Merged:', merged);

// Example 6: Get all properties including non-enumerable
console.log('\nExample 6: Get all own properties');
function getAllOwnProperties(obj) {
  return [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
}

let complexObj = { a: 1, b: 2 };
Object.defineProperty(complexObj, 'hidden', { value: 3, enumerable: false });
complexObj[Symbol('test')] = 'symbol';

console.log('All own properties:', getAllOwnProperties(complexObj));

// Example 7: Property summary
console.log('\nExample 7: Property summary');
function getPropertySummary(obj) {
  let enumerable = Object.keys(obj).length;
  let allStrings = Object.getOwnPropertyNames(obj).length;
  let symbols = Object.getOwnPropertySymbols(obj).length;
  let nonEnumerable = allStrings - enumerable;

  return {
    enumerable,
    nonEnumerable,
    symbols,
    total: allStrings + symbols,
  };
}

console.log('Summary for complexObj:', getPropertySummary(complexObj));

console.log('\n=== 11. COMMON PATTERNS ===\n');

console.log('Pattern 1: Safe iteration over own properties');
let safeObj = { x: 1, y: 2, z: 3 };

console.log('Method A - Object.keys():');
for (let key of Object.keys(safeObj)) {
  console.log(`  ${key}: ${safeObj[key]}`);
}

console.log('Method B - for/in with hasOwnProperty:');
for (let key in safeObj) {
  if (safeObj.hasOwnProperty(key)) {
    console.log(`  ${key}: ${safeObj[key]}`);
  }
}

console.log('\nPattern 2: Get all properties including inherited');
function getAllProperties(obj) {
  let props = [];
  for (let key in obj) {
    props.push(key);
  }
  return props;
}

let withInheritance = Object.create({ inherited: 'yes' });
withInheritance.own = 'property';
console.log(
  'All properties (own + inherited):',
  getAllProperties(withInheritance)
);

console.log('\n=== 12. PERFORMANCE COMPARISON ===\n');

let largeObj = {};
for (let i = 0; i < 1000; i++) {
  largeObj[`prop${i}`] = i;
}

console.log('Testing with 1000 properties...\n');

console.time('for/in');
let count1 = 0;
for (let p in largeObj) {
  if (largeObj.hasOwnProperty(p)) count1++;
}
console.timeEnd('for/in');

console.time('Object.keys()');
let count2 = Object.keys(largeObj).length;
console.timeEnd('Object.keys()');

console.time('Object.keys() with for/of');
let count3 = 0;
for (let key of Object.keys(largeObj)) {
  count3++;
}
console.timeEnd('Object.keys() with for/of');

console.log(`\nAll methods counted ${count1} properties`);

console.log('\n=== COMPLETE! ===');
console.log('All property enumeration methods demonstrated successfully!');
