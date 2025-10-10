# JavaScript Property Access Expressions

## Overview

Property access expressions evaluate to the value of an object property or array element. They are fundamental to working with objects and arrays in JavaScript.

---

## Two Main Syntaxes

### 1. Dot Notation

```javascript
expression.identifier;
```

### 2. Bracket Notation

```javascript
expression[expression];
```

---

## Detailed Explanation

### Dot Notation (`.`)

- Expression specifies the object
- Identifier specifies the property name
- **Requirements:**
  - Property name must be a legal identifier
  - Property name must be known at write-time
  - Cannot contain spaces, punctuation, or start with numbers

### Bracket Notation (`[]`)

- First expression specifies the object/array
- Second expression (in brackets) specifies property name or array index
- **Use cases:**
  - Property names with spaces or punctuation
  - Numeric property names (arrays)
  - Dynamic property names (computed at runtime)
  - Property names that are the result of computation

---

## Practical Examples

```javascript
let o = { x: 1, y: { z: 3 } }; // Example object
let a = [o, 4, [5, 6]]; // Example array containing the object

// Dot notation
o.x; // => 1: property x of object o
o.y.z; // => 3: property z of o.y (nested access)

// Bracket notation
o['x']; // => 1: same as o.x
a[1]; // => 4: element at index 1
a[2]['1']; // => 6: element at index 1 of a[2]
a[0].x; // => 1: property x of a[0] (which is object o)
```

---

## How Property Access Works

### Evaluation Process

1. **First evaluation:** The expression before `.` or `[` is evaluated
2. **Null/Undefined check:** If value is `null` or `undefined`, throws `TypeError`
3. **Property lookup:**
   - **Dot notation:** Looks up property by identifier name
   - **Bracket notation:** Evaluates expression inside brackets, converts to string, then looks up property
4. **Return value:**
   - If property exists: returns property value
   - If property doesn't exist: returns `undefined`

---

## Conditional Property Access (ES2020)

### New Syntaxes

```javascript
expression?.identifier;
expression?.[expression];
```

### Purpose

Guards against `TypeError` when accessing properties of `null` or `undefined` values.

### How It Works

```javascript
let a = { b: null };

// Regular access - would throw TypeError
// a.b.c.d  // TypeError!

// Conditional access - returns undefined safely
a.b?.c.d; // => undefined (no error)
```

### Optional Chaining Behavior

**Key concept:** Optional chaining is **"short-circuiting"**

```javascript
let a = { b: null };

a.b?.c.d(
  // => undefined (short-circuits after a.b)
  a.b?.c
).d; // => TypeError (parentheses force evaluation)
```

When `?.` encounters `null` or `undefined`:

- Entire expression immediately evaluates to `undefined`
- No further property access attempts
- Subsequent expressions aren't evaluated

### Multiple Conditional Accesses

```javascript
let a = { b: {} };
a.b?.c?.d; // => undefined (safely checks multiple levels)
```

### Conditional Bracket Notation

```javascript
let a; // undefined variable
let index = 0;

// Regular bracket - throws error and evaluates expression
try {
  a[index++]; // Throws TypeError
} catch (e) {
  index; // => 1 (increment happened before error)
}

// Conditional bracket - short-circuits safely
a?.[index++]; // => undefined
index; // => 1 (expression not evaluated due to short-circuit)

a[index++]; // TypeError: can't index undefined
```

### Side Effects and Short-Circuiting

If the left side of `?.[]` is `null` or `undefined`:

- Entire expression returns `undefined`
- Expressions inside brackets are **never evaluated**
- Side effects (like `index++`) don't occur

---

## Important Error Cases

### TypeError Scenarios

```javascript
let obj = null;

obj.property; // TypeError: null has no properties
obj['property']; // TypeError: null has no properties

// But these are safe:
obj?.property; // undefined (no error)
obj?.['property']; // undefined (no error)
```

**Remember:** Only `null` and `undefined` cannot have properties in JavaScript. All other values can.

---

## When to Use Each Syntax

### Use Dot Notation (`.`) when

- Property name is a valid identifier
- Property name is known at write-time
- Code readability is priority

### Use Bracket Notation (`[]`) when

- Property name contains special characters or spaces
- Property name is numeric (arrays)
- Property name is dynamic/computed
- Property name comes from a variable

### Use Conditional Access (`?.` / `?.[]`) when

- Value might be `null` or `undefined`
- You want to avoid TypeError checks
- Working with optional/nullable data structures
- Accessing deeply nested properties safely

---

## Browser Support

As of early 2020, conditional property access (`?.` and `?.[]`) is supported in current or beta versions of most major browsers. It's now (2025) widely supported across all modern browsers.

---

## Related Topics

- **Objects and properties:** Chapter 6 (detailed coverage)
- **Arrays and elements:** Chapter 7 (detailed coverage)
- **Dynamic property access:** §6.3.1
