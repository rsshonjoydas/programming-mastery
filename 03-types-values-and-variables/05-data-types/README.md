# JavaScript Data Types

## JavaScript Data Types (8 Total)

### Primitive Types (7) - Immutable

1. **String** - Text data in quotes: `"hello"`, `'world'`, `` `template` ``
2. **Number** - All numeric values: `42`, `3.14`, `NaN`, `Infinity`
3. **BigInt** - Large integers beyond 2^53 - 1: `123456789012345678901234567890n`
4. **Boolean** - Logical values: `true`, `false`
5. **Undefined** - Declared but unassigned: `let x; // undefined`
6. **Null** - Intentional absence of value: `let x = null;`
7. **Symbol** - Unique identifiers (ES6+): `Symbol('description')`

### Object Types (1) - Mutable

**Object** - Collections of key-value pairs, includes:

- Plain objects (unordered named values): `{}`
- Arrays (ordered numbered values): `[]`
- Functions: `function() {}`
- Special objects: Set, Map, typed arrays, RegExp, Date, Error
- Functions and classes (specialized objects)

## Type Conversion

**Liberal Conversion Rules:**
JavaScript automatically converts values from one type to another when needed (e.g., string expected but number given → converts to string)

### Equality & Conversion

- **`==` (loose equality)**: Performs type conversions | _Deprecated in practice_
- **`===` (strict equality)**: NO type conversions | _Preferred/recommended_

## Key Characteristics

### Mutability

- **Primitives**: Immutable (cannot change the value itself)
- **Objects/Arrays**: Mutable (can change properties/elements)
- **Strings**: Immutable despite seeming like character arrays

### Methods

- Only objects technically have methods
- Numbers, strings, booleans, symbols **behave as if** they have methods
- **null and undefined CANNOT have methods invoked on them**

### Dynamic Typing

- Variables can hold any data type
- Types can change during runtime
- Use `typeof` to check types (note: `typeof null` returns `"object"` - known quirk)

### Storage

- **Primitives**: Stored by value
- **Objects**: Stored by reference

### Memory Management

- Automatic garbage collection
- Values become reclaimable when no longer reachable

### Variables

- Declared with `const` or `let` (modern) or `var` (older)
- **Untyped**: Don't specify what kind of values will be assigned
