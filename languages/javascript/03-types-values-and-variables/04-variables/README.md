# JavaScript Variables - Complete Guide

## What is a Variable?

**Variable** = Container for storing data values

```javascript
let x = 5;
let y = 6;
let z = x + y; // z = 11
```

**Think of variables as:**

- Named storage boxes
- Labels for values
- References to data in memory

---

## 4 Ways to Declare Variables

### Overview Table

| Keyword | Scope    | Reassignable | Redeclarable | Hoisting              | Temporal Dead Zone | When Added |
| ------- | -------- | ------------ | ------------ | --------------------- | ------------------ | ---------- |
| `var`   | Function | ✅ Yes       | ✅ Yes       | Yes (undefined)       | ❌ No              | ES5 (old)  |
| `let`   | Block    | ✅ Yes       | ❌ No        | Yes (not initialized) | ✅ Yes             | ES6 (2015) |
| `const` | Block    | ❌ No        | ❌ No        | Yes (not initialized) | ✅ Yes             | ES6 (2015) |
| (none)  | Global   | ✅ Yes       | ✅ Yes       | No                    | ❌ No              | Implicit   |

---

## Method 1: Using `var` (Old Way - Avoid) ⚠️

```javascript
var x = 5;
var y = 6;
var z = x + y; // z = 11
```

### `var` Characteristics

#### 1. Function Scope (Not Block Scope)

```javascript
function test() {
  var x = 10;
  if (true) {
    var x = 20; // Same variable!
    console.log(x); // 20
  }
  console.log(x); // 20 (modified)
}
```

#### 2. Can Be Redeclared

```javascript
var x = 5;
var x = 10; // ✅ Allowed (no error)
console.log(x); // 10
```

#### 3. Can Be Reassigned

```javascript
var x = 5;
x = 10; // ✅ Allowed
console.log(x); // 10
```

#### 4. Hoisting (Moves to Top)

```javascript
console.log(x); // undefined (not error!)
var x = 5;

// JavaScript interprets as:
var x;
console.log(x); // undefined
x = 5;
```

#### 5. Creates Global Property

```javascript
var x = 5;
console.log(window.x); // 5 (in browser)
```

### ⚠️ Problems with `var`

```javascript
// Problem 1: No block scope
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Prints: 3, 3, 3 (not 0, 1, 2!)

// Problem 2: Accidental globals
function test() {
  var x = 5;
  if (true) {
    var y = 10; // Function scope, not block scope!
  }
  console.log(y); // 10 (accessible outside if block)
}

// Problem 3: Redeclaration bugs
var user = 'John';
// ... 1000 lines later ...
var user = 'Jane'; // Accidentally overwrites!
```

**Recommendation:** ❌ **Don't use `var` in modern JavaScript**

---

## Method 2: Using `let` (Modern Way) ✅

```javascript
let x = 5;
let y = 6;
let z = x + y; // z = 11
```

### `let` Characteristics

#### 1. Block Scope

```javascript
{
  let x = 10;
  console.log(x); // 10
}
console.log(x); // ReferenceError: x is not defined

// Example: if block
if (true) {
  let y = 20;
  console.log(y); // 20
}
console.log(y); // Error: y not defined

// Example: for loop
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
console.log(i); // Error: i not defined
```

#### 2. Cannot Be Redeclared (in same scope)

```javascript
let x = 5;
let x = 10; // ❌ SyntaxError: Identifier 'x' already declared

// But different scopes OK:
let y = 5;
{
  let y = 10; // ✅ Different scope
  console.log(y); // 10
}
console.log(y); // 5
```

#### 3. Can Be Reassigned

```javascript
let x = 5;
x = 10; // ✅ Allowed
x = 'hello'; // ✅ Allowed (type can change)
console.log(x); // "hello"
```

#### 4. Temporal Dead Zone (TDZ)

```javascript
console.log(x); // ❌ ReferenceError (not undefined!)
let x = 5;

// TDZ exists from start of block until declaration
{
  // TDZ starts
  console.log(x); // Error
  let x = 5; // TDZ ends
  console.log(x); // 5
}
```

#### 5. Does NOT Create Global Property

```javascript
let x = 5;
console.log(window.x); // undefined (not a window property)
```

### ✅ Use `let` When

- Variable value will change
- Counter in loops
- Temporary variables
- Conditional assignments

```javascript
// Example 1: Loop counter
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Example 2: Reassignment
let score = 0;
score = score + 10;
score = score + 5;

// Example 3: Conditional
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}
```

---

## Method 3: Using `const` (Modern Way - Preferred) ✅✅

```javascript
const x = 5;
const y = 6;
const z = x + y; // z = 11
```

### `const` Characteristics

#### 1. Block Scope (Same as `let`)

```javascript
{
  const x = 10;
  console.log(x); // 10
}
console.log(x); // Error: x not defined
```

#### 2. Cannot Be Redeclared

```javascript
const x = 5;
const x = 10; // ❌ SyntaxError
```

#### 3. Cannot Be Reassigned

```javascript
const x = 5;
x = 10; // ❌ TypeError: Assignment to constant variable
```

#### 4. MUST Be Initialized

```javascript
const x;  // ❌ SyntaxError: Missing initializer
const y = 5;  // ✅ Correct
```

#### 5. **IMPORTANT:** Objects/Arrays Are Mutable

```javascript
// ❌ Common Misconception: const makes value immutable
// ✅ Reality: const makes BINDING immutable

// Primitive values - truly constant
const x = 5;
x = 10; // ❌ Error

// Objects - reference constant, content mutable
const person = { name: 'John', age: 30 };
person.age = 31; // ✅ Allowed! (modifying property)
person.city = 'NYC'; // ✅ Allowed! (adding property)
console.log(person); // { name: "John", age: 31, city: "NYC" }

person = { name: 'Jane' }; // ❌ Error (reassigning object)

// Arrays - reference constant, content mutable
const numbers = [1, 2, 3];
numbers.push(4); // ✅ Allowed! (modifying array)
numbers[0] = 10; // ✅ Allowed! (changing element)
console.log(numbers); // [10, 2, 3, 4]

numbers = [5, 6, 7]; // ❌ Error (reassigning array)
```

#### 6. Temporal Dead Zone (Same as `let`)

```javascript
console.log(x); // ❌ ReferenceError
const x = 5;
```

### ✅ Use `const` When

- Value should never change (primitives)
- Object/Array reference should not change
- Constants and configuration
- **Default choice** (use unless you need to reassign)

```javascript
// Example 1: True constants
const PI = 3.14159;
const MAX_SIZE = 100;
const API_URL = 'https://api.example.com';

// Example 2: Configuration objects
const config = {
  apiKey: 'abc123',
  timeout: 5000,
};
config.timeout = 10000; // ✅ Can modify properties

// Example 3: Functions
const greet = function (name) {
  return `Hello, ${name}!`;
};

// Example 4: Arrays that will be modified
const items = [];
items.push('apple'); // ✅ Can modify array
```

### 🔒 Making Objects Truly Immutable

```javascript
// Method 1: Object.freeze() - shallow freeze
const person = Object.freeze({ name: 'John', age: 30 });
person.age = 31; // ❌ Silently fails (strict mode: error)
console.log(person.age); // 30 (unchanged)

// Method 2: Deep freeze (nested objects)
const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.values(obj).forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
};

const data = { user: { name: 'John' } };
deepFreeze(data);
data.user.name = 'Jane'; // ❌ Cannot change
```

---

## Method 4: Without Declaration (Implicit Global) ❌ **NEVER USE**

```javascript
x = 5; // Creates global variable automatically
y = 6;
z = x + y;
```

### Problems with Implicit Globals

#### 1. Creates Global Variable (Pollution)

```javascript
function test() {
  x = 10; // ❌ Creates global variable!
}
test();
console.log(x); // 10 (accessible everywhere)
console.log(window.x); // 10
```

#### 2. No Error Protection

```javascript
funtcion test() {  // Typo in "function"
  result = 10;  // Creates global instead of error
}
```

#### 3. Hard to Debug

```javascript
function calculate() {
  total = 100; // Where is this from?
}

function process() {
  total = 200; // Accidentally overwrites
}
```

#### 4. Strict Mode Prevents This

```javascript
'use strict';
x = 5; // ❌ ReferenceError: x is not defined
```

**Recommendation:** ❌ **NEVER declare variables without keywords**

---

## Variable Declaration Rules

### 1. Naming Rules (Identifiers)

#### ✅ **Allowed:**

```javascript
// Start with: letter, underscore, dollar sign
let name;
let _private;
let $jquery;
let userName;
let user_name;
let user123;

// Unicode allowed
let café = 'coffee';
let π = 3.14159;
let 名前 = 'name';
```

#### ❌ **Not Allowed:**

```javascript
// Cannot start with digit
let 123user;  // ❌ SyntaxError

// Cannot use reserved words
let let;  // ❌ SyntaxError
let const;  // ❌ SyntaxError
let function;  // ❌ SyntaxError
let if;  // ❌ SyntaxError

// Cannot use hyphens
let user-name;  // ❌ SyntaxError (use camelCase or underscore)

// Cannot use spaces
let user name;  // ❌ SyntaxError

// Cannot use special characters (except _ and $)
let user@name;  // ❌ SyntaxError
let user#name;  // ❌ SyntaxError
```

### 2. Naming Conventions (Best Practices)

#### camelCase (Recommended)

```javascript
let firstName = 'John';
let lastName = 'Doe';
let userAge = 30;
let isActive = true;
let getUserData = function () {};
```

#### PascalCase (for classes/constructors)

```javascript
class UserAccount {}
function Person() {}
```

#### UPPER_SNAKE_CASE (for constants)

```javascript
const MAX_SIZE = 100;
const API_KEY = 'abc123';
const DEFAULT_TIMEOUT = 5000;
```

#### snake_case (less common in JavaScript)

```javascript
let first_name = 'John';
let last_name = 'Doe';
```

### 3. Case Sensitivity

```javascript
let myVariable = 5;
let myvariable = 10;
let MYVARIABLE = 15;
let MyVariable = 20;

// All are DIFFERENT variables!
console.log(myVariable); // 5
console.log(myvariable); // 10
console.log(MYVARIABLE); // 15
console.log(MyVariable); // 20
```

---

## Variable Scope

### 1. Global Scope

```javascript
let globalVar = "I'm global";

function test() {
  console.log(globalVar); // Accessible
}

test(); // "I'm global"
console.log(globalVar); // "I'm global"
```

### 2. Function Scope (`var`)

```javascript
function test() {
  var functionVar = "I'm function scoped";
  console.log(functionVar); // Accessible
}

test();
console.log(functionVar); // ❌ Error: not defined
```

### 3. Block Scope (`let` and `const`)

```javascript
{
  let blockVar = "I'm block scoped";
  const blockConst = 'Me too';
  console.log(blockVar); // Accessible
}
console.log(blockVar); // ❌ Error: not defined

// if block
if (true) {
  let x = 10;
}
console.log(x); // ❌ Error

// for loop block
for (let i = 0; i < 3; i++) {
  console.log(i);
}
console.log(i); // ❌ Error

// while block
while (condition) {
  let y = 20;
}
console.log(y); // ❌ Error
```

### 4. Nested Scope (Scope Chain)

```javascript
let global = 'global';

function outer() {
  let outerVar = 'outer';

  function inner() {
    let innerVar = 'inner';
    console.log(innerVar); // ✅ "inner"
    console.log(outerVar); // ✅ "outer"
    console.log(global); // ✅ "global"
  }

  inner();
  console.log(innerVar); // ❌ Error
}

outer();
console.log(outerVar); // ❌ Error
```

---

## Variable Hoisting

### `var` Hoisting

```javascript
console.log(x); // undefined (not error)
var x = 5;
console.log(x); // 5

// JavaScript interprets as:
var x; // Declaration hoisted
console.log(x); // undefined
x = 5; // Assignment stays in place
console.log(x); // 5
```

### `let` and `const` Hoisting (Temporal Dead Zone)

```javascript
console.log(x); // ❌ ReferenceError
let x = 5;

console.log(y); // ❌ ReferenceError
const y = 10;

// They ARE hoisted, but in "temporal dead zone" until declaration
```

### Function Hoisting

```javascript
// Function declarations are hoisted
sayHello(); // ✅ Works! "Hello"
function sayHello() {
  console.log('Hello');
}

// Function expressions are NOT hoisted
sayGoodbye(); // ❌ TypeError
var sayGoodbye = function () {
  console.log('Goodbye');
};
```

---

## Multiple Variable Declaration

### Method 1: Separate Lines (Recommended)

```javascript
let x = 5;
let y = 6;
let z = 7;
```

### Method 2: Single Line (Comma-separated)

```javascript
let x = 5,
  y = 6,
  z = 7;
```

### Method 3: Multi-line (Readable)

```javascript
let x = 5,
  y = 6,
  z = 7;
```

### Method 4: Without Initial Value

```javascript
let x, y, z;
x = 5;
y = 6;
z = 7;

console.log(x); // 5
console.log(y); // 6
console.log(z); // 7
```

### ⚠️ Mixed Keywords Not Allowed

```javascript
let x = 5, const y = 10;  // ❌ SyntaxError
```

---

## Variable Value Types

### 1. Undefined

```javascript
let x;
console.log(x); // undefined

let y = undefined;
console.log(y); // undefined
```

### 2. Numbers

```javascript
let age = 30;
let price = 19.99;
let negative = -10;
let scientific = 5e3; // 5000
```

### 3. Strings

```javascript
let name = 'John';
let greeting = 'Hello';
let template = `Hello ${name}`;
```

### 4. Booleans

```javascript
let isActive = true;
let isCompleted = false;
```

### 5. Null

```javascript
let empty = null;
```

### 6. Objects

```javascript
let person = {
  name: 'John',
  age: 30,
};

let car = {}; // Empty object
```

### 7. Arrays

```javascript
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, 'hello', true, null];
let empty = [];
```

### 8. Functions

```javascript
let greet = function (name) {
  return `Hello ${name}`;
};
```

---

## Re-declaring Variables

### `var` - Can Redeclare

```javascript
var x = 5;
var x = 10; // ✅ No error
console.log(x); // 10
```

### `let` - Cannot Redeclare (same scope)

```javascript
let x = 5;
let x = 10; // ❌ SyntaxError

// But can in different scope:
let y = 5;
{
  let y = 10; // ✅ Different scope
  console.log(y); // 10
}
console.log(y); // 5
```

### `const` - Cannot Redeclare

```javascript
const x = 5;
const x = 10; // ❌ SyntaxError
```

### Mixed Redeclaration

```javascript
var x = 5;
let x = 10; // ❌ SyntaxError

let y = 5;
var y = 10; // ❌ SyntaxError

let z = 5;
const z = 10; // ❌ SyntaxError
```

---

## JavaScript Dollar Sign ($) Variables

### Standard Use

```javascript
let $ = 'dollar';
let $name = 'John';
let $_value = 100;
```

### jQuery Convention

```javascript
let $ = jQuery; // Common pattern
let $button = $('#myButton'); // jQuery object
```

---

## JavaScript Underscore (\_) Variables

### Private Convention

```javascript
let _privateVar = 'private';
let _internalMethod = function () {};

class User {
  constructor() {
    this._id = 123; // Convention: "private" property
  }
}
```

### Unused Variables

```javascript
let [first, , third] = [1, 2, 3]; // Skip second
let [_, ...rest] = [1, 2, 3, 4]; // Don't care about first
```

---

## Best Practices Summary

### ✅ DO

```javascript
// 1. Use const by default
const PI = 3.14159;
const user = { name: 'John' };

// 2. Use let when value changes
let counter = 0;
for (let i = 0; i < 5; i++) {}

// 3. Use meaningful names
const userAge = 30;
const isAuthenticated = true;

// 4. camelCase for variables
const firstName = 'John';

// 5. UPPER_CASE for constants
const MAX_RETRY = 3;

// 6. Declare at top of scope
function test() {
  const x = 5;
  let y = 10;
  // ... rest of code
}

// 7. One variable per line
const name = 'John';
const age = 30;
const city = 'NYC';
```

### ❌ DON'T

```javascript
// 1. Don't use var
var x = 5;  // ❌

// 2. Don't use implicit globals
x = 5;  // ❌

// 3. Don't use unclear names
let x = "John";  // ❌
let temp = true;  // ❌
let data = 123;  // ❌

// 4. Don't start with numbers
let 1user = "John";  // ❌

// 5. Don't use reserved words
let let = 5;  // ❌
let function = true;  // ❌

// 6. Don't modify const objects when you shouldn't
const config = { api: "url" };
config.api = "new";  // ⚠️ Allowed but may not be desired
```

---

## Complete Comparison Chart

| Feature             | var             | let       | const       | (none)   |
| ------------------- | --------------- | --------- | ----------- | -------- |
| **Scope**           | Function        | Block     | Block       | Global   |
| **Reassign**        | ✅ Yes          | ✅ Yes    | ❌ No       | ✅ Yes   |
| **Redeclare**       | ✅ Yes          | ❌ No     | ❌ No       | ✅ Yes   |
| **Hoisting**        | Yes (undefined) | Yes (TDZ) | Yes (TDZ)   | No       |
| **Must Initialize** | ❌ No           | ❌ No     | ✅ Yes      | ❌ No    |
| **Global Property** | ✅ Yes          | ❌ No     | ❌ No       | ✅ Yes   |
| **Use in 2024**     | ❌ No           | ✅ Yes    | ✅✅ Prefer | ❌ Never |

---

## Quick Decision Tree

```text
Need to declare a variable?
│
├─ Value will NEVER change?
│  └─ Use const ✅
│
├─ Value will change?
│  └─ Use let ✅
│
├─ Working with legacy code?
│  └─ var (only if necessary) ⚠️
│
└─ No keyword?
   └─ NEVER do this ❌
```

---

## Key Takeaways

1. **Always use `const` by default** - only use `let` when you need to reassign
2. **Never use `var`** - it has confusing scoping rules
3. **Never declare without keyword** - creates global variables
4. **Use meaningful, descriptive names** - code is read more than written
5. **Follow camelCase convention** - standard JavaScript style
6. **Remember: `const` protects the binding, not the value** - objects/arrays can still be modified
7. **Understand scope** - block scope (`let`/`const`) vs function scope (`var`)
8. **Be aware of hoisting** - declarations are moved to top of scope
9. **Use strict mode** - prevents common mistakes
10. **One declaration per line** - easier to read and maintain
