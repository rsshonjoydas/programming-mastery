// ============================================
// IMMUTABLE PRIMITIVES vs MUTABLE OBJECTS
// ============================================

console.log('=== PRIMITIVE IMMUTABILITY ===\n');

// Numbers and Booleans - Obviously Immutable
let x = 5;
x = 10; // This REPLACES x, doesn't change the number 5
console.log('Number reassignment:', x); // 10

let flag = true;
flag = false; // REPLACES the value, doesn't change true
console.log('Boolean reassignment:', flag); // false

// Strings - Less Obvious Immutability
console.log('\n--- String Immutability ---');
let s = 'hello';
console.log('Original string:', s); // "hello"

let upper = s.toUpperCase();
console.log('After toUpperCase():', s); // Still "hello" (unchanged!)
console.log('Returned value:', upper); // "HELLO" (new string)

// All string methods return NEW strings
let str = 'hello';
str.toUpperCase(); // Returns "HELLO", str unchanged
str.toLowerCase(); // Returns "hello", str unchanged
str.replace('h', 'H'); // Returns "Hello", str unchanged
str.concat(' world'); // Returns "hello world", str unchanged
console.log('After multiple method calls:', str); // Still "hello"

// Cannot modify individual characters
str[0] = 'H'; // Fails silently (or throws in strict mode)
console.log('After trying to modify character:', str); // Still "hello"

// To "change" a string, reassign it
let greeting = 'hello';
greeting = greeting.toUpperCase();
console.log('After reassignment:', greeting); // "HELLO"

// ============================================
console.log('\n=== PRIMITIVES COMPARED BY VALUE ===\n');

// Numbers, booleans, null, undefined
console.log('5 === 5:', 5 === 5); // true
console.log('true === true:', true === true); // true
console.log('null === null:', null === null); // true
console.log('undefined === undefined:', undefined === undefined); // true

// Strings compared by content
let a = 'hello';
let b = 'hello';
console.log('"hello" === "hello":', a === b); // true

let c = 'test';
let d = 'Test';
console.log('"test" === "Test":', c === d); // false

let e = 'abc';
let f = 'ab' + 'c';
console.log('"abc" === "ab" + "c":', e === f); // true

// ============================================
console.log('\n=== OBJECT MUTABILITY ===\n');

// Objects are mutable
let obj = { x: 1 };
console.log('Original object:', obj); // { x: 1 }

obj.x = 2; // Mutate property
console.log('After changing x:', obj); // { x: 2 }

obj.y = 3; // Add new property
console.log('After adding y:', obj); // { x: 2, y: 3 }

// Arrays are mutable
let arr = [1, 2, 3];
console.log('\nOriginal array:', arr); // [1, 2, 3]

arr[0] = 0; // Change element
console.log('After changing element:', arr); // [0, 2, 3]

arr[3] = 4; // Add element
console.log('After adding element:', arr); // [0, 2, 3, 4]

arr.push(5); // Mutate with method
console.log('After push:', arr); // [0, 2, 3, 4, 5]

// ============================================
console.log('\n=== OBJECTS COMPARED BY REFERENCE ===\n');

// Distinct objects with same content are NOT equal
let obj1 = { x: 1 };
let obj2 = { x: 1 };
console.log('{ x: 1 } === { x: 1 }:', obj1 === obj2); // false

// Distinct arrays with same elements are NOT equal
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];
console.log('[1,2,3] === [1,2,3]:', arr1 === arr2); // false

// Empty arrays are also different
let emptyA = [];
let emptyB = [];
console.log('[] === []:', emptyA === emptyB); // false

// ============================================
console.log('\n=== HOW REFERENCES WORK ===\n');

let original = [1, 2, 3];
let reference = original; // reference points to SAME array

console.log('original:', original); // [1, 2, 3]
console.log('reference:', reference); // [1, 2, 3]

reference[0] = 99; // Modify through reference
console.log('\nAfter modifying reference[0]:');
console.log('original:', original); // [99, 2, 3] - CHANGED!
console.log('reference:', reference); // [99, 2, 3]

console.log('original === reference:', original === reference); // true

// ============================================
console.log('\n=== ASSIGNMENT BEHAVIOR ===\n');

// Primitives: Copy by Value
console.log('--- Primitives ---');
let num1 = 5;
let num2 = num1; // num2 gets COPY of value
num1 = 10; // Changing num1 doesn't affect num2
console.log('num1:', num1); // 10
console.log('num2:', num2); // 5 (unchanged)

// Objects: Copy by Reference
console.log('\n--- Objects ---');
let objA = { value: 5 };
let objB = objA; // objB gets REFERENCE (not copy!)
objA.value = 10; // Changing through objA
console.log('objA.value:', objA.value); // 10
console.log('objB.value:', objB.value); // 10 (same object!)

// ============================================
console.log('\n=== COPYING OBJECTS AND ARRAYS ===\n');

// Manual copying with loop
console.log('--- Manual Loop Copy ---');
let source = ['a', 'b', 'c'];
let manual = [];
for (let i = 0; i < source.length; i++) {
  manual[i] = source[i];
}
source[0] = 'CHANGED';
console.log('source:', source); // ["CHANGED", "b", "c"]
console.log('manual:', manual); // ["a", "b", "c"] - unchanged

// Array.from()
console.log('\n--- Array.from() ---');
let arr3 = [1, 2, 3];
let copy1 = Array.from(arr3);
arr3[0] = 99;
console.log('arr3:', arr3); // [99, 2, 3]
console.log('copy1:', copy1); // [1, 2, 3] - unchanged

// Spread operator (arrays)
console.log('\n--- Spread Operator (Arrays) ---');
let arr4 = [1, 2, 3];
let copy2 = [...arr4];
arr4[0] = 99;
console.log('arr4:', arr4); // [99, 2, 3]
console.log('copy2:', copy2); // [1, 2, 3] - unchanged

// slice()
console.log('\n--- slice() ---');
let arr5 = [1, 2, 3];
let copy3 = arr5.slice();
arr5[0] = 99;
console.log('arr5:', arr5); // [99, 2, 3]
console.log('copy3:', copy3); // [1, 2, 3] - unchanged

// Object.assign()
console.log('\n--- Object.assign() ---');
let obj3 = { x: 1, y: 2 };
let objCopy1 = Object.assign({}, obj3);
obj3.x = 99;
console.log('obj3:', obj3); // { x: 99, y: 2 }
console.log('objCopy1:', objCopy1); // { x: 1, y: 2 } - unchanged

// Spread operator (objects)
console.log('\n--- Spread Operator (Objects) ---');
let obj4 = { x: 1, y: 2 };
let objCopy2 = { ...obj4 };
obj4.x = 99;
console.log('obj4:', obj4); // { x: 99, y: 2 }
console.log('objCopy2:', objCopy2); // { x: 1, y: 2 } - unchanged

// Shallow copy caveat - nested objects are still references!
console.log('\n--- Shallow Copy Caveat ---');
let nested = { a: 1, inner: { b: 2 } };
let shallowCopy = { ...nested };
shallowCopy.inner.b = 99;
console.log('nested.inner.b:', nested.inner.b); // 99 - CHANGED!
console.log('shallowCopy.inner.b:', shallowCopy.inner.b); // 99

// ============================================
console.log('\n=== COMPARING OBJECTS AND ARRAYS ===\n');

// Function to compare arrays (from document)
function equalArrays(a, b) {
  if (a === b) return true; // Identical arrays are equal
  if (a.length !== b.length) return false; // Different-size arrays not equal
  for (let i = 0; i < a.length; i++) {
    // Loop through all elements
    if (a[i] !== b[i]) return false; // If any differ, arrays not equal
  }
  return true; // Otherwise they are equal
}

let arrX = [1, 2, 3];
let arrY = [1, 2, 3];
let arrZ = arrX;

console.log('arrX === arrY:', arrX === arrY); // false (different references)
console.log('equalArrays(arrX, arrY):', equalArrays(arrX, arrY)); // true (same content)
console.log('arrX === arrZ:', arrX === arrZ); // true (same reference)

// Function to compare objects
function equalObjects(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  let keysA = Object.keys(a);
  let keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (a[key] !== b[key]) return false;
  }

  return true;
}

let objX = { x: 1, y: 2 };
let objY = { x: 1, y: 2 };
let objZ = objX;

console.log('\nobjX === objY:', objX === objY); // false (different references)
console.log('equalObjects(objX, objY):', equalObjects(objX, objY)); // true (same content)
console.log('objX === objZ:', objX === objZ); // true (same reference)

// ============================================
console.log('\n=== FUNCTION PARAMETERS ===\n');

// Primitives: Pass by Value
function changePrimitive(x) {
  x = 100; // Only changes local copy
  console.log('Inside function:', x); // 100
}

let num = 5;
changePrimitive(num);
console.log('Outside function:', num); // 5 (unchanged)

// Objects: Pass by Reference
function changeObject(obj) {
  obj.value = 100; // Modifies actual object
  console.log('Inside function:', obj.value); // 100
}

let myObj = { value: 5 };
console.log('\nBefore function:', myObj.value); // 5
changeObject(myObj);
console.log('After function:', myObj.value); // 100 (changed!)

// Reassigning parameter doesn't affect original
function replaceObject(obj) {
  obj = { value: 999 }; // Creates new object locally
  console.log('Inside function:', obj.value); // 999
}

let myObj2 = { value: 5 };
console.log('\nBefore function:', myObj2.value); // 5
replaceObject(myObj2);
console.log('After function:', myObj2.value); // 5 (unchanged!)

// ============================================
console.log('\n=== AVOIDING UNINTENDED MUTATIONS ===\n');

// BAD: Function mutates input
function addItemBad(arr, item) {
  arr.push(item); // Modifies original!
  return arr;
}

let originalBad = [1, 2, 3];
console.log('Before addItemBad:', originalBad); // [1, 2, 3]
let modifiedBad = addItemBad(originalBad, 4);
console.log('After addItemBad:', originalBad); // [1, 2, 3, 4] - MUTATED!

// GOOD: Function returns new array
function addItemGood(arr, item) {
  return [...arr, item]; // Creates new array
}

let originalGood = [1, 2, 3];
console.log('\nBefore addItemGood:', originalGood); // [1, 2, 3]
let modifiedGood = addItemGood(originalGood, 4);
console.log('After addItemGood:', originalGood); // [1, 2, 3] - unchanged
console.log('Returned array:', modifiedGood); // [1, 2, 3, 4]

// ============================================
console.log('\n=== CONST WITH OBJECTS ===\n');

// const prevents reassignment, NOT mutation
const constArr = [1, 2, 3];
constArr.push(4); // Allowed! Mutates the array
console.log('After push:', constArr); // [1, 2, 3, 4]

try {
  constArr = [5, 6, 7]; // Error! Cannot reassign
} catch (e) {
  console.log('Cannot reassign const array:', e.message);
}

const constObj = { x: 1 };
constObj.x = 2; // Allowed! Mutates the object
constObj.y = 3; // Allowed! Adds property
console.log('\nAfter mutations:', constObj); // { x: 2, y: 3 }

try {
  constObj = { x: 99 }; // Error! Cannot reassign
} catch (e) {
  console.log('Cannot reassign const object:', e.message);
}

// ============================================
console.log('\n=== PRACTICAL EXAMPLE: Shopping Cart ===\n');

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // BAD: Mutates external array
  addItemsMutating(newItems) {
    this.items = newItems; // Direct assignment (shares reference!)
  }

  // GOOD: Creates copy
  addItemsSafe(newItems) {
    this.items = [...newItems]; // Copy array
  }
}

let externalItems = ['apple', 'banana'];
let cart1 = new ShoppingCart();
cart1.addItemsMutating(externalItems);

externalItems.push('orange'); // Modify external array
console.log('cart1.items:', cart1.items); // ["apple", "banana", "orange"] - AFFECTED!

let externalItems2 = ['apple', 'banana'];
let cart2 = new ShoppingCart();
cart2.addItemsSafe(externalItems2);

externalItems2.push('orange'); // Modify external array
console.log('cart2.items:', cart2.items); // ["apple", "banana"] - SAFE!

// ============================================
console.log('\n=== SUMMARY ===');
console.log('✓ Primitives are immutable - cannot be changed');
console.log('✓ Objects are mutable - properties/elements can change');
console.log('✓ Primitives compared by value (content)');
console.log('✓ Objects compared by reference (identity)');
console.log('✓ Assignment copies references for objects');
console.log('✓ Must explicitly copy objects/arrays');
console.log('✓ Must manually compare object content');
console.log('✓ const prevents reassignment, not mutation');
