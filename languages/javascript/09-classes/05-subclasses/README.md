# JavaScript Subclasses

## What Are Subclasses?

In object-oriented programming, a **subclass** (class B) can **extend** or inherit from a **superclass** (class A).

**Key concepts**:

- **Superclass (A)**: The parent class being extended
- **Subclass (B)**: The child class that extends the parent
- **Inheritance**: Subclass instances inherit methods from the superclass
- **Override**: Subclass can redefine superclass methods
- **Super invocation**: Subclass often needs to call superclass methods/constructor

---

## Pre-ES6: Subclassing with Prototypes

Before ES6, subclassing required manual prototype manipulation.

### Example: Span Subclass of Range

```javascript
// Constructor function for subclass
function Span(start, span) {
  if (span >= 0) {
    this.from = start;
    this.to = start + span;
  } else {
    this.to = start;
    this.from = start + span;
  }
}

// KEY LINE: Make Span.prototype inherit from Range.prototype
Span.prototype = Object.create(Range.prototype);

// Fix constructor property
Span.prototype.constructor = Span;

// Override toString() method
Span.prototype.toString = function () {
  return `(${this.from}... +${this.to - this.from})`;
};
```

**How it works**:

- `Object.create(Range.prototype)` creates an object that inherits from Range
- Span objects inherit from both `Span.prototype` and `Range.prototype`
- Creates prototype chain: `Span instance` → `Span.prototype` → `Range.prototype` → `Object.prototype`

**Limitations**:

- No simple way to invoke superclass constructor
- No easy way to call overridden superclass methods
- Verbose and error-prone

---

## ES6+: Subclassing with `extends` and `super`

ES6 introduced the `extends` keyword and `super` for clean subclassing.

### Basic Syntax

```javascript
class Subclass extends Superclass {
  constructor(params) {
    super(params); // Call superclass constructor
    // Initialize subclass
  }

  method() {
    super.method(); // Call superclass method
    // Additional subclass behavior
  }
}
```

### Simple Example: EZArray

```javascript
class EZArray extends Array {
  get first() {
    return this[0];
  }
  get last() {
    return this[this.length - 1];
  }
}

let a = new EZArray();
a instanceof EZArray; // true
a instanceof Array; // true

a.push(1, 2, 3, 4); // Inherited method
a.pop(); // => 4
a.first; // => 1 (subclass getter)
a.last; // => 3 (subclass getter)

Array.isArray(a); // true
EZArray.isArray(a); // true (inherits static methods!)
```

**Key features**:

- Subclass instances are also instances of the superclass
- Inherits both instance methods (`push`, `pop`) and static methods (`isArray`)
- `EZArray` function inherits from `Array` function

### Inheritance Chain

```javascript
// Instance methods inheritance
Array.prototype.isPrototypeOf(EZArray.prototype); // true

// Static methods inheritance (ES6+ feature)
Array.isPrototypeOf(EZArray); // true
```

---

## Complete Example: TypedMap

A Map subclass that enforces type checking on keys and values.

```javascript
class TypedMap extends Map {
  constructor(keyType, valueType, entries) {
    // Type-check initial entries
    if (entries) {
      for (let [k, v] of entries) {
        if (typeof k !== keyType || typeof v !== valueType) {
          throw new TypeError(`Wrong type for entry [${k}, ${v}]`);
        }
      }
    }

    // Call superclass constructor
    super(entries);

    // Initialize subclass state
    this.keyType = keyType;
    this.valueType = valueType;
  }

  // Override set() method
  set(key, value) {
    // Type checking
    if (this.keyType && typeof key !== this.keyType) {
      throw new TypeError(`${key} is not of type ${this.keyType}`);
    }
    if (this.valueType && typeof value !== this.valueType) {
      throw new TypeError(`${value} is not of type ${this.valueType}`);
    }

    // Call superclass method
    return super.set(key, value);
  }
}

// Usage
let map = new TypedMap('string', 'number');
map.set('age', 30); // OK
map.set('age', 'thirty'); // TypeError
```

---

## Rules for Using `super()`

### In Constructors

1. **Must call `super()`**: If you use `extends`, the constructor **must** call `super()` to invoke the superclass constructor

2. **Auto-generated constructor**: If you don't define a constructor, one is automatically created:

   ```javascript
   constructor(...args) {
     super(...args);
   }
   ```

3. **Call `super()` before `this`**: You cannot use `this` until after calling `super()`

   ```javascript
   class Bad extends Parent {
     constructor() {
       this.x = 1; // ReferenceError!
       super();
     }
   }

   class Good extends Parent {
     constructor() {
       super();
       this.x = 1; // OK
     }
   }
   ```

4. **`new.target` in constructors**: References the constructor that was invoked

   ```javascript
   class Parent {
     constructor() {
       console.log(new.target.name); // Logs subclass name
     }
   }

   class Child extends Parent {
     constructor() {
       super(); // Logs "Child"
     }
   }
   ```

### In Methods

- **Not required**: Methods can override without calling `super`
- **Flexible timing**: Can call `super.method()` at beginning, middle, or end
- **`super` as object**: Refers to current object but accesses superclass methods

```javascript
class Parent {
  greet() {
    return 'Hello from Parent';
  }
}

class Child extends Parent {
  greet() {
    let parentGreeting = super.greet(); // Call superclass method
    return `${parentGreeting} and Child`;
  }
}
```

---

## Composition Over Inheritance

**Problem**: Inheritance creates tight coupling between classes.

**Solution**: Use **delegation/composition** instead of subclassing.

### Delegation Pattern

Instead of inheriting, create an instance and delegate to it:

```javascript
class Histogram {
  constructor() {
    this.map = new Map(); // Delegate to Map, don't inherit
  }

  count(key) {
    return this.map.get(key) || 0;
  }

  has(key) {
    return this.count(key) > 0;
  }

  get size() {
    return this.map.size;
  }

  add(key) {
    this.map.set(key, this.count(key) + 1);
  }

  delete(key) {
    let count = this.count(key);
    if (count === 1) {
      this.map.delete(key);
    } else if (count > 1) {
      this.map.set(key, count - 1);
    }
  }

  [Symbol.iterator]() {
    return this.map.keys();
  }

  keys() {
    return this.map.keys();
  }
  values() {
    return this.map.values();
  }
  entries() {
    return this.map.entries();
  }
}
```

**Benefits**:

- More flexible than inheritance
- Easier to change implementation
- Avoids inheritance complexity
- Simple, clear implementation
- Not formally a Map, but implements Set-like interface

**Trade-off**: `Histogram` is not an instance of `Map`, but in untyped JavaScript, that's often fine.

---

## Abstract Classes

JavaScript doesn't have formal abstract classes, but you can create them by:

- Defining methods that throw errors
- Expecting subclasses to implement them

### Abstract Class Pattern

```javascript
class AbstractSet {
  // Abstract method - must be implemented by subclasses
  has(x) {
    throw new Error('Abstract method');
  }
}

class ConcreteSet extends AbstractSet {
  constructor() {
    super();
    this.data = new Set();
  }

  // Implement abstract method
  has(x) {
    return this.data.has(x);
  }
}
```

---

## Class Hierarchy Example: Set Classes

A complete hierarchy demonstrating abstract and concrete classes:

### 1. AbstractSet (Base Abstract Class)

```javascript
class AbstractSet {
  has(x) {
    throw new Error('Abstract method');
  }
}
```

### 2. Concrete Non-Enumerable Sets

```javascript
// NotSet - complement of another set
class NotSet extends AbstractSet {
  constructor(set) {
    super();
    this.set = set;
  }

  has(x) {
    return !this.set.has(x);
  }
  toString() {
    return `{ x| x ∉ ${this.set.toString()} }`;
  }
}

// RangeSet - continuous range of numbers
class RangeSet extends AbstractSet {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
  }

  has(x) {
    return x >= this.from && x <= this.to;
  }
  toString() {
    return `{ x| ${this.from} ≤ x ≤ ${this.to} }`;
  }
}
```

### 3. AbstractEnumerableSet (Abstract with Partial Implementation)

```javascript
class AbstractEnumerableSet extends AbstractSet {
  // Abstract methods
  get size() {
    throw new Error('Abstract method');
  }
  [Symbol.iterator]() {
    throw new Error('Abstract method');
  }

  // Concrete methods built on abstractions
  isEmpty() {
    return this.size === 0;
  }

  toString() {
    return `{${Array.from(this).join(', ')}}`;
  }

  equals(set) {
    if (!(set instanceof AbstractEnumerableSet)) return false;
    if (this.size !== set.size) return false;

    for (let element of this) {
      if (!set.has(element)) return false;
    }

    return true;
  }
}
```

### 4. SingletonSet (Concrete Read-Only)

```javascript
class SingletonSet extends AbstractEnumerableSet {
  constructor(member) {
    super();
    this.member = member;
  }

  has(x) {
    return x === this.member;
  }
  get size() {
    return 1;
  }
  *[Symbol.iterator]() {
    yield this.member;
  }

  // Inherits: isEmpty(), toString(), equals()
}
```

### 5. AbstractWritableSet (Abstract with More Operations)

```javascript
class AbstractWritableSet extends AbstractEnumerableSet {
  // Abstract methods
  insert(x) {
    throw new Error('Abstract method');
  }
  remove(x) {
    throw new Error('Abstract method');
  }

  // Concrete operations
  add(set) {
    for (let element of set) {
      this.insert(element);
    }
  }

  subtract(set) {
    for (let element of set) {
      this.remove(element);
    }
  }

  intersect(set) {
    for (let element of this) {
      if (!set.has(element)) {
        this.remove(element);
      }
    }
  }
}
```

### 6. BitSet (Concrete Efficient Implementation)

```javascript
class BitSet extends AbstractWritableSet {
  constructor(max) {
    super();
    this.max = max;
    this.n = 0;
    this.numBytes = Math.floor(max / 8) + 1;
    this.data = new Uint8Array(this.numBytes);
  }

  _valid(x) {
    return Number.isInteger(x) && x >= 0 && x <= this.max;
  }

  _has(byte, bit) {
    return (this.data[byte] & BitSet.bits[bit]) !== 0;
  }

  has(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      return this._has(byte, bit);
    }
    return false;
  }

  insert(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      if (!this._has(byte, bit)) {
        this.data[byte] |= BitSet.bits[bit];
        this.n++;
      }
    } else {
      throw new TypeError('Invalid set element: ' + x);
    }
  }

  remove(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      if (this._has(byte, bit)) {
        this.data[byte] &= BitSet.masks[bit];
        this.n--;
      }
    } else {
      throw new TypeError('Invalid set element: ' + x);
    }
  }

  get size() {
    return this.n;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i <= this.max; i++) {
      if (this.has(i)) {
        yield i;
      }
    }
  }
}

// Pre-computed bit manipulation values
BitSet.bits = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
BitSet.masks = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);
```

---

## Class Hierarchy Diagram

```text
AbstractSet (abstract has())
    ├── NotSet (concrete)
    ├── RangeSet (concrete)
    └── AbstractEnumerableSet (abstract size, iterator; concrete isEmpty, toString, equals)
            ├── SingletonSet (concrete)
            └── AbstractWritableSet (abstract insert, remove; concrete add, subtract, intersect)
                    └── BitSet (concrete)
```

---

## Key Concepts Summary

✅ **Subclass** extends superclass with `extends` keyword
✅ **`super()`** calls superclass constructor (required in subclass constructor)
✅ **`super.method()`** calls superclass methods
✅ Must call `super()` before using `this` in constructor
✅ **Override** methods by defining same-named method in subclass
✅ **Static methods** are also inherited in ES6+
✅ **Composition over inheritance**: Often better to delegate than subclass
✅ **Abstract classes** define interface, partial implementation
✅ **Concrete classes** provide full implementation
✅ **Class hierarchies** organize related classes with shared behavior
✅ Use `new.target` to detect which constructor was actually called
