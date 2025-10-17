# JavaScript Objects

## What Are Objects?

Objects are **composite data structures** that aggregate multiple values (primitives or other objects) into a single entity. An object is an **unordered collection of properties**, where each property has a **name** (key) and a **value**.

**Key characteristics**:

- Map strings/Symbols to values (like hash tables, dictionaries, or associative arrays)
- **Dynamic**: Properties can be added or deleted at runtime
- **Mutable**: Modified by reference, not by value
- Support **prototypal inheritance**: Objects inherit properties from a prototype object

## Creating Objects

### 1. Object Literals (most common)

```javascript
let person = {
  name: 'Alice',
  age: 30,
  greet: function () {
    console.log('Hello!');
  },
};
```

### 2. Constructor Functions

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
let person = new Person('Bob', 25);
```

### 3. Object.create()

```javascript
let proto = { species: 'human' };
let person = Object.create(proto);
person.name = 'Charlie';
```

### 4. ES6 Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
let person = new Person('Dana', 28);
```

### 5. new Object()

```javascript
let person = new Object();
person.name = 'Eve';
```

## Working with Properties

### Accessing Properties

**Dot notation**:

```javascript
person.name; // "Alice"
person.age; // 30
```

**Bracket notation** (for dynamic keys or special characters):

```javascript
person['name']; // "Alice"
let key = 'age';
person[key]; // 30
person['first-name']; // For names with hyphens
```

### Setting Properties

```javascript
person.name = 'Alicia'; // Update existing
person.email = 'alice@email.com'; // Add new property
person['phone'] = '123-456-7890';
```

### Deleting Properties

```javascript
delete person.age; // Removes the property
```

### Testing for Properties

```javascript
'name' in person; // true (checks own + inherited)
person.hasOwnProperty('name'); // true (checks own only)
person.name !== undefined; // true (but fails for undefined values)
```

### Enumerating Properties

**for...in loop** (iterates own + inherited enumerable properties):

```javascript
for (let key in person) {
  console.log(key + ': ' + person[key]);
}
```

**Object.keys()** (own enumerable properties only):

```javascript
Object.keys(person); // ["name", "age", "greet"]
```

**Object.values()** (own enumerable values):

```javascript
Object.values(person); // ["Alice", 30, function...]
```

**Object.entries()** (own enumerable key-value pairs):

```javascript
Object.entries(person); // [["name", "Alice"], ["age", 30], ...]
```

**Object.getOwnPropertyNames()** (all own properties, including non-enumerable):

```javascript
Object.getOwnPropertyNames(person);
```

## Property Attributes

Each property has three attributes that control its behavior:

| Attribute        | Description                                | Default |
| ---------------- | ------------------------------------------ | ------- |
| **writable**     | Can the value be changed?                  | `true`  |
| **enumerable**   | Appears in `for...in` loops?               | `true`  |
| **configurable** | Can be deleted or have attributes changed? | `true`  |

### Defining Properties with Attributes

```javascript
Object.defineProperty(person, 'id', {
  value: 12345,
  writable: false, // Read-only
  enumerable: false, // Hidden from for...in
  configurable: false, // Cannot be deleted
});
```

### Defining Multiple Properties

```javascript
Object.defineProperties(person, {
  firstName: { value: 'Alice', writable: true },
  lastName: { value: 'Smith', writable: true },
});
```

### Getting Property Descriptors

```javascript
Object.getOwnPropertyDescriptor(person, 'name');
// { value: "Alice", writable: true, enumerable: true, configurable: true }
```

## Prototypal Inheritance

Every object has a **prototype** (another object) from which it inherits properties.

```javascript
let animal = { eats: true };
let rabbit = Object.create(animal); // rabbit inherits from animal
rabbit.jumps = true;

console.log(rabbit.eats); // true (inherited)
console.log(rabbit.jumps); // true (own property)
```

**Prototype chain**:

```javascript
rabbit.__proto__ === animal; // true
Object.getPrototypeOf(rabbit) === animal; // true (preferred method)
```

**Own vs. Inherited Properties**:

- **Own property**: Defined directly on the object
- **Inherited property**: Comes from the prototype chain

```javascript
rabbit.hasOwnProperty('jumps'); // true
rabbit.hasOwnProperty('eats'); // false (inherited)
```

## Object Mutability and Reference

Objects are **mutable** and passed **by reference**:

```javascript
let x = { value: 10 };
let y = x; // y references the same object
y.value = 20;
console.log(x.value); // 20 (both x and y point to same object)
```

**Copying objects**:

```javascript
// Shallow copy
let copy = Object.assign({}, original);
let copy2 = { ...original }; // ES6 spread operator

// Deep copy (for nested objects)
let deepCopy = JSON.parse(JSON.stringify(original));
```

## Getters and Setters

Properties can have **getter** and **setter** functions instead of simple values:

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
};

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
```

## Object Methods

### Common Built-in Methods

**Object.keys/values/entries**:

```javascript
Object.keys(obj); // Array of property names
Object.values(obj); // Array of property values
Object.entries(obj); // Array of [key, value] pairs
```

**Object.assign()** (merge objects):

```javascript
let target = { a: 1 };
let source = { b: 2, c: 3 };
Object.assign(target, source); // target is now { a: 1, b: 2, c: 3 }
```

**Object.freeze()** (make immutable):

```javascript
Object.freeze(person); // Cannot add, delete, or modify properties
```

**Object.seal()** (prevent adding/deleting, but allow modifications):

```javascript
Object.seal(person); // Can modify existing properties only
```

**Object.preventExtensions()** (prevent adding new properties):

```javascript
Object.preventExtensions(person); // Can modify and delete existing properties
```

## Special Object Types

### Arrays

Arrays are special objects with numeric indices and a `length` property:

```javascript
let arr = [1, 2, 3];
typeof arr; // "object"
```

### Functions

Functions are callable objects:

```javascript
function greet() {}
typeof greet; // "function"
greet.customProp = 'value'; // Functions can have properties
```

### Dates, RegExp, Error

Built-in object types for specific purposes:

```javascript
let date = new Date();
let regex = /pattern/;
let error = new Error('message');
```

## Primitive Wrapper Objects

Although strings, numbers, and booleans are primitives, they **behave like objects** because JavaScript temporarily wraps them:

```javascript
let str = 'hello';
str.length; // 5 (String object behavior)
str.toUpperCase(); // "HELLO"

// JavaScript does this behind the scenes:
// let temp = new String("hello");
// temp.toUpperCase();
```

## Object vs. Non-Object Values

**Objects**: Everything except primitives

- Arrays, Functions, Dates, RegExp, custom objects

**Non-objects (primitives)**:

- `string`, `number`, `boolean`, `Symbol`, `null`, `undefined`, `BigInt`

## Key Concepts Summary

✅ Objects are **collections of properties** (key-value pairs)
✅ Properties can be **added, modified, or deleted** dynamically
✅ Objects are **mutable** and passed **by reference**
✅ Objects support **prototypal inheritance**
✅ Property names are usually **strings** or **Symbols**
✅ Each property has **attributes** (writable, enumerable, configurable)
✅ **Own properties** are distinct from **inherited properties**
✅ Objects can have **getter/setter** functions
✅ Built-in methods like `Object.keys()`, `Object.assign()`, and `Object.freeze()` provide powerful utilities
