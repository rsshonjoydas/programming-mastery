# JavaScript null and undefined

## Core Definitions

**null:**

- Language **keyword** that evaluates to a special value
- Indicates **intentional absence** of a value
- Sole member of its own type
- Can be thought of as special object value meaning "no object"
- Represents "no value" for any type (numbers, strings, objects)
- **Program-level, normal, or expected** absence of value
- Equivalents in other languages: NULL, nil, None

**undefined:**

- Predefined **global constant** (not a keyword like null)
- Represents a **deeper kind of absence**
- Sole member of its own special type
- Indicates uninitialized or missing values
- **System-level, unexpected, or error-like** absence of value

## typeof Behavior

```javascript
typeof null; // "object" (historical bug/quirk in JavaScript)
typeof undefined; // "undefined"
```

## When You Get Each Value

**undefined appears when:**

- Variables declared but not initialized: `let x; // x is undefined`
- Object properties that don't exist: `obj.nonExistent`
- Array elements that don't exist: `arr[999]`
- Functions with no explicit return value: `function f() {} // returns undefined`
- Function parameters with no argument passed: `function f(x) {} f(); // x is undefined`

**null is used when:**

- Deliberately assigning "no value": `let user = null;`
- Intentionally clearing/resetting a value: `obj.property = null`
- API returns to indicate "nothing found" (by design)

## Similarities (Both)

### Equality

```javascript
null == undefined; // true (loose equality - considers them equal)
null === undefined; // false (strict equality - they ARE different)
null == 0; // false (special case)
undefined == 0; // false
```

### Falsy Values

```javascript
if (!null) {
} // executes (null is falsy)
if (!undefined) {
} // executes (undefined is falsy)

Boolean(null); // false
Boolean(undefined); // false
!!null; // false
!!undefined; // false
```

### No Properties or Methods

```javascript
null.toString(); // TypeError
undefined.toString(); // TypeError

null.property; // TypeError
undefined.property; // TypeError

null[0]; // TypeError
undefined[0]; // TypeError
```

## Type Conversion Behavior

### To String

```javascript
String(null); // "null"
String(undefined); // "undefined"
null + ''; // "null"
undefined + ''; // "undefined"
```

### To Number

```javascript
Number(null); // 0
Number(undefined); // NaN

null + 5; // 5 (null becomes 0)
undefined + 5; // NaN
```

### Comparison Quirks

```javascript
// Relational operators
null > 0; // false
null >= 0; // true (null converts to 0)
null == 0; // false (special case!)

undefined > 0; // false
undefined >= 0; // false
```

## Checking for null/undefined

**Check for either:**

```javascript
if (value == null) {
} // true for both null and undefined
if (value != null) {
} // false for both null and undefined
```

**Check specifically:**

```javascript
if (value === null) {
} // only null
if (value === undefined) {
} // only undefined
```

**Check if value exists:**

```javascript
if (value) {
} // false for all falsy values (including null/undefined)
```

## Best Practices

### When to Use Which

**Use null when:**

- Intentionally assigning "no value"
- Representing program-level, expected absence
- Clearing/resetting values: `user = null`
- API design for "not found" scenarios

**Use undefined when:**

- Letting JavaScript handle uninitialized state
- Representing system-level, unexpected absence
- Optional function parameters

### Recommended Approaches

**Primary recommendation:**

- Avoid using both when possible
- When needed, prefer `null` for intentional "no value"
- Use `===` to distinguish between them when necessary

**Alternative approach:**

- Some programmers avoid `null` entirely
- Use `undefined` in all cases instead

## Modern Alternatives (ES2020)

**Optional Chaining:**

```javascript
obj?.property; // undefined if obj is null/undefined
arr?.[0]; // undefined if arr is null/undefined
func?.(arg); // undefined if func is null/undefined
```

**Nullish Coalescing:**

```javascript
value ?? defaultValue; // defaultValue only if value is null/undefined
// vs
value || defaultValue; // defaultValue for ANY falsy value
```

## Common Gotchas

```javascript
// typeof null quirk
typeof null ===
  'object'[ // true (bug from early JavaScript)
    // Array methods
    (null, undefined)
  ].length; // 2 (both are valid array elements)

// JSON differences
JSON.stringify({ a: null }); // {"a":null}
JSON.stringify({ a: undefined }); // {} (undefined is omitted!)

// Function defaults
function f(x = 10) {}
f(null); // x is null (default NOT used)
f(undefined); // x is 10 (default IS used)
f(); // x is 10 (default IS used)
```

## Quick Reference Table

| Aspect             | null                    | undefined                    |
| ------------------ | ----------------------- | ---------------------------- |
| **Nature**         | Keyword                 | Global constant              |
| **typeof**         | "object" (quirk)        | "undefined"                  |
| **Meaning**        | Intentional absence     | Uninitialized/system absence |
| **Use case**       | Program-level, expected | System-level, unexpected     |
| **== each other**  | true                    | true                         |
| **=== each other** | false                   | false                        |
| **Falsy?**         | Yes                     | Yes                          |
| **To Number**      | 0                       | NaN                          |
| **Properties?**    | No (TypeError)          | No (TypeError)               |

## Bottom Line

- Both indicate absence of value but with different intentions
- Use `===` to distinguish between them
- Prefer `null` for intentional "no value" assignments
- Use modern alternatives (optional chaining `?.` and nullish coalescing `??`) for safer code
- Remember: `null == undefined` is `true`, but `null === undefined` is `false`
