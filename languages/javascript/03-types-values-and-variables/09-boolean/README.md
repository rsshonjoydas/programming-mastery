# Boolean Values

## Definition

Boolean represents **truth or falsehood** (on/off, yes/no). Only two possible values:

- `true`
- `false`

## How Booleans Are Created

**From Comparisons:**

```javascript
a === 4; // true if a equals 4, false otherwise
```

**Used in Control Structures:**

```javascript
if (a === 4) {
  b = b + 1;
} else {
  a = a + 1;
}
```

## Type Conversion to Boolean

**Any JavaScript value can convert to boolean.**

**Falsy Values** (convert to `false`):

1. `undefined`
2. `null`
3. `0`
4. `-0`
5. `NaN`
6. `""` (empty string)

**Truthy Values** (convert to `true`):

- **All other values**, including:
  - All objects (even empty `{}`)
  - All arrays (even empty `[]`)
  - Non-empty strings
  - Non-zero numbers

## Practical Usage

**Explicit Comparison:**

```javascript
if (o !== null) ...  // Executes only if o is NOT null
```

**Implicit Conversion (Truthy/Falsy Check):**

```javascript
if (o) ...  // Executes if o is NOT any falsy value
```

**When to use which:**

- Use **explicit comparison** when you need to distinguish between specific falsy values (e.g., `null` vs `0` vs `""`)
- Use **implicit conversion** when you want to check against any falsy value

## Boolean Operators

**&& (AND Operator):**

- Returns truthy **only if BOTH operands are truthy**
- Returns falsy otherwise

**|| (OR Operator):**

- Returns truthy **if EITHER operand is truthy**
- Returns falsy only if **BOTH operands are falsy**

**! (NOT Operator - Unary):**

- Returns `true` if operand is **falsy**
- Returns `false` if operand is **truthy**

**Example:**

```javascript
if ((x === 0 && y === 0) || !(z === 0)) {
  // Executes if: x AND y are both zero, OR z is non-zero
}
```

## Methods

**toString():**

- Converts boolean to string `"true"` or `"false"`
- No other useful methods available

## Key Takeaways

✓ Only 6 falsy values exist; everything else is truthy
✓ Objects and arrays are ALWAYS truthy (even when empty)
✓ JavaScript expects boolean values in conditions but accepts any value
✓ Choose explicit vs implicit checks based on your needs
✓ Boolean operators work with truthy/falsy values, not just true/false
