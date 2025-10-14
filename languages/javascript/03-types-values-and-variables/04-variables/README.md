# JavaScript Variables

## Table of Contents

1. [What is a Variable?](#what-is-a-variable)
2. [Declaration Methods Overview](#declaration-methods-overview)
3. [Modern Declarations: `let` and `const`](#modern-declarations-let-and-const)
4. [Legacy Declaration: `var`](#legacy-declaration-var)
5. [Implicit Globals (No Keyword)](#implicit-globals-no-keyword)
6. [Variable Naming Rules](#variable-naming-rules)
7. [Scope and Hoisting](#scope-and-hoisting)
8. [Destructuring Assignment](#destructuring-assignment)
9. [Best Practices](#best-practices)
10. [Quick Reference](#quick-reference)

---

## What is a Variable?

**Variable** = A named container for storing data values

Variables bind names to values, allowing you to store and reference data in your programs.

```javascript
let x = 5;
let y = 6;
let z = x + y; // z = 11
```

**Think of variables as:**

- Named storage boxes
- Labels for values
- References to data in memory

### Variables vs Constants

- **Variable**: Value can change during program execution
- **Constant**: Value is permanently assigned (cannot be reassigned)

---

## Declaration Methods Overview

### Four Ways to Declare Variables

| Keyword | Scope    | Reassignable | Redeclarable | Hoisting              | TDZ    | Must Initialize | Global Property | When Added | Use in 2024     |
| ------- | -------- | ------------ | ------------ | --------------------- | ------ | --------------- | --------------- | ---------- | --------------- |
| `const` | Block    | ❌ No        | ❌ No        | Yes (not initialized) | ✅ Yes | ✅ Yes          | ❌ No           | ES6 (2015) | ✅✅ **Prefer** |
| `let`   | Block    | ✅ Yes       | ❌ No        | Yes (not initialized) | ✅ Yes | ❌ No           | ❌ No           | ES6 (2015) | ✅ **Use**      |
| `var`   | Function | ✅ Yes       | ✅ Yes       | Yes (undefined)       | ❌ No  | ❌ No           | ✅ Yes          | ES5 (old)  | ❌ **Avoid**    |
| (none)  | Global   | ✅ Yes       | ✅ Yes       | No                    | ❌ No  | ❌ No           | ✅ Yes          | Implicit   | ❌ **Never**    |

**TDZ** = Temporal Dead Zone

---

## Modern Declarations: `let` and `const`

### Using `let` (For Variables)

`let` declares block-scoped variables that can be reassigned.

#### Basic Syntax

```javascript
let i; // Declare without initialization (value = undefined)
let sum;
let i, sum; // Multiple declarations
let message = 'hello'; // Declare with initialization (✅ recommended)
let i = 0,
  j = 0,
  k = 0;
let x = 2,
  y = x * x; // Can use previously declared variables
```

#### Key Characteristics

**1. Block Scope**

```javascript
{
  let x = 10;
  console.log(x); // 10
}
console.log(x); // ❌ ReferenceError: x is not defined

// Example: if block
if (true) {
  let y = 20;
  console.log(y); // 20
}
console.log(y); // ❌ Error: y not defined

// Example: for loop
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
console.log(i); // ❌ Error: i not defined
```

**2. Cannot Be Redeclared (in same scope)**

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

**3. Can Be Reassigned**

```javascript
let x = 5;
x = 10; // ✅ Allowed
x = 'hello'; // ✅ Allowed (type can change)
console.log(x); // "hello"
```

**4. Temporal Dead Zone (TDZ)**

```javascript
console.log(x); // ❌ ReferenceError (not undefined!)
let x = 5;

// TDZ exists from start of block until declaration
{
  // TDZ starts
  console.log(x); // ❌ Error
  let x = 5; // TDZ ends
  console.log(x); // 5
}
```

**5. Does NOT Create Global Property**

```javascript
let x = 5;
console.log(window.x); // undefined (not a window property)
```

#### Loop Variables with `let`

```javascript
// Standard loops
for (let i = 0, len = data.length; i < len; i++) console.log(data[i]);

// for/of and for/in
for (let datum of data) console.log(datum);
for (let property in object) console.log(property);

// ✅ Fixes the classic closure problem
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Prints: 0, 1, 2 (correct!)
```

#### Use `let` When

- Variable value will change
- Counter in loops
- Temporary variables
- Conditional assignments

---

### Using `const` (For Constants)

`const` declares block-scoped constants that cannot be reassigned.

#### Basic Syntax

```javascript
const H0 = 74; // Must initialize when declaring
const C = 299792.458;
const AU = 1.496e8;

// Convention: Use UPPERCASE for true constants
const HTTP_NOT_FOUND = 404;
const MAX_SIZE = 100;

// Attempting to change throws TypeError
H0 = 75; // ❌ TypeError: Assignment to constant variable
```

#### Key Characteristics

**1. Block Scope (Same as `let`)**

```javascript
{
  const x = 10;
  console.log(x); // 10
}
console.log(x); // ❌ Error: x not defined
```

**2. Cannot Be Redeclared**

```javascript
const x = 5;
const x = 10; // ❌ SyntaxError
```

**3. Cannot Be Reassigned**

```javascript
const x = 5;
x = 10; // ❌ TypeError: Assignment to constant variable
```

**4. MUST Be Initialized**

```javascript
const x;                 // ❌ SyntaxError: Missing initializer
const y = 5;             // ✅ Correct
```

**5. CRITICAL: Objects/Arrays Are Mutable**

```javascript
// ❌ Common Misconception: const makes value immutable
// ✅ Reality: const makes BINDING immutable (reference constant)

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

**6. Temporal Dead Zone (Same as `let`)**

```javascript
console.log(x); // ❌ ReferenceError
const x = 5;
```

#### Loop Variables with `const`

```javascript
// You CAN use const if loop body doesn't reassign
for (const datum of data) console.log(datum); // ✅ OK
for (const property in object) console.log(property); // ✅ OK

// The value is constant for the duration of one loop iteration
```

#### Making Objects Truly Immutable

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

#### When to Use `const`

**Two Philosophies:**

1. **Conservative Approach**: Use `const` only for truly unchanging values

   - Physical constants: `const PI = 3.14159;`
   - Configuration values: `const API_URL = "https://api.example.com";`
   - Version numbers: `const VERSION = "1.0.0";`

2. **Liberal Approach** (Recommended): Use `const` by default
   - Declare everything with `const`
   - Switch to `let` only when you need to reassign
   - Helps prevent bugs by ruling out accidental changes

#### Use `const` When

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

---

## Legacy Declaration: `var`

### ⚠️ Avoid in Modern Code

`var` is the old way to declare variables. It has confusing behavior and should be avoided.

#### Basic Syntax

```javascript
var x;
var data = [],
  count = data.length;
for (var i = 0; i < count; i++) console.log(data[i]);
```

#### Key Differences from `let`/`const`

**1. Function Scope (Not Block Scope)**

```javascript
function test() {
  var x = 10;
  if (true) {
    var x = 20; // Same variable!
    console.log(x); // 20
  }
  console.log(x); // 20 (modified)
}

// Block scope doesn't work
{
  var y = 5;
}
console.log(y); // 5 (accessible outside block!)
```

**2. Creates Global Property**

```javascript
var x = 5;
console.log(window.x); // 5 (in browser)
console.log(globalThis.x); // 5

// Properties created with var cannot be deleted
delete window.x; // false
```

**3. Can Be Redeclared**

```javascript
var x = 5;
var x = 10; // ✅ Allowed (no error)
console.log(x); // 10

// Common in loops
for (var i = 0; i < 5; i++) {}
for (var i = 0; i < 3; i++) {} // Same 'i' redeclared
```

**4. Hoisting to Function Top**

```javascript
console.log(x); // undefined (not an error!)
var x = 5;
console.log(x); // 5

// JavaScript interprets as:
var x; // Declaration hoisted to top
console.log(x); // undefined
x = 5; // Initialization stays in place
console.log(x); // 5
```

#### Problems with `var`

```javascript
// Problem 1: No block scope
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Prints: 3, 3, 3 (not 0, 1, 2!) ❌

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
var user = 'Jane'; // Accidentally overwrites! ❌

// Problem 4: Hoisting confusion
console.log(price); // undefined (confusing!)
var price = 100;
```

**Recommendation:** ❌ **Don't use `var` in modern JavaScript**

---

## Implicit Globals (No Keyword)

### ❌ NEVER USE THIS

Declaring variables without a keyword creates global variables automatically.

```javascript
x = 5; // Creates global variable
y = 6;
z = x + y;
```

#### Problems with Implicit Globals

**1. Creates Global Variable (Pollution)**

```javascript
function test() {
  x = 10; // ❌ Creates global variable!
}
test();
console.log(x); // 10 (accessible everywhere)
console.log(window.x); // 10
```

**2. No Error Protection**

```javascript
funtcion test() {        // Typo in "function"
  result = 10;           // Creates global instead of error
}
```

**3. Hard to Debug**

```javascript
function calculate() {
  total = 100; // Where is this from?
}

function process() {
  total = 200; // Accidentally overwrites
}
```

**4. Strict Mode Prevents This**

```javascript
'use strict';
x = 5; // ❌ ReferenceError: x is not defined
```

#### Properties Can Be Deleted

```javascript
x = 5; // Implicit global
delete x; // true (can be deleted)

var y = 10; // var global
delete y; // false (cannot be deleted)
```

**Recommendation:** ❌ **NEVER declare variables without keywords**

---

## Variable Naming Rules

### Valid Identifiers

#### ✅ Allowed

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

#### ❌ Not Allowed

```javascript
// Cannot start with digit
let 123user;             // ❌ SyntaxError

// Cannot use reserved words
let let;                 // ❌ SyntaxError
let const;               // ❌ SyntaxError
let function;            // ❌ SyntaxError
let if;                  // ❌ SyntaxError
let class;               // ❌ SyntaxError

// Cannot use hyphens
let user-name;           // ❌ SyntaxError (use camelCase or underscore)

// Cannot use spaces
let user name;           // ❌ SyntaxError

// Cannot use special characters (except _ and $)
let user@name;           // ❌ SyntaxError
let user#name;           // ❌ SyntaxError
```

### Naming Conventions (Best Practices)

#### 1. camelCase (Recommended for variables)

```javascript
let firstName = 'John';
let lastName = 'Doe';
let userAge = 30;
let isActive = true;
let getUserData = function () {};
```

#### 2. PascalCase (For classes/constructors)

```javascript
class UserAccount {}
function Person() {}
const MyComponent = () => {};
```

#### 3. UPPER_SNAKE_CASE (For constants)

```javascript
const MAX_SIZE = 100;
const API_KEY = 'abc123';
const DEFAULT_TIMEOUT = 5000;
const HTTP_NOT_FOUND = 404;
```

#### 4. snake_case (Less common in JavaScript)

```javascript
let first_name = 'John';
let last_name = 'Doe';
```

### Case Sensitivity

JavaScript is **case-sensitive**:

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

### Special Characters

#### Dollar Sign ($)

```javascript
// Standard use
let $ = 'dollar';
let $name = 'John';
let $_value = 100;

// jQuery convention
let $ = jQuery; // Common pattern
let $button = $('#myButton'); // jQuery object
```

#### Underscore (\_)

```javascript
// Private convention
let _privateVar = 'private';
let _internalMethod = function () {};

class User {
  constructor() {
    this._id = 123; // Convention: "private" property
  }
}

// Unused variables
let [first, , third] = [1, 2, 3]; // Skip second
let [_, ...rest] = [1, 2, 3, 4]; // Don't care about first
```

---

## Scope and Hoisting

### Variable Scope

Scope determines where variables are accessible in your code.

#### 1. Global Scope

Variables declared outside any function or block.

```javascript
let globalVar = "I'm global";

function test() {
  console.log(globalVar); // Accessible
}

test(); // "I'm global"
console.log(globalVar); // "I'm global"
```

**Global Scope Variations:**

- **In Node/modules**: Scoped to the file
- **In browser scripts**: Scoped to the HTML document (shared across `<script>` tags)

#### 2. Function Scope (`var`)

Variables declared with `var` are scoped to the containing function.

```javascript
function test() {
  var functionVar = "I'm function scoped";
  console.log(functionVar); // Accessible
}

test();
console.log(functionVar); // ❌ Error: not defined
```

#### 3. Block Scope (`let` and `const`)

Variables declared with `let`/`const` are scoped to the containing block `{}`.

```javascript
// Basic block
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

**Block includes:**

- Functions and classes
- if/else statements
- Loops (for, while, do-while)
- switch statements
- Try/catch blocks
- Standalone blocks `{}`

#### 4. Nested Scope (Scope Chain)

Inner scopes can access outer scopes (but not vice versa).

```javascript
let global = 'global';

function outer() {
  let outerVar = 'outer';

  function inner() {
    let innerVar = 'inner';
    console.log(innerVar); // ✅ "inner"
    console.log(outerVar); // ✅ "outer" (from parent)
    console.log(global); // ✅ "global" (from grandparent)
  }

  inner();
  console.log(innerVar); // ❌ Error
}

outer();
console.log(outerVar); // ❌ Error
```

#### Scope Rules Summary

```javascript
const x = 1; // Global scope
if (x === 1) {
  let x = 2; // Different x in block scope
  console.log(x); // 2
}
console.log(x); // 1 (global x)

let x = 3; // ❌ SyntaxError! Can't redeclare in same scope
```

**Key Rules:**

- ✅ Can declare same name in **nested scope**
- ❌ Cannot redeclare same name in **same scope**
- Variables and constants declared in loops have the loop body as their scope

### Variable Hoisting

Hoisting = JavaScript moves declarations to the top of their scope before execution.

#### `var` Hoisting

```javascript
console.log(x); // undefined (not error!)
var x = 5;
console.log(x); // 5

// JavaScript interprets as:
var x; // Declaration hoisted to top
console.log(x); // undefined
x = 5; // Assignment stays in place
console.log(x); // 5
```

#### `let` and `const` Hoisting (Temporal Dead Zone)

```javascript
console.log(x); // ❌ ReferenceError
let x = 5;

console.log(y); // ❌ ReferenceError
const y = 10;

// They ARE hoisted, but in "temporal dead zone" until declaration
{
  // TDZ starts
  console.log(x); // ❌ Error
  let x = 5; // TDZ ends
  console.log(x); // 5 (now accessible)
}
```

#### Function Hoisting

```javascript
// Function declarations ARE fully hoisted
sayHello(); // ✅ Works! "Hello"
function sayHello() {
  console.log('Hello');
}

// Function expressions are NOT hoisted
sayGoodbye(); // ❌ TypeError
var sayGoodbye = function () {
  console.log('Goodbye');
};

// With let/const
greet(); // ❌ ReferenceError (TDZ)
const greet = function () {
  console.log('Hi');
};
```

---

## Destructuring Assignment

ES6 feature that extracts values from arrays or objects into variables.

### Array Destructuring

#### Basic Usage

```javascript
let [x, y] = [1, 2]; // x=1, y=2
[x, y] = [x + 1, y + 1]; // x=2, y=3
[x, y] = [y, x]; // Swap values!

// With functions returning arrays
function toPolar(x, y) {
  return [Math.sqrt(x * x + y * y), Math.atan2(y, x)];
}

function toCartesian(r, theta) {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

let [r, theta] = toPolar(1.0, 1.0); // r == Math.sqrt(2); theta == Math.PI/4
let [x, y] = toCartesian(r, theta); // [x, y] == [1.0, 1.0]
```

#### Advanced Patterns

```javascript
// Extra variables = undefined
let [x, y] = [1]; // x=1, y=undefined

// Extra values = ignored
[x, y] = [1, 2, 3]; // x=1, y=2 (3 is ignored)

// Skip values with commas
[, x, , y] = [1, 2, 3, 4]; // x=2, y=4 (skip 1 and 3)

// Rest operator (...)
let [x, ...y] = [1, 2, 3, 4]; // x=1, y=[2,3,4]

// Nested arrays
let [a, [b, c]] = [1, [2, 2.5], 3]; // a=1, b=2, c=2.5

// Works with any iterable
let [first, ...rest] = 'Hello'; // first="H", rest=["e","l","l","o"]
```

#### In Loops

```javascript
let o = { x: 1, y: 2 };
for (const [name, value] of Object.entries(o)) {
  console.log(name, value); // "x 1" then "y 2"
}
```

### Object Destructuring

#### Basic Usage

```javascript
let transparent = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
let { r, g, b } = transparent; // r=0.0, g=0.0, b=0.0

// Extract methods from objects
const { sin, cos, tan } = Math;

// Same as:
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
```

#### Renaming Variables

```javascript
// Syntax: {propertyName: variableName}
const { cos: cosine, tan: tangent } = Math;
// cosine = Math.cos, tangent = Math.tan

// More examples
let { r: red, g: green, b: blue } = transparent;
// red=0.0, green=0.0, blue=0.0
```

**Remember:** Property names are always on the **left** of the colon in destructuring.

#### Complex Destructuring

```javascript
// Array of objects
let points = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
];
let [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points;
// x1=1, y1=2, x2=3, y2=4

// Object of arrays
let points = { p1: [1, 2], p2: [3, 4] };
let {
  p1: [x1, y1],
  p2: [x2, y2],
} = points;
// x1=1, y1=2, x2=3, y2=4
```

**Note:** Complex destructuring can be hard to read. Consider using traditional code like `let x1 = points.p1[0];` for clarity.

#### Understanding Complex Destructuring

**Rule:** After destructuring, the left-hand side pattern should work as a valid literal.

```javascript
// If this destructuring works:
let [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points;

// Then this should also work (and does):
let points2 = [
  { x: x1, y: y1 },
  { x: x2, y: y2 },
];
```

### Destructuring with Declaration Keywords

```javascript
// Can use const, let, or var
const [a, b] = [1, 2];
let [c, d] = [3, 4];
var [e, f] = [5, 6];

// Can also use without declaration (for already-declared variables)
let x, y;
[x, y] = [10, 20];
```

---

## Best Practices

### Decision Tree

```
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
const lastName = 'Doe';

// 5. UPPER_CASE for true constants
const MAX_RETRY = 3;
const API_KEY = 'abc123';

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

// 8. Initialize when possible
let message = 'hello'; // ✅ Good
let count = 0; // ✅ Good

// 9. Use destructuring for clarity
const { name, age } = user;
const [first, second] = array;

// 10. Always use strict mode
('use strict');
```

### ❌ DON'T

```javascript
// 1. Don't use var
var x = 5;                 // ❌

// 2. Don't use implicit globals
x = 5;                     // ❌

// 3. Don't use unclear names
let x = "John";            // ❌
let temp = true;           // ❌
let data = 123;            // ❌

// 4. Don't start with numbers
let 1user = "John";        // ❌

// 5. Don't use reserved words
let let = 5;               // ❌
let function = true;       // ❌

// 6. Don't redeclare in same scope
let name = "John";
let name = "Jane";         // ❌

// 7. Don't declare without initialization unless necessary
let count;                 // ⚠️ Avoid if you can initialize
let count = 0;             // ✅ Better

// 8. Don't make complex destructuring
let [{x: {y: {z: value}}}] = data; // ❌ Too complex
let value = data[0].x.y.z;         // ✅ Clearer

// 9. Don't modify const objects if immutability is important
const config = { api: "url" };
config.api = "new";        // ⚠️ Allowed but may not be desired
Object.freeze(config);     // ✅ Better if truly immutable
```

### Variable Declaration Summary

1. **Use `const` by default** - prevents accidental reassignment
2. **Use `let`** when you need to reassign
3. **Never use `var`** - has confusing scoping and hoisting
4. **Never declare without keyword** - creates accidental globals
5. **Always use strict mode** - catches common mistakes
6. **Initialize when declaring** - makes code clearer
7. **Use meaningful names** - code is read more than written
8. **Follow camelCase convention** - standard
