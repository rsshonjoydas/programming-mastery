# Node.js: Asynchronous by Default

## Core Concept

Node.js is designed for **I/O-intensive programs** (like network servers) and achieves high concurrency through an **asynchronous, non-blocking, single-threaded model** rather than traditional multithreading.

---

## Why Single-Threaded?

### Problems with Multithreading

- **Hard to implement correctly** - Prone to race conditions and deadlocks
- **Difficult to debug** - Complex synchronization issues
- **Memory intensive** - Hundreds of threads = prohibitive memory usage
- **Not ideal for I/O-bound tasks** - Threads spend most time waiting

### Node's Solution

Node adopts JavaScript's **single-threaded model** (borrowed from web browsers), making concurrent server programming:

- ✅ Vastly simpler
- ✅ More accessible (routine skill vs. arcane art)
- ✅ Memory efficient

---

## True Parallelism in Node (When Needed)

While Node is single-threaded by default, it **can** achieve true parallelism:

### 1. Multiple Processes

```javascript
const { fork } = require('child_process');
const child = fork('worker.js');
```

### 2. Worker Threads (Node 10+)

```javascript
const { Worker } = require('worker_threads');
const worker = new Worker('./cpu-intensive-task.js');
```

**Use cases**: CPU-intensive operations (matrix calculations, cryptography)
**Not commonly used for**: I/O-intensive programs like servers

**Key advantage**: Communication via **message passing**, not shared memory → avoids typical multithreading complexity

---

## Asynchronous and Non-Blocking by Default

Node takes non-blocking to the **extreme**:

### What's Non-Blocking in Node?

| Operation                         | Blocking? | Why?                                                       |
| --------------------------------- | --------- | ---------------------------------------------------------- |
| Network I/O                       | ❌ No     | Expected (milliseconds of latency)                         |
| File I/O                          | ❌ No     | Hard drives have seek time; "local" files may be networked |
| Network connections               | ❌ No     | Initiating connections has latency                         |
| File metadata (modification time) | ❌ No     | Even tiny operations avoid blocking                        |

**Philosophy**: Avoid **even the tiniest amount of blocking**

---

## Callback-Based Asynchronous APIs

Node was created **before JavaScript Promises**, so most APIs use **error-first callbacks**.

### Error-First Callback Pattern

```javascript
function(err, result) {
  // First argument: error (null if success)
  // Second argument: data/response
}
```

**Why error comes first?**
Makes it impossible to ignore error handling.

### Example: Reading a File

```javascript
const fs = require('fs');

function readConfigFile(path, callback) {
  fs.readFile(path, 'utf8', (err, text) => {
    if (err) {
      console.error(err);
      callback(null);
      return;
    }

    let data = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(e);
    }

    callback(data);
  });
}
```

**Pattern**:

1. Check `err` parameter first
2. If error exists, handle it and return
3. Process result if no error
4. Call callback with result or `null`

---

## Promise-Based APIs

### Converting Callbacks to Promises

Use `util.promisify()` to wrap callback-based functions:

```javascript
const util = require('util');
const fs = require('fs');

const pfs = {
  readFile: util.promisify(fs.readFile),
};

function readConfigFile(path) {
  return pfs.readFile(path, 'utf-8').then((text) => {
    return JSON.parse(text);
  });
}
```

### Using async/await

```javascript
async function readConfigFile(path) {
  let text = await pfs.readFile(path, 'utf-8');
  return JSON.parse(text);
}
```

### Built-in Promise APIs (Node 10+)

```javascript
const fs = require('fs').promises;

async function readConfigFile(path) {
  let text = await fs.readFile(path, 'utf-8');
  return JSON.parse(text);
}
```

---

## Synchronous Variants

Node provides **synchronous versions** for programmer convenience, typically named with `Sync` suffix.

### When to Use Synchronous Functions

✅ **Startup code** - Reading configuration files before server starts
✅ **No concurrency yet** - Not handling requests
✅ **Blocking is acceptable** - No performance impact

### Example: Synchronous File Reading

```javascript
const fs = require('fs');

function readConfigFileSync(path) {
  let text = fs.readFileSync(path, 'utf-8');
  return JSON.parse(text);
}
```

**Behavior**:

- Blocks until operation completes
- Returns value directly (no callback, no Promise)
- Throws exceptions on error

---

## Event-Based Asynchrony

For **streaming data**, Node uses event-based APIs (covered in detail later):

```javascript
const fs = require('fs');
const stream = fs.createReadStream('large-file.txt');

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

stream.on('end', () => {
  console.log('Finished reading file');
});
```

---

## How Node Achieves Concurrency

### The Event Loop

Node uses **event-based concurrency** with a single-threaded event loop:

```text
1. Program starts → Runs your code
2. Code calls non-blocking functions → OS event handlers registered
3. Code finishes → Node enters event loop (blocks until OS event)
4. OS event occurs → Node wakes up
5. Node invokes your callback → May register more handlers
6. Callback finishes → Back to step 3
```

### Behind the Scenes

```javascript
// Your code
fs.readFile('config.json', callback);

// Node internally:
// 1. Starts file read operation
// 2. Registers OS-level event handler
// 3. Stores your callback
// 4. Returns immediately (non-blocking)

// Later when OS finishes:
// 5. OS notifies Node
// 6. Node invokes your callback with result
```

### Concurrency Model

- **Single thread** runs event loop
- **Operating system** handles actual I/O operations
- **Callbacks** execute when OS signals completion
- **No multithreading** = No race conditions, locks, or deadlocks

---

## Why This Model Works

### For I/O-Intensive Applications

Web servers spend most time **waiting** for:

- Network requests
- Database queries
- File system operations
- External API calls

**Traditional approach**: 50 clients = 50 threads (memory intensive)
**Node approach**: 50 clients = 1 thread + internal socket-to-callback mapping

### Efficiency

✅ **Memory efficient** - No thread-per-connection overhead
✅ **CPU efficient** - No context switching between threads
✅ **Simple programming model** - No locks, mutexes, or synchronization
✅ **High concurrency** - Handle thousands of connections

---

## Practical Examples

### Callback Pattern (Traditional)

```javascript
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('File contents:', data);
});

console.log('This runs immediately (non-blocking)');
```

### Promise Pattern

```javascript
const fs = require('fs').promises;

fs.readFile('data.txt', 'utf8')
  .then((data) => console.log('File contents:', data))
  .catch((err) => console.error('Error:', err));

console.log('This runs immediately (non-blocking)');
```

### Async/Await Pattern

```javascript
const fs = require('fs').promises;

async function readData() {
  try {
    const data = await fs.readFile('data.txt', 'utf8');
    console.log('File contents:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

readData();
console.log('This runs immediately (non-blocking)');
```

### Synchronous Pattern (Startup Only)

```javascript
const fs = require('fs');

try {
  const data = fs.readFileSync('config.json', 'utf8');
  const config = JSON.parse(data);
  console.log('Config loaded:', config);
} catch (err) {
  console.error('Failed to load config:', err);
  process.exit(1);
}

// Server starts here...
```

---

## Key Concepts Summary

📌 **Single-threaded model** - Simpler than multithreading, borrowed from browsers
📌 **Asynchronous by default** - Even file I/O is non-blocking
📌 **Event loop** - Single thread handles all I/O via OS events
📌 **Error-first callbacks** - Traditional Node pattern (err, result)
📌 **Promises/async-await** - Modern alternatives via `util.promisify()`
📌 **Synchronous variants** - Available with `Sync` suffix for startup code
📌 **Event-based APIs** - For streaming data
📌 **High concurrency** - One thread handles thousands of connections
📌 **True parallelism** - Available via processes or Worker threads when needed
📌 **Message passing** - No shared memory = simpler concurrent programming

---

## Best Practices

✅ **Use async/await** for modern, readable asynchronous code
✅ **Always check errors** in callbacks (first argument)
✅ **Use synchronous functions** only during startup
✅ **Avoid blocking operations** in production code
✅ **Leverage the event loop** - Don't fight it with CPU-intensive tasks
✅ **Use Workers** for CPU-bound operations (parsing, compression, crypto)
✅ **Embrace non-blocking** - It's Node's superpower for I/O-intensive apps
