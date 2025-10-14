# JavaScript Switch Statement

## What is a Switch Statement?

A **switch statement** is a control flow structure that handles multiway branching based on a single expression's value. Instead of writing multiple `if/else if` statements that repeatedly evaluate the same expression, a switch statement evaluates the expression once and then matches it against various cases.

## Basic Syntax

```javascript
switch (expression) {
  case value1:
    // Code to execute if expression === value1
    break;
  case value2:
    // Code to execute if expression === value2
    break;
  default:
    // Code to execute if no cases match
    break;
}
```

## How It Works

1. **Evaluates the expression** once (in parentheses after `switch`)
2. **Compares the result** to each `case` value using strict equality (`===`)
3. **Executes code** starting from the matching case label
4. **Continues execution** until it hits a `break` statement or reaches the end
5. **Falls back to `default:`** if no cases match (optional)

## Key Points

### The `break` Statement

- **Essential** in 99% of cases to prevent "fall-through"
- Causes execution to jump to the end of the switch block
- Can be replaced with `return` when switch is inside a function

### The `default` Case

- Optional catch-all for when no cases match
- Can appear anywhere in the switch body (though typically at the end)
- Acts like the final `else` in an `if/else` chain

### Matching Rules

- Uses **strict equality** (`===`), not loose equality (`==`)
- No type conversion happens during comparison
- Case expressions are evaluated in order until a match is found

## Examples

### Basic Number Comparison

```javascript
switch (n) {
  case 1:
    console.log('One');
    break;
  case 2:
    console.log('Two');
    break;
  case 3:
    console.log('Three');
    break;
  default:
    console.log('Other number');
    break;
}
```

### Type-Based Processing

```javascript
function convert(x) {
  switch (typeof x) {
    case 'number':
      return x.toString(16); // Convert to hexadecimal
    case 'string':
      return '"' + x + '"'; // Wrap in quotes
    default:
      return String(x); // Default conversion
  }
}
```

### Intentional Fall-Through (Rare)

```javascript
switch (day) {
  case 'Saturday':
  case 'Sunday':
    console.log("It's the weekend!");
    break;
  case 'Monday':
  case 'Tuesday':
  case 'Wednesday':
  case 'Thursday':
  case 'Friday':
    console.log("It's a weekday");
    break;
}
```

## Best Practices

1. **Always use `break`** unless you specifically need fall-through behavior
2. **Use constant expressions** in case labels (avoid side effects like function calls)
3. **Include a `default` case** for better error handling
4. **Consider `if/else`** if you need complex conditions or non-strict equality
5. **Keep it simple** - switch works best with primitive values (numbers, strings)

## When to Use Switch vs If/Else

**Use Switch when:**

- Testing one variable/expression against multiple specific values
- All comparisons use strict equality (`===`)
- You have 3+ conditions to check

**Use If/Else when:**

- Testing different variables in each condition
- Need complex boolean expressions
- Require loose equality or range comparisons
