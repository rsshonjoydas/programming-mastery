# JavaScript Invocation Expressions

## What Are Invocation Expressions?

An **invocation expression** is JavaScript's syntax for calling (or executing) a function or method. It consists of:

1. A function expression that identifies the function to be called
2. An open parenthesis `(`
3. A comma-separated list of zero or more argument expressions
4. A close parenthesis `)`

## Basic Syntax Examples

```javascript
f(0); // f is the function; 0 is the argument
Math.max(x, y, z); // Math.max is the function; x, y, and z are the arguments
a.sort(); // a.sort is the function; there are no arguments
```

## How Invocation Expressions Are Evaluated

When an invocation expression is evaluated, the following sequence occurs:

1. **Function expression is evaluated first** - JavaScript identifies which function to call
2. **Argument expressions are evaluated** - All arguments are evaluated to produce their values
3. **Type checking** - If the function expression's value is not a function, a `TypeError` is thrown
4. **Parameter assignment** - Argument values are assigned, in order, to the parameter names defined in the function
5. **Function body execution** - The body of the function is executed
6. **Return value** - If the function uses a `return` statement, that value becomes the value of the invocation expression. Otherwise, the value is `undefined`

### Example of Evaluation Order

```javascript
function add(a, b) {
  return a + b;
}

let x = 5;
add(x++, x++); // First x++ evaluates to 5, second x++ evaluates to 6
// Result: 11, and x is now 7
```

## Method Invocation

When the function expression is a **property access expression**, the invocation is called a **method invocation**.

### The `this` Keyword in Methods

In method invocations, the object or array that is the subject of the property access becomes the value of the `this` keyword while the function body executes. This is fundamental to object-oriented programming in JavaScript.

```javascript
let obj = {
  name: 'JavaScript',
  greet: function () {
    console.log('Hello from ' + this.name);
  },
};

obj.greet(); // "Hello from JavaScript"
// 'this' refers to obj
```

## Conditional Invocation (ES2020)

ES2020 introduced **optional chaining for function calls** using the `?.()` syntax.

### Normal vs Conditional Invocation

**Normal invocation (`()`):**

```javascript
myFunction(); // Throws TypeError if myFunction is null, undefined, or not a function
```

**Conditional invocation (`?.()`):**

```javascript
myFunction?.(); // Returns undefined if myFunction is null or undefined
// No exception thrown
```

### Practical Example

**Before ES2020:**

```javascript
function square(x, log) {
  if (log) {
    // Check if log exists
    log(x); // Then invoke it
  }
  return x * x;
}
```

**With ES2020:**

```javascript
function square(x, log) {
  log?.(x); // Only calls log if it exists
  return x * x;
}
```

### Important Limitation

`?.()` **only** checks for `null` or `undefined`. It does **not** verify that the value is actually a function.

```javascript
function square(x, log) {
  log?.(x);
  return x * x;
}

square(5, 42); // Still throws TypeError!
// 42 is not null/undefined, but it's not a function
```

## Short-Circuiting with Conditional Invocation

When using `?.()`, if the left side is `null` or `undefined`, **none of the argument expressions are evaluated**.

```javascript
let f = null,
  x = 0;

try {
  f(x++); // Throws TypeError, but x is incremented first
} catch (e) {
  console.log(x); // => 1
}

f?.(x++); // No error, returns undefined
console.log(x); // => 1 (x++ was never evaluated due to short-circuiting)
```

## Combining Conditional Access and Conditional Invocation

When working with methods, you can combine optional chaining for property access and function invocation:

```javascript
o.m(); // Regular property access, regular invocation
// o must have property m, and m must be a function

o?.m(); // Conditional property access, regular invocation
// If o is null/undefined, returns undefined
// Otherwise, o.m must be a function

o.m?.(); // Regular property access, conditional invocation
// o must exist, but m can be null/undefined
// If m is null/undefined, returns undefined
```

### Detailed Breakdown

1. **`o.m()`**

   - `o` must be an object with property `m`
   - `m` must be a function
   - Throws error if either condition fails

2. **`o?.m()`**

   - If `o` is `null` or `undefined`: returns `undefined`
   - If `o` exists: must have property `m` that is a function
   - Throws error if `m` is not a function

3. **`o.m?.()`**
   - `o` must not be `null` or `undefined`
   - If `m` doesn't exist or is `null`/`undefined`: returns `undefined`
   - Only calls `m()` if it exists

### Practical Examples

```javascript
let user = {
  name: 'Alice',
  greet: function () {
    return 'Hello!';
  },
};

user.greet(); // "Hello!"
user?.greet(); // "Hello!"
user.greet?.(); // "Hello!"

let nullUser = null;
nullUser.greet(); // TypeError
nullUser?.greet(); // undefined
nullUser?.greet?.(); // undefined

let userNoGreet = { name: 'Bob' };
userNoGreet.greet(); // TypeError
userNoGreet?.greet(); // TypeError (userNoGreet exists but has no greet)
userNoGreet.greet?.(); // undefined (safe!)
```

## Key Differences: Arguments vs Parameters

- **Parameters**: Variables listed in the function definition
- **Arguments**: Actual values passed when calling the function

```javascript
function add(a, b) {
  // a and b are parameters
  return a + b;
}

add(5, 3); // 5 and 3 are arguments
```

When the number of arguments doesn't match the number of parameters:

- Extra arguments are ignored
- Missing arguments become `undefined`

```javascript
function test(a, b, c) {
  console.log(a, b, c);
}

test(1, 2); // 1, 2, undefined
test(1, 2, 3, 4); // 1, 2, 3 (4 is ignored)
```

## Browser Support

Conditional invocation with `?.()` was introduced in ES2020. As of 2025, it has excellent support across all modern browsers and JavaScript environments including:

- Chrome/Edge
- Firefox
- Safari
- Node.js
- And all other modern JavaScript runtimes

## Summary

- **Invocation expressions** use `functionName(arguments)` syntax to call functions
- Evaluation order: function → arguments → type check → parameter assignment → execution → return
- **Method invocation** sets `this` to the object containing the method
- **Conditional invocation** (`?.()`) safely handles `null`/`undefined` without throwing errors
- `?.()` is **short-circuiting**: arguments aren't evaluated if the function is `null`/`undefined`
- Different combinations of `?.` can protect against missing objects or missing methods
- The number of arguments can differ from the number of parameters
