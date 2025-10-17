# JavaScript Strings as Arrays

JavaScript strings can be treated as **read-only arrays** of UTF-16 Unicode characters, allowing array-like access and operations.

## Character Access

### Traditional Method: charAt()

```javascript
let s = 'test';
s.charAt(0); // "t"
s.charAt(1); // "e"
s.charAt(3); // "t"
```

### Array-Style Access (Preferred)

```javascript
let s = 'test';
s[0]; // "t"
s[1]; // "e"
s[3]; // "t"
```

**Benefits of bracket notation**:

- More concise and readable
- Potentially more efficient
- Consistent with array syntax

### Out-of-Bounds Access

```javascript
let s = 'hello';
s[5]; // undefined
s.charAt(5); // "" (empty string)
```

---

## Strings Are NOT Actually Arrays

Despite array-like behavior, strings are distinct:

```javascript
let s = 'test';

typeof s; // "string" (not "object")
Array.isArray(s); // false
s instanceof Array; // false
```

**Key difference**: Strings are **immutable primitives**, not objects.

---

## String Length

Like arrays, strings have a `length` property:

```javascript
let s = 'JavaScript';
s.length; // 10

// But you cannot modify length
s.length = 5; // No effect (fails silently)
console.log(s); // "JavaScript"
```

---

## Iterating Over Strings

### Using for Loop (Array-Style)

```javascript
let s = 'Hello';

for (let i = 0; i < s.length; i++) {
  console.log(s[i]);
}
// Output: H, e, l, l, o
```

### Using for...of Loop (ES6)

```javascript
let s = 'Hello';

for (let char of s) {
  console.log(char);
}
// Output: H, e, l, l, o
```

### Using forEach (with spread or Array.from)

```javascript
[...s].forEach((char) => console.log(char));
// Or
Array.from(s).forEach((char) => console.log(char));
```

---

## Applying Array Methods to Strings

You can use **generic array methods** on strings using `call()` or `apply()`.

### Array Methods That Work

#### join()

```javascript
Array.prototype.join.call('JavaScript', ' ');
// "J a v a S c r i p t"

// Cleaner with spread operator
[...'JavaScript'].join(' ');
// "J a v a S c r i p t"
```

#### filter()

```javascript
Array.prototype.filter.call('hello', (char) => char !== 'l').join('');
// "heo"

// Or with spread
[...'hello'].filter((char) => char !== 'l').join('');
// "heo"
```

#### map()

```javascript
Array.prototype.map.call('hello', (char) => char.toUpperCase()).join('');
// "HELLO"

// Or with spread
[...'hello'].map((char) => char.toUpperCase()).join('');
// "HELLO"
```

#### every() and some()

```javascript
// Check if all characters are lowercase
Array.prototype.every.call('hello', (char) => char === char.toLowerCase());
// true

// Check if any character is uppercase
Array.prototype.some.call('hello', (char) => char === char.toUpperCase());
// false
```

#### reduce()

```javascript
// Count vowels
Array.prototype.reduce.call(
  'javascript',
  (count, char) => {
    return 'aeiou'.includes(char) ? count + 1 : count;
  },
  0
);
// 3
```

---

## Strings Are Immutable (Read-Only Arrays)

**Critical limitation**: Strings are **immutable**, so mutating array methods **do not work**.

### Methods That DON'T Work

```javascript
let s = 'hello';

// These methods fail silently (no error, no effect)
Array.prototype.push.call(s, '!'); // No effect
Array.prototype.reverse.call(s); // No effect
Array.prototype.sort.call(s); // No effect
Array.prototype.splice.call(s, 0, 1); // No effect

console.log(s); // "hello" (unchanged)
```

### Why They Fail

- **push()**, **pop()**, **shift()**, **unshift()** - Add/remove elements
- **splice()** - Modifies array in place
- **reverse()** - Reverses array in place
- **sort()** - Sorts array in place

All require **mutation**, which strings don't support.

### Working Around Immutability

Convert to array, modify, then convert back:

```javascript
let s = 'hello';

// Reverse a string
let reversed = [...s].reverse().join('');
console.log(reversed); // "olleh"

// Sort characters
let sorted = [...s].sort().join('');
console.log(sorted); // "ehllo"

// Original string unchanged
console.log(s); // "hello"
```

---

## Converting Strings to Arrays

### Using Spread Operator (ES6)

```javascript
let s = 'hello';
let arr = [...s];
console.log(arr); // ["h", "e", "l", "l", "o"]
```

### Using Array.from()

```javascript
let s = 'hello';
let arr = Array.from(s);
console.log(arr); // ["h", "e", "l", "l", "o"]
```

### Using split()

```javascript
let s = 'hello';
let arr = s.split('');
console.log(arr); // ["h", "e", "l", "l", "o"]
```

---

## Practical Examples

### Example 1: Check if String is Palindrome

```javascript
function isPalindrome(str) {
  let reversed = [...str].reverse().join('');
  return str === reversed;
}

console.log(isPalindrome('racecar')); // true
console.log(isPalindrome('hello')); // false
```

### Example 2: Count Character Occurrences

```javascript
function countChar(str, char) {
  return [...str].filter((c) => c === char).length;
}

console.log(countChar('hello', 'l')); // 2
```

### Example 3: Capitalize Each Word

```javascript
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

console.log(capitalizeWords('hello world')); // "Hello World"
```

### Example 4: Remove Duplicates

```javascript
function removeDuplicates(str) {
  return [...new Set(str)].join('');
}

console.log(removeDuplicates('hello')); // "helo"
```

### Example 5: Find Most Common Character

```javascript
function mostCommon(str) {
  let counts = {};

  for (let char of str) {
    counts[char] = (counts[char] || 0) + 1;
  }

  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

console.log(mostCommon('javascript')); // "a"
```

---

## String vs Array Methods Comparison

| Operation        | String Method   | Array-Style Alternative       |
| ---------------- | --------------- | ----------------------------- |
| Access character | `s.charAt(i)`   | `s[i]`                        |
| Length           | `s.length`      | `s.length`                    |
| Iterate          | `for...of` loop | `for...of` loop               |
| Convert to array | `s.split('')`   | `[...s]` or `Array.from(s)`   |
| Join characters  | N/A             | `arr.join('')`                |
| Reverse          | N/A             | `[...s].reverse().join('')`   |
| Filter           | N/A             | `[...s].filter(...).join('')` |
| Map              | N/A             | `[...s].map(...).join('')`    |

---

## Unicode Considerations

JavaScript strings are sequences of **UTF-16 code units**:

```javascript
let emoji = '😀';
emoji.length; // 2 (not 1!)
emoji[0]; // "\uD83D" (high surrogate)
emoji[1]; // "\uDE00" (low surrogate)

// Use Array.from or spread for proper handling
[...emoji].length; // 1
Array.from(emoji); // ["😀"]
```

**For proper Unicode handling**, use:

- Spread operator (`...`)
- `Array.from()`
- `for...of` loops

---

## Key Concepts Summary

✅ **Strings behave like read-only arrays** of UTF-16 characters
✅ **Use bracket notation** (`s[i]`) instead of `charAt(i)` for cleaner code
✅ **`typeof` returns "string"**, not "object"
✅ **`Array.isArray()` returns false** for strings
✅ **Strings are immutable** - cannot be modified in place
✅ **Generic array methods** can be applied using `call()` or by converting to array
✅ **Mutating methods** (push, splice, reverse, sort) fail silently on strings
✅ **Convert to array first** to use mutating operations
✅ **Use spread or `Array.from()`** for proper Unicode character handling
✅ **Iteration works** with `for` loops, `for...of`, or array methods after conversion

---

## Best Practices

🔹 **Prefer `s[i]` over `s.charAt(i)`** for character access
🔹 **Use `[...s]` or `Array.from(s)`** to convert strings to arrays
🔹 **Remember strings are immutable** - operations return new strings
🔹 **Handle Unicode properly** with spread/Array.from for emojis and special characters
🔹 **Use native string methods** when available (e.g., `toUpperCase()`, `toLowerCase()`)
🔹 **Convert to array only when necessary** for array-specific operations
