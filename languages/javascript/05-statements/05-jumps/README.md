# Jump Statements

Jump statements alter the normal flow of execution by causing the JavaScript interpreter to jump to a different location in the code.

## Overview of Jump Statements

JavaScript provides several jump statements, each serving a specific purpose:

| Statement  | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- |
| `break`    | Exits a loop or switch statement immediately                     |
| `continue` | Skips the current iteration and jumps to the next loop iteration |
| `return`   | Exits a function and returns a value to the caller               |
| `yield`    | Pauses a generator function and returns a value                  |
| `throw`    | Raises an exception and transfers control to exception handlers  |

## Break Statement

The `break` statement immediately terminates the innermost enclosing loop or `switch` statement and jumps to the statement following it.

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break; // Exits loop when i is 5
  console.log(i); // Outputs: 0, 1, 2, 3, 4
}
```

## Continue Statement

The `continue` statement skips the remaining code in the current loop iteration and jumps back to the top to begin the next iteration.

```javascript
for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // Skip when i is 2
  console.log(i); // Outputs: 0, 1, 3, 4
}
```

## Labeled Statements

JavaScript allows statements to be labeled, enabling `break` and `continue` to target specific loops or blocks (not just the innermost one).

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outerLoop; // Breaks outer loop
    console.log(`i=${i}, j=${j}`);
  }
}
```

**Syntax**: `labelName: statement`

## Return Statement

The `return` statement exits a function, jumps back to the code that invoked it, and optionally supplies a return value.

```javascript
function add(a, b) {
  return a + b; // Returns sum and exits function
}

let result = add(3, 5); // result = 8
```

- Without a value, `return` returns `undefined`
- Functions without an explicit `return` implicitly return `undefined`

## Yield Statement

The `yield` statement pauses a generator function, returns a value to the caller, and maintains the function's state for resumption.

```javascript
function* counter() {
  yield 1; // Pause and return 1
  yield 2; // Pause and return 2
  yield 3; // Pause and return 3
}

const gen = counter();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

- Only valid inside generator functions (`function*`)
- Creates an interim return point, not a complete exit

## Throw Statement

The `throw` statement raises (throws) an exception, causing the interpreter to jump to the nearest exception handler.

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero'); // Throws exception
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.error(error.message); // Handles the exception
}
```

**Exception handling flow**:

1. Exception is thrown
2. Interpreter searches for the nearest `try/catch` block
3. May be in the same function or up the call stack
4. If no handler is found, the program terminates with an error

## How Jump Statements Work Together

Jump statements can be combined with control structures for complex flow control:

```javascript
function findValue(matrix, target) {
  outer: for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === target) {
        return [i, j]; // Jump out of function entirely
      }
      if (matrix[i][j] < 0) {
        continue outer; // Skip to next row
      }
    }
  }
  throw new Error('Value not found'); // Jump to exception handler
}
```

## Key Points

- **break**: Exits loops and switch statements completely
- **continue**: Skips to the next iteration of a loop
- **return**: Exits functions and provides return values
- **yield**: Pauses generators while maintaining state
- **throw**: Transfers control to exception handlers
- Labels allow `break` and `continue` to target specific statements
- Exception handling with `throw` can jump up the entire call stack
- Jump statements enable sophisticated control flow beyond sequential execution
