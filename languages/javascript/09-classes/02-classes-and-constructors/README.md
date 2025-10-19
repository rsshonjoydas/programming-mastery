# JavaScript Classes and Constructors

## What is a Constructor?

A **constructor** is a special function designed to initialize newly created objects. Constructors are invoked using the `new` keyword and serve as the foundation for creating classes in JavaScript.

### Key Characteristics

- Automatically creates a new object when invoked with `new`
- The new object is accessible as `this` inside the constructor
- The constructor's `prototype` property becomes the prototype of the new object
- Constructor names conventionally start with **capital letters**
- Should not be invoked without `new` (except in special cases)

---

## Constructor Function Pattern (Pre-ES6)

This was the idiomatic way to create classes before ES6.

### Basic Syntax

```javascript
// Constructor function
function Range(from, to) {
  // Initialize instance properties (state)
  this.from = from;
  this.to = to;
}

// Add methods to the prototype
Range.prototype = {
  includes: function (x) {
    return this.from <= x && x <= this.to;
  },

  toString: function () {
    return '(' + this.from + '...' + this.to + ')';
  },

  // Generator method
  [Symbol.iterator]: function* () {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      yield x;
    }
  },
};

// Usage
let r = new Range(1, 3);
console.log(r.includes(2)); // true
console.log(r.toString()); // "(1...3)"
console.log([...r]); // [1, 2, 3]
```

---

## How Constructor Invocation Works

### With `new` Keyword (Constructor Invocation)

```javascript
let r = new Range(1, 3);
```

**What happens:**

1. A new empty object is created
2. The new object's prototype is set to `Range.prototype`
3. The constructor is called with `this` bound to the new object
4. The constructor initializes `this` (adds properties)
5. The new object is automatically returned (unless constructor explicitly returns an object)

### Without `new` Keyword (Regular Function Call)

```javascript
let r = Range(1, 3); // Wrong! Don't do this
```

**Problems:**

- No new object is created
- `this` refers to the global object (or `undefined` in strict mode)
- Properties are added to the wrong object
- Nothing is returned (unless explicit return statement)

---

## Constructor vs Factory Function

### Factory Function (Example 9-1 style)

```javascript
function range(from, to) {
  let r = Object.create(range.methods); // Manually create object
  r.from = from;
  r.to = to;
  return r; // Explicitly return
}

range.methods = {
  includes(x) {
    return this.from <= x && x <= this.to;
  },
};

let r = range(1, 3); // Called without 'new'
```

### Constructor Function (Example 9-2 style)

```javascript
function Range(from, to) {
  this.from = from; // No manual object creation
  this.to = to;
  // No explicit return
}

Range.prototype = {
  includes(x) {
    return this.from <= x && x <= this.to;
  },
};

let r = new Range(1, 3); // Called with 'new'
```

### Key Differences

| Feature             | Factory Function         | Constructor Function  |
| ------------------- | ------------------------ | --------------------- |
| **Invocation**      | `range(1, 3)`            | `new Range(1, 3)`     |
| **Naming**          | lowercase                | **Uppercase**         |
| **Object creation** | Manual (`Object.create`) | Automatic (via `new`) |
| **Return**          | Explicit                 | Implicit              |
| **Prototype**       | Custom name              | Must be `.prototype`  |

---

## The Prototype Property

### What is `prototype`?

- **Function objects** have a `prototype` property
- This property is an **object** that becomes the prototype of instances created by the constructor
- The name **must be** `prototype` for constructors

```javascript
function Person(name) {
  this.name = name;
}

// Person.prototype is the prototype of all Person instances
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

let alice = new Person('Alice');
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
```

### Almost All Objects Have a Prototype

- **Almost all objects** have a prototype (they inherit from something)
- **Only function objects** have a `prototype` property
- Objects with a `prototype` property define prototypes for other objects

---

## The `new.target` Expression

`new.target` allows you to detect whether a function was called as a constructor.

### Basic Usage

```javascript
function MyClass() {
  console.log(new.target); // Defined if called with 'new'
}

new MyClass(); // Logs: [Function: MyClass]
MyClass(); // Logs: undefined
```

### Auto-Fixing Missing `new`

```javascript
function Person(name) {
  if (!new.target) {
    return new Person(name); // Call with 'new' if forgotten
  }
  this.name = name;
}

let p1 = new Person('Alice'); // Works
let p2 = Person('Bob'); // Also works (auto-corrects)
```

**Note**: ES6 classes don't allow constructors to be invoked without `new`.

---

## Class Identity and `instanceof`

### The `instanceof` Operator

Tests if an object is an instance of a class by checking its prototype chain.

```javascript
let r = new Range(1, 3);
console.log(r instanceof Range); // true
```

**How it works:**

- Checks if `r` inherits from `Range.prototype`
- Inheritance can be indirect (through prototype chain)
- Returns `true` if anywhere in the chain

### Important: `instanceof` Checks Prototypes, Not Constructors

```javascript
function Strange() {}
Strange.prototype = Range.prototype; // Use same prototype

let s = new Strange();
console.log(s instanceof Range); // true (but s is not initialized properly!)
```

### Testing Without `instanceof`

Use `isPrototypeOf()` for classes without constructors:

```javascript
let methods = {
  greet() {
    return 'Hello';
  },
};

let obj = Object.create(methods);
console.log(methods.isPrototypeOf(obj)); // true
```

---

## The `constructor` Property

### Automatic Constructor Property

Every function automatically gets a `prototype` object with a `constructor` property:

```javascript
function F() {}

console.log(F.prototype.constructor === F); // true
```

**Relationship:**

```text
F (constructor function)
  ↓
F.prototype (prototype object)
  ↓ constructor property
F (back-reference)
```

### Instances Inherit `constructor`

```javascript
let obj = new F();
console.log(obj.constructor === F); // true
```

This allows you to determine an object's class:

```javascript
function getClassName(obj) {
  return obj.constructor.name;
}
```

### Problem: Overwriting Prototype Loses Constructor

```javascript
function Range(from, to) {
  this.from = from;
  this.to = to;
}

// This overwrites the default prototype and loses constructor
Range.prototype = {
  includes(x) {
    return this.from <= x && x <= this.to;
  },
};

let r = new Range(1, 3);
console.log(r.constructor === Range); // false! (broken)
```

### Solution 1: Explicitly Set Constructor

```javascript
Range.prototype = {
  constructor: Range, // Restore constructor reference
  includes(x) {
    return this.from <= x && x <= this.to;
  },
};
```

### Solution 2: Add Methods Without Overwriting

```javascript
// Keep the default prototype object
Range.prototype.includes = function (x) {
  return this.from <= x && x <= this.to;
};

Range.prototype.toString = function () {
  return '(' + this.from + '...' + this.to + ')';
};
```

---

## Arrow Functions and Constructors

### Why Arrow Functions Can't Be Constructors

Arrow functions:

- Don't have a `prototype` property
- Don't have their own `this` binding
- Inherit `this` from surrounding context

```javascript
const BadConstructor = (name) => {
  this.name = name; // 'this' is inherited, not the new object
};

// new BadConstructor("Test"); // TypeError: not a constructor
```

### Arrow Functions in Methods

**Don't use arrow functions for methods:**

```javascript
// BAD: Arrow function doesn't have proper 'this'
Range.prototype.includes = (x) => {
  return this.from <= x && x <= this.to; // 'this' is wrong!
};
```

**Good: Regular function has proper `this`:**

```javascript
Range.prototype.includes = function (x) {
  return this.from <= x && x <= this.to; // 'this' is the instance
};
```

---

## Complete Constructor Pattern Example

```javascript
// Constructor function (capital letter)
function Person(name, age) {
  // Initialize instance properties
  this.name = name;
  this.age = age;
}

// Add methods to prototype (shared by all instances)
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}, ${this.age} years old`;
};

Person.prototype.birthday = function () {
  this.age++;
  console.log(`Happy birthday! Now ${this.age}`);
};

// Static method (on constructor, not prototype)
Person.compareAge = function (p1, p2) {
  return p1.age - p2.age;
};

// Create instances
let alice = new Person('Alice', 30);
let bob = new Person('Bob', 25);

console.log(alice.greet()); // "Hello, I'm Alice, 30 years old"
alice.birthday(); // "Happy birthday! Now 31"
console.log(Person.compareAge(alice, bob)); // 6
```

---

## Best Practices

✅ **Use capital letters** for constructor names
✅ **Always invoke constructors with `new`**
✅ **Don't use arrow functions** for constructors or methods
✅ **Add methods to `prototype`** for memory efficiency (shared across instances)
✅ **Preserve the `constructor` property** when replacing prototype
✅ **Use `instanceof`** to check class membership
✅ **Consider ES6 classes** for cleaner, modern syntax

---

## Key Concepts Summary

📌 **Constructors** initialize new objects invoked with `new`
📌 **Constructor names** conventionally start with uppercase letters
📌 **`new` keyword** automatically creates objects and sets up prototypes
📌 **`prototype` property** (on constructors) defines inherited methods
📌 **All instances** created by the same constructor share the same prototype
📌 **`instanceof`** checks if an object inherits from a constructor's prototype
📌 **`constructor` property** provides back-reference to the constructor function
📌 **`new.target`** detects if a function was called as a constructor
📌 **Arrow functions** cannot be constructors or methods (no `prototype`, wrong `this`)
📌 **Factory functions** are an alternative pattern without `new`

---

## Evolution to ES6 Classes

The constructor pattern shown here is how classes worked **before ES6**. Modern JavaScript uses the `class` keyword, which provides cleaner syntax but works the same way "under the hood":

```javascript
// Modern ES6 class (syntactic sugar)
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  includes(x) {
    return this.from <= x && x <= this.to;
  }
}

// Works exactly like the constructor function pattern!
let r = new Range(1, 3);
```

Understanding the constructor pattern is essential for:

- Reading older JavaScript code
- Understanding what ES6 classes do behind the scenes
- Debugging and advanced prototype manipulation
