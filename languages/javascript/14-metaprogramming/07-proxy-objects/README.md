# JavaScript Proxy Objects

## What is a Proxy?

A **Proxy** is JavaScript's most powerful metaprogramming feature (ES6+) that allows you to intercept and customize fundamental operations on objects. It creates a wrapper around a target object, enabling you to control how that object behaves.

## Basic Syntax

```javascript
let proxy = new Proxy(target, handlers);
```

**Components**:

- **target**: The original object being wrapped
- **handlers**: An object containing "trap" methods that intercept operations
- **proxy**: The resulting proxy object with customized behavior

---

## How Proxies Work

When you perform operations on a proxy (read/write properties, delete, call functions, etc.), the proxy:

1. **Checks handlers object** for a corresponding trap method
2. **If trap exists**: Executes the trap method
3. **If trap doesn't exist**: Forwards the operation to the target object

### Transparent Wrapper (Empty Handlers)

```javascript
let t = { x: 1, y: 2 };
let p = new Proxy(t, {});

p.x; // 1 (reads from target)
delete p.y; // true (deletes from target)
t.y; // undefined (deleted)
p.z = 3; // Defines property on target
t.z; // 3
```

---

## Proxy Trap Methods

Proxies support the same operations as the **Reflect API**. Common traps include:

| Trap                         | Intercepts                          | Signature                                      |
| ---------------------------- | ----------------------------------- | ---------------------------------------------- |
| **get**                      | Property access                     | `get(target, property, receiver)`              |
| **set**                      | Property assignment                 | `set(target, property, value, receiver)`       |
| **has**                      | `in` operator                       | `has(target, property)`                        |
| **deleteProperty**           | `delete` operator                   | `deleteProperty(target, property)`             |
| **defineProperty**           | `Object.defineProperty()`           | `defineProperty(target, property, descriptor)` |
| **getOwnPropertyDescriptor** | `Object.getOwnPropertyDescriptor()` | `getOwnPropertyDescriptor(target, property)`   |
| **ownKeys**                  | `Object.keys()`, `for...in`         | `ownKeys(target)`                              |
| **getPrototypeOf**           | `Object.getPrototypeOf()`           | `getPrototypeOf(target)`                       |
| **setPrototypeOf**           | `Object.setPrototypeOf()`           | `setPrototypeOf(target, prototype)`            |
| **isExtensible**             | `Object.isExtensible()`             | `isExtensible(target)`                         |
| **preventExtensions**        | `Object.preventExtensions()`        | `preventExtensions(target)`                    |
| **apply**                    | Function call                       | `apply(target, thisArg, argumentsList)`        |
| **construct**                | `new` operator                      | `construct(target, argumentsList, newTarget)`  |

---

## Revocable Proxies

Create proxies that can be permanently disabled:

```javascript
function accessTheDatabase() {
  return 42;
}

let { proxy, revoke } = Proxy.revocable(accessTheDatabase, {});

proxy(); // 42 (works normally)
revoke(); // Disable the proxy
proxy(); // TypeError: Cannot perform operation on a revoked proxy
```

**Use cases**:

- Code isolation with untrusted libraries
- Temporary access to sensitive functions
- Security and access control

---

## Practical Examples

### 1. Infinite Properties Object

An object that appears to have every possible property:

```javascript
let identity = new Proxy(
  {},
  {
    get(target, name) {
      return name; // Property value equals its name
    },

    has(target, name) {
      return true; // Every property exists
    },

    ownKeys(target) {
      throw new RangeError('Infinite number of properties');
    },

    getOwnPropertyDescriptor(target, name) {
      return {
        value: name,
        enumerable: false,
        writable: false,
        configurable: false,
      };
    },

    set(target, name, value) {
      return false; // Read-only
    },

    deleteProperty(target, name) {
      return false; // Cannot delete
    },

    defineProperty(target, name, desc) {
      return false; // Cannot define new
    },

    isExtensible(target) {
      return false; // Not extensible
    },

    getPrototypeOf(target) {
      return null;
    },

    setPrototypeOf(target, proto) {
      return false;
    },
  }
);

identity.x; // "x"
identity.toString; // "toString"
identity[0]; // "0"
identity.x = 1; // No effect (read-only)
delete identity.x; // false
Object.keys(identity); // RangeError
```

### 2. Read-Only Wrapper

Create an immutable view of an object:

```javascript
function readOnlyProxy(o) {
  function readonly() {
    throw new TypeError('Readonly');
  }

  return new Proxy(o, {
    set: readonly,
    defineProperty: readonly,
    deleteProperty: readonly,
    setPrototypeOf: readonly,
  });
}

let o = { x: 1, y: 2 };
let p = readOnlyProxy(o);

p.x; // 1 (reading works)
p.x = 2; // TypeError: Readonly
delete p.y; // TypeError: Readonly
p.z = 3; // TypeError: Readonly
p.__proto__ = {}; // TypeError: Readonly
```

**Use case**: Testing functions to ensure they don't modify input arguments.

### 3. Logging Proxy

Log all operations performed on an object:

```javascript
function loggingProxy(o, objname) {
  const handlers = {
    get(target, property, receiver) {
      console.log(`Handler get(${objname}, ${property.toString()})`);
      let value = Reflect.get(target, property, receiver);

      // Return proxy for nested objects/functions
      if (
        Reflect.ownKeys(target).includes(property) &&
        (typeof value === 'object' || typeof value === 'function')
      ) {
        return loggingProxy(value, `${objname}.${property.toString()}`);
      }

      return value;
    },

    set(target, prop, value, receiver) {
      console.log(`Handler set(${objname}, ${prop.toString()}, ${value})`);
      return Reflect.set(target, prop, value, receiver);
    },

    apply(target, receiver, args) {
      console.log(`Handler ${objname}(${args})`);
      return Reflect.apply(target, receiver, args);
    },

    construct(target, args, receiver) {
      console.log(`Handler ${objname}(${args})`);
      return Reflect.construct(target, args, receiver);
    },
  };

  // Auto-generate remaining handlers
  Reflect.ownKeys(Reflect).forEach((handlerName) => {
    if (!(handlerName in handlers)) {
      handlers[handlerName] = function (target, ...args) {
        console.log(`Handler ${handlerName}(${objname}, ${args})`);
        return Reflect[handlerName](target, ...args);
      };
    }
  });

  return new Proxy(o, handlers);
}
```

**Usage example**:

```javascript
let data = [10, 20];
let methods = { square: (x) => x * x };

let proxyData = loggingProxy(data, 'data');
let proxyMethods = loggingProxy(methods, 'methods');

// See how Array.map() works internally
proxyData.map(methods.square);
// Logs:
// Handler get(data, map)
// Handler get(data, length)
// Handler get(data, constructor)
// Handler has(data, 0)
// Handler get(data, 0)
// Handler has(data, 1)
// Handler get(data, 1)

// See how iteration works
for (let x of proxyData) console.log('Datum', x);
// Logs:
// Handler get(data, Symbol(Symbol.iterator))
// Handler get(data, length)
// Handler get(data, 0)
// Datum 10
// Handler get(data, length)
// Handler get(data, 1)
// Datum 20
// Handler get(data, length)
```

---

## Delegating with Reflect API

The **Reflect API** has the same method signatures as proxy handlers, making delegation easy:

```javascript
let proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Getting ${property}`);
    return Reflect.get(target, property, receiver); // Delegate
  },

  set(target, property, value, receiver) {
    console.log(`Setting ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver); // Delegate
  },
});
```

---

## Proxy Invariants (Constraints)

Proxies enforce **JavaScript invariants** to maintain consistency. The Proxy class throws **TypeError** if handlers violate these rules:

### 1. Non-Extensible Objects

Cannot report as extensible if target is non-extensible:

```javascript
let target = Object.preventExtensions({});
let proxy = new Proxy(target, {
  isExtensible() {
    return true;
  }, // VIOLATION
});

Reflect.isExtensible(proxy); // TypeError: invariant violation
```

### 2. Prototype Consistency

Non-extensible targets must return actual prototype:

```javascript
let target = Object.preventExtensions({});
let proxy = new Proxy(target, {
  getPrototypeOf() {
    return {};
  }, // VIOLATION
});

Object.getPrototypeOf(proxy); // TypeError
```

### 3. Non-Writable, Non-Configurable Properties

`get()` must return the actual value:

```javascript
let target = Object.freeze({ x: 1 });
let proxy = new Proxy(target, {
  get() {
    return 99;
  }, // VIOLATION
});

proxy.x; // TypeError: value doesn't match target
```

### Other Invariants

- **deleteProperty** must return `false` for non-configurable properties
- **defineProperty** must return `false` if target is non-extensible
- **set** must return `false` for non-writable properties
- **has** must return `true` for non-configurable properties

---

## Common Use Cases

### 1. Validation

```javascript
let validator = {
  set(target, property, value) {
    if (property === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[property] = value;
    return true;
  },
};

let person = new Proxy({}, validator);
person.age = 30; // OK
person.age = 'thirty'; // TypeError
```

### 2. Default Values

```javascript
let withDefaults = new Proxy(
  {},
  {
    get(target, property) {
      return property in target ? target[property] : 'default';
    },
  }
);

withDefaults.x; // "default"
withDefaults.x = 10;
withDefaults.x; // 10
```

### 3. Negative Array Indices

```javascript
function negativeArray(array) {
  return new Proxy(array, {
    get(target, property) {
      let index = Number(property);
      if (index < 0) {
        property = String(target.length + index);
      }
      return Reflect.get(target, property);
    },
  });
}

let arr = negativeArray([1, 2, 3, 4, 5]);
arr[-1]; // 5
arr[-2]; // 4
```

### 4. Observable Objects

```javascript
function observable(target, callback) {
  return new Proxy(target, {
    set(target, property, value) {
      callback(property, value);
      return Reflect.set(target, property, value);
    },
  });
}

let user = observable({}, (prop, val) => {
  console.log(`Property ${prop} changed to ${val}`);
});

user.name = 'Alice'; // Logs: Property name changed to Alice
```

### 5. Private Properties

```javascript
function withPrivate(target) {
  return new Proxy(target, {
    get(target, property) {
      if (property.startsWith('_')) {
        throw new Error('Private property access denied');
      }
      return Reflect.get(target, property);
    },
  });
}

let obj = withPrivate({ public: 1, _private: 2 });
obj.public; // 1
obj._private; // Error: Private property access denied
```

---

## Key Concepts Summary

✅ **Proxies intercept** fundamental operations on objects
✅ **Empty handlers** create transparent wrappers
✅ **Revocable proxies** can be permanently disabled
✅ **Handler traps** correspond to Reflect API methods
✅ **Reflect API** makes delegation easy and clean
✅ **Proxy invariants** enforce JavaScript consistency rules
✅ **Common uses**: validation, logging, access control, defaults
✅ **Works with functions** and objects as targets
✅ **Metaprogramming tool** for customizing object behavior
✅ **Performance consideration**: Proxies add overhead

---

## Important Notes

⚠️ **Not all operations can be trapped** (e.g., `===` equality)
⚠️ **Performance overhead**: Proxies are slower than direct object access
⚠️ **Invariants cannot be violated**: Proxy enforces consistency
⚠️ **Revoked proxies** throw errors on all operations
⚠️ **Deep proxying** requires recursive wrapping (like loggingProxy)
