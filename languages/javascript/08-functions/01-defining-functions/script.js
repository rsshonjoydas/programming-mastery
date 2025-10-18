// =============================
// JAVASCRIPT DEFINING FUNCTIONS
// =============================

console.log('=== 1. FUNCTION DECLARATIONS ===\n');

// Basic function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

console.log('Basic function:', greet('Alice'));

// Function that prints (no return value)
function printprops(o) {
  for (let p in o) {
    console.log(`${p}: ${o[p]}`);
  }
}

console.log('\nPrinting object properties:');
printprops({ name: 'John', age: 30, city: 'NYC' });

// Function that computes distance
function distance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

console.log('\nDistance between (0,0) and (3,4):', distance(0, 0, 3, 4));

// Recursive function
function factorial(x) {
  if (x <= 1) return 1;
  return x * factorial(x - 1);
}

console.log('5! =', factorial(5));
console.log('10! =', factorial(10));

// Demonstrating hoisting
console.log('\nHoisting demonstration:');
console.log('Called before definition:', hoistedFunc());

function hoistedFunc() {
  return 'I was hoisted!';
}

// Function with no return statement
function noReturn() {
  console.log('This function has no return statement');
}

console.log('\nFunction without return:', noReturn()); // undefined

console.log('\n=== 2. FUNCTION EXPRESSIONS ===\n');

// Anonymous function expression
const square = function (x) {
  return x * x;
};

console.log('square(5):', square(5));

// Named function expression (useful for recursion)
const fibonacci = function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log('\nFibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(`fib(${i}) = ${fibonacci(i)}`);
}

// Function expression as argument
console.log('\nSorting with function expression:');
let numbers = [3, 1, 4, 1, 5, 9, 2, 6];
let sorted = numbers.sort(function (a, b) {
  return a - b;
});
console.log('Sorted:', sorted);

// Immediately Invoked Function Expression (IIFE)
let tensquared = (function (x) {
  return x * x;
})(10);

console.log('\nIIFE result (10²):', tensquared);

// Demonstrating no hoisting
console.log('\nFunction expressions are NOT hoisted:');
try {
  notHoisted(); // This will fail
} catch (e) {
  console.log('Error:', e.message);
}

const notHoisted = function () {
  return 'Not hoisted!';
};

console.log('After definition:', notHoisted());

// Using const vs let/var
console.log('\nBest practice: use const for function expressions');
const constFunc = function () {
  return "I'm constant";
};
console.log(constFunc());
// constFunc = function() {}; // Error: Assignment to constant variable

console.log('\n=== 3. ARROW FUNCTIONS ===\n');

// Basic arrow function
const add = (x, y) => {
  return x + y;
};
console.log('add(3, 5):', add(3, 5));

// Implicit return (single expression)
const subtract = (x, y) => x - y;
console.log('subtract(10, 3):', subtract(10, 3));

// Single parameter (no parentheses)
const double = (x) => x * 2;
const polynomial = (x) => x * x + 2 * x + 3;

console.log('\ndouble(7):', double(7));
console.log('polynomial(2):', polynomial(2));

// No parameters (empty parentheses required)
const getRandom = () => Math.random();
const getFortyTwo = () => 42;

console.log('\ngetRandom():', getRandom());
console.log('getFortyTwo():', getFortyTwo());

// Returning object literals (requires parentheses)
const makePerson = (name, age) => ({ name: name, age: age });
const makePoint = (x, y) => ({ x, y }); // ES6 shorthand

console.log("\nmakePerson('Alice', 30):", makePerson('Alice', 30));
console.log('makePoint(5, 10):', makePoint(5, 10));

// Common mistakes
console.log('\nCommon arrow function mistakes:');
// const wrong1 = x => { value: x };  // Returns undefined!
// const wrong2 = x => { v: x, w: x }; // Syntax error!

const correct1 = (x) => ({ value: x });
const correct2 = (x) => {
  return { value: x };
};
console.log('Correct object return:', correct1(42));

// Arrow functions with array methods
console.log('\nArrow functions with array methods:');

let nums = [1, null, 2, 3, null, 4];
let filtered = nums.filter((x) => x !== null);
console.log('Filtered:', filtered);

let squared = [1, 2, 3, 4].map((x) => x * x);
console.log('Squared:', squared);

let sum = [1, 2, 3, 4, 5].reduce((acc, x) => acc + x, 0);
console.log('Sum:', sum);

let sortedDesc = [3, 1, 4, 1, 5, 9].sort((a, b) => b - a);
console.log('Sorted descending:', sortedDesc);

// Arrow functions and 'this' context
console.log("\nArrow functions inherit 'this':");

function Timer() {
  this.seconds = 0;
  this.interval = null;

  this.start = function () {
    // Arrow function inherits 'this' from Timer
    this.interval = setInterval(() => {
      this.seconds++;
      console.log(`Timer: ${this.seconds} seconds`);
    }, 1000);
  };

  this.stop = function () {
    clearInterval(this.interval);
    console.log(`Timer stopped at ${this.seconds} seconds`);
  };
}

// Uncomment to test timer (runs for 3 seconds)
/*
let timer = new Timer();
timer.start();
setTimeout(() => timer.stop(), 3000);
*/

// Arrow functions cannot be constructors
console.log('\nArrow functions cannot be constructors:');
const ArrowFunc = () => {};
try {
  new ArrowFunc(); // This will fail
} catch (e) {
  console.log('Error:', e.message);
}

console.log('\n=== 4. NESTED FUNCTIONS ===\n');

// Basic nested function
function hypotenuse(a, b) {
  function square(x) {
    return x * x;
  }
  return Math.sqrt(square(a) + square(b));
}

console.log('hypotenuse(3, 4):', hypotenuse(3, 4));

// Nested function with closure
function outer(x) {
  let outerVar = 10;

  function inner(y) {
    // Can access x, outerVar, and y
    return x + y + outerVar;
  }

  return inner(5);
}

console.log('\nClosure example:', outer(3)); // 18

// Multiple nested levels
function level1(a) {
  console.log('Level 1, a =', a);

  function level2(b) {
    console.log('Level 2, b =', b);

    function level3(c) {
      console.log('Level 3, c =', c);
      return a + b + c; // Can access all parameters
    }

    return level3(3);
  }

  return level2(2);
}

console.log('\nMultiple nesting levels:');
console.log('Result:', level1(1));

// Practical example: Counter with private variable
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getValue: function () {
      return count;
    },
  };
}

console.log('\nCounter with closure:');
let counter = createCounter();
console.log('Initial:', counter.getValue());
console.log('Increment:', counter.increment());
console.log('Increment:', counter.increment());
console.log('Decrement:', counter.decrement());
console.log('Final:', counter.getValue());

console.log('\n=== 5. METHOD DEFINITION SHORTHAND ===\n');

// Object literal with method shorthand
let calculator = {
  // Traditional method definition
  add: function (x, y) {
    return x + y;
  },

  // ES6 shorthand
  subtract(x, y) {
    return x - y;
  },

  multiply(x, y) {
    return x * y;
  },

  divide(x, y) {
    if (y === 0) throw new Error('Division by zero');
    return x / y;
  },
};

console.log('calculator.add(10, 5):', calculator.add(10, 5));
console.log('calculator.subtract(10, 5):', calculator.subtract(10, 5));
console.log('calculator.multiply(10, 5):', calculator.multiply(10, 5));
console.log('calculator.divide(10, 5):', calculator.divide(10, 5));

// Getter and setter methods
let person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },

  get initials() {
    return `${this.firstName[0]}.${this.lastName[0]}.`;
  },
};

console.log('\nGetter/Setter example:');
console.log('Full name:', person.fullName);
console.log('Initials:', person.initials);

person.fullName = 'Jane Smith';
console.log('After setting full name:');
console.log('First name:', person.firstName);
console.log('Last name:', person.lastName);
console.log('Full name:', person.fullName);

console.log('\n=== 6. GENERATOR FUNCTIONS ===\n');

// Generator function
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

console.log('Generator function:');
let generator = generateSequence();
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
console.log(generator.next().value); // 3

// Generator with infinite sequence
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

console.log('\nInfinite ID generator:');
let ids = idGenerator();
console.log('ID:', ids.next().value);
console.log('ID:', ids.next().value);
console.log('ID:', ids.next().value);

console.log('\n=== 7. ASYNC FUNCTIONS ===\n');

// Async function (simulated with Promise)
async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'Test Data' });
    }, 100);
  });
}

console.log('Async function example:');
fetchData().then((data) => {
  console.log('Fetched data:', data);
});

// Async with await
async function processData() {
  console.log('\nProcessing data...');
  let data = await fetchData();
  console.log('Data received:', data);
  return data;
}

processData();

console.log('\n=== 8. COMPARISON OF ALL METHODS ===\n');

// Declaration
function declared(x) {
  return x * 2;
}

// Expression
const expressed = function (x) {
  return x * 2;
};

// Arrow
const arrowed = (x) => x * 2;

// Named expression
const namedExpr = function named(x) {
  return x * 2;
};

console.log('Declaration:', declared(5));
console.log('Expression:', expressed(5));
console.log('Arrow:', arrowed(5));
console.log('Named expression:', namedExpr(5));

console.log('\n=== 9. PRACTICAL EXAMPLES ===\n');

// Example 1: Utility functions
console.log('Example 1: Utility functions');

const utils = {
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  },
};

console.log('clamp(15, 0, 10):', utils.clamp(15, 0, 10));
console.log('randomInt(1, 10):', utils.randomInt(1, 10));
console.log('chunk([1,2,3,4,5,6], 2):', utils.chunk([1, 2, 3, 4, 5, 6], 2));

// Example 2: Function composition
console.log('\nExample 2: Function composition');

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

const addOne = (x) => x + 1;
const multiplyByTwo = (x) => x * 2;
const subtractThree = (x) => x - 3;

const composed = compose(subtractThree, multiplyByTwo, addOne);
console.log('compose(subtract3, multiply2, add1)(5):', composed(5)); // (5+1)*2-3 = 9

// Example 3: Callback patterns
console.log('\nExample 3: Callback patterns');

function processArray(arr, callback) {
  const result = [];
  for (let item of arr) {
    result.push(callback(item));
  }
  return result;
}

let values = [1, 2, 3, 4, 5];
let doubled = processArray(values, (x) => x * 2);
let stringified = processArray(values, (x) => `Value: ${x}`);

console.log('Doubled:', doubled);
console.log('Stringified:', stringified);

console.log('\n=== COMPLETE! ===');
console.log('All function definition methods demonstrated successfully!');
