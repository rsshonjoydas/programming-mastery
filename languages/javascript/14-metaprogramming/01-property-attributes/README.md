# JavaScript Property Attributes

## What Are Property Attributes?

Every property in JavaScript has a **name**, a **value**, and **three attributes** that control its behavior:

| Attribute        | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| **writable**     | Can the property value be changed?                                |
| **enumerable**   | Does the property appear in `for...in` loops and `Object.keys()`? |
| **configurable** | Can the property be deleted or have its attributes changed?       |

**Default values** for properties created via object literals or assignment:

- `writable: true`
- `enumerable: true`
- `configurable: true`

---

## Data Properties vs Accessor Properties

### Data Properties

Have **four attributes**:

1. **value** - The property's value
2. **writable** - Can the value be changed?
3. **enumerable** - Appears in enumerations?
4. **configurable** - Can be deleted or modified?

### Accessor Properties

Have **four attributes**:

1. **get** - Getter function (or `undefined`)
2. **set** - Setter function (or `undefined`)
3. **enumerable** - Appears in enumerations?
4. **configurable** - Can be deleted or modified?

**Note**: Accessor properties don't have `value` or `writable` attributes. Their writability depends on whether a setter exists.

---

## Property Descriptors

A **property descriptor** is an object that represents the attributes of a property.

### Data Property Descriptor

```javascript
{
  value: 1,
  writable: true,
  enumerable: true,
  configurable: true
}
```

### Accessor Property Descriptor

```javascript
{
  get: function() { return this._value; },
  set: function(val) { this._value = val; },
  enumerable: true,
  configurable: true
}
```

---

## Querying Property Attributes

### Object.getOwnPropertyDescriptor()

Returns the property descriptor for an **own property** (not inherited).

```javascript
// Data property
Object.getOwnPropertyDescriptor({ x: 1 }, 'x');
// Returns: {value: 1, writable: true, enumerable: true, configurable: true}

// Accessor property
const random = {
  get octet() {
    return Math.floor(Math.random() * 256);
  },
};
Object.getOwnPropertyDescriptor(random, 'octet');
// Returns: {get: [Function], set: undefined, enumerable: true, configurable: true}

// Non-existent or inherited properties
Object.getOwnPropertyDescriptor({}, 'x'); // undefined
Object.getOwnPropertyDescriptor({}, 'toString'); // undefined (inherited)
```

**To query inherited properties**: Manually traverse the prototype chain using `Object.getPrototypeOf()`.

---

## Setting Property Attributes

### Object.defineProperty()

Creates a new property or modifies an existing property with specified attributes.

**Syntax**:

```javascript
Object.defineProperty(obj, propertyName, descriptor);
```

#### Example: Creating Non-Enumerable Property

```javascript
let o = {};

Object.defineProperty(o, 'x', {
  value: 1,
  writable: true,
  enumerable: false, // Hidden from Object.keys()
  configurable: true,
});

o.x; // 1
Object.keys(o); // [] (x is non-enumerable)
```

#### Example: Making Property Read-Only

```javascript
Object.defineProperty(o, 'x', { writable: false });

o.x = 2; // Fails silently (strict mode: TypeError)
o.x; // Still 1
```

#### Example: Changing Value of Non-Writable Property

```javascript
// If configurable, can still change value directly
Object.defineProperty(o, 'x', { value: 2 });
o.x; // 2
```

#### Example: Converting Data Property to Accessor

```javascript
Object.defineProperty(o, 'x', {
  get: function () {
    return 0;
  },
});

o.x; // 0 (now an accessor property)
```

**Important**:

- Omitted attributes default to `false` or `undefined` when **creating** properties
- Omitted attributes remain **unchanged** when **modifying** properties
- Only affects **own properties**, never inherited properties

---

## Setting Multiple Properties

### Object.defineProperties()

Creates or modifies multiple properties at once.

**Syntax**:

```javascript
Object.defineProperties(obj, descriptors);
```

#### Example

```javascript
let p = Object.defineProperties(
  {},
  {
    x: {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    },
    y: {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    },
    r: {
      get() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      enumerable: true,
      configurable: true,
    },
  }
);

p.r; // Math.SQRT2 (≈1.414)
```

**Returns**: The modified object (like `Object.defineProperty()`)

---

## Using with Object.create()

`Object.create()` accepts an optional second argument with property descriptors.

```javascript
let obj = Object.create(Object.prototype, {
  name: {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  age: {
    value: 30,
    writable: false, // Read-only
    enumerable: true,
    configurable: true,
  },
});

obj.name; // "Alice"
obj.age; // 30
obj.age = 40; // Fails (read-only)
```

---

## Attribute Modification Rules

`Object.defineProperty()` and `Object.defineProperties()` throw **TypeError** when rules are violated:

### 1. **Non-Extensible Objects**

Cannot add new properties, but can modify existing own properties.

```javascript
let obj = { x: 1 };
Object.preventExtensions(obj);
Object.defineProperty(obj, 'y', { value: 2 }); // TypeError
```

### 2. **Non-Configurable Properties**

Cannot change `configurable` or `enumerable` attributes.

```javascript
Object.defineProperty(obj, 'x', { configurable: false });
Object.defineProperty(obj, 'x', { configurable: true }); // TypeError
Object.defineProperty(obj, 'x', { enumerable: false }); // TypeError
```

### 3. **Non-Configurable Accessor Properties**

Cannot change getter/setter or convert to data property.

```javascript
Object.defineProperty(obj, 'prop', {
  get: () => 1,
  configurable: false,
});
Object.defineProperty(obj, 'prop', { value: 2 }); // TypeError
```

### 4. **Non-Configurable Data Properties**

Cannot convert to accessor property.

```javascript
Object.defineProperty(obj, 'x', {
  value: 1,
  configurable: false,
});
Object.defineProperty(obj, 'x', { get: () => 2 }); // TypeError
```

### 5. **Writable Attribute Changes**

- **Cannot** change from `false` to `true` if non-configurable
- **Can** change from `true` to `false` even if non-configurable

```javascript
Object.defineProperty(obj, 'x', {
  value: 1,
  writable: false,
  configurable: false,
});

Object.defineProperty(obj, 'x', { writable: true }); // TypeError
```

### 6. **Value Changes**

- **Cannot** change value if non-configurable AND non-writable
- **Can** change value if configurable (even if non-writable)

```javascript
// Non-configurable + non-writable
Object.defineProperty(obj, 'x', {
  value: 1,
  writable: false,
  configurable: false,
});
Object.defineProperty(obj, 'x', { value: 2 }); // TypeError

// Configurable + non-writable (allowed)
Object.defineProperty(obj, 'y', {
  value: 1,
  writable: false,
  configurable: true,
});
Object.defineProperty(obj, 'y', { value: 2 }); // OK
```

---

## Object.assign() vs Property Descriptors

`Object.assign()` **only copies enumerable property values**, not attributes or getters/setters.

```javascript
let o = {
  c: 1,
  get count() {
    return this.c++;
  },
};

let p = Object.assign({}, o);
p.count; // 1
p.count; // 1 (copied as data property, not getter)

// To copy descriptors, use custom function
let q = Object.assignDescriptors({}, o); // See below
q.count; // 2
q.count; // 3 (getter copied)
```

---

## Custom Object.assignDescriptors()

A utility function that copies **property descriptors** instead of just values.

```javascript
Object.defineProperty(Object, 'assignDescriptors', {
  writable: true,
  enumerable: false,
  configurable: true,

  value: function (target, ...sources) {
    for (let source of sources) {
      // Copy regular properties
      for (let name of Object.getOwnPropertyNames(source)) {
        let desc = Object.getOwnPropertyDescriptor(source, name);
        Object.defineProperty(target, name, desc);
      }

      // Copy symbol properties
      for (let symbol of Object.getOwnPropertySymbols(source)) {
        let desc = Object.getOwnPropertyDescriptor(source, symbol);
        Object.defineProperty(target, symbol, desc);
      }
    }
    return target;
  },
});
```

### Usage Example

```javascript
let o = {
  c: 1,
  get count() {
    return this.c++;
  },
};

let p = Object.assign({}, o);
p.count; // 1 (value at copy time)
p.count; // 1 (now just a data property)

let q = Object.assignDescriptors({}, o);
q.count; // 2 (getter incremented during copy)
q.count; // 3 (getter copied, increments each time)
```

---

## Practical Use Cases

### 1. Making Methods Non-Enumerable (Like Built-ins)

```javascript
Object.defineProperty(MyClass.prototype, 'myMethod', {
  value: function () {
    /* ... */
  },
  writable: true,
  enumerable: false, // Hidden from for...in
  configurable: true,
});
```

### 2. Creating Read-Only Properties

```javascript
Object.defineProperty(config, 'API_KEY', {
  value: 'secret123',
  writable: false,
  enumerable: true,
  configurable: false,
});
```

### 3. Locking Down Objects

```javascript
Object.defineProperties(obj, {
  id: { value: 123, writable: false, configurable: false },
  name: { value: 'Protected', writable: false, configurable: false },
});
```

### 4. Creating Computed Properties

```javascript
Object.defineProperty(rectangle, 'area', {
  get: function () {
    return this.width * this.height;
  },
  enumerable: true,
  configurable: true,
});
```

---

## Summary Table

| Operation                    | Configurable | Writable | Result           |
| ---------------------------- | ------------ | -------- | ---------------- |
| Delete property              | `false`      | -        | ❌ Cannot delete |
| Change to accessor           | `false`      | -        | ❌ TypeError     |
| Change enumerable            | `false`      | -        | ❌ TypeError     |
| Change configurable          | `false`      | -        | ❌ TypeError     |
| Change writable (true→false) | `false`      | `true`   | ✅ Allowed       |
| Change writable (false→true) | `false`      | `false`  | ❌ TypeError     |
| Change value                 | `true`       | `false`  | ✅ Allowed       |
| Change value                 | `false`      | `false`  | ❌ TypeError     |
| Change value                 | Any          | `true`   | ✅ Allowed       |

---

## Key Concepts

✅ **Three core attributes**: writable, enumerable, configurable
✅ **Data properties** have value + writable; **accessor properties** have get + set
✅ **Property descriptors** represent all attributes as an object
✅ `Object.getOwnPropertyDescriptor()` queries attributes (own properties only)
✅ `Object.defineProperty()` creates/modifies properties with specific attributes
✅ `Object.defineProperties()` handles multiple properties at once
✅ **Omitted attributes** default to false/undefined when creating; unchanged when modifying
✅ **Configurable: false** prevents most changes (strictest lock)
✅ **Writable: false** + **configurable: true** allows value changes via defineProperty
✅ `Object.assign()` copies values only; custom function needed for descriptors
✅ Important for **library authors** to create non-enumerable methods and locked properties
