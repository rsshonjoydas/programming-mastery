# JavaScript Function Properties, Methods, and Constructor

Functions in JavaScript are specialized objects, which means they can have properties and methods just like any other object. The `typeof` operator returns `"function"`, but functions are really objects with special capabilities.

---

## Function Properties

### 1. The `length` Property

The **read-only** `length` property specifies the **arity** of a function—the number of parameters declared in its parameter list.

```javascript
function add(a, b) {
  return a + b;
}
console.log(add.length); // 2

function greet(name, greeting = 'Hello') {
  return `${greeting}, ${name}`;
}
console.log(greet.length); // 1 (default parameters not counted)

function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log(sum.length); // 0 (rest parameters not counted)
```

**Key points**:

- Counts only parameters **before** the first default parameter
- **Rest parameters** are not counted
- Usually indicates the expected number of arguments

---

### 2. The `name` Property

The **read-only** `name` property specifies the function's name as defined or assigned.

```javascript
function myFunction() {}
console.log(myFunction.name); // "myFunction"

const anonFunc = function () {};
console.log(anonFunc.name); // "anonFunc" (variable name)

const obj = {
  method() {},
};
console.log(obj.method.name); // "method"

const arrow = () => {};
console.log(arrow.name); // "arrow"
```

**Use case**: Primarily useful for debugging and error messages.

---

### 3. The `prototype` Property

All functions (except arrow functions) have a `prototype` property that refers to an object known as the **prototype object**.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const alice = new Person('Alice');
console.log(alice.greet()); // "Hello, I'm Alice"
```

**Key points**:

- Every function has a **different** prototype object
- When used as a constructor, newly created objects inherit from this prototype
- **Arrow functions** do NOT have a `prototype` property

---

## Function Methods

### 1. The `call()` Method

Invokes a function with a specified `this` value and individual arguments.

**Syntax**: `function.call(thisArg, arg1, arg2, ...)`

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

console.log(greet.call(person, 'Hello', '!'));
// "Hello, Alice!"
```

**How it works**:

```javascript
f.call(o, 1, 2);

// Equivalent to:
o.m = f;
o.m(1, 2);
delete o.m;
```

**With arrow functions**:

```javascript
const arrowFunc = () => this.value;
const obj = { value: 42 };

arrowFunc.call(obj); // this is ignored in arrow functions
```

---

### 2. The `apply()` Method

Similar to `call()`, but arguments are passed as an **array**.

**Syntax**: `function.apply(thisArg, [argsArray])`

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Bob' };

console.log(greet.apply(person, ['Hi', '?']));
// "Hi, Bob?"
```

**Practical use case** (pre-ES6):

```javascript
const numbers = [5, 6, 2, 3, 7];

// Find max using apply
const max = Math.max.apply(Math, numbers); // 7

// Modern ES6 equivalent:
const maxES6 = Math.max(...numbers); // 7
```

**Method tracing example**:

```javascript
// Replace method with version that logs calls
function trace(o, m) {
  let original = o[m];

  o[m] = function (...args) {
    console.log(new Date(), 'Entering:', m);
    let result = original.apply(this, args);
    console.log(new Date(), 'Exiting:', m);
    return result;
  };
}

const calculator = {
  add(a, b) {
    return a + b;
  },
};

trace(calculator, 'add');
calculator.add(2, 3); // Logs entry/exit with timestamps
```

---

### 3. The `bind()` Method

Creates a new function with a **fixed** `this` value and optional preset arguments.

**Syntax**: `function.bind(thisArg, arg1, arg2, ...)`

#### Basic binding

```javascript
function f(y) {
  return this.x + y;
}

const o = { x: 1 };
const g = f.bind(o); // Bind f to o

console.log(g(2)); // 3 (this.x = 1, y = 2)

// Even when called as a method of another object:
const p = { x: 10, g };
console.log(p.g(2)); // 3 (still bound to o, not p)
```

#### Partial application (currying)

```javascript
const sum = (x, y) => x + y;

// Bind first argument to 1
const succ = sum.bind(null, 1);
console.log(succ(2)); // 3 (x=1, y=2)

function f(y, z) {
  return this.x + y + z;
}

// Bind this and first argument
const g = f.bind({ x: 1 }, 2);
console.log(g(3)); // 6 (this.x=1, y=2, z=3)
```

**Name property of bound functions**:

```javascript
function myFunc() {}
const boundFunc = myFunc.bind(null);
console.log(boundFunc.name); // "bound myFunc"
```

**Key differences**:

- `call()` and `apply()`: Invoke immediately
- `bind()`: Returns a new function for later invocation

---

### 4. The `toString()` Method

Returns a string representation of the function's source code.

```javascript
function add(a, b) {
  return a + b;
}

console.log(add.toString());
// "function add(a, b) {
//   return a + b;
// }"

// Built-in functions
console.log(Math.max.toString());
// "function max() { [native code] }"
```

**Use case**: Primarily for debugging and introspection.

---

## The Function() Constructor

Creates new functions dynamically at runtime from strings.

**Syntax**: `new Function(arg1, arg2, ..., functionBody)`

```javascript
// Create a function dynamically
const f = new Function('x', 'y', 'return x * y;');

console.log(f(2, 3)); // 6

// Equivalent to:
const f2 = function (x, y) {
  return x * y;
};
```

### Multiple parameters

```javascript
const add = new Function('a', 'b', 'c', 'return a + b + c');
console.log(add(1, 2, 3)); // 6
```

### No parameters

```javascript
const greet = new Function("return 'Hello, World!'");
console.log(greet()); // "Hello, World!"
```

---

## Important Characteristics of Function() Constructor

### ⚠️ 1. Creates Anonymous Functions

```javascript
const f = new Function('x', 'return x * 2');
console.log(f.name); // "anonymous"
```

### ⚠️ 2. Does NOT Use Lexical Scoping

Functions created with `Function()` are **always compiled as top-level functions**:

```javascript
let scope = 'global';

function constructFunction() {
  let scope = 'local';
  return new Function('return scope');
}

console.log(constructFunction()()); // "global" (not "local"!)
```

**Why?** The function doesn't capture the local scope—it only sees global scope.

### ⚠️ 3. Compiled at Runtime (Inefficient)

```javascript
// BAD: Recompiles function on every iteration
for (let i = 0; i < 1000; i++) {
  const f = new Function('x', 'return x * 2');
  f(i);
}

// GOOD: Function defined once
const f = function (x) {
  return x * 2;
};
for (let i = 0; i < 1000; i++) {
  f(i);
}
```

### ⚠️ 4. Dynamic Compilation

```javascript
// Can create functions from user input (dangerous!)
const operation = 'return x * y';
const multiply = new Function('x', 'y', operation);
console.log(multiply(3, 4)); // 12
```

---

## Comparison: call() vs apply() vs bind()

| Method      | Invocation | Arguments            | Returns         | Use Case                          |
| ----------- | ---------- | -------------------- | --------------- | --------------------------------- |
| **call()**  | Immediate  | Individual           | Function result | Set `this` with known args        |
| **apply()** | Immediate  | Array                | Function result | Set `this` with array args        |
| **bind()**  | Later      | Individual (partial) | New function    | Create permanently bound function |

### Example comparison

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

// call: invoke immediately with individual args
greet.call(person, 'Hello', '!'); // "Hello, Alice!"

// apply: invoke immediately with array
greet.apply(person, ['Hello', '!']); // "Hello, Alice!"

// bind: create new function for later
const boundGreet = greet.bind(person, 'Hello');
boundGreet('!'); // "Hello, Alice!"
```

---

## When to Use Each

### Use `call()`

- Invoke function immediately with specific `this`
- Have individual arguments ready
- Borrowing methods from other objects

### Use `apply()`

- Invoke function immediately with specific `this`
- Arguments are in an array
- Working with variable-length argument lists (pre-ES6)

### Use `bind()`

- Create a permanently bound function
- Partial application (currying)
- Event handlers with specific context
- Callback functions that need specific `this`

### Use `Function()` Constructor

- Almost never! (Security and performance concerns)
- Dynamic code generation (use with extreme caution)
- When you absolutely need runtime function compilation

---

## Key Concepts Summary

✅ Functions are **objects** with properties and methods
✅ **`length`**: Number of parameters (excluding rest/default)
✅ **`name`**: Function's name for debugging
✅ **`prototype`**: Prototype object for constructor functions (not arrow functions)
✅ **`call()`**: Invoke with custom `this` and individual arguments
✅ **`apply()`**: Invoke with custom `this` and array of arguments
✅ **`bind()`**: Create new function with fixed `this` and partial arguments
✅ **`toString()`**: Get source code string
✅ **`Function()` constructor**: Create functions dynamically (rarely used)
✅ Arrow functions **cannot** have `this` overridden by call/apply/bind
✅ Function() creates functions with **global scope only** (no lexical scope)
