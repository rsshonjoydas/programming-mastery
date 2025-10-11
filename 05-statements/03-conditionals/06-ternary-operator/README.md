# JavaScript Ternary Operator

## Basic Syntax

```javascript
condition ? valueIfTrue : valueIfFalse;
```

The ternary operator is a **concise way to write simple if/else statements** in a single line.

## How It Works

1. Evaluates the **condition**
2. If `true`, returns **valueIfTrue**
3. If `false`, returns **valueIfFalse**

## Basic Example

```javascript
let age = 18;
let status = age >= 18 ? 'adult' : 'minor';
// status = "adult"
```

This is equivalent to:

```javascript
let status;
if (age >= 18) {
  status = 'adult';
} else {
  status = 'minor';
}
```

## More Examples

### Simple Comparison

```javascript
let max = a > b ? a : b;
```

### In Function Returns

```javascript
function isEven(num) {
  return num % 2 === 0 ? 'even' : 'odd';
}
```

### In String Interpolation

```javascript
console.log(`You have ${count} item${count === 1 ? '' : 's'}`);
```

### Nested Ternary (Not Recommended)

```javascript
let grade = score >= 90 ? 'A' : 
            score >= 80 ? 'B' : 
            score >= 70 ? 'C' : 'F';
```

### With Function Calls

```javascript
let result = isValid ? processData() : showError();
```

## Key Points

- **Returns a value** (unlike if/else which is a statement)
- Called "ternary" because it takes **three operands**
- Also known as the **conditional operator**
- Best for **simple, short conditions**
- Avoid **deep nesting** (use if/else for complex logic)

## When to Use

✅ **Use ternary for:**

- Simple true/false assignments
- Conditional values in expressions
- Short, readable conditions

❌ **Avoid ternary for:**

- Complex logic with multiple statements
- Deep nesting (hard to read)
- When debugging clarity is important
