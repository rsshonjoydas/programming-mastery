# Truthy and Falsy Values

## What Are Truthy and Falsy Values?

In JavaScript, every value has an inherent **boolean nature** when used in a boolean context (like in `if` statements, loops, or logical operations). Values are either **truthy** (act like `true`) or **falsy** (act like `false`).

## The Falsy Values (Only 8!)

These are **ALL** the falsy values in JavaScript. Memorize them:

1. **`false`** - the boolean false
2. **`0`** - the number zero
3. **`-0`** - negative zero
4. **`0n`** - BigInt zero
5. **`""`** - empty string (also `''` or ` `` `)
6. **`null`** - represents no value
7. **`undefined`** - uninitialized or missing value
8. **`NaN`** - Not a Number

```javascript
if (false) {
  /* won't run */
}
if (0) {
  /* won't run */
}
if ('') {
  /* won't run */
}
if (null) {
  /* won't run */
}
if (undefined) {
  /* won't run */
}
if (NaN) {
  /* won't run */
}
```

## Truthy Values

**Everything else** is truthy! This includes:

- **All non-zero numbers**: `1`, `-5`, `3.14`, `Infinity`
- **All non-empty strings**: `"hello"`, `"0"`, `"false"`, `" "` (even space!)
- **All objects**: `{}`, `[]`, `[0]`, `{ }`, `new Date()`
- **All functions**: `function() {}`
- **The boolean**: `true`

```javascript
if (true) {
  /* runs */
}
if (1) {
  /* runs */
}
if ('hello') {
  /* runs */
}
if ('0') {
  /* runs - string, not number! */
}
if ('false') {
  /* runs - string, not boolean! */
}
if ([]) {
  /* runs - empty array is truthy! */
}
if ({}) {
  /* runs - empty object is truthy! */
}
if (function () {}) {
  /* runs */
}
```

## Common Gotchas

### 1. Empty Arrays and Objects are Truthy

```javascript
if ([]) {
  console.log('This runs!'); // Empty array is truthy
}

if ({}) {
  console.log('This runs too!'); // Empty object is truthy
}
```

### 2. String "0" and "false" are Truthy

```javascript
if ('0') {
  console.log("String '0' is truthy!"); // Runs!
}

if ('false') {
  console.log("String 'false' is truthy!"); // Runs!
}
```

### 3. Negative Numbers are Truthy

```javascript
if (-1) {
  console.log('Negative numbers are truthy'); // Runs!
}
```

## Practical Uses

### 1. Checking if a Variable Has a Value

```javascript
let username = getUserInput();

if (username) {
  console.log('Welcome, ' + username);
} else {
  console.log('Please enter a username');
}
```

### 2. Default Values with Logical OR (`||`)

```javascript
let name = userInput || 'Guest'; // If userInput is falsy, use "Guest"
let count = numberOfItems || 0;
```

### 3. Short-Circuit Evaluation

```javascript
// Only call function if user exists
user && user.save();

// Execute if not logged in
!isLoggedIn && redirectToLogin();
```

### 4. Filtering Arrays

```javascript
let values = [0, 1, false, 2, '', 3, null, 4, undefined, 5];
let truthyValues = values.filter(Boolean); // [1, 2, 3, 4, 5]
```

## Converting to Boolean

### Explicit Conversion

```javascript
Boolean(0); // false
Boolean(''); // false
Boolean('hello'); // true
Boolean([]); // true
Boolean({}); // true
```

### Double NOT Operator (`!!`)

```javascript
!!'hello'; // true
!!0; // false
!!''; // false
!![]; // true
!!null; // false
```

The first `!` converts to boolean and negates, the second `!` negates again, giving you the boolean value.

## Important Distinctions

### Falsy vs. False

```javascript
0 == false; // true (loose equality, type coercion)
0 === false; // false (strict equality, different types)
'' == false; // true
'' === false; // false
```

### Null vs. Undefined

```javascript
let a; // undefined (declared but not assigned)
let b = null; // null (explicitly set to "no value")

if (!a) {
} // Both are falsy
if (!b) {
} // Both are falsy

a == b; // true (loose equality)
a === b; // false (strict equality)
```

## Best Practices

1. **Be explicit when checking for specific values**

   ```javascript
   // Instead of:
   if (!value) {
   }

   // Be specific:
   if (value === null) {
   }
   if (value === undefined) {
   }
   if (value === '') {
   }
   ```

2. **Use strict equality (`===`) to avoid confusion**

   ```javascript
   if (x === 0) {
   } // Checks specifically for zero
   if (x === false) {
   } // Checks specifically for false
   ```

3. **Watch out for zero in numeric contexts**

   ```javascript
   let score = 0;
   if (score) {
     // Won't run because 0 is falsy!
   }

   // Better:
   if (score !== undefined) {
     // Runs correctly
   }
   ```

## Summary Table

| Value              | Truthy/Falsy |
| ------------------ | ------------ |
| `false`            | Falsy        |
| `0`, `-0`, `0n`    | Falsy        |
| `""`, `''`, ` `` ` | Falsy        |
| `null`             | Falsy        |
| `undefined`        | Falsy        |
| `NaN`              | Falsy        |
| Everything else    | Truthy       |

**Remember**: When in doubt, only 8 values are falsy. Everything else is truthy!
