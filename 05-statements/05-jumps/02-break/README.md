# JavaScript `break` Statement

The `break` statement is used to **exit a loop or switch statement early**, stopping execution and jumping to the code immediately after the loop/switch.

## Common Uses

### 1. **Exit a Loop**

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break; // Exits loop when i is 5
  }
  console.log(i); // Prints: 0, 1, 2, 3, 4
}
```

### 2. **Exit a `while` Loop**

```javascript
let count = 0;
while (true) {
  count++;
  if (count === 3) {
    break; // Exits infinite loop
  }
}
```

### 3. **Exit a `switch` Statement**

```javascript
switch (color) {
  case 'red':
    console.log('Stop');
    break; // Prevents fall-through to next case
  case 'green':
    console.log('Go');
    break;
  default:
    console.log('Wait');
}
```

### 4. **Exit Nested Loops** (only exits innermost loop)

```javascript
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      break; // Only exits inner loop
    }
    console.log(i, j);
  }
}
```

## Key Points

- `break` terminates the **nearest enclosing loop or switch**
- After `break`, code continues after the loop/switch
- Cannot use `break` outside of loops or switch statements
- Use **labeled statements** to break out of outer loops if needed

That's it! The `break` statement is straightforward—it's your "emergency exit" from loops and switches.
