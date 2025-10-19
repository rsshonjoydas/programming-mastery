# JavaScript Classes

## What Are Classes?

A **class** is a blueprint for creating objects that share:

- **Properties** (state): Data that varies per instance
- **Methods** (behavior): Functions shared by all instances

**Example concept**: A `Complex` class representing complex numbers

- **Properties**: `real` and `imaginary` parts (unique to each instance)
- **Methods**: `add()` and `multiply()` (shared by all instances)

---

## How JavaScript Classes Work

JavaScript uses **prototype-based inheritance**:

- Objects that inherit from the same **prototype** are instances of the same class
- Classes are implemented through **constructor functions** or the **`class` keyword** (ES6+)
- Unlike Java/C++, JavaScript's class system is fundamentally different—it's built on prototypes, not traditional class-based inheritance

---

## Two Ways to Define Classes

### 1. Old-Style (Constructor Functions + Prototypes)

Shows what happens "under the hood"

### 2. Modern Style (ES6 `class` keyword)

Cleaner syntax that does the same thing

---

## Old-Style Classes (Pre-ES6)

### Constructor Functions

A constructor function creates and initializes objects:

```javascript
// Constructor function (capitalized by convention)
function Complex(real, imaginary) {
  this.real = real; // Instance property
  this.imaginary = imaginary; // Instance property
}

// Create instances
let c1 = new Complex(2, 3);
let c2 = new Complex(4, 5);

console.log(c1.real); // 2
console.log(c2.imaginary); // 5
```

**Key points**:

- Constructor names are capitalized by convention
- Use `new` keyword to create instances
- `this` refers to the newly created object
- Each instance gets its own copy of properties

### Adding Methods via Prototype

Methods are added to the constructor's `prototype` so all instances share them:

```javascript
// Add methods to the prototype
Complex.prototype.add = function (that) {
  return new Complex(this.real + that.real, this.imaginary + that.imaginary);
};

Complex.prototype.multiply = function (that) {
  return new Complex(
    this.real * that.real - this.imaginary * that.imaginary,
    this.real * that.imaginary + this.imaginary * that.real
  );
};

Complex.prototype.toString = function () {
  return `${this.real} + ${this.imaginary}i`;
};

// Use the methods
let c1 = new Complex(2, 3);
let c2 = new Complex(1, 2);
let sum = c1.add(c2);

console.log(sum.toString()); // "3 + 5i"
```

**Why use prototype?**

- Methods defined on the prototype are **shared** by all instances
- Saves memory (one copy of each method, not one per instance)
- All instances inherit from `Complex.prototype`

### Understanding the Prototype Chain

```javascript
function Complex(real, imaginary) {
  this.real = real;
  this.imaginary = imaginary;
}

Complex.prototype.toString = function () {
  return `${this.real} + ${this.imaginary}i`;
};

let c = new Complex(2, 3);

// Prototype relationships
console.log(c.__proto__ === Complex.prototype); // true
console.log(Complex.prototype.constructor === Complex); // true
console.log(Object.getPrototypeOf(c) === Complex.prototype); // true
```

**Prototype chain**: `c` → `Complex.prototype` → `Object.prototype` → `null`

---

## Modern Style: ES6 Classes

The `class` keyword provides cleaner syntax but works the same way internally:

### Basic Class Syntax

```javascript
class Complex {
  // Constructor method
  constructor(real, imaginary) {
    this.real = real; // Instance property
    this.imaginary = imaginary; // Instance property
  }

  // Instance methods (automatically added to prototype)
  add(that) {
    return new Complex(this.real + that.real, this.imaginary + that.imaginary);
  }

  multiply(that) {
    return new Complex(
      this.real * that.real - this.imaginary * that.imaginary,
      this.real * that.imaginary + this.imaginary * that.real
    );
  }

  toString() {
    return `${this.real} + ${this.imaginary}i`;
  }
}

// Usage is identical
let c1 = new Complex(2, 3);
let c2 = new Complex(1, 2);
let sum = c1.add(c2);

console.log(sum.toString()); // "3 + 5i"
```

**Key differences from constructor functions**:

- Uses `class` keyword
- `constructor()` method for initialization
- Methods defined directly in class body (no `prototype` needed)
- Cleaner, more readable syntax
- **Still prototype-based** under the hood

---

## Class Features

### 1. Constructor Method

The `constructor()` method initializes new instances:

```javascript
class Person {
  constructor(name, age) {
    this.name = name; // Instance property
    this.age = age; // Instance property
  }
}

let person = new Person('Alice', 30);
```

**Rules**:

- Only one `constructor()` per class
- Called automatically when using `new`
- Optional—if omitted, a default empty constructor is used

### 2. Instance Methods

Methods available on every instance:

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}

let rect = new Rectangle(10, 5);
console.log(rect.area()); // 50
console.log(rect.perimeter()); // 30
```

### 3. Getter and Setter Methods

Control property access with computed values:

```javascript
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  // Getter (accessed like a property)
  get area() {
    return Math.PI * this.radius ** 2;
  }

  get circumference() {
    return 2 * Math.PI * this.radius;
  }

  // Setter (assigned like a property)
  set diameter(d) {
    this.radius = d / 2;
  }

  get diameter() {
    return this.radius * 2;
  }
}

let circle = new Circle(5);
console.log(circle.area); // 78.54 (no parentheses)
console.log(circle.diameter); // 10

circle.diameter = 20; // Uses setter
console.log(circle.radius); // 10
```

### 4. Static Methods

Methods that belong to the class itself, not instances:

```javascript
class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static PI = 3.14159; // Static property
}

// Call on the class, not instances
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.multiply(4, 2)); // 8
console.log(MathUtils.PI); // 3.14159

// Cannot call on instances
let math = new MathUtils();
// math.add(1, 2); // Error: not a function
```

**Use cases**:

- Factory methods
- Utility functions
- Constants related to the class

### 5. Static Properties

Properties that belong to the class:

```javascript
class Counter {
  static count = 0;

  constructor() {
    Counter.count++;
  }

  static getCount() {
    return Counter.count;
  }
}

new Counter();
new Counter();
new Counter();

console.log(Counter.getCount()); // 3
```

### 6. Private Fields (ES2022)

Properties that cannot be accessed outside the class:

```javascript
class BankAccount {
  #balance = 0; // Private field (# prefix)

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
// console.log(account.#balance);  // SyntaxError: Private field
```

### 7. Private Methods

```javascript
class SecureData {
  #data = [];

  #validate(item) {
    // Private method
    return item !== null && item !== undefined;
  }

  add(item) {
    if (this.#validate(item)) {
      this.#data.push(item);
    }
  }
}
```

---

## Class Inheritance

### Extending Classes

Use `extends` to create subclasses:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }

  fetch() {
    console.log(`${this.name} fetches the ball`);
  }
}

let dog = new Dog('Rex', 'Labrador');
dog.speak(); // "Rex barks" (overridden method)
dog.fetch(); // "Rex fetches the ball" (new method)
```

### The `super` Keyword

**In constructor**:

- Must call `super()` before using `this`
- Calls the parent class constructor

```javascript
class Employee extends Person {
  constructor(name, age, salary) {
    super(name, age); // Call Person constructor
    this.salary = salary;
  }
}
```

**In methods**:

- Access parent class methods

```javascript
class Cat extends Animal {
  speak() {
    super.speak(); // Call parent's speak()
    console.log(`${this.name} also meows`);
  }
}

let cat = new Cat('Whiskers');
cat.speak();
// "Whiskers makes a sound"
// "Whiskers also meows"
```

### Inheritance Chain

```javascript
class Animal {
  eat() {
    console.log('eating');
  }
}

class Mammal extends Animal {
  breathe() {
    console.log('breathing');
  }
}

class Dog extends Mammal {
  bark() {
    console.log('barking');
  }
}

let dog = new Dog();
dog.bark(); // Own method
dog.breathe(); // From Mammal
dog.eat(); // From Animal
```

**Prototype chain**: `dog` → `Dog.prototype` → `Mammal.prototype` → `Animal.prototype` → `Object.prototype` → `null`

---

## Class Expressions

Classes can be defined as expressions:

```javascript
// Anonymous class expression
const MyClass = class {
  constructor(value) {
    this.value = value;
  }
};

// Named class expression
const MyNamedClass = class NamedClass {
  constructor(value) {
    this.value = value;
  }
};

let obj = new MyClass(42);
```

---

## Class vs Constructor Function Differences

| Feature            | Constructor Function                  | ES6 Class                        |
| ------------------ | ------------------------------------- | -------------------------------- |
| **Syntax**         | Function-based                        | `class` keyword                  |
| **Hoisting**       | Hoisted                               | Not hoisted (temporal dead zone) |
| **Strict mode**    | Optional                              | Always in strict mode            |
| **`new` required** | Works without `new` (not recommended) | Throws error without `new`       |
| **Methods**        | Added to prototype manually           | Defined in class body            |
| **Readability**    | More verbose                          | Cleaner, clearer                 |

---

## Important Concepts

### 1. Classes Are Functions

```javascript
class MyClass {}

console.log(typeof MyClass); // "function"
console.log(MyClass.prototype); // Object with constructor
```

Classes are **syntactic sugar** over constructor functions and prototypes.

### 2. Classes Are Not Hoisted

```javascript
// let p = new Person(); // ReferenceError

class Person {
  constructor(name) {
    this.name = name;
  }
}

let p = new Person('Alice'); // OK
```

### 3. Class Body Is in Strict Mode

```javascript
class MyClass {
  method() {
    // Automatically in strict mode
    // this = undefined in non-method context
  }
}
```

### 4. Instance vs Prototype Properties

```javascript
class Example {
  constructor() {
    this.instanceProp = 'instance'; // Own property
  }

  prototypeProp = 'prototype'; // Also instance property (ES2022)

  method() {} // On prototype
}

let ex = new Example();
console.log(ex.hasOwnProperty('instanceProp')); // true
console.log(ex.hasOwnProperty('method')); // false
console.log('method' in ex); // true (inherited)
```

---

## Practical Examples

### Example 1: Todo List Class

```javascript
class TodoList {
  #todos = [];

  add(task) {
    this.#todos.push({ task, completed: false, id: Date.now() });
  }

  complete(id) {
    let todo = this.#todos.find((t) => t.id === id);
    if (todo) todo.completed = true;
  }

  remove(id) {
    this.#todos = this.#todos.filter((t) => t.id !== id);
  }

  getAll() {
    return [...this.#todos]; // Return copy
  }

  getPending() {
    return this.#todos.filter((t) => !t.completed);
  }
}

let todos = new TodoList();
todos.add('Learn JavaScript');
todos.add('Build a project');
console.log(todos.getAll());
```

### Example 2: Shape Hierarchy

```javascript
class Shape {
  constructor(color) {
    this.color = color;
  }

  describe() {
    return `A ${this.color} shape`;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  describe() {
    return `${super.describe()} - Rectangle`;
  }
}

class Square extends Rectangle {
  constructor(color, side) {
    super(color, side, side);
  }

  describe() {
    return `${super.describe()} - Square`;
  }
}

let square = new Square('red', 5);
console.log(square.describe()); // "A red shape - Rectangle - Square"
console.log(square.area()); // 25
```

---

## Key Concepts Summary

✅ **Classes** define blueprints for creating objects with shared behavior
✅ **JavaScript uses prototype-based inheritance**, not classical inheritance
✅ **Constructor functions** (old-style) vs **`class` keyword** (modern ES6+)
✅ **Methods** defined in classes are added to the prototype automatically
✅ **`constructor()`** method initializes new instances
✅ **Getters/setters** provide computed property access
✅ **Static methods/properties** belong to the class, not instances
✅ **Private fields** (`#field`) and methods restrict access
✅ **`extends`** creates subclasses; **`super`** accesses parent class
✅ **Classes are functions** under the hood (syntactic sugar)
✅ **Classes are not hoisted** and always run in strict mode
✅ **Inheritance follows the prototype chain**
