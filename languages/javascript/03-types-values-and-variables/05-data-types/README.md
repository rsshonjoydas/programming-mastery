# JavaScript Data Types

JavaScript has **8 data types** divided into two categories:

## Primitive Data Types (7)

**1. String**

- Text data enclosed in quotes
- `"hello"`, `'world'`, `` `template` ``

**2. Number**

- All numeric values (integers and decimals)
- `42`, `3.14`, `NaN`, `Infinity`

**3. BigInt**

- For integers larger than 2^53 - 1
- `123456789012345678901234567890n`

**4. Boolean**

- Logical values
- `true`, `false`

**5. Undefined**

- Variable declared but not assigned a value
- `let x; // x is undefined`

**6. Null**

- Intentional absence of value
- `let x = null;`

**7. Symbol**

- Unique, immutable identifier (ES6+)
- `Symbol('description')`

## Non-Primitive Data Type (1)

**8. Object**

- Collections of key-value pairs
- Includes: plain objects, arrays, functions, dates, etc.
- `{}`, `[]`, `function() {}`, `new Date()`

## Key Concepts

**Dynamic Typing**: Variables can hold any data type and can change types during runtime.

**Type Checking**: Use `typeof` operator to check types (note: `typeof null` returns `"object"`, which is a known quirk).

**Primitives vs Objects**: Primitives are immutable and stored by value. Objects are mutable and stored by reference.

That covers the essentials! Need details on any specific type?
