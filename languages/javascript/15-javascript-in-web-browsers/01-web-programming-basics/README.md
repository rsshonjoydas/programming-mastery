# Web Programming Basics

## Overview

Web programming in JavaScript involves understanding how code is structured, loaded, executed, and how it interacts with HTML documents in a browser environment.

---

## 1. JavaScript in HTML `<script>` Tags

### Inline Scripts

JavaScript code can be embedded directly in HTML between `<script>` and `</script>` tags:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Digital Clock</title>
  </head>
  <body>
    <h1>Digital Clock</h1>
    <span id="clock"></span>

    <script>
      function displayTime() {
        let clock = document.querySelector('#clock');
        let now = new Date();
        clock.textContent = now.toLocaleTimeString();
      }
      displayTime();
      setInterval(displayTime, 1000);
    </script>
  </body>
</html>
```

### External Scripts

More commonly, use the `src` attribute to reference external JavaScript files:

```html
<script src="scripts/digital_clock.js"></script>
```

**Note**: The closing `</script>` tag is required even with `src` attribute.

### Advantages of External Scripts

✅ **Separation of concerns**: Keeps content (HTML) separate from behavior (JavaScript)
✅ **Code reusability**: Share the same code across multiple pages
✅ **Caching**: Browser caches the file after first download
✅ **Maintainability**: Edit code in one place instead of multiple HTML files
✅ **CDN support**: Can load code from other servers

---

## 2. Modules

For modular JavaScript, use the `type="module"` attribute:

```html
<script type="module" src="main.js"></script>
```

**Module behavior**:

- Loads the module and all its imports recursively
- Automatically deferred (runs after document loads)
- Can use `async` attribute to override deferred behavior
- See §10.3 for complete module details

---

## 3. Script Type Attribute

**When to use `type` attribute**:

1. To specify the script is a module: `type="module"`
2. To embed non-displayed data: `type="application/json"`

**Do NOT use**:

- ❌ `language="javascript"` (deprecated)
- ❌ `type="application/javascript"` (unnecessary)

JavaScript is the default and only language of the web.

---

## 4. Script Execution: async and defer

### Default Behavior (Blocking)

By default, scripts **block** HTML parsing while they download and execute:

```html
<script src="blocking.js"></script>
```

**Problem**: Can slow down page rendering

### defer Attribute

Script downloads in parallel but **executes after** document is fully parsed:

```html
<script defer src="deferred.js"></script>
```

**Characteristics**:

- Does not block parsing
- Executes in document order
- Runs before `DOMContentLoaded` event
- Document is fully parsed and ready to manipulate

### async Attribute

Script downloads in parallel and **executes as soon as** it's ready:

```html
<script async src="async.js"></script>
```

**Characteristics**:

- Does not block parsing
- May execute out of order
- Runs as soon as downloaded
- Document may not be fully parsed

### Both Attributes

If both are present, `async` takes precedence:

```html
<script async defer src="script.js"></script>
```

### Module Scripts

Modules are **deferred by default**:

```html
<script type="module" src="module.js"></script>
<!-- Deferred -->
<script type="module" async src="module.js"></script>
<!-- Async -->
```

### Alternative: Scripts at End

Place scripts at the end of `<body>`:

```html
<body>
  <!-- Content here -->

  <script src="script.js"></script>
</body>
```

---

## 5. Loading Scripts on Demand

### With Modules

```javascript
// Load module dynamically
import('./module.js').then((module) => {
  module.doSomething();
});
```

### Without Modules

```javascript
function importScript(url) {
  return new Promise((resolve, reject) => {
    let s = document.createElement('script');
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    s.src = url;
    document.head.append(s);
  });
}

// Usage
importScript('library.js')
  .then(() => console.log('Script loaded'))
  .catch((err) => console.error('Failed to load:', err));
```

---

## 6. The Document Object Model (DOM)

The **DOM** represents HTML documents as a tree structure where each element is a JavaScript object.

### HTML Document Example

```html
<html>
  <head>
    <title>Sample Document</title>
  </head>
  <body>
    <h1>An HTML Document</h1>
    <p>This is a <i>simple</i> document.</p>
  </body>
</html>
```

### DOM Tree Structure

```text
Document
  └─ <html> (Element)
      ├─ <head> (Element)
      │   └─ <title> (Element)
      │       └─ "Sample Document" (Text)
      └─ <body> (Element)
          ├─ <h1> (Element)
          │   └─ "An HTML Document" (Text)
          └─ <p> (Element)
              ├─ "This is a " (Text)
              ├─ <i> (Element)
              │   └─ "simple" (Text)
              └─ " document." (Text)
```

### DOM Terminology

- **Parent**: Node directly above
- **Children**: Nodes one level directly below
- **Siblings**: Nodes at the same level with same parent
- **Descendants**: All nodes below (any number of levels)
- **Ancestors**: All nodes above

### DOM Classes

- **Document**: The entire HTML document
- **Element**: HTML tags (e.g., `<div>`, `<p>`, `<img>`)
- **Text**: Text content within elements
- **Node**: Base class for all DOM objects

### Element-Specific Classes

Each HTML tag has a corresponding JavaScript class:

- `HTMLBodyElement` for `<body>`
- `HTMLTableElement` for `<table>`
- `HTMLImageElement` for `<img>`
- `HTMLAudioElement` for `<audio>`
- `HTMLVideoElement` for `<video>`

**Properties mirror HTML attributes**:

```javascript
let img = document.querySelector('img');
img.src = 'newimage.jpg'; // Changes src attribute
```

---

## 7. The Global Object in Web Browsers

### One Global Object Per Window/Tab

All JavaScript code in a window/tab shares a **single global object**.

**Contains**:

- JavaScript standard library (`parseInt()`, `Math`, `Set`, etc.)
- Web APIs (`document`, `fetch()`, `Audio()`, etc.)
- Window-specific properties (`history`, `innerWidth`, etc.)

### The window Property

The global object has a `window` property that refers to itself:

```javascript
window.innerWidth; // Preferred (explicit)
innerWidth; // Works but less clear
```

**Best practice**: Use `window.` prefix for clarity with window-specific features.

---

## 8. Scripts Share a Namespace

### Modules (Isolated)

- Top-level declarations are **private** to the module
- Must explicitly `export` to share
- Other modules must `import` to use

```javascript
// module.js
export const PI = 3.14159;
export function calculate() {}
```

### Non-Module Scripts (Shared)

- Top-level declarations are **visible to all scripts** in the document
- Acts like one large shared script

```javascript
// script1.js
function greet() {
  console.log('Hello');
}

// script2.js
greet(); // Can call function from script1.js
```

### Historical Quirks

**`var` and `function`**: Create properties on global object

```javascript
var x = 10;
function f() {}

console.log(window.x); // 10
console.log(window.f); // function
```

**`const`, `let`, `class`**: Shared but NOT on global object

```javascript
const PI = 3.14;
let count = 0;
class MyClass {}

console.log(window.PI); // undefined
console.log(PI); // 3.14 (still accessible)
```

---

## 9. Program Execution

A JavaScript program = all JavaScript code in/referenced from a document.

### Two-Phase Execution

#### Phase 1: Loading (Synchronous)

1. Document content loads
2. Scripts run in order (unless `async`/`defer`)
3. Code runs top-to-bottom
4. Functions/classes defined, event handlers registered

#### Phase 2: Event-Driven (Asynchronous)

1. User interactions trigger events
2. Event handlers execute in response
3. Network activity, timers trigger callbacks
4. Continues while document is displayed

### JavaScript Threading Model

**Single-threaded**: No concurrent execution

**Benefits**:

- No locks, deadlocks, or race conditions
- Simpler programming model
- Safe document manipulation

**Constraints**:

- Scripts must not run too long
- Long-running code freezes the UI
- Browser may appear unresponsive

**Solution**: Web Workers (§15.13) for background tasks

---

## 10. Execution Timeline

Detailed step-by-step execution:

1. **Browser creates Document**: `document.readyState = "loading"`

2. **Synchronous `<script>` tags**: Execute immediately, block parsing

   - Can use `document.write()`
   - See their own tag and prior content

3. **Async scripts**: Download in parallel, execute when ready

   - Cannot use `document.write()`
   - May not see all document content

4. **Document parsed**: `document.readyState = "interactive"`

5. **Deferred scripts and modules**: Execute in order

   - Have access to complete document
   - Cannot use `document.write()`

6. **DOMContentLoaded event**: Fired on Document

   - Marks transition to event-driven phase
   - Some async scripts may still be loading

7. **All content loaded**: `document.readyState = "complete"`

   - Images, CSS, all resources loaded
   - `load` event fires on Window

8. **Event-driven phase**: Handlers respond to user/network events

---

## 11. Program Input and Output

### Input Sources

**Document content**:

```javascript
let title = document.querySelector('h1').textContent;
```

**User events**:

```javascript
button.addEventListener('click', () => {
  console.log('Button clicked');
});
```

**URL information**:

```javascript
let url = new URL(document.URL);
console.log(url.pathname);
console.log(url.searchParams.get('id'));
```

**Cookies**:

```javascript
let cookies = document.cookie;
```

**Browser/system info**:

```javascript
navigator.userAgent; // Browser identifier
navigator.language; // User's language
navigator.hardwareConcurrency; // CPU cores
screen.width; // Screen width
screen.height; // Screen height
```

### Output Methods

**DOM manipulation**:

```javascript
document.querySelector('#output').textContent = 'Result: 42';
```

**Console (debugging only)**:

```javascript
console.log('Debug info');
console.error('Error message');
```

**Note**: Console output is only visible in developer tools, not to users.

---

## 12. Program Errors

### Uncaught Exceptions

Unlike standalone applications, web JavaScript doesn't "crash":

- Exceptions display in developer console
- Event handlers continue running
- Page remains functional

### Global Error Handler

```javascript
window.onerror = function (message, url, line) {
  console.error(`Error: ${message} at ${url}:${line}`);
  return true; // Prevents default error display
};
```

**Parameters**:

- `message`: Error description
- `url`: File where error occurred
- `line`: Line number

**Return `true`**: Suppress browser's error message

### Unhandled Promise Rejections

```javascript
window.onunhandledrejection = function (event) {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault(); // Suppress console error
};

// Or with addEventListener
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejected:', event.promise);
  console.error('Reason:', event.reason);
});
```

### Telemetry Use Case

Report client-side errors to server:

```javascript
window.onerror = function (message, url, line) {
  fetch('/log-error', {
    method: 'POST',
    body: JSON.stringify({ message, url, line }),
  });
  return true;
};
```

---

## 13. Web Security Model

Browsers balance two goals:

1. Powerful APIs for useful web apps
2. Protection against malicious code

### What JavaScript Can't Do

❌ **File system access**: Cannot read/write arbitrary files
❌ **General networking**: No raw sockets (only HTTP/WebSockets)
❌ **System commands**: Cannot execute OS-level programs
❌ **Data persistence without permission**: Limited storage access

### Same-Origin Policy

**Origin** = Protocol + Host + Port

```text
https://example.com:443/page.html  → Origin: https://example.com:443
http://example.com:80/page.html    → Different origin (http vs https)
https://api.example.com:443/data   → Different origin (different host)
```

**Rules**:

- Scripts can only access documents with the **same origin**
- Prevents cross-site data theft
- Applies to `<iframe>` content and HTTP requests

**Example**:

```javascript
// On https://site-a.com
let iframe = document.querySelector('iframe');

// Can access if iframe loads https://site-a.com/page.html
iframe.contentDocument.body;

// CANNOT access if iframe loads https://site-b.com/page.html
// SecurityError: Blocked a frame with origin...
```

### Relaxing Same-Origin Policy

#### 1. document.domain (for subdomains)

```javascript
// On https://orders.example.com
document.domain = 'example.com';

// On https://billing.example.com
document.domain = 'example.com';

// Now they can access each other
```

**Limitations**: Can only set to domain suffix

#### 2. CORS (Cross-Origin Resource Sharing)

Servers explicitly allow cross-origin requests:

```http
Access-Control-Allow-Origin: https://trusted-site.com
Access-Control-Allow-Origin: *
```

Browsers honor these headers and allow access.

### Cross-Site Scripting (XSS)

**Definition**: Injecting malicious code into a trusted website

**Vulnerable code**:

```javascript
let name = new URL(document.URL).searchParams.get('name');
document.querySelector('h1').innerHTML = 'Hello ' + name;
```

**Attack URL**:

```text
http://example.com/greet.html?name=<img src="x" onload="alert('hacked')">
```

**Result**: Executes arbitrary JavaScript

**Prevention: Sanitize input**

```javascript
name = name
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#x27;')
  .replace(/\//g, '&#x2F;');
```

**Alternative**: Use sandboxed `<iframe>`:

```html
<iframe sandbox src="untrusted.html"></iframe>
```

---

## Key Concepts Summary

✅ **`<script>` tags** embed or reference JavaScript in HTML
✅ **External scripts** improve maintainability and performance
✅ **Modules** use `type="module"` for isolated scope
✅ **`defer`** runs scripts after parsing, **`async`** runs ASAP
✅ **DOM** represents HTML as a tree of objects
✅ **Global object** (`window`) is shared across all scripts in a document
✅ **Non-module scripts share namespace**, modules are isolated
✅ **Two-phase execution**: Loading (synchronous) → Event-driven (asynchronous)
✅ **Single-threaded** model prevents race conditions
✅ **Input sources**: DOM, events, URL, cookies, navigator
✅ **Output**: DOM manipulation, console (debugging only)
✅ **Error handlers**: `window.onerror`, `window.onunhandledrejection`
✅ **Same-origin policy** prevents cross-site data access
✅ **XSS attacks** prevented by sanitizing untrusted input
✅ **Security balance**: Powerful APIs vs. protection from malicious code
