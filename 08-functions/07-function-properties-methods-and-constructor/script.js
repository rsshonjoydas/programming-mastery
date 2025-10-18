// ========================================================
// JAVASCRIPT FUNCTION PROPERTIES, METHODS, AND CONSTRUCTOR
// ========================================================

console.log('=== FUNCTION PROPERTIES ===\n');

// 1. The length Property
console.log('1. THE LENGTH PROPERTY:');

function add(a, b) {
  return a + b;
}
console.log('add(a, b) - length:', add.length); // 2

function greet(name, greeting = 'Hello') {
  return `${greeting}, ${name}`;
}
console.log("greet(name, greeting='Hello') - length:", greet.length); // 1 (default params not counted)

function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log('sum(...numbers) - length:', sum.length); // 0 (rest params not counted)

function mixed(a, b = 5, c) {
  return a + b + c;
}
console.log('mixed(a, b=5, c) - length:', mixed.length); // 1 (stops at first default)

// 2. The name Property
console.log('\n2. THE NAME PROPERTY:');

function myFunction() {}
console.log('Named function:', myFunction.name); // "myFunction"

const anonFunc = function () {};
console.log('Anonymous function assigned to variable:', anonFunc.name); // "anonFunc"

const obj = {
  method() {},
  prop: function () {},
};
console.log('Object method:', obj.method.name); // "method"
console.log('Object property function:', obj.prop.name); // "prop"

const arrow = () => {};
console.log('Arrow function:', arrow.name); // "arrow"

const boundFunc = myFunction.bind(null);
console.log('Bound function:', boundFunc.name); // "bound myFunction"

// 3. The prototype Property
console.log('\n3. THE PROTOTYPE PROPERTY:');

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
};

Person.prototype.species = 'Human';

const alice = new Person('Alice', 30);
const bob = new Person('Bob', 25);

console.log('alice.greet():', alice.greet());
console.log('bob.greet():', bob.greet());
console.log('alice.species:', alice.species); // Inherited from prototype

// Arrow functions don't have prototype
const arrowFunc = () => {};
console.log('Arrow function has prototype?', arrowFunc.prototype); // undefined

console.log('\n=== FUNCTION METHODS ===\n');

// 4. The call() Method
console.log('4. THE CALL() METHOD:');

function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person1 = { name: 'Charlie' };
const person2 = { name: 'Diana' };

console.log(introduce.call(person1, 'Hello', '!')); // "Hello, I'm Charlie!"
console.log(introduce.call(person2, 'Hi', '.')); // "Hi, I'm Diana."

// Borrowing methods
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.call(null, 5, 6, 2, 3, 7);
console.log('Max using call:', max); // 7

// Arrow functions ignore call() context
const arrowGreet = () => {
  console.log('Arrow this:', this); // Global or undefined in strict mode
};
const testObj = { value: 42 };
arrowGreet.call(testObj); // this is NOT set to testObj

// 5. The apply() Method
console.log('\n5. THE APPLY() METHOD:');

console.log(introduce.apply(person1, ['Greetings', '!!'])); // "Greetings, I'm Charlie!!"

// Practical use case: finding max in array
const nums = [10, 25, 8, 42, 15];
const maxNum = Math.max.apply(null, nums);
console.log('Max using apply:', maxNum); // 42

// Modern ES6 equivalent
const maxES6 = Math.max(...nums);
console.log('Max using spread:', maxES6); // 42

// Method tracing example
console.log('\nMethod Tracing Example:');

function trace(o, m) {
  let original = o[m];

  o[m] = function (...args) {
    console.log(new Date().toISOString(), 'Entering:', m);
    let result = original.apply(this, args);
    console.log(new Date().toISOString(), 'Exiting:', m);
    return result;
  };
}

const calculator = {
  add(a, b) {
    return a + b;
  },
  multiply(a, b) {
    return a * b;
  },
};

trace(calculator, 'add');
console.log('Result:', calculator.add(5, 3));

trace(calculator, 'multiply');
console.log('Result:', calculator.multiply(4, 6));

// 6. The bind() Method
console.log('\n6. THE BIND() METHOD:');

// Basic binding
function showInfo(y) {
  return `x: ${this.x}, y: ${y}`;
}

const objA = { x: 1 };
const boundFunc1 = showInfo.bind(objA);

console.log('boundFunc1(2):', boundFunc1(2)); // "x: 1, y: 2"

// Even when called as method of another object
const objB = { x: 10, fn: boundFunc1 };
console.log('objB.fn(2):', objB.fn(2)); // "x: 1, y: 2" (still bound to objA)

// Partial application (currying)
console.log('\nPartial Application:');

const sumTwo = (x, y) => x + y;
const increment = sumTwo.bind(null, 1); // Bind first arg to 1
console.log('increment(5):', increment(5)); // 6

const sumThree = (x, y, z) => x + y + z;
const addFive = sumThree.bind(null, 2, 3); // Bind first two args
console.log('addFive(10):', addFive(10)); // 15

function complexCalc(a, b, c) {
  return this.multiplier * (a + b + c);
}

const boundCalc = complexCalc.bind({ multiplier: 2 }, 5); // Bind this and first arg
console.log('boundCalc(3, 4):', boundCalc(3, 4)); // 24 (2 * (5 + 3 + 4))

// Use case: Event handlers
console.log('\nEvent Handler Use Case:');

const button = {
  text: 'Click me',
  clicks: 0,

  click() {
    this.clicks++;
    console.log(`${this.text} clicked ${this.clicks} times`);
  },
};

// Without bind, 'this' would be lost
const handleClick = button.click.bind(button);
handleClick(); // "Click me clicked 1 times"
handleClick(); // "Click me clicked 2 times"

// 7. The toString() Method
console.log('\n7. THE TOSTRING() METHOD:');

function sample(x, y) {
  return x + y;
}

console.log('Function source code:');
console.log(sample.toString());

console.log('\nBuilt-in function:');
console.log(Math.max.toString());

const arrowToString = (a, b) => a * b;
console.log('\nArrow function:');
console.log(arrowToString.toString());

console.log('\n=== FUNCTION() CONSTRUCTOR ===\n');

// 8. The Function() Constructor
console.log('8. THE FUNCTION() CONSTRUCTOR:');

// Basic usage
const multiply = new Function('x', 'y', 'return x * y;');
console.log('multiply(3, 4):', multiply(3, 4)); // 12

// Equivalent traditional function
const multiplyTraditional = function (x, y) {
  return x * y;
};
console.log('multiplyTraditional(3, 4):', multiplyTraditional(3, 4)); // 12

// Multiple parameters
const addThree = new Function('a', 'b', 'c', 'return a + b + c');
console.log('addThree(1, 2, 3):', addThree(1, 2, 3)); // 6

// No parameters
const sayHello = new Function("return 'Hello, World!'");
console.log('sayHello():', sayHello()); // "Hello, World!"

// Dynamic function creation
console.log('\nDynamic Function Creation:');
const operation = '+';
const operations = {
  '+': new Function('a', 'b', 'return a + b'),
  '-': new Function('a', 'b', 'return a - b'),
  '*': new Function('a', 'b', 'return a * b'),
  '/': new Function('a', 'b', 'return a / b'),
};

console.log('5 + 3 =', operations['+'](5, 3));
console.log('5 - 3 =', operations['-'](5, 3));
console.log('5 * 3 =', operations['*'](5, 3));
console.log('5 / 3 =', operations['/'](5, 3));

// 9. Lexical Scoping Issue with Function() Constructor
console.log('\n9. LEXICAL SCOPING ISSUE:');

let scope = 'global';

function constructFunction() {
  let scope = 'local';
  return new Function('return scope'); // Doesn't capture local scope!
}

console.log('constructFunction()():', constructFunction()()); // "global" (not "local"!)

// Compare with regular function
function constructNormalFunction() {
  let scope = 'local';
  return function () {
    return scope;
  }; // Captures local scope
}

console.log('constructNormalFunction()():', constructNormalFunction()()); // "local"

// 10. Performance Issue with Function() Constructor
console.log('\n10. PERFORMANCE CONSIDERATION:');

console.time('Function Constructor');
for (let i = 0; i < 1000; i++) {
  const f = new Function('x', 'return x * 2'); // Recompiled each time!
  f(i);
}
console.timeEnd('Function Constructor');

console.time('Traditional Function');
const traditional = function (x) {
  return x * 2;
};
for (let i = 0; i < 1000; i++) {
  traditional(i); // Defined once, reused
}
console.timeEnd('Traditional Function');

console.log('\n=== COMPARISON: call() vs apply() vs bind() ===\n');

function display(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'Alex' };

// call: invoke immediately with individual arguments
console.log('call():', display.call(user, 'Hello', '!'));

// apply: invoke immediately with array
console.log('apply():', display.apply(user, ['Hello', '!']));

// bind: create new function for later
const boundDisplay = display.bind(user, 'Hello');
console.log('bind():', boundDisplay('!'));

console.log('\n=== PRACTICAL EXAMPLES ===\n');

// Example 1: Method borrowing
console.log('Example 1: Method Borrowing:');

const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const realArray = Array.prototype.slice.call(arrayLike);
console.log('Converted to array:', realArray);

// Example 2: Partial application for configuration
console.log('\nExample 2: Partial Application:');

function apiCall(baseUrl, endpoint, params) {
  return `${baseUrl}${endpoint}?${params}`;
}

const myApiCall = apiCall.bind(null, 'https://api.example.com');
const usersApiCall = myApiCall.bind(null, '/users');

console.log(usersApiCall('page=1&limit=10'));
console.log(myApiCall('/posts', 'sort=date'));

// Example 3: Function composition
console.log('\nExample 3: Function Composition:');

const double = (x) => x * 2;
const square = (x) => x * x;
const addTen = (x) => x + 10;

// Create composite function
function compose(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

const calculate = compose(addTen, square, double);
console.log('calculate(5):', calculate(5)); // ((5 * 2) ^ 2) + 10 = 110

// Example 4: Debounce function
console.log('\nExample 4: Debounce Function:');

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

let searchCount = 0;
function search(query) {
  searchCount++;
  console.log(`Searching for: ${query} (call #${searchCount})`);
}

const debouncedSearch = debounce(search, 300);

// Simulate rapid calls
debouncedSearch('ja');
debouncedSearch('jav');
debouncedSearch('java');
debouncedSearch('javasc');
debouncedSearch('javascript');

setTimeout(() => {
  console.log('Only the last call executed after delay');
}, 500);

console.log('\n=== COMPLETE! ===');
console.log(
  'All function properties, methods, and constructor concepts demonstrated!'
);
