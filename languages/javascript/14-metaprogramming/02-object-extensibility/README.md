# JavaScript Object Extensibility

Object extensibility controls whether new properties can be added to an object. JavaScript provides three levels of protection, each progressively more restrictive.

---

## Understanding Extensibility

By default, all ordinary JavaScript objects are **extensible** - new properties can be freely added.

```javascript
let obj = { x: 1 };
obj.y = 2; // Works - object is extensible
console.log(obj); // { x: 1, y: 2 }
```

---

## Checking Extensibility

### Object.isExtensible()

Determines if an object can have new properties added:

```javascript
let obj = { x: 1 };
console.log(Object.isExtensible(obj)); // true

Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false
```

---

## Three Levels of Protection

JavaScript provides three methods to restrict objects, each more restrictive than the last:

| Method                | Prevents Adding | Prevents Deleting | Prevents Configuring | Makes Read-Only |
| --------------------- | --------------- | ----------------- | -------------------- | --------------- |
| `preventExtensions()` | ✅              | ❌                | ❌                   | ❌              |
| `seal()`              | ✅              | ✅                | ✅                   | ❌              |
| `freeze()`            | ✅              | ✅                | ✅                   | ✅              |

---

## 1. Object.preventExtensions()

**Prevents adding new properties** while allowing modification and deletion of existing properties.

### Basic Usage

```javascript
let obj = { x: 1 };

Object.preventExtensions(obj);

// Cannot add new properties
obj.y = 2; // Fails silently (non-strict) or throws TypeError (strict)
console.log(obj.y); // undefined

// Can still modify existing properties
obj.x = 10;
console.log(obj.x); // 10

// Can still delete existing properties
delete obj.x;
console.log(obj.x); // undefined
```

### Strict Mode Behavior

```javascript
'use strict';
let obj = { x: 1 };
Object.preventExtensions(obj);

obj.y = 2; // TypeError: Cannot add property y, object is not extensible
```

### Prototype Changes

Attempting to change the prototype of a non-extensible object **always throws TypeError**:

```javascript
let obj = { x: 1 };
Object.preventExtensions(obj);

Object.setPrototypeOf(obj, { y: 2 }); // TypeError
```

### Important Notes

- **Irreversible**: Cannot make an object extensible again
- **Only affects the object itself**: Prototype can still have properties added
- **Returns the object**: Can be chained with other operations

```javascript
let obj = { x: 1 };
let proto = { z: 3 };
Object.setPrototypeOf(obj, proto);

Object.preventExtensions(obj);

// Cannot add to obj
obj.y = 2; // Fails

// But prototype can still receive properties
proto.w = 4;
console.log(obj.w); // 4 (inherited from prototype)
```

---

## 2. Object.seal()

**Prevents adding/deleting properties AND makes all properties non-configurable**. Existing writable properties can still be modified.

### What It Does

1. Calls `Object.preventExtensions()` internally
2. Makes all own properties **non-configurable**
3. Properties cannot be deleted
4. Property attributes cannot be changed
5. Writable properties can still be modified

### **Basic Usage**

```javascript
let obj = { x: 1, y: 2 };

Object.seal(obj);

// Cannot add new properties
obj.z = 3; // Fails
console.log(obj.z); // undefined

// Cannot delete properties
delete obj.x; // Fails (strict mode: TypeError)
console.log(obj.x); // 1 (still exists)

// CAN modify existing writable properties
obj.x = 10;
console.log(obj.x); // 10

// Cannot reconfigure properties
Object.defineProperty(obj, 'x', { enumerable: false }); // TypeError
```

### Checking if Sealed

```javascript
let obj = { x: 1 };
console.log(Object.isSealed(obj)); // false

Object.seal(obj);
console.log(Object.isSealed(obj)); // true
console.log(Object.isExtensible(obj)); // false (sealed objects are also non-extensible)
```

### Property Attributes After Sealing

```javascript
let obj = { x: 1 };
Object.seal(obj);

let descriptor = Object.getOwnPropertyDescriptor(obj, 'x');
console.log(descriptor);
// {
//   value: 1,
//   writable: true,        // Still writable!
//   enumerable: true,
//   configurable: false    // Now non-configurable
// }
```

---

## 3. Object.freeze()

**The strictest level**: Prevents adding/deleting properties, makes properties non-configurable, AND makes all data properties read-only.

### **What It Does**

1. Calls `Object.seal()` internally (which calls `preventExtensions()`)
2. Makes all data properties **read-only** (writable: false)
3. Completely immutable for data properties
4. Accessor properties (getters/setters) are NOT affected

### Basic Usage

```javascript
let obj = { x: 1, y: 2 };

Object.freeze(obj);

// Cannot add properties
obj.z = 3; // Fails
console.log(obj.z); // undefined

// Cannot delete properties
delete obj.x; // Fails
console.log(obj.x); // 1

// Cannot modify properties
obj.x = 10; // Fails (strict mode: TypeError)
console.log(obj.x); // 1 (unchanged)

// Cannot reconfigure
Object.defineProperty(obj, 'x', { value: 5 }); // TypeError
```

### Checking if Frozen

```javascript
let obj = { x: 1 };
console.log(Object.isFrozen(obj)); // false

Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true
console.log(Object.isSealed(obj)); // true
console.log(Object.isExtensible(obj)); // false
```

### Accessor Properties Exception

Accessor properties with setters **are NOT affected** and can still be invoked:

```javascript
let obj = {
  _value: 1,
  get value() {
    return this._value;
  },
  set value(v) {
    this._value = v;
  },
};

Object.freeze(obj);

// Setter still works!
obj.value = 10;
console.log(obj.value); // 10

// But the data property is frozen
obj._value = 20; // Fails
console.log(obj._value); // 10 (unchanged)
```

---

## Shallow vs Deep Freezing

All three methods (`preventExtensions`, `seal`, `freeze`) only affect the **object itself**, not nested objects.

### Shallow Freeze

```javascript
let obj = {
  x: 1,
  nested: { y: 2 },
};

Object.freeze(obj);

obj.x = 10; // Fails - obj is frozen
obj.nested.y = 20; // Works! - nested object is NOT frozen
console.log(obj.nested.y); // 20
```

### Deep Freeze Implementation

To completely freeze an object hierarchy:

```javascript
function deepFreeze(obj) {
  // Freeze the object itself
  Object.freeze(obj);

  // Recursively freeze all properties
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });

  return obj;
}

let obj = {
  x: 1,
  nested: { y: 2 },
};

deepFreeze(obj);

obj.nested.y = 20; // Fails - nested object is also frozen
console.log(obj.nested.y); // 2
```

---

## Prototype Chain Considerations

These methods **do NOT affect the prototype chain**. To fully lock down an object, you must also seal/freeze the prototype.

```javascript
let proto = { z: 3 };
let obj = Object.create(proto);
obj.x = 1;

Object.freeze(obj);

// obj is frozen
obj.x = 10; // Fails
console.log(obj.x); // 1

// But prototype is NOT frozen
proto.z = 30; // Works
console.log(obj.z); // 30 (inherited)
```

### Freezing Prototype Chain

```javascript
// Freeze both object and prototype
let proto = Object.freeze({ z: 3 });
let obj = Object.freeze(
  Object.create(proto, {
    x: { value: 1, writable: true },
  })
);

obj.x = 10; // Fails
proto.z = 30; // Fails
```

---

## Chaining and Nested Invocations

All three methods **return the object passed to them**, enabling method chaining:

```javascript
// Create a sealed object with frozen prototype
let o = Object.seal(
  Object.create(Object.freeze({ x: 1 }), {
    y: {
      value: 2,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  })
);

console.log(Object.isSealed(o)); // true
console.log(Object.isFrozen(Object.getPrototypeOf(o))); // true
```

---

## Use Cases

### 1. Library Functions - Preventing User Modifications

```javascript
function processData(data) {
  // Freeze to prevent modifications
  Object.freeze(data);

  // Pass to user callback
  userCallback(data);

  // Data is guaranteed unchanged
}
```

### 2. Configuration Objects

```javascript
const CONFIG = Object.freeze({
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  MAX_RETRIES: 3,
});

// Guaranteed immutable
CONFIG.API_URL = 'hacked'; // Fails
console.log(CONFIG.API_URL); // Original value preserved
```

### 3. Constants with Objects

```javascript
const COLORS = Object.freeze({
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
});
```

### 4. Protecting Critical Objects

```javascript
class User {
  constructor(id, role) {
    this.id = id;
    this.role = role;

    // Prevent modifications after creation
    Object.seal(this);
  }
}

let user = new User(1, 'admin');
user.id = 999; // Works (writable)
user.hacked = true; // Fails (sealed)
delete user.role; // Fails (sealed)
```

---

## Trade-offs and Considerations

### Advantages

✅ **Security**: Prevents accidental or malicious modifications
✅ **Predictability**: Objects maintain their structure
✅ **Debugging**: Easier to track state changes
✅ **Performance**: V8 and other engines can optimize frozen objects

### Disadvantages

❌ **Testing**: Can interfere with mocking and stubbing strategies
❌ **Flexibility**: No way to reverse the operation
❌ **Shallow**: Nested objects require additional work
❌ **Debugging**: Failures in non-strict mode are silent

### Testing Challenges

```javascript
// Mocking becomes difficult
let api = Object.freeze({
  fetchData: () => realApiCall(),
});

// Cannot stub in tests
api.fetchData = () => mockData(); // Fails!

// Solution: Don't freeze objects that need mocking
```

---

## Reflect API Alternatives

ES6 introduced `Reflect` methods as alternatives:

```javascript
// Reflect.isExtensible() - same as Object.isExtensible()
console.log(Reflect.isExtensible(obj));

// Reflect.preventExtensions() - same as Object.preventExtensions()
Reflect.preventExtensions(obj);
```

**Difference**: `Reflect` methods return boolean success/failure instead of the object.

---

## Quick Reference Table

| Method                | Check Method     | Prevents New Props | Prevents Delete | Prevents Reconfig | Makes Read-Only | Reversible |
| --------------------- | ---------------- | ------------------ | --------------- | ----------------- | --------------- | ---------- |
| `preventExtensions()` | `isExtensible()` | ✅                 | ❌              | ❌                | ❌              | ❌         |
| `seal()`              | `isSealed()`     | ✅                 | ✅              | ✅                | ❌              | ❌         |
| `freeze()`            | `isFrozen()`     | ✅                 | ✅              | ✅                | ✅              | ❌         |

---

## Key Concepts Summary

📌 **Three levels**: preventExtensions → seal → freeze (increasingly restrictive)
📌 **Irreversible**: Cannot undo any of these operations
📌 **Shallow only**: Nested objects must be handled separately
📌 **Prototype independent**: Must explicitly handle prototype chain
📌 **Accessor exception**: Setters still work even when frozen
📌 **Returns object**: Enables method chaining
📌 **Strict mode**: Throws errors; non-strict fails silently
📌 **Use case**: Library APIs, configuration objects, constants
📌 **Trade-off**: Security vs flexibility and testing complexity
