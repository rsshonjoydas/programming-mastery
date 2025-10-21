// ========================
// JAVASCRIPT WEAKMAP CLASS
// ========================

console.log('=== 1. WHAT IS WEAKMAP? ===\n');

console.log('WeakMap is a variant of Map with key differences:');
console.log('✓ Keys must be objects or arrays (not primitives)');
console.log('✓ Weak references - allows garbage collection');
console.log('✓ Not iterable (no forEach, keys(), values(), entries())');
console.log('✓ No size property');
console.log('✓ Only has: get(), set(), has(), delete()');
console.log(
  '\nPurpose: Associate data with objects without preventing garbage collection'
);

console.log('\n=== 2. CREATING WEAKMAP ===\n');

// Empty WeakMap
let wm = new WeakMap();
console.log('Empty WeakMap created:', wm);

// Initialize with entries
let obj1 = { id: 1 };
let obj2 = { id: 2 };

let wm2 = new WeakMap([
  [obj1, 'data for obj1'],
  [obj2, 'data for obj2'],
]);
console.log('WeakMap initialized with entries');

console.log('\n=== 3. BASIC OPERATIONS ===\n');

let weakMap = new WeakMap();

// Keys must be objects
let key1 = { name: 'Alice' };
let key2 = [];
let key3 = function () {};

// set() - add key-value pairs
weakMap.set(key1, 'metadata for Alice');
weakMap.set(key2, 'array metadata');
weakMap.set(key3, 'function metadata');
console.log('Added three entries to WeakMap');

// get() - retrieve values
console.log('\nGetting values:');
console.log('get(key1):', weakMap.get(key1));
console.log('get(key2):', weakMap.get(key2));
console.log('get(key3):', weakMap.get(key3));

// has() - check if key exists
console.log('\nChecking existence:');
console.log('has(key1):', weakMap.has(key1)); // true
console.log('has({}):', weakMap.has({})); // false (different reference)

// delete() - remove entry
console.log('\nDeleting entry:');
console.log('delete(key1):', weakMap.delete(key1)); // true
console.log('has(key1):', weakMap.has(key1)); // false

console.log('\n=== 4. KEY RESTRICTIONS ===\n');

let wm3 = new WeakMap();

// Valid keys (objects and arrays)
try {
  wm3.set({ x: 1 }, 'object key');
  wm3.set([1, 2, 3], 'array key');
  wm3.set(new Date(), 'date key');
  console.log('✓ Objects and arrays work as keys');
} catch (e) {
  console.log('✗ Error:', e.message);
}

// Invalid keys (primitives)
console.log('\nTrying primitive keys:');
try {
  wm3.set('string', 'value');
} catch (e) {
  console.log('✗ String key:', e.message);
}

try {
  wm3.set(42, 'value');
} catch (e) {
  console.log('✗ Number key:', e.message);
}

try {
  wm3.set(true, 'value');
} catch (e) {
  console.log('✗ Boolean key:', e.message);
}

try {
  wm3.set(null, 'value');
} catch (e) {
  console.log('✗ Null key:', e.message);
}

console.log('\n=== 5. NO ITERATION ===\n');

let wm4 = new WeakMap();
wm4.set({ a: 1 }, 'value1');
wm4.set({ b: 2 }, 'value2');

console.log('WeakMap cannot be iterated:');
console.log('- No forEach() method');
console.log('- No keys() method');
console.log('- No values() method');
console.log('- No entries() method');
console.log('- No size property');
console.log('- Cannot use for...of loop');
console.log(
  '\nReason: If WeakMap were iterable, keys would be reachable and prevent GC'
);

console.log('\n=== 6. GARBAGE COLLECTION DEMO ===\n');

console.log('Demonstrating weak references:');

let wm5 = new WeakMap();

// Create an object and use it as key
let tempObj = { data: 'temporary' };
wm5.set(tempObj, 'This data is associated with tempObj');

console.log('Before nullifying reference:');
console.log('has(tempObj):', wm5.has(tempObj)); // true
console.log('get(tempObj):', wm5.get(tempObj));

console.log('\nSetting tempObj = null...');
console.log('(In real scenario, tempObj would be garbage collected)');
console.log('The WeakMap entry would be automatically removed by GC');
console.log('This prevents memory leaks!');

// Note: We can't actually demonstrate GC in this script
// because tempObj is still referenced by this scope

console.log('\n=== 7. PRACTICAL USE CASE: CACHING ===\n');

// Without WeakMap (memory leak risk)
console.log('BAD: Using Map for caching (prevents garbage collection)');
let regularCache = new Map();

function computeWithMapCache(obj) {
  if (regularCache.has(obj)) {
    return regularCache.get(obj);
  }

  let result = { computed: obj.value * 2 };
  regularCache.set(obj, result);
  return result;
}

console.log('Objects stored in Map cache cannot be garbage collected!');

// With WeakMap (no memory leak)
console.log('\nGOOD: Using WeakMap for caching');
let weakCache = new WeakMap();

function computeWithWeakMapCache(obj) {
  if (weakCache.has(obj)) {
    console.log('Cache hit!');
    return weakCache.get(obj);
  }

  console.log('Computing...');
  let result = { computed: obj.value * 2 };
  weakCache.set(obj, result);
  return result;
}

let myObj = { value: 10 };
console.log('First call:', computeWithWeakMapCache(myObj));
console.log('Second call:', computeWithWeakMapCache(myObj));
console.log(
  'When myObj is no longer referenced, cache entry is automatically cleaned up!'
);

console.log('\n=== 8. PRACTICAL USE CASE: PRIVATE DATA ===\n');

console.log('Example: Storing private data for objects');

let privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name; // Public
    privateData.set(this, { password }); // Private
  }

  checkPassword(input) {
    return privateData.get(this).password === input;
  }

  changePassword(oldPass, newPass) {
    let data = privateData.get(this);
    if (data.password === oldPass) {
      data.password = newPass;
      return true;
    }
    return false;
  }
}

let user = new User('alice', 'secret123');
console.log('User name (public):', user.name);
console.log('User password (private):', user.password); // undefined
console.log('Check correct password:', user.checkPassword('secret123'));
console.log('Check wrong password:', user.checkPassword('wrong'));
console.log('Change password:', user.changePassword('secret123', 'newpass456'));
console.log('Check new password:', user.checkPassword('newpass456'));

console.log('\n=== 9. PRACTICAL USE CASE: DOM METADATA ===\n');

console.log('Example: Storing metadata for DOM elements');
console.log('(Simulated - would work with real DOM elements)');

let elementMetadata = new WeakMap();

// Simulate DOM elements
let element1 = { tagName: 'DIV', id: 'header' };
let element2 = { tagName: 'BUTTON', id: 'submit' };

function setElementMetadata(element, data) {
  elementMetadata.set(element, data);
}

function getElementMetadata(element) {
  return elementMetadata.get(element);
}

setElementMetadata(element1, {
  lastClicked: new Date(),
  clickCount: 0,
  customData: 'header info',
});

setElementMetadata(element2, {
  lastClicked: new Date(),
  clickCount: 5,
  customData: 'submit button',
});

console.log('Element1 metadata:', getElementMetadata(element1));
console.log('Element2 metadata:', getElementMetadata(element2));
console.log(
  '\nWhen DOM elements are removed, metadata is automatically cleaned up!'
);

console.log('\n=== 10. PRACTICAL USE CASE: OBJECT TRACKING ===\n');

console.log('Example: Track object processing without memory leaks');

let processedObjects = new WeakMap();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log(`Object ${obj.id} already processed`);
    return processedObjects.get(obj);
  }

  console.log(`Processing object ${obj.id}...`);
  let result = {
    processedAt: new Date(),
    result: obj.value * 2,
  };

  processedObjects.set(obj, result);
  return result;
}

let obj3 = { id: 1, value: 10 };
let obj4 = { id: 2, value: 20 };

console.log('First processing:', processObject(obj3));
console.log('Reprocessing:', processObject(obj3)); // Uses cached result
console.log('Processing new object:', processObject(obj4));

console.log('\n=== 11. COMPARISON: MAP VS WEAKMAP ===\n');

console.log('MAP:');
console.log('✓ Keys can be any type');
console.log('✓ Iterable (forEach, keys(), values(), entries())');
console.log('✓ Has size property');
console.log('✓ Prevents garbage collection (strong references)');
console.log('✓ Use when: Need to iterate or track size');
console.log('✗ Can cause memory leaks if not managed properly');

console.log('\nWEAKMAP:');
console.log('✓ Keys must be objects/arrays');
console.log('✓ Allows garbage collection (weak references)');
console.log('✓ Prevents memory leaks');
console.log('✓ Use when: Associating data with objects temporarily');
console.log('✗ Not iterable');
console.log('✗ No size property');
console.log('✗ Limited methods (get, set, has, delete only)');

console.log('\n=== 12. WHEN TO USE WEAKMAP ===\n');

console.log('Use WeakMap when:');
console.log('1. Caching computed values for objects');
console.log('2. Storing private data in classes');
console.log('3. Associating metadata with DOM elements');
console.log('4. Tracking object state without preventing GC');
console.log('5. Implementing object registries');
console.log('6. Any scenario where objects may be short-lived');

console.log("\nDon't use WeakMap when:");
console.log('1. Need to iterate over entries');
console.log('2. Need to know collection size');
console.log('3. Keys are primitives');
console.log('4. Need to serialize/export data');
console.log('5. Need predictable cleanup timing');

console.log('\n=== 13. ADVANCED EXAMPLE: MEMOIZATION ===\n');

console.log('Memoizing expensive computations:');

let memo = new WeakMap();

function fibonacci(n, obj) {
  // Use obj as cache key
  if (memo.has(obj)) {
    let cache = memo.get(obj);
    if (cache.has(n)) {
      console.log(`Cache hit for fib(${n})`);
      return cache.get(n);
    }
  } else {
    memo.set(obj, new Map());
  }

  console.log(`Computing fib(${n})...`);
  let result;
  if (n <= 1) {
    result = n;
  } else {
    result = fibonacci(n - 1, obj) + fibonacci(n - 2, obj);
  }

  memo.get(obj).set(n, result);
  return result;
}

let calcObj = { id: 'fib-calculator' };
console.log('fib(10):', fibonacci(10, calcObj));
console.log('fib(10) again:', fibonacci(10, calcObj)); // Uses cache

console.log('\n=== 14. MEMORY LEAK PREVENTION EXAMPLE ===\n');

console.log('Scenario: Event listeners with associated data');

let listenerData = new WeakMap();

class EventManager {
  constructor() {
    this.listeners = [];
  }

  addListener(element, handler) {
    this.listeners.push({ element, handler });

    // Store additional data without memory leak
    listenerData.set(element, {
      addedAt: new Date(),
      handlerCount: (listenerData.get(element)?.handlerCount || 0) + 1,
    });

    console.log(
      `Added listener for element. Total: ${listenerData.get(element).handlerCount}`
    );
  }

  getListenerInfo(element) {
    return listenerData.get(element);
  }
}

let manager = new EventManager();
let button1 = { id: 'btn1' };
let button2 = { id: 'btn2' };

manager.addListener(button1, () => console.log('click'));
manager.addListener(button1, () => console.log('another click'));
manager.addListener(button2, () => console.log('button2 click'));

console.log('Button1 info:', manager.getListenerInfo(button1));
console.log('Button2 info:', manager.getListenerInfo(button2));
console.log('\nWhen buttons are removed from DOM, data is auto-cleaned!');

console.log('\n=== COMPLETE! ===');
console.log('All WeakMap concepts and use cases demonstrated!');
console.log('\nKey Takeaway: Use WeakMap to associate data with objects');
console.log('without preventing garbage collection and causing memory leaks!');
