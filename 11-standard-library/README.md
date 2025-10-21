# JavaScript Standard Library

The JavaScript Standard Library consists of built-in classes and functions available in all JavaScript environments (browsers and Node.js). These are less fundamental than core types like numbers, strings, objects, and arrays, but are essential for real-world programming.

---

## 1. Set and Map

### Set

A **Set** is a collection of unique values (no duplicates).

```javascript
// Creating Sets
let set = new Set();
let set2 = new Set([1, 2, 3, 3, 4]); // [1, 2, 3, 4] - duplicates removed

// Adding values
set.add(1);
set.add(2);
set.add(2); // Ignored (duplicate)

// Checking and deleting
set.has(1); // true
set.delete(1); // true (removed)
set.has(1); // false

// Size and clearing
console.log(set.size); // 1
set.clear(); // Remove all elements

// Iterating
for (let value of set2) {
  console.log(value);
}

// Converting to array
let array = [...set2]; // or Array.from(set2)
```

**Common operations**:

- `add(value)` - Add a value
- `delete(value)` - Remove a value
- `has(value)` - Check if value exists
- `clear()` - Remove all values
- `size` - Number of values

### Map

A **Map** is a collection of key-value pairs where keys can be any type (not just strings).

```javascript
// Creating Maps
let map = new Map();
let map2 = new Map([
  ['name', 'Alice'],
  ['age', 30],
]);

// Setting and getting
map.set('key', 'value');
map.set(123, 'numeric key');
map.set({ id: 1 }, 'object key');

console.log(map.get('key')); // 'value'
console.log(map.get(123)); // 'numeric key'

// Checking and deleting
map.has('key'); // true
map.delete('key'); // true
map.size; // 2

// Iterating
for (let [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Get keys, values, or entries
map.keys(); // Iterator of keys
map.values(); // Iterator of values
map.entries(); // Iterator of [key, value] pairs
```

**Map vs Object**:

- Maps can use any type as keys (objects use strings/Symbols only)
- Maps maintain insertion order
- Maps have a `size` property
- Maps are optimized for frequent additions/deletions

---

## 2. TypedArrays

**TypedArrays** represent arrays of binary data with specific numeric types.

### Types of TypedArrays

```javascript
Int8Array; // 8-bit signed integers
Uint8Array; // 8-bit unsigned integers
Uint8ClampedArray; // 8-bit unsigned (clamped to 0-255)
Int16Array; // 16-bit signed integers
Uint16Array; // 16-bit unsigned integers
Int32Array; // 32-bit signed integers
Uint32Array; // 32-bit unsigned integers
Float32Array; // 32-bit floating point
Float64Array; // 64-bit floating point
BigInt64Array; // 64-bit signed BigInt
BigUint64Array; // 64-bit unsigned BigInt
```

### Creating TypedArrays

```javascript
// Create with length
let bytes = new Uint8Array(10); // 10 bytes, all 0

// Create from array
let ints = new Int16Array([1, 2, 3, 4]);

// Create from ArrayBuffer
let buffer = new ArrayBuffer(16); // 16 bytes
let int32View = new Int32Array(buffer); // 4 elements (4 bytes each)

// Setting and getting values
ints[0] = 100;
console.log(ints[0]); // 100

// Array-like methods
ints.length; // 4
ints.slice(1, 3); // New TypedArray [2, 3]
ints.map((x) => x * 2); // New TypedArray [2, 4, 6, 8]
```

**Use cases**: Binary data, WebGL, audio processing, file I/O, network protocols

---

## 3. Regular Expressions (RegExp)

**Regular expressions** define textual patterns for searching and manipulating strings.

### Creating RegExp

```javascript
// Literal notation
let pattern1 = /test/;
let pattern2 = /test/i; // Case-insensitive flag

// Constructor
let pattern3 = new RegExp('test');
let pattern4 = new RegExp('test', 'i');
```

### Common Flags

- `i` - Case-insensitive
- `g` - Global (find all matches)
- `m` - Multiline (^ and $ match line boundaries)
- `s` - Dot matches newlines
- `u` - Unicode
- `y` - Sticky (matches from lastIndex)

### Pattern Syntax

```javascript
// Literal characters
/hello/          // Matches "hello"

// Character classes
/[abc]/          // Matches a, b, or c
/[^abc]/         // Matches anything except a, b, c
/[0-9]/          // Matches any digit
/[a-z]/          // Matches lowercase letters

// Predefined classes
/\d/             // Digit [0-9]
/\D/             // Non-digit
/\w/             // Word character [a-zA-Z0-9_]
/\W/             // Non-word character
/\s/             // Whitespace
/\S/             // Non-whitespace
/./              // Any character (except newline)

// Quantifiers
/a*/             // 0 or more a's
/a+/             // 1 or more a's
/a?/             // 0 or 1 a
/a{3}/           // Exactly 3 a's
/a{2,4}/         // 2 to 4 a's
/a{2,}/          // 2 or more a's

// Anchors
/^hello/         // Start of string
/world$/         // End of string
/\bword\b/       // Word boundary

// Grouping and capturing
/(abc)/          // Capturing group
/(?:abc)/        // Non-capturing group
/(a|b|c)/        // Alternation (or)

// Lookahead/Lookbehind
/x(?=y)/         // x followed by y (positive lookahead)
/x(?!y)/         // x not followed by y (negative lookahead)
```

### Using RegExp

```javascript
let text = 'Hello World 123';
let pattern = /\d+/g;

// Test if pattern exists
pattern.test(text); // true

// Find first match
text.match(/\d+/); // ["123"]

// Find all matches
text.match(/\w+/g); // ["Hello", "World", "123"]

// Replace
text.replace(/\d+/, 'XXX'); // "Hello World XXX"
text.replace(/\w+/g, (x) => x.toUpperCase()); // "HELLO WORLD 123"

// Split
text.split(/\s+/); // ["Hello", "World", "123"]

// Search (returns index)
text.search(/\d/); // 12

// exec (detailed match info)
let match = /(\w+)\s(\d+)/.exec('World 123');
// match[0]: "World 123" (full match)
// match[1]: "World" (first group)
// match[2]: "123" (second group)
```

---

## 4. Date

The **Date** class represents dates and times.

```javascript
// Creating dates
let now = new Date(); // Current date/time
let specific = new Date('2025-10-20'); // Specific date
let timestamp = new Date(1729382400000); // From milliseconds since epoch
let parts = new Date(2025, 9, 20, 14, 30); // Year, month(0-11), day, hour, min

// Getting components
now.getFullYear(); // 2025
now.getMonth(); // 0-11 (0 = January)
now.getDate(); // 1-31
now.getDay(); // 0-6 (0 = Sunday)
now.getHours(); // 0-23
now.getMinutes(); // 0-59
now.getSeconds(); // 0-59
now.getMilliseconds(); // 0-999
now.getTime(); // Milliseconds since Jan 1, 1970

// Setting components
now.setFullYear(2026);
now.setMonth(11); // December
now.setDate(25);

// UTC methods
now.getUTCHours();
now.setUTCHours(12);

// Formatting
now.toString(); // Full string representation
now.toISOString(); // ISO 8601 format
now.toDateString(); // Date part only
now.toTimeString(); // Time part only
now.toLocaleString(); // Localized format

// Static methods
Date.now(); // Current timestamp
Date.parse('2025-10-20'); // Parse date string
```

---

## 5. Error

The **Error** class and its subclasses represent runtime errors.

### Built-in Error Types

```javascript
Error; // Generic error
EvalError; // Error in eval()
RangeError; // Number out of range
ReferenceError; // Invalid reference
SyntaxError; // Syntax error
TypeError; // Wrong type
URIError; // URI encoding/decoding error
```

### Creating and Throwing Errors

```javascript
// Create error
let error = new Error('Something went wrong');
let typeError = new TypeError('Expected a string');

// Error properties
error.name; // "Error"
error.message; // "Something went wrong"
error.stack; // Stack trace

// Throwing errors
throw new Error('Custom error message');

// Try-catch
try {
  throw new TypeError('Wrong type provided');
} catch (e) {
  console.error(e.name); // "TypeError"
  console.error(e.message); // "Wrong type provided"
} finally {
  console.log('Cleanup code');
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

throw new ValidationError('Invalid input');
```

---

## 6. JSON

The **JSON** object serializes and deserializes JavaScript data structures.

```javascript
// JavaScript object
let obj = {
  name: 'Alice',
  age: 30,
  active: true,
  hobbies: ['reading', 'coding'],
};

// Serialize (object to string)
let json = JSON.stringify(obj);
// '{"name":"Alice","age":30,"active":true,"hobbies":["reading","coding"]}'

// Deserialize (string to object)
let parsed = JSON.parse(json);
console.log(parsed.name); // "Alice"

// Pretty printing
let pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "Alice",
  "age": 30,
  "active": true,
  "hobbies": [
    "reading",
    "coding"
  ]
}
*/

// Custom serialization
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
});

// Custom deserialization
JSON.parse(json, (key, value) => {
  if (key === 'age') {
    return value + 1;
  }
  return value;
});
```

**Supported types**: Objects, arrays, strings, numbers, booleans, `null`
**Not supported**: Functions, `undefined`, Symbols, Dates (converted to strings)

---

## 7. Intl (Internationalization)

The **Intl** object provides internationalization support.

### DateTimeFormat

```javascript
let date = new Date();

// Format dates
let formatter = new Intl.DateTimeFormat('en-US');
formatter.format(date); // "10/20/2025"

let formatter2 = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
formatter2.format(date); // "20. Oktober 2025"
```

### NumberFormat

```javascript
let num = 1234567.89;

// Format numbers
let formatter = new Intl.NumberFormat('en-US');
formatter.format(num); // "1,234,567.89"

// Currency
let currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
currency.format(num); // "$1,234,567.89"

// Percent
let percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
});
percent.format(0.85); // "85%"
```

### Collator (String Comparison)

```javascript
let collator = new Intl.Collator('de-DE');
collator.compare('ä', 'z'); // -1 (ä comes before z in German)

// Sorting with locale
let names = ['Ärger', 'Apfel', 'Zwiebel'];
names.sort(new Intl.Collator('de-DE').compare);
```

---

## 8. Console

The **Console** object provides methods for debugging and logging.

```javascript
// Basic logging
console.log('Hello');
console.info('Information');
console.warn('Warning!');
console.error('Error!');

// Multiple arguments
console.log('Name:', 'Alice', 'Age:', 30);

// Formatted strings
console.log('User %s is %d years old', 'Alice', 30);

// Objects
let obj = { name: 'Alice', age: 30 };
console.log(obj); // Expandable object view
console.dir(obj); // Object properties
console.table([obj]); // Table format

// Groups
console.group('User Details');
console.log('Name: Alice');
console.log('Age: 30');
console.groupEnd();

// Timing
console.time('operation');
// ... some code ...
console.timeEnd('operation'); // Logs elapsed time

// Assertions
console.assert(1 === 1, "This won't log");
console.assert(1 === 2, 'This will log an error');

// Clear console
console.clear();

// Stack trace
console.trace('Trace point');

// Count occurrences
console.count('click'); // click: 1
console.count('click'); // click: 2
console.countReset('click');
```

---

## 9. URL

The **URL** class parses and manipulates URLs.

```javascript
// Create URL
let url = new URL('https://example.com:8080/path?name=Alice&age=30#section');

// Properties
url.protocol; // "https:"
url.hostname; // "example.com"
url.port; // "8080"
url.pathname; // "/path"
url.search; // "?name=Alice&age=30"
url.hash; // "#section"
url.href; // Full URL string

// Search params
url.searchParams.get('name'); // "Alice"
url.searchParams.get('age'); // "30"
url.searchParams.has('name'); // true
url.searchParams.set('age', '31');
url.searchParams.append('hobby', 'reading');
url.searchParams.delete('name');

// Iterate search params
for (let [key, value] of url.searchParams) {
  console.log(`${key}: ${value}`);
}

// Modify URL
url.pathname = '/new-path';
url.hash = '#new-section';

// Relative URLs
let relative = new URL('/path', 'https://example.com');
// https://example.com/path
```

### Encoding Functions

```javascript
// Encode/decode URI components
let text = 'Hello World!';
let encoded = encodeURIComponent(text); // "Hello%20World!"
let decoded = decodeURIComponent(encoded); // "Hello World!"

// Encode/decode full URI
let uri = 'https://example.com/path?q=Hello World';
encodeURI(uri); // "https://example.com/path?q=Hello%20World"
decodeURI(encodeURI(uri)); // Original URI
```

---

## 10. Timers

Functions for scheduling code execution.

### setTimeout

Execute code once after a delay:

```javascript
// Basic usage
let timerId = setTimeout(() => {
  console.log('Executed after 2 seconds');
}, 2000);

// With arguments
setTimeout(
  (name, age) => {
    console.log(`${name} is ${age}`);
  },
  1000,
  'Alice',
  30
);

// Cancel timeout
clearTimeout(timerId);
```

### setInterval

Execute code repeatedly at intervals:

```javascript
// Basic usage
let intervalId = setInterval(() => {
  console.log('Executed every second');
}, 1000);

// Cancel interval
clearInterval(intervalId);

// Self-canceling interval
let count = 0;
let id = setInterval(() => {
  count++;
  console.log(count);
  if (count >= 5) {
    clearInterval(id);
  }
}, 1000);
```

### setImmediate (Node.js only)

Execute code after I/O events:

```javascript
setImmediate(() => {
  console.log('Executed immediately after I/O');
});
```

---

## Summary

| API            | Purpose                                          |
| -------------- | ------------------------------------------------ |
| **Set/Map**    | Collections of unique values and key-value pairs |
| **TypedArray** | Binary data arrays with specific numeric types   |
| **RegExp**     | Pattern matching and text processing             |
| **Date**       | Date and time manipulation                       |
| **Error**      | Error handling and custom exceptions             |
| **JSON**       | Serialization/deserialization                    |
| **Intl**       | Internationalization (dates, numbers, strings)   |
| **Console**    | Debugging and logging                            |
| **URL**        | URL parsing and manipulation                     |
| **Timers**     | Scheduled code execution                         |

These APIs form the foundation of JavaScript's standard library and are essential for real-world application development!
