# JavaScript Console API

The **Console API** is a standardized set of functions for debugging and logging. It's supported by all modern browsers and Node.js, though it's **not part of ECMAScript**. The specification is maintained at <https://console.spec.whatwg.org>.

---

## Basic Output Functions

### console.log()

The most commonly used console function. Converts arguments to strings and outputs them.

```javascript
console.log('Hello, World!');
console.log('Name:', 'Alice', 'Age:', 30);
// Output: Name: Alice Age: 30
```

**Features**:

- Adds spaces between arguments
- Starts a new line after output
- Most versatile output function

### console.debug(), console.info(), console.warn(), console.error()

Nearly identical to `console.log()` but with different severity levels.

```javascript
console.debug('Debug message'); // Debug-level info
console.info('Info message'); // Informational
console.warn('Warning message'); // Warning level
console.error('Error message'); // Error level
```

**Differences**:

**In browsers**:

- Each may display with different icons/colors
- Can be filtered by level in developer tools
- Helps categorize log messages

**In Node.js**:

- `console.error()` outputs to **stderr** stream
- Others output to **stdout** stream
- `console.debug()`, `console.info()`, `console.warn()` are aliases of `console.log()`

---

## Assertions

### console.assert()

Logs an error message only if the assertion **fails** (first argument is falsy).

```javascript
console.assert(value > 0, 'Value must be positive');
// Logs error only if value <= 0

console.assert(user !== null, 'User is null', user);
// Logs "Assertion failed: User is null" if user is null
```

**Key points**:

- Does **not throw an exception** (unlike typical assert functions)
- If first argument is truthy, does nothing
- If first argument is falsy, logs remaining arguments with "Assertion failed" prefix

---

## Console Management

### console.clear()

Clears the console when possible.

```javascript
console.clear();
```

**Behavior**:

- **Browsers**: Clears the developer console
- **Node (terminal)**: Clears the terminal screen
- **Node (redirected)**: No effect if output is piped/redirected to a file

---

## Tabular Output

### console.table()

Displays data in **tabular format** - extremely useful for arrays of objects.

```javascript
let users = [
  { name: 'Alice', age: 30, role: 'Admin' },
  { name: 'Bob', age: 25, role: 'User' },
  { name: 'Charlie', age: 35, role: 'Manager' },
];

console.table(users);
```

**Output** (in table format):

```text
┌─────────┬──────────┬─────┬───────────┐
│ (index) │   name   │ age │   role    │
├─────────┼──────────┼─────┼───────────┤
│    0    │ 'Alice'  │ 30  │  'Admin'  │
│    1    │  'Bob'   │ 25  │  'User'   │
│    2    │'Charlie' │ 35  │ 'Manager' │
└─────────┴──────────┴─────┴───────────┘
```

**Advanced usage**:

```javascript
// Specify columns to display
console.table(users, ['name', 'role']);

// Display object properties
let obj = { name: 'Alice', age: 30 };
console.table(obj);
// Creates table with "property name" and "value" columns
```

**Best for**:

- Arrays of objects with consistent properties
- Relatively small datasets
- Quick data visualization in logs

---

## Stack Traces

### console.trace()

Logs arguments like `console.log()` **plus a stack trace**.

```javascript
function foo() {
  function bar() {
    console.trace('Trace from bar');
  }
  bar();
}
foo();
```

**Output includes**:

- The logged message
- Full call stack showing function calls leading to this point

**In Node.js**: Output goes to **stderr** instead of stdout

---

## Counters

### console.count()

Logs a label and the number of times it's been called with that label.

```javascript
function processItem(item) {
  console.count('processItem called');
  // Process item...
}

processItem('a'); // processItem called: 1
processItem('b'); // processItem called: 2
processItem('c'); // processItem called: 3
```

**Use cases**:

- Tracking event handler calls
- Counting loop iterations
- Debugging function execution frequency

### console.countReset()

Resets the counter for a specific label.

```javascript
console.count('clicks'); // clicks: 1
console.count('clicks'); // clicks: 2
console.countReset('clicks');
console.count('clicks'); // clicks: 1
```

---

## Grouping Messages

### console.group()

Groups related messages with indentation.

```javascript
console.group('User Details');
console.log('Name: Alice');
console.log('Age: 30');
console.log('Role: Admin');
console.groupEnd();
```

**Output**:

```text
User Details
  Name: Alice
  Age: 30
  Role: Admin
```

**In browsers**: Groups can be collapsed/expanded interactively

### console.groupCollapsed()

Same as `console.group()` but starts **collapsed** in browsers.

```javascript
console.groupCollapsed('Hidden Details');
console.log('This is hidden by default');
console.log('User must click to expand');
console.groupEnd();
```

**In Node.js**: Synonym for `console.group()` (no collapse behavior)

### console.groupEnd()

Ends the most recent group.

```javascript
console.group('Outer');
console.log('Outer message');
console.group('Inner');
console.log('Inner message');
console.groupEnd(); // Ends Inner group
console.log('Back to outer');
console.groupEnd(); // Ends Outer group
```

---

## Timing Functions

### console.time()

Starts a timer with a given label.

```javascript
console.time('DataProcessing');
// ... some operations ...
```

### console.timeLog()

Logs the elapsed time since `console.time()` was called, **without stopping the timer**.

```javascript
console.time('Operation');
// ... step 1 ...
console.timeLog('Operation', 'Step 1 complete');
// ... step 2 ...
console.timeLog('Operation', 'Step 2 complete');
console.timeEnd('Operation');
```

**Output**:

```text
Operation: 125ms Step 1 complete
Operation: 247ms Step 2 complete
Operation: 350ms
```

### console.timeEnd()

Stops the timer and logs the final elapsed time.

```javascript
console.time('FetchData');
fetchData().then(() => {
  console.timeEnd('FetchData');
  // Output: FetchData: 1234ms
});
```

**Note**: After `timeEnd()`, you must call `time()` again before using `timeLog()`.

---

## Formatted Output

Console functions support **format strings** with special sequences starting with `%`.

### Format Specifiers

| Specifier    | Description            | Example                                      |
| ------------ | ---------------------- | -------------------------------------------- |
| `%s`         | String                 | `console.log("Hello %s", "World")`           |
| `%i` or `%d` | Integer                | `console.log("Count: %d", 42.7)` → Count: 42 |
| `%f`         | Float                  | `console.log("Price: %f", 19.99)`            |
| `%o`         | Object                 | `console.log("User: %o", userObj)`           |
| `%O`         | Object (detailed)      | `console.log("Data: %O", data)`              |
| `%c`         | CSS styling (browsers) | `console.log("%cStyled", "color: blue")`     |

### Examples

**String substitution**:

```javascript
let name = 'Alice';
let age = 30;
console.log('Name: %s, Age: %d', name, age);
// Output: Name: Alice, Age: 30
```

**Number formatting**:

```javascript
console.log('Integer: %i', 42.7); // Integer: 42
console.log('Float: %f', 3.14159); // Float: 3.14159
```

**Object display**:

```javascript
let user = { name: 'Bob', age: 25 };
console.log('User data: %o', user);
// Displays object with interactive exploration in browsers
```

**CSS styling (browsers only)**:

```javascript
console.log(
  '%cSuccess!%c Error!',
  'color: green; font-weight: bold;',
  'color: red; font-weight: bold;'
);
// "Success!" in green, "Error!" in red
```

**Multiple substitutions**:

```javascript
console.log('%s is %d years old and works as a %s', 'Alice', 30, 'Developer');
// Output: Alice is 30 years old and works as a Developer
```

### When to Use Format Strings

**Usually not necessary**! Modern console implementations handle multiple arguments well:

```javascript
// Both produce similar output
console.log('Name:', name, 'Age:', age);
console.log('Name: %s, Age: %d', name, age);
```

**Automatic features**:

- Error objects print with stack traces
- Objects display with interactive exploration
- Arrays show all elements

---

## Browser vs Node.js Differences

| Feature                 | Browsers            | Node.js          |
| ----------------------- | ------------------- | ---------------- |
| **Output destination**  | Developer Console   | stdout/stderr    |
| **console.error()**     | Console (with icon) | stderr stream    |
| **Level filtering**     | ✅ Yes              | ❌ No            |
| **Interactive objects** | ✅ Yes (expandable) | Limited          |
| **CSS styling (%c)**    | ✅ Yes              | ❌ Ignored       |
| **Group collapsing**    | ✅ Yes              | ❌ No            |
| **console.clear()**     | ✅ Always works     | Only in terminal |

---

## Best Practices

✅ **Use appropriate log levels** (debug, info, warn, error) for filtering
✅ **Use `console.table()`** for arrays of objects
✅ **Use `console.group()`** to organize related messages
✅ **Use `console.time()`** for performance measurement
✅ **Use `console.assert()`** for quick validation checks
✅ **Remove console calls** or use a build tool to strip them in production
✅ **Leverage automatic formatting** - avoid excessive format strings
✅ **Use `console.trace()`** to understand execution flow

---

## Common Use Cases

### Debugging

```javascript
console.log('Current value:', value);
console.error('Failed to load:', error);
console.trace('How did we get here?');
```

### Performance Monitoring

```javascript
console.time('API Call');
await fetchData();
console.timeEnd('API Call');
```

### Data Inspection

```javascript
console.table(users);
console.log('User object:', user);
```

### Event Tracking

```javascript
button.addEventListener('click', () => {
  console.count('Button clicked');
});
```

### Organized Logging

```javascript
console.group('Processing User');
console.log('Validating...');
console.log('Saving...');
console.log('Complete!');
console.groupEnd();
```

---

## Key Concepts Summary

📌 **Console API is standardized** but not part of ECMAScript
📌 **console.log()** is the most basic and versatile function
📌 **Level functions** (debug, info, warn, error) help categorize messages
📌 **console.table()** creates readable tabular output
📌 **console.group()** organizes related messages with indentation
📌 **console.time()** measures performance between calls
📌 **console.count()** tracks how many times code executes
📌 **console.trace()** shows the call stack
📌 **Format strings** use `%s`, `%d`, `%o` etc. for substitution
📌 **Different behavior** between browsers and Node.js
📌 **Automatic formatting** often makes format strings unnecessary
