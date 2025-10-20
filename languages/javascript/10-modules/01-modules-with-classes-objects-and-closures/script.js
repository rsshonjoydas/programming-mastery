// ======================================================
// JAVASCRIPT MODULES WITH CLASSES, OBJECTS, AND CLOSURES
// ======================================================

console.log('=== 1. CLASSES AS NATURAL MODULES ===\n');

// Different classes can have methods with the same name
class SingletonSet {
  constructor(value) {
    this.value = value;
  }

  has(x) {
    return x === this.value;
  }

  size() {
    return 1;
  }
}

class BitSet {
  constructor(max) {
    this.max = max;
    this.bits = new Uint8Array(Math.ceil(max / 8));
  }

  has(n) {
    if (n < 0 || n >= this.max) return false;
    let byte = Math.floor(n / 8);
    let bit = n % 8;
    return (this.bits[byte] & (1 << bit)) !== 0;
  }

  insert(n) {
    if (n >= 0 && n < this.max) {
      let byte = Math.floor(n / 8);
      let bit = n % 8;
      this.bits[byte] |= 1 << bit;
    }
  }

  size() {
    let count = 0;
    for (let i = 0; i < this.max; i++) {
      if (this.has(i)) count++;
    }
    return count;
  }
}

// No naming conflicts!
let s1 = new SingletonSet(5);
let s2 = new BitSet(100);
s2.insert(5);
s2.insert(10);

console.log('SingletonSet has 5:', s1.has(5));
console.log('BitSet has 5:', s2.has(5));
console.log('SingletonSet size:', s1.size());
console.log('BitSet size:', s2.size());

console.log('\n=== 2. OBJECT-BASED MODULARITY ===\n');

// Group related classes in a namespace object
const Sets = {
  Singleton: class {
    constructor(value) {
      this.value = value;
    }
    has(x) {
      return x === this.value;
    }
  },

  Bit: class {
    constructor(max) {
      this.max = max;
      this.bits = new Uint8Array(Math.ceil(max / 8));
    }
    has(n) {
      if (n < 0 || n >= this.max) return false;
      let byte = Math.floor(n / 8);
      let bit = n % 8;
      return (this.bits[byte] & (1 << bit)) !== 0;
    }
    insert(n) {
      if (n >= 0 && n < this.max) {
        let byte = Math.floor(n / 8);
        let bit = n % 8;
        this.bits[byte] |= 1 << bit;
      }
    }
  },

  Range: class {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }
    has(x) {
      return x >= this.from && x <= this.to;
    }
  },
};

console.log('Using namespace object:');
let singleton = new Sets.Singleton(42);
let bitset = new Sets.Bit(50);
let rangeset = new Sets.Range(1, 10);

console.log('Sets.Singleton(42) has 42:', singleton.has(42));
console.log('Sets.Range(1,10) has 5:', rangeset.has(5));
console.log('Sets.Range(1,10) has 15:', rangeset.has(15));

// Similar to how Math works
console.log('\nMath object pattern:');
console.log('Math.sqrt(16):', Math.sqrt(16));
console.log('Math.PI:', Math.PI);

console.log('\n=== 3. CLOSURE-BASED MODULARITY (HIDING DETAILS) ===\n');

// Using IIFE to hide implementation details
const BitSetModule = (function () {
  // PRIVATE: Helper functions not accessible outside
  function isValid(set, n) {
    return Number.isInteger(n) && n >= 0 && n < set.max;
  }

  function hasBit(bits, n) {
    let byte = Math.floor(n / 8);
    let bit = n % 8;
    return (bits[byte] & (1 << bit)) !== 0;
  }

  // PRIVATE: Constants
  const BITS_PER_BYTE = 8;

  // PUBLIC: Return the class
  return class BitSet {
    constructor(max) {
      this.max = max;
      this.bits = new Uint8Array(Math.ceil(max / BITS_PER_BYTE));
    }

    insert(n) {
      if (isValid(this, n)) {
        // Uses private function
        let byte = Math.floor(n / BITS_PER_BYTE);
        let bit = n % BITS_PER_BYTE;
        this.bits[byte] |= 1 << bit;
      }
    }

    has(n) {
      if (!isValid(this, n)) return false;
      return hasBit(this.bits, n); // Uses private function
    }

    remove(n) {
      if (isValid(this, n)) {
        let byte = Math.floor(n / BITS_PER_BYTE);
        let bit = n % BITS_PER_BYTE;
        this.bits[byte] &= ~(1 << bit);
      }
    }
  };
})();

console.log('BitSet with private implementation:');
let privateBitSet = new BitSetModule(100);
privateBitSet.insert(25);
privateBitSet.insert(50);
privateBitSet.insert(75);

console.log('Has 25:', privateBitSet.has(25));
console.log('Has 30:', privateBitSet.has(30));

// Private functions are NOT accessible
console.log('Can access private isValid?', typeof isValid === 'undefined');

console.log('\n=== 4. MULTI-ITEM MODULE WITH CLOSURES ===\n');

const stats = (function () {
  // PRIVATE: Utility functions
  const sum = (x, y) => x + y;
  const square = (x) => x * x;

  // PRIVATE: Helper
  function validateData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }
  }

  // PUBLIC: Mean function
  function mean(data) {
    validateData(data);
    return data.reduce(sum) / data.length;
  }

  // PUBLIC: Standard deviation
  function stddev(data) {
    validateData(data);
    let m = mean(data);
    return Math.sqrt(
      data
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
        (data.length - 1)
    );
  }

  // PUBLIC: Variance
  function variance(data) {
    validateData(data);
    let m = mean(data);
    return (
      data
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
      (data.length - 1)
    );
  }

  // PUBLIC: Median
  function median(data) {
    validateData(data);
    let sorted = [...data].sort((a, b) => a - b);
    let mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  // Export public API
  return { mean, stddev, variance, median };
})();

console.log('Statistics module:');
let data = [1, 3, 5, 7, 9];
console.log('Data:', data);
console.log('Mean:', stats.mean(data));
console.log('Standard deviation:', stats.stddev(data));
console.log('Variance:', stats.variance(data));
console.log('Median:', stats.median(data));

// Private functions are hidden
console.log('\nPrivate functions hidden:');
console.log('Can access stats.sum?', stats.sum === undefined);
console.log('Can access stats.square?', stats.square === undefined);

console.log('\n=== 5. MODULE BUNDLER PATTERN ===\n');

// Simulating how webpack/Parcel bundle modules
const modules = {};

function require(moduleName) {
  return modules[moduleName];
}

// Module 1: sets.js
modules['sets.js'] = (function () {
  const exports = {};

  // Private helper
  function isValid(set, n) {
    return Number.isInteger(n) && n >= 0 && n < set.max;
  }

  // Export BitSet class
  exports.BitSet = class BitSet {
    constructor(max) {
      this.max = max;
      this.bits = new Uint8Array(Math.ceil(max / 8));
    }

    insert(n) {
      if (isValid(this, n)) {
        let byte = Math.floor(n / 8);
        let bit = n % 8;
        this.bits[byte] |= 1 << bit;
      }
    }

    has(n) {
      if (!isValid(this, n)) return false;
      let byte = Math.floor(n / 8);
      let bit = n % 8;
      return (this.bits[byte] & (1 << bit)) !== 0;
    }

    *[Symbol.iterator]() {
      for (let i = 0; i < this.max; i++) {
        if (this.has(i)) yield i;
      }
    }
  };

  // Export RangeSet class
  exports.RangeSet = class RangeSet {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }

    has(x) {
      return x >= this.from && x <= this.to;
    }
  };

  return exports;
})();

// Module 2: stats.js
modules['stats.js'] = (function () {
  const exports = {};

  // Private utilities
  const sum = (x, y) => x + y;
  const square = (x) => x * x;

  exports.mean = function (data) {
    return data.reduce(sum) / data.length;
  };

  exports.stddev = function (data) {
    let m = exports.mean(data);
    return Math.sqrt(
      data
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
        (data.length - 1)
    );
  };

  return exports;
})();

// Module 3: math-utils.js
modules['math-utils.js'] = (function () {
  const exports = {};

  exports.factorial = function (n) {
    if (n <= 1) return 1;
    return n * exports.factorial(n - 1);
  };

  exports.fibonacci = function (n) {
    if (n <= 1) return n;
    return exports.fibonacci(n - 1) + exports.fibonacci(n - 2);
  };

  return exports;
})();

// Using the bundled modules
console.log('Using require() to load modules:');

const statsModule = require('stats.js');
const BitSet = require('sets.js').BitSet;
const RangeSet = require('sets.js').RangeSet;
const mathUtils = require('math-utils.js');

let mySet = new BitSet(100);
mySet.insert(10);
mySet.insert(20);
mySet.insert(30);

console.log('BitSet contents:', [...mySet]);
console.log('Mean of set:', statsModule.mean([...mySet]));

let range = new RangeSet(5, 15);
console.log('RangeSet(5,15) has 10:', range.has(10));

console.log('Factorial of 5:', mathUtils.factorial(5));
console.log('Fibonacci of 10:', mathUtils.fibonacci(10));

console.log('\n=== 6. PRACTICAL EXAMPLE: COMPLEX MODULE ===\n');

const ShoppingCart = (function () {
  // PRIVATE: Tax rate
  const TAX_RATE = 0.08;

  // PRIVATE: Helper to calculate tax
  function calculateTax(subtotal) {
    return subtotal * TAX_RATE;
  }

  // PRIVATE: Helper to format currency
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  // PUBLIC: Cart class
  return class ShoppingCart {
    constructor() {
      this.items = [];
    }

    addItem(name, price, quantity = 1) {
      this.items.push({ name, price, quantity });
      console.log(`Added ${quantity}x ${name} @ ${formatCurrency(price)}`);
    }

    removeItem(name) {
      let index = this.items.findIndex((item) => item.name === name);
      if (index !== -1) {
        let removed = this.items.splice(index, 1)[0];
        console.log(`Removed ${removed.name}`);
        return true;
      }
      return false;
    }

    getSubtotal() {
      return this.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
    }

    getTax() {
      return calculateTax(this.getSubtotal());
    }

    getTotal() {
      return this.getSubtotal() + this.getTax();
    }

    printReceipt() {
      console.log('\n--- RECEIPT ---');
      this.items.forEach((item) => {
        let lineTotal = item.price * item.quantity;
        console.log(
          `${item.quantity}x ${item.name}: ${formatCurrency(lineTotal)}`
        );
      });
      console.log('---------------');
      console.log(`Subtotal: ${formatCurrency(this.getSubtotal())}`);
      console.log(`Tax (8%): ${formatCurrency(this.getTax())}`);
      console.log(`Total: ${formatCurrency(this.getTotal())}`);
      console.log('---------------\n');
    }
  };
})();

console.log('Shopping Cart Module:');
let cart = new ShoppingCart();
cart.addItem('Laptop', 999.99);
cart.addItem('Mouse', 29.99, 2);
cart.addItem('Keyboard', 79.99);
cart.printReceipt();

console.log('\n=== 7. REVEALING MODULE PATTERN ===\n');

const Calculator = (function () {
  // Private state
  let memory = 0;

  // Private methods
  function validateNumber(n) {
    if (typeof n !== 'number' || isNaN(n)) {
      throw new Error('Invalid number');
    }
  }

  // Public methods
  function add(a, b) {
    validateNumber(a);
    validateNumber(b);
    return a + b;
  }

  function subtract(a, b) {
    validateNumber(a);
    validateNumber(b);
    return a - b;
  }

  function multiply(a, b) {
    validateNumber(a);
    validateNumber(b);
    return a * b;
  }

  function divide(a, b) {
    validateNumber(a);
    validateNumber(b);
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }

  function storeMemory(value) {
    validateNumber(value);
    memory = value;
    console.log(`Stored ${value} in memory`);
  }

  function recallMemory() {
    console.log(`Recalled ${memory} from memory`);
    return memory;
  }

  function clearMemory() {
    memory = 0;
    console.log('Memory cleared');
  }

  // Reveal public API
  return {
    add,
    subtract,
    multiply,
    divide,
    store: storeMemory,
    recall: recallMemory,
    clear: clearMemory,
  };
})();

console.log('Calculator module (Revealing Module Pattern):');
console.log('10 + 5 =', Calculator.add(10, 5));
console.log('10 - 5 =', Calculator.subtract(10, 5));
console.log('10 * 5 =', Calculator.multiply(10, 5));
console.log('10 / 5 =', Calculator.divide(10, 5));

Calculator.store(42);
console.log('Recalled:', Calculator.recall());
Calculator.clear();

console.log('\n=== COMPLETE! ===');
console.log('All module patterns demonstrated successfully!');
console.log('\nKey Takeaways:');
console.log('1. Classes provide natural modularity');
console.log('2. Objects group related functionality');
console.log('3. Closures hide implementation details');
console.log('4. IIFEs create private scope');
console.log('5. Module bundlers automate the process');
console.log('6. Modern code uses ES6 modules (import/export)');
