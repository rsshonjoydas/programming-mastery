// ==============================
// JAVASCRIPT FUNCTIONS AS VALUES
// ==============================

console.log('=== 1. FUNCTIONS AS VARIABLES ===\n');

// Define a function
function square(x) {
  return x * x;
}

// Assign function to another variable
let s = square;
console.log('square(4):', square(4)); // 16
console.log('s(4):', s(4)); // 16
console.log('s === square:', s === square); // true (same function object)

// Functions can be reassigned
let calculate = square;
calculate = function (x) {
  return x * 2;
};
console.log('calculate(4):', calculate(4)); // 8

console.log('\n=== 2. FUNCTIONS AS OBJECT PROPERTIES (METHODS) ===\n');

// Function as object property
let mathOps = {
  square: function (x) {
    return x * x;
  },
  cube: function (x) {
    return x * x * x;
  },
  // ES6 shorthand
  double(x) {
    return x * 2;
  },
};

console.log('mathOps.square(5):', mathOps.square(5)); // 25
console.log('mathOps.cube(3):', mathOps.cube(3)); // 27
console.log('mathOps.double(7):', mathOps.double(7)); // 14

console.log('\n=== 3. FUNCTIONS IN ARRAYS ===\n');

// Store functions in array
let operations = [
  (x) => x * x, // Square
  (x) => x * x * x, // Cube
  (x) => Math.sqrt(x), // Square root
  (x) => x * 2, // Double
];

console.log('operations[0](5) - square:', operations[0](5)); // 25
console.log('operations[1](3) - cube:', operations[1](3)); // 27
console.log('operations[2](16) - sqrt:', operations[2](16)); // 4
console.log('operations[3](10) - double:', operations[3](10)); // 20

// Complex example
let a = [(x) => x * x, 20];
console.log('\nArray [function, 20]');
console.log('a[0](a[1]):', a[0](a[1])); // 400

console.log('\n=== 4. FUNCTIONS AS ARGUMENTS (HIGHER-ORDER) ===\n');

// Basic math operations
function add(x, y) {
  return x + y;
}
function subtract(x, y) {
  return x - y;
}
function multiply(x, y) {
  return x * y;
}
function divide(x, y) {
  return x / y;
}

// Higher-order function
function operate(operator, operand1, operand2) {
  return operator(operand1, operand2);
}

console.log('operate(add, 5, 3):', operate(add, 5, 3)); // 8
console.log('operate(multiply, 4, 7):', operate(multiply, 4, 7)); // 28

// Nested operations: (2+3) + (4*5)
let result = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));
console.log('(2+3) + (4*5):', result); // 25

// Array.sort() example
console.log('\nArray.sort() with custom comparator:');
let numbers = [3, 1, 4, 1, 5, 9, 2, 6];
console.log('Original:', numbers);

let ascending = [...numbers].sort((a, b) => a - b);
console.log('Ascending:', ascending);

let descending = [...numbers].sort((a, b) => b - a);
console.log('Descending:', descending);

console.log('\n=== 5. OPERATORS OBJECT EXAMPLE ===\n');

const operators = {
  add: (x, y) => x + y,
  subtract: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
  pow: Math.pow, // Reference existing function
  mod: (x, y) => x % y,
};

function operate2(operation, operand1, operand2) {
  if (typeof operators[operation] === 'function') {
    return operators[operation](operand1, operand2);
  } else {
    throw new Error('unknown operator');
  }
}

console.log("operate2('add', 10, 5):", operate2('add', 10, 5));
console.log("operate2('pow', 2, 8):", operate2('pow', 2, 8));
console.log("operate2('mod', 17, 5):", operate2('mod', 17, 5));

// String concatenation
let greeting = operate2('add', 'hello', operate2('add', ' ', 'world'));
console.log('String operation:', greeting);

console.log('\n=== 6. FUNCTION PROPERTIES (STATIC VARIABLES) ===\n');

// Example 1: Unique integer generator
uniqueInteger.counter = 0;

function uniqueInteger() {
  return uniqueInteger.counter++;
}

console.log('Unique integers:');
console.log(uniqueInteger()); // 0
console.log(uniqueInteger()); // 1
console.log(uniqueInteger()); // 2
console.log(uniqueInteger()); // 3

// Check the counter property
console.log('Counter value:', uniqueInteger.counter); // 4

console.log('\n=== 7. MEMOIZATION (CACHING) ===\n');

// Factorial with caching
function factorial(n) {
  if (Number.isInteger(n) && n > 0) {
    if (!(n in factorial)) {
      console.log(`  Computing factorial(${n})`);
      factorial[n] = n * factorial(n - 1);
    } else {
      console.log(`  Using cached factorial(${n})`);
    }
    return factorial[n];
  } else {
    return NaN;
  }
}

factorial[1] = 1; // Base case

console.log('Computing factorial(6):');
console.log('Result:', factorial(6)); // 720

console.log('\nComputing factorial(5) (should use cache):');
console.log('Result:', factorial(5)); // 120

console.log('\nComputing factorial(7) (computes only 7):');
console.log('Result:', factorial(7)); // 5040

console.log('\nCached values:', {
  'factorial[3]': factorial[3],
  'factorial[4]': factorial[4],
  'factorial[5]': factorial[5],
  'factorial[6]': factorial[6],
});

console.log('\n=== 8. CALLBACK FUNCTIONS ===\n');

// Array methods with callbacks
let nums = [1, 2, 3, 4, 5];

console.log('Original array:', nums);

let doubled = nums.map((n) => n * 2);
console.log('Doubled (map):', doubled);

let evens = nums.filter((n) => n % 2 === 0);
console.log('Evens (filter):', evens);

let sum = nums.reduce((acc, n) => acc + n, 0);
console.log('Sum (reduce):', sum);

// Custom forEach-like function
function forEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

console.log('\nCustom forEach:');
forEach([10, 20, 30], (value, index) => {
  console.log(`  Index ${index}: ${value}`);
});

console.log('\n=== 9. FUNCTION FACTORIES ===\n');

// Function that returns a function
function makeMultiplier(factor) {
  return function (x) {
    return x * factor;
  };
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);
let quadruple = makeMultiplier(4);

console.log('double(5):', double(5)); // 10
console.log('triple(5):', triple(5)); // 15
console.log('quadruple(5):', quadruple(5)); // 20

// Another factory example
function makeGreeter(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

let sayHello = makeGreeter('Hello');
let sayHi = makeGreeter('Hi');

console.log('\n' + sayHello('Alice')); // Hello, Alice!
console.log(sayHi('Bob')); // Hi, Bob!

console.log('\n=== 10. STRATEGY PATTERN ===\n');

const paymentStrategies = {
  credit: (amount) => {
    let fee = amount * 0.03;
    console.log(`  Credit card: $${amount} + $${fee.toFixed(2)} fee`);
    return amount + fee;
  },
  debit: (amount) => {
    let fee = amount * 0.01;
    console.log(`  Debit card: $${amount} + $${fee.toFixed(2)} fee`);
    return amount + fee;
  },
  cash: (amount) => {
    console.log(`  Cash: $${amount} (no fee)`);
    return amount;
  },
  crypto: (amount) => {
    let fee = amount * 0.005;
    console.log(`  Crypto: $${amount} + $${fee.toFixed(2)} fee`);
    return amount + fee;
  },
};

function processPayment(method, amount) {
  if (paymentStrategies[method]) {
    return paymentStrategies[method](amount);
  }
  throw new Error(`Unknown payment method: ${method}`);
}

console.log('Processing payments:');
console.log('Total:', processPayment('credit', 100));
console.log('Total:', processPayment('cash', 100));
console.log('Total:', processPayment('crypto', 100));

console.log('\n=== 11. FUNCTION COMPOSITION ===\n');

const compose = (f, g) => (x) => f(g(x));

const addOne = (x) => x + 1;
const multiplyByTwo = (x) => x * 2;
const squared = (x) => x * x;

const addOneThenDouble = compose(multiplyByTwo, addOne);
const doubleThenSquare = compose(squared, multiplyByTwo);

console.log('addOneThenDouble(5):', addOneThenDouble(5)); // 12
console.log('doubleThenSquare(3):', doubleThenSquare(3)); // 36

// Multiple composition
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const complexCalc = pipe(
  (x) => x + 5,
  (x) => x * 2,
  (x) => x - 3
);

console.log('complexCalc(10):', complexCalc(10)); // 27

console.log('\n=== 12. ANONYMOUS FUNCTIONS ===\n');

// In arrays
let actions = [
  function () {
    console.log('  Action 1');
  },
  function () {
    console.log('  Action 2');
  },
  () => console.log('  Action 3'),
];

console.log('Executing anonymous functions:');
actions[0]();
actions[1]();
actions[2]();

// As immediate callbacks
console.log('\nImmediate execution (IIFE):');
(function () {
  console.log('  I run immediately!');
})();

(function (name) {
  console.log(`  Hello, ${name}!`);
})('World');

console.log('\n=== 13. PRACTICAL EXAMPLE: CALCULATOR ===\n');

function createCalculator() {
  const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
    '**': (a, b) => a ** b,
  };

  return {
    calculate(op, a, b) {
      if (operations[op]) {
        return operations[op](a, b);
      }
      throw new Error(`Unknown operation: ${op}`);
    },
    addOperation(symbol, fn) {
      operations[symbol] = fn;
    },
  };
}

let calc = createCalculator();
console.log('10 + 5 =', calc.calculate('+', 10, 5));
console.log('10 * 5 =', calc.calculate('*', 10, 5));
console.log('2 ** 8 =', calc.calculate('**', 2, 8));

// Add custom operation
calc.addOperation('avg', (a, b) => (a + b) / 2);
console.log('avg(10, 20) =', calc.calculate('avg', 10, 20));

console.log('\n=== 14. TIMER WITH FUNCTION COUNTER ===\n');

function createTimer() {
  createTimer.callCount = createTimer.callCount || 0;
  createTimer.callCount++;

  return {
    id: createTimer.callCount,
    start: Date.now(),
    elapsed() {
      return Date.now() - this.start;
    },
  };
}

let timer1 = createTimer();
let timer2 = createTimer();
let timer3 = createTimer();

console.log('Timer IDs:', timer1.id, timer2.id, timer3.id);
console.log('Total timers created:', createTimer.callCount);

console.log('\n=== 15. COMPARISON: FUNCTIONS VS OTHER VALUES ===\n');

let num = 42;
let str = 'hello';
let obj = { x: 1 };
let fn = function () {
  return "I'm a function";
};

console.log('typeof num:', typeof num);
console.log('typeof str:', typeof str);
console.log('typeof obj:', typeof obj);
console.log('typeof fn:', typeof fn);

console.log('\nFunctions are callable:');
console.log('fn():', fn());

console.log('\nFunctions can have properties:');
fn.customProp = 'custom value';
console.log('fn.customProp:', fn.customProp);

console.log('\n=== COMPLETE! ===');
console.log('All functions-as-values concepts demonstrated successfully!');
