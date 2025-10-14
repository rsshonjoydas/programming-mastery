# JavaScript `else if` Statement

## What is `else if`?

The `else if` statement allows you to test multiple conditions in sequence. It's actually not a separate JavaScript statement, but rather a programming pattern that chains together `if/else` statements for better readability.

## Basic Syntax

```javascript
if (condition1) {
  // Execute if condition1 is true
} else if (condition2) {
  // Execute if condition1 is false AND condition2 is true
} else if (condition3) {
  // Execute if condition1 and condition2 are false AND condition3 is true
} else {
  // Execute if all conditions are false (optional)
}
```

## How It Works

1. JavaScript evaluates the first `if` condition
2. If true, it executes that block and **skips all remaining conditions**
3. If false, it moves to the next `else if` and checks that condition
4. This continues until a true condition is found or the `else` block is reached
5. Only **one block** of code will ever execute

## Practical Example

```javascript
let score = 85;

if (score >= 90) {
  console.log('Grade: A');
} else if (score >= 80) {
  console.log('Grade: B'); // This will execute
} else if (score >= 70) {
  console.log('Grade: C');
} else if (score >= 60) {
  console.log('Grade: D');
} else {
  console.log('Grade: F');
}
```

## Why Use `else if` Instead of Nested `if` Statements?

**Using `else if` (Recommended):**

```javascript
if (n === 1) {
  // Execute code block #1
} else if (n === 2) {
  // Execute code block #2
} else if (n === 3) {
  // Execute code block #3
} else {
  // If all else fails, execute block #4
}
```

**Fully Nested (Not Recommended):**

```javascript
if (n === 1) {
  // Execute code block #1
} else {
  if (n === 2) {
    // Execute code block #2
  } else {
    if (n === 3) {
      // Execute code block #3
    } else {
      // If all else fails, execute block #4
    }
  }
}
```

### Benefits of `else if`

- **More readable** - easier to follow the logic
- **Less indentation** - code doesn't keep moving to the right
- **Cleaner structure** - shows you're checking multiple conditions for the same decision

## Key Points to Remember

✅ **Only one block executes** - once a condition is true, the rest are skipped
✅ **Order matters** - conditions are checked from top to bottom
✅ **The `else` is optional** - you don't need a final `else` block
✅ **You can have unlimited `else if` blocks** - chain as many as needed

## Common Use Cases

**1. Categorizing Values:**

```javascript
if (age < 13) {
  category = 'child';
} else if (age < 20) {
  category = 'teenager';
} else if (age < 65) {
  category = 'adult';
} else {
  category = 'senior';
}
```

**2. Input Validation:**

```javascript
if (password.length < 8) {
  error = 'Password too short';
} else if (!password.match(/[A-Z]/)) {
  error = 'Password needs uppercase letter';
} else if (!password.match(/[0-9]/)) {
  error = 'Password needs a number';
} else {
  error = null; // Password is valid
}
```

**3. Login System:**

```javascript
let username = 'admin';
let password = 'pass123';

if (username === 'admin' && password === 'pass123') {
  console.log('Login successful!');
} else {
  console.log('Invalid credentials');
}
```

**4. Temperature Check:**

```javascript
let temp = 22;

if (temp > 30) {
  console.log("It's hot! 🔥");
} else if (temp > 20) {
  console.log('Nice weather! ☀️');
} else if (temp > 10) {
  console.log("It's cool 🍂");
} else {
  console.log("It's cold! ❄️");
}
```

**5. Even or Odd:**

```javascript
let number = 7;

if (number % 2 === 0) {
  console.log(number + ' is even');
} else {
  console.log(number + ' is odd');
}
```
