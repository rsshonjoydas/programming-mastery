# JavaScript Extended Object Literal Syntax

Modern JavaScript (ES6+) has introduced powerful extensions to object literal syntax that make code more concise and expressive.

---

## 1. Shorthand Properties

When variable names match property names, you can use shorthand syntax.

### Before ES6 (Repetitive)

```javascript
let x = 1,
  y = 2;
let o = {
  x: x,
  y: y,
};
```

### ES6+ Shorthand

```javascript
let x = 1,
  y = 2;
let o = { x, y }; // Much cleaner!
console.log(o.x + o.y); // 3
```

**Rule**: If the property name and variable name are identical, just write it once.

### Practical Example

```javascript
function createUser(name, age, email) {
  return { name, age, email }; // Instead of name: name, age: age, email: email
}

let user = createUser('Alice', 30, 'alice@example.com');
console.log(user); // { name: 'Alice', age: 30, email: 'alice@example.com' }
```

---

## 2. Computed Property Names

Create properties with dynamic names determined at runtime.

### Before ES6 (Two Steps)

```javascript
const PROPERTY_NAME = 'p1';
function computePropertyName() {
  return 'p' + 2;
}

let o = {};
o[PROPERTY_NAME] = 1; // Step 1: Create object
o[computePropertyName()] = 2; // Step 2: Add properties
```

### ES6+ Computed Properties

```javascript
const PROPERTY_NAME = 'p1';
function computePropertyName() {
  return 'p' + 2;
}

let p = {
  [PROPERTY_NAME]: 1, // Computed property names
  [computePropertyName()]: 2, // in object literal!
};

console.log(p.p1 + p.p2); // 3
```

**Syntax**: Use square brackets `[]` around any JavaScript expression to compute the property name.

### Use Cases

**1. Working with library constants**:

```javascript
// Library defines constants
const API_KEY = 'apiKey';
const API_SECRET = 'apiSecret';

let config = {
  [API_KEY]: 'abc123', // Safer than hardcoding 'apiKey'
  [API_SECRET]: 'xyz789', // Reduces typos and version issues
};
```

**2. Dynamic property creation**:

```javascript
function createObject(key, value) {
  return { [key]: value };
}

let obj1 = createObject('name', 'Alice');
let obj2 = createObject('age', 30);
console.log(obj1); // { name: 'Alice' }
console.log(obj2); // { age: 30 }
```

---

## 3. Symbols as Property Names

Symbols create unique, non-conflicting property names using computed property syntax.

### Creating and Using Symbols

```javascript
const extension = Symbol('my extension symbol');

let o = {
  [extension]: {
    /* extension data stored in this object */
  },
};

o[extension].x = 0; // Won't conflict with other properties
```

### Symbol Characteristics

**Uniqueness**:

```javascript
let sym1 = Symbol('test');
let sym2 = Symbol('test');
console.log(sym1 === sym2); // false - each Symbol is unique!
```

**Creating Symbols**:

- Use `Symbol()` factory function (NOT `new Symbol()`)
- Symbols are primitive values, not objects
- Optional string argument is for debugging only

### Why Use Symbols?

**Safe object extension** - Add properties to third-party objects without conflicts:

```javascript
// Third-party object you don't control
let thirdPartyObj = { name: 'existing', value: 42 };

// Safe to add your own properties
const myData = Symbol('myData');
thirdPartyObj[myData] = { custom: 'data' };

// No risk of conflicting with existing or future properties!
```

**Not for security**:

- Third-party code can discover Symbols using `Object.getOwnPropertySymbols()`
- Symbols prevent **accidental** conflicts, not malicious access

### Well-Known Symbols

JavaScript provides built-in Symbols for special behaviors:

```javascript
let iterable = {
  [Symbol.iterator]() {
    // Makes object work with for...of loops
    let i = 0;
    return {
      next() {
        return i < 3 ? { value: i++, done: false } : { done: true };
      },
    };
  },
};

for (let val of iterable) {
  console.log(val); // 0, 1, 2
}
```

---

## 4. Spread Operator (...)

Copy properties from existing objects into new objects (ES2018+).

### Basic Spread

```javascript
let position = { x: 0, y: 0 };
let dimensions = { width: 100, height: 75 };
let rect = { ...position, ...dimensions };

console.log(rect);
// { x: 0, y: 0, width: 100, height: 75 }
console.log(rect.x + rect.y + rect.width + rect.height); // 175
```

### Property Override Rules

**Last value wins**:

```javascript
let o = { x: 1 };

let p = { x: 0, ...o };
console.log(p.x); // 1 (value from o overrides initial value)

let q = { ...o, x: 2 };
console.log(q.x); // 2 (value 2 overrides value from o)
```

### Spread Only Copies Own Properties

```javascript
let parent = { x: 1 };
let child = Object.create(parent); // child inherits x

let copy = { ...child };
console.log(copy.x); // undefined (inherited properties not spread)
```

### Performance Considerations

**O(n) operation** - Spreading n properties is O(n) time:

```javascript
// ❌ BAD: O(n²) - inefficient!
let result = {};
for (let obj of manyObjects) {
  result = { ...result, ...obj }; // Creates new object each iteration
}

// ✅ GOOD: O(n) - use Object.assign
let result = {};
for (let obj of manyObjects) {
  Object.assign(result, obj); // Modifies in place
}
```

### Practical Uses

**Merging objects**:

```javascript
let defaults = { timeout: 5000, retries: 3 };
let userConfig = { timeout: 10000 };
let config = { ...defaults, ...userConfig };
// { timeout: 10000, retries: 3 }
```

**Shallow copying**:

```javascript
let original = { a: 1, b: 2 };
let copy = { ...original };
copy.a = 99;
console.log(original.a); // 1 (original unchanged)
```

---

## 5. Shorthand Methods

Define methods in object literals without `function` keyword (ES6+).

### Before ES6

```javascript
let square = {
  area: function () {
    return this.side * this.side;
  },
  side: 10,
};
square.area(); // 100
```

### **ES6+ Shorthand**

```javascript
let square = {
  area() {
    return this.side * this.side;
  },
  side: 10,
};
square.area(); // 100
```

**Benefits**: Clearer distinction between methods and data properties.

### Advanced Method Names

Methods can use any valid property name syntax:

```javascript
const METHOD_NAME = 'm';
const symbol = Symbol();

let weirdMethods = {
  'method With Spaces'(x) {
    return x + 1;
  },
  [METHOD_NAME](x) {
    // Computed name
    return x + 2;
  },
  [symbol](x) {
    // Symbol name
    return x + 3;
  },
};

console.log(weirdMethods['method With Spaces'](1)); // 2
console.log(weirdMethods[METHOD_NAME](1)); // 3
console.log(weirdMethods[symbol](1)); // 4
```

---

## 6. Property Getters and Setters

Create **accessor properties** that execute functions when accessed or modified.

### Basic Syntax

```javascript
let o = {
  dataProp: value, // Regular data property

  get accessorProp() {
    // Getter
    return this.dataProp;
  },

  set accessorProp(value) {
    // Setter
    this.dataProp = value;
  },
};
```

### How They Work

- **Getter**: Called when property is read (no arguments)
- **Setter**: Called when property is written (one argument: the new value)
- **Read/write**: Has both getter and setter
- **Read-only**: Has only getter
- **Write-only**: Has only setter (rare)

### Practical Example: Cartesian ↔ Polar Coordinates

```javascript
let p = {
  // Data properties
  x: 1.0,
  y: 1.0,

  // Read-write accessor: radius
  get r() {
    return Math.hypot(this.x, this.y);
  },
  set r(newValue) {
    let oldValue = Math.hypot(this.x, this.y);
    let ratio = newValue / oldValue;
    this.x *= ratio;
    this.y *= ratio;
  },

  // Read-only accessor: angle
  get theta() {
    return Math.atan2(this.y, this.x);
  },
};

console.log(p.r); // Math.SQRT2 (computed from x and y)
console.log(p.theta); // Math.PI / 4

p.r = 2; // Updates x and y proportionally
console.log(p.x, p.y); // New values maintaining the same angle
```

### Accessor Inheritance

Accessors are inherited like data properties:

```javascript
let q = Object.create(p); // Inherits getters and setters
q.x = 3;
q.y = 4;
console.log(q.r); // 5 (inherited accessor works!)
console.log(q.theta); // Math.atan2(4, 3)
```

### **Use Cases**

**1. Validation**:

```javascript
const serialNumber = {
  _n: 0,

  get next() {
    return this._n++;
  },

  set next(n) {
    if (n > this._n) {
      this._n = n;
    } else {
      throw new Error('serial number can only be set to a larger value');
    }
  },
};

serialNumber.next = 10;
console.log(serialNumber.next); // 10
console.log(serialNumber.next); // 11 (increments each read)
```

**2. Computed values**:

```javascript
const random = {
  get octet() {
    return Math.floor(Math.random() * 256);
  },
  get uint16() {
    return Math.floor(Math.random() * 65536);
  },
  get int16() {
    return Math.floor(Math.random() * 65536) - 32768;
  },
};

console.log(random.octet); // Random 0-255
console.log(random.uint16); // Random 0-65535
console.log(random.int16); // Random -32768 to 32767
```

**3. Backward compatibility**:

```javascript
let user = {
  firstName: 'John',
  lastName: 'Doe',

  // Deprecated property with accessor
  get name() {
    console.warn('user.name is deprecated, use firstName/lastName');
    return `${this.firstName} ${this.lastName}`;
  },
};
```

---

## Summary Comparison

| Feature                  | Syntax                             | Purpose                                        |
| ------------------------ | ---------------------------------- | ---------------------------------------------- |
| **Shorthand Properties** | `{ x, y }`                         | Avoid repetition when variable = property name |
| **Computed Properties**  | `{ [expr]: value }`                | Dynamic property names at runtime              |
| **Symbol Properties**    | `{ [symbol]: value }`              | Unique, non-conflicting property names         |
| **Spread Operator**      | `{ ...obj }`                       | Copy properties from existing objects          |
| **Shorthand Methods**    | `{ method() {} }`                  | Define methods without `function` keyword      |
| **Getters/Setters**      | `get prop() {}` / `set prop(v) {}` | Computed or validated properties               |

---

## Key Concepts

✅ **Shorthand properties** eliminate redundancy when names match
✅ **Computed properties** enable dynamic property names in literals
✅ **Symbols** provide unique property names for safe extension
✅ **Spread operator** copies own properties (not inherited)
✅ **Shorthand methods** make method definitions cleaner
✅ **Getters/setters** create accessor properties with custom behavior
✅ All features work together (e.g., computed names with getters)
✅ Performance matters: avoid spreading in loops (O(n²) risk)
✅ Accessors are inherited and use `this` context
✅ Symbols prevent accidental conflicts, not malicious access
