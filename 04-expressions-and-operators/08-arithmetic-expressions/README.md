# JavaScript Arithmetic Expressions

I'll combine your notes with comprehensive JavaScript arithmetic expression information.

## Basic Arithmetic Operators

JavaScript provides several operators for mathematical calculations:

### 1. **Exponentiation (`**`)**

- Raises the first operand to the power of the second
- **Right-to-left associativity** (unique among arithmetic operators)
- Highest precedence among arithmetic operators
- Added in ES2016

```javascript
2 ** 3        // 8
2 ** 2 ** 3   // 2 ** 8 = 256 (not 4 ** 3)
Math.pow(2, 3) // 8 (older alternative)

// Syntax error - must use parentheses:
// -3 ** 2     // ERROR
(-3) ** 2      // 9
-(3 ** 2)      // -9
```

### 2. **Multiplication (`*`)**

```javascript
5 * 3         // 15
2.5 * 4       // 10
```

### 3. **Division (`/`)**

- All division results in floating-point numbers
- Division by zero yields `Infinity` or `-Infinity`
- `0/0` yields `NaN`

```javascript
5 / 2         // 2.5 (not 2!)
10 / 0        // Infinity
-10 / 0       // -Infinity
0 / 0         // NaN
```

### 4. **Modulo/Remainder (`%`)**

- Returns the remainder after division
- Sign matches the first operand
- Works with floating-point numbers

```javascript
5 % 2         // 1
-5 % 2        // -1 (negative like first operand)
6.5 % 2.1     // 0.2 (works with decimals)
```

### 5. **Subtraction (`-`)**

```javascript
10 - 5        // 5
-10 - 5       // -15
```

## The Addition Operator (`+`)

The `+` operator is special because it performs **both addition and string concatenation**.

### Type Conversion Rules:

1. **If either operand is an object**: Convert to primitive using:
   - `toString()` for Date objects
   - `valueOf()` for others (if it returns primitive)
   - Falls back to `toString()` for most objects

2. **If either operand is a string**: Convert the other to string and concatenate

3. **Otherwise**: Convert both to numbers and add

### Examples:

```javascript
// Numeric addition
1 + 2                    // 3

// String concatenation
"hello" + " " + "there"  // "hello there"
"1" + "2"                // "12"

// Mixed types
"1" + 2                  // "12" (number→string)
1 + {}                   // "1[object Object]" (object→string)
true + true              // 2 (boolean→number: true=1)
2 + null                 // 2 (null→0)
2 + undefined            // NaN (undefined→NaN)

// Order matters (not always associative!)
1 + 2 + " mice"          // "3 mice" (left-to-right: add first, then concatenate)
1 + (2 + " mice")        // "12 mice" (concatenate 2+"mice", then 1+"2 mice")
```

## Unary Arithmetic Operators

These operators work on a **single operand** and have **high precedence** with **right-associativity**.

### 1. **Unary Plus (`+`)**

- Converts operand to number
- Doesn't change already-numeric values
- Cannot be used with BigInt

```javascript
+3           // 3
+"3"         // 3 (string→number)
+true        // 1
+false       // 0
+null        // 0
+undefined   // NaN
```

### 2. **Unary Minus (`-`)**

- Converts to number and negates

```javascript
-3           // -3
-"3"         // -3
-true        // -1
```

### 3. **Increment (`++`)**

- Adds 1 to the operand (must be an lvalue: variable, array element, or object property)
- **Pre-increment** (`++x`): Increments *then* returns new value
- **Post-increment** (`x++`): Returns old value *then* increments
- Always converts to number (never concatenates strings)

```javascript
let i = 1, j = ++i;    // i=2, j=2 (pre-increment)
let n = 1, m = n++;    // n=2, m=1 (post-increment)

let x = "1";
++x;                   // x = 2 (not "11"!)

// No line breaks allowed in post-increment:
// x
// ++                  // ERROR (semicolon inserted after x)
```

### 4. **Decrement (`--`)**

- Subtracts 1 from operand
- Same pre/post behavior as `++`

```javascript
let i = 5;
--i;                   // i=4, returns 4 (pre-decrement)
i--;                   // i=3, returns 4 (post-decrement)
```

## Bitwise Operators

These operators work on **32-bit integer representations** of numbers. They're less commonly used but powerful for low-level operations.

### Conversion Rules:

- Operands converted to 32-bit integers (fractional parts dropped)
- `NaN`, `Infinity`, `-Infinity` → `0`
- Most operators work with BigInt (except `>>>`)

### Operators:

**1. Bitwise AND (`&`)**

- Result bit is 1 only if both operand bits are 1

```javascript
0x1234 & 0x00FF        // 0x0034
12 & 10                // 8 (1100 & 1010 = 1000)
```

**2. Bitwise OR (`|`)**

- Result bit is 1 if either operand bit is 1

```javascript
0x1234 | 0x00FF        // 0x12FF
12 | 10                // 14 (1100 | 1010 = 1110)
```

**3. Bitwise XOR (`^`)**

- Result bit is 1 if exactly one operand bit is 1 (not both)

```javascript
0xFF00 ^ 0xF0F0        // 0x0FF0
12 ^ 10                // 6 (1100 ^ 1010 = 0110)
```

**4. Bitwise NOT (`~`)**

- Inverts all bits
- Equivalent to `-(x + 1)`

```javascript
~0x0F                  // 0xFFFFFFF0 (-16)
~5                     // -6
```

**5. Left Shift (`<<`)**

- Shifts bits left (fills with 0s on right)
- Equivalent to multiplying by 2^n

```javascript
7 << 2                 // 28 (multiply by 4)
3 << 1                 // 6 (multiply by 2)
```

**6. Sign-Propagating Right Shift (`>>`)**

- Shifts bits right, preserves sign
- Equivalent to dividing by 2^n (integer division)

```javascript
7 >> 1                 // 3 (divide by 2)
-7 >> 1                // -4 (maintains negative)
```

**7. Zero-Fill Right Shift (`>>>`)**

- Shifts bits right, always fills with 0s
- Treats value as unsigned
- **Cannot be used with BigInt**

```javascript
-1 >> 4                // -1 (sign preserved)
-1 >>> 4               // 0x0FFFFFFF (treated as unsigned)
```

## Operator Precedence (High to Low)

1. `**` (exponentiation) - right-to-left
2. Unary: `+`, `-`, `++`, `--`, `~`
3. `*`, `/`, `%`
4. `+`, `-` (binary)
5. `<<`, `>>`, `>>>`
6. Bitwise: `&`, `^`, `|`

## Important Notes

- **NaN propagation**: Most operations with `NaN` result in `NaN`
- **Type coercion**: Non-numeric operands are converted to numbers
- **BigInt**: Can use most operators (except `>>>` and unary `+`) but cannot mix BigInt and regular numbers
- **Automatic semicolon insertion**: Affects post-increment/decrement operators

```javascript
// Common patterns
let counter = 0;
for (let i = 0; i < 10; i++) {  // Using ++ in loops
  counter += i;                // Compound assignment
}

// Bitwise tricks
Math.floor(x)    // vs.  x | 0  (fast integer conversion)
x * 2            // vs.  x << 1 (fast multiplication by powers of 2)
```

This comprehensive guide covers all JavaScript arithmetic expressions from your notes with practical examples!
