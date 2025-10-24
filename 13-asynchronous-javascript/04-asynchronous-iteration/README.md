# JavaScript Asynchronous Iteration

Asynchronous iteration allows you to work with sequences of asynchronous events using Promise-based iterators and the `for/await` loop.

## Why Asynchronous Iteration?

**Problem**: Regular Promises and `async/await` work for single asynchronous operations, but not for:

- Repetitive asynchronous events (like `setInterval()`)
- Click events in browsers
- Data streams in Node.js
- Any sequence of asynchronous values

**Solution**: ES2018 introduced asynchronous iterators with `for/await` loops.

---

## 1. The for/await Loop

The `for/await` loop is like `for/of`, but works with Promise-based asynchronous iterators.

### Basic Syntax

```javascript
for await (const value of asyncIterable) {
  // Process each value
}
```

### Example: Reading a Stream

```javascript
const fs = require('fs');

async function parseFile(filename) {
  let stream = fs.createReadStream(filename, { encoding: 'utf-8' });

  for await (let chunk of stream) {
    parseChunk(chunk); // Process each chunk as it arrives
  }
}
```

### How It Works

1. The asynchronous iterator produces a Promise
2. The `for/await` loop waits for that Promise to fulfill
3. Assigns the fulfillment value to the loop variable
4. Runs the loop body
5. Repeats with the next Promise

---

## 2. Using for/await with Arrays of Promises

### Example: Fetching Multiple URLs

```javascript
const urls = [url1, url2, url3];
const promises = urls.map((url) => fetch(url));

// Regular for/of with await
for (const promise of promises) {
  const response = await promise;
  handle(response);
}

// More concise with for/await
for await (const response of promises) {
  handle(response);
}
```

**Key points**:

- Both examples do exactly the same thing
- Processes responses as they become available (not necessarily in order)
- Must be inside an `async` function
- Works with regular iterators that return Promises

---

## 3. Asynchronous Iterators

### Regular Iterator vs Asynchronous Iterator

| Feature            | Regular Iterator       | Asynchronous Iterator            |
| ------------------ | ---------------------- | -------------------------------- |
| **Method name**    | `Symbol.iterator`      | `Symbol.asyncIterator`           |
| **next() returns** | Iterator result object | Promise → iterator result object |
| **Use with**       | `for/of` loop          | `for/await` loop                 |

### Key Differences

**Regular iterator**:

```javascript
{
  [Symbol.iterator]() {
    return {
      next() {
        return { value: someValue, done: false };
      }
    };
  }
}
```

**Asynchronous iterator**:

```javascript
{
  [Symbol.asyncIterator]() {
    return {
      next() {
        return Promise.resolve({ value: someValue, done: false });
      }
    };
  }
}
```

### Important Notes

- `for/await` prefers `Symbol.asyncIterator` but falls back to `Symbol.iterator`
- With async iterators, both `value` and `done` can be determined asynchronously
- The `next()` method returns a Promise that resolves to `{ value, done }`

---

## 4. Asynchronous Generators

The easiest way to create asynchronous iterators is with **async generator functions**.

### Syntax

Combines `async function` and `function*`:

```javascript
async function* generatorName() {
  // Use await and yield
}
```

### Example: Clock Generator

```javascript
// Promise-based wrapper for setTimeout
function elapsedTime(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Async generator that yields counter at intervals
async function* clock(interval, max = Infinity) {
  for (let count = 1; count <= max; count++) {
    await elapsedTime(interval); // Wait for interval
    yield count; // Yield the counter
  }
}

// Using the async generator
async function test() {
  for await (let tick of clock(300, 100)) {
    // Every 300ms, 100 times
    console.log(tick);
  }
}
```

**Features**:

- Use `await` like in regular async functions
- Use `yield` like in regular generators
- Yielded values are automatically wrapped in Promises
- Perfect for sequences of asynchronous operations

---

## 5. Implementing Asynchronous Iterators Manually

You can implement async iterators without generators by defining `Symbol.asyncIterator`.

### Example: Clock Iterator (Manual Implementation)

```javascript
function clock(interval, max = Infinity) {
  // Promise that resolves at specific time
  function until(time) {
    return new Promise((resolve) => setTimeout(resolve, time - Date.now()));
  }

  // Return asynchronously iterable object
  return {
    startTime: Date.now(),
    count: 1,

    async next() {
      // next() returns a Promise
      if (this.count > max) {
        return { done: true };
      }

      // Calculate target time for this iteration
      let targetTime = this.startTime + this.count * interval;

      // Wait until target time
      await until(targetTime);

      // Return iteration result
      return { value: this.count++, done: false };
    },

    // Make this object asynchronously iterable
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
```

**Advantages of manual implementation**:

- More precise timing (accounts for loop body execution time)
- Better control over asynchronous behavior
- Can handle multiple concurrent `next()` calls properly

---

## 6. AsyncQueue Class

A utility class for managing asynchronous iteration with event streams.

### Implementation

```javascript
class AsyncQueue {
  constructor() {
    this.values = []; // Queued values
    this.resolvers = []; // Pending Promise resolvers
    this.closed = false; // Queue state
  }

  enqueue(value) {
    if (this.closed) {
      throw new Error('AsyncQueue closed');
    }

    if (this.resolvers.length > 0) {
      // Resolve pending Promise
      const resolve = this.resolvers.shift();
      resolve(value);
    } else {
      // Queue the value
      this.values.push(value);
    }
  }

  dequeue() {
    if (this.values.length > 0) {
      // Return resolved Promise with queued value
      const value = this.values.shift();
      return Promise.resolve(value);
    } else if (this.closed) {
      // Return end-of-stream marker
      return Promise.resolve(AsyncQueue.EOS);
    } else {
      // Return pending Promise
      return new Promise((resolve) => {
        this.resolvers.push(resolve);
      });
    }
  }

  close() {
    // Resolve all pending Promises with EOS
    while (this.resolvers.length > 0) {
      this.resolvers.shift()(AsyncQueue.EOS);
    }
    this.closed = true;
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  next() {
    return this.dequeue().then((value) =>
      value === AsyncQueue.EOS
        ? { value: undefined, done: true }
        : { value: value, done: false }
    );
  }
}

// End-of-stream sentinel
AsyncQueue.EOS = Symbol('end-of-stream');
```

### How AsyncQueue Works

- **enqueue()**: Add values to the queue
- **dequeue()**: Returns a Promise for the next value
- **close()**: Signals no more values will be added
- Can call `dequeue()` before `enqueue()` (Promise waits)
- Maintains internal queue of Promises

---

## 7. Practical Example: Event Stream

Use AsyncQueue to convert DOM events into an asynchronous iterable stream.

### **Implementation**

```javascript
// Create async iterable event stream
function eventStream(elt, type) {
  const q = new AsyncQueue();
  elt.addEventListener(type, (e) => q.enqueue(e));
  return q;
}

// Use with for/await loop
async function handleKeys() {
  for await (const event of eventStream(document, 'keypress')) {
    console.log(event.key);
  }
}
```

**Benefits**:

- Convert push-based events to pull-based iteration
- Clean, readable syntax with `for/await`
- Automatic backpressure handling
- Easy to cancel with `break`

---

## 8. Complete Examples

### Example 1: Async Generator with Delays

```javascript
async function* countDown(start, delay) {
  for (let i = start; i >= 0; i--) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    yield i;
  }
}

async function launch() {
  for await (const count of countDown(10, 1000)) {
    console.log(count);
  }
  console.log('Liftoff!');
}
```

### Example 2: Processing Async Data Stream

```javascript
async function* fetchPages(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    const data = await response.json();
    yield data;
  }
}

async function processPages() {
  const urls = ['api/page1', 'api/page2', 'api/page3'];

  for await (const page of fetchPages(urls)) {
    console.log('Processing:', page);
  }
}
```

### Example 3: Combining Multiple Async Sources

```javascript
async function* merge(...asyncIterables) {
  const queue = new AsyncQueue();

  for (const iterable of asyncIterables) {
    (async () => {
      for await (const value of iterable) {
        queue.enqueue(value);
      }
    })();
  }

  for await (const value of queue) {
    yield value;
  }
}
```

---

## Key Concepts Summary

✅ **for/await loop** processes asynchronous sequences with Promise-based iteration
✅ **Async iterators** use `Symbol.asyncIterator` and return Promises from `next()`
✅ **Async generators** (`async function*`) are the easiest way to create async iterators
✅ **AsyncQueue** enables converting event streams to async iterables
✅ Values can be **dequeued before they're enqueued** (Promise waits)
✅ `for/await` works with both async and sync iterables (prefers async)
✅ Must be used inside **async functions** (like regular `await`)
✅ Great for **streams, events, and sequences of async operations**

---

## When to Use Asynchronous Iteration

**Use async iteration for**:

- Reading data streams (files, network)
- Processing sequences of async operations
- Handling repetitive events
- Real-time data feeds
- Paginated API responses

**Don't use for**:

- Single async operations (use `await`)
- Multiple independent operations (use `Promise.all()`)
- Synchronous iteration (use `for/of`)
