# JavaScript Relational (Comparison) Expressions

## Overview

Relational operators test relationships between two values (like "equals," "less than," or "property of") and always evaluate to a **boolean value** (`true` or `false`). These are fundamental for comparisons, decision-making, and controlling program flow in `if`, `while`, and `for` statements.

---

## 1. Equality Operators

### Understanding the Three "Equals"

- **`=`** → Assignment ("gets" or "is assigned")
- **`==`** → Loose Equality ("is equal to") - _avoid using, legacy feature_
- **`===`** → Strict Equality ("is strictly equal to") - **use this!**

### Strict Equality (`===`)

- Checks if two values are **identical** (same type AND same value)
- **No type conversion** occurs
- **Recommended** for all comparisons

**Rules:**

- Both values must have the **same type** and **same value**
- Special cases:
  - `null === null` → `true`
  - `undefined === undefined` → `true`
  - `null === undefined` → `false`
  - `NaN === NaN` → `false` (NaN never equals anything, including itself!)
  - `0 === -0` → `true`
  - Strings must have identical 16-bit values in same positions
  - Objects/arrays must reference the **same object** (not just identical properties)

```javascript
// Basic examples
1 === 1; // true
1 === '1'; // false (different types)
true === 1; // false
null === undefined; // false
NaN === NaN; // false (special case!)

// Object comparison (by reference)
let obj1 = { x: 1 };
let obj2 = { x: 1 };
obj1 === obj2; // false (different objects in memory)
obj1 === obj1; // true (same reference)

// Checking for NaN
let x = NaN;
x !== x; // true (only NaN is not equal to itself!)
```

### Strict Inequality (`!==`)

- Opposite of `===`
- Returns `true` if values are **not identical**

```javascript
1 !== '1'; // true (different types)
1 !== 1; // false
'hello' !== 'bye'; // true
```

### Loose Equality (`==`) - ⚠️ Use with Caution

- Checks if values are equal **after type conversion**
- Can lead to unexpected and confusing results

**Type Conversion Rules:**

1. If same type → use strict equality rules
2. If different types:
   - `null == undefined` → `true` (special case)
   - Number vs String → convert string to number
   - Boolean → convert to number (true→1, false→0)
   - Object vs Number/String → convert object to primitive (via `valueOf()` or `toString()`)

```javascript
// Type conversion examples
1 == "1"          // true (string converted to number)
1 == true         // true (true converted to 1)
0 == false        // true
null == undefined // true (special case)
"" == 0           // true (empty string converted to 0)

// Surprising and confusing cases
"0" == false      // true
"\n" == 0         // true
[] == false       // true (confusing!)
5 == "5"          // true
```

### Loose Inequality (`!=`)

- Opposite of `==`
- Performs type conversion before comparing

```javascript
1 != '1'; // false (converts then compares)
1 != 2; // true
```

**Best Practice:** Always use `===` and `!==` unless you specifically need type coercion. This prevents bugs from unexpected type conversions.

---

## 2. Comparison Operators

Compare numerical or alphabetical order of operands:

- **`<`** - Less than
- **`>`** - Greater than
- **`<=`** - Less than or equal to
- **`>=`** - Greater than or equal to

### Comparison Rules

**Type conversion process:**

1. **Objects** → Convert to primitive (via `valueOf()` then `toString()`)
2. **Both strings** → Compare lexicographically using Unicode values
3. **At least one non-string** → Both operands convert to numbers

### Less Than (`<`)

```javascript
5 < 10; // true
10 < 5; // false
11 < 3; // false
11 < '3'; // false (converts "3" to 3)
'a' < 'b'; // true (alphabetical order)
'apple' < 'banana'; // true
10 < '20'; // true (string converted to number)
```

### Less Than or Equal (`<=`)

```javascript
5 <= 5; // true
5 <= 10; // true
10 <= 5; // false
```

### Greater Than (`>`)

```javascript
10 > 5; // true
5 > 10; // false
'z' > 'a'; // true
```

### Greater Than or Equal (`>=`)

```javascript
10 >= 10; // true
10 >= 5; // true
5 >= 10; // false
```

---

## 3. String Comparison

Strings are compared **lexicographically** (dictionary order) using Unicode character values:

```javascript
// Basic string comparison
'a' < 'b'; // true
'apple' < 'banana'; // true

// Case-sensitive! (uppercase comes before lowercase in Unicode)
'A' < 'a'; // true
'Zoo' < 'aardvark'; // true
'Apple' < 'apple'; // true

// String vs numeric comparison
'10' < '2'; // true (string comparison: "1" < "2")
'11' < '3'; // true (string comparison, not numeric!)

// Case-insensitive comparison
'hello'.toLowerCase() === 'HELLO'.toLowerCase(); // true
```

**Important Notes:**

- String comparison is **case-sensitive**: All capital letters come before lowercase in Unicode
- For robust, locale-aware string comparison: use `String.localeCompare()` or `Intl.Collator`
- For case-insensitive: use `.toLowerCase()` or `.toUpperCase()`

---

## 4. Number Comparison

### Normal Cases

```javascript
5 < 10            // true
-5 < 0            // true
3.14 > 3.1        // true
```

### Special Cases with `NaN`

```javascript
// NaN comparisons ALWAYS return false (except !=)
NaN == NaN; // false
NaN === NaN; // false
NaN < 5; // false
NaN > 5; // false
NaN <= NaN; // false
5 == NaN; // false

// Correct ways to check for NaN:
Number.isNaN(NaN); // true (ES6+, recommended)
Number.isNaN('hello'); // false (checks if actually NaN)
isNaN(NaN); // true
isNaN('hello'); // true (converts to number first)

// Using the NaN property
let x = NaN;
x !== x; // true (only way using comparison)
```

### Special Cases with `Infinity`

```javascript
Infinity > 1000   // true
-Infinity < -1000 // true
Infinity === Infinity // true
```

---

## 5. Type Conversion in Comparisons

### With `<`, `>`, `<=`, `>=`

These operators convert operands to numbers:

```javascript
'10' > 5; // true (string "10" → number 10)
'5' < 10; // true
true > 0; // true (true → 1)
false < 1; // true (false → 0)

// Problem cases (convert to NaN)
'hello' > 5; // false (string → NaN, NaN comparisons are false)
'one' < 3; // false ("one" → NaN)
undefined > 0; // false (undefined → NaN)

// null special case
null > 0; // false (null → 0, but 0 > 0 is false)
null >= 0; // true (null → 0, and 0 >= 0 is true)
null == 0; // false (special rule: null only == undefined)
null < 1; // true (null → 0)
null > -1; // true (null → 0)
```

### Object Conversion

Objects are converted using `valueOf()` or `toString()`:

```javascript
let obj = {
    valueOf() { return 10; }
};
obj > 5           // true (object → 10)

[1] == 1          // true (array → "1" → 1)
```

### `+` Operator vs Comparison Operators

```javascript
// + operator favors strings (concatenation)
1 + 2; // 3 (addition)
'1' + '2'; // "12" (concatenation)
'1' + 2; // "12" (concatenation)

// Comparison operators favor numbers
'11' < '3'; // true (string comparison)
11 < '3'; // false (numeric comparison: 11 < 3)
```

---

## 6. Special Value Comparisons

### `null` and `undefined`

```javascript
// Loose equality (==)
null == undefined; // true (only equal to each other!)
null == 0; // false
undefined == 0; // false

// Strict equality (===)
null === undefined; // false
null === null; // true
undefined === undefined; // true

// Comparisons (with type conversion to number)
null < 1; // true (null → 0)
null > -1; // true (null → 0)
undefined < 1; // false (undefined → NaN)
```

### `NaN` (Not a Number)

```javascript
NaN === NaN; // false (unique property!)
NaN !== NaN; // true

// Use these to check for NaN:
Number.isNaN(NaN); // true (ES6+, recommended)
Number.isNaN('hello'); // false
isNaN('hello'); // true (converts to number first)

// Trick using NaN's unique property
let x = NaN;
x !== x; // true (only NaN has this property)
```

---

## 7. The `in` Operator

Tests if a property exists in an object.

**Syntax:** `property in object`

- **Left operand**: String, symbol, or value convertible to string (property name)
- **Right operand**: Object
- **Returns**: `true` if property exists (including **inherited** properties)

```javascript
let point = { x: 1, y: 1 };
'x' in point; // true (own property)
'z' in point; // false (doesn't exist)
'toString' in point; // true (inherited from Object.prototype)

let data = [7, 8, 9];
'0' in data; // true (array index exists)
0 in data; // true (number converts to string "0")
3 in data; // false (no index 3)
'length' in data; // true (arrays have length property)
```

---

## 8. The `instanceof` Operator

Tests if an object is an instance of a class.

**Syntax:** `object instanceof Constructor`

- **Left operand**: Object
- **Right operand**: Constructor function (class)
- **Returns**: `true` if object is instance of class or subclass
- Works by checking the **prototype chain**

```javascript
let d = new Date();
d instanceof Date; // true
d instanceof Object; // true (all objects inherit from Object)
d instanceof Number; // false

let a = [1, 2, 3];
a instanceof Array; // true
a instanceof Object; // true (arrays are objects)
a instanceof RegExp; // false

// Edge cases - primitives aren't objects!
'hello' instanceof String; // false
5 instanceof Number; // false
true instanceof Boolean; // false
```

**How it works**: JavaScript checks if `Constructor.prototype` appears anywhere in the prototype chain of the object.

---

## 9. Common Patterns and Use Cases

### Validation

```javascript
if (age >= 18) {
  console.log('Adult');
}

if (score > 90) {
  console.log('A grade');
}
```

### Range Checking

```javascript
if (x >= 0 && x <= 100) {
    console.log("Within range");
}

// ⚠️ Chaining doesn't work like math!
if (0 <= x <= 100) // WRONG! Always evaluates to true
```

### Combining with Logical Operators

```javascript
if (x === 0 && y === 0) {
  console.log('At origin');
}

if (age < 13 || age > 65) {
  console.log('Discount eligible');
}
```

### Ternary Operator

```javascript
let status = age >= 18 ? 'adult' : 'minor';
let max = a > b ? a : b;
```

### Property Checking

```javascript
if ('username' in userObject) {
  console.log(userObject.username);
}

if (value instanceof Array) {
  console.log("It's an array!");
}
```

---

## 10. Operator Precedence

Relational operators have **higher precedence** than logical operators:

```javascript
// No parentheses needed
x === 0 && y === 0; // Evaluates as: (x === 0) && (y === 0)

// Precedence order (high to low):
// 1. ! (logical NOT)
// 2. <, <=, >, >= (comparison)
// 3. ==, !=, ===, !== (equality)
// 4. && (logical AND)
// 5. || (logical OR)
```

---

## 11. Best Practices

### ✅ Do

- **Always use `===` and `!==`** for equality checks
- Use `Number.isNaN()` to check for NaN (not `x === NaN`)
- Compare strings with `.toLowerCase()` for case-insensitive checks
- Use parentheses for clarity in complex expressions
- Use `in` to check if properties exist
- Use `instanceof` to check object types

### ❌ Don't

- **Avoid `==` and `!=`** unless you specifically need type coercion
- Don't rely on automatic type conversion in comparisons
- Don't compare NaN using `===` or `==`
- Don't chain comparison operators like `0 < x < 10` (doesn't work as expected)
- Don't use `instanceof` with primitive values (always returns false)

---

## 12. Quick Reference Table

| Operator     | Name                  | Example               | Result       | Type Conversion    |
| ------------ | --------------------- | --------------------- | ------------ | ------------------ |
| `===`        | Strict equality       | `5 === 5`             | `true`       | None               |
| `!==`        | Strict inequality     | `5 !== "5"`           | `true`       | None               |
| `==`         | Loose equality        | `5 == "5"`            | `true`       | Yes                |
| `!=`         | Loose inequality      | `5 != "5"`            | `false`      | Yes                |
| `<`          | Less than             | `3 < 5`               | `true`       | To number          |
| `<=`         | Less than or equal    | `5 <= 5`              | `true`       | To number          |
| `>`          | Greater than          | `5 > 3`               | `true`       | To number          |
| `>=`         | Greater than or equal | `5 >= 5`              | `true`       | To number          |
| `in`         | Property in object    | `"x" in obj`          | `true/false` | Property to string |
| `instanceof` | Instance of class     | `[] instanceof Array` | `true`       | None               |

---

## Key Takeaways

1. ✅ **Always use `===` and `!==`** instead of `==` and `!=` to avoid type coercion bugs
2. 🔄 **Objects compare by reference**, not by value
3. 📝 **String comparison is case-sensitive** and uses Unicode order
4. ⚠️ **NaN never equals anything**, including itself (use `Number.isNaN()` or `x !== x`)
5. 🔢 **Comparison operators (`<`, `>`, etc.) convert to numbers** when operands aren't both strings
6. 🔍 **`in` checks property existence** (including inherited properties)
7. 🏗️ **`instanceof` checks prototype chain** for class membership
8. 🎯 **Relational expressions always return boolean values** (`true` or `false`)
9. 📊 **Relational operators have higher precedence** than logical operators (`&&`, `||`)
10. 🚫 **Mixed BigInt and Number comparisons are allowed** for comparisons (unlike arithmetic)

---

This comprehensive guide covers all relational expressions in JavaScript, combining both fundamental concepts and practical usage patterns!
