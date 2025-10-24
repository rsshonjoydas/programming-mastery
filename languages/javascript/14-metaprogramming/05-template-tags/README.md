# JavaScript Template Tags

## What are Template Tags?

**Template tags** (also called "tagged template literals") allow you to process template literals with a custom function. They're used for creating domain-specific languages (DSLs) and adding custom string processing logic.

### Basic Concept

```javascript
// Normal template literal
let result = `Hello ${name}`;

// Tagged template literal
let result = myTag`Hello ${name}`;
```

When a function is followed by a template literal (with no parentheses), it becomes a **tagged template literal**.

---

## How Tag Functions Work

Tag functions are **ordinary JavaScript functions** with a special calling convention.

### Function Signature

```javascript
function tagFunction(strings, ...values) {
  // strings: array of string literals
  // values: interpolated values
}
```

### Arguments Passed to Tag Functions

**First argument**: Array of strings (the literal parts)
**Remaining arguments**: Interpolated values (the `${...}` expressions)

### Argument Pattern

If the template has **n interpolated values**:

- Tag function receives **n+1 arguments**
- First argument: array of **n+1 strings**
- Next n arguments: the interpolated values

---

## Examples by Interpolation Count

### No Interpolations

```javascript
function myTag(strings) {
  console.log(strings); // ["Hello World"]
}

myTag`Hello World`;
```

### One Interpolation

```javascript
function myTag(strings, value1) {
  console.log(strings); // ["Hello ", "!"]
  console.log(value1); // "Alice"
}

myTag`Hello ${'Alice'}!`;
```

**Strings array breakdown**:

- `strings[0]`: Text **before** first interpolation (`"Hello "`)
- `strings[1]`: Text **after** first interpolation (`"!"`)

### Two Interpolations

```javascript
function myTag(strings, value1, value2) {
  console.log(strings); // ["", " and ", ""]
  console.log(value1); // "Alice"
  console.log(value2); // "Bob"
}

myTag`${Alice} and ${Bob}`;
```

**Strings array breakdown**:

- `strings[0]`: Text before first interpolation (empty string)
- `strings[1]`: Text between interpolations (`" and "`)
- `strings[2]`: Text after second interpolation (empty string)

### General Pattern

```javascript
function tag(strings, val1, val2, ..., valN) {
  // strings.length === N + 1
}
```

---

## Return Values

Unlike normal template literals (which always return strings), **tagged template literals return whatever the tag function returns**.

- Can return a string (processed version)
- Can return any data type (parsed representation, objects, etc.)
- Useful for DSLs that need non-string results

---

## Practical Example 1: HTML Escaping

A tag function that safely escapes HTML special characters:

```javascript
function html(strings, ...values) {
  // Escape each interpolated value
  let escaped = values.map((v) =>
    String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  );

  // Concatenate strings and escaped values
  let result = strings[0];
  for (let i = 0; i < escaped.length; i++) {
    result += escaped[i] + strings[i + 1];
  }

  return result;
}

// Usage
let operator = '<';
html`<b>x ${operator} y</b>`;
// Returns: "<b>x &lt; y</b>"

let kind = 'game',
  name = 'D&D';
html`<div class="${kind}">${name}</div>`;
// Returns: '<div class="game">D&amp;D</div>'
```

**How it works**:

1. Escapes all interpolated values to prevent XSS attacks
2. Concatenates literal strings with escaped values
3. Returns safe HTML string

---

## Practical Example 2: Pattern Matching (Non-String Return)

A tag function that returns a parsed object instead of a string:

```javascript
function glob(strings, ...values) {
  // Assemble strings and values into a single string
  let s = strings[0];
  for (let i = 0; i < values.length; i++) {
    s += values[i] + strings[i + 1];
  }

  // Return a parsed representation (not a string!)
  return new Glob(s); // Returns a Glob object
}

// Usage
let root = '/tmp';
let filePattern = glob`${root}/*.html`;
'/tmp/test.html'.match(filePattern)[1]; // => "test"
```

**Key point**: Returns a `Glob` object, not a string.

---

## The `raw` Property

The first argument (strings array) has a special **`raw`** property containing unprocessed strings with escape sequences intact.

### strings vs strings.raw

```javascript
function showRaw(strings, ...values) {
  console.log('Processed:', strings);
  console.log('Raw:', strings.raw);
}

showRaw`Line 1\nLine 2\t${value}`;
```

**Output**:

```text
Processed: ["Line 1
Line 2 ", ""]
Raw: ["Line 1\\nLine 2\\t", ""]
```

### String.raw() - Built-in Tag Function

Returns a string with escape sequences **not interpreted**:

```javascript
String.raw`C:\Users\Name\Desktop`;
// Returns: "C:\\Users\\Name\\Desktop"

// Without String.raw:
`C:\Users\Name\Desktop`;
// Escape sequences would be interpreted
```

### Use Case: Windows Paths

```javascript
function glob(strings, ...values) {
  // Use raw strings to preserve backslashes
  let s = strings.raw[0];
  for (let i = 0; i < values.length; i++) {
    s += values[i] + strings.raw[i + 1];
  }
  return new Glob(s);
}

// Works with Windows paths without double backslashes
glob`C:\temp\*.txt`;
```

**Trade-off**: Can't use Unicode escapes like `\u0041` when using `raw`.

---

## Real-World Use Cases

### 1. GraphQL Queries

```javascript
const query = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`;
```

### 2. CSS-in-JS (Emotion)

```javascript
const style = css`
  color: ${(props) => props.color};
  font-size: 16px;
  &:hover {
    opacity: 0.8;
  }
`;
```

### 3. SQL Query Builder

```javascript
const query = sql`
  SELECT * FROM users
  WHERE id = ${userId}
  AND status = ${status}
`;
```

### 4. Internationalization (i18n)

```javascript
const message = i18n`Hello ${userName}, you have ${count} messages`;
```

---

## Creating Your Own Tag Functions

### Template for Tag Functions

```javascript
function myTag(strings, ...values) {
  // 1. Process the values (escape, validate, transform)
  let processed = values.map((v) => {
    // Your processing logic
    return processValue(v);
  });

  // 2. Combine strings and processed values
  let result = strings[0];
  for (let i = 0; i < processed.length; i++) {
    result += processed[i] + strings[i + 1];
  }

  // 3. Return result (string or any other type)
  return result;
}
```

### Example: SQL Injection Prevention

```javascript
function sql(strings, ...values) {
  let query = strings[0];

  for (let i = 0; i < values.length; i++) {
    // Escape or parameterize values
    let escaped =
      typeof values[i] === 'string'
        ? `'${values[i].replace(/'/g, "''")}'`
        : values[i];

    query += escaped + strings[i + 1];
  }

  return query;
}

let username = "admin' OR '1'='1";
sql`SELECT * FROM users WHERE name = ${username}`;
// Safe: SELECT * FROM users WHERE name = 'admin'' OR ''1''=''1'
```

### Example: URL Builder

```javascript
function url(strings, ...values) {
  let result = strings[0];

  for (let i = 0; i < values.length; i++) {
    result += encodeURIComponent(values[i]) + strings[i + 1];
  }

  return result;
}

let query = 'hello world';
url`https://example.com/search?q=${query}`;
// Returns: "https://example.com/search?q=hello%20world"
```

---

## Key Concepts Summary

✅ **Tagged template literals** call a function with template literal data
✅ **Tag functions** are ordinary JavaScript functions (no special syntax)
✅ **First argument** is an array of string literals (n+1 strings for n interpolations)
✅ **Remaining arguments** are the interpolated values
✅ **Return value** can be anything (string, object, parsed data structure)
✅ **strings.raw** provides unprocessed strings with escape sequences intact
✅ **String.raw()** is a built-in tag that returns raw strings
✅ Common use cases: **DSLs, HTML escaping, SQL safety, CSS-in-JS, GraphQL**
✅ Tag functions enable **metaprogramming** (adding custom "syntax" to JavaScript)

---

## Comparison Table

| Feature           | Normal Template Literal       | Tagged Template Literal    |
| ----------------- | ----------------------------- | -------------------------- |
| **Syntax**        | `` `text ${val}` ``           | `` tag`text ${val}` ``     |
| **Processing**    | Built-in string interpolation | Custom function processing |
| **Return type**   | Always string                 | Any type                   |
| **Use case**      | Simple string building        | DSLs, validation, escaping |
| **Function call** | No                            | Yes (tag function)         |

---

## Best Practices

✅ Use tag functions for **repeatable string processing patterns**
✅ Name tag functions clearly (e.g., `html`, `sql`, `css`)
✅ Handle **all value types** properly (null, undefined, objects)
✅ Consider using **strings.raw** for backslash-heavy DSLs
✅ Return appropriate types (**string** for formatters, **objects** for parsers)
✅ Add **error handling** for invalid inputs
✅ Document expected **interpolation types** and behavior

Tag functions are a powerful metaprogramming feature that lets you create cleaner, safer, and more expressive code!
