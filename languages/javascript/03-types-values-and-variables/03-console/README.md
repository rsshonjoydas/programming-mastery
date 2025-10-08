# JavaScript Console

## What is the JavaScript Console?

The **JavaScript Console** is a built-in developer tool in web browsers that allows developers to:

- Execute JavaScript code in real-time
- Display messages, errors, and warnings
- Debug and test code
- Inspect variables and objects
- Monitor performance and track execution time

---

## How to Access the Console

### All Browsers - Keyboard Shortcuts

| Browser     | Windows/Linux               | Mac                |
| ----------- | --------------------------- | ------------------ |
| **Chrome**  | `F12` or `Ctrl + Shift + J` | `Cmd + Option + J` |
| **Firefox** | `F12` or `Ctrl + Shift + K` | `Cmd + Option + K` |
| **Edge**    | `F12` or `Ctrl + Shift + J` | `Cmd + Option + J` |
| **Safari**  | Enable Dev Tools first\*    | `Cmd + Option + C` |
| **Opera**   | `Ctrl + Shift + I`          | `Cmd + Option + I` |

**Safari Setup:** Preferences → Advanced → Check "Show Develop menu in menu bar"

### Alternative Methods

```text
Right-click anywhere on page → Inspect → Console tab
Browser Menu → More Tools → Developer Tools → Console
```

---

## Console Object Methods - Complete Reference

### 1. `console.log()` - Standard Output ✅

**Most commonly used method for general logging**

```javascript
// Basic usage
console.log('Hello World!');

// Multiple values
console.log('Name:', 'John', 'Age:', 30);
// Output: Name: John Age: 30

// Variables
let x = 10,
  y = 20;
console.log('x =', x, 'y =', y);
// Output: x = 10 y = 20

// Objects
let user = { name: 'Alice', age: 25 };
console.log(user);
// Output: { name: "Alice", age: 25 }

// Arrays
let numbers = [1, 2, 3, 4, 5];
console.log(numbers);
// Output: [1, 2, 3, 4, 5]

// Expressions
console.log('Sum:', 5 + 10);
// Output: Sum: 15

// Template literals
let name = 'Bob';
console.log(`Hello, ${name}!`);
// Output: Hello, Bob!
```

---

### 2. `console.error()` - Error Messages ❌

**Display error messages in red**

```javascript
console.error('This is an error!');
// Output: ❌ This is an error! (in red)

console.error('Error:', 'File not found');
console.error('Status code:', 404);

// With error object
try {
  throw new Error('Something went wrong');
} catch (e) {
  console.error('Caught error:', e);
}
```

**Appearance:** Red text with error icon, includes stack trace

---

### 3. `console.warn()` - Warning Messages ⚠️

**Display warning messages in yellow**

```javascript
console.warn('This is a warning!');
// Output: ⚠️ This is a warning! (in yellow)

console.warn('Deprecated function used');
console.warn('Memory usage high:', '85%');

// Conditional warnings
let age = 17;
if (age < 18) {
  console.warn('User is underage');
}
```

**Appearance:** Yellow text with warning icon

---

### 4. `console.info()` - Informational Messages ℹ️

**Display informational messages**

```javascript
console.info('This is informational');
// Output: ℹ️ This is informational (in blue)

console.info('App version:', '1.2.3');
console.info('API endpoint:', 'https://api.example.com');
```

**Appearance:** Blue text with info icon (browser-dependent)

---

### 5. `console.debug()` - Debug Messages 🐛

**Display debug-level messages**

```javascript
console.debug('Debug mode enabled');
console.debug('Variable value:', someVar);
console.debug('Function called with:', arguments);
```

**Note:** May be hidden by default in some browsers (check console filter settings)

---

### 6. `console.table()` - Display Data as Table 📊

**Format arrays and objects as interactive tables**

```javascript
// Array of objects
let users = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Alice', age: 25, city: 'London' },
  { name: 'Bob', age: 35, city: 'Paris' },
];
console.table(users);
```

**Output:**

```text
┌─────────┬─────────┬─────┬────────────┐
│ (index) │  name   │ age │    city    │
├─────────┼─────────┼─────┼────────────┤
│    0    │ 'John'  │ 30  │ 'New York' │
│    1    │ 'Alice' │ 25  │ 'London'   │
│    2    │ 'Bob'   │ 35  │ 'Paris'    │
└─────────┴─────────┴─────┴────────────┘
```

```javascript
// Simple array
let fruits = ['Apple', 'Banana', 'Orange'];
console.table(fruits);

// Object
let person = { name: 'John', age: 30, job: 'Developer' };
console.table(person);

// Select specific columns
console.table(users, ['name', 'city']);
```

**Benefits:**

- Easy to read structured data
- Sortable columns (click headers)
- Collapsible/expandable

---

### 7. `console.clear()` - Clear Console 🧹

**Clear all console output**

```javascript
console.log('Message 1');
console.log('Message 2');
console.clear();
// Console is now empty

console.log('Fresh start!');
```

**Shortcut:** `Ctrl + L` or `Cmd + K`

---

### 8. `console.group()` / `console.groupEnd()` - Group Messages 📁

**Organize related messages in collapsible groups**

```javascript
console.group('User Details');
console.log('Name: John Doe');
console.log('Age: 30');
console.log('Email: john@example.com');
console.groupEnd();

console.group('Address');
console.log('Street: 123 Main St');
console.log('City: New York');
console.groupEnd();
```

**Output:**

```text
▼ User Details
    Name: John Doe
    Age: 30
    Email: john@example.com
▼ Address
    Street: 123 Main St
    City: New York
```

#### Nested Groups

```javascript
console.group('Outer Group');
console.log('Level 1');

console.group('Inner Group');
console.log('Level 2');

console.group('Deeper Group');
console.log('Level 3');
console.groupEnd();

console.groupEnd();
console.groupEnd();
```

---

### 9. `console.groupCollapsed()` - Collapsed Group by Default

**Same as `console.group()` but starts collapsed**

```javascript
console.groupCollapsed('Optional Details');
console.log('This is hidden by default');
console.log('Click to expand');
console.groupEnd();
```

**Use case:** Hide verbose logging that's rarely needed

---

### 10. `console.time()` / `console.timeEnd()` - Measure Execution Time ⏱️

**Track how long operations take**

```javascript
console.time('Loop Timer');

for (let i = 0; i < 1000000; i++) {
  // Some operation
}

console.timeEnd('Loop Timer');
// Output: Loop Timer: 15.234ms
```

#### Multiple Timers

```javascript
console.time('API Call');
console.time('Data Processing');

// API call simulation
setTimeout(() => {
  console.timeEnd('API Call');
  // Output: API Call: 1002.456ms
}, 1000);

// Some processing
for (let i = 0; i < 1000; i++) {
  // process data
}
console.timeEnd('Data Processing');
// Output: Data Processing: 2.345ms
```

#### Nested Timing

```javascript
console.time('Total');
console.time('Step 1');
// do something
console.timeEnd('Step 1');

console.time('Step 2');
// do something else
console.timeEnd('Step 2');
console.timeEnd('Total');
```

---

### 11. `console.timeLog()` - Log Intermediate Time

**Check elapsed time without stopping timer**

```javascript
console.time('Process');

// Step 1
console.timeLog('Process', 'Step 1 complete');
// Output: Process: 123.456ms Step 1 complete

// Step 2
console.timeLog('Process', 'Step 2 complete');
// Output: Process: 456.789ms Step 2 complete

console.timeEnd('Process');
// Output: Process: 789.012ms
```

---

### 12. `console.count()` - Count Function Calls 🔢

**Track how many times code is executed**

```javascript
function greet(name) {
  console.count('greet called');
  return `Hello, ${name}`;
}

greet('Alice'); // Output: greet called: 1
greet('Bob'); // Output: greet called: 2
greet('Charlie'); // Output: greet called: 3
```

#### With Labels

```javascript
function processData(type) {
  console.count(type);
}

processData('user'); // Output: user: 1
processData('admin'); // Output: admin: 1
processData('user'); // Output: user: 2
processData('user'); // Output: user: 3
processData('admin'); // Output: admin: 2
```

---

### 13. `console.countReset()` - Reset Counter

**Reset specific counter to zero**

```javascript
console.count('clicks'); // clicks: 1
console.count('clicks'); // clicks: 2
console.count('clicks'); // clicks: 3

console.countReset('clicks');

console.count('clicks'); // clicks: 1
```

---

### 14. `console.assert()` - Conditional Error 🧪

**Log error only if condition is false**

```javascript
let age = 15;
console.assert(age >= 18, 'User must be 18 or older');
// Output: Assertion failed: User must be 18 or older

let age2 = 20;
console.assert(age2 >= 18, 'User must be 18 or older');
// No output (assertion passed)
```

#### With Objects

```javascript
let user = { name: 'John', age: 25 };
console.assert(user.age >= 18, 'Invalid user', user);
// No output

let user2 = { name: 'Bob', age: 15 };
console.assert(user2.age >= 18, 'Invalid user', user2);
// Output: Assertion failed: Invalid user {name: "Bob", age: 15}
```

**Use case:** Validate assumptions during development

---

### 15. `console.trace()` - Stack Trace 🔍

**Display the call stack**

```javascript
function func3() {
  console.trace('Trace from func3');
}

function func2() {
  func3();
}

function func1() {
  func2();
}

func1();
```

**Output:**

```text
Trace from func3
    func3 @ script.js:2
    func2 @ script.js:6
    func1 @ script.js:10
    (anonymous) @ script.js:13
```

**Use case:** Track function call hierarchy, debug recursion

---

### 16. `console.dir()` - Object Properties 📋

**Display object properties in interactive list**

```javascript
let element = document.getElementById('myDiv');

console.log(element); // Shows DOM representation
console.dir(element); // Shows object properties
```

```javascript
let obj = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
  hobbies: ['reading', 'coding'],
};

console.dir(obj);
// Interactive tree view of all properties
```

**Difference from `console.log()`:**

- `log()` - Shows string representation
- `dir()` - Shows object properties as interactive list

---

### 17. `console.dirxml()` - DOM Tree

**Display XML/HTML element tree**

```javascript
let element = document.body;
console.dirxml(element);
// Shows HTML structure as tree
```

**Use case:** Inspect DOM structure

---

### 18. `console.profile()` / `console.profileEnd()` - Performance Profiling 📈

**Start/stop JavaScript profiler (browser-specific)**

```javascript
console.profile('My Profile');

// Code to profile
for (let i = 0; i < 100000; i++) {
  // operations
}

console.profileEnd('My Profile');
// Creates performance profile in browser dev tools
```

**Note:** Not available in all browsers, check Performance tab

---

### 19. `console.memory` - Memory Usage 💾

**Display memory usage (Chrome only)**

```javascript
console.log(console.memory);
// Output: MemoryInfo {
//   jsHeapSizeLimit: 2172649472,
//   totalJSHeapSize: 10000000,
//   usedJSHeapSize: 5000000
// }
```

**Properties:**

- `jsHeapSizeLimit` - Maximum heap size
- `totalJSHeapSize` - Total allocated heap
- `usedJSHeapSize` - Currently used heap

---

## Advanced Console Techniques

### 1. String Substitution & Formatting 🎨

#### %s - String

```javascript
console.log('Hello, %s!', 'World');
// Output: Hello, World!

let name = 'Alice';
console.log('User: %s', name);
// Output: User: Alice
```

#### %d or %i - Integer

```javascript
console.log('Count: %d', 42);
// Output: Count: 42

console.log('Age: %i, Year: %i', 25, 2024);
// Output: Age: 25, Year: 2024
```

#### %f - Float

```javascript
console.log('Price: $%f', 19.99);
// Output: Price: $19.99

console.log('Pi: %.2f', Math.PI);
// Output: Pi: 3.14 (2 decimal places)
```

#### %o - Object

```javascript
let user = { name: 'John', age: 30 };
console.log('User object: %o', user);
// Output: User object: {name: "John", age: 30}
```

#### %O - Object (expanded)

```javascript
console.log('User details: %O', user);
// Shows fully expanded object
```

#### %c - CSS Styling

```javascript
console.log('%cStyled Text', 'color: blue; font-size: 20px;');
// Output: Styled Text (blue, 20px)

console.log(
  '%cError: %cFile not found',
  'color: red; font-weight: bold;',
  'color: orange;'
);
// Different styles for different parts
```

---

### 2. CSS Styling Examples 🎨

#### Basic Styling

```javascript
console.log(
  '%cHello World!',
  'color: white; background-color: blue; padding: 5px; border-radius: 3px;'
);
```

#### Multiple Styles

```javascript
console.log(
  '%cSuccess!%c Operation completed',
  'color: green; font-weight: bold; font-size: 16px;',
  'color: gray; font-size: 12px;'
);
```

#### Complex Banner

```javascript
console.log(
  '%c MY APP v1.0 ',
  'color: white; background: linear-gradient(to right, #ff0000, #ff7700); font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
);
```

#### ASCII Art with Styles

```javascript
console.log(
  '%c' +
    `
  ╔═══════════════════╗
  ║   WELCOME USER!   ║
  ╚═══════════════════╝
`,
  'color: cyan; font-family: monospace;'
);
```

#### Rainbow Text

```javascript
console.log(
  '%cR%cA%cI%cN%cB%cO%cW',
  'color: red',
  'color: orange',
  'color: yellow',
  'color: green',
  'color: blue',
  'color: indigo',
  'color: violet'
);
```

---

### 3. Console Tables with Specific Columns

```javascript
let employees = [
  { id: 1, name: 'John', dept: 'IT', salary: 50000 },
  { id: 2, name: 'Alice', dept: 'HR', salary: 45000 },
  { id: 3, name: 'Bob', dept: 'Sales', salary: 55000 },
];

// Show only name and salary
console.table(employees, ['name', 'salary']);
```

---

### 4. Conditional Logging

```javascript
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

log('This only appears in debug mode');
```

---

### 5. Custom Console Object

```javascript
const myConsole = {
  success: (msg) =>
    console.log(`%c✓ ${msg}`, 'color: green; font-weight: bold;'),
  error: (msg) => console.log(`%c✗ ${msg}`, 'color: red; font-weight: bold;'),
  info: (msg) => console.log(`%cℹ ${msg}`, 'color: blue;'),
  debug: (msg) => console.log(`%c🐛 ${msg}`, 'color: purple;'),
};

myConsole.success('Login successful');
myConsole.error('Failed to load data');
myConsole.info('New update available');
myConsole.debug('Variable x = 10');
```

---

## Console Commands (Browser Console Only)

### Special Console Variables

#### `$_` - Last Evaluated Expression

```javascript
5 + 5;
// 10
$_;
// 10
$_ * 2;
// 20
```

#### `$0` to `$4` - Recently Inspected Elements

```javascript
$0; // Last inspected element in Elements tab
$1; // Second-to-last inspected element
$2; // Third-to-last
// ... up to $4
```

#### `$()` - Query Selector (like jQuery)

```javascript
$('#myId'); // Same as document.querySelector('#myId')
$$('.myClass'); // Same as document.querySelectorAll('.myClass')
```

#### `$x()` - XPath Query

```javascript
$x('//div'); // Get all div elements using XPath
```

### Console Commands

#### `copy()` - Copy to Clipboard

```javascript
let data = { name: 'John', age: 30 };
copy(data);
// Copies JSON to clipboard
```

#### `keys()` / `values()` - Object Keys/Values

```javascript
let obj = { a: 1, b: 2, c: 3 };
keys(obj); // ["a", "b", "c"]
values(obj); // [1, 2, 3]
```

#### `monitor()` / `unmonitor()` - Monitor Function Calls

```javascript
function greet(name) {
  return `Hello, ${name}`;
}

monitor(greet);
greet('Alice');
// Output: function greet called with arguments: Alice

unmonitor(greet);
```

#### `monitorEvents()` / `unmonitorEvents()` - Monitor DOM Events

```javascript
let button = document.querySelector('button');

monitorEvents(button, 'click');
// Logs every click event on button

unmonitorEvents(button);
// Stops monitoring
```

#### `debug()` / `undebug()` - Set Breakpoint on Function

```javascript
function calculate() {
  return 5 + 5;
}

debug(calculate);
calculate(); // Debugger pauses here

undebug(calculate);
```

#### `clear()` - Clear Console

```javascript
clear(); // Same as console.clear()
```

#### `dir()` - List Object Properties

```javascript
dir(document); // Same as console.dir(document)
```

#### `table()` - Display as Table

```javascript
table([{ a: 1 }, { a: 2 }]); // Same as console.table()
```

---

## Console Filtering & Settings

### Filter by Type

Most browsers allow filtering console output:

- All
- Errors
- Warnings
- Info
- Logs
- Debug
- Verbose

### Filter by Text

```text
Search box in console
Filter: "user"  → Shows only messages containing "user"
```

### Preserve Log

✅ Check "Preserve log" to keep console output across page reloads

### Show Timestamps

✅ Enable timestamps to see when each message was logged

### Group Similar Messages

Some browsers group identical messages:

```text
console.log("test");  // Repeated 10 times
Output: test (10) ← Click to expand
```

---

## Real-World Use Cases

### 1. Debugging API Calls

```javascript
console.group('API Call: /users');
console.time('Request Time');

fetch('/api/users')
  .then((response) => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then((data) => {
    console.table(data);
    console.timeEnd('Request Time');
  })
  .catch((error) => {
    console.error('API Error:', error);
  })
  .finally(() => {
    console.groupEnd();
  });
```

### 2. Form Validation Debugging

```javascript
function validateForm(data) {
  console.group('Form Validation');

  console.assert(data.name, 'Name is required', data);
  console.assert(data.email.includes('@'), 'Invalid email', data);
  console.assert(data.age >= 18, 'Must be 18+', data);

  if (data.name && data.email.includes('@') && data.age >= 18) {
    console.log('%c✓ Validation passed', 'color: green; font-weight: bold;');
  } else {
    console.error('%c✗ Validation failed', 'color: red; font-weight: bold;');
  }

  console.groupEnd();
}
```

### 3. Performance Monitoring

```javascript
console.time('Page Load');

window.addEventListener('load', () => {
  console.timeEnd('Page Load');
  console.log('Memory:', console.memory);

  console.table([
    { metric: 'DOM Nodes', value: document.querySelectorAll('*').length },
    { metric: 'Images', value: document.images.length },
    { metric: 'Scripts', value: document.scripts.length },
  ]);
});
```

### 4. Event Tracking

```javascript
let clickCount = 0;

document.addEventListener('click', (e) => {
  console.count('Clicks');
  console.log('Clicked element:', e.target);
  console.trace('Click origin');
});
```

### 5. State Management Debugging

```javascript
class Store {
  constructor() {
    this.state = {};
  }

  setState(newState) {
    console.group('State Update');
    console.log('Previous state:', this.state);
    console.log('New state:', newState);

    this.state = { ...this.state, ...newState };

    console.log('Updated state:', this.state);
    console.groupEnd();
  }
}
```

---

## Console Best Practices

### ✅ DO

1. **Use appropriate log levels**

   ```javascript
   console.log('Normal info');
   console.warn('Something unusual');
   console.error('Critical issue');
   ```

2. **Use descriptive labels**

   ```javascript
   console.log('User data:', userData); // Good
   console.log(userData); // Less clear
   ```

3. **Group related logs**

   ```javascript
   console.group('User Login');
   console.log('Username:', username);
   console.log('Timestamp:', new Date());
   console.groupEnd();
   ```

4. **Remove console logs in production**

   ```javascript
   // Use build tools or:
   if (process.env.NODE_ENV !== 'production') {
     console.log('Debug info');
   }
   ```

5. **Use console.table for arrays/objects**

   ```javascript
   console.table(users); // Better than console.log(users)
   ```

### ❌ DON'T

1. **Leave sensitive data in logs**

   ```javascript
   console.log('Password:', password); // ❌ Never log passwords
   console.log('API Key:', apiKey); // ❌ Never log secrets
   ```

2. **Over-log in loops**

   ```javascript
   for (let i = 0; i < 10000; i++) {
     console.log(i); // ❌ Slows down browser
   }
   ```

3. **Use only console.log**

   ```javascript
   console.log('ERROR'); // ❌ Use console.error()
   ```

4. **Forget to remove debug logs**

   ```javascript
   console.log('Testing 123'); // ❌ Remove before production
   ```

---

## Console Method Summary Table

| Method             | Purpose           | Output Style              | Common Use        |
| ------------------ | ----------------- | ------------------------- | ----------------- |
| `log()`            | General output    | Normal text               | Standard logging  |
| `error()`          | Errors            | Red text                  | Error messages    |
| `warn()`           | Warnings          | Yellow text               | Warnings          |
| `info()`           | Information       | Blue text (some browsers) | Info messages     |
| `debug()`          | Debug messages    | Normal (may be hidden)    | Debug info        |
| `table()`          | Tabular data      | Interactive table         | Arrays/objects    |
| `clear()`          | Clear console     | -                         | Clean slate       |
| `group()`          | Group messages    | Collapsible group         | Organization      |
| `groupCollapsed()` | Collapsed group   | Collapsed by default      | Optional details  |
| `time()`           | Start timer       | -                         | Performance       |
| `timeEnd()`        | End timer         | Elapsed time              | Performance       |
| `timeLog()`        | Checkpoint        | Elapsed time              | Progress tracking |
| `count()`          | Count calls       | Counter                   | Call frequency    |
| `countReset()`     | Reset counter     | -                         | Reset tracking    |
| `assert()`         | Conditional error | Error if false            | Validation        |
| `trace()`          | Stack trace       | Call stack                | Debug flow        |
| `dir()`            | Object properties | Interactive list          | Object inspection |
| `dirxml()`         | DOM tree          | XML/HTML tree             | DOM inspection    |

---

## Quick Reference Card

```javascript
// Basic Logging
console.log('message'); // Standard
console.error('error'); // Red
console.warn('warning'); // Yellow
console.info('info'); // Blue

// Data Display
console.table(array); // Table format
console.dir(object); // Object tree

// Organization
console.group('label'); // Start group
console.groupEnd(); // End group
console.clear(); // Clear all

// Performance
console.time('label'); // Start timer
console.timeEnd('label'); // End timer

// Tracking
console.count('label'); // Count calls
console.trace(); // Stack trace

// Validation
console.assert(condition, msg); // Conditional error

// Styling
console.log('%cStyled', 'css'); // Apply CSS
```

---

## Keyboard Shortcuts

| Action           | Windows/Linux      | Mac                |
| ---------------- | ------------------ | ------------------ |
| Open Console     | `Ctrl + Shift + J` | `Cmd + Option + J` |
| Clear Console    | `Ctrl + L`         | `Cmd + K`          |
| Previous Command | `↑`                | `↑`                |
| Next Command     | `↓`                | `↓`                |
| Multi-line       | `Shift + Enter`    | `Shift + Enter`    |
| Execute          | `Enter`            | `Enter`            |
| Autocomplete     | `Tab`              | `Tab`              |

---

**Key Takeaway:** The console is your best friend for JavaScript debugging. Master `console.log()`, `console.table()`, `console.time()`, and `console.group()` first, then explore advanced features as needed. Always remove console logs before production deployment!
