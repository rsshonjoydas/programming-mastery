# JavaScript Expressions and Operators

## What is an Expression?

An **expression** is any phrase of JavaScript code that can be **evaluated to produce a value**.

## Types of Expressions

### 1. **Simple Expressions**

- **Literals**: Fixed values embedded in code

  ```javascript
  42; // number literal
  ('hello'); // string literal
  ```

- **Variable names**: Evaluate to their assigned values

  ```javascript
  myVariable; // evaluates to the variable's value
  ```

### 2. **Complex Expressions**

Built by combining simpler expressions together:

- **Array Access**: `array[index]`

  - Expression that evaluates to an array
  - Plus an expression that evaluates to an integer (index)
  - Evaluates to the value at that index

- **Function Invocation**: `functionName(arg1, arg2)`
  - Expression that evaluates to a function
  - Plus zero or more argument expressions
  - Evaluates to the function's return value

### 3. **Operator Expressions**

The **most common** way to build complex expressions:

- **Operators** combine values (operands) to produce new values
- Example: `x * y` multiplies two values
- Operators "evaluate to" (or "return") a result

## Key Points

✅ Expressions produce values
✅ Simple expressions = literals and variables
✅ Complex expressions = built from simpler ones
✅ Operators are the main tool for combining expressions
✅ JavaScript uses C-style syntax (familiar to C/C++/Java developers)

## Chapter Coverage

This chapter explains:

- All JavaScript operators
- Non-operator expressions (array indexing, function calls, etc.)
