# JavaScript URL APIs

The **URL API** provides a powerful and standardized way to parse, manipulate, and construct URLs in JavaScript. It handles complex tasks like escaping special characters and managing query parameters.

## Overview

- **Not part of ECMAScript** but standardized at [https://url.spec.whatwg.org](https://url.spec.whatwg.org)
- **Supported in**: Node.js and all modern browsers (except Internet Explorer)
- **Purpose**: Parse URLs, modify components, and handle proper encoding/escaping

---

## Creating URL Objects

### Constructor Syntax

```javascript
// Absolute URL
let url = new URL('https://example.com/path');

// Relative URL (requires base URL as second argument)
let url = new URL('/api/users', 'https://example.com');
```

---

## URL Properties (Read/Write)

Once created, a URL object exposes various properties representing different parts of the URL:

```javascript
let url = new URL('https://example.com:8000/path/name?q=term#fragment');

url.href; // "https://example.com:8000/path/name?q=term#fragment"
url.origin; // "https://example.com:8000" (read-only)
url.protocol; // "https:"
url.host; // "example.com:8000"
url.hostname; // "example.com"
url.port; // "8000"
url.pathname; // "/path/name"
url.search; // "?q=term"
url.hash; // "#fragment"
```

### Property Breakdown

| Property   | Description                        | Example                           |
| ---------- | ---------------------------------- | --------------------------------- |
| `href`     | Complete URL string                | `https://example.com/path?q=term` |
| `origin`   | Protocol + host + port (read-only) | `https://example.com:8000`        |
| `protocol` | Scheme with colon                  | `https:`                          |
| `host`     | Hostname + port                    | `example.com:8000`                |
| `hostname` | Domain name only                   | `example.com`                     |
| `port`     | Port number                        | `8000`                            |
| `pathname` | Path portion                       | `/path/name`                      |
| `search`   | Query string with `?`              | `?q=term`                         |
| `hash`     | Fragment with `#`                  | `#fragment`                       |

---

## Authentication in URLs

URLs can include username and password (though rarely used):

```javascript
let url = new URL('ftp://admin:1337!@ftp.example.com/');

url.href; // "ftp://admin:1337!@ftp.example.com/"
url.origin; // "ftp://ftp.example.com"
url.username; // "admin"
url.password; // "1337!"
```

---

## Modifying URLs

All properties (except `origin`) are **read/write**, allowing you to modify parts of the URL:

```javascript
let url = new URL('https://example.com');

url.pathname = 'api/search'; // Add path
url.search = 'q=test'; // Add query string

url.toString(); // "https://example.com/api/search?q=test"
```

### Automatic Encoding

The URL class **automatically escapes** special characters:

```javascript
let url = new URL('https://example.com');

url.pathname = 'path with spaces';
url.search = 'q=foo#bar';

url.pathname; // "/path%20with%20spaces"
url.search; // "?q=foo%23bar"
url.href; // "https://example.com/path%20with%20spaces?q=foo%23bar"
```

**Special characters are properly encoded**:

- Spaces → `%20`
- `#` → `%23`
- And other special characters as needed

---

## The `href` Property

The `href` property is special:

- **Reading** `href` → Reassembles all URL parts into a canonical string (like `toString()`)
- **Setting** `href` → Re-parses the URL as if calling the constructor again

```javascript
let url = new URL('https://example.com');
url.href = 'https://newsite.com/path?q=value';
// Equivalent to: url = new URL("https://newsite.com/path?q=value");
```

---

## URLSearchParams: Managing Query Parameters

The `searchParams` property provides a powerful API for working with query strings.

### Basic Usage

```javascript
let url = new URL('https://example.com/search');

url.search; // "" (no query yet)

// Add parameter
url.searchParams.append('q', 'term');
url.search; // "?q=term"

// Change parameter
url.searchParams.set('q', 'x');
url.search; // "?q=x"

// Get parameter value
url.searchParams.get('q'); // "x"

// Check if parameter exists
url.searchParams.has('q'); // true
url.searchParams.has('p'); // false
```

### Multiple Values for Same Parameter

```javascript
url.searchParams.append('opts', '1');
url.search; // "?q=x&opts=1"

url.searchParams.append('opts', '&'); // Add another value
url.search; // "?q=x&opts=1&opts=%26" (& is escaped)

// Get first value
url.searchParams.get('opts'); // "1"

// Get all values
url.searchParams.getAll('opts'); // ["1", "&"]
```

### URLSearchParams Methods

| Method                | Description                         |
| --------------------- | ----------------------------------- |
| `append(name, value)` | Add a parameter (allows duplicates) |
| `set(name, value)`    | Set/replace a parameter             |
| `get(name)`           | Get first value of parameter        |
| `getAll(name)`        | Get all values as array             |
| `has(name)`           | Check if parameter exists           |
| `delete(name)`        | Remove all instances of parameter   |
| `sort()`              | Sort parameters alphabetically      |
| `toString()`          | Convert to query string             |

### Complete Example

```javascript
let url = new URL('https://example.com/search');

url.searchParams.append('q', 'term');
url.searchParams.append('opts', '1');
url.searchParams.append('opts', '&');
url.search; // "?q=term&opts=1&opts=%26"

// Sort alphabetically
url.searchParams.sort();
url.search; // "?opts=1&opts=%26&q=term"

// Change parameter
url.searchParams.set('opts', 'y');
url.search; // "?opts=y&q=term"

// Iterate over parameters
[...url.searchParams]; // [["opts", "y"], ["q", "term"]]

// Delete parameter
url.searchParams.delete('opts');
url.search; // "?q=term"
url.href; // "https://example.com/search?q=term"
```

---

## Creating URLSearchParams Independently

You can create `URLSearchParams` objects independently and assign them to a URL:

```javascript
let url = new URL('http://example.com');
let params = new URLSearchParams();

params.append('q', 'term');
params.append('opts', 'exact');

params.toString(); // "q=term&opts=exact"

url.search = params;
url.href; // "http://example.com/?q=term&opts=exact"
```

---

## Legacy URL Functions (Deprecated/Problematic)

Before the URL API, JavaScript had several global functions for URL encoding. **These should generally be avoided** in favor of the URL API.

### 1. escape() and unescape() ❌

- **Status**: Deprecated
- **Don't use**: Still implemented but obsolete

### 2. encodeURI() and decodeURI()

**Purpose**: Encode entire URLs

```javascript
let encoded = encodeURI('https://example.com/path with spaces');
// "https://example.com/path%20with%20spaces"

let decoded = decodeURI(encoded);
// "https://example.com/path with spaces"
```

**Limitations**:

- Does **not** escape URL separators: `/`, `?`, `#`
- Cannot work correctly for URLs with these characters in components

### 3. encodeURIComponent() and decodeURIComponent()

**Purpose**: Encode individual URL components

```javascript
let component = 'value with spaces & special?chars';
let encoded = encodeURIComponent(component);
// "value%20with%20spaces%20%26%20special%3Fchars"

let decoded = decodeURIComponent(encoded);
// "value with spaces & special?chars"
```

**Usage**:

```javascript
let base = 'https://example.com/search?q=';
let query = 'term with spaces';
let url = base + encodeURIComponent(query);
// "https://example.com/search?q=term%20with%20spaces"
```

**Limitations**:

- Escapes `/` characters (may not be desired in paths)
- Converts spaces to `%20` instead of `+` in query strings

### Why Legacy Functions Are Problematic

❌ **Different URL parts require different encoding schemes**
❌ **No single function handles all cases correctly**
❌ **Inconsistent space handling** (`%20` vs `+`)
❌ **Manual encoding is error-prone**

✅ **Solution**: Use the **URL class** for all URL manipulation

---

## Best Practices

### ✅ DO: Use the URL API

```javascript
let url = new URL('https://example.com');
url.pathname = 'path with spaces';
url.searchParams.set('q', 'term & value');
// Properly encoded automatically
```

### ❌ DON'T: Use legacy functions

```javascript
// Problematic and error-prone
let url = 'https://example.com/' + encodeURIComponent('path');
```

### ✅ DO: Use searchParams for query strings

```javascript
url.searchParams.append('filter', 'value');
url.searchParams.set('page', '2');
```

### ❌ DON'T: Manually construct query strings

```javascript
// Error-prone
url.search = '?filter=' + encodeURIComponent(value);
```

---

## **Complete Example**

```javascript
// Create URL
let url = new URL('https://api.example.com');

// Build path
url.pathname = '/v1/search';

// Add query parameters
url.searchParams.set('q', 'JavaScript URL API');
url.searchParams.set('limit', '10');
url.searchParams.append('tags', 'web');
url.searchParams.append('tags', 'tutorial');

// Add fragment
url.hash = 'results';

console.log(url.href);
// "https://api.example.com/v1/search?q=JavaScript+URL+API&limit=10&tags=web&tags=tutorial#results"

// Modify parameters
url.searchParams.set('limit', '20');
url.searchParams.delete('tags');

console.log(url.href);
// "https://api.example.com/v1/search?q=JavaScript+URL+API&limit=20#results"
```

---

## Key Concepts Summary

✅ **URL class** parses and manipulates URLs with proper encoding
✅ **Properties** like `pathname`, `search`, `hash` are read/write
✅ **origin** property is read-only (protocol + host + port)
✅ **Automatic escaping** handles special characters correctly
✅ **searchParams** provides a powerful API for query strings
✅ **URLSearchParams** methods: `append`, `set`, `get`, `getAll`, `has`, `delete`, `sort`
✅ **Multiple values** for the same parameter are supported
✅ **Legacy functions** (`encodeURI`, `encodeURIComponent`) should be avoided
✅ **Use URL class** for all URL manipulation to ensure proper encoding
