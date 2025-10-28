# Worker Threads

## What Are Worker Threads?

**Worker threads** enable true multithreaded programming in Node.js (v10+) while avoiding the traditional dangers of shared memory.

### Key Characteristics

- **No shared memory by default** - threads communicate via message passing
- **Based on Web Workers API** - similar to browser workers
- **Safe multithreading** - avoids traditional thread synchronization issues
- **Event-based communication** - uses `postMessage()` and message events

---

## Why Use Worker Threads?

### 1. Utilize Multiple CPU Cores

Distribute computation across multiple cores for CPU-intensive tasks:

- Scientific computing
- Machine learning
- Graphics processing

### 2. Maintain Responsiveness

Prevent blocking the main thread even when not CPU-bound:

**Example scenario**: Server handling one request per second, each requiring 0.5s of CPU computation.

- Without workers: Second request waits until first completes
- With workers: Both requests start immediately, better user experience

### 3. Convert Blocking to Non-blocking

Turn synchronous operations into asynchronous ones:

- Legacy synchronous code
- Unavoidable blocking operations

### When NOT to Use Workers

❌ Not CPU-bound
❌ No responsiveness issues
❌ Lightweight tasks (workers have overhead)
❌ Don't need significant computation

**Note**: Workers are not as heavyweight as child processes, but not lightweight either.

---

## Creating Workers and Passing Messages

### Module Import

```javascript
const threads = require('worker_threads');
```

### Basic Worker Creation

The `Worker()` constructor takes a file path:

```javascript
const worker = new threads.Worker('./worker.js');
```

### Main Thread and Worker in Same File

```javascript
const threads = require('worker_threads');

if (threads.isMainThread) {
  // MAIN THREAD CODE
  module.exports = function reticulateSplines(splines) {
    return new Promise((resolve, reject) => {
      // Create worker that loads this same file
      let reticulator = new threads.Worker(__filename);

      // Send data to worker
      reticulator.postMessage(splines);

      // Handle responses
      reticulator.on('message', resolve);
      reticulator.on('error', reject);
    });
  };
} else {
  // WORKER THREAD CODE
  threads.parentPort.once('message', (splines) => {
    // Process the splines
    for (let spline of splines) {
      spline.reticulate ? spline.reticulate() : (spline.reticulated = true);
    }

    // Send results back to main thread
    threads.parentPort.postMessage(splines);
  });
}
```

### Worker with Inline Code

Pass code as string with `{eval: true}`:

```javascript
new threads.Worker(
  `
  const threads = require("worker_threads");
  threads.parentPort.postMessage(threads.isMainThread);
`,
  { eval: true }
).on('message', console.log); // Prints "false"
```

### File Path Resolution

```javascript
// Absolute path
new threads.Worker('/absolute/path/worker.js');

// Relative to process.cwd() (not current module!)
new threads.Worker('workers/reticulator.js');

// Relative to current module
const path = require('path');
new threads.Worker(path.resolve(__dirname, 'workers/reticulator.js'));
```

---

## Message Passing

### The Structured Clone Algorithm

Messages are **copied**, not shared, using the **structured clone algorithm**:

**Supported types**:

- Primitives (string, number, boolean)
- Objects and arrays
- Map, Set, Date, RegExp
- Typed arrays
- Buffers (converted to Uint8Array, reconvert with `Buffer.from()`)

**Not supported**:

- Sockets, streams, and other Node host objects
- Functions
- Symbols (sometimes)

**Not JSON**: More robust than `JSON.stringify()`/`JSON.parse()`

### Sending Messages

**From main thread to worker**:

```javascript
worker.postMessage(data);
```

**From worker to main thread**:

```javascript
threads.parentPort.postMessage(data);
```

### Receiving Messages

**In main thread**:

```javascript
worker.on('message', (data) => {
  console.log('Received from worker:', data);
});
```

**In worker thread**:

```javascript
threads.parentPort.on('message', (data) => {
  console.log('Received from main:', data);
});
```

---

## Worker Execution Environment

### Key Properties

| Property               | Main Thread | Worker Thread            |
| ---------------------- | ----------- | ------------------------ |
| `threads.isMainThread` | `true`      | `false`                  |
| `threads.parentPort`   | `null`      | MessagePort object       |
| `threads.workerData`   | `null`      | Initial data from parent |

### Worker Configuration Options

Pass as second argument to `Worker()` constructor:

```javascript
new threads.Worker('./worker.js', {
  workerData: { initial: 'data' }, // Available immediately in worker
  env: { CUSTOM_VAR: 'value' }, // Custom environment variables
  stdin: true, // Enable stdin pipe
  stdout: true, // Capture stdout
  stderr: true, // Capture stderr
  eval: true, // First arg is code string
});
```

### Environment Variables

```javascript
// Default: worker gets copy of parent's process.env
new threads.Worker('./worker.js');

// Custom environment
new threads.Worker('./worker.js', {
  env: { API_KEY: 'secret' },
});

// SHARED environment (dangerous!)
new threads.Worker('./worker.js', {
  env: threads.SHARE_ENV,
});
```

### Standard I/O Streams

**Default behavior**:

- `process.stdin` in worker: no data
- `process.stdout/stderr` in worker: piped to parent

**Custom configuration**:

```javascript
let worker = new threads.Worker('./worker.js', {
  stdin: true, // Enable stdin
  stdout: true, // Capture stdout
  stderr: true, // Capture stderr
});

// Write to worker's stdin
worker.stdin.write('input data\n');

// Read worker's stdout
worker.stdout.on('data', (chunk) => {
  console.log('Worker output:', chunk.toString());
});
```

### Process Behavior Differences

| Behavior                  | Main Thread          | Worker Thread        |
| ------------------------- | -------------------- | -------------------- |
| `process.exit()`          | Exits entire process | Exits only thread    |
| `process.chdir()`         | Changes directory    | **Throws exception** |
| `process.setuid()`        | Changes user         | **Throws exception** |
| OS signals (SIGINT, etc.) | Received             | **Not received**     |

---

## Communication Channels and MessagePorts

### Why Custom Channels?

- Multiple modules need separate communication paths
- Workers need to communicate directly with each other
- Avoid mixing different message types on default channel

### Creating Custom Channels

```javascript
const threads = require('worker_threads');
let channel = new threads.MessageChannel();

// Two connected ports
channel.port1.postMessage('hello');
channel.port2.on('message', console.log); // Receives "hello"

// Close connection
channel.port1.close(); // Emits "close" on both ports
```

### Transferring MessagePorts to Workers

```javascript
const threads = require('worker_threads');
let channel = new threads.MessageChannel();

// Transfer port1 to worker (MUST include in transfer list!)
worker.postMessage(
  { command: 'changeChannel', data: channel.port1 },
  [channel.port1] // Transfer list (second argument)
);

// Use port2 in main thread
channel.port2.postMessage('Can you hear me now?');
channel.port2.on('message', handleMessagesFromWorker);
```

**Important**: Once transferred, `port1` becomes unusable in the main thread.

---

## Transferring Typed Arrays

### Why Transfer Instead of Copy?

**Copying** (default):

- Duplicates memory
- Safe but slow for large arrays
- Uses structured clone algorithm

**Transferring**:

- Zero-copy operation (memory efficient)
- Fast for large data (e.g., image processing)
- Source becomes unusable after transfer

### How to Transfer

```javascript
let pixels = new Uint32Array(1024 * 1024); // 4MB

// Transfer the ArrayBuffer (not the typed array itself!)
worker.postMessage(pixels, [pixels.buffer]);

// pixels is now unusable in main thread
// Worker receives the data without copying
```

### Worker Can Transfer Back

```javascript
// In worker thread
threads.parentPort.on('message', (pixels) => {
  // Process pixels...

  // Transfer back to main thread
  threads.parentPort.postMessage(pixels, [pixels.buffer]);

  // pixels now unusable in worker
});
```

---

## Sharing Typed Arrays (Advanced)

### SharedArrayBuffer

Allows **actual shared memory** between threads:

```javascript
const threads = require('worker_threads');

if (threads.isMainThread) {
  // Create shared memory
  let sharedBuffer = new SharedArrayBuffer(4);
  let sharedArray = new Int32Array(sharedBuffer);

  // Pass to worker (no transfer list - sharing, not transferring!)
  let worker = new threads.Worker(__filename, {
    workerData: sharedArray,
  });

  worker.on('online', () => {
    // Both threads can access sharedArray[0] simultaneously
    for (let i = 0; i < 10_000_000; i++) {
      sharedArray[0]++; // NOT THREAD-SAFE!
    }
  });
} else {
  let sharedArray = threads.workerData;
  for (let i = 0; i < 10_000_000; i++) {
    sharedArray[0]++; // NOT THREAD-SAFE!
  }
  threads.parentPort.postMessage('done');
}
```

**Problem**: Final value will be far less than 20,000,000 due to race conditions!

### Atomic Operations

Use `Atomics` for thread-safe operations:

```javascript
const threads = require('worker_threads');

if (threads.isMainThread) {
  let sharedBuffer = new SharedArrayBuffer(4);
  let sharedArray = new Int32Array(sharedBuffer);
  let worker = new threads.Worker(__filename, { workerData: sharedArray });

  worker.on('online', () => {
    for (let i = 0; i < 10_000_000; i++) {
      Atomics.add(sharedArray, 0, 1); // Thread-safe!
    }

    worker.on('message', () => {
      console.log(Atomics.load(sharedArray, 0)); // 20,000,000 ✓
    });
  });
} else {
  let sharedArray = threads.workerData;
  for (let i = 0; i < 10_000_000; i++) {
    Atomics.add(sharedArray, 0, 1); // Thread-safe!
  }
  threads.parentPort.postMessage('done');
}
```

### Atomics API

| Method                                | Description            |
| ------------------------------------- | ---------------------- |
| `Atomics.add(array, index, value)`    | Atomic add operation   |
| `Atomics.sub(array, index, value)`    | Atomic subtract        |
| `Atomics.load(array, index)`          | Atomic read            |
| `Atomics.store(array, index, value)`  | Atomic write           |
| `Atomics.wait(array, index, value)`   | Wait for notification  |
| `Atomics.notify(array, index, count)` | Notify waiting threads |

### Performance Warning

Atomic operations are **~9x slower** than non-atomic. Often simpler and faster to avoid shared memory entirely!

### When Sharing Might Be Reasonable

✅ **Disjoint memory regions**: Different threads operate on separate sections

- Parallel merge sort (top half vs bottom half)
- Image processing on non-overlapping regions

❌ **Related data**: Most real-world scenarios require higher-level synchronization

---

## Complete Example: Parallel Image Processing

```javascript
const threads = require('worker_threads');

if (threads.isMainThread) {
  // Create worker
  let worker = new threads.Worker(__filename);

  // Create image data (4 megapixels, RGBA)
  let pixels = new Uint32Array(1024 * 1024);

  // Fill with sample data
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = 0xff000000 | i % 256;
  }

  console.log('Sending image to worker...');

  // Transfer pixels to worker
  worker.postMessage(pixels, [pixels.buffer]);

  // Receive processed pixels back
  worker.on('message', (processedPixels) => {
    console.log('Received processed image');
    console.log('First pixel:', processedPixels[0].toString(16));

    worker.terminate();
  });
} else {
  threads.parentPort.on('message', (pixels) => {
    console.log('Worker processing image...');

    // Apply simple filter (invert colors)
    for (let i = 0; i < pixels.length; i++) {
      pixels[i] = ~pixels[i];
    }

    // Transfer back to main thread
    threads.parentPort.postMessage(pixels, [pixels.buffer]);
  });
}
```

---

## Best Practices

✅ **Use message passing** over shared memory
✅ **Transfer large typed arrays** instead of copying
✅ **Use custom MessageChannels** for complex communication
✅ **Handle errors** with `worker.on("error", ...)`
✅ **Terminate workers** when done: `worker.terminate()`
✅ **Avoid SharedArrayBuffer** unless absolutely necessary
✅ **Use Atomics** if sharing memory
✅ **Consider worker pools** for many small tasks

❌ **Don't share memory** unless you understand thread safety
❌ **Don't use SharedArrayBuffer** without Atomics
❌ **Don't create workers** for trivial tasks
❌ **Don't forget** transferred values become unusable

---

## Key Concepts Summary

📌 **Worker threads enable true multithreading** without shared memory risks
📌 **Communication via message passing** using `postMessage()`
📌 **Structured clone algorithm** copies most JavaScript types
📌 **MessagePorts can be transferred** for custom communication channels
📌 **Typed arrays can be transferred** for zero-copy performance
📌 **SharedArrayBuffer enables shared memory** but is dangerous
📌 **Atomics provides thread-safe operations** on shared arrays
📌 **Workers are event-based** (not blocking)
📌 **Use for CPU-intensive tasks** or maintaining responsiveness
📌 **Avoid for lightweight operations** (overhead not worth it)
