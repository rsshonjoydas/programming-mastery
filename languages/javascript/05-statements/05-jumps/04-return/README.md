# JavaScript Return Statements

## Basic Purpose

The `return` statement ends function execution and specifies a value to be returned to the function caller.

## Syntax

```javascript
return;
return expression;
```

## Key Points

### 1. Ends Function Execution

```javascript
function example() {
  console.log('This runs');
  return;
  console.log('This never runs');
}
```

### 2. Returns a Value

```javascript
function add(a, b) {
  return a + b; // Returns the sum
}
let result = add(5, 3); // result = 8
```

### 3. Return Without Value = `undefined`

```javascript
function noReturn() {
  return;
}
console.log(noReturn()); // undefined
```

### 4. No Return Statement = `undefined`

```javascript
function alsoNoReturn() {
  let x = 5;
}
console.log(alsoNoReturn()); // undefined
```

### 5. Can Return Any Data Type

```javascript
return 42; // number
return 'hello'; // string
return true; // boolean
return [1, 2, 3]; // array
return { name: 'John' }; // object
return function () {}; // function
```

### 6. Arrow Functions with Implicit Return

```javascript
const add = (a, b) => a + b; // Implicit return

// Equivalent to:
const add = (a, b) => {
  return a + b;
};
```

### 7. Early Returns (Guard Clauses)

```javascript
function divide(a, b) {
  if (b === 0) return 'Cannot divide by zero';
  return a / b;
}
```

### 8. Automatic Semicolon Insertion Gotcha

```javascript
// WRONG - returns undefined
return;
{
  name: 'John';
}

// CORRECT
return {
  name: 'John',
};
```

## Common Use Cases

- Returning calculated values
- Exiting functions early based on conditions
- Returning data from async operations
- Method chaining (returning `this`)
