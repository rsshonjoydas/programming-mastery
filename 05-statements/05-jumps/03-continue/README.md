# JavaScript `continue` Statement

The `continue` statement skips the rest of the current iteration in a loop and jumps to the next iteration.

## Basic Syntax

```javascript
continue;
```

## How It Works

When `continue` is executed:

1. It immediately stops the current iteration
2. Skips any remaining code in the loop body
3. Moves to the next iteration (or ends if no more iterations)

## Examples

### With `for` loop

```javascript
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue; // Skip when i is 2
  }
  console.log(i);
}
// Output: 0, 1, 3, 4
```

### With `while` loop

```javascript
let i = 0;
while (i < 5) {
  i++;
  if (i === 3) {
    continue; // Skip when i is 3
  }
  console.log(i);
}
// Output: 1, 2, 4, 5
```

### Skipping even numbers

```javascript
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue; // Skip even numbers
  }
  console.log(i); // Only odd numbers printed
}
// Output: 1, 3, 5, 7, 9
```

## Key Points

- Only works inside loops (`for`, `while`, `do...while`, `for...in`, `for...of`)
- Doesn't exit the loop entirely (use `break` for that)
- In `for` loops, the increment expression still runs before the next iteration
- Cannot be used outside of loops (will cause a syntax error)
