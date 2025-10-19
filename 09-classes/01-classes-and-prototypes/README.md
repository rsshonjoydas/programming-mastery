# JavaScript Classes and Prototypes

## What Are Classes and Prototypes?

In JavaScript, a **class** is a set of objects that inherit properties from the same **prototype object**. The prototype object is the central feature of a class and defines the shared behavior (methods) for all instances.

---

## Creating Classes with Prototypes

### Factory Function Pattern

The traditional way to create classes uses a factory function and a prototype object.

```javascript
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
let r = range(1, 3);
r.includes(2); // true
r.toString(); // "(1...3)"
[...r]; // [1, 2, 3]
```

**Key Components**:

1. **Factory function** (`range`) - Creates and initializes new instances
2. **Prototype object** (`range.methods`) - Stores shared methods
3. **Own properties** (`from`, `to`) - Instance-specific state
4. **this keyword** - Refers to the object through which methods are invoked

---

## Constructor Functions

A more traditional approach uses constructor functions with the `new` keyword.

### Basic Constructor Pattern

```javascript
function Range(from, to) {
  // Initialize instance properties
  this.from = from;
  this.to = to;
}

// Add methods to the prototype
Range.prototype.includes = function (x) {
  return this.from <= x && x <= this.to;
};

Range.prototype.toString = function () {
  return '(' + this.from + '...' + this.to + ')';
};

// Usage with 'new' keyword
let r = new Range(1, 3);
r.includes(2); // true
r.toString(); // "(1...3)"
```

**How `new` works**:

1. Creates a new empty object
2. Sets the object's prototype to `Constructor.prototype`
3. Calls the constructor function with `this` bound to the new object
4. Returns the new object (unless constructor explicitly returns an object)

---

## ES6 Classes

Modern JavaScript provides class syntax as syntactic sugar over prototypes.

### Class Declaration

```javascript
class Range {
  constructor(from, to) {
    // Initialize instance properties
    this.from = from;
    this.to = to;
  }

  // Methods are automatically added to the prototype
  includes(x) {
    return this.from <= x && x <= this.to;
  }

  // Generator method
  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  }

  toString() {
    return `(${this.from}...${this.to})`;
  }
}

// Usage (same as constructor function)
let r = new Range(1, 3);
```

### Class Expression

```javascript
// Anonymous class expression
let Range = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
};

// Named class expression
let Square = class Rect {
  constructor(side) {
    this.width = side;
    this.height = side;
  }
};
```

---

## Understanding Prototypes

### The Prototype Chain

Every object has an internal link to another object called its **prototype**. When you access a property:

1. JavaScript checks if the object has that property
2. If not, it checks the object's prototype
3. Continues up the chain until the property is found or reaching `null`

```javascript
let obj = new Range(1, 5);

// Property lookup:
// obj -> Range.prototype -> Object.prototype -> null

console.log(obj.includes); // Found on Range.prototype
console.log(obj.toString); // Found on Range.prototype (or Object.prototype)
console.log(obj.hasOwnProperty); // Found on Object.prototype
```

### Checking Prototypes

```javascript
// Get an object's prototype
Object.getPrototypeOf(obj) === Range.prototype; // true

// Check if object is instance of a class
obj instanceof Range; // true
obj instanceof Object; // true

// Check if object inherits from a prototype
Range.prototype.isPrototypeOf(obj); // true
```

---

## Instance vs Prototype Properties

### Own Properties (Instance)

Properties defined directly on each instance:

```javascript
class Person {
  constructor(name, age) {
    this.name = name; // Own property
    this.age = age; // Own property
  }
}

let person = new Person('Alice', 30);
person.hasOwnProperty('name'); // true
person.hasOwnProperty('greet'); // false
```

### Prototype Properties (Shared)

Methods defined on the prototype are shared by all instances:

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    // On Person.prototype
    return `Hello, I'm ${this.name}`;
  }
}

let p1 = new Person('Alice');
let p2 = new Person('Bob');

// Same method (shared)
p1.greet === p2.greet; // true

// Different instance properties
p1.name === p2.name; // false
```

---

## The `this` Keyword in Classes

The `this` keyword refers to the object through which a method was invoked.

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++; // 'this' refers to the instance
    return this.count;
  }
}

let c = new Counter();
c.increment(); // this = c
c.increment(); // this = c
console.log(c.count); // 2
```

### `this` Binding Issues

```javascript
class Button {
  constructor(label) {
    this.label = label;
  }

  click() {
    console.log(`${this.label} clicked`);
  }
}

let btn = new Button('Submit');
btn.click(); // "Submit clicked"

// Problem: losing 'this' context
let handleClick = btn.click;
handleClick(); // TypeError: Cannot read property 'label' of undefined

// Solution 1: Bind
handleClick = btn.click.bind(btn);
handleClick(); // "Submit clicked"

// Solution 2: Arrow function in constructor
class Button2 {
  constructor(label) {
    this.label = label;
    this.click = () => {
      console.log(`${this.label} clicked`);
    };
  }
}
```

---

## Static Methods and Properties

Static members belong to the class itself, not instances.

```javascript
class MathUtils {
  // Static method
  static add(a, b) {
    return a + b;
  }

  // Static property
  static PI = 3.14159;
}

// Call on the class, not instances
MathUtils.add(2, 3); // 5
MathUtils.PI; // 3.14159

// NOT available on instances
let util = new MathUtils();
util.add(2, 3); // TypeError: util.add is not a function
```

---

## Getters and Setters

Define computed properties with custom get/set behavior.

```javascript
class Circle {
  constructor(radius) {
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    if (value < 0) throw new Error('Radius must be positive');
    this._radius = value;
  }

  get area() {
    return Math.PI * this._radius ** 2;
  }
}

let c = new Circle(5);
console.log(c.radius); // 5
console.log(c.area); // 78.54...

c.radius = 10; // Uses setter
console.log(c.area); // 314.16...
```

---

## Inheritance

Classes can extend other classes to inherit their behavior.

```javascript
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

  // Override parent method
  speak() {
    return `${this.name} barks`;
  }

  // Call parent method
  describe() {
    return super.speak() + ` and is a ${this.breed}`;
  }
}

let dog = new Dog('Buddy', 'Golden Retriever');
dog.speak(); // "Buddy barks"
dog.describe(); // "Buddy makes a sound and is a Golden Retriever"
```

### The `super` Keyword

- `super()` - Calls the parent constructor (must be first in child constructor)
- `super.method()` - Calls a parent method

---

## Private Fields (ES2022)

Use `#` prefix for truly private properties.

```javascript
class BankAccount {
  #balance = 0; // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.#balance); // SyntaxError: Private field
```

---

## Comparison: Factory vs Constructor vs Class

```javascript
// 1. Factory Function
function createPerson(name) {
  return {
    name: name,
    greet() {
      return `Hi, I'm ${this.name}`;
    },
  };
}
let p1 = createPerson('Alice');

// 2. Constructor Function
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};
let p2 = new Person('Bob');

// 3. ES6 Class
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi, I'm ${this.name}`;
  }
}
let p3 = new PersonClass('Charlie');
```

| Feature            | Factory         | Constructor     | Class         |
| ------------------ | --------------- | --------------- | ------------- |
| **Syntax**         | Simple function | Function + new  | class keyword |
| **Prototype**      | Manual setup    | Automatic       | Automatic     |
| **`new` required** | ❌ No           | ✅ Yes          | ✅ Yes        |
| **instanceof**     | ❌ No           | ✅ Yes          | ✅ Yes        |
| **Inheritance**    | Manual          | prototype chain | extends       |
| **Modern**         | Traditional     | Traditional     | ✅ Preferred  |

---

## Best Practices

✅ **Use ES6 classes** for modern JavaScript (cleaner syntax)
✅ **Define methods on prototype** to save memory (shared across instances)
✅ **Use constructor** to initialize instance properties
✅ **Use `this`** to access instance properties and methods
✅ **Use static methods** for utility functions related to the class
✅ **Use getters/setters** for computed or validated properties
✅ **Use private fields (#)** for true encapsulation
✅ **Use `super`** in subclasses to call parent constructor/methods
✅ **Be careful with `this` binding** when passing methods as callbacks

---

## Key Concepts Summary

📌 **Classes** are sets of objects inheriting from the same prototype
📌 **Prototype objects** define shared behavior (methods)
📌 **Own properties** store instance-specific state
📌 **`this` keyword** refers to the invocation object
📌 **Constructor functions** create and initialize instances
📌 **ES6 classes** are syntactic sugar over prototypes
📌 **Prototype chain** enables property inheritance
📌 **Static members** belong to the class, not instances
📌 **Getters/setters** provide computed properties
📌 **Inheritance** (extends) enables code reuse
📌 **Private fields** (#) provide true encapsulation
📌 **Methods on prototype** are shared; instance properties are unique
