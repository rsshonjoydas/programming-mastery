# JavaScript Primary Expressions

Primary expressions are the **simplest building blocks** of JavaScript code—they cannot be broken down into smaller expressions. Let me break this down comprehensively:

## What Are Primary Expressions?

Primary expressions are standalone expressions that don't contain any simpler sub-expressions. Think of them as the "atoms" of JavaScript code.

## Types of Primary Expressions

### 1. **Literals (Constant Values)**

Literals are fixed values written directly into your code:

**Number Literals:**

```javascript
1.23;
42;
3.14159;
0xff; // Hexadecimal
0b1010; // Binary
1.5e3; // Scientific notation (1500)
```

**String Literals:**

```javascript
'hello';
'world'`template string`;
('multi\nline');
```

**Regular Expression Literals:**

```javascript
/pattern/
/[a-z]+/i
/\d{3}-\d{4}/
```

**Other Literals:**

```javascript
true; // Boolean literal
false; // Boolean literal
null; // Null literal
```

### 2. **Reserved Keywords as Primary Expressions**

Certain JavaScript keywords evaluate to specific values:

```javascript
true; // → boolean true value
false; // → boolean false value
null; // → null value
this; // → context-dependent (the "current" object)
```

**Important Note about `this`:**

- Unlike `true`, `false`, and `null`, `this` is **not constant**
- It evaluates to different values depending on where it's used
- In object methods: `this` refers to the object the method was called on
- Used heavily in object-oriented programming

Example:

```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'this' refers to person object
  },
};
person.greet(); // "Alice"
```

### 3. **Variable/Property References**

When an identifier appears alone, JavaScript treats it as a reference:

```javascript
i; // → value of variable i
sum; // → value of variable sum
undefined; // → value of global 'undefined' property
```

**How References Work:**

- JavaScript looks up the identifier as a variable, constant, or global property
- If found: returns its value
- If not found: throws a `ReferenceError`

```javascript
let x = 10;
console.log(x); // 10 (valid reference)
console.log(y); // ReferenceError: y is not defined
```

## Key Takeaways

1. **Primary expressions stand alone** - they're not composed of smaller expressions
2. **Three categories**: Literals, keyword values, and identifiers
3. **Literals are constant** - their values are fixed at write-time
4. **`this` is special** - it's context-dependent, not a constant
5. **Unknown identifiers throw errors** - always declare variables before using them

## Visual Summary

```javascript
// LITERALS (fixed values)
42; // number
'text' // string
/regex/ // pattern
true,
false,
null; // special values

// KEYWORDS (reserved words)
this; // context object

// IDENTIFIERS (variable references)
myVariable; // looks up value
myFunction; // looks up function
globalProperty; // looks up property
```

These primary expressions form the foundation upon which more complex expressions (like function calls, property access, arithmetic operations) are built!
