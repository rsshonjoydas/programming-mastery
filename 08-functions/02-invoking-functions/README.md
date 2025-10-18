# JavaScript Function Invocation

JavaScript functions can be invoked in **five different ways**, each with distinct characteristics regarding the `this` context, argument handling, and return values.

---

## Overview of Invocation Methods

| Method          | Syntax                | `this` Value         | Use Case                   |
| --------------- | --------------------- | -------------------- | -------------------------- |
| **Function**    | `func()`              | Global/undefined     | Regular function calls     |
| **Method**      | `obj.method()`        | The object           | Object-oriented operations |
| **Constructor** | `new Func()`          | New object           | Creating instances         |
| **Indirect**    | `func.call()/apply()` | Specified explicitly | Borrowing methods          |
| **Implicit**    | Various features      | Context-dependent    | Language features          |

---

## 1. Function Invocation

Functions are invoked as standalone function calls using parentheses `()`.

### Syntax

```javascript
functionName(arg1, arg2, ...);
```

### Examples

```javascript
printprops({ x: 1 });
let total = distance(0, 0, 2, 1) + distance(2, 1, 3, 5);
let probability = factorial(5) / factorial(13);
```

### How It Works

1. **Argument evaluation**: Each argument expression is evaluated
2. **Parameter assignment**: Values are assigned to function parameters
3. **Execution**: Function body executes
4. **Return value**:
   - Explicit `return` statement → returns that value
   - No `return` or empty `return` → returns `undefined`
   - Function completes normally → returns `undefined`

### The `this` Context

**Non-strict mode**: `this` is the global object (`window` in browsers, `global` in Node.js)

**Strict mode**: `this` is `undefined`

**Arrow functions**: `this` is inherited from the surrounding scope (lexical `this`)

```javascript
function regularFunction() {
  console.log(this); // Global object (non-strict) or undefined (strict)
}

const arrowFunction = () => {
  console.log(this); // Inherits from outer scope
};
```

### Conditional Invocation (ES2020)

Use `?.()` to invoke a function only if it's not `null` or `undefined`:

```javascript
f?.(x); // Equivalent to:
f !== null && f !== undefined ? f(x) : undefined;
```

**Example**:

```javascript
let callback = null;
callback?.(); // No error, returns undefined

callback = () => console.log('Called');
callback?.(); // Executes the function
```

### Determining Strict Mode

```javascript
const strict = (function () {
  return !this;
})();

console.log(strict); // true in strict mode, false otherwise
```

### Recursive Functions and the Call Stack

**Call stack**: When function A calls B, and B calls C, JavaScript maintains execution contexts in a stack.

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Recursive call
}

factorial(5); // Creates 5 execution contexts on the stack
```

**Memory constraints**:

- Hundreds of recursive calls: Usually fine
- Thousands of recursive calls: Risk "Maximum call-stack size exceeded" error

---

## 2. Method Invocation

A method is a function stored as a property of an object.

### Defining and Invoking Methods

```javascript
let o = {};
o.m = function () {
  /* method body */
};

o.m(); // Method invocation
o.m(x, y); // With arguments
```

### **The `this` Context**

In method invocation, `this` refers to the **object before the dot**.

```javascript
let calculator = {
  operand1: 1,
  operand2: 1,
  add() {
    this.result = this.operand1 + this.operand2;
  },
};

calculator.add(); // this === calculator
console.log(calculator.result); // 2
```

### Different Invocation Syntaxes

```javascript
o.m(x, y); // Dot notation
o['m'](x, y); // Bracket notation
a[0](z); // Array element (if it's a function)

// Complex expressions
customer.surname.toUpperCase(); // Method on nested property
f().m(); // Method on function's return value
```

### Method vs Function Comparison

```javascript
// Method invocation (elegant, OOP-style)
rect.setSize(width, height);

// Function invocation (procedural style)
setRectSize(rect, width, height);
```

Both may do the same thing, but method syntax emphasizes that `rect` is the focus of the operation.

### Method Chaining

Return `this` from methods to enable chaining:

```javascript
class Square {
  x(val) {
    this._x = val;
    return this;
  }
  y(val) {
    this._y = val;
    return this;
  }
  size(val) {
    this._size = val;
    return this;
  }

  draw() {
    console.log('Drawing square');
    return this;
  }
}

new Square().x(100).y(100).size(50).draw();

// Common with Promises
doStepOne().then(doStepTwo).then(doStepThree).catch(handleErrors);
```

### Nested Functions and `this` Problem

**Important**: Nested functions (non-arrow) do **not** inherit `this` from the outer function.

```javascript
let o = {
  m: function () {
    console.log(this === o); // true

    function f() {
      console.log(this === o); // false! (this is global/undefined)
    }
    f();
  },
};
o.m();
```

### Solutions to the Nested Function Problem

#### Solution 1: Save `this` in a variable

```javascript
let o = {
  m: function () {
    let self = this; // Save reference

    function f() {
      console.log(self === o); // true
    }
    f();
  },
};
```

#### Solution 2: Use arrow functions (ES6+)

```javascript
let o = {
  m: function () {
    const f = () => {
      console.log(this === o); // true (inherits this)
    };
    f();
  },
};
```

#### Solution 3: Use `bind()`

```javascript
let o = {
  m: function () {
    const f = function () {
      console.log(this === o); // true
    }.bind(this);

    f();
  },
};
```

**Note**: `this` is a keyword, not a variable. You **cannot** assign to it: `this = value; // Syntax error`

---

## 3. Constructor Invocation

When a function is invoked with the `new` keyword, it's called as a constructor.

### **Syntax**

```javascript
let obj = new ConstructorFunction(args);
let obj2 = new ConstructorFunction(); // Parentheses optional if no arguments
```

### What Happens

1. **New object created**: An empty object is created
2. **Prototype set**: The new object inherits from `ConstructorFunction.prototype`
3. **`this` bound**: The constructor's `this` refers to the new object
4. **Constructor executes**: Initializes the new object
5. **Return value**:
   - If constructor returns an object → that object is returned
   - If constructor returns primitive or nothing → new object is returned

### Example

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  // Implicit: return this;
}

let person = new Person('Alice', 30);
console.log(person.name); // "Alice"
```

### Constructor Return Behavior

```javascript
function Test1() {
  this.x = 1;
  // No return statement
}
let obj1 = new Test1(); // Returns new object with x = 1

function Test2() {
  this.x = 1;
  return { y: 2 }; // Explicit object return
}
let obj2 = new Test2(); // Returns {y: 2}, ignoring this.x

function Test3() {
  this.x = 1;
  return 42; // Primitive return
}
let obj3 = new Test3(); // Returns new object with x = 1 (ignores 42)
```

### Important Note

Even if constructor invocation looks like a method call, the object before the dot is **not** the `this` context:

```javascript
let obj = {
  Constructor: function () {
    this.value = 10;
  },
};

let instance = new obj.Constructor();
console.log(instance.value); // 10
console.log(obj.value); // undefined (this !== obj in constructor)
```

---

## 4. Indirect Invocation

Use `call()` or `apply()` to invoke functions with an explicitly specified `this` value.

### call() Method

```javascript
func.call(thisArg, arg1, arg2, ...);
```

**Arguments**: Listed individually

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

let person = { name: 'Alice' };
greet.call(person, 'Hello', '!'); // "Hello, Alice!"
```

### apply() Method

```javascript
func.apply(thisArg, [arg1, arg2, ...]);
```

**Arguments**: Passed as an array

```javascript
greet.apply(person, ['Hi', '.']); // "Hi, Alice."
```

### Use Cases

**Borrowing methods**:

```javascript
let obj = {
  values: [1, 2, 3],
  sum: function () {
    return this.values.reduce((a, b) => a + b, 0);
  },
};

let another = { values: [10, 20, 30] };
let total = obj.sum.call(another); // 60 (uses another.values)
```

**Finding max in array**:

```javascript
let numbers = [5, 2, 9, 1, 7];
let max = Math.max.apply(null, numbers); // 9
```

---

## 5. Implicit Function Invocation

Various JavaScript features invoke functions without explicit call syntax.

### Getters and Setters

```javascript
let obj = {
  _value: 0,

  get value() {
    console.log('Getter called');
    return this._value;
  },

  set value(v) {
    console.log('Setter called');
    this._value = v;
  },
};

let x = obj.value; // Implicitly calls getter
obj.value = 10; // Implicitly calls setter
```

### toString() and valueOf()

```javascript
let obj = {
  toString() {
    return 'Custom String';
  },
  valueOf() {
    return 42;
  },
};

console.log('Value: ' + obj); // Calls toString(): "Value: Custom String"
console.log(obj + 10); // Calls valueOf(): 52
```

### Iterators

```javascript
let iterable = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next() {
        count++;
        if (count <= 3) {
          return { value: count, done: false };
        }
        return { done: true };
      },
    };
  },
};

for (let val of iterable) {
  // Implicitly calls iterator methods
  console.log(val); // 1, 2, 3
}
```

### Tagged Template Literals

```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

let name = 'Alice';
let age = 30;
let result = highlight`Name: ${name}, Age: ${age}`;
// Implicitly invokes highlight function
```

### Proxy Objects

```javascript
let handler = {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
};

let proxy = new Proxy({ x: 1 }, handler);
console.log(proxy.x); // Implicitly calls handler.get()
```

---

## Summary Comparison

### Function vs Method vs Constructor

```javascript
// Function invocation
function func() {
  console.log(this);
}
func(); // this = global/undefined

// Method invocation
let obj = {
  method: function () {
    console.log(this);
  },
};
obj.method(); // this = obj

// Constructor invocation
function Constructor() {
  console.log(this);
}
new Constructor(); // this = newly created object
```

### `this` Value Summary

| Invocation Type           | `this` Value          |
| ------------------------- | --------------------- |
| **Function (non-strict)** | Global object         |
| **Function (strict)**     | `undefined`           |
| **Arrow function**        | Inherited (lexical)   |
| **Method**                | Object before the dot |
| **Constructor**           | New object            |
| **call/apply**            | First argument        |

---

## Key Concepts

✅ **Five invocation methods**: Function, method, constructor, indirect, implicit
✅ **`this` context varies** by invocation type
✅ **Arrow functions inherit `this`** from outer scope
✅ **Nested functions don't inherit `this`** (use arrow functions, `self`, or `bind()`)
✅ **Constructors create new objects** with `new` keyword
✅ **call/apply** allow explicit `this` binding
✅ **Implicit invocations** happen through getters, iterators, proxies, etc.
✅ **Conditional invocation (`?.()`)** safely calls functions that might be null/undefined
✅ **Recursive functions** consume call stack memory
✅ **Method chaining** enabled by returning `this`
