# JavaScript Assignment Expressions

Let me enhance your notes with a comprehensive explanation:

## Basic Assignment Operator (=)

The `=` operator assigns a value to a variable or property:

```javascript
i = 0; // Set variable i to 0
o.x = 1; // Set property x of object o to 1
arr[0] = 5; // Set first array element to 5
```

**Key Points:**

- **Left-side (lvalue)**: Must be a variable, object property, or array element
- **Right-side**: Can be any value of any type
- **Return value**: The assignment expression returns the value being assigned

## Assignment as an Expression

Since assignment returns a value, you can use it within larger expressions:

```javascript
(a = b) === 0; // Assign b to a, then compare result to 0

// Common pattern: assign and check in one step
while ((line = readNextLine()) !== null) {
  process(line);
}
```

**Important**:

- `=` (assignment) vs `===` (comparison) - don't confuse them!
- `=` has very low precedence, so use parentheses when needed

## Right-to-Left Associativity

Multiple assignments are evaluated from right to left:

```javascript
i = j = k = 0; // First: k = 0, then: j = 0, then: i = 0
// All three variables are now 0
```

## Compound Assignment Operators

JavaScript provides shortcuts that combine an operation with assignment:

### Common Compound Operators

| Operator | Example   | Equivalent   | Operation              |
| -------- | --------- | ------------ | ---------------------- |
| `+=`     | `a += b`  | `a = a + b`  | Addition/Concatenation |
| `-=`     | `a -= b`  | `a = a - b`  | Subtraction            |
| `*=`     | `a *= b`  | `a = a * b`  | Multiplication         |
| `/=`     | `a /= b`  | `a = a / b`  | Division               |
| `%=`     | `a %= b`  | `a = a % b`  | Modulus (remainder)    |
| `**=`    | `a **= b` | `a = a ** b` | Exponentiation         |

### Bitwise Compound Operators

| Operator | Example    | Equivalent    | Operation                      |
| -------- | ---------- | ------------- | ------------------------------ |
| `<<=`    | `a <<= b`  | `a = a << b`  | Left shift                     |
| `>>=`    | `a >>= b`  | `a = a >> b`  | Right shift (sign-propagating) |
| `>>>=`   | `a >>>= b` | `a = a >>> b` | Right shift (zero-fill)        |
| `&=`     | `a &= b`   | `a = a & b`   | Bitwise AND                    |
| `\|=`    | `a \|= b`  | `a = a \| b`  | Bitwise OR                     |
| `^=`     | `a ^= b`   | `a = a ^ b`   | Bitwise XOR                    |

### Practical Examples

```javascript
// Arithmetic
let total = 100;
total += 20; // total is now 120
total -= 10; // total is now 110
total *= 2; // total is now 220
total /= 4; // total is now 55

// String concatenation
let message = 'Hello';
message += ' World'; // "Hello World"

// With tax calculation
let price = 100;
let taxRate = 0.08;
price += price * taxRate; // price = 108 (100 + 8)
```

## Critical Difference: Side Effects

**Key Concept**: `a op= b` evaluates `a` **once**, while `a = a op b` evaluates it **twice**.

This matters when `a` has side effects:

```javascript
// DIFFERENT behaviors:
data[i++] *= 2; // i is incremented ONCE
data[i++] = data[i++] * 2; // i is incremented TWICE (wrong!)

// Example with side effects:
let i = 0;
let data = [10, 20, 30];

data[i++] *= 2; // data[0] = 20, i = 1 ✓
// vs
i = 0;
data[i++] = data[i++] * 2; // Reads data[0], increments to 1,
// then assigns to data[1]! ✗
```

**When it matters:**

- Function calls: `getValue() += 5` calls function once
- Increment/decrement operators: `arr[i++]`, `obj[getKey()]`
- Property access with side effects

## Best Practices

1. **Use compound operators for clarity and efficiency**

   ```javascript
   count += 1; // Better than: count = count + 1
   ```

2. **Be careful with parentheses**

   ```javascript
   if ((x = getValue()) > 0) {
   } // Assignment inside condition
   ```

3. **Avoid complex assignments**

   ```javascript
   // Harder to read
   x = y = z = calculateValue();

   // Clearer
   let value = calculateValue();
   x = value;
   y = value;
   z = value;
   ```

4. **Watch for type coercion with +=**

   ```javascript
   let x = '5';
   x += 2; // "52" (string concatenation!)

   let y = 5;
   y += '2'; // "52" (converts to string!)
   ```

This covers all the essential aspects of assignment expressions in JavaScript!
