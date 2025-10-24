# The Prototype Attribute

## What is the Prototype Attribute?

The **prototype attribute** specifies the object from which another object inherits properties. It's so fundamental that we typically say "the prototype of o" rather than "the prototype attribute of o."

### Important Distinction

- **`prototype` attribute**: The internal link that determines inheritance (what an object inherits FROM)
- **`prototype` property**: An ordinary object property on constructor functions (what objects will inherit)

```javascript
// Constructor's prototype property defines what objects will inherit
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  console.log('Hello!');
};

// Created object's prototype attribute links to Person.prototype
let person = new Person('Alice');
```

---

## How Prototypes Are Set

The prototype attribute is set **when an object is created** and normally remains fixed.

### 1. Object Literals

Objects created with `{}` use `Object.prototype` as their prototype:

```javascript
let obj = { x: 1, y: 2 };
// Prototype is Object.prototype
```

### 2. Constructor Functions (new)

Objects created with `new` use the constructor's `prototype` property:

```javascript
let arr = new Array();
// Prototype is Array.prototype

let date = new Date();
// Prototype is Date.prototype
```

### 3. Object.create()

Objects created with `Object.create()` use the first argument as their prototype:

```javascript
let parent = { x: 1 };
let child = Object.create(parent);
// Prototype is parent

let noProto = Object.create(null);
// Prototype is null (no inheritance)
```

---

## Querying the Prototype

### Object.getPrototypeOf()

Returns the prototype of any object:

```javascript
Object.getPrototypeOf({}); // => Object.prototype
Object.getPrototypeOf([]); // => Array.prototype
Object.getPrototypeOf(() => {}); // => Function.prototype

let p = { x: 1 };
let o = Object.create(p);
Object.getPrototypeOf(o); // => p
```

### Reflect.getPrototypeOf()

Similar function available in the Reflect API:

```javascript
Reflect.getPrototypeOf({}); // => Object.prototype
```

---

## Testing Prototype Relationships

### isPrototypeOf()

Determines whether one object is the prototype of (or in the prototype chain of) another:

```javascript
let p = { x: 1 };
let o = Object.create(p);

p.isPrototypeOf(o); // true: o inherits from p
Object.prototype.isPrototypeOf(p); // true: p inherits from Object.prototype
Object.prototype.isPrototypeOf(o); // true: o inherits through chain
```

**Similar to `instanceof` operator**, but checks prototype chain directly rather than constructor:

```javascript
let arr = [];
Array.prototype.isPrototypeOf(arr); // true
arr instanceof Array; // true
```

---

## Changing the Prototype

### Object.setPrototypeOf()

**Can** change an object's prototype, but **shouldn't** be used in most cases:

```javascript
let o = { x: 1 };
let p = { y: 2 };

Object.setPrototypeOf(o, p); // Change o's prototype to p
console.log(o.y); // 2 (now inherits y from p)
```

### Example: Breaking Built-in Functionality

```javascript
let a = [1, 2, 3];
let p = { y: 2 };

Object.setPrototypeOf(a, p); // Change array's prototype
console.log(a.join); // undefined (no longer has join() method!)
```

### ⚠️ Warning: Performance Issues

**Generally no need to use `Object.setPrototypeOf()`**:

- JavaScript engines optimize based on fixed prototypes
- Changing prototypes causes severe performance degradation
- Code using altered objects may run **much slower**
- Use `Object.create()` with the correct prototype from the start instead

### Reflect.setPrototypeOf()

Similar function in the Reflect API:

```javascript
Reflect.setPrototypeOf(o, p);
```

---

## The **proto** Property

### Historical Context

An **early browser implementation** that exposed the prototype attribute directly. Now **deprecated** but still supported for compatibility.

### Modern Support

- **Mandated** by ECMAScript for web browsers
- **Supported** in Node.js (though not required by standard)
- Readable and writable in modern JavaScript
- **Should not be used** in favor of `Object.getPrototypeOf()` and `Object.setPrototypeOf()`

### Reading and Writing

```javascript
let obj = {};
console.log(obj.__proto__); // Object.prototype (reading)

let p = { x: 1 };
obj.__proto__ = p; // Setting (don't do this!)
console.log(obj.x); // 1
```

### Interesting Use Case: Object Literals

One useful application is defining prototypes in object literals:

```javascript
let p = { z: 3 };

let o = {
  x: 1,
  y: 2,
  __proto__: p, // Set prototype in literal
};

console.log(o.z); // 3 (inherits from p)
```

**This is the recommended use of `__proto__`** - setting it at object creation time rather than modifying it later.

---

## Complete Examples

### Example 1: Prototype Chain Query

```javascript
let animal = { eats: true };
let rabbit = Object.create(animal);
rabbit.jumps = true;

// Query prototypes
console.log(Object.getPrototypeOf(rabbit) === animal); // true
console.log(Object.getPrototypeOf(animal) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null

// Test prototype relationships
console.log(animal.isPrototypeOf(rabbit)); // true
console.log(Object.prototype.isPrototypeOf(rabbit)); // true
console.log(Object.prototype.isPrototypeOf(animal)); // true
```

### Example 2: Constructor Prototypes

```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function () {
  return `${this.name} says woof!`;
};

let dog1 = new Dog('Buddy');
let dog2 = new Dog('Max');

// Both dogs share the same prototype
console.log(Object.getPrototypeOf(dog1) === Dog.prototype); // true
console.log(Object.getPrototypeOf(dog2) === Dog.prototype); // true
console.log(Object.getPrototypeOf(dog1) === Object.getPrototypeOf(dog2)); // true

// Test prototype chain
console.log(Dog.prototype.isPrototypeOf(dog1)); // true
console.log(Object.prototype.isPrototypeOf(dog1)); // true
```

### Example 3: Object.create() with Different Prototypes

```javascript
// Prototype with shared methods
let vehicleMethods = {
  drive() {
    return `${this.name} is driving`;
  },
  stop() {
    return `${this.name} stopped`;
  },
};

// Create objects with this prototype
let car = Object.create(vehicleMethods);
car.name = 'Tesla';
car.wheels = 4;

let bike = Object.create(vehicleMethods);
bike.name = 'Harley';
bike.wheels = 2;

console.log(car.drive()); // "Tesla is driving"
console.log(bike.drive()); // "Harley is driving"
console.log(vehicleMethods.isPrototypeOf(car)); // true
console.log(vehicleMethods.isPrototypeOf(bike)); // true
```

### Example 4: Creating Object with No Prototype

```javascript
// Object with no prototype (no inherited properties)
let bareObject = Object.create(null);
bareObject.x = 1;

console.log(Object.getPrototypeOf(bareObject)); // null
console.log(bareObject.toString); // undefined
console.log(bareObject.hasOwnProperty); // undefined

// Cannot use methods from Object.prototype
try {
  bareObject.toString();
} catch (e) {
  console.log('Error:', e.message); // Not a function
}
```

---

## Prototype Attribute vs Prototype Property

| Aspect         | Prototype Attribute            | Prototype Property             |
| -------------- | ------------------------------ | ------------------------------ |
| **What it is** | Internal link to parent object | Regular object property        |
| **Who has it** | Almost all objects             | Only constructor functions     |
| **Purpose**    | Determines inheritance         | Defines what will be inherited |
| **Access via** | `Object.getPrototypeOf()`      | `Constructor.prototype`        |
| **Example**    | `Object.getPrototypeOf(obj)`   | `Array.prototype`              |

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  // prototype PROPERTY
  console.log(`Hello, ${this.name}`);
};

let person = new Person('Alice');

// person's prototype ATTRIBUTE points to Person.prototype
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

---

## Best Practices

✅ **Use `Object.getPrototypeOf()`** to query prototypes
✅ **Use `Object.create()`** to set prototypes at creation time
✅ **Use `isPrototypeOf()`** to test prototype relationships
❌ **Avoid `Object.setPrototypeOf()`** - causes severe performance issues
❌ **Avoid `__proto__`** except in object literals at creation time
✅ **Set prototypes once** at object creation, don't change them later
✅ **Understand the difference** between prototype attribute and prototype property

---

## Key Concepts Summary

📌 The **prototype attribute** specifies what an object inherits from
📌 Set at **object creation time** and normally remains fixed
📌 Object literals use **`Object.prototype`**
📌 `new` constructor uses **constructor's `prototype` property**
📌 `Object.create()` uses **first argument** as prototype
📌 Query with **`Object.getPrototypeOf()`**
📌 Test relationships with **`isPrototypeOf()`**
📌 **Don't change prototypes** with `Object.setPrototypeOf()` (performance!)
📌 **`__proto__`** is deprecated but still supported
📌 Only use `__proto__` in **object literals** at creation time
📌 Prototype **attribute** ≠ prototype **property**
📌 Changing prototypes causes **severe performance degradation**
