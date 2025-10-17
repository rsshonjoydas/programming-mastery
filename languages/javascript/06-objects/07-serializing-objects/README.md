# JavaScript Serializing Objects

## What is Object Serialization?

**Serialization** is the process of converting an object's state into a string format that can be stored or transmitted, and later **deserialized** (restored) back to an object.

JavaScript uses the **JSON (JavaScript Object Notation)** format for serialization through two built-in functions:

- `JSON.stringify()` - Converts objects to JSON strings
- `JSON.parse()` - Converts JSON strings back to objects

---

## Basic Usage

### JSON.stringify()

Converts a JavaScript value to a JSON string:

```javascript
let o = { x: 1, y: { z: [false, null, ''] } };
let s = JSON.stringify(o);
console.log(s); // '{"x":1,"y":{"z":[false,null,""]}}'
```

### JSON.parse()

Converts a JSON string back to a JavaScript value:

```javascript
let s = '{"x":1,"y":{"z":[false,null,""]}}';
let p = JSON.parse(s);
console.log(p); // { x: 1, y: { z: [false, null, ''] } }
```

### Complete Example

```javascript
let original = { x: 1, y: { z: [false, null, ''] } };
let jsonString = JSON.stringify(original);
let restored = JSON.parse(jsonString);

console.log(original); // { x: 1, y: { z: [false, null, ''] } }
console.log(jsonString); // '{"x":1,"y":{"z":[false,null,""]}}'
console.log(restored); // { x: 1, y: { z: [false, null, ''] } }
```

---

## What Can Be Serialized?

### ✅ Supported Types

JSON supports these JavaScript types:

| Type         | Example         | Notes                          |
| ------------ | --------------- | ------------------------------ |
| **Objects**  | `{ a: 1 }`      | Only enumerable own properties |
| **Arrays**   | `[1, 2, 3]`     | Fully supported                |
| **Strings**  | `"hello"`       | Fully supported                |
| **Numbers**  | `42`, `3.14`    | Finite numbers only            |
| **Booleans** | `true`, `false` | Fully supported                |
| **null**     | `null`          | Fully supported                |

```javascript
let supported = {
  obj: { key: 'value' },
  arr: [1, 2, 3],
  str: 'hello',
  num: 42,
  bool: true,
  nul: null,
};

JSON.stringify(supported);
// '{"obj":{"key":"value"},"arr":[1,2,3],"str":"hello","num":42,"bool":true,"nul":null}'
```

### ❌ Unsupported Types

These values **cannot** be serialized:

| Type          | What Happens                                   | Example                       |
| ------------- | ---------------------------------------------- | ----------------------------- |
| **undefined** | Omitted from objects, becomes `null` in arrays | `{a: undefined}` → `'{}'`     |
| **Functions** | Omitted from objects, becomes `null` in arrays | `{fn: function(){}}` → `'{}'` |
| **Symbol**    | Omitted                                        | `{s: Symbol()}` → `'{}'`      |
| **RegExp**    | Becomes empty object                           | `/abc/` → `'{}'`              |
| **Error**     | Becomes empty object                           | `new Error()` → `'{}'`        |
| **NaN**       | Becomes `null`                                 | `NaN` → `'null'`              |
| **Infinity**  | Becomes `null`                                 | `Infinity` → `'null'`         |
| **-Infinity** | Becomes `null`                                 | `-Infinity` → `'null'`        |

```javascript
let unsupported = {
  undef: undefined, // Omitted
  func: function () {}, // Omitted
  sym: Symbol('test'), // Omitted
  regex: /abc/, // Becomes {}
  err: new Error(), // Becomes {}
  nan: NaN, // Becomes null
  inf: Infinity, // Becomes null
};

JSON.stringify(unsupported);
// '{"regex":{},"err":{},"nan":null,"inf":null}'
```

### Special Case: Date Objects

Date objects are serialized to **ISO-8601 formatted strings**, but `JSON.parse()` **does not** restore them as Date objects:

```javascript
let data = {
  timestamp: new Date('2024-01-01T00:00:00Z'),
};

let json = JSON.stringify(data);
// '{"timestamp":"2024-01-01T00:00:00.000Z"}'

let parsed = JSON.parse(json);
console.log(parsed.timestamp); // "2024-01-01T00:00:00.000Z" (string!)
console.log(typeof parsed.timestamp); // "string"
console.log(parsed.timestamp instanceof Date); // false

// Manual restoration required
parsed.timestamp = new Date(parsed.timestamp);
```

---

## JSON.stringify() Advanced Options

### Syntax

```javascript
JSON.stringify(value, replacer, space);
```

### Parameters

1. **value**: The value to serialize
2. **replacer** (optional): Function or array to control serialization
3. **space** (optional): String or number for pretty-printing

---

## The Replacer Parameter

### 1. Replacer Function

A function that transforms values during serialization:

```javascript
function replacer(key, value) {
  // Return modified value or undefined to omit
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
}

let obj = { name: 'alice', age: 30 };
JSON.stringify(obj, replacer);
// '{"name":"ALICE","age":30}'
```

**Common use cases**:

```javascript
// Filter out sensitive data
function filterSecrets(key, value) {
  if (key === 'password' || key === 'secret') {
    return undefined; // Omit property
  }
  return value;
}

let user = { name: 'John', password: 'secret123', email: 'john@example.com' };
JSON.stringify(user, filterSecrets);
// '{"name":"John","email":"john@example.com"}'
```

```javascript
// Convert special values
function customReplacer(key, value) {
  if (value === Infinity) return 'Infinity';
  if (value === -Infinity) return '-Infinity';
  if (Number.isNaN(value)) return 'NaN';
  return value;
}

let data = { a: 1, b: Infinity, c: NaN };
JSON.stringify(data, customReplacer);
// '{"a":1,"b":"Infinity","c":"NaN"}'
```

### 2. Replacer Array

An array of property names to include (whitelist):

```javascript
let obj = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  password: 'secret',
};

JSON.stringify(obj, ['name', 'email']);
// '{"name":"Alice","email":"alice@example.com"}'
```

---

## The Space Parameter

Controls indentation for pretty-printing:

### Number (indentation level)

```javascript
let obj = { name: 'Alice', age: 30 };

JSON.stringify(obj, null, 2);
/*
{
  "name": "Alice",
  "age": 30
}
*/
```

### String (custom indentation)

```javascript
JSON.stringify(obj, null, '\t');
/*
{
 "name": "Alice",
 "age": 30
}
*/
```

**Maximum**: 10 spaces/characters

```javascript
JSON.stringify(obj, null, 20); // Uses 10 spaces max
```

---

## JSON.parse() Advanced Options

### **Syntax**

```javascript
JSON.parse(text, reviver);
```

### The Reviver Function

A function that transforms values during parsing:

```javascript
function reviver(key, value) {
  // Transform value before returning
  return value;
}

let json = '{"name":"Alice","age":30}';
JSON.parse(json, reviver);
```

**Common use cases**:

### Restoring Date Objects

```javascript
function dateReviver(key, value) {
  // Check if value looks like ISO date string
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
}

let json = '{"name":"Alice","created":"2024-01-01T00:00:00.000Z"}';
let obj = JSON.parse(json, dateReviver);

console.log(obj.created instanceof Date); // true
```

### Converting Property Names

```javascript
function camelCaseReviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    let newObj = {};
    for (let k in value) {
      let camelKey = k.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      newObj[camelKey] = value[k];
    }
    return newObj;
  }
  return value;
}

let json = '{"first_name":"Alice","last_name":"Smith"}';
let obj = JSON.parse(json, camelCaseReviver);
// { firstName: "Alice", lastName: "Smith" }
```

### Filtering During Parse

```javascript
function filterReviver(key, value) {
  if (key === 'password') {
    return undefined; // Remove property
  }
  return value;
}

let json = '{"name":"Alice","password":"secret"}';
let obj = JSON.parse(json, filterReviver);
// { name: "Alice" }
```

---

## Custom Serialization with toJSON()

Objects can define a `toJSON()` method to customize their serialization:

```javascript
let obj = {
  name: 'Alice',
  birthdate: new Date('1990-01-01'),

  toJSON() {
    return {
      name: this.name,
      age: new Date().getFullYear() - this.birthdate.getFullYear(),
    };
  },
};

JSON.stringify(obj);
// '{"name":"Alice","age":34}'
```

**Date objects use toJSON()**:

```javascript
let date = new Date('2024-01-01');
date.toJSON(); // "2024-01-01T00:00:00.000Z"
```

---

## Common Use Cases

### 1. Deep Cloning Objects

```javascript
let original = { a: 1, b: { c: 2 } };
let clone = JSON.parse(JSON.stringify(original));

clone.b.c = 3;
console.log(original.b.c); // 2 (unchanged)
console.log(clone.b.c); // 3
```

**⚠️ Limitations**: Only works for JSON-serializable data (no functions, dates, etc.)

### 2. Storing Data in localStorage

```javascript
// Save
let user = { name: 'Alice', preferences: { theme: 'dark' } };
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
let savedUser = JSON.parse(localStorage.getItem('user'));
```

### 3. Sending Data to APIs

```javascript
let data = { username: 'alice', email: 'alice@example.com' };

fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### 4. Comparing Objects

```javascript
let obj1 = { a: 1, b: 2 };
let obj2 = { a: 1, b: 2 };

// Direct comparison fails
obj1 === obj2; // false

// Compare JSON strings
JSON.stringify(obj1) === JSON.stringify(obj2); // true
```

**⚠️ Caution**: Property order matters!

---

## Error Handling

### Circular References

```javascript
let obj = { name: 'Alice' };
obj.self = obj; // Circular reference

try {
  JSON.stringify(obj);
} catch (e) {
  console.error(e.message); // "Converting circular structure to JSON"
}
```

### Invalid JSON

```javascript
try {
  JSON.parse('{ invalid json }');
} catch (e) {
  console.error(e.message); // "Unexpected token i in JSON at position 2"
}
```

---

## Best Practices

✅ **Always use try-catch** when parsing untrusted JSON
✅ **Validate data** before serialization
✅ **Use revivers** to restore complex types (Dates, custom objects)
✅ **Use replacers** to filter sensitive data
✅ **Pretty-print** for debugging (use `space` parameter)
✅ **Be aware** of what cannot be serialized (functions, undefined, etc.)
✅ **Handle circular references** before serialization
✅ **Use `toJSON()`** for custom serialization logic

---

## Key Concepts Summary

📌 **JSON.stringify()** converts objects to JSON strings
📌 **JSON.parse()** converts JSON strings back to objects
📌 **JSON supports**: objects, arrays, strings, numbers, booleans, null
📌 **JSON does NOT support**: functions, undefined, Symbol, circular references
📌 **NaN/Infinity** become `null`
📌 **Date objects** serialize to ISO strings but don't auto-restore
📌 **Only enumerable own properties** are serialized
📌 **Replacer parameter** controls what gets serialized
📌 **Reviver parameter** transforms values during parsing
📌 **Space parameter** enables pretty-printing
📌 **toJSON() method** provides custom serialization
📌 **Circular references** throw errors
📌 Common uses: deep cloning, localStorage, API communication, object comparison
