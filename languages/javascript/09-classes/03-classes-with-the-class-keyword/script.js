// =======================================
// JAVASCRIPT CLASSES WITH 'class' KEYWORD
// =======================================

console.log('=== 1. BASIC CLASS SYNTAX ===\n');

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  includes(x) {
    return this.from <= x && x <= this.to;
  }

  toString() {
    return `(${this.from}...${this.to})`;
  }
}

let r = new Range(1, 3);
console.log('Range object:', r);
console.log('r.includes(2):', r.includes(2));
console.log('r.toString():', r.toString());
console.log('Range is a function?', typeof Range); // "function"

console.log('\n=== 2. CONSTRUCTOR METHOD ===\n');

class Person {
  constructor(name, age) {
    console.log('Constructor called for:', name);
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  }
}

let alice = new Person('Alice', 30);
console.log(alice.greet());

// Class without explicit constructor
class Empty {
  // Implicit empty constructor created
}

let empty = new Empty();
console.log('Empty instance:', empty);

console.log('\n=== 3. CLASS DECLARATIONS VS EXPRESSIONS ===\n');

// Class declaration
class Square1 {
  constructor(x) {
    this.side = x;
    this.area = x * x;
  }
}

// Class expression
let Square2 = class {
  constructor(x) {
    this.side = x;
    this.area = x * x;
  }
};

// Named class expression
let Square3 = class SquareClass {
  constructor(x) {
    this.side = x;
    this.area = x * x;
  }
};

console.log('Declaration:', new Square1(3));
console.log('Expression:', new Square2(4));
console.log('Named expression:', new Square3(5));

console.log('\n=== 4. STATIC METHODS ===\n');

class MathUtils {
  // Static method - belongs to class, not instances
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  // Instance method for comparison
  calculate(x) {
    return x * 2;
  }
}

console.log('Static method MathUtils.add(5, 3):', MathUtils.add(5, 3));
console.log(
  'Static method MathUtils.multiply(4, 2):',
  MathUtils.multiply(4, 2)
);

let utils = new MathUtils();
console.log('Instance method utils.calculate(10):', utils.calculate(10));

try {
  utils.add(1, 2); // This will fail
} catch (e) {
  console.log('Error calling static method on instance:', e.message);
}

// Practical static method example
class RangeParser {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  static parse(s) {
    let matches = s.match(/^\((\d+)\.\.\.(\d+)\)$/);
    if (!matches) {
      throw new TypeError(`Cannot parse Range from "${s}".`);
    }
    return new RangeParser(parseInt(matches[1]), parseInt(matches[2]));
  }

  toString() {
    return `(${this.from}...${this.to})`;
  }
}

let parsed = RangeParser.parse('(5...10)');
console.log('\nParsed range:', parsed.toString());

console.log('\n=== 5. GETTERS AND SETTERS ===\n');

class Circle {
  constructor(radius) {
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    if (value < 0) {
      throw new Error('Radius cannot be negative');
    }
    this._radius = value;
  }

  get area() {
    return Math.PI * this._radius ** 2;
  }

  get diameter() {
    return this._radius * 2;
  }

  set diameter(d) {
    this._radius = d / 2;
  }
}

let circle = new Circle(5);
console.log('Circle radius:', circle.radius);
console.log('Circle area:', circle.area.toFixed(2));
console.log('Circle diameter:', circle.diameter);

circle.diameter = 20;
console.log('After setting diameter to 20, radius is:', circle.radius);

try {
  circle.radius = -5;
} catch (e) {
  console.log('Error setting negative radius:', e.message);
}

console.log('\n=== 6. GENERATOR METHODS ===\n');

class IterableRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  }
}

let range = new IterableRange(1, 5);
console.log('Iterating over range:');
for (let num of range) {
  console.log('  ', num);
}

console.log('Convert to array:', [...range]);

console.log('\n=== 7. COMPUTED PROPERTY NAMES ===\n');

let methodName = 'sayHello';
let propName = 'dynamicProperty';

class DynamicClass {
  [methodName]() {
    return 'Hello from computed method!';
  }

  [propName] = 'Dynamic value';

  ['method' + 'Two']() {
    return 'Method two!';
  }
}

let dc = new DynamicClass();
console.log('Computed method:', dc.sayHello());
console.log('Computed property:', dc.dynamicProperty);
console.log('Concatenated method name:', dc.methodTwo());

console.log('\n=== 8. PUBLIC INSTANCE FIELDS ===\n');

class BufferOld {
  constructor() {
    this.size = 0;
    this.capacity = 4096;
    this.data = [];
  }
}

// Modern syntax - fields declared in class body
class BufferModern {
  size = 0;
  capacity = 4096;
  data = [];

  add(item) {
    if (this.size < this.capacity) {
      this.data.push(item);
      this.size++;
    }
  }
}

let buffer = new BufferModern();
console.log('Initial buffer:', {
  size: buffer.size,
  capacity: buffer.capacity,
});
buffer.add('item1');
buffer.add('item2');
console.log('After adding items:', { size: buffer.size, data: buffer.data });

console.log('\n=== 9. PRIVATE FIELDS ===\n');

class BankAccount {
  #balance = 0; // Private field
  #accountNumber;

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return `Deposited $${amount}. New balance: $${this.#balance}`;
    }
    return 'Invalid amount';
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return `Withdrew $${amount}. New balance: $${this.#balance}`;
    }
    return 'Insufficient funds or invalid amount';
  }

  getBalance() {
    return this.#balance;
  }

  get accountInfo() {
    return `Account ${this.#accountNumber}: $${this.#balance}`;
  }
}

let account = new BankAccount('12345', 1000);
console.log(account.accountInfo);
console.log(account.deposit(500));
console.log(account.withdraw(200));
console.log('Current balance:', account.getBalance());

try {
  // console.log(account.#balance); // This will fail
} catch (e) {
  console.log('Cannot access private field directly');
}

console.log('\n=== 10. STATIC FIELDS ===\n');

class Configuration {
  static apiUrl = 'https://api.example.com';
  static timeout = 5000;
  static version = '1.0.0';

  static getConfig() {
    return {
      url: this.apiUrl,
      timeout: this.timeout,
      version: this.version,
    };
  }
}

console.log('Static fields:');
console.log('  API URL:', Configuration.apiUrl);
console.log('  Timeout:', Configuration.timeout);
console.log('  Version:', Configuration.version);
console.log('Full config:', Configuration.getConfig());

console.log('\n=== 11. PRIVATE STATIC FIELDS ===\n');

class SecureConfig {
  static #apiKey = 'secret_key_12345';
  static #secretToken = 'token_abc123';

  static authenticate(providedKey) {
    return providedKey === this.#apiKey;
  }

  static getToken() {
    return this.#secretToken;
  }
}

console.log(
  'Authentication (correct key):',
  SecureConfig.authenticate('secret_key_12345')
);
console.log(
  'Authentication (wrong key):',
  SecureConfig.authenticate('wrong_key')
);
console.log('Getting token:', SecureConfig.getToken());

console.log('\n=== 12. CLASS INHERITANCE (extends) ===\n');

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }

  getInfo() {
    return `${this.name} is a ${this.breed}`;
  }
}

let dog = new Dog('Max', 'Golden Retriever');
console.log(dog.speak());
console.log(dog.getInfo());

// Span example from the document
class Span extends IterableRange {
  constructor(start, length) {
    if (length >= 0) {
      super(start, start + length);
    } else {
      super(start + length, start);
    }
  }
}

let span = new Span(5, 3);
console.log('Span values:', [...span]);

console.log('\n=== 13. STRICT MODE IN CLASSES ===\n');

class StrictClass {
  constructor() {
    // All code in class bodies is automatically in strict mode
    try {
      // This will throw an error in strict mode
      undeclaredVariable = 10;
    } catch (e) {
      console.log('Strict mode error:', e.message);
    }
  }
}

new StrictClass();

console.log('\n=== 14. NO HOISTING ===\n');

try {
  // This will fail - classes are not hoisted
  // let p = new NotHoisted();
  console.log('Classes must be declared before use (no hoisting)');
} catch (e) {
  console.log('Error:', e.message);
}

class NotHoisted {
  constructor() {
    this.value = 'I exist now';
  }
}

let p = new NotHoisted();
console.log('After declaration:', p.value);

console.log('\n=== 15. COMPLETE EXAMPLE: COMPLEX NUMBER CLASS ===\n');

class Complex {
  // Constructor defines instance fields
  constructor(real, imaginary) {
    this.r = real;
    this.i = imaginary;
  }

  // Instance methods
  plus(that) {
    return new Complex(this.r + that.r, this.i + that.i);
  }

  times(that) {
    return new Complex(
      this.r * that.r - this.i * that.i,
      this.r * that.i + this.i * that.r
    );
  }

  // Static methods
  static sum(c, d) {
    return c.plus(d);
  }

  static product(c, d) {
    return c.times(d);
  }

  // Getters
  get real() {
    return this.r;
  }

  get imaginary() {
    return this.i;
  }

  get magnitude() {
    return Math.hypot(this.r, this.i);
  }

  // Standard methods
  toString() {
    return `{${this.r},${this.i}}`;
  }

  equals(that) {
    return that instanceof Complex && this.r === that.r && this.i === that.i;
  }
}

// Static fields (defined outside class)
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

console.log('Creating complex numbers:');
let c = new Complex(2, 3);
let d = new Complex(c.i, c.r);

console.log('c:', c.toString());
console.log('d:', d.toString());
console.log('c + d:', c.plus(d).toString());
console.log('c * d:', c.times(d).toString());
console.log('c.magnitude:', c.magnitude.toFixed(2));
console.log('Static method sum:', Complex.sum(c, d).toString());
console.log('Static method product:', Complex.product(c, d).toString());
console.log('Static field ZERO:', Complex.ZERO.toString());
console.log('Static field ONE:', Complex.ONE.toString());
console.log('Static field I:', Complex.I.toString());
console.log('c equals d?', c.equals(d));
console.log('c equals c?', c.equals(c));

console.log('\n=== 16. PRACTICAL EXAMPLE: USER CLASS ===\n');

class User {
  #password; // Private field
  static #userCount = 0;
  static #users = [];

  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.#password = password;
    this.createdAt = new Date();
    User.#userCount++;
    User.#users.push(this);
  }

  // Check password
  authenticate(password) {
    return this.#password === password;
  }

  // Change password
  changePassword(oldPassword, newPassword) {
    if (this.authenticate(oldPassword)) {
      this.#password = newPassword;
      return 'Password changed successfully';
    }
    return 'Incorrect old password';
  }

  // Getter for user info
  get info() {
    return `${this.username} (${this.email})`;
  }

  // Static methods
  static getUserCount() {
    return this.#userCount;
  }

  static getAllUsers() {
    return this.#users.map((u) => u.username);
  }

  static findByUsername(username) {
    return this.#users.find((u) => u.username === username);
  }
}

console.log('Creating users:');
let user1 = new User('alice', 'alice@example.com', 'password123');
let user2 = new User('bob', 'bob@example.com', 'secret456');
let user3 = new User('charlie', 'charlie@example.com', 'pass789');

console.log('User 1 info:', user1.info);
console.log('User 2 info:', user2.info);
console.log('Total users:', User.getUserCount());
console.log('All usernames:', User.getAllUsers());

console.log('\nAuthentication:');
console.log('Correct password:', user1.authenticate('password123'));
console.log('Wrong password:', user1.authenticate('wrongpass'));

console.log('\nChanging password:');
console.log(user1.changePassword('password123', 'newpassword'));
console.log(
  'Authenticate with new password:',
  user1.authenticate('newpassword')
);

console.log('\nFinding user:');
let found = User.findByUsername('bob');
console.log('Found user:', found ? found.info : 'Not found');

console.log('\n=== COMPLETE! ===');
console.log('All class features demonstrated successfully!');
