# JavaScript `throw` Statement

The `throw` statement allows you to create and throw custom errors in JavaScript.

## Basic Syntax

```javascript
throw expression;
```

## Common Usage

**1. Throwing a string:**

```javascript
throw 'Something went wrong!';
```

**2. Throwing a number:**

```javascript
throw 404;
```

**3. Throwing an Error object (recommended):**

```javascript
throw new Error('This is an error message');
```

**4. Throwing specific error types:**

```javascript
throw new TypeError('Expected a string');
throw new RangeError('Value out of range');
throw new ReferenceError('Variable not defined');
```

## Example with try-catch

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

try {
  let result = divide(10, 0);
} catch (error) {
  console.log(error.message); // "Cannot divide by zero"
}
```

## Key Points

- `throw` **stops execution** of the current function immediately
- The thrown value can be caught with a `try-catch` block
- If not caught, it will terminate the program with an unhandled error
- Best practice: throw `Error` objects rather than primitives for better stack traces
