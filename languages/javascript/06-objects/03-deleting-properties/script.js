// ==============================
// JAVASCRIPT DELETING PROPERTIES
// ==============================

console.log('=== 1. BASIC DELETE OPERATIONS ===\n');

let book = {
  'main title': 'JavaScript',
  'sub-title': 'The Definitive Guide',
  for: 'all audiences',
  author: {
    firstName: 'John',
    surname: 'Doe',
  },
  edition: 7,
  pages: 706,
};

console.log('Original book object:', book);

// Delete with dot notation
let result1 = delete book.edition;
console.log('\ndelete book.edition:', result1);
console.log('book.edition after delete:', book.edition);

// Delete with bracket notation
let result2 = delete book['main title'];
console.log("\ndelete book['main title']:", result2);
console.log("book['main title'] after delete:", book['main title']);

// Delete nested object
let result3 = delete book.author;
console.log('\ndelete book.author:', result3);
console.log('book.author after delete:', book.author);

console.log('\nBook object after deletions:', book);

console.log('\n=== 2. DELETE RETURN VALUES ===\n');

let o = { x: 1, y: 2 };

// Delete existing property
console.log('delete o.x (exists):', delete o.x);
console.log('o.x after delete:', o.x);

// Delete non-existent property
console.log("\ndelete o.x (doesn't exist):", delete o.x);

// Delete inherited property (no effect)
console.log('delete o.toString (inherited):', delete o.toString);
console.log('o.toString still exists:', typeof o.toString);

// Delete with non-property expression
console.log('\ndelete 1 (meaningless):', delete 1);
console.log("delete 'hello' (meaningless):", delete 'hello');

console.log('\n=== 3. OWN vs INHERITED PROPERTIES ===\n');

let proto = {
  inherited: 'from prototype',
  shared: 'shared value',
};

let child = Object.create(proto);
child.own = 'own property';

console.log('Before deletion:');
console.log('child.own:', child.own);
console.log('child.inherited:', child.inherited);

// Try to delete inherited property from child
console.log('\ndelete child.inherited:', delete child.inherited);
console.log('child.inherited still exists:', child.inherited);
console.log("(inherited properties can't be deleted from child)");

// Delete own property
console.log('\ndelete child.own:', delete child.own);
console.log('child.own after delete:', child.own);

// Delete from prototype affects all children
console.log('\nDeleting from prototype:');
console.log('delete proto.shared:', delete proto.shared);
console.log('child.shared after proto deletion:', child.shared);

console.log('\n=== 4. NON-CONFIGURABLE PROPERTIES ===\n');

// Built-in properties
console.log('Attempting to delete built-in properties:');
console.log('delete Object.prototype:', delete Object.prototype);
console.log('Object.prototype still exists:', typeof Object.prototype);

// Create non-configurable property
let obj = {};
Object.defineProperty(obj, 'permanent', {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: false,
});

console.log('\nNon-configurable property:');
console.log('obj.permanent:', obj.permanent);
console.log('delete obj.permanent:', delete obj.permanent);
console.log('obj.permanent after delete:', obj.permanent);

// Check configurability
let descriptor = Object.getOwnPropertyDescriptor(obj, 'permanent');
console.log('Is configurable?', descriptor.configurable);

// Strict mode behavior
console.log('\nStrict mode test:');
try {
  (function () {
    'use strict';
    let strictObj = {};
    Object.defineProperty(strictObj, 'locked', {
      value: 100,
      configurable: false,
    });
    delete strictObj.locked; // Throws TypeError
  })();
} catch (e) {
  console.log('Error in strict mode:', e.message);
}

console.log('\n=== 5. GLOBAL OBJECT PROPERTIES ===\n');

// Note: These examples work differently in browser vs Node.js
console.log('Global object property examples:');

// Creating configurable global property
globalThis.customGlobal = 'test value';
console.log('globalThis.customGlobal:', globalThis.customGlobal);
console.log('delete globalThis.customGlobal:', delete globalThis.customGlobal);
console.log('After delete:', globalThis.customGlobal);

// var creates non-configurable property (in global scope)
// Note: This won't work in this context, but shown for reference
console.log('\n(var declarations create non-configurable global properties)');
console.log('(function declarations also create non-configurable properties)');

console.log('\n=== 6. DELETE vs SETTING TO UNDEFINED ===\n');

let comparison = {
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3',
  prop4: 'value4',
};

console.log('Original object:', comparison);

// Delete property
delete comparison.prop1;

// Set to undefined
comparison.prop2 = undefined;

// Set to null
comparison.prop3 = null;

console.log('\nAfter operations:');
console.log('comparison:', comparison);

console.log('\nChecking property existence:');
console.log("'prop1' in comparison (deleted):", 'prop1' in comparison);
console.log("'prop2' in comparison (undefined):", 'prop2' in comparison);
console.log("'prop3' in comparison (null):", 'prop3' in comparison);

console.log('\nhasOwnProperty checks:');
console.log('prop1 (deleted):', comparison.hasOwnProperty('prop1'));
console.log('prop2 (undefined):', comparison.hasOwnProperty('prop2'));
console.log('prop3 (null):', comparison.hasOwnProperty('prop3'));

console.log('\nObject.keys():', Object.keys(comparison));

console.log('\n=== 7. ARRAYS AND DELETE ===\n');

let arr = [1, 2, 3, 4, 5];
console.log('Original array:', arr);
console.log('Length:', arr.length);

// Delete array element
console.log('\ndelete arr[2]:', delete arr[2]);
console.log('Array after delete:', arr);
console.log('Length after delete:', arr.length);
console.log('arr[2]:', arr[2]);
console.log("Array has 'holes'!");

// Better approach with splice
let arr2 = [1, 2, 3, 4, 5];
console.log('\nBetter approach - using splice:');
console.log('Original:', arr2);
arr2.splice(2, 1); // Remove 1 element at index 2
console.log('After splice(2, 1):', arr2);
console.log('Length:', arr2.length);

console.log('\n=== 8. SEALED AND FROZEN OBJECTS ===\n');

// Sealed object
let sealedObj = { x: 1, y: 2 };
Object.seal(sealedObj);

console.log('Sealed object:');
console.log('sealedObj:', sealedObj);
console.log('delete sealedObj.x:', delete sealedObj.x);
console.log('sealedObj.x still exists:', sealedObj.x);
console.log('(Can modify but not delete)');
sealedObj.x = 10;
console.log('After sealedObj.x = 10:', sealedObj.x);

// Frozen object
let frozenObj = { a: 1, b: 2 };
Object.freeze(frozenObj);

console.log('\nFrozen object:');
console.log('frozenObj:', frozenObj);
console.log('delete frozenObj.a:', delete frozenObj.a);
console.log('frozenObj.a still exists:', frozenObj.a);
frozenObj.a = 10; // Silently fails in non-strict mode
console.log('After frozenObj.a = 10:', frozenObj.a);
console.log('(Cannot modify or delete)');

console.log('\n=== 9. PRACTICAL USE CASES ===\n');

// Use case 1: Removing sensitive data
console.log('Use Case 1: Removing sensitive data');
let user = {
  username: 'alice',
  email: 'alice@example.com',
  password: 'secret123',
  sessionToken: 'xyz789',
};

console.log('Before sanitization:', user);

function sanitizeUser(user) {
  delete user.password;
  delete user.sessionToken;
  return user;
}

sanitizeUser(user);
console.log('After sanitization:', user);

// Use case 2: Cleaning temporary properties
console.log('\nUse Case 2: Cleaning temporary properties');
let apiResponse = {
  data: [1, 2, 3],
  result: 'success',
  _temp: 'processing',
  _cache: {},
  _debug: 'info',
};

console.log('Before cleanup:', apiResponse);

function cleanupResponse(response) {
  for (let key in response) {
    if (key.startsWith('_')) {
      delete response[key];
    }
  }
  return response;
}

cleanupResponse(apiResponse);
console.log('After cleanup:', apiResponse);

// Use case 3: Optional properties
console.log('\nUse Case 3: Optional properties');

function createProduct(name, price, description, discount) {
  let product = { name, price, description, discount };

  // Remove undefined optional properties
  if (discount === undefined) {
    delete product.discount;
  }
  if (description === undefined) {
    delete product.description;
  }

  return product;
}

let product1 = createProduct('Laptop', 999, 'Gaming laptop', 10);
let product2 = createProduct('Mouse', 29);

console.log('Product with all properties:', product1);
console.log('Product with only required:', product2);

console.log('\n=== 10. PERFORMANCE CONSIDERATIONS ===\n');

console.log('Performance comparison (conceptual):');

let perfObj1 = { a: 1, b: 2, c: 3, d: 4 };
let perfObj2 = { a: 1, b: 2, c: 3, d: 4 };

console.log('\nApproach 1 - delete (can be slower):');
delete perfObj1.c;
console.log('perfObj1:', perfObj1);

console.log('\nApproach 2 - set to undefined (faster):');
perfObj2.c = undefined;
console.log('perfObj2:', perfObj2);

console.log('\nNote: delete changes object structure');
console.log('Setting to undefined maintains structure');
console.log('For performance-critical code, prefer setting to undefined');

console.log('\n=== 11. EDGE CASES ===\n');

// Deleting non-existent properties
console.log('Deleting non-existent properties:');
let edgeObj = { x: 1 };
console.log('delete edgeObj.nonExistent:', delete edgeObj.nonExistent);

// Multiple deletes
console.log('\nMultiple deletes on same property:');
console.log('First delete edgeObj.x:', delete edgeObj.x);
console.log('Second delete edgeObj.x:', delete edgeObj.x);

// Delete with computed property names
console.log('\nDelete with computed property names:');
let dynamicObj = {
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3',
};

let propToDelete = 'prop2';
delete dynamicObj[propToDelete];
console.log('After deleting computed property:', dynamicObj);

// Chained property deletion
console.log('\nChained object property deletion:');
let nested = {
  level1: {
    level2: {
      level3: 'deep value',
    },
  },
};

console.log('Before:', nested);
delete nested.level1.level2.level3;
console.log('After deleting nested.level1.level2.level3:', nested);
delete nested.level1.level2;
console.log('After deleting nested.level1.level2:', nested);

console.log('\n=== 12. SUMMARY COMPARISON ===\n');

let summary = {
  test1: 'value1',
  test2: 'value2',
  test3: 'value3',
};

console.log('Original:', summary);
console.log('Keys:', Object.keys(summary));

delete summary.test1;
summary.test2 = undefined;
summary.test3 = null;

console.log('\nAfter operations:');
console.log('Object:', summary);
console.log('Keys:', Object.keys(summary));
console.log('\nProperty existence:');
console.log("'test1' in summary:", 'test1' in summary, '(deleted)');
console.log("'test2' in summary:", 'test2' in summary, '(set to undefined)');
console.log("'test3' in summary:", 'test3' in summary, '(set to null)');

console.log('\n=== COMPLETE! ===');
console.log('All delete property concepts demonstrated successfully!');
