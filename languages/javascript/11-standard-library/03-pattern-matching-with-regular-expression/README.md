# JavaScript Pattern Matching with Regular Expressions

Regular expressions (RegExp) are objects that describe textual patterns, enabling powerful pattern-matching and search-and-replace operations on text.

---

## 1. Defining Regular Expressions

### Regular Expression Literals

The most common way to create a RegExp:

```javascript
let pattern = /s$/; // Matches strings ending with 's'
```

### RegExp Constructor

Alternative creation method:

```javascript
let pattern = new RegExp('s$');
```

**When to use constructor:**

- Pattern is created dynamically at runtime
- Pattern comes from user input or external source
- Need to double-escape backslashes: `\\d` becomes `\\\\d`

---

## 2. Literal Characters

### Basic Matching

Alphanumeric characters match themselves literally:

```javascript
/java/      // Matches "java"
/123/       // Matches "123"
```

### Escape Sequences

Special characters that need escaping:

| Character | Matches                           | Example          |
| --------- | --------------------------------- | ---------------- |
| `\0`      | NUL character                     | `\u0000`         |
| `\t`      | Tab                               | `\u0009`         |
| `\n`      | Newline                           | `\u000A`         |
| `\v`      | Vertical tab                      | `\u000B`         |
| `\f`      | Form feed                         | `\u000C`         |
| `\r`      | Carriage return                   | `\u000D`         |
| `\xnn`    | Latin character (hex)             | `\x0A` = `\n`    |
| `\uxxxx`  | Unicode character (4 hex digits)  | `\u0009` = `\t`  |
| `\u{n}`   | Unicode codepoint (with `u` flag) | `\u{1F600}` = 😀 |
| `\cX`     | Control character                 | `\cJ` = `\n`     |

### Meta-Characters (Need Escaping)

These have special meaning: `^ $ . * + ? = ! : | \ / ( ) [ ] { }`

```javascript
/\./        // Matches literal period
/\*/        // Matches literal asterisk
/\\/        // Matches literal backslash
```

---

## 3. Character Classes

Match any one character from a set.

### Basic Character Classes

```javascript
/[abc]/         // Matches 'a', 'b', or 'c'
/[^abc]/        // Matches any character EXCEPT 'a', 'b', 'c'
/[a-z]/         // Matches any lowercase letter
/[a-zA-Z0-9]/   // Matches any letter or digit
/[a-z-]/        // Hyphen at end is literal
```

### Predefined Character Classes

| Class  | Matches                      | Equivalent                |
| ------ | ---------------------------- | ------------------------- |
| `.`    | Any character except newline | (or any with `s` flag)    |
| `\w`   | ASCII word character         | `[a-zA-Z0-9_]`            |
| `\W`   | Non-word character           | `[^a-zA-Z0-9_]`           |
| `\d`   | ASCII digit                  | `[0-9]`                   |
| `\D`   | Non-digit                    | `[^0-9]`                  |
| `\s`   | Unicode whitespace           | Space, tab, newline, etc. |
| `\S`   | Non-whitespace               | Any non-whitespace        |
| `[\b]` | Backspace                    | Special case              |

### Combining Classes

```javascript
/[\s\d]/        // Matches whitespace OR digit
/[a-z\d]/       // Matches lowercase letter OR digit
```

### Unicode Character Classes (ES2018, requires `u` flag)

```javascript
/\p{Decimal_Number}/u           // Any decimal digit
/\p{Alphabetic}/u               // Any alphabetic character
/\p{Script=Greek}/u             // Greek letters
/\p{Script=Cyrillic}/u          // Cyrillic letters
/\P{Number}/u                   // NOT a number (negated)
```

---

## 4. Repetition

Specify how many times a pattern should repeat.

### Repetition Quantifiers

| Quantifier | Meaning                | Example                           |
| ---------- | ---------------------- | --------------------------------- |
| `{n,m}`    | Between n and m times  | `/\d{2,4}/` = 2-4 digits          |
| `{n,}`     | n or more times        | `/\d{3,}/` = 3+ digits            |
| `{n}`      | Exactly n times        | `/\d{4}/` = exactly 4 digits      |
| `?`        | 0 or 1 time (optional) | `/colou?r/` = color or colour     |
| `+`        | 1 or more times        | `/\d+/` = one or more digits      |
| `*`        | 0 or more times        | `/\w*/` = zero or more word chars |

### Examples

```javascript
/\d{2,4}/       // Match 2-4 digits
/\w{3}\d?/      // 3 word chars + optional digit
/\s+java\s+/    // "java" with surrounding spaces
/[^(]*/         // Zero or more non-parenthesis chars
```

### Greedy vs Non-Greedy

**Greedy (default)**: Matches as much as possible

```javascript
/a+/.exec('aaa'); // Matches "aaa"
```

**Non-greedy**: Add `?` after quantifier to match as little as possible

```javascript
/a+?/.exec("aaa")       // Matches "a"
/a+?b/.exec("aaab")     // Matches "aaab" (still finds first match)
```

**Non-greedy quantifiers:**

- `??` - zero or one, non-greedy
- `+?` - one or more, non-greedy
- `*?` - zero or more, non-greedy
- `{n,m}?` - range, non-greedy

---

## 5. Alternation, Grouping, and References

### Alternation (|)

Matches alternatives (evaluated left-to-right):

```javascript
/ab|cd|ef/              // Matches "ab" OR "cd" OR "ef"
/\d{3}|[a-z]{4}/        // 3 digits OR 4 lowercase letters
```

**Important**: Left alternative takes precedence

```javascript
/a|ab/.exec('ab'); // Matches only "a"
```

### Grouping with Parentheses

**Purpose 1**: Group items as a unit

```javascript
/java(script)?/         // "java" + optional "script"
/(ab|cd)+|ef/           // "ef" OR one or more "ab" or "cd"
```

**Purpose 2**: Capture subpatterns for later use

```javascript
/[a-z]+(\d+)/; // Captures the digits
```

### Backreferences

Reference previously captured groups:

```javascript
/(['"])[^'"]*\1/; // Match quotes (opening = closing)
// \1 refers to whatever group 1 matched
```

**Numbering**: Based on position of left parenthesis

```javascript
/([Jj]ava([Ss]cript)?)\sis\s(fun\w*)/;
// \1 = first group
// \2 = nested [Ss]cript group
// \3 = fun\w* group
```

### Non-Capturing Groups

Use `(?:...)` to group without creating a reference:

```javascript
/([Jj]ava(?:[Ss]cript)?)\sis\s(fun\w*)/;
// Now \2 refers to (fun\w*), not the ?: group
```

### Named Capture Groups (ES2018)

Use `(?<name>...)` to name groups:

```javascript
/(?<city>\w+) (?<state>[A-Z]{2}) (?<zipcode>\d{5})/

// Backreference by name
/(?<quote>['"])[^'"]*\k<quote>/
```

---

## 6. Anchors and Assertions

Match positions, not characters.

### Position Anchors

| Anchor | Matches                                 |
| ------ | --------------------------------------- |
| `^`    | Start of string (or line with `m` flag) |
| `$`    | End of string (or line with `m` flag)   |
| `\b`   | Word boundary                           |
| `\B`   | Non-word boundary                       |

```javascript
/^JavaScript$/          // Entire string is "JavaScript"
/\bJava\b/              // "Java" as complete word
/\B[Ss]cript/           // "script" not at word boundary
```

### Lookahead Assertions

**Positive lookahead** `(?=...)`: Match if followed by pattern

```javascript
/[Jj]ava([Ss]cript)?(?=\:)/; // "JavaScript" only if followed by ":"
```

**Negative lookahead** `(?!...)`: Match if NOT followed by pattern

```javascript
/Java(?!Script)([A-Z]\w*)/; // "Java..." but not "JavaScript"
```

### Lookbehind Assertions (ES2018)

**Positive lookbehind** `(?<=...)`: Match if preceded by pattern

```javascript
/(?<= [A-Z]{2} )\d{5}/; // 5 digits after 2-letter state code
```

**Negative lookbehind** `(?<!...)`: Match if NOT preceded by pattern

```javascript
/(?<![\p{Currency_Symbol}\d.])\d+(\.\d+)?/u;
```

---

## 7. Flags

Modify how regular expressions work.

### Available Flags

| Flag | Name        | Behavior                           |
| ---- | ----------- | ---------------------------------- |
| `g`  | Global      | Find all matches, not just first   |
| `i`  | Ignore case | Case-insensitive matching          |
| `m`  | Multiline   | `^` and `$` match line starts/ends |
| `s`  | Dot-all     | `.` matches newlines (ES2018)      |
| `u`  | Unicode     | Full Unicode support (ES6)         |
| `y`  | Sticky      | Match at exact position            |

### Usage

```javascript
/s$/i               // Case-insensitive
/\d+/g              // Global matching
/pattern/giu        // Multiple flags
new RegExp("s$", "i")  // With constructor
```

### Flag Details

**`g` (global)**:

```javascript
'a1 b2 c3'.match(/\d+/g); // ["1", "2", "3"]
```

**`i` (ignore case)**:

```javascript
/javascript/i.test('JavaScript'); // true
```

**`m` (multiline)**:

```javascript
/^line/m.test('first\nline'); // true
```

**`s` (dot-all)**:

```javascript
/.+/.test("line1\nline2")        // false (without s)
/.+/s.test("line1\nline2")       // true (with s)
```

**`u` (unicode)**:

```javascript
/\u{1F600}/u.test("😀")          // true
/./u.test("😀")                   // true (counts as 1 char)
/./test("😀")                     // false (without u)
```

**`y` (sticky)**:

```javascript
let re = /\d+/y;
re.lastIndex = 2;
'01234'.match(re); // Matches at position 2
```

---

## 8. String Methods for Pattern Matching

### search()

Returns index of first match, or -1:

```javascript
'JavaScript'.search(/script/i); // 4
'Python'.search(/script/i); // -1
```

### replace()

Replaces matches with replacement string or function result:

**Basic replacement:**

```javascript
text.replace(/javascript/gi, 'JavaScript');
```

**Using captured groups:**

```javascript
let quote = /"([^"]*)"/g;
'He said "stop"'.replace(quote, '«$1»'); // 'He said «stop»'
```

**Named groups:**

```javascript
let quote = /"(?<quotedText>[^"]*)"/g;
'He said "stop"'.replace(quote, '«$<quotedText>»');
```

**Replacement function:**

```javascript
'15 times 15 is 225'.replace(/\d+/g, (n) => parseInt(n).toString(16));
// "f times f is e1"
```

### match()

Returns array of matches or null:

**With `g` flag** (global):

```javascript
'7 plus 8 equals 15'.match(/\d+/g); // ["7", "8", "15"]
```

**Without `g` flag**:

```javascript
let url = /(\w+):\/\/([\w.]+)\/(\S*)/;
let text = 'Visit http://www.example.com/~david';
let match = text.match(url);

match[0]; // Full match: "http://www.example.com/~david"
match[1]; // Group 1: "http"
match[2]; // Group 2: "www.example.com"
match[3]; // Group 3: "~david"
match.index; // 6 (start position)
match.input; // original string
```

**Named groups:**

```javascript
let url = /(?<protocol>\w+):\/\/(?<host>[\w.]+)\/(?<path>\S*)/;
let match = text.match(url);

match.groups.protocol; // "http"
match.groups.host; // "www.example.com"
match.groups.path; // "~david"
```

### matchAll() (ES2020)

Returns iterator for all matches (requires `g` flag):

```javascript
const words = /\b\p{Alphabetic}+\b/gu;
const text = 'This is a naïve test.';

for (let word of text.matchAll(words)) {
  console.log(`Found '${word[0]}' at index ${word.index}`);
}
```

### split()

Splits string into array:

```javascript
'123,456,789'.split(','); // ["123", "456", "789"]
'1, 2, 3,\n4'.split(/\s*,\s*/); // ["1", "2", "3", "4"]
```

**With capturing groups:**

```javascript
const htmlTag = /<([^>]+)>/;
'Testing<br/>1,2,3'.split(htmlTag); // ["Testing", "br/", "1,2,3"]
```

---

## 9. RegExp Class

### Constructor

```javascript
let pattern = new RegExp('\\d{5}', 'g');
let copy = new RegExp(/JavaScript/, 'i'); // Copy with new flags
```

### Properties

```javascript
pattern.source; // "\\d{5}" (source text)
pattern.flags; // "g" (flags string)
pattern.global; // true (has g flag)
pattern.ignoreCase; // true (has i flag)
pattern.multiline; // true (has m flag)
pattern.dotAll; // true (has s flag)
pattern.unicode; // true (has u flag)
pattern.sticky; // true (has y flag)
pattern.lastIndex; // 0 (next search position for g/y flags)
```

### test()

Tests if pattern matches:

```javascript
/\d+/.test("123")           // true
/\d+/.test("abc")           // false
```

### exec()

Most powerful method - returns match array or null:

```javascript
let pattern = /Java/g;
let text = 'JavaScript > Java';
let match;

while ((match = pattern.exec(text)) !== null) {
  console.log(`Matched ${match[0]} at ${match.index}`);
  console.log(`Next search begins at ${pattern.lastIndex}`);
}
```

**Output:**

```text
Matched Java at 0
Next search begins at 4
Matched Java at 17
Next search begins at 21
```

---

## 10. Common Pitfalls

### lastIndex and RegExp Reuse

**Problem**: `lastIndex` persists between calls with `g` or `y` flags

**Infinite loop example:**

```javascript
let positions = [];
while ((match = /<p>/g.exec(html)) !== null) {
  // BUG!
  positions.push(match.index); // Creates new RegExp each time
}
```

**Solution**: Reuse the same RegExp object:

```javascript
let pattern = /<p>/g;
while ((match = pattern.exec(html)) !== null) {
  positions.push(match.index);
}
```

**Unexpected behavior with test():**

```javascript
let doubleLetterlet doubleLetter = /(\w)\1/g;
for (let word of ["apple", "book", "coffee"]) {
  if (doubleLetter.test(word)) {
    console.log(word);  // Missing "book"!
  }
}
```

**Solutions:**

- Remove `g` flag if not needed
- Reset `lastIndex` to 0 before each test
- Use `matchAll()` instead of `exec()` (ES2020)

---

## Common Patterns

### Email Validation (simple)

```javascript
/^[\w.%+-]+@[\w.-]+\.[A-Z]{2,}$/i;
```

### URL Matching

```javascript
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/;
```

### Phone Number (US)

```javascript
/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
```

### Date (MM/DD/YYYY)

```javascript
/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
```

### Hexadecimal Color

```javascript
/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
```

### Remove Extra Whitespace

```javascript
text.replace(/\s+/g, ' ').trim();
```

---

## Key Concepts Summary

✅ **Two creation methods**: Literal `/pattern/` or `new RegExp()`
✅ **Character classes** match one character from a set
✅ **Quantifiers** specify repetition: `*`, `+`, `?`, `{n,m}`
✅ **Anchors** match positions: `^`, `$`, `\b`
✅ **Grouping** with `()` creates captures, `(?:)` doesn't
✅ **Backreferences** `\1`, `\2` refer to captured groups
✅ **Flags** modify behavior: `g`, `i`, `m`, `s`, `u`, `y`
✅ **String methods**: `search()`, `replace()`, `match()`, `matchAll()`, `split()`
✅ **RegExp methods**: `test()`, `exec()`
✅ **lastIndex** can cause bugs with `g`/`y` flags - be careful!
