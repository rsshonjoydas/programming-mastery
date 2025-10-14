# JavaScript Numbers

## Number Type Basics

**JavaScript uses a single numeric type: Number**

- 64-bit floating-point format (IEEE 754 standard)
- Can represent numbers as large as ±1.7976931348623157 × 10³⁰⁸
- Can represent numbers as small as ±5 × 10⁻³²⁴

**Safe Integer Range:**

- Exactly represents integers between −2⁵³ and 2⁵³
- Range: −9,007,199,254,740,992 to 9,007,199,254,740,992
- Beyond this range, precision may be lost in trailing digits
- Array indexing and bitwise operators use 32-bit integers

## Numeric Literals

**Integer Literals:**

```javascript
// Decimal (base-10)
0, 3, 10000000;

// Hexadecimal (base-16) - prefix 0x or 0X
0xff; // 255
0xbadcafe; // 195939070

// Binary (base-2) - prefix 0b or 0B (ES6+)
0b10101; // 21

// Octal (base-8) - prefix 0o or 0O (ES6+)
0o377; // 255
```

**Floating-Point Literals:**

```javascript
3.14;
2345.6789;
0.333333333333333333;

// Exponential notation: [digits][.digits][(E|e)[(+|-)]digits]
6.02e23; // 6.02 × 10²³
1.4738223e-32; // 1.4738223 × 10⁻³²
```

**Numeric Separators (modern JavaScript):**

```javascript
let billion = 1_000_000_000; // Thousands separator
let bytes = 0x89_ab_cd_ef; // Bytes separator
let bits = 0b0001_1101_0111; // Nibble separator
let fraction = 0.123_456_789; // Fractional part too
```

## Arithmetic Operators

**Basic operators:**

- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `%` modulo (remainder)
- `**` exponentiation (ES2016+)

**Negative sign:** Any numeric literal can be preceded by `-` to make it negative

## Math Object Functions

**Basic Math Functions:**

```javascript
Math.pow(2, 53); // 2 to the power 53
Math.round(0.6); // 1.0 - nearest integer
Math.ceil(0.6); // 1.0 - round up
Math.floor(0.6); // 0.0 - round down
Math.abs(-5); // 5 - absolute value
Math.max(x, y, z); // Largest argument
Math.min(x, y, z); // Smallest argument
Math.random(); // Random: 0 <= x < 1.0
Math.sqrt(3); // Square root
```

**Math Constants:**

```javascript
Math.PI; // π: circumference/diameter
Math.E; // e: base of natural logarithm
```

**Trigonometry & Logarithms:**

```javascript
Math.sin(0); // Sine (also cos, tan, atan, etc.)
Math.log(10); // Natural logarithm
Math.log(100) / Math.LN10; // Base-10 logarithm
Math.log(512) / Math.LN2; // Base-2 logarithm
Math.exp(3); // e cubed
```

**ES6 Math Functions:**

```javascript
Math.cbrt(27); // 3 - cube root
Math.hypot(3, 4); // 5 - square root of sum of squares
Math.log10(100); // 2 - base-10 logarithm
Math.log2(1024); // 10 - base-2 logarithm
Math.log1p(x); // Natural log of (1+x) - accurate for small x
Math.expm1(x); // Math.exp(x)-1 - inverse of Math.log1p()
Math.sign(x); // -1, 0, or 1 for <, ==, or > 0
Math.imul(2, 3); // 6 - optimized 32-bit integer multiplication
Math.clz32(0xf); // 28 - leading zero bits in 32-bit integer
Math.trunc(3.9); // 3 - truncate fractional part
Math.fround(x); // Round to nearest 32-bit float
Math.sinh(x); // Hyperbolic sine (also cosh, tanh)
Math.asinh(x); // Hyperbolic arcsine (also acosh, atanh)
```

## Special Numeric Values

**Infinity:**

- Result of overflow (number too large)
- Operations with infinity return infinity
- Access via `Infinity`, `Number.POSITIVE_INFINITY`
- `1/0` returns `Infinity`

**Negative Infinity:**

- Result of negative overflow
- Access via `-Infinity`, `Number.NEGATIVE_INFINITY`
- `-1/0` returns `-Infinity`

**NaN (Not-a-Number):**

- Result of: `0/0`, `Infinity/Infinity`, sqrt of negative, arithmetic with non-convertible values
- Access via `NaN` or `Number.NaN`
- **Special property: NaN !== NaN** (doesn't equal itself!)
- Check with: `x != x` or `Number.isNaN(x)`

**Underflow:**

- Result closer to zero than smallest representable number
- Returns `0` or negative zero (`-0`)

**Negative Zero (-0):**

- Almost indistinguishable from regular zero
- `0 === -0` returns `true`
- Only difference: `1/0 !== 1/-0` (Infinity vs -Infinity)

## Number Properties & Methods (ES6)

```javascript
// Constants
Number.POSITIVE_INFINITY;
Number.NEGATIVE_INFINITY;
Number.MAX_VALUE; // Largest representable number
Number.MIN_VALUE; // Smallest positive number
Number.NaN;
Number.MIN_SAFE_INTEGER; // -(2**53 - 1)
Number.MAX_SAFE_INTEGER; // 2**53 - 1
Number.EPSILON; // 2**-52: smallest difference

// Methods
Number.parseInt(); // Same as global parseInt()
Number.parseFloat(); // Same as global parseFloat()
Number.isNaN(x); // Is x the NaN value?
Number.isFinite(x); // Is x finite?
Number.isInteger(x); // Is x an integer?
Number.isSafeInteger(x); // Is -(2**53) < x < 2**53?
```

**Global vs Number methods:**

- `isNaN()` - returns true if argument is NaN OR can't convert to number
- `Number.isNaN()` - only true if argument IS NaN
- `isFinite()` - true if argument is or converts to finite number
- `Number.isFinite()` - true only if argument is finite number (not NaN, ±Infinity)

## Binary Floating-Point & Rounding Errors

**Key Issue:**

- JavaScript uses binary floating-point representation
- Can exactly represent: 1/2, 1/8, 1/1024
- **Cannot exactly represent: 0.1, 1/10, 1/100** (decimal fractions)

**Classic Example:**

```javascript
let x = 0.3 - 0.2; // 0.09999999999999998
let y = 0.2 - 0.1; // 0.1
x === y; // false!
x === 0.1; // false
y === 0.1; // true
```

**Why it happens:**

- 18,437,736,874,454,810,627 numbers can be represented exactly
- Other numbers are approximations
- Not specific to JavaScript - affects all languages using binary floating-point

**Solutions:**

- Don't compare floats with `===` for equality
- Use scaled integers (e.g., cents instead of dollars for money)
- Values are adequate for most purposes; problem only appears with equality comparison

## BigInt (ES2020)

**Purpose:**

- Represent arbitrary precision integers
- Enables 64-bit integers (compatibility with other languages/APIs)
- Can have thousands or millions of digits
- **Not suitable for cryptography** (no timing attack prevention)

**Syntax:**

```javascript
// Literals - digits followed by 'n'
1234n; // Decimal
0b111111n; // Binary
0o7777n; // Octal
0x8000000000000000n; // Hexadecimal (2^63)

// Conversion
BigInt(Number.MAX_SAFE_INTEGER); // 9007199254740991n
BigInt('1' + '0'.repeat(100)); // 10^100
```

**Arithmetic:**

```javascript
1000n + 2000n; // 3000n
3000n - 2000n; // 1000n
2000n * 3000n; // 6000000n
3000n / 997n; // 3n - drops remainder, rounds toward zero
(3000n %
  997n(
    // 9n - remainder
    2n ** 131071n
  )) -
  1n; // Mersenne prime with 39457 digits
```

**Important Rules:**

- **Cannot mix BigInt with regular numbers** in arithmetic (`+`, `-`, `*`, `/`, `%`, `**`)
- Reason: Neither type is more general (BigInt = large but integers only; Number = smaller but includes decimals)
- **Comparison operators DO work** with mixed types
- Bitwise operators work with BigInt
- **Math object functions do NOT accept BigInt**

**Comparison Examples:**

```javascript
1 < 2n; // true
2 > 1n; // true
0 == 0n; // true
0 === 0n; // false - strict equality checks type too
```

## Date and Times

**Date Class:**

- Represents dates and times
- Numeric representation: timestamp (milliseconds since Jan 1, 1970)

```javascript
let timestamp = Date.now(); // Current time as number
let now = new Date(); // Current time as Date object
let ms = now.getTime(); // Convert to milliseconds
let iso = now.toISOString(); // Convert to standard string format
```

## Error Handling in Arithmetic

**JavaScript does NOT raise errors for:**

- Overflow → returns `Infinity` or `-Infinity`
- Underflow → returns `0` or `-0`
- Division by zero → returns `Infinity` or `-Infinity`
- Exception: `0/0` → returns `NaN`
