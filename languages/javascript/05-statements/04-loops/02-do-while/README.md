# JavaScript `do-while` Loop

## Basic Syntax

```javascript
do statement;
while (expression);
```

## How It Works

The `do-while` loop is similar to the `while` loop, but with one crucial difference: **the loop body executes at least once before the condition is tested**.

**Execution flow:**

1. **Execute the statement** - Run the loop body first
2. **Evaluate the expression** - Check if the condition is true or false
3. **If truthy** - Jump back to step 1 and repeat
4. **If falsy** - Exit the loop and continue with the next statement

## Key Difference from `while` Loop

| `while` Loop                         | `do-while` Loop                     |
| ------------------------------------ | ----------------------------------- |
| Tests condition **before** executing | Tests condition **after** executing |
| May execute **0 or more** times      | Always executes **at least once**   |

## Example

```javascript
let count = 0;
do {
  console.log(count);
  count++;
} while (count < 10);
```

This prints numbers 0 through 9, just like the `while` loop example.

## When the Difference Matters

```javascript
// while loop - may not execute at all
let x = 10;
while (x < 5) {
  console.log(x); // This never runs
  x++;
}

// do-while loop - executes at least once
let y = 10;
do {
  console.log(y); // This runs once, printing "10"
  y++;
} while (y < 5);
```

## Common Use Cases

The `do-while` loop is useful when you need to:

- Execute code at least once before checking a condition
- Validate user input (get input first, then check if it's valid)
- Show a menu at least once before checking if the user wants to continue

```javascript
let userInput;
do {
  userInput = prompt('Enter a number greater than 10:');
} while (userInput <= 10);
```

## Important Notes

- Don't forget the **semicolon** after the `while (expression);` - it's required!
- Like `while` loops, ensure your condition can eventually become false to avoid infinite loops
- Less commonly used than `while` loops, but valuable when you need guaranteed first execution
