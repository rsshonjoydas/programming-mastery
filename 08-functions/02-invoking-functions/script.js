// ==============================
// JAVASCRIPT FUNCTION INVOCATION
// ==============================

console.log('=== 1. FUNCTION INVOCATION ===\n');

// Basic function invocation
function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

console.log('Function calls:');
console.log(greet('Alice'));
console.log('2 + 3 =', add(2, 3));

// Multiple function calls in expression
function distance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

let total = distance(0, 0, 2, 1) + distance(2, 1, 3, 5);
console.log('\nTotal distance:', total);

let probability = factorial(5) / factorial(13);
console.log('Probability:', probability);

// Return values
function noReturn() {
  console.log('Function without return');
}

function emptyReturn() {
  return;
}

function explicitReturn() {
  return 'Explicit value';
}

console.log('\nReturn values:');
console.log('noReturn():', noReturn()); // undefined
console.log('emptyReturn():', emptyReturn()); // undefined
console.log('explicitReturn():', explicitReturn()); // "Explicit value"

console.log("\n=== 2. THE 'this' CONTEXT IN FUNCTIONS ===\n");

// Non-strict mode vs strict mode
function showThis() {
  console.log('this in regular function:', this);
  console.log('typeof this:', typeof this);
}

(function () {
  'use strict';
  function strictThis() {
    console.log('this in strict mode:', this);
  }
  strictThis();
})();

// Arrow function inherits this
let obj = {
  value: 42,
  regularFunc: function () {
    console.log('\nInside regularFunc, this.value:', this.value);

    // Arrow function inherits this from outer scope
    const arrowFunc = () => {
      console.log('Inside arrowFunc, this.value:', this.value);
    };
    arrowFunc();
  },
};
obj.regularFunc();

// Detecting strict mode
const isStrict = (function () {
  return !this;
})();
console.log('\nAre we in strict mode?', isStrict);

console.log('\n=== 3. CONDITIONAL INVOCATION (ES2020) ===\n');

let callback = null;
console.log('callback is null');
console.log('callback?.():', callback?.()); // undefined, no error

callback = () => 'Function called!';
console.log('\ncallback assigned');
console.log('callback?.():', callback?.());

// Practical example
function processData(data, formatter) {
  console.log('\nProcessing data:', data);
  let result = formatter?.(data) ?? data; // Use formatter if provided
  return result;
}

console.log('Without formatter:', processData(42));
console.log(
  'With formatter:',
  processData(42, (x) => x * 2)
);

console.log('\n=== 4. RECURSIVE FUNCTIONS AND CALL STACK ===\n');

// Simple recursion
console.log('Factorial examples:');
console.log('factorial(5):', factorial(5));
console.log('factorial(10):', factorial(10));

// Fibonacci with recursion
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('\nFibonacci sequence:');
for (let i = 0; i <= 10; i++) {
  console.log(`fib(${i}) = ${fibonacci(i)}`);
}

// Stack depth warning example
console.log('\nTesting stack limits:');
let maxDepth = 0;
function testStack(depth) {
  maxDepth = Math.max(maxDepth, depth);
  if (depth < 1000) {
    testStack(depth + 1);
  }
}
testStack(0);
console.log('Safely reached depth:', maxDepth);

console.log('\n=== 5. METHOD INVOCATION ===\n');

// Basic method
let calculator = {
  operand1: 5,
  operand2: 3,

  add() {
    console.log('this in add():', this);
    this.result = this.operand1 + this.operand2;
    return this.result;
  },

  subtract() {
    this.result = this.operand1 - this.operand2;
    return this.result;
  },
};

console.log('calculator.add():', calculator.add());
console.log('calculator.subtract():', calculator.subtract());

// Different method invocation syntaxes
let methods = {
  m: function (x) {
    return `Method m called with ${x}`;
  },
};

console.log('\nMethod invocation syntaxes:');
console.log('methods.m(10):', methods.m(10));
console.log("methods['m'](20):", methods['m'](20));

// Array of functions
let funcs = [
  function () {
    return 'First function';
  },
  function () {
    return 'Second function';
  },
];
console.log('funcs[0]():', funcs[0]());
console.log('funcs[1]():', funcs[1]());

// Complex property access
let customer = {
  name: 'john doe',
  getName() {
    return this.name.toUpperCase(); // Method on string property
  },
};
console.log('\ncustomer.getName():', customer.getName());

console.log('\n=== 6. METHOD CHAINING ===\n');

class Shape {
  constructor() {
    this._x = 0;
    this._y = 0;
    this._size = 0;
    this._color = 'black';
  }

  x(val) {
    this._x = val;
    return this; // Return this for chaining
  }

  y(val) {
    this._y = val;
    return this;
  }

  size(val) {
    this._size = val;
    return this;
  }

  color(val) {
    this._color = val;
    return this;
  }

  draw() {
    console.log(
      `Drawing ${this._color} shape at (${this._x}, ${this._y}) with size ${this._size}`
    );
    return this;
  }
}

console.log('Method chaining example:');
new Shape().x(100).y(50).size(25).color('red').draw();

// Promise chaining example
console.log('\nPromise chaining:');
Promise.resolve(5)
  .then((x) => {
    console.log('Step 1:', x);
    return x * 2;
  })
  .then((x) => {
    console.log('Step 2:', x);
    return x + 10;
  })
  .then((x) => {
    console.log('Step 3:', x);
  })
  .catch((err) => console.error('Error:', err));

console.log("\n=== 7. NESTED FUNCTIONS AND 'this' PROBLEM ===\n");

let testObj = {
  value: 42,

  // Problem: nested function loses this
  problemMethod: function () {
    console.log('Outer this.value:', this.value);

    function inner() {
      console.log('Inner this.value:', this?.value); // undefined!
      console.log(
        'Inner this is global/undefined:',
        this === undefined || this === global
      );
    }
    inner();
  },

  // Solution 1: Save this in variable
  solution1: function () {
    console.log("\nSolution 1 - Save 'this':");
    let self = this;

    function inner() {
      console.log('Inner using self.value:', self.value);
    }
    inner();
  },

  // Solution 2: Arrow function
  solution2: function () {
    console.log('\nSolution 2 - Arrow function:');

    const inner = () => {
      console.log('Inner using this.value:', this.value);
    };
    inner();
  },

  // Solution 3: bind()
  solution3: function () {
    console.log('\nSolution 3 - bind():');

    const inner = function () {
      console.log('Inner using this.value:', this.value);
    }.bind(this);

    inner();
  },
};

console.log("Demonstrating the 'this' problem:");
testObj.problemMethod();
testObj.solution1();
testObj.solution2();
testObj.solution3();

console.log('\n=== 8. CONSTRUCTOR INVOCATION ===\n');

// Basic constructor
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
  };
}

let person1 = new Person('Alice', 30);
let person2 = new Person('Bob', 25);

console.log('person1:', person1.greet());
console.log('person2:', person2.greet());

// Parentheses optional with no arguments
function Empty() {
  this.created = new Date();
}

let obj1 = new Empty();
let obj2 = new Empty(); // Parentheses omitted
console.log('\nBoth work:', obj1.created, obj2.created);

// Constructor return behavior
console.log('\nConstructor return behavior:');

function ReturnsNothing() {
  this.x = 1;
}
let test1 = new ReturnsNothing();
console.log('Returns nothing - test1.x:', test1.x);

function ReturnsObject() {
  this.x = 1;
  return { y: 2 };
}
let test2 = new ReturnsObject();
console.log('Returns object - test2:', test2); // {y: 2}

function ReturnsPrimitive() {
  this.x = 1;
  return 42;
}
let test3 = new ReturnsPrimitive();
console.log('Returns primitive - test3.x:', test3.x); // 1

// ES6 Class
class Animal {
  constructor(species, sound) {
    this.species = species;
    this.sound = sound;
  }

  makeSound() {
    return `${this.species} says ${this.sound}`;
  }
}

let dog = new Animal('Dog', 'Woof');
console.log('\n' + dog.makeSound());

console.log('\n=== 9. INDIRECT INVOCATION (call/apply) ===\n');

function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

let person = { name: 'Alice' };
let anotherPerson = { name: 'Bob' };

// Using call()
console.log('Using call():');
console.log(introduce.call(person, 'Hello', '!'));
console.log(introduce.call(anotherPerson, 'Hi', '.'));

// Using apply()
console.log('\nUsing apply():');
console.log(introduce.apply(person, ['Hey', '?']));
console.log(introduce.apply(anotherPerson, ['Greetings', '...']));

// Borrowing methods
let obj1Array = {
  values: [1, 2, 3, 4, 5],
  sum: function () {
    return this.values.reduce((a, b) => a + b, 0);
  },
};

let obj2Array = {
  values: [10, 20, 30],
};

console.log('\nBorrowing methods:');
console.log('obj1Array.sum():', obj1Array.sum());
console.log('Borrowed by obj2Array:', obj1Array.sum.call(obj2Array));

// Finding max with apply
let numbers = [5, 2, 9, 1, 7, 15, 3];
let max = Math.max.apply(null, numbers);
console.log('\nMax value using apply:', max);

// Modern alternative with spread
let max2 = Math.max(...numbers);
console.log('Max value using spread:', max2);

console.log('\n=== 10. IMPLICIT FUNCTION INVOCATION ===\n');

// Getters and Setters
console.log('Getters and Setters:');
let account = {
  _balance: 1000,

  get balance() {
    console.log('  Getter called');
    return this._balance;
  },

  set balance(value) {
    console.log('  Setter called with', value);
    if (value >= 0) {
      this._balance = value;
    }
  },
};

let bal = account.balance; // Implicit getter call
account.balance = 1500; // Implicit setter call
console.log('Final balance:', account.balance);

// toString() and valueOf()
console.log('\ntoString() and valueOf():');
let customObj = {
  value: 42,

  toString() {
    console.log('  toString() called');
    return 'CustomObject';
  },

  valueOf() {
    console.log('  valueOf() called');
    return this.value;
  },
};

console.log('String context: ' + customObj); // Calls toString()
console.log('Numeric context:', customObj + 10); // Calls valueOf()

// Iterator
console.log('\nIterator:');
let counter = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next() {
        count++;
        if (count <= 3) {
          return { value: count, done: false };
        }
        return { done: true };
      },
    };
  },
};

console.log('Iterating with for...of:');
for (let num of counter) {
  console.log('  Value:', num);
}

// Tagged template literal
console.log('\nTagged template literal:');
function highlight(strings, ...values) {
  console.log('  Template function called');
  console.log('  Strings:', strings);
  console.log('  Values:', values);

  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

let name = 'Alice';
let age = 30;
let result = highlight`Name: ${name}, Age: ${age}`;
console.log('Result:', result);

// Proxy
console.log('\nProxy:');
let handler = {
  get(target, property) {
    console.log(`  Getting property: ${property}`);
    return target[property];
  },

  set(target, property, value) {
    console.log(`  Setting property: ${property} = ${value}`);
    target[property] = value;
    return true;
  },
};

let proxyTarget = { x: 1, y: 2 };
let proxy = new Proxy(proxyTarget, handler);

console.log('Accessing proxy.x:', proxy.x);
proxy.z = 3;
console.log('After setting, proxy.z:', proxy.z);

console.log('\n=== 11. COMPARISON OF INVOCATION TYPES ===\n');

function testFunction() {
  return this;
}

let testMethod = {
  method: testFunction,
};

console.log('Function invocation - this:');
let funcResult = testFunction();
console.log(
  '  Is undefined or global?',
  funcResult === undefined || funcResult === global
);

console.log('\nMethod invocation - this:');
let methodResult = testMethod.method();
console.log('  this === testMethod?', methodResult === testMethod);

console.log('\nConstructor invocation - this:');
function TestConstructor() {
  this.created = true;
  console.log('  this is new object with created:', this.created);
}
new TestConstructor();

console.log('\nIndirect invocation - this:');
let customThis = { name: 'Custom' };
testFunction.call(customThis);
console.log('  Explicitly set this to:', customThis);

console.log('\n=== COMPLETE! ===');
console.log('All function invocation methods demonstrated successfully!');
