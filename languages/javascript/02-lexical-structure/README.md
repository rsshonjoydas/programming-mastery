# JavaScript Lexical Structure

## What is Lexical Structure?

**Lexical structure** = Elementary rules specifying how to write programs in a language

- Lowest-level syntax of the language
- Defines: variable names, comment delimiters, statement separators, etc.

---

## 2.1 Text of a JavaScript Program

### Case Sensitivity

- **JavaScript is case-sensitive**
- Keywords, variables, function names, identifiers must have consistent capitalization
- Examples:
  - `while` ≠ `While` ≠ `WHILE`
  - `online`, `Online`, `OnLine`, `ONLINE` are **four distinct variable names**

### Whitespace

- **JavaScript ignores spaces between tokens**
- **Line breaks are mostly ignored** (with exceptions in §2.6)
- Free use of spaces and newlines for formatting and indentation
- **Whitespace characters recognized:**
  - Regular space (`\u0020`)
  - Tabs
  - ASCII control characters
  - Various Unicode space characters
- **Line terminators recognized:**
  - Newlines
  - Carriage returns
  - Carriage return/line feed sequences

---

## 2.2 Comments

### Two Comment Styles

#### Single-line Comments

```javascript
// This is a single-line comment
// Text from // to end of line is ignored
```

#### Multi-line Comments

```javascript
/* This is also a comment */

/*
 * Multi-line comment
 * Can span multiple lines
 * CANNOT be nested
 * Extra * characters are optional (just style)
 */
```

**Key Rules:**

- `//` to end of line = comment
- `/* */` = comment (can span lines, cannot nest)

---

## 2.3 Literals

**Literal** = Data value appearing directly in a program

### Examples of All Literal Types

```javascript
12; // Number (integer)
1.2; // Number (decimal)
('hello world'); // String (double quotes)
('Hi'); // String (single quotes)
true; // Boolean value
false; // Boolean value
null; // Absence of an object
```

---

## 2.4 Identifiers and Reserved Words

### Identifiers

**Identifier** = A name used in JavaScript

**Used to name:**

- Constants
- Variables
- Properties
- Functions
- Classes
- Loop labels

### Identifier Rules

**First character must be:**

- Letter
- Underscore (`_`)
- Dollar sign (`$`)

**Subsequent characters can be:**

- Letters
- Digits (0-9)
- Underscores (`_`)
- Dollar signs (`$`)

**Note:** Digits NOT allowed as first character (helps distinguish from numbers)

**Valid identifier examples:**

```javascript
i;
my_variable_name;
v13;
_dummy;
$str;
```

---

## 2.4.1 Reserved Words

### Categories of Reserved Words

#### 1. **Strict Keywords** (cannot be used as identifiers)

```text
if, while, for, const, function, class, return, etc.
```

#### 2. **Contextual Keywords** (limited use, no ambiguity)

```text
from, of, get, set, target
```

- Can be used as identifiers
- Already in common use
- **Safe to use:** `from`, `set`, `target`

#### 3. **Complex Rules Keywords**

```text
let
```

- Can be variable name with `var` outside class
- Cannot be used inside class or with `const`
- **Best practice:** Avoid using

### Complete Reserved Words List

```text
as          const       export      void
async       continue    extends     while
await       debugger    false       with
break       default     finally     yield
case        delete      for
catch       do          from
class       else        function
            get         if
            import      in
            instanceof  let
            new         null
            of          return
            set         static
            super       switch
            target      this
            throw       true
            try         typeof
            var
```

### Future Reserved Words

**May be used in future versions:**

```text
enum  implements  interface  package  private  protected  public
```

### Historical Restrictions

- `arguments` and `eval` - restricted in certain circumstances
- **Best practice:** Avoid entirely

---

## 2.5 Unicode

### Unicode Support

- **JavaScript programs written using Unicode character set**
- **Unicode allowed in:**
  - Strings ✓
  - Comments ✓
  - Identifiers (letters, digits, ideographs) ✓
  - **NOT emojis in identifiers** ✗
- **Unicode NOT allowed in:**
  - Language keywords ✗

### Common Practice

- Use only ASCII letters and digits in identifiers (portability)
- This is convention, not requirement

### Unicode in Identifiers Examples

```javascript
const π = 3.14; // Mathematical symbols allowed
const sí = true; // Non-English words allowed
```

---

## 2.5.1 Unicode Escape Sequences

### Purpose

- Write Unicode characters using only ASCII
- Support for older hardware/software

### Escape Sequence Formats

#### Four-digit format (original)

```javascript
\uXXXX    // Exactly 4 hexadecimal digits (A-F, uppercase/lowercase)
```

#### Curly brace format (ES6+)

```javascript
\u{X...}  // 1 to 6 hexadecimal digits in curly braces
```

### Where Escape Sequences Work

- ✓ String literals
- ✓ Regular expression literals
- ✓ Identifiers
- ✗ NOT in language keywords

### Example: Three Ways to Write "café"

```javascript
let café = 1; // Direct Unicode character
café; // => 1; four-digit escape
café; // => 1; curly brace escape (ES6+)
```

### Emoji Support (ES6+)

```javascript
console.log('\u{1F600}'); // Prints smiley face emoji
// Requires >16 bits, only works with curly brace format
```

### Escape Sequences in Comments

- Treated as ASCII characters
- Not interpreted as Unicode
- Simply ignored (since comments are ignored)

---

## 2.5.2 Unicode Normalization

### The Problem

- **Same character can have multiple encodings**
- May look identical but have different binary encodings
- JavaScript treats them as different

### Example: "é" Two Ways

```javascript
// Method 1: Single Unicode character
const café = 1; // "caf\u{e9}"

// Method 2: ASCII 'e' + combining accent mark
const café = 2; // "cafe\u{301}"

café; // => 1
café; // => 2  (visually indistinguishable but different!)
```

### Solution

- **Unicode normalization** = Convert to canonical form
- JavaScript assumes source code already normalized
- **Does NOT normalize automatically**
- **Your responsibility:** Use editor/tool to normalize code
- Prevents different but identical-looking identifiers

---

## 2.6 Optional Semicolons

### Basic Rules

- **Semicolon (`;`) separates statements**
- **Can be omitted** when statements on separate lines
- **Can be omitted** at end of program
- **Can be omitted** before closing curly brace `}`

### Two Programming Styles

1. **Explicit:** Use semicolons everywhere (this book's style)
2. **Minimal:** Omit when possible, use only when required

---

### When Semicolons Are Optional

#### Allowed (separate lines)

```javascript
a = 3;
b = 4;
// Same as: a = 3; b = 4;
```

#### Required (same line)

```javascript
a = 3;
b = 4;
// Semicolon required between statements
```

---

### Automatic Semicolon Insertion (ASI) Rules

#### General Rule

JavaScript treats line break as semicolon **IF:**

- Next nonspace character cannot be interpreted as continuation
- Code cannot be parsed without semicolon

#### Example 1: Multiple Insertions

```javascript
let a;
a = 3;
console.log(a);

// Interpreted as:
let a;
a = 3;
console.log(a);
```

**Why:**

- First break: `let a a` cannot parse → semicolon inserted
- Second break: Can continue as `a = 3;` → no semicolon
- Third break: Statement complete → semicolon inserted

---

### Dangerous Cases

#### Problem: Unintended Function Call

```javascript
let y = x + f(a + b).toString();

// JavaScript interprets as:
let y = x + f(a + b).toString();
// NOT as two statements!
```

**Why dangerous:**

- Parentheses `()` can be function invocation
- Second line looks like continuation

---

### High-Risk Starting Characters

**If statement begins with these, may be interpreted as continuation:**

- `(` - Very common, high risk
- `[` - Very common, high risk
- `/` - Rare
- `+` - Rare
- `-` - Rare

#### Defensive Programming

```javascript
let x = 0; // Semicolon omitted
[x, x + 1, x + 2].forEach(console.log); // Defensive ; at start
```

**Defensive semicolon:**

- At beginning of statement
- Ensures it works even if previous statement modified

---

### Three Exceptions to ASI Rules

#### Exception 1: Return, Break, Continue, Throw, Yield

**These keywords often stand alone, but can have expressions after.**

**Problem:**

```javascript
return;
true;

// JavaScript interprets as:
return;
true;

// You probably meant:
return true;
```

**Rule:**

- **Never insert line break** after these keywords
- Break must appear on same line as expression
- Code will fail in non-obvious way if violated

**Keywords affected:**

- `return`
- `throw`
- `yield`
- `break`
- `continue`

#### Exception 2: Increment/Decrement Operators (++ and --)

**These can be prefix or postfix:**

```javascript
++x; // Prefix
x++; // Postfix
```

**Rule:**

- If using as **postfix**, must be on **same line** as expression
- Line break changes meaning

#### Exception 3: Arrow Functions (=>)

**Arrow syntax:**

```javascript
const func = (params) => expression;
```

**Rule:**

- `=>` arrow must be on **same line** as parameter list
- Cannot insert line break before arrow

---

## 2.7 Summary

### Chapter Coverage

This chapter covered lowest-level syntax:

1. ✓ Case sensitivity, spaces, line breaks
2. ✓ Comments (single-line, multi-line)
3. ✓ Literals (numbers, strings, booleans, null)
4. ✓ Identifiers and reserved words
5. ✓ Unicode (characters, escapes, normalization)
6. ✓ Optional semicolons (ASI rules, exceptions)

### Next Chapter

- Primitive types and values
- Numbers, strings, etc.
- Basic units of computation

---

## Quick Reference Table

| Concept            | Key Points                                        |
| ------------------ | ------------------------------------------------- |
| **Case**           | Sensitive - `while` ≠ `While`                     |
| **Whitespace**     | Ignored between tokens                            |
| **Comments**       | `//` single-line, `/* */` multi-line              |
| **Identifiers**    | Start: letter/`_`/`$`, Then: letter/digit/`_`/`$` |
| **Unicode Escape** | `\uXXXX` or `\u{X...}`                            |
| **Semicolons**     | Optional on separate lines, required on same line |
| **ASI Exceptions** | return/break/continue/throw/yield, ++/--, =>      |
