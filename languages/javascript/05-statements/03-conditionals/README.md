# JavaScript Conditionals

Building on your notes, here's a comprehensive look at JavaScript conditionals:

## 1. if/else Statement

The fundamental conditional structure that executes code based on whether a condition is true or false.

**Basic if:**

```javascript
if (condition) {
  // code executes if condition is true
}
```

**if/else:**

```javascript
if (condition) {
  // code executes if condition is true
} else {
  // code executes if condition is false
}
```

**if/else if/else (multiple branches):**

```javascript
if (condition1) {
  // executes if condition1 is true
} else if (condition2) {
  // executes if condition1 is false and condition2 is true
} else {
  // executes if all conditions are false
}
```

**Examples:**

```javascript
let age = 18;

if (age >= 18) {
  console.log('You can vote');
}

// With else
if (age >= 21) {
  console.log('You can drink alcohol');
} else {
  console.log("You're too young to drink");
}

// Multiple conditions
let score = 85;
if (score >= 90) {
  console.log('Grade: A');
} else if (score >= 80) {
  console.log('Grade: B');
} else if (score >= 70) {
  console.log('Grade: C');
} else {
  console.log('Grade: F');
}
```

## 2. switch Statement

A multiway branch statement that's cleaner than multiple if/else statements when comparing one value against many possibilities.

**Syntax:**

```javascript
switch (expression) {
  case value1:
    // code executes if expression === value1
    break;
  case value2:
    // code executes if expression === value2
    break;
  default:
  // code executes if no case matches
}
```

**Examples:**

```javascript
let day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('Start of work week');
    break;
  case 'Friday':
    console.log('Almost weekend!');
    break;
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend!');
    break;
  default:
    console.log('Midweek day');
}

// Without break (fall-through behavior)
let month = 2;
switch (month) {
  case 12:
  case 1:
  case 2:
    console.log('Winter');
    break;
  case 3:
  case 4:
  case 5:
    console.log('Spring');
    break;
  // ... etc
}
```

## 3. Ternary Operator (Conditional Operator)

A shorthand for if/else that returns a value.

**Syntax:**

```javascript
condition ? valueIfTrue : valueIfFalse;
```

**Examples:**

```javascript
let age = 20;
let canVote = age >= 18 ? 'Yes' : 'No';

// Nested ternary (use sparingly - can be hard to read)
let grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';

// In function returns
function getDiscount(isMember) {
  return isMember ? 0.1 : 0;
}
```

## 4. Truthy and Falsy Values

JavaScript coerces values to boolean in conditional contexts.

**Falsy values (evaluate to false):**

- `false`
- `0` (zero)
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

**Everything else is truthy**, including:

- `"0"` (string with zero)
- `"false"` (string)
- `[]` (empty array)
- `{}` (empty object)
- `function(){}` (functions)

**Examples:**

```javascript
if ('') {
  // won't execute - empty string is falsy
}

if ('hello') {
  // will execute - non-empty string is truthy
}

let user = null;
if (user) {
  console.log(user.name); // won't execute
}
```

## 5. Logical Operators in Conditionals

**AND (&&)** - both conditions must be true:

```javascript
if (age >= 18 && hasLicense) {
  console.log('Can drive');
}
```

**OR (||)** - at least one condition must be true:

```javascript
if (isWeekend || isHoliday) {
  console.log('No work today!');
}
```

**NOT (!)** - inverts the boolean value:

```javascript
if (!isLoggedIn) {
  console.log('Please log in');
}
```

**Short-circuit evaluation:**

```javascript
// Set default value
let username = inputName || 'Guest';

// Only call function if object exists
user && user.updateProfile();
```

## 6. Modern Conditional Patterns

**Nullish coalescing (??)** - returns right side only if left is null/undefined:

```javascript
let count = 0;
let result = count ?? 10; // result is 0 (not 10)
let result2 = count || 10; // result2 is 10 (0 is falsy)
```

**Optional chaining (?.)** - safely access nested properties:

```javascript
let city = user?.address?.city; // no error if user or address is undefined
```

## Key Points to Remember

1. **Conditionals create branches** in your code where the interpreter chooses a path
2. **Use if/else** for boolean conditions and simple branching
3. **Use switch** when comparing one value against multiple specific values
4. **Remember break** in switch statements to prevent fall-through
5. **Understand truthy/falsy** to write cleaner conditionals
6. **Combine conditions** with logical operators (&&, ||, !)
7. **Use ternary** for simple conditional assignments
8. **Keep nested conditionals readable** - consider refactoring complex nesting
