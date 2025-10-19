# JavaScript: Adding Methods to Existing Classes

## Core Concept

JavaScript's **prototype-based inheritance is dynamic**: objects inherit properties from their prototype even if the prototype changes after object creation. This allows you to **augment JavaScript classes** by adding new methods to their prototype objects.

---

## Adding Methods to Custom Classes

You can extend your own classes by adding methods to their prototype:

### Example: Complex Number Class

```javascript
// Original class
class Complex {
  constructor(real, imaginary) {
    this.r = real;
    this.i = imaginary;
  }
}

// Add a method to compute complex conjugate
Complex.prototype.conj = function () {
  return new Complex(this.r, -this.i);
};

// Usage
let c = new Complex(3, 4);
let conjugate = c.conj(); // Returns Complex(3, -4)
```

**Key point**: The method is added to `Complex.prototype`, making it available to all Complex instances, even those created before the method was added.

---

## Adding Methods to Built-in Classes

JavaScript allows you to add methods to **built-in prototypes** like String, Number, Array, and Function.

### String Extension Example

Implementing new features in older JavaScript versions:

```javascript
// Check if the method already exists
if (!String.prototype.startsWith) {
  // Define it using older methods
  String.prototype.startsWith = function (s) {
    return this.indexOf(s) === 0;
  };
}

// Usage
let str = 'Hello World';
console.log(str.startsWith('Hello')); // true
```

### Number Extension Example

Creating a custom iteration method:

```javascript
// Invoke a function n times
Number.prototype.times = function (f, context) {
  let n = this.valueOf();
  for (let i = 0; i < n; i++) {
    f.call(context, i);
  }
};

// Usage
let n = 3;
n.times((i) => {
  console.log(`hello ${i}`);
});
// Output:
// hello 0
// hello 1
// hello 2
```

---

## Why This Works

### Dynamic Inheritance

```javascript
function MyClass() {
  this.value = 10;
}

let obj = new MyClass();

// Add method AFTER object creation
MyClass.prototype.double = function () {
  return this.value * 2;
};

// Object still has access to new method
console.log(obj.double()); // 20
```

**Explanation**: `obj` maintains a reference to `MyClass.prototype`, so any changes to the prototype are immediately available.

---

## Important Warnings

### ⚠️ Modifying Built-in Prototypes is Generally Bad Practice

**Reasons to avoid**:

1. **Future compatibility issues**: If a future JavaScript version adds a method with the same name, your code will break or cause conflicts

2. **Confusion for other developers**: Non-standard methods make code harder to understand and maintain

3. **Library conflicts**: Multiple libraries might define the same method differently

4. **Unexpected behavior**: Can break third-party code that doesn't expect modified prototypes

### Example of Potential Conflict

```javascript
// Your code
Array.prototype.first = function () {
  return this[0];
};

// Future JavaScript adds Array.prototype.first with different behavior
// Your code breaks!
```

---

## The Object.prototype Problem

### Never Modify Object.prototype

Adding methods to `Object.prototype` is **especially problematic**:

```javascript
// BAD PRACTICE - Don't do this!
Object.prototype.myMethod = function () {
  return 'custom method';
};

let obj = { name: 'Alice', age: 30 };

// Properties from Object.prototype appear in for...in loops!
for (let key in obj) {
  console.log(key);
}
// Output:
// name
// age
// myMethod  <-- PROBLEM!
```

### Why This is Dangerous

1. **Pollutes all objects**: Every object in JavaScript inherits from `Object.prototype`
2. **Breaks for...in loops**: Added properties are enumerable by default
3. **Breaks external libraries**: Most code doesn't expect Object.prototype modifications

---

## Safe Alternative: Non-Enumerable Properties

If you **must** add to built-in prototypes, use `Object.defineProperty()` to make properties non-enumerable:

```javascript
// Safer approach (but still not recommended)
Object.defineProperty(String.prototype, 'reverse', {
  value: function () {
    return this.split('').reverse().join('');
  },
  enumerable: false, // Won't appear in for...in
  writable: true,
  configurable: true,
});

// Usage
console.log('hello'.reverse()); // "olleh"

// Won't pollute enumeration
let str = 'test';
for (let prop in str) {
  console.log(prop); // 'reverse' won't appear
}
```

---

## Best Practices

### ✅ DO: Extend Your Own Classes

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}

// Safe - your own class
User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

### ✅ DO: Polyfill Missing Features

Add missing methods **only if they don't exist**:

```javascript
if (!Array.prototype.includes) {
  Array.prototype.includes = function (element) {
    return this.indexOf(element) !== -1;
  };
}
```

### ✅ DO: Use Utility Functions Instead

```javascript
// Instead of: String.prototype.reverse = function() {...}
// Use a utility function:
function reverseString(str) {
  return str.split('').reverse().join('');
}

console.log(reverseString('hello')); // "olleh"
```

### ✅ DO: Use Modern Alternatives

```javascript
// Instead of modifying Number.prototype
function times(n, callback) {
  for (let i = 0; i < n; i++) {
    callback(i);
  }
}

times(3, (i) => console.log(`hello ${i}`));
```

### ❌ DON'T: Modify Built-in Prototypes in Production

```javascript
// AVOID in production code
String.prototype.shout = function () {
  return this.toUpperCase() + '!!!';
};
```

### ❌ DON'T: Ever Modify Object.prototype

```javascript
// NEVER DO THIS
Object.prototype.customMethod = function () {
  // This breaks everything
};
```

---

## When It's Acceptable

### 1. Polyfills for Older Browsers

```javascript
// Implementing ES6 features in ES5 environments
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
}
```

### 2. Private/Internal Projects

Where you control all code and dependencies:

```javascript
// In a closed environment
Number.prototype.isEven = function () {
  return this % 2 === 0;
};
```

### 3. Educational/Experimental Code

For learning purposes or prototyping:

```javascript
// Experimenting with language features
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
```

---

## Modern Alternatives

### Use Classes and Inheritance

```javascript
class ExtendedArray extends Array {
  first() {
    return this[0];
  }

  last() {
    return this[this.length - 1];
  }
}

let arr = new ExtendedArray(1, 2, 3);
console.log(arr.first()); // 1
console.log(arr.last()); // 3
```

### Use Composition

```javascript
class StringUtils {
  static reverse(str) {
    return str.split('').reverse().join('');
  }

  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

console.log(StringUtils.reverse('hello'));
console.log(StringUtils.capitalize('world'));
```

---

## Key Concepts Summary

✅ **Prototype inheritance is dynamic** - changes affect all instances
✅ **You can add methods to any prototype** - including built-in classes
⚠️ **Modifying built-in prototypes is risky** - causes compatibility issues
⚠️ **Never modify Object.prototype** - breaks for...in loops and everything else
✅ **Use `Object.defineProperty()`** for non-enumerable properties if needed
✅ **Polyfills are acceptable** - but check if method exists first
✅ **Prefer utility functions** or **class extension** over prototype modification
✅ **Always check before adding** - `if (!Type.prototype.method)`

---

## Decision Flow Chart

**Should I add a method to a built-in prototype?**

1. Is it a polyfill for a standard feature? → **Yes, but check if exists first**
2. Is it for your own custom class? → **Yes, safe to do**
3. Is it for production code? → **No, use utility functions instead**
4. Is it for Object.prototype? → **Absolutely not, never do this**
5. Can you use class extension instead? → **Yes, prefer that approach**
