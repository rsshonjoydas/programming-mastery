# JavaScript Worker Threads and Messaging

## Overview

JavaScript is **single-threaded** by default, meaning:

- Browser never runs two event handlers simultaneously
- Timers never trigger while event handlers run
- No concurrent updates to application state or DOM
- Functions must not run too long or they'll block the event loop

**Web Workers** carefully relax this single-thread requirement by providing:

- Concurrent execution alongside the main thread
- Self-contained execution environment with independent global object
- No access to Window or Document objects
- Communication only through asynchronous message passing

---

## Why Use Workers?

### Use Cases

✅ **Computationally intensive tasks**: Image processing, data crunching, complex calculations
✅ **Frequent moderate computations**: Syntax highlighting in code editors, real-time parsing
✅ **Prevent UI blocking**: Move heavy work off main thread to keep browser responsive
✅ **Parallel processing**: Divide work among multiple threads

### Worker Characteristics

- **Not heavyweight**: Not like opening new browser windows
- **Not flyweight**: Not "fibers" - don't create for trivial operations
- **Practical scale**: Tens of workers are useful; hundreds/thousands are impractical
- **No DOM manipulation**: Workers can't modify the DOM

---

## 1. Creating and Using Workers

### Worker Object (External View)

The `Worker` object represents what a worker looks like **from the outside** (from the thread that creates it).

#### Creating a Worker

```javascript
let dataCruncher = new Worker('utils/cruncher.js');
```

**URL Requirements**:

- **Relative URLs**: Resolved relative to the document containing the script
- **Absolute URLs**: Must have same origin (protocol, host, port)

#### Sending Messages to Worker

```javascript
dataCruncher.postMessage('/api/data/to/crunch');
```

**What gets sent**:

- Value is copied using the **structured clone algorithm**
- Can send: primitives, objects, arrays, typed arrays, Maps, Sets, etc.
- Copy is delivered via a "message" event in the worker

#### Receiving Messages from Worker

```javascript
dataCruncher.onmessage = function (e) {
  let stats = e.data; // Message is in data property
  console.log(`Average: ${stats.mean}`);
};

// Or using addEventListener
dataCruncher.addEventListener('message', function (e) {
  console.log('Received:', e.data);
});
```

#### Terminating a Worker

```javascript
dataCruncher.terminate(); // Forces worker to stop
```

---

## 2. WorkerGlobalScope (Internal View)

The global object inside a worker is a `WorkerGlobalScope` - what the worker looks like **from the inside**.

### Characteristics

- **More than core JavaScript global object**: Has additional APIs
- **Less than Window object**: No DOM access, limited APIs
- **Isolated execution**: Pristine JavaScript environment

### Communication Methods

Inside the worker, `postMessage()` and `onmessage` work in the **opposite direction**:

```javascript
// Inside worker.js
onmessage = function (e) {
  let data = e.data;
  let result = processData(data);
  postMessage(result); // Send result back
};
```

### Worker Properties and Methods

#### Core JavaScript Features

- All standard JavaScript global objects: `JSON`, `Date()`, `isNaN()`, etc.

#### Client-Side APIs

```javascript
self; // Reference to global object (not 'window')
setTimeout(); // Timer methods
setInterval();
clearTimeout();
clearInterval();
location; // Read-only Location object with URL info
navigator; // Navigator object with browser info
addEventListener();
removeEventListener();
Console; // console.log(), etc.
fetch(); // Network requests
IndexedDB; // Database API
Worker(); // Workers can create other workers!
```

#### Worker-Specific Methods

```javascript
close(); // Terminate the worker from inside
importScripts(); // Load additional JavaScript files (non-module workers)
```

#### Worker Name

```javascript
// Main thread
let worker = new Worker('worker.js', { name: 'MyWorker' });

// Inside worker
console.log(self.name); // "MyWorker"
```

---

## 3. Importing Code into Workers

### Using importScripts() (Pre-Module Era)

```javascript
// Inside worker
importScripts('utils/Histogram.js', 'utils/BitSet.js');
```

**Characteristics**:

- **Synchronous**: Blocks until all scripts load and execute
- **Sequential**: Loads and executes in order
- **URL resolution**: Relative to Worker() constructor URL
- **Error handling**: Network or execution error prevents subsequent scripts from loading
- **No dependency tracking**: Doesn't prevent loading same script twice or circular dependencies
- **Immediate availability**: Can use loaded code right after `importScripts()` returns

### Using ES6 Modules in Workers

```javascript
// Main thread - pass type: "module"
let worker = new Worker('worker.js', { type: 'module' });
```

```javascript
// Inside worker.js
import { processData } from './utils.js';

onmessage = function (e) {
  let result = processData(e.data);
  postMessage(result);
};
```

**Notes**:

- Must pass `{ type: "module" }` option to Worker constructor
- Like `<script type="module">` in HTML
- Allows `import` declarations
- `importScripts()` is NOT available in module workers
- **Browser support**: Chrome fully supports (as of 2020); check compatibility for others

---

## 4. Worker Execution Model

### Lifecycle

1. **Synchronous phase**: Runs code from top to bottom
2. **Asynchronous phase**: Responds to events and timers
3. **Automatic exit**: When no pending tasks remain (unless listening for messages)

### When Workers Exit

**Worker stays alive if**:

- Has registered "message" event handler
- Has pending tasks (fetch() promises, timers)
- Has callbacks waiting to execute

**Worker exits when**:

- No message handler registered AND
- No pending tasks AND
- All callbacks have been called
- Or `close()` is called explicitly

```javascript
// Worker exits automatically after this
postMessage('Done!');

// Worker stays alive because of message handler
onmessage = function (e) {
  // Process messages
};
```

---

## 5. Error Handling in Workers

### Uncaught Exceptions

When an exception occurs in a worker without a `catch` clause:

1. **"error" event** fires on worker's global object
2. If handler calls `preventDefault()`, propagation ends
3. Otherwise, **"error" event** fires on Worker object
4. If handler calls `preventDefault()` there, propagation ends
5. Otherwise, error logs to console and triggers window.onerror

#### Inside Worker

```javascript
// Handle errors inside worker
self.onerror = function (e) {
  console.log(`Error in worker at ${e.filename}:${e.lineno}: ${e.message}`);
  e.preventDefault();
};
```

#### Outside Worker

```javascript
// Handle errors outside worker
worker.onerror = function (e) {
  console.log(`Error in worker at ${e.filename}:${e.lineno}: ${e.message}`);
  e.preventDefault();
};
```

### Unhandled Promise Rejections

```javascript
// Inside worker
self.onunhandledrejection = function (e) {
  console.log('Unhandled rejection:', e.reason);
  console.log('Promise:', e.promise);
};

// Or with addEventListener
addEventListener('unhandledrejection', function (e) {
  // Handle rejection
});
```

---

## 6. MessagePorts and MessageChannels

### What Are They?

- **MessagePort**: Object with `postMessage()` method and `onmessage` handler
- **MessageChannel**: Creates a pair of connected MessagePorts
- Messages posted to one port are received on the other

### Creating a MessageChannel

```javascript
let channel = new MessageChannel();
let myPort = channel.port1; // First port
let yourPort = channel.port2; // Second port (connected to port1)

myPort.postMessage('Can you hear me?');
yourPort.onmessage = (e) => console.log(e.data);
```

### Message Queuing

Messages are queued until:

- `onmessage` property is set, or
- `start()` method is called

```javascript
port.addEventListener('message', handler);
port.start(); // Don't forget this!
```

### Using MessagePorts with Workers

Create dedicated communication channels:

```javascript
// Main thread
let worker = new Worker('worker.js');
let urgentChannel = new MessageChannel();
let urgentPort = urgentChannel.port1;

// Transfer port2 to worker
worker.postMessage(
  { command: 'setUrgentPort', value: urgentChannel.port2 },
  [urgentChannel.port2] // Transfer array
);

// Receive urgent messages
urgentPort.addEventListener('message', handleUrgentMessage);
urgentPort.start();

// Send urgent messages
urgentPort.postMessage('urgent data');
```

```javascript
// Inside worker
onmessage = function (e) {
  if (e.data.command === 'setUrgentPort') {
    let urgentPort = e.data.value;
    urgentPort.onmessage = function (e) {
      // Handle urgent messages
    };
  }
};
```

### Worker-to-Worker Communication

MessageChannels enable direct communication between workers without relaying through main thread.

---

## 7. Transferring vs Copying Data

### postMessage() Second Argument

```javascript
postMessage(message, transferList);
```

**Transferable objects**:

- **MessagePort**: Becomes available on other end, unusable on sender's end
- **ArrayBuffer**: Transferred without copying (important for performance)
- **ImageBitmap, OffscreenCanvas**: Some browsers (not universal)

### Transferring ArrayBuffers

**Why**: Avoids copying large buffers (e.g., image data)

```javascript
let buffer = new ArrayBuffer(1024 * 1024); // 1MB
let view = new Uint8Array(buffer);

// Transfer buffer (no copy, becomes unusable here)
worker.postMessage({ data: view }, [buffer]);

// After transfer, buffer is unusable
console.log(buffer.byteLength); // 0
```

**Rules**:

- If ArrayBuffer (or typed array) appears in first argument
- AND appears in second argument array
- → It's **transferred** (no copy, original becomes unusable)
- If NOT in second argument → It's **copied**

---

## 8. Cross-Origin Messaging with Windows

### Window.postMessage()

Used for communication between windows/iframes with different origins.

#### Syntax

```javascript
targetWindow.postMessage(message, targetOrigin, [transfer]);
```

**Arguments**:

1. **message**: Data to send (structured clone)
2. **targetOrigin**: Required! Origin that should receive message (security)
3. **transfer** (optional): Array of transferable objects

#### Security: targetOrigin

```javascript
// Send only to specific origin
iframe.contentWindow.postMessage(data, 'https://trusted.example.com');

// Send to any origin (use cautiously!)
iframe.contentWindow.postMessage(data, '*');
```

If specified origin doesn't match, message is NOT delivered.

### Receiving Messages in Windows

```javascript
window.onmessage = function (e) {
  // Verify origin for security!
  if (e.origin !== 'https://trusted.example.com') {
    return;
  }

  let message = e.data;
  let sender = e.source; // Window that sent message

  // Send reply
  e.source.postMessage('Reply', e.origin);
};
```

**Event Properties**:

- **e.data**: The message sent
- **e.source**: Window object that sent the message
- **e.origin**: Origin of sender (cannot be forged - verify it!)

### **Use Cases**

- **`<iframe>` communication**: Parent ↔ embedded iframe
- **Cross-origin communication**: Safely exchange data despite same-origin policy
- **Popup windows**: Main window ↔ popup

```javascript
// Parent window
let iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage('Hello iframe', 'https://example.com');

// Inside iframe
window.parent.postMessage('Hello parent', 'https://parent.com');
```

---

## Complete Example: Worker with Message Passing

### Main Thread

```javascript
// Create worker
let worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

// Receive results
worker.onmessage = function (e) {
  console.log('Sum:', e.data.sum);
  console.log('Average:', e.data.average);
};

// Handle errors
worker.onerror = function (e) {
  console.error('Worker error:', e.message);
  e.preventDefault();
};
```

### Worker (worker.js)

```javascript
// Receive data from main thread
onmessage = function (e) {
  let numbers = e.data.numbers;

  // Perform computation
  let sum = numbers.reduce((a, b) => a + b, 0);
  let average = sum / numbers.length;

  // Send results back
  postMessage({ sum, average });
};

// Handle errors
self.onerror = function (e) {
  console.error('Error in worker:', e.message);
};
```

---

## Key Concepts Summary

✅ **Single-threaded JavaScript**: Workers provide controlled concurrency
✅ **Worker isolation**: Independent global object, no DOM access
✅ **Message passing**: Only communication method between threads
✅ **Worker object**: External view (created with `new Worker()`)
✅ **WorkerGlobalScope**: Internal view (global object inside worker)
✅ **postMessage()**: Send messages (structured clone algorithm)
✅ **onmessage**: Receive messages via events
✅ **importScripts()**: Load code synchronously (non-module workers)
✅ **ES6 modules**: Use `{ type: "module" }` option
✅ **MessageChannel**: Create paired MessagePorts for custom channels
✅ **Transfer vs copy**: ArrayBuffers can be transferred (performance)
✅ **Cross-origin messaging**: Window.postMessage() with origin verification
✅ **Error handling**: onerror handlers inside and outside workers
✅ **Worker lifecycle**: Exits automatically when no pending work
