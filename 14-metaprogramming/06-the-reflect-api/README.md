# JavaScript Reflect API

## Overview

The **Reflect API** is a built-in object (like `Math`) that provides a collection of static methods for interceptable JavaScript operations. Introduced in **ES6**, it groups core language features into a single, convenient namespace.

### Key Characteristics

- **Not a constructor**: Cannot use `new Reflect()`
- **Static methods only**: All functions are called directly on `Reflect`
- **Mirrors core syntax**: Functions replicate language operations (property access, deletion, etc.)
- **One-to-one with Proxy handlers**: Each Reflect method corresponds to a Proxy trap
- **No new functionality**: Provides consistent API for existing features

---

## Why Use Reflect?

✅ **Cleaner syntax** for metaprogramming operations
✅ **Consistent return values** (boolean success/failure instead of exceptions)
✅ **Better error handling** (predictable behavior)
✅ **Works seamlessly with Proxies** (default implementations for traps)
✅ **Functional approach** to operations like `delete`, `in`, etc.

---

## Complete API Reference

### 1. Reflect.apply(f, o, args)

Calls a function with a specified `this` value and arguments array.

**Equivalent to**: `f.apply(o, args)` or `Function.prototype.apply.call(f, o, args)`

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

let person = { name: 'Alice' };

// Traditional approach
let result1 = greet.apply(person, ['Hello', '!']);

// Reflect approach
let result2 = Reflect.apply(greet, person, ['Hello', '!']);

console.log(result1); // "Hello, Alice!"
console.log(result2); // "Hello, Alice!"
```

**Parameters**:

- `f`: Function to call
- `o`: Value to use as `this` (or `null` for no `this`)
- `args`: Array of arguments

---

### 2. Reflect.construct(c, args, newTarget)

Invokes a constructor as if using the `new` keyword.

**Equivalent to**: `new c(...args)`

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

// Traditional approach
let p1 = new Person('Bob', 30);

// Reflect approach
let p2 = Reflect.construct(Person, ['Charlie', 25]);

console.log(p1); // Person { name: 'Bob', age: 30 }
console.log(p2); // Person { name: 'Charlie', age: 25 }
```

**With newTarget parameter**:

```javascript
class Animal {}
class Dog extends Animal {}

let obj = Reflect.construct(Animal, [], Dog);
console.log(obj instanceof Dog); // true
console.log(obj instanceof Animal); // true
```

**Parameters**:

- `c`: Constructor function
- `args`: Array of arguments
- `newTarget` (optional): Value for `new.target`

---

### 3. Reflect.defineProperty(o, name, descriptor)

Defines a new property or modifies an existing one on an object.

**Similar to**: `Object.defineProperty()`
**Key difference**: Returns `true`/`false` instead of the object or throwing errors

```javascript
let obj = {};

// Reflect approach
let success = Reflect.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: false,
  enumerable: true,
  configurable: true,
});

console.log(success); // true
console.log(obj.name); // "Alice"

// Try to redefine non-configurable property
Reflect.defineProperty(obj, 'name', { configurable: false });
let failed = Reflect.defineProperty(obj, 'name', { value: 'Bob' });
console.log(failed); // false (instead of throwing error)
```

**Parameters**:

- `o`: Target object
- `name`: Property name (string or Symbol)
- `descriptor`: Property descriptor object

**Returns**: `true` on success, `false` on failure

---

### 4. Reflect.deleteProperty(o, name)

Deletes a property from an object.

**Equivalent to**: `delete o[name]`

```javascript
let obj = { a: 1, b: 2, c: 3 };

// Traditional approach
delete obj.a;

// Reflect approach
let success = Reflect.deleteProperty(obj, 'b');

console.log(success); // true
console.log(obj); // { c: 3 }

// Try to delete non-existent property
console.log(Reflect.deleteProperty(obj, 'nonExistent')); // true
```

**Parameters**:

- `o`: Target object
- `name`: Property name (string or Symbol)

**Returns**: `true` if deletion succeeded or property didn't exist, `false` if property couldn't be deleted

---

### 5. Reflect.get(o, name, receiver)

Gets the value of a property.

**Equivalent to**: `o[name]`

```javascript
let obj = { x: 1, y: 2 };

// Traditional approach
console.log(obj.x); // 1

// Reflect approach
console.log(Reflect.get(obj, 'x')); // 1
```

**With getter and receiver**:

```javascript
let obj = {
  _value: 10,
  get value() {
    return this._value;
  },
};

let receiver = { _value: 20 };

console.log(Reflect.get(obj, 'value')); // 10 (getter uses obj as this)
console.log(Reflect.get(obj, 'value', receiver)); // 20 (getter uses receiver as this)
```

**Parameters**:

- `o`: Target object
- `name`: Property name (string or Symbol)
- `receiver` (optional): Value to use as `this` when property is an accessor

**Returns**: Property value

---

### 6. Reflect.getOwnPropertyDescriptor(o, name)

Returns the property descriptor for an own property.

**Similar to**: `Object.getOwnPropertyDescriptor()`
**Key difference**: Throws `TypeError` if first argument isn't an object

```javascript
let obj = { x: 1 };

let descriptor = Reflect.getOwnPropertyDescriptor(obj, 'x');
console.log(descriptor);
// { value: 1, writable: true, enumerable: true, configurable: true }

// Non-existent property
console.log(Reflect.getOwnPropertyDescriptor(obj, 'y')); // undefined
```

**Parameters**:

- `o`: Target object (must be an object)
- `name`: Property name (string or Symbol)

**Returns**: Property descriptor object or `undefined`

---

### 7. Reflect.getPrototypeOf(o)

Returns the prototype of an object.

**Similar to**: `Object.getPrototypeOf()`
**Key difference**: Always throws `TypeError` for non-objects

```javascript
let obj = {};
console.log(Reflect.getPrototypeOf(obj) === Object.prototype); // true

let arr = [];
console.log(Reflect.getPrototypeOf(arr) === Array.prototype); // true

class Person {}
let person = new Person();
console.log(Reflect.getPrototypeOf(person) === Person.prototype); // true

// Throws TypeError for primitives
try {
  Reflect.getPrototypeOf(42);
} catch (e) {
  console.log(e.message); // "Reflect.getPrototypeOf called on non-object"
}
```

**Parameters**:

- `o`: Target object

**Returns**: Prototype object or `null`

---

### 8. Reflect.has(o, name)

Checks if a property exists in an object (own or inherited).

**Equivalent to**: `name in o`

```javascript
let obj = { x: 1 };

// Traditional approach
console.log('x' in obj); // true
console.log('toString' in obj); // true (inherited)

// Reflect approach
console.log(Reflect.has(obj, 'x')); // true
console.log(Reflect.has(obj, 'toString')); // true
console.log(Reflect.has(obj, 'y')); // false
```

**Parameters**:

- `o`: Target object
- `name`: Property name (string or Symbol)

**Returns**: `true` if property exists, `false` otherwise

---

### 9. Reflect.isExtensible(o)

Checks if new properties can be added to an object.

**Similar to**: `Object.isExtensible()`
**Key difference**: Throws `TypeError` for non-objects

```javascript
let obj = {};
console.log(Reflect.isExtensible(obj)); // true

Object.preventExtensions(obj);
console.log(Reflect.isExtensible(obj)); // false

Object.seal(obj);
console.log(Reflect.isExtensible(obj)); // false

Object.freeze(obj);
console.log(Reflect.isExtensible(obj)); // false
```

**Parameters**:

- `o`: Target object

**Returns**: `true` if extensible, `false` otherwise

---

### 10. Reflect.ownKeys(o)

Returns an array of all own property keys (strings and Symbols).

**Similar to**: `Object.getOwnPropertyNames()` + `Object.getOwnPropertySymbols()`

```javascript
let sym = Symbol('test');
let obj = {
  a: 1,
  b: 2,
  [sym]: 3,
};

console.log(Reflect.ownKeys(obj)); // ['a', 'b', Symbol(test)]

// Compare with other methods
console.log(Object.keys(obj)); // ['a', 'b'] (only enumerable strings)
console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b'] (all strings)
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(test)] (only symbols)
```

**Parameters**:

- `o`: Target object

**Returns**: Array of property keys (strings and Symbols)

---

### 11. Reflect.preventExtensions(o)

Prevents new properties from being added to an object.

**Similar to**: `Object.preventExtensions()`
**Key differences**: Returns `true` instead of object, throws `TypeError` for non-objects

```javascript
let obj = { x: 1 };

let success = Reflect.preventExtensions(obj);
console.log(success); // true
console.log(Reflect.isExtensible(obj)); // false

// Can still modify existing properties
obj.x = 2;
console.log(obj.x); // 2

// Cannot add new properties
obj.y = 3;
console.log(obj.y); // undefined
```

**Parameters**:

- `o`: Target object

**Returns**: `true` on success

---

### 12. Reflect.set(o, name, value, receiver)

Sets the value of a property.

**Equivalent to**: `o[name] = value`

```javascript
let obj = { x: 1 };

// Traditional approach
obj.x = 2;

// Reflect approach
let success = Reflect.set(obj, 'x', 3);
console.log(success); // true
console.log(obj.x); // 3

// Returns false if property is read-only
Object.defineProperty(obj, 'y', {
  value: 10,
  writable: false,
});

console.log(Reflect.set(obj, 'y', 20)); // false
console.log(obj.y); // 10 (unchanged)
```

**With setter and receiver**:

```javascript
let obj = {
  _value: 10,
  set value(v) {
    this._value = v;
  },
};

let receiver = { _value: 0 };

Reflect.set(obj, 'value', 100); // Sets obj._value
console.log(obj._value); // 100

Reflect.set(obj, 'value', 200, receiver); // Sets receiver._value
console.log(receiver._value); // 200
console.log(obj._value); // 100 (unchanged)
```

**Parameters**:

- `o`: Target object
- `name`: Property name (string or Symbol)
- `value`: Value to set
- `receiver` (optional): Value to use as `this` when property is a setter

**Returns**: `true` on success, `false` on failure

---

### 13. Reflect.setPrototypeOf(o, p)

Sets the prototype of an object.

**Similar to**: `Object.setPrototypeOf()`
**Key differences**: Returns `true`/`false`, always throws for non-objects

```javascript
let obj = {};
let proto = { x: 1 };

let success = Reflect.setPrototypeOf(obj, proto);
console.log(success); // true
console.log(obj.x); // 1 (inherited)

// Cannot set prototype on non-extensible object
Object.preventExtensions(obj);
console.log(Reflect.setPrototypeOf(obj, {})); // false
```

**⚠️ Warning**: Setting prototypes can significantly slow down code due to JavaScript engine optimizations being disrupted.

**Parameters**:

- `o`: Target object
- `p`: New prototype (object or `null`)

**Returns**: `true` on success, `false` on failure

---

## Comparison: Reflect vs Traditional Methods

| Operation       | Traditional               | Reflect                       | Key Difference           |
| --------------- | ------------------------- | ----------------------------- | ------------------------ |
| Function call   | `f.apply(obj, args)`      | `Reflect.apply(f, obj, args)` | More functional          |
| Constructor     | `new C(...args)`          | `Reflect.construct(C, args)`  | Can specify `new.target` |
| Define property | `Object.defineProperty()` | `Reflect.defineProperty()`    | Returns boolean          |
| Delete property | `delete obj.prop`         | `Reflect.deleteProperty()`    | Returns boolean          |
| Get property    | `obj.prop`                | `Reflect.get()`               | Can specify receiver     |
| Check property  | `'prop' in obj`           | `Reflect.has()`               | More functional          |
| Set property    | `obj.prop = value`        | `Reflect.set()`               | Returns boolean          |

---

## Reflect with Proxies

Reflect methods are designed to work perfectly with Proxy traps:

```javascript
let target = { x: 1, y: 2 };

let handler = {
  get(target, prop, receiver) {
    console.log(`Getting property: ${prop}`);
    return Reflect.get(target, prop, receiver); // Default behavior
  },

  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(target, prop, value, receiver); // Default behavior
  },
};

let proxy = new Proxy(target, handler);

proxy.x; // Logs: "Getting property: x"
proxy.z = 3; // Logs: "Setting z to 3"
```

---

## Practical Use Cases

### 1. Safer Property Operations

```javascript
// Instead of try-catch
let obj = {};
try {
  Object.defineProperty(obj, 'x', { value: 1, configurable: false });
  Object.defineProperty(obj, 'x', { value: 2 }); // Throws
} catch (e) {
  console.log('Failed');
}

// Use Reflect for cleaner code
if (!Reflect.defineProperty(obj, 'x', { value: 2 })) {
  console.log('Failed');
}
```

### 2. Dynamic Property Access

```javascript
function getProperty(obj, prop) {
  if (Reflect.has(obj, prop)) {
    return Reflect.get(obj, prop);
  }
  return undefined;
}
```

### 3. Validation Before Setting

```javascript
function safeSet(obj, prop, value) {
  if (Reflect.isExtensible(obj)) {
    return Reflect.set(obj, prop, value);
  }
  console.warn('Object is not extensible');
  return false;
}
```

---

## Key Concepts Summary

📌 **Reflect** provides a unified API for object operations
📌 Methods return **boolean success/failure** instead of throwing
📌 **One-to-one mapping** with Proxy handler methods
📌 More **functional and predictable** than traditional operators
📌 Essential for **metaprogramming** and creating abstractions
📌 **No performance penalty** compared to traditional operations
📌 Use with **Proxies** for powerful intercept patterns
📌 **Better error handling** with boolean returns
📌 Throws `TypeError` consistently for non-object arguments
📌 `setPrototypeOf` should be avoided when possible (performance)
