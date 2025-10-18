// ============================================
// JAVASCRIPT FUNCTION ARGUMENTS AND PARAMETERS
// ============================================

console.log('=== 1. OPTIONAL PARAMETERS AND DEFAULTS ===\n');

// Problem: Missing arguments become undefined
function greetBasic(name, greeting) {
  console.log(greeting + ', ' + name);
}
console.log('Without default:');
greetBasic('Alice'); // "undefined, Alice"

// Solution 1: Manual default check (old way)
function getPropertyNames1(o, a) {
  if (a === undefined) a = [];
  for (let property in o) a.push(property);
  return a;
}

let o = { x: 1 },
  p = { y: 2, z: 3 };
let result1 = getPropertyNames1(o);
console.log('\nManual check - first call:', result1);
getPropertyNames1(p, result1);
console.log('Manual check - after second call:', result1);

// Solution 2: Using || operator (idiomatic)
function getPropertyNames2(o, a) {
  a = a || [];
  for (let property in o) a.push(property);
  return a;
}

let result2 = getPropertyNames2({ a: 1, b: 2 });
console.log('\nUsing || operator:', result2);

// Solution 3: ES6+ default parameters (best)
function getPropertyNames3(o, a = []) {
  for (let property in o) a.push(property);
  return a;
}

let result3 = getPropertyNames3({ name: 'John', age: 30 });
console.log('\nES6 default parameters:', result3);

// Default parameters with expressions
const rectangle = (width, height = width * 2) => ({ width, height });
console.log('\nRectangle with default height:', rectangle(5));
console.log('Rectangle with both params:', rectangle(5, 8));

// Multiple default parameters
function createUser(name, age = 18, country = 'USA') {
  return { name, age, country };
}

console.log('\nUser with all defaults:', createUser('Alice'));
console.log('User with some defaults:', createUser('Bob', 25));
console.log('Skip middle param:', createUser('Charlie', undefined, 'Canada'));

console.log('\n=== 2. REST PARAMETERS ===\n');

// Basic rest parameter
function max(first = -Infinity, ...rest) {
  let maxValue = first;

  for (let n of rest) {
    if (n > maxValue) {
      maxValue = n;
    }
  }

  return maxValue;
}

console.log('Max of numbers:', max(1, 10, 100, 2, 3, 1000, 4, 5, 6));
console.log('Max with one arg:', max(42));
console.log('Max with no args:', max());

// Rest parameter is always an array
function logArgs(first, ...rest) {
  console.log('First argument:', first);
  console.log('Rest arguments (array):', rest);
  console.log('Rest is array?', Array.isArray(rest));
  console.log('Rest length:', rest.length);
}

console.log('\nRest parameter characteristics:');
logArgs('a', 'b', 'c', 'd');
logArgs('only one');

// Practical example: sum function
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log('\nSum function:', sum(1, 2, 3, 4, 5));

console.log('\n=== 3. THE ARGUMENTS OBJECT (LEGACY) ===\n');

// Old way using arguments object
function maxOldWay(x) {
  let maxValue = -Infinity;

  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] > maxValue) maxValue = arguments[i];
  }

  return maxValue;
}

console.log('Using arguments object:', maxOldWay(1, 10, 100, 2, 3, 1000));

// Comparison: arguments vs rest parameter
function compareApproaches() {
  console.log('\narguments object:', arguments);
  console.log('Is arguments an array?', Array.isArray(arguments));
  console.log('arguments type:', typeof arguments);
}

function compareRest(...args) {
  console.log('\nRest parameter:', args);
  console.log('Is rest an array?', Array.isArray(args));
  console.log('Has array methods?', typeof args.map === 'function');
}

console.log('Arguments object approach:');
compareApproaches(1, 2, 3);

console.log('\nRest parameter approach:');
compareRest(1, 2, 3);

console.log('\n=== 4. SPREAD OPERATOR ===\n');

// Basic spread in function calls
let numbers = [5, 2, 10, -1, 9, 100, 1];
console.log('Array:', numbers);
console.log('Math.min with spread:', Math.min(...numbers));
console.log('Math.max with spread:', Math.max(...numbers));

// Combining arrays
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2];
console.log('\nCombining arrays:', combined);

// Spread vs Rest
console.log('\nSpread vs Rest:');
console.log('Spread: unpacks array INTO function call');
console.log('Rest: collects arguments INTO array');

// Practical example: timed wrapper
function timed(f) {
  return function (...args) {
    // Rest: collect arguments
    console.log(`\nEntering function ${f.name}`);
    let startTime = Date.now();

    try {
      return f(...args); // Spread: pass arguments
    } finally {
      console.log(`Exiting ${f.name} after ${Date.now() - startTime}ms`);
    }
  };
}

function benchmark(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}

console.log('\nTimed wrapper example:');
let result = timed(benchmark)(1000000);
console.log('Result:', result);

console.log('\n=== 5. DESTRUCTURING FUNCTION ARGUMENTS ===\n');

// Array destructuring
console.log('Array destructuring:');

function vectorAdd([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

console.log('Add vectors [1,2] + [3,4]:', vectorAdd([1, 2], [3, 4]));

// Object destructuring
console.log('\nObject destructuring:');

function vectorMultiply({ x, y }, scalar) {
  return { x: x * scalar, y: y * scalar };
}

console.log('Multiply {x:1, y:2} by 3:', vectorMultiply({ x: 1, y: 2 }, 3));

// Renaming properties
console.log('\nRenaming during destructuring:');

function vectorSubtract({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return { x: x1 - x2, y: y1 - y2 };
}

console.log(
  'Subtract {x:5, y:3} - {x:2, y:1}:',
  vectorSubtract({ x: 5, y: 3 }, { x: 2, y: 1 })
);

// Default values with destructuring
console.log('\nDefault values in destructuring:');

function vectorMultiply3D({ x, y, z = 0 }, scalar) {
  return { x: x * scalar, y: y * scalar, z: z * scalar };
}

console.log('2D vector:', vectorMultiply3D({ x: 1, y: 2 }, 2));
console.log('3D vector:', vectorMultiply3D({ x: 1, y: 2, z: 3 }, 2));

// Named parameters pattern
console.log('\nNamed parameters pattern:');

function arraycopy({
  from,
  to = from,
  n = from.length,
  fromIndex = 0,
  toIndex = 0,
}) {
  let valuesToCopy = from.slice(fromIndex, fromIndex + n);
  to.splice(toIndex, 0, ...valuesToCopy);
  return to;
}

let a = [1, 2, 3, 4, 5];
let b = [9, 8, 7, 6, 5];
console.log('Copy 3 elements from a to b at index 4:');
console.log(arraycopy({ from: a, n: 3, to: b, toIndex: 4 }));

// Rest with destructuring
console.log('\nRest parameter with destructuring:');

function processCoords([x, y, ...coords], ...rest) {
  console.log('x:', x);
  console.log('y:', y);
  console.log('remaining coords:', coords);
  console.log('other arguments:', rest);
  return [x + y, ...rest, ...coords];
}

console.log('Result:', processCoords([1, 2, 3, 4], 5, 6));

// Object rest (ES2018)
console.log('\nObject rest parameter (ES2018):');

function vectorMultiplyWithProps({ x, y, z = 0, ...props }, scalar) {
  return { x: x * scalar, y: y * scalar, z: z * scalar, ...props };
}

console.log(vectorMultiplyWithProps({ x: 1, y: 2, w: -1, color: 'red' }, 2));

// Complex destructuring
console.log('\nComplex nested destructuring:');

function drawCircle({ x, y, radius, color: [r, g, b] }) {
  console.log(`Circle at (${x}, ${y}) with radius ${radius}`);
  console.log(`Color: rgb(${r}, ${g}, ${b})`);
}

drawCircle({ x: 10, y: 20, radius: 5, color: [255, 0, 0] });

console.log('\n=== 6. ARGUMENT TYPE CHECKING ===\n');

// The problem: No automatic type checking
console.log('JavaScript has no built-in type checking:');

function add(a, b) {
  return a + b;
}

console.log('add(5, 10):', add(5, 10));
console.log("add('5', '10'):", add('5', '10'));
console.log("add(5, '10'):", add(5, '10'));

// Manual type checking
console.log('\nManual type checking:');

function sum(a) {
  if (!a || typeof a[Symbol.iterator] !== 'function') {
    throw new TypeError('Argument must be iterable');
  }

  let total = 0;
  for (let element of a) {
    if (typeof element !== 'number') {
      throw new TypeError('sum(): elements must be numbers');
    }
    total += element;
  }
  return total;
}

console.log('sum([1, 2, 3]):', sum([1, 2, 3]));

try {
  sum(1, 2, 3);
} catch (e) {
  console.log('Error:', e.message);
}

try {
  sum([1, 2, '3']);
} catch (e) {
  console.log('Error:', e.message);
}

// Type checking strategies
console.log('\nType checking strategies:');

// 1. Using typeof
function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a * b;
}

console.log('multiply(5, 3):', multiply(5, 3));
try {
  multiply(5, '3');
} catch (e) {
  console.log('Error:', e.message);
}

// 2. Using Array.isArray()
function sumArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Argument must be an array');
  }
  return arr.reduce((sum, val) => sum + val, 0);
}

console.log('\nsumArray([1, 2, 3]):', sumArray([1, 2, 3]));
try {
  sumArray('123');
} catch (e) {
  console.log('Error:', e.message);
}

// 3. Using instanceof
function processDate(date) {
  if (!(date instanceof Date)) {
    throw new TypeError('Argument must be a Date object');
  }
  return date.toISOString();
}

console.log('\nprocessDate(new Date()):', processDate(new Date()));
try {
  processDate('2024-01-01');
} catch (e) {
  console.log('Error:', e.message);
}

// 4. Duck typing
function processIterable(iterable) {
  if (typeof iterable[Symbol.iterator] !== 'function') {
    throw new TypeError('Argument must be iterable');
  }

  let result = [];
  for (let item of iterable) {
    result.push(item);
  }
  return result;
}

console.log("\nprocessIterable('hello'):", processIterable('hello'));
console.log('processIterable([1, 2, 3]):', processIterable([1, 2, 3]));

console.log('\n=== 7. PRACTICAL EXAMPLES ===\n');

// Example 1: Flexible logger
console.log('Example 1: Flexible logger with rest parameters');

function log(level, ...messages) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  console.log(prefix, ...messages);
}

log('info', 'Application started');
log('warning', 'Low memory:', '15% remaining');
log('error', 'Connection failed', 'Retrying in 5s');

// Example 2: Configuration merger
console.log('\nExample 2: Configuration merger with defaults');

function createConfig({
  host = 'localhost',
  port = 3000,
  debug = false,
  timeout = 5000,
  ...otherOptions
}) {
  return {
    host,
    port,
    debug,
    timeout,
    ...otherOptions,
  };
}

console.log('Minimal config:', createConfig({}));
console.log(
  'Custom config:',
  createConfig({
    host: 'api.example.com',
    port: 8080,
    apiKey: 'secret123',
    retries: 3,
  })
);

// Example 3: Validation with type checking
console.log('\nExample 3: User validation');

function createUser({ name, email, age }) {
  // Type checking
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    throw new TypeError('email must be a valid email string');
  }

  if (typeof age !== 'number' || age < 0) {
    throw new TypeError('age must be a positive number');
  }

  return { name, email, age, createdAt: new Date() };
}

try {
  console.log(
    'Valid user:',
    createUser({
      name: 'Alice',
      email: 'alice@example.com',
      age: 25,
    })
  );

  createUser({ name: '', email: 'test', age: -5 });
} catch (e) {
  console.log('Validation error:', e.message);
}

// Example 4: Mathematical operations with variadic args
console.log('\nExample 4: Statistical functions');

function average(...numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function variance(...numbers) {
  if (numbers.length === 0) return 0;
  const avg = average(...numbers);
  return average(...numbers.map((n) => (n - avg) ** 2));
}

function standardDeviation(...numbers) {
  return Math.sqrt(variance(...numbers));
}

const data = [10, 12, 23, 23, 16, 23, 21, 16];
console.log('Data:', data);
console.log('Average:', average(...data));
console.log('Variance:', variance(...data));
console.log('Std Dev:', standardDeviation(...data));

console.log('\n=== COMPLETE! ===');
console.log('All function arguments and parameters concepts demonstrated!');
