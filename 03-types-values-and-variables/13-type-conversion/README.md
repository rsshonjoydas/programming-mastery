# JavaScript Type Conversion

Everything you need to know about type conversion in JavaScript, covering both implicit (coercion) and explicit (casting) conversions.

---

## Table of Contents

1. [Understanding Type Flexibility](#1-understanding-type-flexibility)
2. [Types of Conversion](#2-types-of-conversion)
3. [Type Conversion Table](#3-type-conversion-table)
4. [Explicit Conversions](#4-explicit-conversions)
5. [Implicit Conversions (Coercion)](#5-implicit-conversions-coercion)
6. [Equality and Conversions](#6-equality-and-conversions)
7. [Number Formatting](#7-number-formatting)
8. [Parsing Numbers from Strings](#8-parsing-numbers-from-strings)
9. [Object-to-Primitive Conversions](#9-object-to-primitive-conversions)
10. [Special Operator Conversions](#10-special-operator-conversions)
11. [Common Gotchas](#11-common-gotchas)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. Understanding Type Flexibility

JavaScript is extremely flexible with types. When it expects a certain type, it will automatically convert values:

- **Booleans**: Truthy values → `true`, Falsy values → `false`
- **Strings**: Any value can be converted to a string representation
- **Numbers**: JavaScript attempts conversion (or returns `NaN` if impossible)

**Examples:**

```javascript
10 + ' objects'; // => "10 objects" (Number converts to string)
'7' * '4'; // => 28 (Strings convert to numbers)
let n = 1 - 'x'; // => NaN (Can't convert "x" to number)
n + ' objects'; // => "NaN objects" (NaN converts to string)
```

---

## 2. Types of Conversion

JavaScript has two types of conversion:

### Explicit Conversion (Casting)

You manually convert types using built-in functions - **use this for clarity and predictability**

### Implicit Conversion (Coercion)

JavaScript automatically converts types in certain operations - **can be confusing, avoid relying on it**

---

## 3. Type Conversion Table

| Value                    | to String   | to Number | to Boolean |
| ------------------------ | ----------- | --------- | ---------- |
| `undefined`              | "undefined" | `NaN`     | `false`    |
| `null`                   | "null"      | `0`       | `false`    |
| `true`                   | "true"      | `1`       | —          |
| `false`                  | "false"     | `0`       | —          |
| `""` (empty string)      | —           | `0`       | `false`    |
| `"1.2"` (numeric string) | —           | `1.2`     | `true`     |
| `"one"` (non-numeric)    | —           | `NaN`     | `true`     |
| `0`                      | "0"         | —         | `false`    |
| `-0`                     | "0"         | —         | `false`    |
| `1` (non-zero)           | "1"         | —         | `true`     |
| `Infinity`               | "Infinity"  | —         | `true`     |
| `-Infinity`              | "-Infinity" | —         | `true`     |
| `NaN`                    | "NaN"       | —         | `false`    |
| `{}` (any object)        | (complex)   | (complex) | `true`     |
| `[]` (empty array)       | ""          | `0`       | `true`     |
| `[9]` (one element)      | "9"         | `9`       | `true`     |
| `['a']` (other array)    | use join()  | `NaN`     | `true`     |
| `function(){}`           | (complex)   | `NaN`     | `true`     |

### Falsy Values (Convert to `false`)

Only these 6 values are falsy:

- `false`
- `0`, `-0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

**Everything else is truthy!** (including `[]`, `{}`, `"0"`, `"false"`)

### Key Surprises

- `true` → `1`, `false` → `0`
- Empty string `""` → `0`
- Empty array `[]` → `0` (as number) but `true` (as boolean)
- `null` → `0` (as number) but `false` (as boolean)
- All objects (including empty arrays) → `true` as boolean

---

## 4. Explicit Conversions

### To String

**Using String() function:**

```javascript
String(123); // => "123"
String(true); // => "true"
String(false); // => "false"
String(null); // => "null"
String(undefined); // => "undefined"
String([1, 2, 3]); // => "1,2,3"
```

**Using toString() method:**

```javascript
(42).toString(); // => "42"
true.toString(); // => "true"
false
  .toString() // => "false"
  [(1, 2, 3)].toString(); // => "1,2,3"
```

**Type conversion idiom:**

```javascript
x + ''; // Convert to string (same as String(x))
```

### To Number

**Using Number() function:**

```javascript
Number('123'); // => 123
Number('12.5'); // => 12.5
Number('hello'); // => NaN
Number(true); // => 1
Number(false); // => 0
Number(null); // => 0
Number(undefined); // => NaN
Number(''); // => 0
Number('  '); // => 0
```

**Using parseInt() and parseFloat():**

```javascript
parseInt('123px'); // => 123 (parses until non-digit)
parseFloat('12.5em'); // => 12.5
parseInt('0xFF'); // => 255 (hexadecimal)
```

**Type conversion idioms:**

```javascript
+x; // Convert to number (same as Number(x))
x - 0; // Convert to number (same as Number(x))
```

### To Boolean

**Using Boolean() function:**

```javascript
Boolean(1); // => true
Boolean(0); // => false
Boolean(''); // => false
Boolean('hello'); // => true
Boolean(null); // => false
Boolean(undefined); // => false
Boolean({}); // => true
Boolean([]); // => true
```

**Type conversion idiom:**

```javascript
!!x; // Convert to boolean (double negation)

!!'text'; // => true
!!0; // => false
!!''; // => false
```

### Important Notes

**Avoid wrapper objects:**

```javascript
// DON'T use these with 'new':
new Number(5); // Creates wrapper object
new String('hi'); // Creates wrapper object
new Boolean(true); // Creates wrapper object

// These are historical leftovers with no practical use
```

---

## 5. Implicit Conversions (Coercion)

JavaScript automatically converts types in certain operations.

### String Coercion (+ operator)

When one operand is a string, the other converts to string:

```javascript
'5' + 3; // => "53" (number to string)
'Hello' + true; // => "Hellotrue"
'5' + null; // => "5null"
'5' + undefined; // => "5undefined"
3 + 4 + '5'; // => "75" (left to right: 7 + "5")
'3' + 4 + 5; // => "345" (left to right: "34" + 5)
```

### Numeric Coercion (-, \*, /, % operators)

Math operators (except +) convert operands to numbers:

```javascript
'5' - 2; // => 3 (string to number)
'10' * '2'; // => 20
'6' / '2'; // => 3
'10' % '3'; // => 1
'5' - null; // => 5 (null becomes 0)
'5' * true; // => 5 (true becomes 1)
'5' - 'hello'; // => NaN
```

### Boolean Coercion

In conditional contexts (if, while, ternary):

```javascript
if ('hello') {
} // executes (truthy)
if (0) {
} // doesn't execute (falsy)
if ([]) {
} // executes (truthy - arrays are objects!)

// Ternary operator
'text' ? 'yes' : 'no'; // => "yes"
0 ? 'yes' : 'no'; // => "no"

// Logical operators
'hello' && 'world'; // => "world"
0 && 'world'; // => 0
'hello' || 'world'; // => "hello"
0 || 'world'; // => "world"
```

---

## 6. Equality and Conversions

### Strict Equality (`===` and `!==`)

- **No type conversion**
- Operands must be same type and value
- **Best practice: Use this by default**

```javascript
5 === 5; // => true
5 === '5'; // => false (different types)
null === undefined; // => false
0 === false; // => false
NaN === NaN; // => false (special case!)
```

### Loose Equality (`==` and `!=`)

- **Performs type conversion before comparing**
- Can lead to unexpected results

```javascript
5 == "5"             // => true (string converts to number)
null == undefined    // => true (special rule)
0 == false           // => true (boolean converts to number)
"0" == false         // => true (both convert to 0)
[] == false          // => true (array converts to 0)
"" == 0              // => true (empty string converts to 0)
```

### Important: Convertibility ≠ Equality

```javascript
// undefined converts to false in boolean context
if (undefined) {
} // doesn't execute

// But they're NOT equal with ==
undefined == false; // => false

// Same with null
if (null) {
} // doesn't execute
null == false; // => false
```

### Best Practice

```javascript
// ✅ GOOD: Use strict equality
if (value === 5) {
}
if (user !== null) {
}

// ❌ AVOID: Loose equality (unless you know what you're doing)
if (value == 5) {
}
```

---

## 7. Number Formatting

### toString() with Radix (Base)

Convert numbers to different bases:

```javascript
let n = 17;
n.toString(2); // => "10001" (binary)
n.toString(8); // => "21" (octal)
n.toString(16); // => "11" (hexadecimal)

let binary = '0b' + n.toString(2); // => "0b10001"
let octal = '0o' + n.toString(8); // => "0o21"
let hex = '0x' + n.toString(16); // => "0x11"
```

### Number Formatting Methods

```javascript
let n = 123456.789;

// toFixed(digits): Fixed decimal places (no exponential)
n.toFixed(0); // => "123457" (rounds)
n.toFixed(2); // => "123456.79"
n.toFixed(5); // => "123456.78900" (pads zeros)

// toExponential(digits): Exponential notation
n.toExponential(1); // => "1.2e+5"
n.toExponential(3); // => "1.235e+5"

// toPrecision(digits): Significant digits
n.toPrecision(4); // => "1.235e+5"
n.toPrecision(7); // => "123456.8"
n.toPrecision(10); // => "123456.7890"
```

**For internationalized formatting:**

```javascript
// Use Intl.NumberFormat for currency, percentages, etc.
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(1234.56); // => "$1,234.56"
```

---

## 8. Parsing Numbers from Strings

### parseInt() and parseFloat()

These parse as much as possible and ignore the rest:

```javascript
parseInt('3 blind mice'); // => 3
parseFloat(' 3.14 meters'); // => 3.14
parseInt('-12.34'); // => -12 (ignores decimal)
parseInt('0xFF'); // => 255 (hex)
parseInt('0xff'); // => 255
parseFloat('.1'); // => 0.1
parseInt('0.1'); // => 0
parseInt('.1'); // => NaN (integers can't start with .)
parseFloat('$72.47'); // => NaN (can't start with $)
```

### parseInt() with Radix (Base)

**Always specify the radix for reliability:**

```javascript
parseInt('11', 2); // => 3 (binary: 1*2 + 1)
parseInt('ff', 16); // => 255 (hex: 15*16 + 15)
parseInt('zz', 36); // => 1295 (base-36: 35*36 + 35)
parseInt('077', 8); // => 63 (octal: 7*8 + 7)
parseInt('077', 10); // => 77 (decimal: 7*10 + 7)

// Best practice: always use radix
parseInt(userInput, 10); // ✅ GOOD
parseInt(userInput); // ⚠️ Can be ambiguous
```

### Difference: Number() vs parseInt()

```javascript
// Number() requires valid numeric literal (strict)
Number('123'); // => 123
Number('123px'); // => NaN (trailing chars not allowed)
Number('  123  '); // => 123 (trims whitespace)
Number(''); // => 0

// parseInt() parses what it can (lenient)
parseInt('123'); // => 123
parseInt('123px'); // => 123 (ignores "px")
parseInt('  123  '); // => 123
parseInt(''); // => NaN
```

---

## 9. Object-to-Primitive Conversions

JavaScript uses three algorithms to convert objects to primitives.

### The Three Algorithms

#### 1. prefer-string

1. Try `toString()` first
2. If it returns primitive, use it
3. Otherwise try `valueOf()`
4. If that returns primitive, use it
5. Otherwise throw `TypeError`

#### 2. prefer-number

1. Try `valueOf()` first
2. If it returns primitive, use it
3. Otherwise try `toString()`
4. If that returns primitive, use it
5. Otherwise throw `TypeError`

#### 3. no-preference

- **Date class** uses prefer-string
- **All other built-in types** use prefer-number

### When Each Algorithm Is Used

**Object-to-Boolean:**

- **Always `true`** for all objects (no algorithm needed)
- Even `new Boolean(false)` is truthy!

**Object-to-String:**

- Uses **prefer-string** algorithm
- Examples: String concatenation, template literals, String()

**Object-to-Number:**

- Uses **prefer-number** algorithm
- Examples: Math operations, Number()

### The toString() and valueOf() Methods

**Default behaviors:**

```javascript
// toString() - returns string representation
({x: 1, y: 2}).toString()              // => "[object Object]"
[1,2,3].toString()                     // => "1,2,3"
(function(x) { f(x); }).toString()     // => "function(x) { f(x); }"
/\d+/g.toString()                      // => "/\\d+/g"
new Date(2020,0,1).toString()          // => "Wed Jan 01 2020..."

// valueOf() - returns primitive value (or object itself)
let d = new Date(2010, 0, 1);
d.valueOf()                            // => 1262332800000 (timestamp)
[1,2,3].valueOf()                      // => [1,2,3] (returns self)
({x: 1}).valueOf()                     // => {x: 1} (returns self)
```

### Object-to-Number Examples

**Why empty arrays convert to 0:**

```javascript
Number([]); // => 0

// Step by step:
// 1. valueOf() returns [] (not primitive)
// 2. toString() returns "" (primitive!)
// 3. Number("") returns 0
```

**Why single-element arrays can convert to numbers:**

```javascript
Number([99]); // => 99

// Step by step:
// 1. valueOf() returns [99] (not primitive)
// 2. toString() returns "99" (primitive!)
// 3. Number("99") returns 99
```

**Multi-element arrays:**

```javascript
Number([1, 2, 3]); // => NaN

// Step by step:
// 1. valueOf() returns [1,2,3] (not primitive)
// 2. toString() returns "1,2,3" (primitive!)
// 3. Number("1,2,3") returns NaN
```

---

## 10. Special Operator Conversions

### The + Operator (no-preference algorithm)

The + operator is special - it can add OR concatenate:

```javascript
// If either operand is string → concatenation
"3" + 4 + 5          // => "345" (left to right)
3 + 4 + "5"          // => "75" (7 + "5")

// With objects
[1] + [2]            // => "12" (both become strings)
{} + []              // => 0 or "[object Object]" (context-dependent)
[] + []              // => "" (empty string)
[] + {}              // => "[object Object]"
```

### == and != Operators (no-preference algorithm)

Convert objects to primitives before comparing:

```javascript
[1] == 1             // => true ([1] → "1" → 1)
[] == 0              // => true ([] → "" → 0)
[1,2] == "1,2"       // => true ([1,2] → "1,2")
```

### Relational Operators (<, <=, >, >=)

Use **prefer-number** algorithm:

```javascript
// Works great for Date comparison
let d1 = new Date(2020, 0, 1);
let d2 = new Date(2021, 0, 1);
d1 <
  d2[// Arrays // => true (compares numeric timestamps)
  2] >
  [1][10] < // => true ("2" > "1", string comparison)
  [9]; // => true ("10" < "9", string comparison!)
```

---

## 11. Common Gotchas

### Surprising Conversions

```javascript
// Empty arrays and objects
[] + []               // => "" (both become empty strings)
[] + {}               // => "[object Object]"
{} + []               // => 0 (depends on context - {} might be block)
{} + {}               // => "[object Object][object Object]" or NaN

// Boolean arithmetic
true + true           // => 2 (true is 1)
true + false          // => 1
true * 3              // => 3

// Null and undefined
"5" + null            // => "5null" (null becomes string)
"5" - null            // => 5 (null becomes 0)
"5" + undefined       // => "5undefined"
"5" - undefined       // => NaN

// Array coercion
[1,2,3] + 4           // => "1,2,34" (array becomes "1,2,3")
4 + [1,2,3]           // => "41,2,3"
[1] - [1]             // => 0 (both become 1)
```

### Type Coercion Pitfalls

```javascript
// Falsy vs false
[] == false           // => true (surprising!)
[] === false          // => false
if ([]) { }           // executes (arrays are truthy)

// String comparison
"10" > "9"            // => false (string comparison: "1" < "9")
10 > 9                // => true (numeric comparison)

// NaN comparisons
NaN == NaN            // => false (special case)
NaN === NaN           // => false
isNaN(NaN)            // => true (use this to check)
Number.isNaN(NaN)     // => true (more strict)
```

### Avoid These Patterns

```javascript
// ❌ BAD: Relying on implicit coercion
if (value == true) {
} // Use: if (value === true) { }
if (value == false) {
} // Use: if (value === false) { }

// ❌ BAD: Loose equality with different types
array == ''; // Use: array.length === 0
value == null; // Use: value === null || value === undefined

// ❌ BAD: String concatenation for numbers
'5' + variable; // Use: String(5 + variable) or template literal

// ✅ GOOD: Explicit and clear
if (value === true) {
}
if (array.length === 0) {
}
if (value === null || value === undefined) {
}
const result = `Result: ${5 + variable}`;
```

---

## 12. Key Takeaways

### Best Practices

1. **Always use strict equality (`===`)** unless you specifically need type coercion
2. **Use explicit conversions** (`Number()`, `String()`, `Boolean()`) for clarity and predictability
3. **Always specify radix** when using `parseInt()`: `parseInt(str, 10)`
4. **Avoid wrapper objects** (`new Number()`, etc.) - use primitives instead
5. **Be explicit** in production code - don't rely on implicit coercion

### Memory Aids

**Falsy values (only 6):**

```
false, 0, "", null, undefined, NaN
```

**Operator behavior:**

```
+  with string → concatenation
-, *, /, % → numeric coercion
=== → no coercion (use this!)
== → coercion (avoid!)
```

**Object conversions:**

```
Objects → boolean: always true
Objects → string: prefer-string algorithm
Objects → number: prefer-number algorithm
```

### Quick Reference

```javascript
// Explicit conversions
String(value); // To string
Number(value); // To number
Boolean(value); // To boolean
parseInt(str, 10); // To integer
parseFloat(str); // To float

// Type conversion idioms
value +
  '' + // To string
  value; // To number
!!value; // To boolean

// Safe equality checks
value === expected;
value !== expected;
typeof value === 'type';
Array.isArray(value);
Number.isNaN(value);
```

### When to Use Each Conversion Method

| Goal       | Recommended       | Alternative             | Avoid             |
| ---------- | ----------------- | ----------------------- | ----------------- |
| To String  | `String(x)`       | `x.toString()`          | `x + ""`          |
| To Number  | `Number(x)`       | `+x`                    | `x - 0`           |
| To Integer | `parseInt(x, 10)` | `Math.floor(Number(x))` | `~~x`             |
| To Boolean | `Boolean(x)`      | `!!x`                   | Implicit coercion |

---

**Remember:** JavaScript's type system is flexible but can be unpredictable. When in doubt, be explicit!
