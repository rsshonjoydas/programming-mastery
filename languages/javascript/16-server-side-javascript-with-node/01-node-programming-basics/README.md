# Node Programming Basics

Node.js extends JavaScript beyond the browser, enabling server-side programming and system-level operations. Here's everything you need to know to get started.

---

## 1. Console Output

### Basic Output

In Node, `console.log()` is **not just for debugging**—it's the standard way to display output to users via the **stdout stream**.

```javascript
console.log('Hello World!');
```

### Output Streams

Node provides three console methods that write to different streams:

| Method            | Stream     | Use Case              |
| ----------------- | ---------- | --------------------- |
| `console.log()`   | **stdout** | Normal program output |
| `console.warn()`  | **stderr** | Warning messages      |
| `console.error()` | **stderr** | Error messages        |

**Key difference from browsers**:

- Browsers display icons to distinguish log types
- Node distinguishes them by **output stream** (stdout vs stderr)

### Why Use console.error()?

When stdout is redirected to a file or pipe, `console.error()` still displays to the terminal:

```bash
$ node app.js > output.txt
# console.log() output goes to output.txt
# console.error() output appears in terminal
```

---

## 2. Command-Line Arguments

### Accessing Arguments

Command-line arguments are available in the **`process.argv`** array:

```javascript
// argv.js
console.log(process.argv);
```

**Running the program**:

```bash
node argv.js --arg1 --arg2 filename
```

**Output**:

```javascript
[
  '/usr/local/bin/node', // [0] Path to Node executable
  '/tmp/argv.js', // [1] Path to JavaScript file
  '--arg1', // [2] First user argument
  '--arg2', // [3] Second user argument
  'filename', // [4] Third user argument
];
```

### Important Notes

✅ **Elements [0] and [1]** are always fully qualified paths (even if you typed relative paths)
✅ **Node-specific arguments** (like `--trace-uncaught`) are consumed by Node and don't appear in `process.argv`
✅ **User arguments** appear starting at index 2

### Parsing Arguments Example

```javascript
// Get only user arguments (skip node path and script path)
const args = process.argv.slice(2);

console.log('User arguments:', args);

// Simple argument parsing
const options = {};
args.forEach((arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value || true;
  }
});

console.log('Parsed options:', options);
```

---

## 3. Environment Variables

### Accessing Environment Variables

Environment variables are available through **`process.env`** object:

```javascript
console.log(process.env);
```

**Example output**:

```javascript
{
  SHELL: '/bin/bash',
  USER: 'david',
  PATH: '/usr/local/bin:/usr/bin:/bin',
  PWD: '/tmp',
  LANG: 'en_US.UTF-8',
  HOME: '/Users/david'
}
```

### Using Environment Variables

```javascript
// Access specific environment variable
const homeDir = process.env.HOME;
const username = process.env.USER;

// Provide default value if not set
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

console.log(`Server running on port ${port} in ${nodeEnv} mode`);
```

### Setting Environment Variables

**In terminal (Unix/Mac)**:

```bash
PORT=8080 NODE_ENV=production node app.js
```

**In terminal (Windows)**:

```cmd
> set PORT=8080
> set NODE_ENV=production
> node app.js
```

---

## 4. Program Life Cycle

### How Node Programs Run

1. Node executes JavaScript from **top to bottom**
2. Program continues running while:
   - Callbacks are pending
   - Event handlers are registered
   - Asynchronous operations are active
3. Program exits when:
   - All code executed
   - No more pending callbacks/events
   - `process.exit()` is called

### Example: Long-Running Program

```javascript
console.log('Program started');

// This keeps the program alive
setInterval(() => {
  console.log('Still running...');
}, 1000);

console.log('Initial code finished');
// Program continues running due to setInterval
```

### Exiting Programs

**Automatic exit**:

```javascript
console.log('This program exits immediately');
// No async operations, so Node exits
```

**Force exit**:

```javascript
process.exit(0); // Exit with success code
process.exit(1); // Exit with error code
```

### Handling Ctrl-C (SIGINT)

**Default behavior**: User presses Ctrl-C, program exits

**Custom behavior**:

```javascript
process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal');
  console.log('Cleaning up...');
  // Perform cleanup
  process.exit(0);
});

console.log('Press Ctrl-C to test signal handler');
setInterval(() => {}, 1000); // Keep alive
```

---

## 5. Exception Handling

### Uncaught Exceptions

**Default behavior**: Prints stack trace and exits

```javascript
throw new Error('Something went wrong!'); // Program crashes
```

**Global exception handler**:

```javascript
process.setUncaughtExceptionCaptureCallback((e) => {
  console.error('Uncaught exception:', e);
  // Program continues instead of crashing
});

// Now this won't crash the program
setTimeout(() => {
  throw new Error('Async error');
}, 1000);
```

### Unhandled Promise Rejections

**Current behavior** (Node 13+): Prints verbose error message, doesn't exit

**Future behavior**: Will become fatal and exit the program

**Global rejection handler**:

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise);
  console.error('Reason:', reason);
  // Handle the rejection
});

// This won't crash or print ugly messages
Promise.reject(new Error('Rejected!'));
```

---

## 6. Node Modules

Node supports **two module systems**:

### CommonJS Modules (Traditional)

```javascript
// Exporting
module.exports = { foo, bar };
exports.baz = function () {};

// Importing
const myModule = require('./myModule');
const { foo, bar } = require('./myModule');
```

### ES6 Modules (Modern)

```javascript
// Exporting
export const foo = 'value';
export function bar() {}
export default MyClass;

// Importing
import MyClass from './myModule.js';
import { foo, bar } from './myModule.js';
```

### Telling Node Which System to Use

Node needs to know **before loading** which module system a file uses.

#### Method 1: File Extensions

| Extension | Module Type                                     |
| --------- | ----------------------------------------------- |
| `.mjs`    | ES6 module (always)                             |
| `.cjs`    | CommonJS module (always)                        |
| `.js`     | Depends on package.json or defaults to CommonJS |

```javascript
// math.mjs (ES6 module)
export function add(a, b) {
  return a + b;
}

// utils.cjs (CommonJS module)
module.exports = { multiply: (a, b) => a * b };
```

#### Method 2: package.json Configuration

Create `package.json` with `type` property:

```json
{
  "type": "module"
}
```

**Options**:

- `"type": "module"` → `.js` files are ES6 modules
- `"type": "commonjs"` → `.js` files are CommonJS modules
- No `type` property → Defaults to CommonJS

### Module Interoperability

✅ **ES6 modules CAN import CommonJS modules**:

```javascript
// ES6 module
import express from 'express'; // express is CommonJS
```

❌ **CommonJS modules CANNOT import ES6 modules**:

```javascript
// CommonJS module
const myModule = require('./esModule.mjs'); // ERROR!
```

---

## 7. Node Package Manager (npm)

### What is npm?

**npm** is the Node Package Manager that:

- Downloads and installs libraries
- Manages project dependencies
- Tracks metadata in `package.json`

### Initializing a Project

```bash
npm init
```

Asks for project details and creates `package.json`:

```json
{
  "name": "my-server",
  "version": "1.0.0",
  "description": "My web server",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {}
}
```

### Installing Packages

**Install a package**:

```bash
npm install express
```

**What happens**:

1. Downloads Express and its dependencies
2. Saves packages to `node_modules/` directory
3. Records dependency in `package.json`
4. Creates `package-lock.json` (locks exact versions)

**Example output**:

```bash
$ npm install express
npm notice created a lockfile as package-lock.json.
+ express@4.17.1
added 50 packages from 37 contributors
```

**Updated package.json**:

```json
{
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

### Installing Dependencies from package.json

Share your code with others—they just run:

```bash
npm install
```

This automatically installs **all dependencies** listed in `package.json`.

### Common npm Commands

```bash
npm init              # Create package.json
npm install <package> # Install package locally
npm install -g <pkg>  # Install package globally
npm install           # Install all dependencies
npm uninstall <pkg>   # Remove package
npm update            # Update packages
npm list              # Show installed packages
npm run <script>      # Run script from package.json
```

---

## 8. Practical Node Program Structure

### Basic Server Example

```javascript
// server.js
console.log('Starting server...');

// Import dependencies
const http = require('http');
const port = process.env.PORT || 3000;

// Create server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

// Start listening
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

**Running it**:

```bash
$ PORT=8080 node server.js
Starting server...
Server running at http://localhost:8080/
```

---

## Key Concepts Summary

✅ **console.log()** writes to stdout (main output stream)
✅ **console.error()** writes to stderr (visible even when stdout is redirected)
✅ **process.argv** contains command-line arguments (indexes 0-1 are Node/file paths)
✅ **process.env** provides access to environment variables
✅ Programs run until all callbacks/events complete or `process.exit()` is called
✅ **SIGINT handler** allows custom Ctrl-C behavior
✅ **Uncaught exceptions** crash programs unless a global handler is set
✅ **Unhandled rejections** will eventually be fatal (use global handler)
✅ Node supports **CommonJS** (`.cjs`, `require()`) and **ES6 modules** (`.mjs`, `import`)
✅ **package.json** `type` property determines default module system
✅ **npm** manages dependencies and stores them in `node_modules/`
✅ **package.json** tracks dependencies for easy sharing and installation
