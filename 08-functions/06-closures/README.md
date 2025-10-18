# JavaScript Function Closures

## What Are Closures?

A **closure** is a combination of:

1. A **function object**
2. The **scope** (variable bindings) in which the function was defined

**Key principle**: JavaScript uses **lexical scoping** - functions are executed using the variable scope that was in effect when they were **defined**, not when they are **invoked**.

### Technical Definition

The internal state of a JavaScript function includes:

- The function's code
- A reference to the scope where the function was defined

**Important**: Technically, **all JavaScript functions are closures**, but closures become interesting when a function is invoked from a different scope than where it was defined.

---

## Understanding Lexical Scoping

### Example 1: Same Scope Invocation

```javascript
let scope = 'global scope';

function checkscope() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f(); // Invoke f() inside checkscope
}

checkscope(); // => "local scope"
```

The nested function `f()` returns `"local scope"` because it accesses the local variable in its defining scope.

### Example 2: Different Scope Invocation (Closure)

```javascript
let scope = 'global scope';

function checkscope() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f; // Return function itself, don't invoke
}

let s = checkscope()(); // => "local scope"
```

**Why does this work?**

- `checkscope()` returns the function `f` (not its result)
- `f` is then invoked **outside** the scope where it was defined
- But `f` still has access to the `scope` variable from `checkscope()`
- This is the **power of closures**: they capture local variables from their outer function

---

## Closures for Private State

Closures can be used to create **private variables** that cannot be accessed from outside.

### Example: Private Counter

```javascript
let uniqueInteger = (function () {
  let counter = 0; // Private variable
  return function () {
    return counter++;
  };
})();

uniqueInteger(); // => 0
uniqueInteger(); // => 1
uniqueInteger(); // => 2
```

**How it works**:

1. An immediately invoked function expression (IIFE) creates a scope
2. The `counter` variable is defined in this scope
3. The inner function has access to `counter`
4. After the outer function executes, `counter` is **only** accessible to the returned function
5. No external code can access or modify `counter`

---

## Multiple Closures Sharing State

Multiple nested functions can share access to the same private variables.

### Example: Counter with Multiple Methods

```javascript
function counter() {
  let n = 0; // Private variable

  return {
    count: function () {
      return n++;
    },
    reset: function () {
      n = 0;
    },
  };
}

let c = counter();
let d = counter();

c.count(); // => 0
c.count(); // => 1
d.count(); // => 0 (independent counter)
c.reset(); // Reset c's counter
c.count(); // => 0
d.count(); // => 1 (d unaffected)
```

**Key insights**:

- Both methods (`count` and `reset`) share access to the same `n`
- Each call to `counter()` creates a **new scope** with its own `n`
- `c` and `d` have completely independent private variables

---

## Closures with Getters and Setters

Combine closures with property getters/setters for controlled access to private state.

```javascript
function counter(n) {
  return {
    get count() {
      return n++;
    },
    set count(m) {
      if (m > n) {
        n = m;
      } else {
        throw Error('count can only be set to a larger value');
      }
    },
  };
}

let c = counter(1000);
c.count; // => 1000
c.count; // => 1001
c.count = 2000; // Set to 2000
c.count; // => 2000
c.count = 1999; // Error: count can only be set to a larger value
```

**Note**: The parameter `n` itself serves as the private variable shared by both accessor methods.

---

## Advanced Example: Private Property Accessor

Create getter/setter methods for private properties with validation.

```javascript
function addPrivateProperty(o, name, predicate) {
  let value; // Private variable

  // Getter method
  o[`get${name}`] = function () {
    return value;
  };

  // Setter method with validation
  o[`set${name}`] = function (v) {
    if (predicate && !predicate(v)) {
      throw new TypeError(`set${name}: invalid value ${v}`);
    } else {
      value = v;
    }
  };
}

// Usage
let o = {};
addPrivateProperty(o, 'Name', (x) => typeof x === 'string');

o.setName('Frank'); // Set the property
o.getName(); // => "Frank"
o.setName(0); // TypeError: invalid value 0
```

**How it works**:

- `value` is stored only in the function's local scope
- Getter and setter methods are closures that access `value`
- The value cannot be accessed or modified except through these methods
- The predicate function validates values before storing

---

## Common Pitfall: Closures in Loops

### ❌ Incorrect: Shared Variable Problem

```javascript
function constfuncs() {
  let funcs = [];

  for (var i = 0; i < 10; i++) {
    funcs[i] = () => i;
  }

  return funcs;
}

let funcs = constfuncs();
funcs[5](); // => 10 (NOT 5!)
```

**Problem**:

- All 10 closures share access to the **same variable** `i`
- When `constfuncs()` returns, `i` is 10
- All functions return the same value (10)
- Variables declared with `var` are function-scoped, not block-scoped

**Why this happens**:

- Closures don't make private copies of variables
- The scope associated with a closure is **"live"**
- All closures reference the same `i`, which ends at 10

### ✅ Solution 1: Use `let` or `const` (ES6+)

```javascript
function constfuncs() {
  let funcs = [];

  for (let i = 0; i < 10; i++) {
    // Use let instead of var
    funcs[i] = () => i;
  }

  return funcs;
}

let funcs = constfuncs();
funcs[5](); // => 5 (correct!)
```

**Why this works**:

- `let` is **block-scoped**
- Each iteration creates a **new independent scope**
- Each scope has its own **independent binding** of `i`

### ✅ Solution 2: Create Separate Closures

```javascript
function constfunc(v) {
  return () => v;
}

let funcs = [];
for (var i = 0; i < 10; i++) {
  funcs[i] = constfunc(i); // Each call creates new scope
}

funcs[5](); // => 5
```

**Why this works**:

- Each call to `constfunc()` creates a new scope
- Each scope has its own parameter `v`
- Each returned function closes over a different `v`

---

## Closures and `this` Keyword

The `this` keyword behaves differently in closures depending on how the function is defined.

### Arrow Functions (inherit `this`)

```javascript
const obj = {
  name: 'MyObject',

  method() {
    const inner = () => {
      console.log(this.name); // Arrow function inherits this
    };
    inner();
  },
};

obj.method(); // => "MyObject"
```

### Regular Functions (don't inherit `this`)

```javascript
const obj = {
  name: 'MyObject',

  method() {
    const inner = function () {
      console.log(this.name); // this is undefined or global
    };
    inner();
  },
};

obj.method(); // => undefined (or error in strict mode)
```

### Solutions for Regular Functions

**Option 1: Save `this` to a variable**

```javascript
const obj = {
  method() {
    const self = this; // Capture this
    const inner = function () {
      console.log(self.name);
    };
    inner();
  },
};
```

**Option 2: Use `bind()`**

```javascript
const obj = {
  method() {
    const inner = function () {
      console.log(this.name);
    }.bind(this); // Bind this
    inner();
  },
};
```

**Option 3: Use `arrow` functions (preferred)**

```javascript
const obj = {
  method() {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  },
};
```

---

## Practical Use Cases for Closures

### 1. Data Privacy and Encapsulation

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        throw Error('Insufficient funds');
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

let account = createBankAccount(1000);
account.deposit(500); // => 1500
account.withdraw(200); // => 1300
account.getBalance(); // => 1300
// account.balance is not accessible!
```

### 2. Function Factories

```javascript
function makeMultiplier(x) {
  return function (y) {
    return x * y;
  };
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);

double(5); // => 10
triple(5); // => 15
```

### 3. Event Handlers with Private Data

```javascript
function setupButton(buttonId) {
  let clickCount = 0;

  document.getElementById(buttonId).addEventListener('click', function () {
    clickCount++;
    console.log(`Button clicked ${clickCount} times`);
  });
}
```

### 4. Module Pattern

```javascript
const calculator = (function () {
  let result = 0; // Private state

  return {
    add(x) {
      result += x;
      return this;
    },
    subtract(x) {
      result -= x;
      return this;
    },
    multiply(x) {
      result *= x;
      return this;
    },
    getResult() {
      return result;
    },
    reset() {
      result = 0;
      return this;
    },
  };
})();

calculator.add(10).multiply(2).subtract(5).getResult(); // => 15
```

---

## Key Concepts Summary

✅ **Lexical scoping**: Functions use the scope where they were **defined**, not invoked
✅ **Closure = function + scope**: Captures variables from outer function
✅ **Private state**: Closures enable data privacy and encapsulation
✅ **Shared access**: Multiple closures can share the same private variables
✅ **Live scope**: Closures reference actual variables, not copies
✅ **Loop pitfall**: Use `let`/`const` (not `var`) in loops to avoid shared variable bugs
✅ **`this` behavior**: Arrow functions inherit `this`, regular functions don't
✅ **Practical uses**: Data privacy, factories, event handlers, modules
✅ **Performance**: Each closure maintains a reference to its scope (memory consideration)

---

## Best Practices

🎯 **Use arrow functions** for closures that need to inherit `this`
🎯 **Use `let`/`const`** instead of `var` to avoid loop closure bugs
🎯 **Create separate scopes** when you need independent closures
🎯 **Be mindful of memory**: Closures keep outer scope variables in memory
🎯 **Use closures for encapsulation**: Hide implementation details
🎯 **Document closure behavior**: Make it clear when functions rely on closure state
