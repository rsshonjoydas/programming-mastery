# Events and EventEmitter

Node.js uses an event-driven architecture for handling asynchronous operations. Many complex APIs use events instead of callbacks, especially when dealing with objects that need to handle multiple callbacks or different types of events.

## What is EventEmitter?

**EventEmitter** is a class in Node.js that enables objects to emit named events and register listener functions to handle those events.

### Importing EventEmitter

```javascript
const EventEmitter = require('events'); // Module name is "events"
const net = require('net');

let server = new net.Server();
console.log(server instanceof EventEmitter); // true
```

**Key point**: Many Node.js objects (like servers, streams, etc.) are EventEmitters or subclasses of EventEmitter.

---

## When to Use Event-Based APIs vs Callbacks

| Use Callbacks                  | Use Events                    |
| ------------------------------ | ----------------------------- |
| Simple one-time operations     | Complex operations on objects |
| Single completion notification | Multiple callbacks needed     |
| One callback type              | Multiple callback types       |
| Function-based API             | Object-based API              |

**Example**: A `net.Server` emits:

- `"listening"` event when it starts
- `"connection"` event for each client connection
- `"close"` event when it stops

---

## Registering Event Handlers

### Basic Syntax: on()

```javascript
const net = require('net');
let server = new net.Server();

server.on('connection', (socket) => {
  // Handler receives socket object for the connected client
  socket.end('Hello World', 'utf8');
});
```

**Key concepts**:

- Call `on(eventName, handlerFunction)`
- Event types are identified by **name** (strings)
- Handler arguments vary by event type—check documentation
- Can register multiple handlers for the same event

### Alternative Methods

```javascript
// More explicit name (same as on())
server.addListener('connection', handler);

// Register a one-time handler (auto-removed after first trigger)
server.once('connection', handler);

// Remove a handler
server.off('connection', handler);
server.removeListener('connection', handler); // Same as off()
```

---

## How Event Handlers Are Invoked

### Synchronous Execution

**Critical**: Event handlers are invoked **synchronously**, not asynchronously.

```javascript
emitter.emit('myEvent');
// All handlers for "myEvent" run NOW, before emit() returns
```

**Execution order**:

1. Handlers are called in **registration order** (first registered → last registered)
2. Handlers run **sequentially** on a single thread (no parallelism)
3. `emit()` **blocks** until all handlers complete
4. If a handler throws an exception, subsequent handlers don't run

### Performance Implications

Since event handlers block the event loop:

**❌ Bad** (blocking):

```javascript
server.on('request', (req, res) => {
  let data = fs.readFileSync('huge-file.txt'); // BLOCKS!
  res.end(data);
});
```

**✅ Good** (non-blocking):

```javascript
server.on('request', (req, res) => {
  fs.readFile('huge-file.txt', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error');
    } else {
      res.end(data);
    }
  });
});
```

**Best practice**: Keep event handlers fast and non-blocking. For heavy computation:

```javascript
server.on('data', (data) => {
  // Schedule heavy work asynchronously
  setTimeout(() => {
    processLargeData(data);
  }, 0);

  // Or use setImmediate()
  setImmediate(() => {
    processLargeData(data);
  });
});
```

---

## The emit() Method

Used to trigger events manually (useful when creating your own event-based APIs).

### Basic Usage

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register handler
emitter.on('greet', (name, age) => {
  console.log(`Hello ${name}, you are ${age} years old`);
});

// Emit event with arguments
emitter.emit('greet', 'Alice', 30);
// Output: Hello Alice, you are 30 years old
```

### Handler Context (this)

```javascript
const emitter = new EventEmitter();

emitter.on('test', function (message) {
  console.log(this === emitter); // true
  console.log(message);
});

emitter.emit('test', 'Hello');
```

**Note**: Arrow functions use lexical `this`, so they won't receive the EventEmitter as `this`:

```javascript
emitter.on('test', (message) => {
  console.log(this === emitter); // false (this is from outer scope)
});
```

### Return Values and Exceptions

**Return values**: Ignored by `emit()`

```javascript
emitter.on('test', () => {
  return 'ignored'; // This return value is ignored
});
```

**Exceptions**: Propagate out and stop subsequent handlers

```javascript
emitter.on('test', () => {
  console.log('Handler 1');
});

emitter.on('test', () => {
  throw new Error('Oops!');
});

emitter.on('test', () => {
  console.log('Handler 3'); // Never executes
});

emitter.emit('test');
// Output: Handler 1
// Then throws error, Handler 3 never runs
```

---

## Error Handling with "error" Events

### Why "error" Events Are Special

Event-based APIs (especially networking and I/O) are vulnerable to unpredictable asynchronous errors. The EventEmitter class treats `"error"` events specially.

### The Special Behavior

```javascript
const emitter = new EventEmitter();

// NO error handler registered
emitter.emit('error', new Error('Something went wrong'));
// Throws an uncaught exception and exits the program!
```

**What happens**:

1. If `emit("error")` is called
2. And **no handlers** are registered for `"error"` events
3. An **exception is thrown**
4. This occurs **asynchronously**, so you can't catch it
5. The program typically **exits**

### Always Handle Errors

**❌ Dangerous** (no error handler):

```javascript
const net = require('net');
let server = new net.Server();

server.on('connection', (socket) => {
  // Handle connections
});

// If an error occurs, program crashes!
```

**✅ Safe** (with error handler):

```javascript
const net = require('net');
let server = new net.Server();

server.on('connection', (socket) => {
  // Handle connections
});

server.on('error', (err) => {
  console.error('Server error:', err);
  // Handle the error appropriately
});
```

**Best practice**: **Always** register an `"error"` event handler when using event-based APIs.

---

## Creating Custom EventEmitters

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
  doSomething() {
    // Perform some work
    console.log('Doing something...');

    // Emit an event
    this.emit('done', 'Result data');
  }
}

const myEmitter = new MyEmitter();

myEmitter.on('done', (result) => {
  console.log('Received:', result);
});

myEmitter.doSomething();
// Output:
// Doing something...
// Received: Result data
```

---

## Complete Example: Custom Event-Based Timer

```javascript
const EventEmitter = require('events');

class Timer extends EventEmitter {
  constructor(duration) {
    super();
    this.duration = duration;
  }

  start() {
    this.emit('start');

    setTimeout(() => {
      this.emit('tick', this.duration / 2);

      setTimeout(() => {
        this.emit('tick', this.duration);
        this.emit('end');
      }, this.duration / 2);
    }, this.duration / 2);
  }
}

const timer = new Timer(2000);

timer.on('start', () => {
  console.log('Timer started');
});

timer.on('tick', (elapsed) => {
  console.log(`Tick at ${elapsed}ms`);
});

timer.on('end', () => {
  console.log('Timer ended');
});

timer.on('error', (err) => {
  console.error('Timer error:', err);
});

timer.start();
```

---

## EventEmitter Methods Summary

| Method                           | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `on(event, handler)`             | Register an event handler                           |
| `addListener(event, handler)`    | Alias for `on()`                                    |
| `once(event, handler)`           | Register one-time handler (auto-removed)            |
| `off(event, handler)`            | Remove an event handler                             |
| `removeListener(event, handler)` | Alias for `off()`                                   |
| `removeAllListeners([event])`    | Remove all handlers (optionally for specific event) |
| `emit(event, ...args)`           | Trigger an event with arguments                     |
| `listenerCount(event)`           | Get number of listeners for an event                |
| `listeners(event)`               | Get array of listeners for an event                 |
| `eventNames()`                   | Get array of all event names with listeners         |

---

## Key Concepts Summary

✅ **EventEmitter** is the base class for event-driven objects in Node.js
✅ Use `on()` to register handlers, `emit()` to trigger events
✅ Handlers are invoked **synchronously** in registration order
✅ Keep handlers **fast and non-blocking** to maintain responsiveness
✅ Use `setTimeout()` or `setImmediate()` for heavy computation
✅ **Always** register `"error"` event handlers to prevent crashes
✅ Unhandled `"error"` events throw exceptions and exit the program
✅ Handler exceptions stop subsequent handlers from executing
✅ Handler return values are ignored
✅ `this` in handlers (non-arrow) refers to the EventEmitter object
✅ Use `once()` for one-time handlers that auto-remove
✅ Event-based APIs are better than callbacks for complex, multi-event scenarios

---

## Common Use Cases

**Network servers**:

```javascript
server.on('listening', () => {
  /* Server started */
});
server.on('connection', (socket) => {
  /* Client connected */
});
server.on('close', () => {
  /* Server stopped */
});
server.on('error', (err) => {
  /* Handle errors */
});
```

**Streams**:

```javascript
stream.on('data', (chunk) => {
  /* Process data */
});
stream.on('end', () => {
  /* Stream finished */
});
stream.on('error', (err) => {
  /* Handle errors */
});
```

**Child processes**:

```javascript
child.on('exit', (code) => {
  /* Process exited */
});
child.on('error', (err) => {
  /* Handle errors */
});
```
