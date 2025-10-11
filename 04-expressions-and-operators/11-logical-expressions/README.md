# JavaScript Logical Expressions

## What Are Logical Expressions?

Logical expressions use logical operators (`&&`, `||`, `!`) and conditional operators (ternary `? :`) to perform Boolean algebra and conditional evaluations. They're commonly combined with relational operators to create complex conditions.

---

## Truthy and Falsy Values

Before understanding logical operators, you need to know JavaScript's type coercion:

**Falsy values (only 7):**

- `false`
- `null`
- `undefined`
- `0`
- `-0`
- `NaN`
- `""` (empty string)

**Truthy values:**

- Everything else! (all objects, non-empty strings, non-zero numbers, arrays, functions, etc.)

---

## 1. Logical AND (`&&`)

### Basic Usage

Returns `true` only if **both** operands are true:

```javascript
true && true; // true
true && false; // false
false && true; // false
false && false; // false
```

### With Relational Operators

```javascript
x === 0 && y === 0; // true only if both x and y are 0
age >= 18 && hasLicense; // true if both conditions met
```

### How It Actually Works (Short-Circuit Evaluation)

1. Evaluates the **left** operand first
2. If left is **falsy** → returns left value immediately (doesn't evaluate right)
3. If left is **truthy** → evaluates and returns the **right** value

```javascript
// Returns the first falsy value, or the last value if all truthy
false && 'hello'; // false
0 && 'hello'; // 0
'' && 'hello'; // ""
'hi' && 'hello'; // "hello"
'hi' && 'hello' && 5; // 5

// Practical examples
let o = { x: 1 };
let p = null;

o && o.x; // 1 (o is truthy, so return o.x)
p && p.x; // null (p is falsy, so return p without evaluating p.x - avoids error!)
```

### Common Patterns

**Guard Pattern (Prevent Errors):**

```javascript
user && user.address && user.address.city; // Safe navigation
```

**Conditional Execution:**

```javascript
// Instead of if statement
if (isLoggedIn) showDashboard();

// Using &&
isLoggedIn && showDashboard(); // Only calls function if true
```

**Component Rendering (React):**

```javascript
{
  isLoading && <Spinner />;
} // Only render if true
```

---

## 2. Logical OR (`||`)

### Basic Usage

Returns `true` if **at least one** operand is true:

```javascript
true || true; // true
true || false; // true
false || true; // true
false || false; // false
```

### How It Actually Works (Short-Circuit Evaluation)

1. Evaluates the **left** operand first
2. If left is **truthy** → returns left value immediately (doesn't evaluate right)
3. If left is **falsy** → evaluates and returns the **right** value

```javascript
// Returns the first truthy value, or the last value if all falsy
'hello' || 'world'; // "hello"
false || 'world'; // "world"
0 || 100; // 100
'' || 'default'; // "default"
null || undefined || 'finally'; // "finally"

false || 0 || ''; // "" (all falsy, returns last)
```

### Common Patterns

**Default Values:**

```javascript
// Use first truthy value
let max = maxWidth || preferences.maxWidth || 500;

// Function parameters (pre-ES6)
function greet(name) {
  name = name || 'Guest';
  console.log('Hello, ' + name);
}

greet(); // "Hello, Guest"
greet('Alice'); // "Hello, Alice"
```

**Configuration Objects:**

```javascript
const settings = userSettings || defaultSettings;
```

### ⚠️ Important Caveat

The `||` operator treats `0`, `""`, and `false` as falsy, which can cause bugs:

```javascript
let count = 0;
let display = count || 10; // display = 10 (oops! 0 is valid but falsy)

// Better: Use nullish coalescing (??) for this case
let display = count ?? 10; // display = 0 (only replaces null/undefined)
```

---

## 3. Logical NOT (`!`)

### Basic Usage

**Unary operator** that inverts the boolean value:

```javascript
!true; // false
!false; // true
```

### How It Works

1. Converts operand to boolean
2. Returns the opposite

```javascript
// With truthy/falsy values
!'hello'; // false (string is truthy)
!0; // true (0 is falsy)
!null; // true (null is falsy)
![]; // false (arrays are truthy)
!{}; // false (objects are truthy)
```

### Double NOT (`!!`) - Boolean Conversion

Convert any value to its boolean equivalent:

```javascript
!!'hello'; // true
!!0; // false
!!null; // false
!![]; // true
!!{}; // true

// Equivalent to Boolean()
Boolean('hello'); // true
!!'hello'; // true
```

### Practical Examples

```javascript
// Check if array is empty
if (!array.length) {
  console.log('Array is empty');
}

// Toggle boolean
let isVisible = true;
isVisible = !isVisible; // false

// Invert complex expression (use parentheses!)
if (!(age >= 18 && hasPermission)) {
  console.log('Access denied');
}
```

---

## 4. Ternary Operator (`? :`)

### What Is It?

The **ternary operator** (also called conditional operator) is the **only operator in JavaScript that takes three operands**. It's a concise way to write `if-else` statements in a single expression.

### Syntax

```javascript
condition ? valueIfTrue : valueIfFalse;
```

### Basic Usage

```javascript
// Traditional if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// Ternary operator (same result, one line)
let message = age >= 18 ? 'Adult' : 'Minor';
```

### How It Works

1. Evaluates the **condition** (before `?`)
2. If condition is **truthy** → returns the expression after `?`
3. If condition is **falsy** → returns the expression after `:`

```javascript
true ? 'yes' : 'no'; // "yes"
false ? 'yes' : 'no'; // "no"

5 > 3 ? 'bigger' : 'smaller'; // "bigger"
'' ? 'truthy' : 'falsy'; // "falsy"
```

### Common Patterns

**Variable Assignment:**

```javascript
const status = isOnline ? 'Active' : 'Offline';
const price = isMember ? 9.99 : 14.99;
const greeting = time < 12 ? 'Good morning' : 'Good afternoon';
```

**Function Returns:**

```javascript
function getDiscount(isMember) {
  return isMember ? 0.2 : 0.1;
}

// Arrow function
const getDiscount = (isMember) => (isMember ? 0.2 : 0.1);
```

**Rendering in JSX (React):**

```javascript
return <div>{isLoggedIn ? <Dashboard /> : <Login />}</div>;
```

**Setting Attributes:**

```javascript
const button = `<button class="${isActive ? 'active' : 'inactive'}">Click</button>`;
```

**Default Values with Checks:**

```javascript
const name = userName ? userName : 'Anonymous';
// Note: || is often better for this specific case
const name = userName || 'Anonymous';
```

### Nested Ternary Operators

You can nest ternary operators, but **be careful** - they can become hard to read:

```javascript
// Simple nesting
const result = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'F';

// More complex (harder to read)
const access = isAdmin
  ? 'full'
  : isModerator
    ? 'moderate'
    : isUser
      ? 'limited'
      : 'none';
```

**Better alternative for complex conditions:**

```javascript
// More readable with if-else
let grade;
if (score >= 90) grade = 'A';
else if (score >= 80) grade = 'B';
else if (score >= 70) grade = 'C';
else grade = 'F';

// Or use a function
function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'F';
}
```

### Ternary vs. If-Else vs. &&/||

**Use Ternary When:**

- You need to choose between **two values**
- The logic is simple and readable
- You need an expression (not a statement)

**Use If-Else When:**

- You have complex logic or multiple conditions
- You need to execute multiple statements
- Readability is more important than brevity

**Use &&/|| When:**

- You only need **one** alternative (not two)
- You're doing conditional execution or default values

```javascript
// TERNARY: Two alternatives
const msg = isValid ? 'Success' : 'Error';

// IF-ELSE: Complex logic
if (isValid && hasPermission) {
  doMultipleThings();
  updateState();
  logAction();
} else {
  showError();
}

// &&: One alternative (conditional execution)
isValid && processData();

// ||: One alternative (default value)
const name = userName || 'Guest';
```

### Ternary with Functions

```javascript
// Calling different functions
isAdmin ? deleteUser() : showError();

// Passing as argument
console.log(count > 0 ? 'Items available' : 'Out of stock');

// In array methods
const numbers = [-2, 5, -8, 10];
const absolute = numbers.map((n) => (n < 0 ? -n : n)); // [2, 5, 8, 10]
```

### Common Mistakes

**❌ Forgetting parentheses with complex conditions:**

```javascript
// Wrong - confusing precedence
let result = x > 5 && y < 10 ? 'yes' : 'no';

// Better - clearer intent
let result = x > 5 && y < 10 ? 'yes' : 'no';
```

**❌ Using for side effects instead of values:**

```javascript
// Wrong - unclear intent
isValid ? saveData() : null;

// Better - use if statement
if (isValid) saveData();

// Or use &&
isValid && saveData();
```

**❌ Over-nesting:**

```javascript
// Hard to read
const x = a ? (b ? (c ? d : e) : f) : g;

// Better
let x;
if (a) {
  if (b) {
    x = c ? d : e;
  } else {
    x = f;
  }
} else {
  x = g;
}
```

---

## 5. Operator Precedence

From highest to lowest:

1. `!` (NOT) - highest precedence
2. Relational operators (`<`, `>`, `===`, etc.)
3. `&&` (AND)
4. `||` (OR)
5. `? :` (Ternary) - lowest precedence among these

```javascript
// No parentheses needed
!x && y === 5; // Evaluates as: (!x) && (y === 5)
x === 0 && y === 0; // Evaluates as: (x === 0) && (y === 0)

// Ternary has lower precedence
x > 5
  ? 'big'
  : 'small'(
        // Evaluates condition first

        // But use parentheses for clarity in complex expressions
        x > 5 && y < 10
      )
    ? 'yes'
    : 'no';
```

---

## 6. Short-Circuit Evaluation

Both `&&` and `||` stop evaluating once the result is determined:

```javascript
// && stops at first falsy
false && expensiveFunction(); // expensiveFunction never runs

// || stops at first truthy
true || expensiveFunction(); // expensiveFunction never runs

// Practical use
const data = cache || fetchFromDatabase(); // Only fetch if cache is empty
```

**Note:** Ternary operator (`? :`) **always evaluates** the condition, but only executes **one** of the two branches.

```javascript
// Only one branch executes
const result = condition ? expensiveA() : expensiveB();
// If condition is true: only expensiveA() runs
// If condition is false: only expensiveB() runs
```

### ⚠️ Side Effects Warning

Be careful when right-side has side effects:

```javascript
let count = 0;

// count++ may or may not execute
condition && count++;

// Better to be explicit
if (condition) count++;
```

---

## 7. DeMorgan's Laws

Useful for simplifying logical expressions:

```javascript
// Law 1: NOT (A AND B) = (NOT A) OR (NOT B)
!(p && q) === (!p || !q);

// Law 2: NOT (A OR B) = (NOT A) AND (NOT B)
!(p || q) === (!p && !q);
```

**Practical example:**

```javascript
// Instead of this
if (!(isWeekend && isHoliday)) {
  goToWork();
}

// You can write
if (!isWeekend || !isHoliday) {
  goToWork();
}
```

---

## 8. Common Patterns & Best Practices

### Chaining for Safety

```javascript
// Avoid errors with nested properties
const city = user && user.address && user.address.city;

// Modern alternative: Optional chaining (ES2020)
const city = user?.address?.city;
```

### Default Values

```javascript
// Old way
const name = userName || 'Anonymous';

// Modern way (handles 0 and "" better)
const name = userName ?? 'Anonymous';
```

### Conditional Execution

```javascript
// Short and clean
isAdmin && deleteUser();

// More readable for complex logic
if (isAdmin) {
  deleteUser();
}
```

### Ternary for Assignment

```javascript
// Clean and concise
const theme = isDark ? 'dark' : 'light';
const icon = isOpen ? '▼' : '▶';
```

### Boolean Conversion

```javascript
// Explicit
const hasValue = Boolean(value);

// Idiomatic
const hasValue = !!value;
```

---

## 9. Modern Alternatives (ES2020+)

### Nullish Coalescing (`??`)

Nullish Coalescing operator also called First-Defined operator.

Only treats `null` and `undefined` as "empty":

```javascript
0 || 10; // 10 (0 is falsy)
0 ?? 10; // 0 (0 is not null/undefined)

'' || 'default'; // "default"
'' ?? 'default'; // ""

// Great for default values
const port = config.port ?? 3000;
```

### Optional Chaining (`?.`)

Safer property access:

```javascript
// Old way
user && user.address && user.address.city;

// New way
user?.address?.city;

// With ternary
const city = user?.address?.city ? user.address.city : 'Unknown';

// Better with ??
const city = user?.address?.city ?? 'Unknown';
```

---

## 10. Comparison: Choosing the Right Tool

| Scenario                     | Best Choice           | Example                            |
| ---------------------------- | --------------------- | ---------------------------------- |
| Two value alternatives       | Ternary `? :`         | `const x = a > 5 ? 10 : 20;`       |
| Default value                | `\|\|` or `??`        | `const name = input \|\| "Guest";` |
| Conditional execution        | `&&` or `if`          | `isValid && save();`               |
| Guard against null/undefined | `&&` or `?.`          | `user?.profile?.name`              |
| Complex multi-way logic      | `if-else` or `switch` | Multiple statements needed         |
| Boolean inversion            | `!`                   | `if (!isValid) {...}`              |
| Boolean conversion           | `!!`                  | `const bool = !!value;`            |

---

## Summary Table

| Operator | Returns                    | Short-Circuits         | Common Use                                         |
| -------- | -------------------------- | ---------------------- | -------------------------------------------------- |
| `&&`     | First falsy or last value  | Yes (at first falsy)   | Guard conditions, conditional execution            |
| `\|\|`   | First truthy or last value | Yes (at first truthy)  | Default values, fallbacks                          |
| `!`      | `true` or `false`          | No                     | Invert boolean, convert to boolean                 |
| `? :`    | One of two values          | Partially (one branch) | Conditional assignment, simple if-else alternative |

---

## Key Takeaways

1. **`&&` and `||` return operands**, not just `true`/`false`
2. **Ternary `? :` returns one of two values** based on a condition
3. **Short-circuit evaluation** can improve performance and prevent errors
4. **`!` always returns a boolean** (`true` or `false`)
5. **Watch out for falsy values** like `0` and `""` when using `||`
6. **Use ternary for simple conditionals**, if-else for complex logic
7. **Don't over-nest ternary operators** - readability matters
8. **Use modern alternatives** (`??`, `?.`) when appropriate
9. **Precedence matters** - use parentheses for complex expressions
