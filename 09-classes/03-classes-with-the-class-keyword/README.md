# JavaScript Classes with the `class` Keyword

## Introduction to Classes

Classes have been part of JavaScript since the beginning, but **ES6** introduced the `class` keyword as **syntactic sugar** over JavaScript's prototype-based inheritance. Classes defined with `class` work exactly the same way as constructor functions—they're just cleaner and more convenient to write.

---

## Basic Class Syntax

```javascript
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

// Using the class
let r = new Range(1, 3);
r.includes(2); // true
r.toString(); // "(1...3)"
```

### Key Syntax Points

✅ **Class declaration**: `class` keyword followed by class name and body in `{}`
✅ **No commas**: Methods are separated without commas (unlike object literals)
✅ **Method shorthand**: Use object literal method syntax (no `function` keyword)
✅ **Constructor**: Special `constructor` method defines initialization logic
✅ **Not object literals**: Class bodies look similar but are fundamentally different

---

## The Constructor Method

The `constructor` method initializes new instances:

```javascript
class Person {
  constructor(name, age) {
    this.name = name; // Instance field
    this.age = age; // Instance field
  }
}

let person = new Person('Alice', 30);
```

**Important points**:

- The function is assigned to the class name variable (`Person`)
- Not actually named "constructor" internally
- Can be omitted if no initialization is needed (empty constructor created automatically)

```javascript
class Empty {
  // No constructor needed - implicit empty constructor
}
```

---

## Class Declaration vs Expression

### Class Declaration (Statement Form)

```javascript
class Square {
  constructor(x) {
    this.area = x * x;
  }
}
```

### Class Expression

```javascript
let Square = class {
  constructor(x) {
    this.area = x * x;
  }
};

new Square(3).area; // 9
```

**Named class expression** (name only visible inside class body):

```javascript
let Square = class MySquare {
  constructor(x) {
    this.area = x * x;
  }
  // MySquare is accessible here, but not outside
};
```

---

## Static Methods

Static methods belong to the **class itself**, not instances. They're defined on the constructor function, not the prototype.

```javascript
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  // Static method
  static parse(s) {
    let matches = s.match(/^\((\d+)\.\.\.(\d+)\)$/);
    if (!matches) {
      throw new TypeError(`Cannot parse Range from "${s}".`);
    }
    return new Range(parseInt(matches[1]), parseInt(matches[2]));
  }
}

// Call on the class, not an instance
let r = Range.parse('(1...10)'); // Works
r.parse('(1...10)'); // TypeError: r.parse is not a function
```

**When to use static methods**:

- Factory methods (like `parse()`)
- Utility functions related to the class
- Methods that don't need access to instance data
- Usually avoid using `this` in static methods

---

## Getters and Setters

Define getter and setter methods just like in object literals (without commas):

```javascript
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  get area() {
    return Math.PI * this.radius ** 2;
  }

  get diameter() {
    return this.radius * 2;
  }

  set diameter(d) {
    this.radius = d / 2;
  }
}

let c = new Circle(5);
console.log(c.area); // 78.54 (getter)
console.log(c.diameter); // 10 (getter)
c.diameter = 20; // Uses setter
console.log(c.radius); // 10
```

---

## Generator Methods and Computed Names

You can use **all shorthand method syntaxes** from object literals:

### Generator Methods

```javascript
class Range {
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

let r = new Range(1, 3);
[...r]; // [1, 2, 3] - class is now iterable
```

### Computed Property Names

```javascript
let methodName = 'sayHello';

class Greeter {
  [methodName]() {
    return 'Hello!';
  }
}

let g = new Greeter();
g.sayHello(); // "Hello!"
```

---

## Public, Private, and Static Fields

### Traditional Field Definition (ES6)

Fields are defined in the constructor or methods:

```javascript
class Buffer {
  constructor() {
    this.size = 0; // Instance field
    this.capacity = 4096; // Instance field
    this.buffer = new Uint8Array(this.capacity);
  }
}
```

### Modern Public Instance Fields

Define fields directly in the class body (widely supported now):

```javascript
class Buffer {
  size = 0;
  capacity = 4096;
  buffer = new Uint8Array(this.capacity);

  // No constructor needed if only initializing fields
}
```

**Advantages**:

- Fields declared at the top make class structure clear
- Still executed as part of constructor
- Can reference other fields with `this.`

### Private Fields (# prefix)

Private fields are invisible outside the class:

```javascript
class Buffer {
  #size = 0; // Private field

  get size() {
    return this.#size; // Read-only access via getter
  }

  resize(newSize) {
    this.#size = newSize; // Can modify inside class
  }
}

let b = new Buffer();
console.log(b.size); // 0 (via getter)
b.#size = 10; // SyntaxError: private field access outside class
```

**Important**:

- Must be declared in class body before use
- Cannot write `this.#size = 0` in constructor without declaration
- Truly private (not accessible even with bracket notation)

### Static Fields

Static fields belong to the class itself:

```javascript
class Range {
  static integerRangePattern = /^\((\d+)\.\.\.(\d+)\)$/;

  static parse(s) {
    let matches = s.match(Range.integerRangePattern);
    if (!matches) {
      throw new TypeError(`Cannot parse Range from "${s}".`);
    }
    return new Range(parseInt(matches[1]), parseInt(matches[2]));
  }
}
```

**Private static fields**:

```javascript
class Config {
  static #apiKey = 'secret123';

  static getApiKey() {
    return this.#apiKey;
  }
}
```

### Defining Static Fields Outside Class (Traditional)

```javascript
class Complex {
  constructor(real, imaginary) {
    this.r = real;
    this.i = imaginary;
  }
}

// Define static fields outside
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
```

---

## Class Inheritance with `extends`

Use `extends` to create subclasses:

```javascript
class Span extends Range {
  constructor(start, length) {
    if (length >= 0) {
      super(start, start + length); // Call parent constructor
    } else {
      super(start + length, start);
    }
  }
}
```

**Key points**:

- `extends` creates a subclass relationship
- `super()` calls the parent class constructor
- Must call `super()` before using `this` in subclass constructor
- Covered in detail in subclassing section (§9.5)

---

## Important Class Behavior

### 1. Strict Mode

All code in class bodies runs in **strict mode** automatically:

```javascript
class MyClass {
  constructor() {
    // Automatically in strict mode
    // Can't use: octal literals, with statement
    // Must declare variables before use
    x = 10; // ReferenceError: x is not defined
  }
}
```

### 2. No Hoisting

Unlike function declarations, **class declarations are not hoisted**:

```javascript
let p = new Person('Alice', 30); // ReferenceError

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

You must declare the class before using it.

---

## Complete Example: Complex Number Class

```javascript
class Complex {
  // Public instance fields (modern syntax)
  // r = 0;
  // i = 0;

  // Or use private fields:
  // #r = 0;
  // #i = 0;

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

// Static fields (traditional way)
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

// Using the class
let c = new Complex(2, 3);
let d = new Complex(c.i, c.r);

c.plus(d).toString(); // "{5,5}"
c.magnitude; // Math.hypot(2,3)
Complex.product(c, d); // new Complex(0, 13)
Complex.ZERO.toString(); // "{0,0}"
```

---

## Summary: Class Features

| Feature             | Syntax                       | Location             |
| ------------------- | ---------------------------- | -------------------- |
| **Instance method** | `methodName() {}`            | Prototype            |
| **Static method**   | `static methodName() {}`     | Constructor          |
| **Getter**          | `get propName() {}`          | Prototype            |
| **Setter**          | `set propName(val) {}`       | Prototype            |
| **Public field**    | `fieldName = value;`         | Instance             |
| **Private field**   | `#fieldName = value;`        | Instance (hidden)    |
| **Static field**    | `static fieldName = value;`  | Constructor          |
| **Private static**  | `static #fieldName = value;` | Constructor (hidden) |
| **Generator**       | `*methodName() {}`           | Prototype            |
| **Constructor**     | `constructor() {}`           | Special              |

---

## Key Concepts

✅ `class` is **syntactic sugar** over prototype-based classes
✅ Classes are **constructor functions** under the hood
✅ Class bodies use **method shorthand** without commas
✅ **Constructor** initializes instances
✅ **Static methods** belong to the class, not instances
✅ **Getters/setters** provide computed properties
✅ **Public fields** can be declared in class body
✅ **Private fields** (with `#`) are truly inaccessible outside the class
✅ **Static fields** belong to the constructor
✅ All class code runs in **strict mode**
✅ Classes are **not hoisted** (unlike functions)
✅ `extends` creates subclasses with `super()` for parent access
