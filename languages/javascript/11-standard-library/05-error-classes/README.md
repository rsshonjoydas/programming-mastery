# JavaScript Error Classes

## Overview

JavaScript's `throw` and `catch` statements can work with **any JavaScript value** (primitives or objects), but it's **traditional and recommended** to use `Error` objects or their subclasses for error handling.

## Why Use Error Objects?

When you create an Error object, it **captures the JavaScript stack state**:

✅ **Stack traces** are displayed for uncaught exceptions
✅ Helps with **debugging** by showing where the error occurred
✅ Shows where the Error object was **created** (not where it was thrown)
✅ Best practice: Create Error objects immediately before throwing them

```javascript
throw new Error('Something went wrong'); // Create and throw together
```

---

## The Error Class

### Properties

| Property      | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| **`message`** | Error description (passed to constructor)                               |
| **`name`**    | Error type name (always `"Error"` for base Error class)                 |
| **`stack`**   | Stack trace (non-standard but widely supported in Node.js and browsers) |

### Methods

- **`toString()`**: Returns `name + ": " + message`

### Basic Usage

```javascript
let error = new Error('Operation failed');

console.log(error.message); // "Operation failed"
console.log(error.name); // "Error"
console.log(error.toString()); // "Error: Operation failed"
console.log(error.stack); // Multi-line stack trace (Node/browsers)
```

### Creating and Throwing Errors

```javascript
try {
  throw new Error('Something went wrong');
} catch (e) {
  console.log(e.message); // "Something went wrong"
  console.log(e.name); // "Error"
  console.log(e.stack); // Stack trace
}
```

---

## Built-in Error Subclasses

JavaScript defines **six standard error subclasses** for specific error types:

| Error Class          | When It's Used                              |
| -------------------- | ------------------------------------------- |
| **`EvalError`**      | Errors with `eval()` function (rarely used) |
| **`RangeError`**     | Value not in allowed range                  |
| **`ReferenceError`** | Invalid reference (undefined variable)      |
| **`SyntaxError`**    | Syntax parsing errors                       |
| **`TypeError`**      | Value is not of expected type               |
| **`URIError`**       | Errors in `encodeURI()` or `decodeURI()`    |

### Examples of Built-in Errors

```javascript
// RangeError: Number outside valid range
let arr = new Array(-1); // RangeError: Invalid array length

// ReferenceError: Variable doesn't exist
console.log(undefinedVariable); // ReferenceError: undefinedVariable is not defined

// SyntaxError: Invalid syntax
eval('let x = ;'); // SyntaxError: Unexpected token ';'

// TypeError: Wrong type operation
null.toString(); // TypeError: Cannot read property 'toString' of null

// URIError: Invalid URI component
decodeURIComponent('%'); // URIError: URI malformed
```

### Using Built-in Error Classes

```javascript
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  if (b === 0) {
    throw new RangeError('Division by zero');
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (e) {
  console.log(e.name); // "RangeError"
  console.log(e.message); // "Division by zero"
}
```

### Subclass Properties

Each subclass has:

- A **constructor** that takes a single `message` argument
- A **`name` property** matching the constructor name

```javascript
let error = new TypeError('Expected a string');
console.log(error.name); // "TypeError"
console.log(error.message); // "Expected a string"
```

---

## Creating Custom Error Classes

You can (and should) create custom error subclasses for domain-specific errors.

### Basic Custom Error

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  throw new ValidationError('Invalid email format');
} catch (e) {
  console.log(e.name); // "ValidationError"
  console.log(e.message); // "Invalid email format"
}
```

### Custom Error with Additional Properties

Add properties beyond `name` and `message` to provide more context:

```javascript
class HTTPError extends Error {
  constructor(status, statusText, url) {
    super(`${status} ${statusText}: ${url}`);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }

  get name() {
    return 'HTTPError';
  }
}

let error = new HTTPError(404, 'Not Found', 'http://example.com/');

console.log(error.status); // 404
console.log(error.statusText); // "Not Found"
console.log(error.url); // "http://example.com/"
console.log(error.message); // "404 Not Found: http://example.com/"
console.log(error.name); // "HTTPError"
```

### More Custom Error Examples

**ParseError with location information**:

```javascript
class ParseError extends Error {
  constructor(message, line, column) {
    super(message);
    this.name = 'ParseError';
    this.line = line;
    this.column = column;
  }
}

let parseError = new ParseError('Unexpected token', 42, 15);
console.log(
  `${parseError.name} at line ${parseError.line}, column ${parseError.column}`
);
// "ParseError at line 42, column 15"
```

**DatabaseError with query details**:

```javascript
class DatabaseError extends Error {
  constructor(message, query, code) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.code = code;
  }
}

try {
  throw new DatabaseError(
    'Connection timeout',
    'SELECT * FROM users',
    'ETIMEDOUT'
  );
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
  console.log(`Query: ${e.query}`);
  console.log(`Code: ${e.code}`);
}
```

---

## The Stack Property

The **`stack` property** contains a multi-line string with the call stack at the moment the Error was created.

**Note**: Not part of ECMAScript standard, but supported by Node.js and all modern browsers.

### Stack Trace Example

```javascript
function a() {
  b();
}
function b() {
  c();
}
function c() {
  throw new Error('Stack trace example');
}

try {
  a();
} catch (e) {
  console.log(e.stack);
}

// Output (example):
// Error: Stack trace example
//     at c (file.js:3:9)
//     at b (file.js:2:14)
//     at a (file.js:1:14)
//     at file.js:7:3
```

### Logging Unexpected Errors

```javascript
try {
  // Some risky operation
  riskyOperation();
} catch (e) {
  console.error('Unexpected error occurred:');
  console.error(e.stack); // Log full stack trace for debugging
}
```

---

## Error Handling Patterns

### Catching Specific Error Types

```javascript
try {
  riskyOperation();
} catch (e) {
  if (e instanceof TypeError) {
    console.log('Type error:', e.message);
  } else if (e instanceof RangeError) {
    console.log('Range error:', e.message);
  } else if (e instanceof HTTPError) {
    console.log(`HTTP ${e.status}: ${e.message}`);
  } else {
    throw e; // Re-throw unknown errors
  }
}
```

### Validation with Custom Errors

```javascript
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('email', 'Email is required');
  }
  if (!user.email.includes('@')) {
    throw new ValidationError('email', 'Invalid email format');
  }
  if (user.age < 18) {
    throw new ValidationError('age', 'Must be 18 or older');
  }
}

try {
  validateUser({ email: 'invalid', age: 15 });
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Validation failed for ${e.field}: ${e.message}`);
  }
}
```

---

## Best Practices

✅ **Always use Error objects** (not primitives) when throwing errors
✅ **Create Error immediately before throwing**: `throw new Error(...)`
✅ **Use built-in error classes** when appropriate (TypeError, RangeError, etc.)
✅ **Create custom error classes** for domain-specific errors
✅ **Add contextual properties** to custom errors (status codes, line numbers, etc.)
✅ **Include descriptive messages** in error constructors
✅ **Log stack traces** for debugging unexpected errors
✅ **Catch specific error types** using `instanceof` checks
✅ **Override the `name` property** in custom error classes
✅ **Call `super(message)`** in custom error constructors

---

## Key Concepts Summary

📌 **Error objects capture stack traces** for debugging
📌 **Base Error class** has `message`, `name`, and `stack` properties
📌 **Six built-in subclasses**: EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
📌 **Custom error classes** should extend Error and add domain-specific properties
📌 **Stack property** shows call stack (non-standard but widely supported)
📌 **Create errors immediately** before throwing to ensure accurate stack traces
📌 **Use `instanceof`** to catch specific error types
📌 **Custom properties** provide additional error context
📌 **`toString()` method** returns formatted error string
📌 **All error subclasses** follow the same constructor pattern (single message argument)
