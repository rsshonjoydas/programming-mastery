# JavaScript `for` Loop

## Basic Syntax

```javascript
for (initialize; test; increment) statement;
```

## What is a `for` Loop?

The `for` statement is a looping construct that is often more convenient than the `while` statement. It simplifies loops that follow a common pattern by encoding three crucial manipulations into one line of syntax.

Most loops have a counter variable that needs to be:

1. **Initialized** before the loop starts
2. **Tested** before each iteration
3. **Updated** at the end of each iteration

The `for` loop makes these three expressions an explicit part of the loop syntax, making it easy to understand what the loop is doing and preventing mistakes like forgetting to initialize or increment the loop variable.

## How It Works

### Execution Flow

1. **Initialize** - Execute once before the loop starts (typically set up counter variable)
2. **Test** - Evaluate the condition before each iteration
   - If **falsy** - Exit the loop
   - If **truthy** - Execute the statement
3. **Execute statement** - Run the loop body
4. **Increment** - Update the counter/variable after each iteration
5. **Repeat** - Go back to step 2

### Equivalent `while` Loop

Any `for` loop can be written as a `while` loop:

```javascript
// for loop
for (initialize; test; increment) {
  statement;
}

// Equivalent while loop
initialize;
while (test) {
  statement;
  increment;
}
```

**Example:**

```javascript
// for loop
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// Equivalent while loop
let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}
// Both print: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

The `for` loop is more compact and keeps all loop control in one convenient place!

## The Three Expressions Explained

### 1. **Initialize** (runs once)

```javascript
let i = 0;
```

- Evaluated once before the loop begins
- Must have side effects to be useful (usually an assignment)
- JavaScript allows variable declaration here: `let i = 0`
- Can declare and initialize a loop counter at the same time
- Can declare multiple variables: `let i = 0, j = 10`

### 2. **Test** (checked before each iteration)

```javascript
i < 10;
```

- Evaluated before each iteration
- Controls whether the body of the loop is executed
- If it evaluates to a truthy value, the loop body executes
- When it becomes false, the loop stops

### 3. **Increment** (runs after each iteration)

```javascript
i++;
```

- Evaluated after the loop body runs
- Must have side effects to be useful
- Usually an assignment expression or uses `++` or `--` operators
- Can use any expression: `i++`, `i += 2`, `i--`, etc.

## Common Patterns

### Counting Up

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// Output: 0, 1, 2, 3, 4
```

### Counting Down

```javascript
for (let i = 5; i > 0; i--) {
  console.log(i);
}
// Output: 5, 4, 3, 2, 1
```

### Increment by 2

```javascript
for (let i = 0; i < 10; i += 2) {
  console.log(i);
}
// Output: 0, 2, 4, 6, 8
```

### Looping Through Arrays

```javascript
let fruits = ['apple', 'banana', 'cherry'];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
// Output: apple, banana, cherry
```

## Optional Expressions

All three expressions are **optional**, but the **two semicolons are required**:

### Infinite Loop

```javascript
for (;;) {
  // Runs forever (like while(true))
}
```

If you omit the test expression, the loop repeats forever.

### Initialize Outside the Loop

```javascript
let i = 0;
for (; i < 10; i++) {
  console.log(i);
}
```

### Omitting Increment (Non-Numeric Loops)

The loop variable doesn't have to be numeric. Here's a `for` loop traversing a linked list:

```javascript
function tail(o) {
  // Return the tail of linked list o
  for (; o.next; o = o.next /* empty */); // Traverse while o.next is truthy
  return o;
}
```

This code has no _initialize_ expression, and the increment happens in the test section.

## Multiple Variables

The **comma operator** allows combining multiple initialization and increment expressions:

```javascript
let i,
  j,
  sum = 0;
for (i = 0, j = 10; i < 10; i++, j--) {
  sum += i * j;
}
```

This is the most common use of the comma operator in JavaScript - it lets you work with multiple variables in a single `for` loop.

**Another example:**

```javascript
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j);
}
// Output: 0 10, 1 9, 2 8, 3 7, 4 6
```

## Nested Loops

```javascript
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    console.log(`i=${i}, j=${j}`);
  }
}
// Creates a 3x3 grid of iterations
```

## Best Practices

1. **Use descriptive names** for clarity (not just `i` when meaning matters)
2. **Declare variables with `let`** in the initialize expression (keeps them scoped to the loop)
3. **Cache array length** for performance in large loops:

   ```javascript
   let len = array.length;
   for (let i = 0; i < len; i++) {
     // More efficient for large arrays
   }
   ```

4. **Keep all loop control in the first line** - this prevents forgetting to initialize or increment variables

## Key Takeaways

- `for` loops are ideal when you know how many iterations you need
- All loop control is in one convenient line of syntax
- More compact and readable than equivalent `while` loops
- Perfect for iterating through arrays and sequences
- The three expressions (initialize, test, increment) give you complete control
- Any of the three expressions can be omitted, but the two semicolons are required
- Loops can work with non-numeric variables (like linked lists or objects)
- The comma operator enables working with multiple variables in a single loop
- Putting initialization, test, and increment in one place prevents common loop mistakes
