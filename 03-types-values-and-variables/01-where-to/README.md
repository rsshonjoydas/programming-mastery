# JavaScript: Where and How to Include Code

## The `<script>` Tag

**Basic syntax for embedding JavaScript in HTML:**

```html
<script>
  document.getElementById('demo').innerHTML = 'My First JavaScript';
</script>
```

### Legacy Type Attribute

```html
<!-- Old way (NOT required anymore) -->
<script type="text/javascript"></script>

<!-- Modern way (default) -->
<script></script>
```

**Note:** JavaScript is the default scripting language in HTML - no type attribute needed.

---

## JavaScript Functions and Events

**Function** = Block of JavaScript code that executes when "called"

**Common trigger:** User events (button clicks, etc.)

```html
<button onclick="myFunction()">Click me</button>
```

---

## 6 Methods to Include JavaScript in HTML

### Method 1: Inline JavaScript ❌ (Not Recommended)

**Directly in HTML attributes:**

```html
<button onclick="console.log('Inline JavaScript')">Click me</button>
```

**Issues:**

- Mixes HTML and JavaScript
- Hard to maintain
- Poor separation of concerns

---

### Method 2: Internal JavaScript (in `<head>`)

**JavaScript function in `<head>` section**

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      function myFunction() {
        document.getElementById('demo').innerHTML = 'Paragraph changed.';
      }
    </script>
  </head>
  <body>
    <h2>Demo JavaScript in Head</h2>
    <p id="demo">A Paragraph</p>
    <button type="button" onclick="myFunction()">Try it</button>
  </body>
</html>
```

**Characteristics:**

- Script loads before body content
- May slow down page display
- Function available when page loads

---

### Method 3: Internal JavaScript (in `<body>`)

**JavaScript function in `<body>` section**

```html
<!DOCTYPE html>
<html>
  <body>
    <h2>Demo JavaScript in Body</h2>
    <p id="demo">A Paragraph</p>
    <button type="button" onclick="myFunction()">Try it</button>

    <script>
      function myFunction() {
        document.getElementById('demo').innerHTML = 'Paragraph changed.';
      }
    </script>
  </body>
</html>
```

**Best practice:**

- Place scripts at **bottom of `<body>`**
- Improves display speed
- HTML content loads first
- Script interpretation doesn't block rendering

---

### Method 4: External JavaScript (End of `<body>`) ✅ (Traditional Best Practice)

**Separate .js file loaded at end of body:**

**External file: `myScript.js`**

```javascript
function myFunction() {
  document.getElementById('demo').innerHTML = 'Paragraph changed.';
}
```

**HTML file:**

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Introduction JavaScript</h1>
    <div id="root"></div>

    <!-- Load script at end -->
    <script src="./script.js"></script>
  </body>
</html>
```

**Advantages:**

- ✅ HTML loads first (fast initial render)
- ✅ DOM elements available when script runs
- ✅ No blocking

---

### Method 5: External JavaScript with `async` (in `<head>`) ⚡

**Download asynchronously, execute immediately when ready:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script async src="./script.js"></script>
  </head>
  <body>
    <h1>Introduction JavaScript</h1>
    <div id="root"></div>
  </body>
</html>
```

**Behavior:**

- Downloads in parallel with HTML parsing
- Executes immediately when downloaded (pauses HTML parsing)
- **Execution order NOT guaranteed** (if multiple scripts)

**Use when:**

- Script is independent (no dependencies)
- Order doesn't matter
- Analytics scripts, ads

---

### Method 6: External JavaScript with `defer` (in `<head>`) ✅ (Modern Best Practice)

**Download asynchronously, execute after HTML parsing:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script defer src="./script.js"></script>
  </head>
  <body>
    <h1>Introduction JavaScript</h1>
    <div id="root"></div>
  </body>
</html>
```

**Behavior:**

- Downloads in parallel with HTML parsing
- Executes after HTML parsing complete
- **Execution order guaranteed** (if multiple scripts)
- Executes before `DOMContentLoaded` event

**Use when:**

- Script needs DOM elements
- Script order matters
- **Recommended for most cases**

---

## External JavaScript: Complete Guide

### File Extension

- JavaScript files use `.js` extension
- Example: `myScript.js`, `script.js`

### Basic Usage

```html
<script src="myScript.js"></script>
```

### Placement Options

```html
<!-- In head -->
<head>
  <script src="myScript.js"></script>
</head>

<!-- In body -->
<body>
  <script src="myScript.js"></script>
</body>
```

**Note:** Script behaves as if code is located exactly where `<script>` tag is placed.

### Important Rule

**External scripts CANNOT contain `<script>` tags**

```javascript
// ❌ Wrong - in external file
<script>function myFunction() {}</script>;

// ✅ Correct - in external file
function myFunction() {}
```

---

## External JavaScript Advantages

### 1. **Separation of Concerns**

- HTML and JavaScript in separate files
- Cleaner code organization

### 2. **Maintainability**

- Easier to read
- Easier to maintain
- One file, many pages

### 3. **Reusability**

- Same code used across multiple pages
- No duplication

### 4. **Performance**

- **Cached files** speed up page loads
- Browser downloads once, reuses for other pages

---

## Multiple External Scripts

**Use multiple `<script>` tags:**

```html
<script src="myScript1.js"></script>
<script src="myScript2.js"></script>
```

**Scripts execute in order** (unless using `async`)

---

## External Script Reference Methods

### 1. Full URL (Absolute Path)

```html
<script src="https://www.w3schools.com/js/myScript.js"></script>
```

**Use for:** CDN links, external libraries

### 2. File Path (Relative Path)

```html
<script src="/js/myScript.js"></script>
```

**Use for:** Files in project folders

### 3. No Path (Same Directory)

```html
<script src="myScript.js"></script>
```

**Use for:** Files in same folder as HTML

---

## Best Practices Summary

| Method                    | Location        | Attributes | Best For             | Performance      |
| ------------------------- | --------------- | ---------- | -------------------- | ---------------- |
| **Inline**                | HTML attributes | -          | ❌ Never use         | Poor             |
| **Internal Head**         | `<head>`        | -          | Small scripts        | Blocks rendering |
| **Internal Body**         | End of `<body>` | -          | Small scripts        | Good             |
| **External Body**         | End of `<body>` | -          | Traditional approach | Good ✅          |
| **External Head (async)** | `<head>`        | `async`    | Independent scripts  | Very Good ⚡     |
| **External Head (defer)** | `<head>`        | `defer`    | Most modern apps     | Best ✅          |

---

## `async` vs `defer` vs Normal - Visual Comparison

### Normal (No Attribute)

```text
HTML Parsing → [STOP] → Download & Execute Script → Resume HTML Parsing
```

### async

```text
HTML Parsing (Download in parallel) → [PAUSE] → Execute Script → Resume HTML
```

- Downloads: Parallel ⚡
- Executes: Immediately when ready
- Order: NOT guaranteed

### defer

```text
HTML Parsing (Download in parallel) → HTML Complete → Execute Script(s) in order
```

- Downloads: Parallel ⚡
- Executes: After HTML parsing
- Order: Guaranteed ✅

---

## Recommended Approach (2024+)

### For Most Projects

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <!-- ✅ Best: defer in head -->
    <script defer src="./script.js"></script>
  </head>
  <body>
    <h1>Introduction JavaScript</h1>
    <div id="root"></div>
  </body>
</html>
```

### For Independent Scripts (Analytics, Ads)

```html
<head>
  <!-- ✅ Good: async for independent scripts -->
  <script async src="analytics.js"></script>
</head>
```

### For Legacy Browser Support

```html
<body>
  <h1>Content</h1>
  <div id="root"></div>

  <!-- ✅ Fallback: end of body -->
  <script src="./script.js"></script>
</body>
```

---

## Quick Decision Tree

```text
Need JavaScript in HTML?
│
├─ Same code on multiple pages?
│  ├─ YES → Use External File
│  └─ NO → Use Internal (end of body)
│
└─ Using External File?
   ├─ Modern browser only? → Use defer (in head)
   ├─ Script independent? → Use async (in head)
   └─ Legacy support? → End of body
```

---

## Key Takeaways

1. **Always prefer external JavaScript files** for reusability and caching
2. **Use `defer` for most scripts** - best performance + guaranteed order
3. **Use `async` for independent scripts** - analytics, ads
4. **Place at end of body** - fallback for older browsers
5. **Never use inline JavaScript** - poor maintainability
6. **External files use `.js` extension** and cannot contain `<script>` tags
7. **Scripts can be referenced** by full URL, file path, or filename only
