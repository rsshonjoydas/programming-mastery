// ===================================
// JAVASCRIPT CLASSES AND CONSTRUCTORS
// ===================================

console.log('=== 1. CONSTRUCTOR FUNCTION PATTERN (PRE-ES6) ===\n');

// Constructor function - note the capital letter
function Range(from, to) {
  // Initialize instance properties (state)
  // 'this' refers to the new object being created
  this.from = from;
  this.to = to;
}

// Add methods to the prototype (shared by all instances)
Range.prototype = {
  // Restore constructor reference (important!)
  constructor: Range,

  // Check if value is in range
  includes: function (x) {
    return this.from <= x && x <= this.to;
  },

  // String representation
  toString: function () {
    return '(' + this.from + '...' + this.to + ')';
  },

  // Generator function for iteration
  [Symbol.iterator]: function* () {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  },
};

// Create instances using 'new'
let r1 = new Range(1, 5);
let r2 = new Range(10, 15);

console.log('r1.includes(3):', r1.includes(3));
console.log('r1.toString():', r1.toString());
console.log('Array from r1:', [...r1]);
console.log('r2.includes(12):', r2.includes(12));

console.log('\n=== 2. FACTORY FUNCTION PATTERN (ALTERNATIVE) ===\n');

// Factory function - lowercase name, no 'new' keyword needed
function createRange(from, to) {
  // Manually create the object
  let r = Object.create(createRange.methods);
  r.from = from;
  r.to = to;
  return r; // Explicitly return
}

// Define methods separately
createRange.methods = {
  includes(x) {
    return this.from <= x && x <= this.to;
  },

  toString() {
    return `[${this.from}...${this.to}]`;
  },
};

// Called without 'new'
let range1 = createRange(1, 5);
console.log('Factory range:', range1.toString());
console.log('Includes 3:', range1.includes(3));

console.log('\n=== 3. CONSTRUCTOR INVOCATION VS REGULAR FUNCTION ===\n');

function Person(name, age) {
  console.log(
    "  'this' is:",
    this.constructor ? this.constructor.name : typeof this
  );
  this.name = name;
  this.age = age;
}

console.log("With 'new' (correct):");
let person1 = new Person('Alice', 30);
console.log('  Created person:', person1);

console.log("\nWithout 'new' (wrong - in non-strict mode):");
try {
  let person2 = Person('Bob', 25); // 'this' will be global object
  console.log('  person2 is:', person2); // undefined
  console.log('  Accidentally created global variables!');
} catch (e) {
  console.log('  Error:', e.message);
}

console.log('\n=== 4. USING new.target ===\n');

function SmartConstructor(value) {
  // Detect if called with 'new'
  if (!new.target) {
    console.log("  Called without 'new' - auto-fixing!");
    return new SmartConstructor(value);
  }

  console.log("  Called with 'new' - correct!");
  this.value = value;
}

console.log("Calling with 'new':");
let obj1 = new SmartConstructor(100);

console.log("\nCalling without 'new':");
let obj2 = SmartConstructor(200);

console.log('Both objects created successfully:');
console.log('  obj1:', obj1);
console.log('  obj2:', obj2);

console.log('\n=== 5. THE PROTOTYPE PROPERTY ===\n');

function Animal(species) {
  this.species = species;
}

Animal.prototype.makeSound = function (sound) {
  return `${this.species} says ${sound}`;
};

let dog = new Animal('Dog');
let cat = new Animal('Cat');

console.log("dog.makeSound('Woof'):", dog.makeSound('Woof'));
console.log("cat.makeSound('Meow'):", cat.makeSound('Meow'));

console.log('\nPrototype relationships:');
console.log(
  "dog's prototype is Animal.prototype:",
  Object.getPrototypeOf(dog) === Animal.prototype
);
console.log(
  "cat's prototype is Animal.prototype:",
  Object.getPrototypeOf(cat) === Animal.prototype
);
console.log(
  'Both share the same prototype:',
  Object.getPrototypeOf(dog) === Object.getPrototypeOf(cat)
);

console.log('\n=== 6. CLASS IDENTITY WITH instanceof ===\n');

console.log('r1 instanceof Range:', r1 instanceof Range);
console.log('r1 instanceof Object:', r1 instanceof Object);
console.log('dog instanceof Animal:', dog instanceof Animal);
console.log('dog instanceof Range:', dog instanceof Range);

// Tricking instanceof
console.log('\nTricking instanceof:');
function Strange() {}
Strange.prototype = Range.prototype;

let weird = new Strange();
console.log('weird instanceof Range:', weird instanceof Range);
console.log("But weird doesn't work like Range:");
try {
  weird.includes(5);
} catch (e) {
  console.log('  Error:', e.message);
}

console.log('\n=== 7. THE constructor PROPERTY ===\n');

function Vehicle(type) {
  this.type = type;
}

console.log('Function has prototype with constructor:');
console.log(
  'Vehicle.prototype.constructor === Vehicle:',
  Vehicle.prototype.constructor === Vehicle
);

let car = new Vehicle('Car');
console.log('\nInstance inherits constructor property:');
console.log('car.constructor === Vehicle:', car.constructor === Vehicle);
console.log('car.constructor.name:', car.constructor.name);

// Problem: Overwriting prototype loses constructor
console.log('\nProblem - overwriting prototype:');
function Product(name) {
  this.name = name;
}

Product.prototype = {
  display: function () {
    return this.name;
  },
  // Missing: constructor: Product
};

let item = new Product('Laptop');
console.log('item.constructor === Product:', item.constructor === Product); // false!
console.log('item.constructor:', item.constructor.name); // Object, not Product!

// Solution 1: Restore constructor
console.log('\nSolution 1 - explicitly set constructor:');
function FixedProduct(name) {
  this.name = name;
}

FixedProduct.prototype = {
  constructor: FixedProduct, // Restore it!
  display: function () {
    return this.name;
  },
};

let fixedItem = new FixedProduct('Phone');
console.log(
  'fixedItem.constructor === FixedProduct:',
  fixedItem.constructor === FixedProduct
);

// Solution 2: Add methods without overwriting
console.log('\nSolution 2 - add methods individually:');
function BetterProduct(name) {
  this.name = name;
}

BetterProduct.prototype.display = function () {
  return this.name;
};
BetterProduct.prototype.getPrice = function () {
  return this.price || 0;
};

let betterItem = new BetterProduct('Tablet');
console.log(
  'betterItem.constructor === BetterProduct:',
  betterItem.constructor === BetterProduct
);

console.log('\n=== 8. ARROW FUNCTIONS - WHAT NOT TO DO ===\n');

console.log("Why arrow functions can't be constructors:");
const BadConstructor = (name) => {
  this.name = name;
};

try {
  let bad = new BadConstructor('Test');
} catch (e) {
  console.log('Error:', e.message);
}

console.log('\nWhy arrow functions are bad for methods:');
function Counter(start) {
  this.count = start;
}

// BAD: Arrow function doesn't have proper 'this'
Counter.prototype.badIncrement = () => {
  this.count++; // 'this' is NOT the instance!
  console.log(
    '  Arrow function this:',
    this.constructor ? this.constructor.name : typeof this
  );
};

// GOOD: Regular function has proper 'this'
Counter.prototype.goodIncrement = function () {
  this.count++;
  console.log('  Regular function this:', this.constructor.name);
};

let counter = new Counter(0);
console.log('Using regular function method:');
counter.goodIncrement();
console.log('  Count:', counter.count);

console.log('\n=== 9. COMPLETE CONSTRUCTOR PATTERN EXAMPLE ===\n');

// Constructor with instance properties
function User(username, email) {
  this.username = username;
  this.email = email;
  this.createdAt = new Date();
}

// Instance methods (on prototype)
User.prototype.getInfo = function () {
  return `${this.username} (${this.email})`;
};

User.prototype.getDaysOld = function () {
  let now = new Date();
  let diff = now - this.createdAt;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

User.prototype.updateEmail = function (newEmail) {
  this.email = newEmail;
  console.log(`  Email updated to: ${newEmail}`);
};

// Static method (on constructor, not prototype)
User.compareByUsername = function (user1, user2) {
  return user1.username.localeCompare(user2.username);
};

User.getTotalUsers = function () {
  return User.prototype.totalUsers || 0;
};

// Create instances
let alice = new User('alice', 'alice@example.com');
let bob = new User('bob', 'bob@example.com');
let charlie = new User('charlie', 'charlie@example.com');

console.log('User 1:', alice.getInfo());
console.log('User 2:', bob.getInfo());
console.log('User 3:', charlie.getInfo());

console.log('\nUpdating email:');
alice.updateEmail('newalice@example.com');
console.log('Updated info:', alice.getInfo());

console.log('\nUsing static method:');
console.log('Compare alice and bob:', User.compareByUsername(alice, bob));

console.log('\n=== 10. PROTOTYPE CHAIN VISUALIZATION ===\n');

function Shape(name) {
  this.name = name;
}

Shape.prototype.describe = function () {
  return `This is a ${this.name}`;
};

let circle = new Shape('Circle');

console.log('Prototype chain:');
console.log('1. circle (instance)');
console.log('   ↓');
console.log('2. Shape.prototype (has describe method)');
console.log(
  '   circle.__proto__ === Shape.prototype:',
  Object.getPrototypeOf(circle) === Shape.prototype
);
console.log('   ↓');
console.log('3. Object.prototype (has toString, etc.)');
console.log(
  '   Shape.prototype.__proto__ === Object.prototype:',
  Object.getPrototypeOf(Shape.prototype) === Object.prototype
);
console.log('   ↓');
console.log('4. null');
console.log(
  '   Object.prototype.__proto__ === null:',
  Object.getPrototypeOf(Object.prototype) === null
);

console.log('\n=== 11. isPrototypeOf() WITHOUT instanceof ===\n');

let methods = {
  greet() {
    return 'Hello from methods object';
  },
};

let obj = Object.create(methods);
obj.name = 'Test Object';

console.log('Using isPrototypeOf (no constructor needed):');
console.log('methods.isPrototypeOf(obj):', methods.isPrototypeOf(obj));
console.log(
  'Object.prototype.isPrototypeOf(obj):',
  Object.prototype.isPrototypeOf(obj)
);

console.log('\n=== 12. ES6 CLASS COMPARISON ===\n');

// Old way (constructor function)
function OldPerson(name, age) {
  this.name = name;
  this.age = age;
}

OldPerson.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

// Modern way (ES6 class)
class ModernPerson {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

let oldPerson = new OldPerson('Old Style', 30);
let modernPerson = new ModernPerson('Modern Style', 30);

console.log('Old constructor:', oldPerson.greet());
console.log('ES6 class:', modernPerson.greet());
console.log('\nBoth work the same way under the hood!');
console.log('oldPerson instanceof OldPerson:', oldPerson instanceof OldPerson);
console.log(
  'modernPerson instanceof ModernPerson:',
  modernPerson instanceof ModernPerson
);

console.log('\n=== 13. SHARED VS INSTANCE PROPERTIES ===\n');

function Book(title, author) {
  this.title = title; // Instance property (unique per object)
  this.author = author; // Instance property (unique per object)
}

// Shared property (on prototype)
Book.prototype.type = 'Physical'; // All books share this

// Shared method (on prototype)
Book.prototype.getInfo = function () {
  return `${this.title} by ${this.author}`;
};

let book1 = new Book('1984', 'George Orwell');
let book2 = new Book('Brave New World', 'Aldous Huxley');

console.log('Instance properties (different):');
console.log('book1.title:', book1.title);
console.log('book2.title:', book2.title);

console.log('\nShared property (same):');
console.log('book1.type:', book1.type);
console.log('book2.type:', book2.type);
console.log(
  'Both reference same prototype property:',
  book1.type === book2.type
);

console.log('\nShared method (same function):');
console.log(
  'book1.getInfo === book2.getInfo:',
  book1.getInfo === book2.getInfo
);

console.log('\n=== COMPLETE! ===');
console.log('All JavaScript classes and constructors concepts demonstrated!');
