// ============================================
// NULL vs UNDEFINED - Comprehensive Examples
// ============================================

console.log('=== BASIC DEFINITIONS ===');
let uninitializedVar;
let intentionallyEmpty = null;

console.log('Uninitialized variable:', uninitializedVar); // undefined
console.log('Intentionally null variable:', intentionallyEmpty); // null

// ============================================
console.log('\n=== TYPEOF OPERATOR ===');
console.log('typeof null:', typeof null); // "object" (historical bug)
console.log('typeof undefined:', typeof undefined); // "undefined"

// ============================================
console.log('\n=== WHEN YOU GET UNDEFINED ===');

// 1. Uninitialized variables
let x;
console.log('Uninitialized variable x:', x); // undefined

// 2. Non-existent object properties
const person = { name: 'Alice' };
console.log('Non-existent property:', person.age); // undefined

// 3. Non-existent array elements
const arr = [1, 2, 3];
console.log('Non-existent array element:', arr[10]); // undefined

// 4. Function without return
function noReturn() {
  console.log("This function doesn't return anything");
}
console.log('Function with no return:', noReturn()); // undefined

// 5. Missing function parameters
function greet(name) {
  return `Hello, ${name}`;
}
console.log('Function with missing param:', greet()); // "Hello, undefined"

// ============================================
console.log('\n=== EQUALITY COMPARISONS ===');

// Loose equality
console.log('null == undefined:', null == undefined); // true
console.log('null == 0:', null == 0); // false
console.log('undefined == 0:', undefined == 0); // false

// Strict equality
console.log('null === undefined:', null === undefined); // false
console.log('null === null:', null === null); // true
console.log('undefined === undefined:', undefined === undefined); // true

// ============================================
console.log('\n=== FALSY BEHAVIOR ===');

if (!null) {
  console.log('null is falsy'); // executes
}

if (!undefined) {
  console.log('undefined is falsy'); // executes
}

console.log('Boolean(null):', Boolean(null)); // false
console.log('Boolean(undefined):', Boolean(undefined)); // false

// ============================================
console.log('\n=== TYPE CONVERSION ===');

// To String
console.log('String(null):', String(null)); // "null"
console.log('String(undefined):', String(undefined)); // "undefined"
console.log("null + '':", null + ''); // "null"
console.log("undefined + '':", undefined + ''); // "undefined"

// To Number
console.log('Number(null):', Number(null)); // 0
console.log('Number(undefined):', Number(undefined)); // NaN
console.log('null + 5:', null + 5); // 5
console.log('undefined + 5:', undefined + 5); // NaN

// ============================================
console.log('\n=== COMPARISON QUIRKS ===');

console.log('null > 0:', null > 0); // false
console.log('null >= 0:', null >= 0); // true (converts to 0)
console.log('null == 0:', null == 0); // false (special case!)

console.log('undefined > 0:', undefined > 0); // false
console.log('undefined >= 0:', undefined >= 0); // false

// ============================================
console.log('\n=== CHECKING FOR NULL/UNDEFINED ===');

function checkValue(value) {
  // Check for both
  if (value == null) {
    console.log('Value is null or undefined (using ==)');
  }

  // Check specifically
  if (value === null) {
    console.log('Value is specifically null');
  }

  if (value === undefined) {
    console.log('Value is specifically undefined');
  }

  // Check if value exists
  if (value) {
    console.log('Value exists and is truthy');
  } else {
    console.log('Value is falsy');
  }
}

console.log('\nChecking null:');
checkValue(null);

console.log('\nChecking undefined:');
checkValue(undefined);

console.log('\nChecking 0:');
checkValue(0);

// ============================================
console.log('\n=== PROPERTIES AND METHODS ===');

try {
  console.log(null.toString());
} catch (e) {
  console.log('null.toString() throws:', e.message); // TypeError
}

try {
  console.log(undefined.property);
} catch (e) {
  console.log('undefined.property throws:', e.message); // TypeError
}

// ============================================
console.log('\n=== OPTIONAL CHAINING (ES2020) ===');

const user = null;
console.log('user?.name:', user?.name); // undefined (no error!)

const data = { settings: null };
console.log('data.settings?.theme:', data.settings?.theme); // undefined

// ============================================
console.log('\n=== NULLISH COALESCING (ES2020) ===');

const value1 = null ?? 'default';
const value2 = undefined ?? 'default';
const value3 = 0 ?? 'default';
const value4 = '' ?? 'default';

console.log("null ?? 'default':", value1); // "default"
console.log("undefined ?? 'default':", value2); // "default"
console.log("0 ?? 'default':", value3); // 0 (not null/undefined)
console.log("'' ?? 'default':", value4); // "" (not null/undefined)

// Compare with OR operator
console.log("0 || 'default':", 0 || 'default'); // "default" (0 is falsy)
console.log("'' || 'default':", '' || 'default'); // "default" ("" is falsy)

// ============================================
console.log('\n=== FUNCTION DEFAULTS ===');

function setConfig(theme = 'light') {
  return `Theme is: ${theme}`;
}

console.log(setConfig('dark')); // "Theme is: dark"
console.log(setConfig(undefined)); // "Theme is: light" (default used)
console.log(setConfig(null)); // "Theme is: null" (default NOT used)
console.log(setConfig()); // "Theme is: light" (default used)

// ============================================
console.log('\n=== JSON BEHAVIOR ===');

const obj = {
  name: 'Alice',
  age: null,
  email: undefined,
};

console.log('JSON.stringify with null and undefined:');
console.log(JSON.stringify(obj)); // {"name":"Alice","age":null}
// Note: undefined is omitted!

// ============================================
console.log('\n=== PRACTICAL EXAMPLE ===');

// User database simulation
class UserDatabase {
  constructor() {
    this.users = new Map();
  }

  addUser(id, data) {
    this.users.set(id, data);
  }

  getUser(id) {
    // Returns undefined if user doesn't exist
    return this.users.get(id);
  }

  deleteUser(id) {
    // Explicitly set to null to indicate deleted
    this.users.set(id, null);
  }
}

const db = new UserDatabase();
db.addUser(1, { name: 'Alice' });
db.addUser(2, { name: 'Bob' });

console.log('Existing user:', db.getUser(1)); // { name: "Alice" }
console.log('Non-existent user:', db.getUser(999)); // undefined
db.deleteUser(2);
console.log('Deleted user:', db.getUser(2)); // null

// Now you can distinguish:
const user1 = db.getUser(1); // exists
const user2 = db.getUser(2); // deleted (null)
const user3 = db.getUser(3); // never existed (undefined)

console.log('\nUser 1 exists?', user1 !== undefined && user1 !== null); // true
console.log('User 2 exists?', user2 !== undefined && user2 !== null); // false
console.log('User 2 was deleted?', user2 === null); // true
console.log('User 3 exists?', user3 !== undefined && user3 !== null); // false
console.log('User 3 was deleted?', user3 === null); // false

// ============================================
console.log('\n=== BEST PRACTICES SUMMARY ===');
console.log("✓ Use null for intentional 'no value' assignments");
console.log('✓ Use undefined for uninitialized/missing values');
console.log('✓ Use === to distinguish between them');
console.log('✓ Use ?. for safe property access');
console.log('✓ Use ?? for default values (only null/undefined)');
