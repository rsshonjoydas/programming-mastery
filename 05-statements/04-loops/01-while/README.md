# JavaScript `while` Loop

## Basic Syntax

```javascript
while (condition) {
  // code to execute
}
```

## How It Works

1. **Check condition** - Evaluates the expression
2. **If true** - Execute the code block
3. **Repeat** - Go back to step 1
4. **If false** - Exit loop and continue with the rest of the program

## Simple Examples

### Counting Up

```javascript
let i = 0;
while (i < 5) {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
}
```

### Counting Down

```javascript
let count = 5;
while (count > 0) {
  console.log(count); // 5, 4, 3, 2, 1
  count--;
}
```

### With String

```javascript
let text = '';
let i = 0;
while (i < 3) {
  text += 'Hello ';
  i++;
}
console.log(text); // "Hello Hello Hello "
```

## Nested `while` Loops

```javascript
let i = 1;
while (i <= 3) {
  let j = 1;
  while (j <= 3) {
    console.log(`i=${i}, j=${j}`);
    j++;
  }
  i++;
}
```

## Infinite Loops

### Intentional Infinite Loop

```javascript
while (true) {
  // Runs forever (use break to exit)
  if (someCondition) break;
}
```

### Accidental Infinite Loop (AVOID!)

```javascript
let i = 0;
while (i < 5) {
  console.log(i);
  // Forgot to increment i - loops forever!
}
```

## Common Patterns

### Processing Arrays

```javascript
let fruits = ['apple', 'banana', 'orange'];
let i = 0;
while (i < fruits.length) {
  console.log(fruits[i]);
  i++;
}
```

### User Input Validation

```javascript
let input = '';
while (input !== 'quit') {
  input = prompt("Enter command (or 'quit' to exit):");
  console.log('You entered:', input);
}
```

### Finding First Match

```javascript
let numbers = [1, 3, 5, 8, 9];
let i = 0;
let found = false;

while (i < numbers.length && !found) {
  if (numbers[i] % 2 === 0) {
    console.log('First even number:', numbers[i]);
    found = true;
  }
  i++;
}
```

### Countdown Timer

```javascript
let seconds = 5;
while (seconds > 0) {
  console.log(seconds + ' seconds remaining');
  seconds--;
}
console.log("Time's up!");
```

## Best Practices

### ✅ DO

- Always ensure the condition can become false
- Initialize counter variables before the loop
- Update the counter inside the loop
- Use meaningful variable names
- Keep loop logic simple and readable

### ❌ DON'T

- Forget to update the loop variable (causes infinite loop)
- Modify the loop variable in unexpected ways
- Create overly complex conditions
- Nest too many loops (affects performance)

## Common Use Cases

1. **Unknown iterations** - When you don't know how many times to loop
2. **Conditional looping** - Loop until a specific condition is met
3. **Reading data** - Process data until a sentinel value
4. **Game loops** - Keep game running until game over
5. **Retries** - Attempt an operation until success

## Performance Tips

- Avoid expensive operations inside the condition
- Cache length in array iterations:

```javascript
let arr = [1, 2, 3, 4, 5];
let i = 0;
let len = arr.length; // Cache length
while (i < len) {
  console.log(arr[i]);
  i++;
}
```

## Summary

The `while` loop is perfect when:

- You need to repeat code while a condition is true
- You don't know the number of iterations in advance
- You need more control than a `for` loop provides

**Remember:** Always make sure your condition will eventually become false to avoid infinite loops!
