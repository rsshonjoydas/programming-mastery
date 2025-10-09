# JavaScript Strings

## Core Characteristics

**String Definition:**

- Immutable ordered sequence of 16-bit values
- Each value typically represents a Unicode character
- Length = number of 16-bit values it contains
- Zero-based indexing (first character at position 0)
- Empty string has length 0
- No special type for single character (use length-1 string)

**UTF-16 Encoding:**

- JavaScript uses UTF-16 encoding of Unicode
- Most common characters fit in 16 bits (1 string element)
- Characters with codepoints > 16 bits use "surrogate pairs" (2 elements)
- Example: `"€".length` = 1, but `"❤".length` = 2
- Most string methods operate on 16-bit values, not characters
- ES6: strings are iterable; `for/of` loop iterates actual characters

---

## String Literals

**Three Ways to Delimit:**

1. Single quotes: `'text'`
2. Double quotes: `"text"`
3. Backticks: `` `text` `` (ES6+, allows interpolation)

**Examples:**

```javascript
''; // Empty string
'testing';
'3.14';
'name="myform"';
"Wouldn't you prefer O'Reilly's book?"`"She said 'hi'", he said.`;
```

**Multi-line Strings:**

- Pre-ES5: Use `+` operator to concatenate
- ES5+: End lines with `\` (backslash not included in string)
- ES6 backticks: Line terminators ARE part of string

```javascript
'two\nlines'; // 2 lines on 1 line
'one\
 long\
 line' // 1 line written on 3 lines
`the newline character
is included literally`; // 2 lines written on 2 lines
```

**Quotes in Strings:**

- Use `\` to escape apostrophes in single-quoted strings
- Mix quote styles when combining JavaScript & HTML
- Example: `<button onclick="alert('Thank you')">Click Me</button>`

---

## Escape Sequences

**Backslash `\` creates escape sequences:**

| Sequence | Character                          |
| -------- | ---------------------------------- |
| `\0`     | NUL character (`\u0000`)           |
| `\b`     | Backspace (`\u0008`)               |
| `\t`     | Horizontal tab (`\u0009`)          |
| `\n`     | Newline (`\u000A`)                 |
| `\v`     | Vertical tab (`\u000B`)            |
| `\f`     | Form feed (`\u000C`)               |
| `\r`     | Carriage return (`\u000D`)         |
| `\"`     | Double quote (`\u0022`)            |
| `\'`     | Single quote/apostrophe (`\u0027`) |
| `\\`     | Backslash (`\u005C`)               |
| `\xnn`   | Unicode char (2 hex digits)        |
| `\unnnn` | Unicode char (4 hex digits)        |
| `\u{n}`  | Unicode char (1-6 hex digits, ES6) |

**Examples:**

- `\xA9` = © (copyright)
- `\u03c0` = π (pi)
- `\u{1f600}` = 😀 (grinning face emoji)
- `\` before unknown char = ignored (just prints the char)

---

## Working with Strings

**Concatenation:**

```javascript
let msg = 'Hello, ' + 'world';
let greeting = 'Welcome,' + ' ' + name;
```

**Comparison:**

- Use `===` and `!==` for equality
- Use `<`, `<=`, `>`, `>=` for ordering
- Comparison done by 16-bit values
- For locale-aware comparison, see §11.7.3

**Length Property:**

```javascript
s.length; // Number of 16-bit values
```

---

## String Methods (Rich API)

**IMPORTANT: Strings are immutable - methods return NEW strings**

### Obtaining Portions

```javascript
s.substring(1, 4); // Characters 1-3
s.slice(1, 4); // Same as substring
s.slice(-3); // Last 3 characters
s.split(', '); // Split at delimiter → array
```

### Searching

```javascript
s.indexOf('l'); // Position of first "l"
s.indexOf('l', 3); // First "l" at/after position 3
s.indexOf('zz'); // -1 if not found
s.lastIndexOf('l'); // Position of last "l"

// ES6+ Boolean search functions
s.startsWith('Hell'); // true/false
s.endsWith('!'); // true/false
s.includes('or'); // true/false
```

### Modifying (Returns New String)

```javascript
s.replace('llo', 'ya'); // Replace first match
s.toLowerCase(); // All lowercase
s.toUpperCase(); // All uppercase
s.normalize(); // Unicode NFC normalization (ES6)
s.normalize('NFD'); // NFD normalization (also "NFKC", "NFKD")
```

### Inspecting Characters

```javascript
s.charAt(0); // First character
s.charAt(s.length - 1); // Last character
s.charCodeAt(0); // 16-bit number at position
s.codePointAt(0); // ES6, works for codepoints > 16 bits
```

### Padding (ES2017)

```javascript
'x'.padStart(3); // "  x" (spaces on left)
'x'.padEnd(3); // "x  " (spaces on right)
'x'.padStart(3, '*'); // "**x" (stars on left)
'x'.padEnd(3, '-'); // "x--" (dashes on right)
```

### Trimming (trim = ES5, others = ES2019)

```javascript
' test '.trim(); // "test" (both ends)
' test '.trimStart(); // "test " (left, also trimLeft)
' test '.trimEnd(); // " test" (right, also trimRight)
```

### Miscellaneous

```javascript
s.concat('!'); // Concatenate (use + instead)
'<>'.repeat(5); // "<><><><><>" (ES6)
```

### Array-like Access

```javascript
let s = 'hello, world';
s[0]; // "h" (read-only array access)
s[s.length - 1]; // "d"
```

---

## Template Literals (ES6+)

**Backtick syntax with expression interpolation:**

```javascript
let name = 'Bill';
let greeting = `Hello ${name}.`; // "Hello Bill."
```

**Features:**

- Any JavaScript expression inside `${ }`
- Can use all escape characters
- Can span multiple lines (newlines included)
- No limit on number of expressions

**Example:**

```javascript
let errorMessage = `\
\u2718 Test failure at ${filename}:${linenumber}:
${exception.message}
Stack trace:
${exception.stack}
`;
```

- Backslash at line end escapes initial newline
- Starts with ✘ character instead of newline

### Tagged Template Literals

**Function tag before backtick:**

- Text and expression values passed to function
- Return value = value of tagged template literal
- Used for HTML/SQL escaping, etc.
- No parentheses needed in invocation

**Built-in Tag - String.raw():**

```javascript
`\n`.length; // 1 (newline character)
String.raw`\n`.length; // 2 (backslash + "n")
```

**Custom tags:**

- Powerful feature for defining new literal syntax
- Don't need to return strings
- Can be used like constructors

---

## Pattern Matching (Regular Expressions)

**RegExp Basics:**

- Not fundamental datatype but has literal syntax
- Text between slashes = regex literal
- Letters after second slash = modifiers

**Examples:**

```javascript
/^HTML/; // Match "HTML" at string start
/[1-9][0-9]*/; // Nonzero digit + any # of digits
/\bjavascript\b/i; // "javascript" as word, case-insensitive
```

**RegExp Methods:**

```javascript
let text = 'testing: 1, 2, 3';
let pattern = /\d+/g; // All instances of 1+ digits

pattern.test(text); // true (contains pattern?)
text.search(pattern); // 9 (position of first match)
text.match(pattern); // ["1", "2", "3"] (array of matches)
text.replace(pattern, '#'); // "testing: #, #, #"
text.split(/\D+/); // ["", "1", "2", "3"] (split on non-digits)
```

---

## Key Takeaways

1. **Strings are immutable** - methods return new strings
2. **UTF-16 encoding** - some characters use 2 elements (surrogate pairs)
3. **Three literal syntaxes** - single/double quotes, backticks
4. **Template literals** - powerful interpolation with backticks
5. **Rich API** - extensive methods for manipulation, search, transform
6. **RegExp integration** - powerful pattern matching built-in
7. **Array-like access** - read-only bracket notation works
8. **Zero-based indexing** - first character at position 0
