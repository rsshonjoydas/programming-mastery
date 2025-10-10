# JavaScript Function Definition Expressions

Let me expand on your notes with comprehensive information about function definition expressions in JavaScript.

## What Are Function Definition Expressions?

Function definition expressions (also called **function expressions**) are a way to define functions as part of an expression rather than as a statement. The key difference is that function expressions produce a **value** (the function itself) that can be assigned, passed around, or used immediately.

## Basic Syntax

```javascript
// Anonymous function expression
let square = function (x) {
  return x * x;
};

// Named function expression
let factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

## Key Characteristics

### 1. **Function as a Value**

Unlike function declarations, function expressions create a function object that is treated as a value:

```javascript
// Can be assigned to variables
let myFunc = function () {
  console.log('Hello');
};

// Can be passed as arguments
setTimeout(function () {
  console.log('Delayed');
}, 1000);

// Can be returned from other functions
function createMultiplier(factor) {
  return function (x) {
    return x * factor;
  };
}

// Can be stored in data structures
let operations = {
  add: function (a, b) {
    return a + b;
  },
  subtract: function (a, b) {
    return a - b;
  },
};
```

### 2. **Anonymous vs Named Function Expressions**

**Anonymous:**

```javascript
let greet = function (name) {
  return `Hello, ${name}!`;
};
```

**Named:**

```javascript
let greet = function sayHello(name) {
  return `Hello, ${name}!`;
};
// The name 'sayHello' is only accessible inside the function body
// Useful for recursion and debugging
```

### 3. **Not Hoisted**

Unlike function declarations, function expressions are **not hoisted**:

```javascript
// This FAILS - ReferenceError
console.log(square(5));
let square = function (x) {
  return x * x;
};

// Function declarations ARE hoisted
console.log(cube(3)); // Works fine - outputs 27
function cube(x) {
  return x * x * x;
}
```

## Modern Syntax: Arrow Functions (ES6+)

Arrow functions provide a more compact syntax for function expressions:

```javascript
// Traditional function expression
let square = function (x) {
  return x * x;
};

// Arrow function - concise
let square = (x) => {
  return x * x;
};

// Arrow function - even more concise (implicit return)
let square = (x) => x * x;

// Multiple parameters
let add = (a, b) => a + b;

// No parameters
let greet = () => 'Hello!';

// Multiple statements require curly braces
let complex = (x, y) => {
  let sum = x + y;
  let product = x * y;
  return { sum, product };
};
```

### Important Arrow Function Differences

```javascript
// 1. No 'this' binding (lexical this)
function Timer() {
  this.seconds = 0;

  // Arrow function inherits 'this' from Timer
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

// 2. Cannot be used as constructors
let Person = (name) => {
  this.name = name;
};
// new Person("John"); // TypeError: Person is not a constructor

// 3. No 'arguments' object
let regular = function () {
  console.log(arguments);
}; // Has arguments
let arrow = () => {
  console.log(arguments);
}; // ReferenceError (unless inherited)
```

## Common Use Cases

### 1. **Callbacks**

```javascript
let numbers = [1, 2, 3, 4, 5];

// Filter even numbers
let evens = numbers.filter(function (n) {
  return n % 2 === 0;
});
// Or with arrow function
let evens = numbers.filter((n) => n % 2 === 0);

// Map to squares
let squares = numbers.map((x) => x * x);
```

### 2. **Immediately Invoked Function Expressions (IIFE)**

```javascript
// Traditional IIFE
(function () {
  let private = "I'm private";
  console.log('I run immediately!');
})();

// Arrow IIFE
(() => {
  console.log('Arrow IIFE');
})();
```

### 3. **Closures**

```javascript
function createCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

let counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

### 4. **Method Definitions in Objects**

```javascript
let calculator = {
  value: 0,
  add: function (n) {
    this.value += n;
    return this;
  },
  multiply: function (n) {
    this.value *= n;
    return this;
  },
  getValue: function () {
    return this.value;
  },
};

// ES6 method shorthand (still function expressions)
let calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
  getValue() {
    return this.value;
  },
};
```

## Function Declaration vs Function Expression

| Feature       | Function Declaration | Function Expression           |
| ------------- | -------------------- | ----------------------------- |
| Syntax        | `function name() {}` | `let name = function() {}`    |
| Hoisting      | Yes (fully hoisted)  | No (only variable is hoisted) |
| Name required | Yes                  | No (can be anonymous)         |
| Where used    | Statement context    | Expression context            |

```javascript
// DECLARATION
function declared() {
  return "I'm declared";
}

// EXPRESSION
let expressed = function () {
  return "I'm expressed";
};
```

## Best Practices

1. **Use arrow functions for short callbacks** - cleaner and more readable
2. **Use named function expressions for recursion** - easier to debug
3. **Choose based on `this` behavior** - use arrow functions when you want lexical `this`
4. **Be consistent** - pick a style and stick with it in your codebase
5. **Consider readability** - sometimes traditional syntax is clearer

## Quick Reference

```javascript
// All valid function expressions:

// 1. Anonymous
let fn1 = function (x) {
  return x;
};

// 2. Named
let fn2 = function myFunc(x) {
  return x;
};

// 3. Arrow - full syntax
let fn3 = (x) => {
  return x;
};

// 4. Arrow - concise
let fn4 = (x) => x;

// 5. Arrow - no params
let fn5 = () => 42;

// 6. Arrow - multiple params
let fn6 = (a, b) => a + b;

// 7. Arrow - object return (needs parentheses)
let fn7 = (x) => ({ value: x });

// 8. IIFE
(function () {
  console.log('Run now!');
})();
```

This comprehensive guide combines your notes with everything you need to know about function definition expressions in JavaScript!
