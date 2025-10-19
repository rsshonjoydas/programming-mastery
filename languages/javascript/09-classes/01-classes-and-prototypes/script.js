// =================================
// JAVASCRIPT CLASSES AND PROTOTYPES
// =================================

console.log('=== 1. FACTORY FUNCTION PATTERN ===\n');

// Factory function that returns new range objects
function range(from, to) {
  // Create object that inherits from the prototype
  let r = Object.create(range.methods);

  // Store instance-specific state (own properties)
  r.from = from;
  r.to = to;

  // Return the new object
  return r;
}

// Prototype object defines shared methods
range.methods = {
  includes(x) {
    return this.from <= x && x <= this.to;
  },

  // Generator function for iteration
  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  },

  toString() {
    return '(' + this.from + '...' + this.to + ')';
  },
};

// Usage
let r1 = range(1, 3);
console.log('Range object:', r1);
console.log('r1.includes(2):', r1.includes(2));
console.log('r1.toString():', r1.toString());
console.log('Spread range:', [...r1]);

// Verify prototype
console.log('\nPrototype verification:');
console.log(
  'r1 inherits from range.methods:',
  Object.getPrototypeOf(r1) === range.methods
);

console.log('\n=== 2. CONSTRUCTOR FUNCTION PATTERN ===\n');

function Person(name, age) {
  // Initialize instance properties
  this.name = name;
  this.age = age;
}

// Add methods to the prototype
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
};

Person.prototype.haveBirthday = function () {
  this.age++;
  return `Happy birthday! Now ${this.age} years old`;
};

// Usage with 'new' keyword
let person1 = new Person('Alice', 30);
let person2 = new Person('Bob', 25);

console.log('person1:', person1);
console.log('person1.greet():', person1.greet());
console.log('person2.greet():', person2.greet());

// Shared methods
console.log('\nShared methods:');
console.log('Same greet method?', person1.greet === person2.greet);
console.log('Different names?', person1.name !== person2.name);

// instanceof check
console.log('\ninstanceof check:');
console.log('person1 instanceof Person:', person1 instanceof Person);
console.log('person1 instanceof Object:', person1 instanceof Object);

console.log('\n=== 3. ES6 CLASS SYNTAX ===\n');

class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  // Methods automatically added to prototype
  speak() {
    return `${this.name} the ${this.species} makes a sound`;
  }

  // Getter
  get description() {
    return `${this.name} (${this.species})`;
  }

  // Setter
  set nickname(value) {
    this._nickname = value;
  }

  get nickname() {
    return this._nickname || this.name;
  }
}

let animal1 = new Animal('Leo', 'Lion');
console.log('animal1:', animal1);
console.log('animal1.speak():', animal1.speak());
console.log('animal1.description:', animal1.description);

animal1.nickname = 'King';
console.log('animal1.nickname:', animal1.nickname);

console.log('\n=== 4. STATIC METHODS AND PROPERTIES ===\n');

class MathUtils {
  // Static property
  static PI = 3.14159;

  // Static method
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static circleArea(radius) {
    return this.PI * radius ** 2;
  }
}

console.log('MathUtils.PI:', MathUtils.PI);
console.log('MathUtils.add(5, 3):', MathUtils.add(5, 3));
console.log('MathUtils.multiply(4, 7):', MathUtils.multiply(4, 7));
console.log('MathUtils.circleArea(5):', MathUtils.circleArea(5));

// Static methods not available on instances
let util = new MathUtils();
console.log('\nStatic methods on instance?');
console.log('util.add:', util.add); // undefined

console.log('\n=== 5. INHERITANCE WITH extends ===\n');

class Vehicle {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  start() {
    return `${this.brand} ${this.model} is starting...`;
  }

  stop() {
    return `${this.brand} ${this.model} is stopping...`;
  }
}

class Car extends Vehicle {
  constructor(brand, model, doors) {
    super(brand, model); // Call parent constructor
    this.doors = doors;
  }

  // Override parent method
  start() {
    return super.start() + ' Vroom!';
  }

  // New method
  honk() {
    return 'Beep beep!';
  }
}

let car = new Car('Toyota', 'Camry', 4);
console.log('car:', car);
console.log('car.start():', car.start());
console.log('car.stop():', car.stop());
console.log('car.honk():', car.honk());

console.log('\nInheritance check:');
console.log('car instanceof Car:', car instanceof Car);
console.log('car instanceof Vehicle:', car instanceof Vehicle);

console.log('\n=== 6. THE PROTOTYPE CHAIN ===\n');

class GrandParent {
  grandParentMethod() {
    return 'GrandParent method';
  }
}

class Parent extends GrandParent {
  parentMethod() {
    return 'Parent method';
  }
}

class Child extends Parent {
  childMethod() {
    return 'Child method';
  }
}

let child = new Child();
console.log('child.childMethod():', child.childMethod());
console.log('child.parentMethod():', child.parentMethod());
console.log('child.grandParentMethod():', child.grandParentMethod());

console.log('\nPrototype chain:');
console.log(
  'child -> Child.prototype:',
  Object.getPrototypeOf(child) === Child.prototype
);
console.log(
  'Child.prototype -> Parent.prototype:',
  Object.getPrototypeOf(Child.prototype) === Parent.prototype
);
console.log(
  'Parent.prototype -> GrandParent.prototype:',
  Object.getPrototypeOf(Parent.prototype) === GrandParent.prototype
);

console.log('\n=== 7. OWN VS INHERITED PROPERTIES ===\n');

class Dog {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }

  bark() {
    return 'Woof!';
  }
}

let dog = new Dog('Buddy', 'Golden Retriever');

console.log('Own properties:');
console.log("dog.hasOwnProperty('name'):", dog.hasOwnProperty('name'));
console.log("dog.hasOwnProperty('breed'):", dog.hasOwnProperty('breed'));
console.log("dog.hasOwnProperty('bark'):", dog.hasOwnProperty('bark'));

console.log('\nInherited properties:');
console.log("'bark' in dog:", 'bark' in dog);
console.log(
  "Dog.prototype.hasOwnProperty('bark'):",
  Dog.prototype.hasOwnProperty('bark')
);

console.log('\nOwn property names:');
console.log(Object.keys(dog));

console.log("\n=== 8. THE 'this' KEYWORD ===\n");

class Counter {
  constructor(name) {
    this.name = name;
    this.count = 0;
  }

  increment() {
    this.count++;
    return `${this.name}: ${this.count}`;
  }

  // Arrow function preserves 'this'
  incrementArrow = () => {
    this.count++;
    return `${this.name}: ${this.count}`;
  };
}

let counter = new Counter('MyCounter');
console.log(counter.increment());
console.log(counter.increment());

// 'this' binding issue
console.log("\nLosing 'this' context:");
let increment = counter.increment;
try {
  console.log(increment()); // Error: 'this' is undefined
} catch (e) {
  console.log('Error:', e.message);
}

// Solution 1: bind
let boundIncrement = counter.increment.bind(counter);
console.log('With bind:', boundIncrement());

// Solution 2: Arrow function (already bound)
let arrowIncrement = counter.incrementArrow;
console.log('With arrow function:', arrowIncrement());

console.log('\n=== 9. GETTERS AND SETTERS ===\n');

class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (value <= 0) throw new Error('Width must be positive');
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (value <= 0) throw new Error('Height must be positive');
    this._height = value;
  }

  // Computed property
  get area() {
    return this._width * this._height;
  }

  get perimeter() {
    return 2 * (this._width + this._height);
  }
}

let rect = new Rectangle(10, 5);
console.log('rect.width:', rect.width);
console.log('rect.height:', rect.height);
console.log('rect.area:', rect.area);
console.log('rect.perimeter:', rect.perimeter);

rect.width = 15;
console.log('\nAfter setting width to 15:');
console.log('rect.area:', rect.area);

try {
  rect.width = -5;
} catch (e) {
  console.log('Error setting negative width:', e.message);
}

console.log('\n=== 10. PRIVATE FIELDS (ES2022) ===\n');

class BankAccount {
  #balance = 0; // Private field
  #accountNumber;

  constructor(accountNumber, initialBalance) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
    return `Deposited $${amount}. New balance: $${this.#balance}`;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
    return `Withdrew $${amount}. New balance: $${this.#balance}`;
  }

  getBalance() {
    return this.#balance;
  }

  #validateTransaction(amount) {
    return amount > 0 && amount <= this.#balance;
  }
}

let account = new BankAccount('12345', 1000);
console.log('Initial balance:', account.getBalance());
console.log(account.deposit(500));
console.log(account.withdraw(200));
console.log('Final balance:', account.getBalance());

// Cannot access private fields
console.log('\nTrying to access private field:');
console.log('account.#balance:', account.balance); // undefined (not accessible)

console.log('\n=== 11. PRACTICAL EXAMPLE: USER CLASS ===\n');

class User {
  static #nextId = 1;
  #password;

  constructor(username, email, password) {
    this.id = User.#nextId++;
    this.username = username;
    this.email = email;
    this.#password = this.#hashPassword(password);
    this.createdAt = new Date();
  }

  #hashPassword(password) {
    // Simplified hash (in reality, use proper hashing)
    return `hashed_${password}`;
  }

  validatePassword(password) {
    return this.#hashPassword(password) === this.#password;
  }

  get info() {
    return `${this.username} (${this.email})`;
  }

  static compareUsers(user1, user2) {
    return user1.id === user2.id;
  }
}

let user1 = new User('alice', 'alice@example.com', 'password123');
let user2 = new User('bob', 'bob@example.com', 'secret456');

console.log('user1:', user1.info);
console.log('user2:', user2.info);
console.log('user1 ID:', user1.id);
console.log('user2 ID:', user2.id);

console.log('\nPassword validation:');
console.log('Valid password:', user1.validatePassword('password123'));
console.log('Invalid password:', user1.validatePassword('wrong'));

console.log('\nComparing users:');
console.log('Same user?', User.compareUsers(user1, user1));
console.log('Different users?', User.compareUsers(user1, user2));

console.log('\n=== 12. COMPARISON: FACTORY VS CONSTRUCTOR VS CLASS ===\n');

// Factory Function
function createProduct(name, price) {
  return {
    name: name,
    price: price,
    getInfo() {
      return `${this.name}: $${this.price}`;
    },
  };
}

// Constructor Function
function Product(name, price) {
  this.name = name;
  this.price = price;
}
Product.prototype.getInfo = function () {
  return `${this.name}: $${this.price}`;
};

// ES6 Class
class ProductClass {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  getInfo() {
    return `${this.name}: $${this.price}`;
  }
}

let p1 = createProduct('Widget', 10);
let p2 = new Product('Gadget', 20);
let p3 = new ProductClass('Doohickey', 30);

console.log('Factory:', p1.getInfo());
console.log('Constructor:', p2.getInfo());
console.log('Class:', p3.getInfo());

console.log('\ninstanceof check:');
console.log('p1 instanceof Product:', p1 instanceof Product); // false
console.log('p2 instanceof Product:', p2 instanceof Product); // true
console.log('p3 instanceof ProductClass:', p3 instanceof ProductClass); // true

console.log('\n=== 13. COMPLEX INHERITANCE EXAMPLE ===\n');

class Shape {
  constructor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  // Abstract method (to be overridden)
  area() {
    throw new Error('area() must be implemented');
  }
}

class Circle extends Shape {
  constructor(radius, color) {
    super(color);
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  toString() {
    return `Circle (r=${this.radius}, ${this.color})`;
  }
}

class Square extends Shape {
  constructor(side, color) {
    super(color);
    this.side = side;
  }

  area() {
    return this.side ** 2;
  }

  toString() {
    return `Square (s=${this.side}, ${this.color})`;
  }
}

let circle = new Circle(5, 'red');
let square = new Square(4, 'blue');

console.log(circle.toString());
console.log('Circle area:', circle.area().toFixed(2));
console.log('Circle color:', circle.getColor());

console.log('\n' + square.toString());
console.log('Square area:', square.area());
console.log('Square color:', square.getColor());

console.log('\n=== COMPLETE! ===');
console.log('All classes and prototypes concepts demonstrated!');
