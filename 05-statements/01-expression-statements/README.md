# JavaScript Expression Statements

## What Are Expression Statements?

Expression statements are the simplest types of statements in JavaScript. They are expressions that have **side effects** - meaning they change something in your program or environment when executed.

## Main Categories of Expression Statements

### 1. **Assignment Statements**

These modify variable values:

```javascript
greeting = 'Hello ' + name;
i *= 3;
```

Assignment statements change the value stored in a variable, which is their side effect.

### 2. **Increment and Decrement Operators**

The `++` and `--` operators are related to assignments because they modify variable values:

```javascript
counter++;
counter--;
```

These operators have the side effect of changing a variable value, just as if an assignment had been performed.

### 3. **The delete Operator**

The `delete` operator removes object properties:

```javascript
delete o.x;
```

This operator has the important side effect of deleting an object property. It's almost always used as a statement rather than as part of a larger expression.

### 4. **Function Calls**

Function calls are another major category of expression statements:

```javascript
console.log(debugMessage);
displaySpinner(); // A hypothetical function to display a spinner in a web app.
```

These function calls are expressions, but they have side effects that affect the host environment or program state, so they're used as statements.

## Important Concept: Side Effects Matter

**When side effects are present:** If a function has side effects (like logging to console, modifying the DOM, changing global state), it makes sense to call it as a statement.

**When side effects are absent:** If a function doesn't have side effects, there's no point calling it alone. For example:

```javascript
// ❌ Useless - computes cosine but discards the result
Math.cos(x);

// ✅ Useful - computes cosine and stores it
cx = Math.cos(x);
```

## Syntax Note: Semicolons

Each expression statement should be terminated with a semicolon (`;`):

```javascript
counter++;
delete o.x;
console.log('Hello');
```

---

**Key Takeaway:** Expression statements are expressions executed for their side effects rather than their values. They're fundamental to making things happen in your JavaScript programs!
