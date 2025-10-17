# JavaScript Object Methods

Object methods are functions that belong to objects and can perform operations on the object's data. JavaScript provides several universal methods inherited from `Object.prototype`, plus you can define custom methods.

---

## Universal Object Methods (Object.prototype)

All JavaScript objects (except those explicitly created without a prototype) inherit these methods from `Object.prototype`.

### 1. toString()

Converts an object to a string representation.

**Purpose**: Automatically called when JavaScript needs to convert an object to a string (string concatenation, String() conversion, etc.)

**Default behavior**:

```javascript
let obj = { x: 1, y: 1 };
obj.toString(); // "[object Object]" - not very useful
```

**Custom implementation**:

```javascript
let point = {
  x: 1,
  y: 2,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
};

String(point); // "(1, 2)"
'Point: ' + point; // "Point: (1, 2)"
console.log(point); // Uses toString()
```

**Built-in customizations**:

```javascript
[1, 2, 3].toString(); // "1,2,3"
(function () {}).toString(); // "function() {}"
new Date().toString(); // "Wed Oct 15 2025 ..."
```

---

### 2. toLocaleString()

Returns a localized string representation of the object.

**Purpose**: Format objects according to local conventions (numbers, dates, currencies)

**Default behavior**: Calls `toString()` (no localization)

**Built-in implementations**:

```javascript
let num = 1234567.89;
num.toLocaleString(); // "1,234,567.89" (US)
num.toLocaleString('de-DE'); // "1.234.567,89" (Germany)

let date = new Date();
date.toLocaleString(); // "10/15/2025, 12:00:00 PM" (US)
date.toLocaleString('fr-FR'); // "15/10/2025 12:00:00" (France)

[1000, 2000].toLocaleString(); // "1,000,2,000"
```

**Custom implementation**:

```javascript
let point = {
  x: 1000,
  y: 2000,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
  toLocaleString: function () {
    return `(${this.x.toLocaleString()}, ${this.y.toLocaleString()})`;
  },
};

point.toString(); // "(1000, 2000)"
point.toLocaleString(); // "(1,000, 2,000)" - with thousands separators
```

---

### 3. valueOf()

Converts an object to a primitive value (typically a number).

**Purpose**: Automatically called when an object is used in a numeric context (arithmetic operations, comparisons)

**Default behavior**: Returns the object itself (not very useful)

**Built-in implementations**:

```javascript
let date = new Date(2025, 0, 1);
date.valueOf(); // 1735689600000 (milliseconds since epoch)

let num = new Number(42);
num.valueOf(); // 42
```

**Custom implementation**:

```javascript
let point = {
  x: 3,
  y: 4,
  valueOf: function () {
    return Math.hypot(this.x, this.y); // Distance from origin
  },
};

Number(point); // 5
point > 4; // true
point > 5; // false
point < 6; // true
point + 10; // 15
```

**Type coercion**:

```javascript
let obj = {
  valueOf: function () {
    return 100;
  },
  toString: function () {
    return '50';
  },
};

obj + 5; // 105 (uses valueOf for arithmetic)
String(obj); // "50" (uses toString for string conversion)
```

---

### 4. toJSON()

Customizes JSON serialization behavior.

**Purpose**: Called by `JSON.stringify()` to determine how the object should be serialized

**Note**: Not defined on `Object.prototype` by default, but `JSON.stringify()` looks for it

**Built-in implementations**:

```javascript
let date = new Date(2025, 0, 1);
date.toJSON(); // "2025-01-01T06:00:00.000Z"
JSON.stringify(date); // '"2025-01-01T06:00:00.000Z"'
```

**Custom implementation**:

```javascript
let point = {
  x: 1,
  y: 2,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
  toJSON: function () {
    return this.toString();
  },
};

JSON.stringify(point); // '"(1, 2)"'
JSON.stringify([point]); // '["(1, 2)"]'
```

**Advanced usage**:

```javascript
let user = {
  name: 'Alice',
  password: 'secret123',
  email: 'alice@example.com',
  toJSON: function () {
    // Exclude sensitive data
    return {
      name: this.name,
      email: this.email,
    };
  },
};

JSON.stringify(user); // '{"name":"Alice","email":"alice@example.com"}'
```

---

## Other Important Object.prototype Methods

### 5. hasOwnProperty()

Checks if a property is an own property (not inherited).

```javascript
let obj = { x: 1 };
let child = Object.create(obj);
child.y = 2;

child.hasOwnProperty('y'); // true (own property)
child.hasOwnProperty('x'); // false (inherited)
'x' in child; // true (checks own + inherited)
```

---

### 6. propertyIsEnumerable()

Checks if a property is enumerable and owned by the object.

```javascript
let obj = { x: 1 };
Object.defineProperty(obj, 'y', {
  value: 2,
  enumerable: false,
});

obj.propertyIsEnumerable('x'); // true
obj.propertyIsEnumerable('y'); // false (non-enumerable)
obj.propertyIsEnumerable('toString'); // false (inherited)
```

---

### 7. isPrototypeOf()

Checks if an object exists in another object's prototype chain.

```javascript
let parent = { x: 1 };
let child = Object.create(parent);

parent.isPrototypeOf(child); // true
Object.prototype.isPrototypeOf(child); // true
```

---

## Static Methods on Object Constructor

These are called on the `Object` constructor itself, not on object instances.

### Object.keys()

Returns an array of own enumerable property names:

```javascript
let obj = { a: 1, b: 2, c: 3 };
Object.keys(obj); // ["a", "b", "c"]
```

### Object.values()

Returns an array of own enumerable property values:

```javascript
Object.values(obj); // [1, 2, 3]
```

### Object.entries()

Returns an array of [key, value] pairs:

```javascript
Object.entries(obj); // [["a", 1], ["b", 2], ["c", 3]]
```

### Object.assign()

Copies properties from source objects to target:

```javascript
let target = { a: 1 };
let source = { b: 2, c: 3 };
Object.assign(target, source); // target is now { a: 1, b: 2, c: 3 }
```

### Object.create()

Creates a new object with specified prototype:

```javascript
let proto = { x: 1 };
let obj = Object.create(proto); // obj inherits from proto
```

### Object.freeze()

Makes an object immutable:

```javascript
let obj = { x: 1 };
Object.freeze(obj);
obj.x = 2; // Fails silently (strict mode: error)
obj.y = 3; // Cannot add properties
```

### Object.seal()

Prevents adding/removing properties, but allows modifications:

```javascript
let obj = { x: 1 };
Object.seal(obj);
obj.x = 2; // OK
obj.y = 3; // Fails
```

### Object.preventExtensions()

Prevents adding new properties:

```javascript
let obj = { x: 1 };
Object.preventExtensions(obj);
obj.x = 2; // OK
obj.y = 3; // Fails
```

### Object.getPrototypeOf()

Returns the prototype of an object:

```javascript
let obj = {};
Object.getPrototypeOf(obj) === Object.prototype; // true
```

### Object.setPrototypeOf()

Sets the prototype of an object (not recommended for performance):

```javascript
let proto = { x: 1 };
let obj = {};
Object.setPrototypeOf(obj, proto);
```

---

## Defining Custom Methods

Methods are simply functions stored as object properties.

### Method Syntax

**Traditional function property**:

```javascript
let calculator = {
  add: function (a, b) {
    return a + b;
  },
};
```

**ES6 shorthand**:

```javascript
let calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
};

calculator.add(5, 3); // 8
```

**Arrow functions** (no `this` binding):

```javascript
let obj = {
  value: 10,
  regular: function () {
    return this.value; // 10
  },
  arrow: () => {
    return this.value; // undefined (no 'this' binding)
  },
};
```

---

## The `this` Keyword in Methods

The `this` keyword refers to the object the method is called on.

```javascript
let person = {
  name: 'Alice',
  age: 30,
  greet: function () {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  },
  haveBirthday: function () {
    this.age++;
  },
};

person.greet(); // "Hello, I'm Alice and I'm 30 years old"
person.haveBirthday();
person.age; // 31
```

**Context loss**:

```javascript
let greet = person.greet;
greet(); // Error or undefined (this is not person)

// Solution: bind
let boundGreet = person.greet.bind(person);
boundGreet(); // Works correctly
```

---

## Method Chaining

Return `this` from methods to enable chaining:

```javascript
let calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // Enable chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
  getResult() {
    return this.value;
  },
};

calculator.add(10).subtract(3).multiply(2).getResult(); // 14
```

---

## Key Concepts Summary

✅ **toString()** - String representation (called for string conversion)
✅ **toLocaleString()** - Localized string representation
✅ **valueOf()** - Primitive value (called for numeric operations)
✅ **toJSON()** - Custom JSON serialization
✅ **hasOwnProperty()** - Check for own (non-inherited) properties
✅ **Methods are functions** stored as object properties
✅ **`this` keyword** refers to the object the method is called on
✅ **Static methods** are called on `Object` constructor
✅ **Instance methods** are called on object instances
✅ **Method chaining** enabled by returning `this`
✅ **ES6 shorthand** syntax for cleaner method definitions
✅ **Arrow functions** don't bind `this` (avoid for methods)
