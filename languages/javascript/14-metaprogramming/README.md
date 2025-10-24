# JavaScript Metaprogramming

## What is Metaprogramming?

**Metaprogramming** is writing code that manipulates other code or controls how code behaves. While regular programming manipulates data, metaprogramming manipulates the structure, behavior, and characteristics of objects, functions, and classes.

In JavaScript, the line between programming and metaprogramming is blurry due to its dynamic nature. Even simple operations like iterating over object properties with `for...in` can be considered metaprogramming.

---

## 1. Property Attributes and Descriptors

### Understanding Property Attributes

Every object property has **three attributes** that control its behavior:

| Attribute        | Description                                      | Default |
| ---------------- | ------------------------------------------------ | ------- |
| **writable**     | Can the value be changed?                        | `true`  |
| **enumerable**   | Appears in `for...in` loops and `Object.keys()`? | `true`  |
| **configurable** | Can be deleted or have attributes changed?       | `true`  |

### Getting Property Descriptors

```javascript
let obj = { x: 1 };

let descriptor = Object.getOwnPropertyDescriptor(obj, 'x');
console.log(descriptor);
// {
//   value: 1,
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

### Defining Properties with Custom Attributes

**Single property**:

```javascript
let obj = {};

Object.defineProperty(obj, 'x', {
  value: 42,
  writable: false, // Read-only
  enumerable: true,
  configurable: false, // Cannot be deleted
});

obj.x = 100; // Fails silently (strict mode: TypeError)
console.log(obj.x); // 42
delete obj.x; // Fails silently
```

**Multiple properties**:

```javascript
Object.defineProperties(obj, {
  y: { value: 10, writable: true, enumerable: true },
  z: { value: 20, writable: false, enumerable: false },
});
```

### Accessor Properties (Getters/Setters)

Properties can have **get** and **set** functions instead of a value:

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',
};

Object.defineProperty(person, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
  enumerable: true,
  configurable: true,
});

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
```

---

## 2. Object Extensibility

Control whether new properties can be added to objects.

### Object.preventExtensions()

Prevents adding new properties (can still modify/delete existing):

```javascript
let obj = { x: 1 };
Object.preventExtensions(obj);

obj.y = 2; // Fails silently (strict: TypeError)
obj.x = 10; // Works (can modify existing)
delete obj.x; // Works (can delete existing)

console.log(Object.isExtensible(obj)); // false
```

### Object.seal()

Prevents adding/deleting properties, but allows modification:

```javascript
let obj = { x: 1 };
Object.seal(obj);

obj.y = 2; // Fails (cannot add)
obj.x = 10; // Works (can modify)
delete obj.x; // Fails (cannot delete)

console.log(Object.isSealed(obj)); // true
```

**Effect on attributes**:

- Sets `configurable: false` on all properties
- Properties remain writable

### Object.freeze()

Makes object completely immutable:

```javascript
let obj = { x: 1, nested: { y: 2 } };
Object.freeze(obj);

obj.x = 10; // Fails (cannot modify)
obj.y = 2; // Fails (cannot add)
delete obj.x; // Fails (cannot delete)

obj.nested.y = 20; // Works! (shallow freeze only)

console.log(Object.isFrozen(obj)); // true
```

**Note**: `Object.freeze()` is **shallow**. To deep freeze:

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);

  for (let key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}
```

### Comparison

| Method                | Add Props | Modify Props | Delete Props | Change Attributes |
| --------------------- | --------- | ------------ | ------------ | ----------------- |
| **preventExtensions** | ❌        | ✅           | ✅           | ✅                |
| **seal**              | ❌        | ✅           | ❌           | ❌                |
| **freeze**            | ❌        | ❌           | ❌           | ❌                |

---

## 3. Prototype Manipulation

### Getting Prototypes

```javascript
let obj = {};
let proto = Object.getPrototypeOf(obj);
console.log(proto === Object.prototype); // true

// For arrays
let arr = [];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
```

### Setting Prototypes

**Object.setPrototypeOf()** (use sparingly - performance impact):

```javascript
let animal = {
  eats: true,
  walk() {
    console.log('Animal walks');
  },
};

let rabbit = { jumps: true };
Object.setPrototypeOf(rabbit, animal);

console.log(rabbit.eats); // true (inherited)
rabbit.walk(); // "Animal walks"
```

**Better: Use Object.create() at creation time**:

```javascript
let rabbit = Object.create(animal);
rabbit.jumps = true;
```

### Creating Objects with null Prototype

```javascript
let obj = Object.create(null);
// No inherited properties at all
console.log(obj.toString); // undefined
```

**Use case**: Truly clean dictionaries/maps without inherited properties.

---

## 4. Well-Known Symbols

Symbols allow you to customize object behavior by implementing special methods.

### Symbol.iterator

Makes objects iterable with `for...of`:

```javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    let last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### Symbol.toStringTag

Customizes `Object.prototype.toString()` output:

```javascript
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyCustomClass';
  }
}

let obj = new MyClass();
console.log(Object.prototype.toString.call(obj)); // "[object MyCustomClass]"
```

### Symbol.toPrimitive

Controls type conversion:

```javascript
let user = {
  name: 'John',
  money: 1000,

  [Symbol.toPrimitive](hint) {
    console.log(`hint: ${hint}`);
    return hint === 'string' ? this.name : this.money;
  },
};

console.log(String(user)); // "John" (hint: "string")
console.log(Number(user)); // 1000 (hint: "number")
console.log(user + 500); // 1500 (hint: "default")
```

### Other Well-Known Symbols

- **Symbol.hasInstance**: Customize `instanceof` behavior
- **Symbol.species**: Control constructor used for derived objects
- **Symbol.isConcatSpreadable**: Control array concatenation behavior
- **Symbol.match/replace/search/split**: Customize string method behavior

---

## 5. Template Tag Functions (Tagged Templates)

Create Domain-Specific Languages (DSLs) by processing template literals.

### Basic Syntax

```javascript
function tag(strings, ...values) {
  console.log(strings); // Array of string parts
  console.log(values); // Array of interpolated values

  return 'processed result';
}

let name = 'World';
let result = tag`Hello ${name}!`;
// strings: ['Hello ', '!']
// values: ['World']
```

### Practical Example: HTML Escaping

```javascript
function html(strings, ...values) {
  function escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += escape(values[i]) + strings[i + 1];
  }

  return result;
}

let userInput = '<script>alert("XSS")</script>';
let safe = html`<div>${userInput}</div>`;
console.log(safe); // <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>
```

### SQL Query Builder

```javascript
function sql(strings, ...values) {
  return {
    text: strings.join('?'),
    values: values,
  };
}

let userId = 123;
let query = sql`SELECT * FROM users WHERE id = ${userId}`;
console.log(query);
// { text: 'SELECT * FROM users WHERE id = ?', values: [123] }
```

---

## 6. Reflect API

The Reflect API provides methods for interceptable JavaScript operations.

### Why Reflect?

- More reliable than equivalent operations
- Returns boolean success values instead of throwing errors
- Matches Proxy trap signatures exactly

### Common Reflect Methods

```javascript
let obj = { x: 1, y: 2 };

// Get property
Reflect.get(obj, 'x'); // 1

// Set property
Reflect.set(obj, 'z', 3); // true (success)

// Has property
Reflect.has(obj, 'x'); // true

// Delete property
Reflect.deleteProperty(obj, 'y'); // true

// Get own property descriptor
Reflect.getOwnPropertyDescriptor(obj, 'x');

// Get prototype
Reflect.getPrototypeOf(obj);

// Set prototype
Reflect.setPrototypeOf(obj, proto);

// Get property keys
Reflect.ownKeys(obj); // ['x', 'z']

// Prevent extensions
Reflect.preventExtensions(obj); // true

// Is extensible?
Reflect.isExtensible(obj); // false

// Define property
Reflect.defineProperty(obj, 'a', { value: 10 });

// Function calls
Reflect.apply(Math.max, null, [1, 2, 3]); // 3

// Constructor calls
Reflect.construct(Array, [1, 2, 3]); // [1, 2, 3]
```

### Reflect vs Direct Operations

```javascript
// Traditional
delete obj.x; // Returns true/false, or throws
obj.x = 1; // Throws in strict mode if fails

// Reflect (more predictable)
Reflect.deleteProperty(obj, 'x'); // Always returns boolean
Reflect.set(obj, 'x', 1); // Always returns boolean
```

---

## 7. Proxy Objects

Proxies intercept and customize fundamental operations on objects.

### **Basic Syntax**

```javascript
let proxy = new Proxy(target, handler);
```

- **target**: Original object to wrap
- **handler**: Object with trap methods

### Common Traps

#### Get Trap

Intercept property access:

```javascript
let target = { x: 1, y: 2 };

let proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Getting ${property}`);
    return Reflect.get(target, property, receiver);
  },
});

console.log(proxy.x); // "Getting x" → 1
```

#### Set Trap

Validate property assignments:

```javascript
let validator = {
  set(target, property, value, receiver) {
    if (property === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }

    if (property === 'age' && value < 0) {
      throw new RangeError('Age must be positive');
    }

    return Reflect.set(target, property, value, receiver);
  },
};

let person = new Proxy({}, validator);
person.age = 30; // Works
person.age = -5; // RangeError
person.age = 'young'; // TypeError
```

#### Has Trap

Intercept `in` operator:

```javascript
let hiddenProps = {
  has(target, property) {
    if (property.startsWith('_')) {
      return false; // Hide private properties
    }
    return Reflect.has(target, property);
  },
};

let obj = new Proxy({ x: 1, _secret: 2 }, hiddenProps);
console.log('x' in obj); // true
console.log('_secret' in obj); // false
```

#### DeleteProperty Trap

Prevent property deletion:

```javascript
let protector = {
  deleteProperty(target, property) {
    if (property.startsWith('_')) {
      throw new Error('Cannot delete private properties');
    }
    return Reflect.deleteProperty(target, property);
  },
};

let obj = new Proxy({ x: 1, _private: 2 }, protector);
delete obj.x; // Works
delete obj._private; // Error
```

### All Available Traps

| Trap                         | Intercepts                          |
| ---------------------------- | ----------------------------------- |
| **get**                      | Property access                     |
| **set**                      | Property assignment                 |
| **has**                      | `in` operator                       |
| **deleteProperty**           | `delete` operator                   |
| **ownKeys**                  | `Object.keys()`, `for...in`         |
| **getOwnPropertyDescriptor** | `Object.getOwnPropertyDescriptor()` |
| **defineProperty**           | `Object.defineProperty()`           |
| **preventExtensions**        | `Object.preventExtensions()`        |
| **getPrototypeOf**           | `Object.getPrototypeOf()`           |
| **setPrototypeOf**           | `Object.setPrototypeOf()`           |
| **isExtensible**             | `Object.isExtensible()`             |
| **apply**                    | Function calls                      |
| **construct**                | `new` operator                      |

### Practical Example: Observable Object

```javascript
function observable(target, callback) {
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let oldValue = target[property];
      let result = Reflect.set(target, property, value, receiver);

      if (result && oldValue !== value) {
        callback(property, oldValue, value);
      }

      return result;
    },
  });
}

let person = observable({ name: 'John', age: 30 }, (prop, oldVal, newVal) => {
  console.log(`${prop} changed from ${oldVal} to ${newVal}`);
});

person.age = 31; // "age changed from 30 to 31"
person.name = 'Jane'; // "name changed from John to Jane"
```

### Revocable Proxies

Create proxies that can be disabled:

```javascript
let { proxy, revoke } = Proxy.revocable(
  {},
  {
    get(target, property) {
      return Reflect.get(target, property);
    },
  }
);

proxy.x = 1;
console.log(proxy.x); // 1

revoke(); // Disable proxy
console.log(proxy.x); // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

---

## 8. Practical Metaprogramming Patterns

### 1. Negative Array Indices

```javascript
function createArray(arr) {
  return new Proxy(arr, {
    get(target, property) {
      let index = Number(property);
      if (index < 0) {
        property = String(target.length + index);
      }
      return Reflect.get(target, property);
    },
  });
}

let arr = createArray([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4
```

### 2. Property Access Logger

```javascript
function logged(target) {
  return new Proxy(target, {
    get(target, property, receiver) {
      console.log(`[GET] ${property}`);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      console.log(`[SET] ${property} = ${value}`);
      return Reflect.set(target, property, value, receiver);
    },
  });
}

let obj = logged({ x: 1 });
obj.x; // [GET] x
obj.x = 10; // [SET] x = 10
```

### 3. Enum-like Objects

```javascript
function createEnum(...values) {
  let enumObj = {};

  for (let val of values) {
    enumObj[val] = val;
  }

  return new Proxy(enumObj, {
    set() {
      throw new Error('Enums are read-only');
    },
    deleteProperty() {
      throw new Error('Cannot delete enum values');
    },
  });
}

let Colors = createEnum('RED', 'GREEN', 'BLUE');
console.log(Colors.RED); // "RED"
Colors.RED = 'YELLOW'; // Error
delete Colors.GREEN; // Error
```

### 4. Lazy Property Initialization

```javascript
function lazy(target, property, initializer) {
  let value;
  let initialized = false;

  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === property && !initialized) {
        value = initializer();
        initialized = true;
      }

      return prop === property ? value : Reflect.get(target, prop, receiver);
    },
  });
}

let obj = lazy({}, 'data', () => {
  console.log('Initializing expensive data...');
  return [1, 2, 3, 4, 5];
});

console.log(obj.data); // "Initializing..." → [1, 2, 3, 4, 5]
console.log(obj.data); // [1, 2, 3, 4, 5] (no initialization)
```

---

## Key Concepts Summary

✅ **Property attributes** control writable, enumerable, and configurable characteristics
✅ **Object extensibility** methods: `preventExtensions()`, `seal()`, `freeze()`
✅ **Prototype manipulation** with `Object.getPrototypeOf()` and `Object.setPrototypeOf()`
✅ **Well-known Symbols** customize built-in behavior (iterator, toString, toPrimitive)
✅ **Tagged templates** create DSLs for HTML escaping, SQL queries, etc.
✅ **Reflect API** provides reliable, predictable operations matching Proxy traps
✅ **Proxy objects** intercept fundamental operations for validation, logging, etc.
✅ **13 Proxy traps** cover property access, function calls, and more
✅ **Metaprogramming patterns** enable negative indices, observables, enums, lazy loading
✅ Use metaprogramming for **libraries, frameworks, and advanced object behavior**
