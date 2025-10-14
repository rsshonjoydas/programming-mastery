# JavaScript Labeled Statements

A **labeled statement** in JavaScript is any statement prefixed with an identifier followed by a colon. It allows you to give a name to a statement so you can refer to it elsewhere in your code.

## Syntax

```javascript
label: statement;
```

## Primary Use Cases

### 1. **Breaking out of nested loops**

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop; // breaks out of both loops
    }
    console.log(`i: ${i}, j: ${j}`);
  }
}
```

### 2. **Continuing to a specific loop**

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      continue outerLoop; // skips to next iteration of outer loop
    }
    console.log(`i: ${i}, j: ${j}`);
  }
}
```

### 3. **Labeling blocks**

```javascript
myBlock: {
  console.log('Start');
  if (someCondition) {
    break myBlock; // exits the block
  }
  console.log('This might not execute');
}
console.log('After block');
```

## Important Notes

- Labels are **rarely used** in modern JavaScript
- They only work with `break` and `continue` statements
- You cannot use `goto` in JavaScript (labels are NOT goto)
- Overuse can make code harder to read and maintain
- Consider refactoring nested loops into separate functions instead

## Restrictions

- Cannot label function declarations
- Label names cannot be JavaScript reserved words
- Each label must be unique within its scope

Labeled statements are primarily useful for controlling flow in complex nested loops, but modern code typically avoids them in favor of clearer alternatives like extracting functions.
