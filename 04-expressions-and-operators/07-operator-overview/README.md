# JavaScript Operator Overview

## Introduction to Operators

Operators are fundamental symbols and keywords used in JavaScript to perform operations on values and variables. They're used in:

- Arithmetic expressions
- Comparison expressions
- Logical expressions
- Assignment expressions
- And more

Operators can be represented by:

- **Punctuation characters** (e.g., `+`, `=`, `*`)
- **Keywords** (e.g., `delete`, `instanceof`, `typeof`)

Both types are regular operators with the same functionality—keyword operators simply have a more verbose syntax.

---

## Operator Reference Table

The following table organizes operators by **precedence** (highest to lowest). Operators within the same section (between horizontal lines) have equal precedence.

### Column Legend

- **A** = Associativity: L (left-to-right) or R (right-to-left)
- **N** = Number of operands
- **Types** = Expected operand types → result type

| Operator                                                                  | Operation                        | A     | N     | Types            |
| ------------------------------------------------------------------------- | -------------------------------- | ----- | ----- | ---------------- |
| `++`                                                                      | Pre- or post-increment           | R     | 1     | lval→num         |
| `--`                                                                      | Pre- or post-decrement           | R     | 1     | lval→num         |
| `-`                                                                       | Negate number                    | R     | 1     | num→num          |
| `+`                                                                       | Convert to number                | R     | 1     | any→num          |
| `~`                                                                       | Invert bits                      | R     | 1     | int→int          |
| `!`                                                                       | Invert boolean value             | R     | 1     | bool→bool        |
| `delete`                                                                  | Remove a property                | R     | 1     | lval→bool        |
| `typeof`                                                                  | Determine type of operand        | R     | 1     | any→str          |
| `void`                                                                    | Return undefined value           | R     | 1     | any→undef        |
| `**`                                                                      | **Exponentiation**               | **R** | **2** | **num,num→num**  |
| `*`, `/`, `%`                                                             | Multiply, divide, remainder      | L     | 2     | num,num→num      |
| `+`, `-`                                                                  | Add, subtract                    | L     | 2     | num,num→num      |
| `+`                                                                       | Concatenate strings              | L     | 2     | str,str→str      |
| `<<`                                                                      | Shift left                       | L     | 2     | int,int→int      |
| `>>`                                                                      | Shift right with sign extension  | L     | 2     | int,int→int      |
| `>>>`                                                                     | Shift right with zero extension  | L     | 2     | int,int→int      |
| `<`, `<=`, `>`, `>=`                                                      | Compare in numeric order         | L     | 2     | num,num→bool     |
| `<`, `<=`, `>`, `>=`                                                      | Compare in alphabetical order    | L     | 2     | str,str→bool     |
| `instanceof`                                                              | Test object class                | L     | 2     | obj,func→bool    |
| `in`                                                                      | Test whether property exists     | L     | 2     | any,obj→bool     |
| `==`                                                                      | Test for non-strict equality     | L     | 2     | any,any→bool     |
| `!=`                                                                      | Test for non-strict inequality   | L     | 2     | any,any→bool     |
| `===`                                                                     | Test for strict equality         | L     | 2     | any,any→bool     |
| `!==`                                                                     | Test for strict inequality       | L     | 2     | any,any→bool     |
| `&`                                                                       | Compute bitwise AND              | L     | 2     | int,int→int      |
| `^`                                                                       | Compute bitwise XOR              | L     | 2     | int,int→int      |
| `\|`                                                                      | Compute bitwise OR               | L     | 2     | int,int→int      |
| `&&`                                                                      | Compute logical AND              | L     | 2     | any,any→any      |
| `\|\|`                                                                    | Compute logical OR               | L     | 2     | any,any→any      |
| `??`                                                                      | Choose 1st defined operand       | L     | 2     | any,any→any      |
| `?:`                                                                      | Choose 2nd or 3rd operand        | R     | 3     | bool,any,any→any |
| `=`                                                                       | Assign to a variable or property | R     | 2     | lval,any→any     |
| `**=`, `*=`, `/=`, `%=`, `+=`, `-=`, `&=`, `^=`, `\|=`,`<<=`,`>>=`,`>>>=` | Operate and assign               | R     | 2     | lval,any→any     |
| `,`                                                                       | Discard 1st operand, return 2nd  | L     | 2     | any,any→any      |

---

## Key Concepts

### 1. Number of Operands (Arity)

#### **Unary Operators** (1 operand)

Convert a single expression into a more complex expression.

**Examples:**

```javascript
-x; // Negation
typeof x; // Type checking
++x; // Increment
```

#### **Binary Operators** (2 operands)

Combine two expressions into one.

**Examples:**

```javascript
x * y; // Multiplication
x + y; // Addition
x < y; // Comparison
```

#### **Ternary Operator** (3 operands)

JavaScript has one ternary operator: the conditional operator `?:`

**Example:**

```javascript
condition ? valueIfTrue : valueIfFalse;
```

---

### 2. Operand and Result Types

Most operators expect specific types but JavaScript performs **automatic type conversion** as needed.

#### Type Conversion Examples

```javascript
'3' * '5'; // 15 (strings converted to numbers)
'3' + '5'; // "35" (numbers would be converted to strings for +)
5 < '10'; // true (string converted to number)
```

#### Type-Dependent Behavior

The `+` operator behaves differently based on operand types:

```javascript
3 + 5; // 8 (addition)
'3' + '5'; // "35" (concatenation)
3 + '5'; // "35" (concatenation - number converted to string)
```

#### Truthy and Falsy Values

Operators expecting boolean operands work with any type because every JavaScript value is either "truthy" or "falsy":

```javascript
if (x) {
} // Works with any type of x
0 && true; // 0 (falsy)
'text' || false; // "text" (truthy)
```

#### lvalue (lval)

An **lvalue** is an expression that can appear on the left side of an assignment:

- Variables
- Object properties
- Array elements

```javascript
x = 5; // x is an lvalue
obj.prop = 10; // obj.prop is an lvalue
arr[0] = 20; // arr[0] is an lvalue
```

---

### 3. Operator Side Effects

Most operators are **pure** (no side effects), but some modify program state:

#### Operators with Side Effects

```javascript
x = 5; // Assignment changes x
x++; // Increment changes x
delete obj.prop; // Delete removes property
```

#### Operators without Side Effects

```javascript
2 * 3; // Pure calculation
x < y; // Pure comparison
typeof x; // Pure type check
```

**Important:** Function calls and object creation can have side effects if they use operators with side effects internally.

---

### 4. Operator Precedence

Precedence determines which operations execute first in expressions without parentheses.

#### Example

```javascript
w = x + y * z;
// Equivalent to: w = x + (y * z)
// Because * has higher precedence than +
```

#### Override with Parentheses

```javascript
w = (x + y) * z;
// Forces addition before multiplication
```

#### Key Precedence Rules to Remember

1. **Property access and function calls** have highest precedence
2. **Multiplication and division** before addition and subtraction
3. **Assignment** has very low precedence (almost always last)

#### Complex Example

```javascript
typeof my.functions[x](y);
// Order: property access → array index → function call → typeof
```

#### Special Cases

**Nullish coalescing (`??`)**: Must use parentheses when mixing with `&&` or `||`

```javascript
// ❌ Error: a ?? b || c
// ✅ Correct: (a ?? b) || c
```

**Exponentiation (`**`)\*\*: Must use parentheses with unary negation

```javascript
// ❌ Error: -x ** 2
// ✅ Correct: -(x ** 2) or (-x) ** 2
```

---

### 5. Operator Associativity

Associativity determines evaluation order for operators with **equal precedence**.

#### Left-to-Right (L)

```javascript
w = x - y - z;
// Equivalent to: w = ((x - y) - z)
```

#### Right-to-Left (R)

```javascript
w = x = y = z;
// Equivalent to: w = (x = (y = z))

y = a ** (b ** c);
// Equivalent to: y = (a ** (b ** c))

x = ~-y;
// Equivalent to: x = ~(-y)

q = a ? b : c ? d : e ? f : g;
// Equivalent to: q = a ? b : (c ? d : (e ? f : g))
```

#### Operators with Right-to-Left Associativity

- Exponentiation (`**`)
- Unary operators (`-`, `+`, `~`, `!`, etc.)
- Assignment operators (`=`, `+=`, `-=`, etc.)
- Ternary conditional (`?:`)

---

### 6. Order of Evaluation

JavaScript **always evaluates expressions left-to-right**, regardless of precedence or associativity.

#### Example

```javascript
w = x + y * z;
```

**Evaluation order:**

1. Evaluate `w`
2. Evaluate `x`
3. Evaluate `y`
4. Evaluate `z`
5. Multiply `y * z`
6. Add `x + (result)`
7. Assign to `w`

#### When Order Matters

Order of evaluation is important when expressions have **side effects**:

```javascript
arr[i++] = arr[i];
// If i = 0:
// 1. Evaluate arr[i++] → arr[0], then i becomes 1
// 2. Evaluate arr[i] → arr[1]
// 3. Assign arr[1] to arr[0]
```

#### Precedence vs. Evaluation Order

**Precedence** controls which operations happen first.
**Evaluation order** controls which subexpressions are calculated first.

```javascript
let a = 1;
let result = (a = 2) + (a = 3);
// Evaluation: left to right
// 1. (a = 2) → a becomes 2, returns 2
// 2. (a = 3) → a becomes 3, returns 3
// 3. 2 + 3 → result = 5
```

---

## Best Practices

1. **Use parentheses** when precedence is unclear—readability matters more than memorizing precedence rules
2. **Be explicit** with `??`, `||`, and `&&` combinations
3. **Watch for side effects** in complex expressions
4. **Understand type coercion**—know when JavaScript converts types automatically
5. **Use strict equality** (`===`, `!==`) unless you specifically need type coercion

---

## Quick Reference: Common Pitfalls

```javascript
// ❌ Pitfall: String concatenation vs addition
'3' + 5; // "35" (not 8)

// ✅ Solution: Convert explicitly
Number('3') + 5; // 8
parseInt('3') + 5; // 8

// ❌ Pitfall: Loose equality
0 == false; // true
'' == false; // true

// ✅ Solution: Use strict equality
0 === false; // false
'' === false; // false

// ❌ Pitfall: Assignment in condition
if ((x = 5)) {
} // Always true (assigns 5 to x)

// ✅ Solution: Use comparison
if (x === 5) {
} // Compares x to 5

// ❌ Pitfall: Precedence confusion
5 +
  3 *
    2(
      // 11 (not 16)

      // ✅ Solution: Use parentheses
      5 + 3
    ) *
    2; // 16
```

---

## Summary

JavaScript operators are powerful tools that follow specific rules:

- **Precedence** determines operation order
- **Associativity** resolves same-precedence conflicts
- **Evaluation** always proceeds left-to-right
- **Type conversion** happens automatically but predictably
- **Side effects** can change program state

Mastering these concepts enables you to write clear, predictable, and efficient JavaScript code.
