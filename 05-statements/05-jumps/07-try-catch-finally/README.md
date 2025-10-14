# JavaScript try-catch-finally Statements

The **try-catch-finally** statement is JavaScript's exception handling mechanism for managing errors and ensuring cleanup code executes.

## Syntax

```javascript
try {
  // Code that might throw an exception
} catch (e) {
  // Code to handle the exception
} finally {
  // Cleanup code that always executes
}
```

**Important**: The curly braces are **required** and cannot be omitted, even for single statements. A `try` block must be accompanied by at least one `catch` or `finally` block.

## How Each Block Works

**`try` block**:

- Contains code that might throw an exception
- Can throw exceptions directly with `throw` or indirectly by calling methods
- If an exception occurs, execution immediately jumps to the `catch` block

**`catch` block**:

- Executes only if an exception is thrown in the `try` block
- The catch parameter (e.g., `e`) is a block-scoped identifier that holds the exception value (usually an Error object)
- Can handle the exception, ignore it, or rethrow it
- **ES2019+**: The parameter is optional—you can use bare `catch` without parentheses

**`finally` block**:

- **Always executes** if any portion of the `try` block executes, regardless of how it completes:
  1. Normal completion (reaching the end)
  2. Via `break`, `continue`, or `return` statements
  3. With an exception handled by `catch`
  4. With an uncaught exception still propagating
- Executes **before** the interpreter jumps to a new destination (return/break/continue)
- Useful for cleanup operations (closing connections, releasing resources)

## Examples

**Basic try-catch:**

```javascript
try {
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
}
```

**With finally for cleanup:**

```javascript
try {
  connectToDatabase();
  performQuery();
} catch (error) {
  console.error('Query failed:', error);
} finally {
  disconnectFromDatabase(); // Always runs
}
```

**Bare catch clause (ES2019+):**

```javascript
// Return undefined instead of throwing an error
function parseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    // Don't care about the exception details
    return undefined;
  }
}
```

**Try-finally without catch:**

```javascript
// Simulate for loop with while
initialize;
while (test) {
  try {
    body;
  } finally {
    increment; // Guaranteed to run even with continue
  }
}
```

## Advanced Behavior

**Finally block with control flow:**

- If `finally` contains `return`, `continue`, `break`, or `throw`, it **replaces** any pending jump
- If `finally` throws an exception, it replaces any exception being thrown from `try/catch`
- If `finally` issues a `return`, the method returns normally even if an exception was thrown

**Exception propagation:**

- If no local `catch` handles the exception, the interpreter executes `finally` first, then jumps to the nearest containing catch clause

## Valid Combinations

- `try-catch`
- `try-finally`
- `try-catch-finally`

## Key Points

- Curly braces are **mandatory** for all blocks
- Catch parameter has block scope (only exists within the catch block)
- Finally executes even with `return` statements in try or catch
- In ES2019+, catch parameter is optional for bare catch clauses
- Exceptions can be thrown with `throw new Error("message")`
- Common error properties: `error.name`, `error.message`, `error.stack`
