# JavaScript Server-Side with Node

## What is Node.js?

**Node.js** is a JavaScript runtime environment that allows you to run JavaScript outside the browser, on the server-side. It provides bindings to the underlying operating system, enabling JavaScript programs to interact with system resources.

### Core Capabilities

Node enables JavaScript to:

- **Read and write files** to the file system
- **Execute child processes** and system commands
- **Communicate over networks** (HTTP, TCP, UDP)
- **Access operating system features** directly

---

## Use Cases for Node

### 1. Modern Shell Scripting Alternative

Replace traditional bash/Unix shell scripts with JavaScript:

- More intuitive syntax than bash
- Better error handling
- Access to npm ecosystem
- Cross-platform compatibility

### 2. General-Purpose Programming

Run trusted server-side applications:

- Not subject to browser security restrictions
- Full access to system resources
- Can perform privileged operations
- Execute long-running processes

### 3. High-Performance Web Servers

Build efficient, scalable network applications:

- Handle thousands of concurrent connections
- Non-blocking I/O operations
- Event-driven architecture
- Ideal for real-time applications (chat, streaming, APIs)

---

## Node's Defining Features

### Single-Threaded Event-Based Concurrency

Node uses a **single-threaded event loop** with **asynchronous operations** as the default:

```javascript
// Traditional blocking code (not Node's way)
let data = readFileSync('file.txt'); // Blocks until complete
processData(data);

// Node's asynchronous way
readFile('file.txt', (err, data) => {
  if (err) throw err;
  processData(data);
});
// Code continues immediately, callback executes when ready
```

**Key characteristics**:

- Single JavaScript thread handles all requests
- I/O operations are non-blocking
- Callbacks/Promises execute when operations complete
- High concurrency without threads

### Asynchronous-by-Default API

Most Node APIs are asynchronous:

- File system operations
- Network requests
- Database queries
- Timers and delays

**Benefits**:

- Efficient use of system resources
- Can handle many simultaneous operations
- No thread management overhead

**Learning curve**:

- Different from synchronous programming
- Requires understanding callbacks, Promises, async/await
- Error handling works differently

---

## The Node Programming Model

### 1. Event Loop

Node runs on a single thread with an **event loop** that processes events and callbacks:

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

console.log('End');

// Output:
// Start
// End
// Timeout callback
```

**How it works**:

1. Execute synchronous code
2. Queue asynchronous operations
3. When operations complete, callbacks are added to event queue
4. Event loop processes queued callbacks

### 2. Callbacks

Traditional Node pattern for handling async operations:

```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File contents:', data);
});
```

**Callback pattern**:

- First parameter is always `err` (null if no error)
- Subsequent parameters contain results
- Must check for errors explicitly

### 3. Promises

Modern approach for cleaner async code:

```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
  .then((data) => console.log('File contents:', data))
  .catch((err) => console.error('Error:', err));
```

### 4. Async/Await

Syntactic sugar over Promises (most readable):

```javascript
const fs = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log('File contents:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

readFileAsync();
```

---

## Working with Streams

Streams handle data in chunks, ideal for large files or network data:

### Types of Streams

1. **Readable**: Read data from source (files, HTTP requests)
2. **Writable**: Write data to destination (files, HTTP responses)
3. **Duplex**: Both readable and writable (sockets)
4. **Transform**: Modify data while reading/writing (compression)

### Stream Example

```javascript
const fs = require('fs');

// Reading large file efficiently
const readStream = fs.createReadStream('large-file.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
});

readStream.on('end', () => {
  console.log('Finished reading file');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
```

### Piping Streams

```javascript
const fs = require('fs');
const zlib = require('zlib');

// Read file, compress it, write to new file
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.txt.gz'));
```

---

## The Buffer Type

**Buffers** handle binary data in Node (images, videos, encrypted data):

### Creating Buffers

```javascript
// From string
const buf1 = Buffer.from('Hello', 'utf8');

// Empty buffer of specific size
const buf2 = Buffer.alloc(10);

// From array of bytes
const buf3 = Buffer.from([72, 101, 108, 108, 111]);
```

### Working with Buffers

```javascript
const buf = Buffer.from('Hello World');

console.log(buf.length); // 11
console.log(buf.toString()); // 'Hello World'
console.log(buf.toString('hex')); // 48656c6c6f20576f726c64
console.log(buf[0]); // 72 (ASCII code for 'H')

// Modify buffer
buf[0] = 74; // Change 'H' to 'J'
console.log(buf.toString()); // 'Jello World'
```

### Buffer vs String

- **Buffers**: Fixed-size, mutable, binary data
- **Strings**: Immutable, text data, encoded

---

## Core Node APIs

### 1. File System (fs)

```javascript
const fs = require('fs');

// Read file (async)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello Node', (err) => {
  if (err) throw err;
  console.log('File written');
});

// Check if file exists
fs.access('file.txt', fs.constants.F_OK, (err) => {
  console.log(err ? 'File does not exist' : 'File exists');
});

// List directory contents
fs.readdir('./', (err, files) => {
  if (err) throw err;
  console.log('Files:', files);
});
```

### 2. HTTP/HTTPS (Network)

```javascript
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node server!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Make HTTP request
http.get('http://example.com', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
  });
});
```

### 3. Path Module

```javascript
const path = require('path');

console.log(path.join('/users', 'john', 'documents')); // /users/john/documents
console.log(path.basename('/users/john/file.txt')); // file.txt
console.log(path.extname('file.txt')); // .txt
console.log(path.dirname('/users/john/file.txt')); // /users/john
console.log(__dirname); // Current directory
console.log(__filename); // Current file path
```

### 4. Process Module

```javascript
// Command-line arguments
console.log(process.argv);

// Environment variables
console.log(process.env.PATH);

// Exit program
process.exit(0); // 0 = success, 1 = error

// Process events
process.on('exit', (code) => {
  console.log(`Exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
```

### 5. Child Processes

```javascript
const { exec, spawn } = require('child_process');

// Execute shell command
exec('ls -la', (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Output:', stdout);
});

// Spawn process with streaming I/O
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

ls.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
```

### 6. Events Module

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

// Register event listener
emitter.on('event', (data) => {
  console.log('Event occurred:', data);
});

// Emit event
emitter.emit('event', { message: 'Hello' });
```

### 7. Worker Threads

For CPU-intensive tasks, Node supports worker threads:

```javascript
const { Worker } = require('worker_threads');

// Create worker thread
const worker = new Worker('./worker.js');

worker.on('message', (msg) => {
  console.log('Message from worker:', msg);
});

worker.postMessage('Start working');
```

---

## Installation and Setup

### Installing Node

**Official website**: [https://nodejs.org](https://nodejs.org)

**Installation options**:

- **Windows/MacOS**: Download installer
- **Linux**: Use package manager or download binaries from [nodejs.org/en/download](https://nodejs.org/en/download)
- **Docker**: Official images at [hub.docker.com](https://hub.docker.com)

### What Gets Installed

1. **Node executable**: Runs JavaScript files
2. **npm (Node Package Manager)**: Install third-party packages
3. **Built-in modules**: No installation needed

### Running Node

```bash
# Run JavaScript file
node script.js

# Interactive REPL (Read-Eval-Print Loop)
node

# Check version
node --version
npm --version
```

---

## NPM (Node Package Manager)

While not required for built-in APIs, npm provides access to a vast ecosystem:

```bash
# Initialize project
npm init

# Install package
npm install express

# Install globally
npm install -g nodemon

# Run scripts defined in package.json
npm start
npm test
```

---

## Differences from Browser JavaScript

| Feature           | Browser        | Node                             |
| ----------------- | -------------- | -------------------------------- |
| **Global object** | `window`       | `global`                         |
| **Module system** | ES6 modules    | CommonJS (require/exports)       |
| **File access**   | ❌ Not allowed | ✅ Full access                   |
| **Network**       | Limited (CORS) | ✅ Full access                   |
| **APIs**          | DOM, BOM       | File system, OS, child processes |
| **Security**      | Sandboxed      | Trusted code                     |

---

## Learning Curve

### For Non-JavaScript Programmers

- Learn asynchronous programming concepts
- Understand event-driven architecture
- Get comfortable with callbacks/Promises
- Think in terms of events and streams

### For Client-Side JavaScript Developers

- No DOM or browser APIs
- Different module system (CommonJS vs ES6)
- Asynchronous is the default (not optional)
- Full system access (more responsibility)

---

## Key Concepts Summary

✅ **Node = JavaScript + OS bindings** for server-side programming
✅ **Single-threaded event loop** with asynchronous-by-default API
✅ **High concurrency** without traditional threading
✅ **Streams** handle large data efficiently
✅ **Buffers** work with binary data
✅ **Non-blocking I/O** allows handling many operations simultaneously
✅ **Built-in modules** for files, networking, processes, and more
✅ **npm** provides access to vast ecosystem of packages
✅ **Callbacks → Promises → Async/Await** for managing async operations
✅ **Event-driven architecture** powers most Node applications

---

## Official Resources

📚 **API Documentation**: [nodejs.org/api](https://nodejs.org/api)
📖 **Guides**: [nodejs.org/docs/guides](https://nodejs.org/docs/guides)
💾 **Download**: [nodejs.org](https://nodejs.org)
🐳 **Docker**: [hub.docker.com](https://hub.docker.com)

Node's documentation is well-organized and comprehensive—use it as your primary reference for mastering new APIs!
