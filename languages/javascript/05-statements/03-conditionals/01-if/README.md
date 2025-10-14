# JavaScript `if` Statement

The `if` statement is JavaScript's fundamental control structure for making decisions and executing code conditionally.

## Basic Syntax

### Simple `if` Statement

```javascript
if (expression) statement;
```

**How it works:**

- The `expression` is evaluated
- If the result is **truthy**, the `statement` executes
- If the result is **falsy**, the `statement` is skipped

**Important:** Parentheses around the expression are **required**.

### Examples

**Single statement:**

```javascript
if (username == null) username = 'John Doe';
```

**Using negation:**

```javascript
// If username is null, undefined, false, 0, "", or NaN, give it a new value
if (!username) username = 'John Doe';
```

**Statement block (multiple statements):**

```javascript
if (!address) {
  address = '';
  message = 'Please specify a mailing address.';
}
```

## `if...else` Statement

### Syntax

```text
if (expression)
  statement1
else
  statement2
```

**How it works:**

- If `expression` is **truthy**, `statement1` executes
- If `expression` is **falsy**, `statement2` executes

### Examples

**With block statements:**

```javascript
if (n === 1) {
  // truthy clause
  console.log('You have 1 new message.');
} else {
  // falsy clause
  console.log(`You have ${n} new messages.`);
}
```

**Single statements without braces:**

```javascript
if (n === 1) console.log('You have 1 new message.');
else console.log(`You have ${n} new messages.`);
```

## Nested `if` Statements - The "Dangling else" Problem

### The Problem

When nesting `if` statements, the `else` clause belongs to the **nearest `if`** statement:

```javascript
i = j = 1;
k = 2;
if (i === j)
  if (j === k) console.log('i equals k');
else console.log("i doesn't equal j"); // WRONG!!
```

**This is interpreted as:**

```javascript
if (i === j) {
  if (j === k) console.log('i equals k');
  else console.log("i doesn't equal j"); // OOPS!
}
```

### The Solution - Use Curly Braces

```javascript
if (i === j) {
  if (j === k) {
    console.log('i equals k');
  }
} else {
  // What a difference the location of a curly brace makes!
  console.log("i doesn't equal j");
}
```

## Best Practices

1. **Always use curly braces** - Even for single statements, this prevents ambiguity and bugs
2. **Proper indentation** - Makes code structure clear
3. **Consistent style** - Pick a style and stick with it throughout your code

### Truthy and Falsy Values

**Falsy values** (evaluate to `false`):

- `false`
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

**Everything else is truthy** (evaluates to `true`), including:

- Non-zero numbers
- Non-empty strings
- Objects and arrays
- `true`

---

This guide covers the essential `if` statement syntax and behavior in JavaScript, combined with your original notes for a comprehensive reference!
