# JavaScript Enumerating Properties

## Overview

Enumerating properties means **iterating through or obtaining a list of all properties** of an object. JavaScript provides multiple methods for property enumeration, each with different behaviors regarding:

- Own vs inherited properties
- Enumerable vs non-enumerable properties
- String vs Symbol property names

---

## 1. for/in Loop

The `for/in` loop iterates over **all enumerable properties** (both own and inherited).

### Basic Syntax

```javascript
let o = { x: 1, y: 2, z: 3 };

for (let p in o) {
  console.log(p); // Prints: x, y, z
}
```

### Characteristics

- Iterates through **enumerable properties only**
- Includes **inherited properties**
- Excludes built-in methods (like `toString`)
- Assigns property **name** (not value) to the loop variable

### Checking Enumerability

```javascript
o.propertyIsEnumerable('toString'); // false (not enumerable)
o.propertyIsEnumerable('x'); // true (enumerable own property)
```

---

## 2. Filtering Properties in for/in

### Skip Inherited Properties

```javascript
for (let p in o) {
  if (!o.hasOwnProperty(p)) continue; // Only process own properties
  console.log(p);
}
```

### Skip Methods

```javascript
for (let p in o) {
  if (typeof o[p] === 'function') continue; // Skip all methods
  console.log(p);
}
```

### Combined Filtering

```javascript
for (let p in o) {
  if (!o.hasOwnProperty(p)) continue; // Skip inherited
  if (typeof o[p] === 'function') continue; // Skip methods
  console.log(p + ': ' + o[p]);
}
```

---

## 3. Property Enumeration Functions

Modern JavaScript provides four functions that return arrays of property names.

### Object.keys()

Returns an array of **enumerable own string properties**.

```javascript
let obj = { a: 1, b: 2, c: 3 };
Object.keys(obj); // ['a', 'b', 'c']
```

**Excludes**:

- Non-enumerable properties
- Inherited properties
- Symbol properties

**Use with for/of**:

```javascript
for (let key of Object.keys(obj)) {
  console.log(key + ': ' + obj[key]);
}
```

### Object.getOwnPropertyNames()

Returns an array of **all own string properties** (enumerable and non-enumerable).

```javascript
let obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });

Object.keys(obj); // ['a']
Object.getOwnPropertyNames(obj); // ['a', 'b']
```

**Includes**:

- Enumerable properties
- Non-enumerable properties

**Excludes**:

- Inherited properties
- Symbol properties

### Object.getOwnPropertySymbols()

Returns an array of **own Symbol properties** (enumerable and non-enumerable).

```javascript
let sym1 = Symbol('first');
let sym2 = Symbol('second');
let obj = { a: 1, [sym1]: 'symbol1', [sym2]: 'symbol2' };

Object.keys(obj); // ['a']
Object.getOwnPropertySymbols(obj); // [Symbol(first), Symbol(second)]
```

**Includes**:

- All Symbol properties (enumerable and non-enumerable)

**Excludes**:

- String properties
- Inherited properties

### Reflect.ownKeys()

Returns an array of **all own properties** (strings and Symbols, enumerable and non-enumerable).

```javascript
let sym = Symbol('test');
let obj = { a: 1, [sym]: 'symbol' };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });

Reflect.ownKeys(obj); // ['a', 'b', Symbol(test)]
```

**Includes**:

- All own properties regardless of type or enumerability

**Excludes**:

- Inherited properties only

---

## 4. Comparison of Enumeration Methods

| Method                             | Enumerable | Non-Enumerable | Own | Inherited | String | Symbol |
| ---------------------------------- | ---------- | -------------- | --- | --------- | ------ | ------ |
| **for/in**                         | ✅         | ❌             | ✅  | ✅        | ✅     | ❌     |
| **Object.keys()**                  | ✅         | ❌             | ✅  | ❌        | ✅     | ❌     |
| **Object.getOwnPropertyNames()**   | ✅         | ✅             | ✅  | ❌        | ✅     | ❌     |
| **Object.getOwnPropertySymbols()** | ✅         | ✅             | ✅  | ❌        | ❌     | ✅     |
| **Reflect.ownKeys()**              | ✅         | ✅             | ✅  | ❌        | ✅     | ✅     |

---

## 5. Property Enumeration Order (ES6+)

ES6 formally defines the order in which properties are enumerated.

### Enumeration Order Rules

Properties are listed in this order:

1. **Array-like indices** (non-negative integer strings): In numeric order from smallest to largest

   ```javascript
   let obj = { 2: 'b', 1: 'a', 0: 'c' };
   Object.keys(obj); // ['0', '1', '2']
   ```

2. **Other string properties**: In the order they were added to the object

   ```javascript
   let obj = { z: 3, a: 1, m: 2 };
   Object.keys(obj); // ['z', 'a', 'm']
   ```

3. **Symbol properties**: In the order they were added

   ```javascript
   let s1 = Symbol('first');
   let s2 = Symbol('second');
   let obj = { [s2]: 2, [s1]: 1 };
   Object.getOwnPropertySymbols(obj); // [Symbol(second), Symbol(first)]
   ```

### Methods Following This Order

- `Object.keys()`
- `Object.getOwnPropertyNames()`
- `Object.getOwnPropertySymbols()`
- `Reflect.ownKeys()`
- `JSON.stringify()`

---

## 6. for/in Loop Order

The `for/in` loop enumeration order is **less strictly specified** but implementations typically:

1. Enumerate **own properties** in the order described above
2. Travel up the **prototype chain**
3. Enumerate properties from each prototype in the same order

**Important**: A property is **not enumerated** if:

- A property with the same name was already enumerated
- A non-enumerable property with the same name already exists

---

## 7. Getting Property Values

### Object.values()

Returns an array of **enumerable own property values**.

```javascript
let obj = { a: 1, b: 2, c: 3 };
Object.values(obj); // [1, 2, 3]
```

### Object.entries()

Returns an array of **[key, value] pairs** for enumerable own properties.

```javascript
let obj = { a: 1, b: 2, c: 3 };
Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]

// Useful for iteration
for (let [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

---

## 8. Practical Examples

### Example 1: Copying Own Properties

```javascript
function copyOwnProperties(source, target) {
  for (let key of Object.keys(source)) {
    target[key] = source[key];
  }
  return target;
}
```

### Example 2: Counting Properties

```javascript
function countProperties(obj, includeInherited = false) {
  if (includeInherited) {
    let count = 0;
    for (let p in obj) count++;
    return count;
  } else {
    return Object.keys(obj).length;
  }
}
```

### Example 3: Converting Object to Map

```javascript
function objectToMap(obj) {
  let map = new Map();
  for (let [key, value] of Object.entries(obj)) {
    map.set(key, value);
  }
  return map;
}
```

### Example 4: Filtering Object Properties

```javascript
function filterObject(obj, predicate) {
  let result = {};
  for (let [key, value] of Object.entries(obj)) {
    if (predicate(key, value)) {
      result[key] = value;
    }
  }
  return result;
}

// Usage
let obj = { a: 1, b: 2, c: 3, d: 4 };
let evens = filterObject(obj, (k, v) => v % 2 === 0);
// evens = { b: 2, d: 4 }
```

---

## 9. Common Patterns

### Pattern 1: Safe Property Iteration (Own Properties Only)

```javascript
// Using Object.keys() - most common
for (let key of Object.keys(obj)) {
  console.log(key, obj[key]);
}

// Using for/in with hasOwnProperty
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
```

### Pattern 2: Deep Property Enumeration

```javascript
function getAllProperties(obj) {
  let props = [];

  for (let key in obj) {
    // Includes inherited
    props.push(key);
  }

  return props;
}
```

### Pattern 3: Enumerating All Properties (Including Non-Enumerable)

```javascript
function getAllOwnProperties(obj) {
  return [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
}
```

---

## Best Practices

✅ **Use Object.keys()** for most common cases (own enumerable properties)
✅ **Use for/of with Object.keys()** instead of for/in when possible
✅ **Use Object.entries()** when you need both keys and values
✅ **Use hasOwnProperty()** in for/in loops to filter inherited properties
✅ **Use Reflect.ownKeys()** when you need all properties including Symbols
✅ **Remember enumeration order**: integers first, then strings, then Symbols
✅ **Be aware of inherited properties** when using for/in

---

## Key Concepts Summary

📌 **for/in** iterates over enumerable properties (own + inherited)
📌 **Object.keys()** returns enumerable own string properties
📌 **Object.getOwnPropertyNames()** returns all own string properties
📌 **Object.getOwnPropertySymbols()** returns own Symbol properties
📌 **Reflect.ownKeys()** returns all own properties (strings + Symbols)
📌 **Enumeration order**: array indices → strings (insertion order) → Symbols
📌 **Object.values()** returns enumerable own property values
📌 **Object.entries()** returns [key, value] pairs
📌 Built-in methods are **not enumerable** by default
📌 Custom properties are **enumerable** by default
