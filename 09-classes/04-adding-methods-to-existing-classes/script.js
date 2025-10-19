// ==============================================
// JAVASCRIPT: ADDING METHODS TO EXISTING CLASSES
// ==============================================

console.log('=== 1. ADDING METHODS TO CUSTOM CLASSES ===\n');

// Original custom class
class Complex {
  constructor(real, imaginary) {
    this.r = real;
    this.i = imaginary;
  }

  toString() {
    return `${this.r} + ${this.i}i`;
  }
}

// Create an instance BEFORE adding new method
let c1 = new Complex(3, 4);
console.log('Complex number before adding method:', c1.toString());

// Add a method to compute complex conjugate
Complex.prototype.conj = function () {
  return new Complex(this.r, -this.i);
};

// Add another method for magnitude
Complex.prototype.magnitude = function () {
  return Math.sqrt(this.r * this.r + this.i * this.i);
};

// The instance created BEFORE still has access to new methods!
let conjugate = c1.conj();
console.log('Conjugate (added after creation):', conjugate.toString());
console.log('Magnitude:', c1.magnitude());

// New instances also have the methods
let c2 = new Complex(5, 12);
console.log('New complex number:', c2.toString());
console.log('Its magnitude:', c2.magnitude());

console.log('\n=== 2. DYNAMIC PROTOTYPE INHERITANCE ===\n');

function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Create instances
let alice = new Person('Alice', 30);
let bob = new Person('Bob', 25);

console.log('Before adding methods:');
console.log('alice:', alice);

// Add method AFTER objects are created
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
};

Person.prototype.birthday = function () {
  this.age++;
  return `Happy birthday! Now ${this.age} years old`;
};

// Both existing instances now have the new methods
console.log('\nAfter adding methods:');
console.log(alice.greet());
console.log(bob.greet());
console.log(alice.birthday());

console.log('\n=== 3. EXTENDING BUILT-IN CLASSES (STRING) ===\n');

// Safe polyfill pattern - check if method exists first
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (s) {
    return this.indexOf(s) === 0;
  };
  console.log('Added startsWith polyfill');
} else {
  console.log('startsWith already exists');
}

// Usage
let greeting = 'Hello World';
console.log("'Hello World'.startsWith('Hello'):", greeting.startsWith('Hello'));
console.log("'Hello World'.startsWith('World'):", greeting.startsWith('World'));

// Another String extension
String.prototype.reverse = function () {
  return this.split('').reverse().join('');
};

console.log("'JavaScript'.reverse():", 'JavaScript'.reverse());

// Add capitalize method
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

console.log("'javascript'.capitalize():", 'javascript'.capitalize());
console.log("'HELLO'.capitalize():", 'HELLO'.capitalize());

console.log('\n=== 4. EXTENDING BUILT-IN CLASSES (NUMBER) ===\n');

// Add a times method to Number
Number.prototype.times = function (f, context) {
  let n = this.valueOf();
  for (let i = 0; i < n; i++) {
    f.call(context, i);
  }
};

console.log('Executing 3.times(callback):');
let n = 3;
n.times((i) => {
  console.log(`  Iteration ${i}: hello`);
});

// Add isEven and isOdd methods
Number.prototype.isEven = function () {
  return this % 2 === 0;
};

Number.prototype.isOdd = function () {
  return this % 2 !== 0;
};

console.log('\n5 is even?', (5).isEven());
console.log('5 is odd?', (5).isOdd());
console.log('10 is even?', (10).isEven());

console.log('\n=== 5. EXTENDING BUILT-IN CLASSES (ARRAY) ===\n');

// Add first and last methods
Array.prototype.first = function () {
  return this[0];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

let numbers = [1, 2, 3, 4, 5];
console.log('Array:', numbers);
console.log('First element:', numbers.first());
console.log('Last element:', numbers.last());

// Add sum method
Array.prototype.sum = function () {
  return this.reduce((acc, val) => acc + val, 0);
};

console.log('Sum of array:', numbers.sum());

// Add average method
Array.prototype.average = function () {
  return this.length === 0 ? 0 : this.sum() / this.length;
};

console.log('Average of array:', numbers.average());

console.log('\n=== 6. THE PROBLEM WITH Object.prototype ===\n');

console.log('DEMONSTRATION: Why modifying Object.prototype is bad\n');

// Create a normal object
let user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
};

console.log('Original for...in loop:');
for (let key in user) {
  console.log(`  ${key}: ${user[key]}`);
}

// BAD PRACTICE: Add method to Object.prototype
Object.prototype.badMethod = function () {
  return 'This pollutes everything!';
};

console.log('\nAfter adding to Object.prototype:');
console.log('user.badMethod():', user.badMethod());

console.log('\nNow for...in is polluted:');
for (let key in user) {
  console.log(`  ${key}: ${user[key]}`);
}
// Notice 'badMethod' appears in the loop!

// Clean up the pollution
delete Object.prototype.badMethod;
console.log('\nAfter cleanup - for...in works correctly again:');
for (let key in user) {
  console.log(`  ${key}: ${user[key]}`);
}

console.log('\n=== 7. SAFE METHOD: NON-ENUMERABLE PROPERTIES ===\n');

// Add method using Object.defineProperty (non-enumerable)
Object.defineProperty(String.prototype, 'shout', {
  value: function () {
    return this.toUpperCase() + '!!!';
  },
  enumerable: false, // Won't appear in for...in
  writable: true,
  configurable: true,
});

console.log("'hello'.shout():", 'hello'.shout());

// Verify it doesn't pollute enumeration
let testStr = 'test';
console.log('\nEnumerating string properties:');
for (let prop in testStr) {
  console.log(`  ${prop}`); // 'shout' won't appear
}
console.log('(shout method is hidden from enumeration)');

console.log('\n=== 8. POLYFILL EXAMPLES ===\n');

// Polyfill for Array.includes (ES2016)
if (!Array.prototype.includes) {
  Array.prototype.includes = function (element) {
    return this.indexOf(element) !== -1;
  };
  console.log('Added Array.includes polyfill');
}

let fruits = ['apple', 'banana', 'orange'];
console.log("fruits.includes('banana'):", fruits.includes('banana'));
console.log("fruits.includes('grape'):", fruits.includes('grape'));

// Polyfill for Array.find (ES2015)
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
  console.log('Added Array.find polyfill');
}

let found = fruits.find((fruit) => fruit.startsWith('b'));
console.log("First fruit starting with 'b':", found);

console.log('\n=== 9. BETTER ALTERNATIVE: UTILITY FUNCTIONS ===\n');

// Instead of modifying prototypes, use utility functions
const StringUtils = {
  reverse(str) {
    return str.split('').reverse().join('');
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  },
};

console.log('Utility function approach:');
console.log("StringUtils.reverse('hello'):", StringUtils.reverse('hello'));
console.log(
  "StringUtils.capitalize('world'):",
  StringUtils.capitalize('world')
);
console.log(
  "StringUtils.truncate('long text', 5):",
  StringUtils.truncate('long text here', 8)
);

console.log('\n=== 10. BETTER ALTERNATIVE: CLASS EXTENSION ===\n');

// Extend Array with a custom class
class ExtendedArray extends Array {
  first() {
    return this[0];
  }

  last() {
    return this[this.length - 1];
  }

  sum() {
    return this.reduce((a, b) => a + b, 0);
  }

  average() {
    return this.length === 0 ? 0 : this.sum() / this.length;
  }
}

let extArr = new ExtendedArray(10, 20, 30, 40, 50);
console.log('ExtendedArray:', extArr);
console.log('First:', extArr.first());
console.log('Last:', extArr.last());
console.log('Sum:', extArr.sum());
console.log('Average:', extArr.average());

console.log('\n=== 11. COMPOSITION PATTERN ===\n');

// Instead of modifying prototypes, use composition
const arrayMethods = {
  first(arr) {
    return arr[0];
  },

  last(arr) {
    return arr[arr.length - 1];
  },

  sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  },
};

let data = [5, 10, 15, 20];
console.log('Using composition:');
console.log('First:', arrayMethods.first(data));
console.log('Last:', arrayMethods.last(data));
console.log('Sum:', arrayMethods.sum(data));

console.log('\n=== 12. PRACTICAL EXAMPLE: CUSTOM CLASS ===\n');

// A practical example with custom class
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }
}

// Extend the class after definition
ShoppingCart.prototype.getTotal = function () {
  return this.items.reduce((sum, item) => sum + item.price, 0);
};

ShoppingCart.prototype.getItemCount = function () {
  return this.items.length;
};

ShoppingCart.prototype.clear = function () {
  this.items = [];
};

// Usage
let cart = new ShoppingCart();
cart.addItem({ name: 'Book', price: 20 });
cart.addItem({ name: 'Pen', price: 5 });
cart.addItem({ name: 'Notebook', price: 10 });

console.log('Cart items:', cart.items);
console.log('Total price:', cart.getTotal());
console.log('Item count:', cart.getItemCount());

console.log('\n=== 13. BEST PRACTICES SUMMARY ===\n');

console.log('✅ DO:');
console.log('  - Extend your own custom classes');
console.log('  - Add polyfills with existence checks');
console.log('  - Use Object.defineProperty for non-enumerable properties');
console.log('  - Prefer utility functions and class extension');
console.log('');
console.log("❌ DON'T:");
console.log('  - Modify built-in prototypes in production code');
console.log('  - Ever modify Object.prototype');
console.log('  - Add enumerable properties to prototypes');
console.log('  - Overwrite existing methods without checking');

console.log('\n=== COMPLETE! ===');
console.log('All concepts about adding methods to classes demonstrated!');
console.log(
  '\nRemember: Modifying built-in prototypes is powerful but dangerous.'
);
console.log('Use with caution and prefer modern alternatives when possible.');
