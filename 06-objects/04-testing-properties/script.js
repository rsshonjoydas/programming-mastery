// =============================
// JAVASCRIPT TESTING PROPERTIES
// =============================

console.log("=== 1. THE 'in' OPERATOR ===\n");

let o = { x: 1 };

// Testing own properties
console.log("'x' in o:", 'x' in o); // true: own property
console.log("'y' in o:", 'y' in o); // false: doesn't exist

// Testing inherited properties
console.log("'toString' in o:", 'toString' in o); // true: inherited from Object.prototype
console.log("'hasOwnProperty' in o:", 'hasOwnProperty' in o); // true: inherited

// The 'in' operator works with both own and inherited properties
console.log("\nConclusion: 'in' checks BOTH own and inherited properties");

console.log('\n=== 2. hasOwnProperty() METHOD ===\n');

console.log("o.hasOwnProperty('x'):", o.hasOwnProperty('x')); // true: own property
console.log("o.hasOwnProperty('y'):", o.hasOwnProperty('y')); // false: doesn't exist
console.log("o.hasOwnProperty('toString'):", o.hasOwnProperty('toString')); // false: inherited

// Testing on Object.prototype itself
console.log(
  "\nObject.prototype.hasOwnProperty('toString'):",
  Object.prototype.hasOwnProperty('toString')
); // true: toString is own property of Object.prototype

console.log('\nConclusion: hasOwnProperty() checks ONLY own properties');

console.log('\n=== 3. propertyIsEnumerable() METHOD ===\n');

console.log("o.propertyIsEnumerable('x'):", o.propertyIsEnumerable('x')); // true: own and enumerable
console.log(
  "o.propertyIsEnumerable('toString'):",
  o.propertyIsEnumerable('toString')
); // false: not own

// Testing Object.prototype's toString
console.log(
  "Object.prototype.propertyIsEnumerable('toString'):",
  Object.prototype.propertyIsEnumerable('toString')
); // false: not enumerable

// Creating a non-enumerable property
Object.defineProperty(o, 'hidden', {
  value: 42,
  enumerable: false,
});

console.log("\nAfter adding non-enumerable property 'hidden':");
console.log("o.hasOwnProperty('hidden'):", o.hasOwnProperty('hidden')); // true
console.log(
  "o.propertyIsEnumerable('hidden'):",
  o.propertyIsEnumerable('hidden')
); // false

console.log(
  '\nConclusion: propertyIsEnumerable() checks for own AND enumerable properties'
);

console.log('\n=== 4. DIRECT PROPERTY QUERY (!== undefined) ===\n');

console.log('o.x !== undefined:', o.x !== undefined); // true
console.log('o.y !== undefined:', o.y !== undefined); // false
console.log('o.toString !== undefined:', o.toString !== undefined); // true: inherited

console.log('\nThis method checks both own and inherited properties');
console.log('But has a limitation with explicit undefined values...');

console.log("\n=== 5. KEY DIFFERENCE: 'in' vs '!== undefined' ===\n");

let obj = { x: undefined }; // Explicitly set to undefined

console.log("Testing property 'x' (set to undefined):");
console.log('obj.x !== undefined:', obj.x !== undefined); // false (misleading!)
console.log("'x' in obj:", 'x' in obj); // true (correct!)

console.log("\nTesting property 'y' (doesn't exist):");
console.log('obj.y !== undefined:', obj.y !== undefined); // false
console.log("'y' in obj:", 'y' in obj); // false

console.log("\nDeleting property 'x':");
delete obj.x;
console.log("After delete, 'x' in obj:", 'x' in obj); // false

console.log(
  "\nConclusion: Use 'in' to distinguish undefined values from non-existent properties"
);

console.log('\n=== 6. WORKING WITH SYMBOLS ===\n');

let sym = Symbol('test');
let symObj = {
  [sym]: 'symbol value',
  regular: 'regular value',
};

console.log('Testing Symbol property:');
console.log('sym in symObj:', sym in symObj); // true
console.log('symObj.hasOwnProperty(sym):', symObj.hasOwnProperty(sym)); // true
console.log(
  'symObj.propertyIsEnumerable(sym):',
  symObj.propertyIsEnumerable(sym)
); // true
console.log('symObj[sym] !== undefined:', symObj[sym] !== undefined); // true

console.log('\nAll methods work with Symbol properties!');

console.log('\n=== 7. PROTOTYPE CHAIN TESTING ===\n');

let animal = {
  eats: true,
  walks: function () {
    return 'walking';
  },
};

let rabbit = Object.create(animal);
rabbit.hops = true;

console.log('Rabbit properties:');
console.log("'hops' in rabbit:", 'hops' in rabbit); // true: own
console.log("'eats' in rabbit:", 'eats' in rabbit); // true: inherited
console.log("'walks' in rabbit:", 'walks' in rabbit); // true: inherited

console.log('\nUsing hasOwnProperty:');
console.log("rabbit.hasOwnProperty('hops'):", rabbit.hasOwnProperty('hops')); // true
console.log("rabbit.hasOwnProperty('eats'):", rabbit.hasOwnProperty('eats')); // false
console.log("rabbit.hasOwnProperty('walks'):", rabbit.hasOwnProperty('walks')); // false

console.log('\nPrototype chain: rabbit -> animal -> Object.prototype -> null');

console.log('\n=== 8. PRACTICAL EXAMPLE 1: Safe Object Iteration ===\n');

// Adding a property to Object.prototype (not recommended, just for demo)
Object.prototype.inheritedProp = 'inherited value';

let person = {
  name: 'Alice',
  age: 30,
  city: 'NYC',
};

console.log('Without hasOwnProperty check:');
for (let key in person) {
  console.log(`  ${key}: ${person[key]}`);
}

console.log('\nWith hasOwnProperty check (recommended):');
for (let key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(`  ${key}: ${person[key]}`);
  }
}

// Clean up
delete Object.prototype.inheritedProp;

console.log('\n=== 9. PRACTICAL EXAMPLE 2: Property Status Checker ===\n');

function propertyStatus(obj, prop) {
  if (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] === undefined) {
        return 'Own property, value is undefined';
      } else {
        return `Own property, value: ${obj[prop]}`;
      }
    } else {
      return 'Inherited property';
    }
  } else {
    return 'Property does not exist';
  }
}

let testObj = {
  defined: 'value',
  explicit: undefined,
};

console.log(
  "propertyStatus(testObj, 'defined'):",
  propertyStatus(testObj, 'defined')
);
console.log(
  "propertyStatus(testObj, 'explicit'):",
  propertyStatus(testObj, 'explicit')
);
console.log(
  "propertyStatus(testObj, 'toString'):",
  propertyStatus(testObj, 'toString')
);
console.log(
  "propertyStatus(testObj, 'nonexistent'):",
  propertyStatus(testObj, 'nonexistent')
);

console.log('\n=== 10. PRACTICAL EXAMPLE 3: Configuration Validator ===\n');

let defaultConfig = {
  timeout: 5000,
  retries: 3,
  debug: false,
};

let userConfig = {
  timeout: 3000,
  debug: true,
  extraOption: 'custom',
};

function validateConfig(user, defaults) {
  console.log('Validating configuration:');

  // Check for unknown options
  for (let key in user) {
    if (user.hasOwnProperty(key)) {
      if (!(key in defaults)) {
        console.log(`  Warning: Unknown option '${key}'`);
      } else {
        console.log(`  ✓ Valid option '${key}': ${user[key]}`);
      }
    }
  }

  // Check for missing options
  for (let key in defaults) {
    if (defaults.hasOwnProperty(key)) {
      if (!(key in user)) {
        console.log(`  Info: Using default for '${key}': ${defaults[key]}`);
      }
    }
  }
}

validateConfig(userConfig, defaultConfig);

console.log('\n=== 11. ENUMERABLE VS NON-ENUMERABLE ===\n');

let enumerableTest = {
  visible1: 'I am enumerable',
  visible2: 'Me too',
};

Object.defineProperty(enumerableTest, 'hidden1', {
  value: 'I am not enumerable',
  enumerable: false,
});

Object.defineProperty(enumerableTest, 'hidden2', {
  value: 'Neither am I',
  enumerable: false,
  writable: true,
  configurable: true,
});

console.log('Using for...in loop (only enumerable):');
for (let key in enumerableTest) {
  if (enumerableTest.hasOwnProperty(key)) {
    console.log(`  ${key}: ${enumerableTest[key]}`);
  }
}

console.log('\nChecking all properties with hasOwnProperty:');
['visible1', 'visible2', 'hidden1', 'hidden2'].forEach((key) => {
  console.log(
    `  ${key} exists (hasOwnProperty): ${enumerableTest.hasOwnProperty(key)}`
  );
  console.log(
    `  ${key} is enumerable: ${enumerableTest.propertyIsEnumerable(key)}`
  );
});

console.log('\n=== 12. COMMON PITFALL: Overriding hasOwnProperty ===\n');

let problematicObj = {
  x: 1,
  hasOwnProperty: function () {
    return false; // Malicious or accidental override
  },
};

console.log('Direct call (returns wrong result):');
console.log(
  "problematicObj.hasOwnProperty('x'):",
  problematicObj.hasOwnProperty('x')
); // false!

console.log('\nSafe call using Object.prototype:');
console.log(
  "Object.prototype.hasOwnProperty.call(problematicObj, 'x'):",
  Object.prototype.hasOwnProperty.call(problematicObj, 'x')
); // true

console.log('\nModern solution (ES2022 - Object.hasOwn):');
if (typeof Object.hasOwn === 'function') {
  console.log(
    "Object.hasOwn(problematicObj, 'x'):",
    Object.hasOwn(problematicObj, 'x')
  ); // true
} else {
  console.log('Object.hasOwn not available in this environment');
}

console.log('\n=== 13. COMPARISON TABLE ===\n');

let comparisonObj = {
  own: 'own property',
  explicit: undefined,
};

Object.defineProperty(comparisonObj, 'nonEnum', {
  value: 'non-enumerable',
  enumerable: false,
});

console.log("Property: 'own'");
console.log("  'own' in obj:", 'own' in comparisonObj);
console.log('  hasOwnProperty:', comparisonObj.hasOwnProperty('own'));
console.log(
  '  propertyIsEnumerable:',
  comparisonObj.propertyIsEnumerable('own')
);
console.log('  !== undefined:', comparisonObj.own !== undefined);

console.log("\nProperty: 'explicit' (set to undefined)");
console.log("  'explicit' in obj:", 'explicit' in comparisonObj);
console.log('  hasOwnProperty:', comparisonObj.hasOwnProperty('explicit'));
console.log(
  '  propertyIsEnumerable:',
  comparisonObj.propertyIsEnumerable('explicit')
);
console.log('  !== undefined:', comparisonObj.explicit !== undefined);

console.log("\nProperty: 'nonEnum' (non-enumerable)");
console.log("  'nonEnum' in obj:", 'nonEnum' in comparisonObj);
console.log('  hasOwnProperty:', comparisonObj.hasOwnProperty('nonEnum'));
console.log(
  '  propertyIsEnumerable:',
  comparisonObj.propertyIsEnumerable('nonEnum')
);
console.log('  !== undefined:', comparisonObj.nonEnum !== undefined);

console.log("\nProperty: 'toString' (inherited)");
console.log("  'toString' in obj:", 'toString' in comparisonObj);
console.log('  hasOwnProperty:', comparisonObj.hasOwnProperty('toString'));
console.log(
  '  propertyIsEnumerable:',
  comparisonObj.propertyIsEnumerable('toString')
);
console.log('  !== undefined:', comparisonObj.toString !== undefined);

console.log("\nProperty: 'nonexistent'");
console.log("  'nonexistent' in obj:", 'nonexistent' in comparisonObj);
console.log('  hasOwnProperty:', comparisonObj.hasOwnProperty('nonexistent'));
console.log(
  '  propertyIsEnumerable:',
  comparisonObj.propertyIsEnumerable('nonexistent')
);
console.log('  !== undefined:', comparisonObj.nonexistent !== undefined);

console.log('\n=== 14. REAL-WORLD USE CASES ===\n');

// Use Case 1: Safe property merger
function mergeObjects(target, source) {
  console.log('Merging objects safely:');
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
      console.log(`  Copied: ${key} = ${source[key]}`);
    }
  }
  return target;
}

let base = { a: 1, b: 2 };
let extension = { b: 3, c: 4 };
let merged = mergeObjects(base, extension);
console.log('Result:', merged);

// Use Case 2: Feature detection
console.log('\nFeature detection:');
function hasFeature(obj, feature) {
  return feature in obj && typeof obj[feature] !== 'undefined';
}

let browser = {
  localStorage: true,
  sessionStorage: true,
  indexedDB: undefined,
};

console.log('localStorage available:', hasFeature(browser, 'localStorage'));
console.log('indexedDB available:', hasFeature(browser, 'indexedDB'));
console.log('webGL available:', hasFeature(browser, 'webGL'));

console.log('\n=== 15. BEST PRACTICES SUMMARY ===\n');

console.log("✓ Use 'in' to check for any property (own or inherited)");
console.log('✓ Use hasOwnProperty() to check for own properties only');
console.log('✓ Use propertyIsEnumerable() when enumerable status matters');
console.log(
  '✓ Avoid !== undefined when properties might be explicitly undefined'
);
console.log('✓ Always use hasOwnProperty() inside for...in loops');
console.log('✓ Consider Object.hasOwn() for more reliable checks (ES2022+)');
console.log('✓ All methods work with both strings and Symbols');

console.log('\n=== COMPLETE! ===');
console.log('All property testing methods demonstrated successfully!');
