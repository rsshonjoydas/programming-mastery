// ============================
// JAVASCRIPT FUNCTION CLOSURES
// ============================

console.log('=== 1. UNDERSTANDING LEXICAL SCOPING ===\n');

// Example 1: Same scope invocation
let scope = 'global scope';

function checkscope1() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f(); // Invoke f() inside checkscope
}

console.log('Same scope invocation:');
console.log('checkscope1():', checkscope1()); // "local scope"

// Example 2: Different scope invocation (TRUE CLOSURE)
function checkscope2() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f; // Return function itself
}

console.log('\nDifferent scope invocation (closure):');
let s = checkscope2();
console.log('typeof s:', typeof s); // "function"
console.log('s():', s()); // "local scope" - closure in action!

// Reset global scope variable to show closure captures local
scope = 'global scope (reset)';
console.log('Global scope:', scope);
console.log('s() still returns:', s()); // Still "local scope"!

console.log('\n=== 2. CLOSURES FOR PRIVATE STATE ===\n');

// Private counter using IIFE
let uniqueInteger = (function () {
  let counter = 0; // Private variable
  return function () {
    return counter++;
  };
})();

console.log('Private counter:');
console.log('uniqueInteger():', uniqueInteger()); // 0
console.log('uniqueInteger():', uniqueInteger()); // 1
console.log('uniqueInteger():', uniqueInteger()); // 2
console.log('uniqueInteger():', uniqueInteger()); // 3

// Try to access counter directly
console.log('\nTrying to access counter directly:');
console.log('typeof counter:', typeof counter); // "undefined" - private!

console.log('\n=== 3. MULTIPLE CLOSURES SHARING STATE ===\n');

function counter() {
  let n = 0; // Private variable

  return {
    count: function () {
      return n++;
    },
    reset: function () {
      n = 0;
    },
  };
}

let c = counter();
let d = counter();

console.log('Counter c:');
console.log('c.count():', c.count()); // 0
console.log('c.count():', c.count()); // 1
console.log('c.count():', c.count()); // 2

console.log('\nCounter d (independent):');
console.log('d.count():', d.count()); // 0
console.log('d.count():', d.count()); // 1

console.log('\nReset c:');
c.reset();
console.log('c.count() after reset:', c.count()); // 0

console.log('\nd is unaffected:');
console.log('d.count():', d.count()); // 2

console.log('\n=== 4. CLOSURES WITH GETTERS AND SETTERS ===\n');

function counterWithAccessors(n) {
  return {
    get count() {
      return n++;
    },
    set count(m) {
      if (m > n) {
        n = m;
      } else {
        throw Error('count can only be set to a larger value');
      }
    },
  };
}

let c2 = counterWithAccessors(1000);
console.log('Initial count:', c2.count); // 1000
console.log('Next count:', c2.count); // 1001
console.log('Next count:', c2.count); // 1002

console.log('\nSetting count to 2000:');
c2.count = 2000;
console.log('Count after setting:', c2.count); // 2000

console.log('\nTrying to set count to smaller value:');
try {
  c2.count = 1999;
} catch (e) {
  console.log('Error caught:', e.message);
}

console.log('\n=== 5. PRIVATE PROPERTY ACCESSOR ===\n');

function addPrivateProperty(o, name, predicate) {
  let value; // Private variable

  // Getter method
  o[`get${name}`] = function () {
    return value;
  };

  // Setter method with validation
  o[`set${name}`] = function (v) {
    if (predicate && !predicate(v)) {
      throw new TypeError(`set${name}: invalid value ${v}`);
    } else {
      value = v;
    }
  };
}

let person = {};
addPrivateProperty(person, 'Name', (x) => typeof x === 'string');
addPrivateProperty(person, 'Age', (x) => typeof x === 'number' && x > 0);

console.log('Setting valid values:');
person.setName('Frank');
person.setAge(30);
console.log('getName():', person.getName());
console.log('getAge():', person.getAge());

console.log('\nTrying to set invalid name (number):');
try {
  person.setName(123);
} catch (e) {
  console.log('Error:', e.message);
}

console.log('\nTrying to set invalid age (negative):');
try {
  person.setAge(-5);
} catch (e) {
  console.log('Error:', e.message);
}

console.log('\n=== 6. CLOSURE PITFALL: LOOPS WITH VAR ===\n');

// WRONG: All closures share the same variable
function constfuncsWrong() {
  let funcs = [];

  for (var i = 0; i < 10; i++) {
    funcs[i] = () => i;
  }

  return funcs;
}

let wrongFuncs = constfuncsWrong();
console.log('Using var in loop (WRONG):');
console.log('wrongFuncs[0]():', wrongFuncs[0]()); // 10 (not 0!)
console.log('wrongFuncs[5]():', wrongFuncs[5]()); // 10 (not 5!)
console.log('wrongFuncs[9]():', wrongFuncs[9]()); // 10 (correct by accident)
console.log("All functions return 10 because they share the same 'i'");

console.log('\n=== 7. SOLUTION 1: USE LET/CONST ===\n');

function constfuncsCorrect() {
  let funcs = [];

  for (let i = 0; i < 10; i++) {
    // Use let instead of var
    funcs[i] = () => i;
  }

  return funcs;
}

let correctFuncs = constfuncsCorrect();
console.log('Using let in loop (CORRECT):');
console.log('correctFuncs[0]():', correctFuncs[0]()); // 0
console.log('correctFuncs[5]():', correctFuncs[5]()); // 5
console.log('correctFuncs[9]():', correctFuncs[9]()); // 9
console.log("Each function has its own 'i' binding");

console.log('\n=== 8. SOLUTION 2: CREATE SEPARATE CLOSURES ===\n');

function constfunc(v) {
  return () => v;
}

let funcs = [];
for (var i = 0; i < 10; i++) {
  funcs[i] = constfunc(i); // Each call creates new scope
}

console.log('Creating separate closures:');
console.log('funcs[0]():', funcs[0]()); // 0
console.log('funcs[5]():', funcs[5]()); // 5
console.log('funcs[9]():', funcs[9]()); // 9

console.log("\n=== 9. CLOSURES AND 'this' KEYWORD ===\n");

// Arrow functions inherit this
const obj1 = {
  name: 'Object1',

  method() {
    console.log('Arrow function (inherits this):');
    const inner = () => {
      console.log('  this.name:', this.name);
    };
    inner();
  },
};

obj1.method();

// Regular functions don't inherit this
const obj2 = {
  name: 'Object2',

  method() {
    console.log("\nRegular function (doesn't inherit this):");
    const inner = function () {
      console.log('  this:', this);
      console.log('  this.name:', this?.name);
    };
    inner();
  },
};

obj2.method();

// Solution: Save this to a variable
const obj3 = {
  name: 'Object3',

  method() {
    console.log("\nSaving this to 'self' variable:");
    const self = this;
    const inner = function () {
      console.log('  self.name:', self.name);
    };
    inner();
  },
};

obj3.method();

console.log('\n=== 10. PRACTICAL USE CASE: BANK ACCOUNT ===\n');

function createBankAccount(initialBalance) {
  let balance = initialBalance;
  let transactionHistory = [];

  return {
    deposit(amount) {
      if (amount <= 0) {
        throw Error('Deposit amount must be positive');
      }
      balance += amount;
      transactionHistory.push({ type: 'deposit', amount, balance });
      console.log(`  Deposited $${amount}. New balance: $${balance}`);
      return balance;
    },

    withdraw(amount) {
      if (amount <= 0) {
        throw Error('Withdrawal amount must be positive');
      }
      if (amount > balance) {
        throw Error('Insufficient funds');
      }
      balance -= amount;
      transactionHistory.push({ type: 'withdraw', amount, balance });
      console.log(`  Withdrew $${amount}. New balance: $${balance}`);
      return balance;
    },

    getBalance() {
      return balance;
    },

    getHistory() {
      return [...transactionHistory]; // Return copy
    },
  };
}

console.log('Creating bank account with $1000:');
let account = createBankAccount(1000);

console.log('\nTransactions:');
account.deposit(500);
account.withdraw(200);
account.deposit(100);

console.log('\nCurrent balance:', account.getBalance());
console.log('Transaction history:', account.getHistory());

console.log('\nTrying to access private balance directly:');
console.log('account.balance:', account.balance); // undefined

console.log('\n=== 11. PRACTICAL USE CASE: FUNCTION FACTORY ===\n');

function makeMultiplier(x) {
  return function (y) {
    return x * y;
  };
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);
let quadruple = makeMultiplier(4);

console.log('Function factories:');
console.log('double(5):', double(5)); // 10
console.log('triple(5):', triple(5)); // 15
console.log('quadruple(5):', quadruple(5)); // 20

// More complex factory
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

let add5 = makeAdder(5);
let add10 = makeAdder(10);

console.log('\nAdder factories:');
console.log('add5(3):', add5(3)); // 8
console.log('add10(3):', add10(3)); // 13

console.log('\n=== 12. PRACTICAL USE CASE: MODULE PATTERN ===\n');

const calculator = (function () {
  let result = 0; // Private state
  let history = [];

  function log(operation, value) {
    history.push({ operation, value, result });
  }

  return {
    add(x) {
      result += x;
      log('add', x);
      return this;
    },

    subtract(x) {
      result -= x;
      log('subtract', x);
      return this;
    },

    multiply(x) {
      result *= x;
      log('multiply', x);
      return this;
    },

    divide(x) {
      if (x === 0) throw Error('Cannot divide by zero');
      result /= x;
      log('divide', x);
      return this;
    },

    getResult() {
      return result;
    },

    reset() {
      result = 0;
      history = [];
      return this;
    },

    getHistory() {
      return [...history];
    },
  };
})();

console.log('Calculator module pattern:');
calculator.add(10).multiply(2).subtract(5).divide(3);
console.log('Result:', calculator.getResult());
console.log('History:', calculator.getHistory());

calculator.reset();
console.log('\nAfter reset:', calculator.getResult());

console.log('\n=== 13. PRACTICAL USE CASE: DEBOUNCE FUNCTION ===\n');

function debounce(func, delay) {
  let timeoutId; // Private variable in closure

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

let callCount = 0;
function expensiveOperation(value) {
  callCount++;
  console.log(`  Operation called (${callCount}): ${value}`);
}

let debouncedOp = debounce(expensiveOperation, 100);

console.log('Debounced function (simulated rapid calls):');
console.log('Calling 5 times rapidly...');
debouncedOp('call 1');
debouncedOp('call 2');
debouncedOp('call 3');
debouncedOp('call 4');
debouncedOp('call 5');

setTimeout(() => {
  console.log('After debounce delay, only last call executed');
  console.log('Total actual calls:', callCount);
}, 200);

console.log('\n=== 14. MEMORY CONSIDERATIONS ===\n');

function createHeavyObject() {
  let largeData = new Array(1000).fill('data'); // Simulated large data

  return {
    getData() {
      return largeData.length; // Closure keeps largeData in memory
    },
  };
}

console.log('Creating objects with closures:');
let obj = createHeavyObject();
console.log('Object created, large data kept in memory');
console.log('Data length:', obj.getData());
console.log('\nNote: Closures maintain references to their scope');
console.log('This can impact memory if not managed carefully');

console.log('\n=== 15. CLOSURE BEST PRACTICES SUMMARY ===\n');

console.log("✅ Use arrow functions for closures needing 'this'");
console.log('✅ Use let/const instead of var in loops');
console.log('✅ Create separate scopes for independent closures');
console.log('✅ Be mindful of memory usage with closures');
console.log('✅ Use closures for data encapsulation');
console.log('✅ Document closure behavior in your code');

console.log('\n=== COMPLETE! ===');
console.log('All closure concepts demonstrated successfully!');

// Wait for debounce example to complete
setTimeout(() => {
  console.log('\n[All async examples completed]');
}, 300);
