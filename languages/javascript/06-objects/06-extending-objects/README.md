# JavaScript Extending Objects

**Extending objects** means copying properties from one or more source objects into a target object. This is a fundamental operation in JavaScript for merging configurations, setting defaults, and combining object properties.

---

## Basic Manual Extension

### Using a Loop

The traditional way to copy properties:

```javascript
let target = { x: 1 };
let source = { y: 2, z: 3 };

for (let key of Object.keys(source)) {
  target[key] = source[key];
}

console.log(target); // { x: 1, y: 2, z: 3 }
```

**What happens**:

- Iterates over all enumerable own properties of `source`
- Copies each property to `target`
- Target is modified directly

---

## Object.assign() - ES6

The standard way to extend objects in modern JavaScript.

### Syntax

```javascript
Object.assign(target, source1, source2, ...sourceN);
```

### Basic Usage

```javascript
let target = { x: 1 };
let source = { y: 2, z: 3 };

Object.assign(target, source);
console.log(target); // { x: 1, y: 2, z: 3 }
```

### Multiple Sources

```javascript
let target = { x: 1 };
let source1 = { y: 2 };
let source2 = { z: 3 };

Object.assign(target, source1, source2);
console.log(target); // { x: 1, y: 2, z: 3 }
```

### Key Characteristics

✅ **Modifies and returns** the first argument (target)
✅ **Does not alter** source objects
✅ **Copies enumerable own properties** (including Symbol properties)
✅ **Processes sources in order** - later sources override earlier ones
✅ **Overwrites existing properties** in target

### Property Override Behavior

```javascript
Object.assign(
  { x: 1 }, // target
  { x: 2, y: 2 }, // source1 overrides x
  { y: 3, z: 4 } // source2 overrides y
);
// Result: { x: 2, y: 3, z: 4 }
```

**Order matters**: Properties from later sources override those from earlier sources.

### Getters and Setters

`Object.assign()` uses ordinary property get/set operations:

```javascript
let source = {
  get value() {
    return this._value;
  },
};

let target = {};
Object.assign(target, source);

// The getter is INVOKED and its return value is copied
// The getter function itself is NOT copied
console.log(target.value); // undefined (no getter in target)
```

**Important**: Getters/setters are **invoked** during copy, but **not copied** themselves.

---

## Common Patterns and Use Cases

### 1. Cloning Objects (Shallow Copy)

```javascript
let original = { x: 1, y: 2 };
let clone = Object.assign({}, original);

console.log(clone); // { x: 1, y: 2 }
console.log(clone === original); // false (different objects)
```

### 2. Merging Multiple Objects

```javascript
let obj1 = { a: 1 };
let obj2 = { b: 2 };
let obj3 = { c: 3 };

let merged = Object.assign({}, obj1, obj2, obj3);
console.log(merged); // { a: 1, b: 2, c: 3 }
```

### 3. Setting Defaults (Wrong Way)

❌ **This overwrites everything**:

```javascript
let options = { timeout: 1000 };
let defaults = { timeout: 5000, retries: 3 };

Object.assign(options, defaults);
// Result: { timeout: 5000, retries: 3 }
// Lost the custom timeout!
```

### 4. Setting Defaults (Correct Way)

✅ **Copy defaults first, then override**:

```javascript
let options = { timeout: 1000 };
let defaults = { timeout: 5000, retries: 3 };

options = Object.assign({}, defaults, options);
// Result: { timeout: 1000, retries: 3 }
// Defaults filled in, custom values preserved
```

**How it works**:

1. Create empty object `{}`
2. Copy `defaults` → `{ timeout: 5000, retries: 3 }`
3. Copy `options` → overrides `timeout` to `1000`

---

## Spread Operator (...) - ES2018

A more concise alternative to `Object.assign()`.

### Basic Syntax

```javascript
let obj1 = { x: 1 };
let obj2 = { y: 2 };

let merged = { ...obj1, ...obj2 };
console.log(merged); // { x: 1, y: 2 }
```

### Setting Defaults with Spread

```javascript
let defaults = { timeout: 5000, retries: 3 };
let options = { timeout: 1000 };

let config = { ...defaults, ...options };
// Result: { timeout: 1000, retries: 3 }
```

### Spread vs Object.assign()

| Feature             | Object.assign()           | Spread Operator   |
| ------------------- | ------------------------- | ----------------- |
| **Syntax**          | `Object.assign({}, a, b)` | `{ ...a, ...b }`  |
| **Mutates target?** | Yes (first arg)           | No (creates new)  |
| **Readability**     | More verbose              | More concise      |
| **Performance**     | Slightly faster           | Slightly slower   |
| **Use case**        | Mutate existing object    | Create new object |

---

## Custom Merge Functions

### merge() - Only Add Missing Properties

Unlike `Object.assign()`, this function **doesn't override** existing properties:

```javascript
function merge(target, ...sources) {
  for (let source of sources) {
    for (let key of Object.keys(source)) {
      if (!(key in target)) {
        // Only if property doesn't exist
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Comparison
Object.assign({ x: 1 }, { x: 2, y: 2 }, { y: 3, z: 4 });
// Result: { x: 2, y: 3, z: 4 } - x and y overridden

merge({ x: 1 }, { x: 2, y: 2 }, { y: 3, z: 4 });
// Result: { x: 1, y: 2, z: 4 } - x and y preserved
```

**Use case**: Filling in defaults without overwriting user-provided values.

### Other Utility Functions

#### restrict() - Keep Only Allowed Properties

```javascript
function restrict(target, template) {
  for (let key of Object.keys(target)) {
    if (!(key in template)) {
      delete target[key];
    }
  }
  return target;
}

let obj = { x: 1, y: 2, z: 3 };
let template = { x: 0, y: 0 };

restrict(obj, template);
// Result: { x: 1, y: 2 } - z removed
```

#### subtract() - Remove Properties

```javascript
function subtract(target, source) {
  for (let key of Object.keys(source)) {
    delete target[key];
  }
  return target;
}

let obj = { x: 1, y: 2, z: 3 };
let toRemove = { y: 0, z: 0 };

subtract(obj, toRemove);
// Result: { x: 1 } - y and z removed
```

---

## Deep vs Shallow Copying

### Shallow Copy (Default Behavior)

Both `Object.assign()` and spread operator perform **shallow copies**:

```javascript
let original = {
  name: 'John',
  address: { city: 'NYC' },
};

let copy = { ...original };

copy.address.city = 'LA';
console.log(original.address.city); // 'LA' (modified!)
```

**Problem**: Nested objects are copied by reference, not value.

### Deep Copy Solutions

#### 1. JSON Method (Simple Objects Only)

```javascript
let deepCopy = JSON.parse(JSON.stringify(original));
```

**Limitations**:

- Loses functions, undefined, Symbols
- Doesn't handle Date, RegExp, Map, Set
- Doesn't preserve prototype chain

#### 2. Recursive Function

```javascript
function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  let copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}
```

#### 3. structuredClone() - Modern Browsers

```javascript
let deepCopy = structuredClone(original);
```

---

## Practical Examples

### Example 1: Configuration Merging

```javascript
function createConfig(userOptions) {
  const defaults = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return { ...defaults, ...userOptions };
}

let config = createConfig({ timeout: 10000 });
// Result: { apiUrl: '...', timeout: 10000, retries: 3, headers: {...} }
```

### Example 2: Object Composition

```javascript
const canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  },
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  },
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  },
};

// Create a duck with multiple abilities
let duck = Object.assign({ name: 'Donald' }, canEat, canWalk, canSwim);

console.log(duck.eat('bread'));
console.log(duck.swim());
```

### Example 3: Updating State (Immutable)

```javascript
let state = {
  user: 'Alice',
  isLoggedIn: false,
  theme: 'dark',
};

// Create new state instead of mutating
let newState = {
  ...state,
  isLoggedIn: true,
};

console.log(state.isLoggedIn); // false (unchanged)
console.log(newState.isLoggedIn); // true (new object)
```

---

## Best Practices

✅ **Use spread operator** for creating new objects (more readable)
✅ **Use Object.assign()** when you need to mutate the target
✅ **Order matters** - place more specific sources last to override defaults
✅ **Be aware of shallow copying** - nested objects need special handling
✅ **Consider custom merge functions** for specific behaviors
✅ **Use Object.assign({}, ...)** or spread to avoid mutating originals
✅ **Validate merged objects** to ensure required properties exist

---

## Key Concepts Summary

📌 **Object.assign()** copies enumerable own properties from sources to target
📌 **Target is modified** and returned; sources remain unchanged
📌 **Later sources override** earlier sources for duplicate properties
📌 **Spread operator (...)** provides cleaner syntax for creating new objects
📌 **Shallow copy only** - nested objects are referenced, not cloned
📌 **Getters/setters are invoked** but not copied themselves
📌 **Custom merge functions** provide specialized extension behavior
📌 **Common pattern**: `{ ...defaults, ...userOptions }` for setting defaults
📌 **Symbol properties** are copied by Object.assign()
📌 **Use `{}` as first argument** to avoid mutating existing objects
