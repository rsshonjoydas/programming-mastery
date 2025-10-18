# JavaScript Functions

## What Are Functions?

Functions are **fundamental building blocks** of JavaScript programs—blocks of code that are **defined once** but can be **executed (invoked) any number of times**.

### Core Characteristics

- **Parameterized**: Accept input values (arguments) through parameters
- **Return values**: Compute and return results
- **Invocation context**: Have access to `this` keyword
- **First-class objects**: Can be assigned to variables, passed as arguments, and manipulated
- **Closures**: Have access to variables in their defining scope

---

## Function Terminology

| Term                   | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Parameter**          | Variable name in function definition (placeholder)   |
| **Argument**           | Actual value passed when function is called          |
| **Invocation context** | The value of `this` during function execution        |
| **Return value**       | Value returned by the function (used in expressions) |
| **Method**             | Function assigned as a property of an object         |
| **Constructor**        | Function designed to initialize new objects          |
| **Closure**            | Function that captures variables from outer scope    |

---

## Defining Functions

### 1. Function Declaration (Function Statement)

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

**Characteristics**:

- Hoisted (available before declaration in code)
- Creates a named function
- Most traditional syntax

### 2. Function Expression

```javascript
const greet = function (name) {
  return `Hello, ${name}!`;
};
```

**Characteristics**:

- Not hoisted (must be defined before use)
- Can be anonymous or named
- Assigned to a variable

### 3. Arrow Functions (ES6)

```javascript
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Concise syntax for simple returns
const greet = (name) => `Hello, ${name}!`;
```

**Characteristics**:

- Concise syntax
- No own `this` binding (inherits from enclosing scope)
- Cannot be used as constructors

### 4. Named Function Expression

```javascript
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can call itself using name
};
```

### 5. Function Constructor (rarely used)

```javascript
const add = new Function('a', 'b', 'return a + b');
```

---

## Invoking Functions

### 1. Function Invocation

```javascript
function sum(a, b) {
  return a + b;
}

let result = sum(3, 5); // 8
```

**Context**: `this` is the global object (or `undefined` in strict mode)

### 2. Method Invocation

```javascript
let obj = {
  name: 'Calculator',
  add: function (a, b) {
    return a + b;
  },
};

obj.add(3, 5); // 8
```

**Context**: `this` refers to the object (`obj`)

### 3. Constructor Invocation

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

let person = new Person('Alice', 30);
```

**Context**: `this` refers to the newly created object

### 4. Indirect Invocation (call/apply/bind)

```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}!`;
}

let person = { name: 'Bob' };

greet.call(person, 'Hello'); // "Hello, Bob!"
greet.apply(person, ['Hi']); // "Hi, Bob!"

let boundGreet = greet.bind(person);
boundGreet('Hey'); // "Hey, Bob!"
```

---

## Parameters and Arguments

### Basic Parameters

```javascript
function greet(name, age) {
  console.log(`${name} is ${age} years old`);
}

greet('Alice', 30); // "Alice is 30 years old"
```

### Default Parameters (ES6)

```javascript
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

greet(); // "Hello, Guest!"
greet('Alice'); // "Hello, Alice!"
```

### Rest Parameters (ES6)

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4); // 10
```

### Destructuring Parameters

```javascript
function createUser({ name, age, email }) {
  return { name, age, email };
}

createUser({ name: 'Alice', age: 30, email: 'alice@example.com' });
```

### Arguments Object (pre-ES6)

```javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

sum(1, 2, 3, 4); // 10
```

**Note**: `arguments` is array-like but not a real array. Arrow functions don't have `arguments`.

---

## Return Values

### Explicit Return

```javascript
function add(a, b) {
  return a + b; // Returns the sum
}
```

### Implicit Return (undefined)

```javascript
function logMessage(msg) {
  console.log(msg);
  // No return statement = returns undefined
}
```

### Early Return

```javascript
function divide(a, b) {
  if (b === 0) {
    return 'Cannot divide by zero';
  }
  return a / b;
}
```

### Arrow Function Implicit Return

```javascript
const square = (x) => x * x; // Automatically returns x * x
```

---

## Functions as Objects

Functions are **first-class objects** in JavaScript, meaning they can be:

### Assigned to Variables

```javascript
const greet = function (name) {
  return `Hello, ${name}!`;
};
```

### Passed as Arguments

```javascript
function executeFunction(fn, value) {
  return fn(value);
}

executeFunction(Math.sqrt, 16); // 4
```

### Returned from Functions

```javascript
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5); // 10
```

### Stored in Arrays/Objects

```javascript
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

operations.add(5, 3); // 8
```

### Have Properties and Methods

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet.language = 'English';
greet.version = 1.0;

console.log(greet.name); // "greet" (built-in property)
console.log(greet.length); // 1 (number of parameters)
console.log(greet.language); // "English"
```

---

## Methods

When a function is assigned to an object property, it's called a **method**.

### Method Definition

```javascript
let calculator = {
  value: 0,

  add: function (n) {
    this.value += n;
    return this;
  },

  // ES6 method shorthand
  subtract(n) {
    this.value -= n;
    return this;
  },
};

calculator.add(5).subtract(2);
console.log(calculator.value); // 3
```

### Method Invocation and `this`

```javascript
let person = {
  name: 'Alice',
  greet: function () {
    return `Hello, I'm ${this.name}`;
  },
};

person.greet(); // "Hello, I'm Alice"
```

---

## The `this` Keyword

The value of `this` depends on **how the function is invoked**:

### **1. Function Invocation**

```javascript
function showThis() {
  console.log(this);
}

showThis(); // Global object (window in browser) or undefined (strict mode)
```

### **2. Method Invocation**

```javascript
let obj = {
  name: 'Object',
  showThis: function () {
    console.log(this);
  },
};

obj.showThis(); // obj
```

### **3. Constructor Invocation**

```javascript
function Person(name) {
  this.name = name;
}

let p = new Person('Alice'); // this = new object
```

### 4. Arrow Functions (Lexical `this`)

```javascript
let obj = {
  name: 'Object',
  regularFunc: function () {
    console.log(this.name); // "Object"

    setTimeout(function () {
      console.log(this.name); // undefined (different context)
    }, 100);

    setTimeout(() => {
      console.log(this.name); // "Object" (inherits this)
    }, 100);
  },
};
```

---

## Closures

Functions can access variables from their **defining scope**, even after that scope has exited.

### Basic Closure

```javascript
function makeCounter() {
  let count = 0;

  return function () {
    return ++count;
  };
}

let counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### Private Variables

```javascript
function createPerson(name) {
  let age = 0; // Private variable

  return {
    getName: () => name,
    getAge: () => age,
    birthday: () => ++age,
  };
}

let person = createPerson('Alice');
console.log(person.getName()); // "Alice"
console.log(person.getAge()); // 0
person.birthday();
console.log(person.getAge()); // 1
// console.log(person.age);     // undefined (private)
```

### Practical Closure Example

```javascript
function makeAdder(x) {
  return function (y) {
    return x + y; // x is captured from outer scope
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3)); // 8
console.log(add10(3)); // 13
```

---

## Nested Functions

Functions can be defined inside other functions:

```javascript
function outerFunction(x) {
  function innerFunction(y) {
    return x + y; // Access outer function's parameter
  }

  return innerFunction(10);
}

outerFunction(5); // 15
```

**Key point**: Inner functions have access to outer function's variables and parameters.

---

## Higher-Order Functions

Functions that operate on other functions (accept them as arguments or return them).

### Functions as Arguments

```javascript
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// 0
// 1
// 2
```

### Functions Returning Functions

```javascript
function greaterThan(n) {
  return (m) => m > n;
}

let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11)); // true
console.log(greaterThan10(9)); // false
```

### Array Methods (Higher-Order)

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((a, b) => a + b, 0); // 15
```

---

## Function Properties and Methods

### Built-in Properties

```javascript
function example(a, b, c) {}

console.log(example.name); // "example"
console.log(example.length); // 3 (number of parameters)
```

### call(), apply(), bind()

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

let person = { name: 'Alice' };

// call: arguments passed individually
greet.call(person, 'Hello', '!'); // "Hello, Alice!"

// apply: arguments as array
greet.apply(person, ['Hi', '.']); // "Hi, Alice."

// bind: creates new function with fixed this
let boundGreet = greet.bind(person);
boundGreet('Hey', '!!!'); // "Hey, Alice!!!"
```

---

## Constructors

Functions designed to initialize newly created objects with `new`:

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

let alice = new Person('Alice', 30);
console.log(alice.greet()); // "Hello, I'm Alice"
```

### What `new` Does

1. Creates a new empty object
2. Sets the object's prototype
3. Binds `this` to the new object
4. Executes the constructor function
5. Returns the new object (unless constructor returns an object)

---

## Immediately Invoked Function Expressions (IIFE)

Functions that execute immediately after definition:

```javascript
(function () {
  let private = "I'm private";
  console.log(private);
})();

// Arrow function IIFE
(() => {
  console.log('Executed immediately');
})();
```

**Use cases**: Creating private scope, avoiding global pollution

---

## Function Best Practices

✅ **Use descriptive names** that explain what the function does
✅ **Keep functions small** and focused on a single task
✅ **Use arrow functions** for callbacks and when you don't need `this`
✅ **Use default parameters** instead of checking for undefined
✅ **Return early** to avoid deep nesting
✅ **Avoid modifying arguments** (use pure functions when possible)
✅ **Document complex functions** with comments
✅ **Use closures** for encapsulation and private data

---

## Key Concepts Summary

📌 Functions are **defined once, invoked many times**
📌 Functions are **first-class objects** (can be assigned, passed, returned)
📌 Functions can be **methods** when assigned to object properties
📌 Functions have **parameters** (definition) and receive **arguments** (invocation)
📌 Functions return values or `undefined` by default
📌 The `this` keyword depends on **invocation context**
📌 Functions are **closures** (access variables from defining scope)
📌 Functions can be **nested** within other functions
📌 **Higher-order functions** operate on other functions
📌 **Constructors** initialize new objects with `new`
📌 **Arrow functions** have lexical `this` and concise syntax
📌 Functions have properties (`name`, `length`) and methods (`call`, `apply`, `bind`)
