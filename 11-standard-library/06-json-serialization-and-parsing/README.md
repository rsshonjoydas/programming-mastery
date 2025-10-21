# JavaScript JSON Serialization and Parsing

## What is JSON?

**JSON (JavaScript Object Notation)** is a data serialization format that converts in-memory data structures into strings for storage or transmission, and back again.

### Why Use JSON?

**Serialization** (also called marshaling or pickling) is the process of converting data structures into streams of bytes or characters that can be:

- Saved to files
- Transmitted across networks
- Stored in databases
- Shared between programs

---

## JSON Support in JavaScript

### Supported Types

JSON supports:

- **Primitives**: `number`, `string`, `boolean`, `null`
- **Structures**: `object`, `array`

### Not Supported

JSON does **not** support:

- `Map`, `Set`
- `RegExp`
- `Date` (serialized as strings)
- Typed arrays
- Functions
- `undefined`
- `Symbol`

Despite limitations, JSON is **versatile** and widely used across programming languages.

---

## Core Functions

JavaScript provides two built-in functions for JSON:

| Function           | Purpose              | Input        | Output       |
| ------------------ | -------------------- | ------------ | ------------ |
| `JSON.stringify()` | Serialize (encode)   | Object/Array | String       |
| `JSON.parse()`     | Deserialize (decode) | String       | Object/Array |

---

## JSON.stringify()

Converts JavaScript values to JSON strings.

### Basic Usage

```javascript
let o = { s: '', n: 0, a: [true, false, null] };
let s = JSON.stringify(o);
// s == '{"s":"","n":0,"a":[true,false,null]}'
```

### Syntax

```javascript
JSON.stringify(value, replacer, space);
```

**Parameters**:

1. `value` - The value to serialize
2. `replacer` (optional) - Function or array to filter/transform values
3. `space` (optional) - Number or string for formatting/indentation

---

## JSON.parse()

Converts JSON strings back to JavaScript values.

### **Basic Usage**

```javascript
let s = '{"s":"","n":0,"a":[true,false,null]}';
let copy = JSON.parse(s);
// copy == { s: "", n: 0, a: [true, false, null] }
```

### **Syntax**

```javascript
JSON.parse(text, reviver);
```

**Parameters**:

1. `text` - JSON string to parse
2. `reviver` (optional) - Function to transform parsed values

---

## Practical Examples

### Deep Copy (Inefficient but Simple)

```javascript
function deepcopy(o) {
  return JSON.parse(JSON.stringify(o));
}

let original = { x: 1, nested: { y: 2 } };
let copy = deepcopy(original);
copy.nested.y = 99;
console.log(original.nested.y); // 2 (unchanged)
```

**Note**: Only works with JSON-serializable values.

### Round-Trip Example

```javascript
let data = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'coding'],
  active: true,
};

let json = JSON.stringify(data);
console.log(json);
// '{"name":"Alice","age":30,"hobbies":["reading","coding"],"active":true}'

let restored = JSON.parse(json);
console.log(restored);
// { name: "Alice", age: 30, hobbies: ["reading", "coding"], active: true }
```

---

## Formatting Output (Third Argument)

Make JSON human-readable with the `space` parameter.

### Using a Number (Spaces per Indent Level)

```javascript
let o = { s: 'test', n: 0 };
JSON.stringify(o, null, 2);
// Output:
// '{
//   "s": "test",
//   "n": 0
// }'
```

### Using a String (Custom Indentation)

```javascript
JSON.stringify(o, null, '\t');
// Output:
// '{
// \t"s": "test",
// \t"n": 0
// }'
```

**Note**: `JSON.parse()` ignores whitespace, so formatting doesn't affect parsing.

---

## JSON Customizations

### The toJSON() Method

Objects can define a `toJSON()` method to customize their serialization.

#### Date Example (Built-in)

```javascript
let obj = { created: new Date() };
JSON.stringify(obj);
// '{"created":"2025-10-21T12:34:56.789Z"}'
// Date automatically converted to ISO string
```

#### Custom toJSON()

```javascript
let user = {
  name: 'Alice',
  password: 'secret123',
  toJSON() {
    return { name: this.name }; // Omit password
  },
};

JSON.stringify(user);
// '{"name":"Alice"}'
```

---

## The Reviver Function (JSON.parse)

Transform values during parsing with a **reviver** function.

### Syntax

```javascript
JSON.parse(text, function (key, value) {
  // Return modified value, undefined to delete, or value unchanged
});
```

### Parameters

- **key**: Property name (string) or array index
- **value**: The primitive value being parsed
- **this**: The containing object/array

### Example: Recreating Date Objects

```javascript
let text = '{"name":"Alice","created":"2025-10-21T12:34:56.789Z"}';

let data = JSON.parse(text, function (key, value) {
  // Check if value is ISO 8601 date string
  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  ) {
    return new Date(value);
  }
  return value;
});

console.log(data.created instanceof Date); // true
```

### Example: Filtering Properties

```javascript
let text = '{"name":"Alice","_internal":"secret","age":30}';

let data = JSON.parse(text, function (key, value) {
  // Remove properties starting with underscore
  if (key[0] === '_') return undefined;
  return value;
});

console.log(data);
// { name: "Alice", age: 30 }
```

---

## The Replacer Function/Array (JSON.stringify)

Control which properties are serialized with the **replacer** parameter.

### Replacer as Array (Property Whitelist)

```javascript
let address = {
  name: 'John Doe',
  street: '123 Main St',
  city: 'Boston',
  state: 'MA',
  country: 'USA',
  zip: '02101',
};

let text = JSON.stringify(address, ['city', 'state', 'country']);
// '{"city":"Boston","state":"MA","country":"USA"}'
```

**Benefits**:

- Controls property order
- Useful for testing
- Omits unwanted properties

### Replacer as Function

```javascript
JSON.stringify(value, function (key, value) {
  // Return modified value, undefined to omit, or value unchanged
});
```

**Parameters**:

- **key**: Property name or array index
- **value**: The value being stringified
- **this**: The containing object/array

### Example: Omitting RegExp Values

```javascript
let obj = {
  name: 'test',
  pattern: /abc/,
  value: 42,
};

let json = JSON.stringify(obj, (key, value) => {
  return value instanceof RegExp ? undefined : value;
});

console.log(json);
// '{"name":"test","value":42}'
```

### Example: Custom Transformations

```javascript
let data = {
  name: 'Alice',
  birthDate: new Date('1990-01-15'),
  salary: 75000,
};

let json = JSON.stringify(data, (key, value) => {
  // Convert dates to custom format
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  // Redact salary
  if (key === 'salary') {
    return '[REDACTED]';
  }
  return value;
});

console.log(json);
// '{"name":"Alice","birthDate":"1/15/1990","salary":"[REDACTED]"}'
```

---

## Security Warning: JSON vs eval()

⚠️ **NEVER use `eval()` to parse JSON!**

```javascript
// DON'T DO THIS - HUGE SECURITY HOLE!
let data = eval('(' + jsonString + ')');

// ALWAYS USE JSON.parse() instead
let data = JSON.parse(jsonString);
```

**Why?**

- JSON is valid JavaScript, but `eval()` executes **any** code
- Attackers can inject malicious JavaScript
- `JSON.parse()` is faster and safer

---

## JSON Format Rules

JSON is a **strict subset** of JavaScript with additional requirements:

| Feature             | JavaScript              | JSON                      |
| ------------------- | ----------------------- | ------------------------- |
| **Comments**        | Allowed                 | ❌ Not allowed            |
| **Property names**  | Can be unquoted         | ✅ Must use double quotes |
| **Strings**         | Single or double quotes | ✅ Must use double quotes |
| **Trailing commas** | Allowed                 | ❌ Not allowed            |

### Valid JSON

```json
{
  "name": "Alice",
  "age": 30,
  "active": true
}
```

### Invalid JSON

```json
{
  "name": "Alice", // ❌ Unquoted property name
  "age": 30, // ❌ Single quotes
  "active": true // ❌ Trailing comma
  // Comment here       // ❌ Comments not allowed
}
```

---

## Complete Examples

### Example 1: Configuration File

```javascript
let config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  features: {
    darkMode: true,
    notifications: false,
  },
};

// Save to file (human-readable)
let json = JSON.stringify(config, null, 2);
console.log(json);

// Load from file
let loadedConfig = JSON.parse(json);
```

### Example 2: API Data with Dates

```javascript
// Serialize
let event = {
  title: 'Meeting',
  date: new Date('2025-10-21T14:00:00Z'),
  attendees: ['Alice', 'Bob'],
};

let json = JSON.stringify(event);
console.log(json);
// '{"title":"Meeting","date":"2025-10-21T14:00:00.000Z","attendees":["Alice","Bob"]}'

// Deserialize with date restoration
let restored = JSON.parse(json, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});

console.log(restored.date instanceof Date); // true
```

### Example 3: Custom Serialization Format

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toJSON() {
    return `(${this.x},${this.y})`;
  }
}

let shape = {
  type: 'triangle',
  vertices: [new Point(0, 0), new Point(1, 0), new Point(0, 1)],
};

let json = JSON.stringify(shape, null, 2);
console.log(json);
// {
//   "type": "triangle",
//   "vertices": [
//     "(0,0)",
//     "(1,0)",
//     "(0,1)"
//   ]
// }

// Need custom reviver to restore Point objects
let restored = JSON.parse(json, (key, value) => {
  if (key === 'vertices') {
    return value.map((str) => {
      let [x, y] = str.slice(1, -1).split(',').map(Number);
      return new Point(x, y);
    });
  }
  return value;
});
```

---

## Best Practices

✅ **Use `JSON.stringify()` and `JSON.parse()`** - Never use `eval()`
✅ **Format for humans** - Use the third argument for configuration files
✅ **Handle Dates carefully** - Use reviver functions to restore Date objects
✅ **Validate input** - Always wrap `JSON.parse()` in try-catch
✅ **Understand limitations** - Know what types JSON doesn't support
✅ **Use replacer wisely** - Filter sensitive data before serialization
✅ **Document custom formats** - If using toJSON() or custom revivers
⚠️ **Avoid custom formats** - They sacrifice portability and compatibility

---

## Key Concepts Summary

📌 **JSON** converts data structures to strings (serialization) and back (parsing)
📌 **`JSON.stringify()`** converts objects/arrays to JSON strings
📌 **`JSON.parse()`** converts JSON strings back to objects/arrays
📌 **Third argument** of `stringify()` formats output with indentation
📌 **Reviver function** in `parse()` transforms values during parsing
📌 **Replacer** in `stringify()` filters or transforms values during serialization
📌 **`toJSON()` method** allows objects to customize their serialization
📌 **Date objects** automatically serialize to ISO 8601 strings
📌 **JSON is strict** - requires double quotes, no comments, no trailing commas
📌 **Security** - Never use `eval()` to parse JSON
📌 **Deep copy trick** - `JSON.parse(JSON.stringify(obj))` (for simple objects)
📌 **Custom formats** - Sacrifice portability for specific needs
