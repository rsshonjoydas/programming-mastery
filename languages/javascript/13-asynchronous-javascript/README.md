# JavaScript Asynchronous Programming

## What is Asynchronous Programming?

**Asynchronous programming** allows programs to perform operations without blocking execution while waiting for tasks to complete.

### Synchronous vs Asynchronous

**Synchronous (Blocking)**:

- Code executes line by line
- Each operation must complete before the next begins
- Program waits (blocks) for operations to finish

**Asynchronous (Non-blocking)**:

- Code can continue executing while waiting for operations
- Operations complete in the background
- Program doesn't wait, it moves on to other tasks

### Why JavaScript Needs Asynchronous Programming

JavaScript programs are typically **event-driven** and **I/O-bound**:

**In browsers**:

- Wait for user interactions (clicks, input)
- Fetch data from servers (HTTP requests)
- Load images and resources
- Wait for timers to complete

**On servers (Node.js)**:

- Wait for client requests
- Read/write files
- Query databases
- Make API calls

Without asynchronous programming, the entire program would freeze while waiting for these operations.

---

## Core Asynchronous Features in JavaScript

JavaScript provides three main features for asynchronous programming:

| Feature                         | Introduced    | Purpose                                       |
| ------------------------------- | ------------- | --------------------------------------------- |
| **Promises**                    | ES6 (2015)    | Represent future values from async operations |
| **async/await**                 | ES2017 (2017) | Write async code that looks synchronous       |
| **Async Iterators & for/await** | ES2018 (2018) | Work with streams of async events             |

**Important Note**: The JavaScript core language itself has **no built-in asynchronous features**. Async operations come from:

- **Browser APIs**: `setTimeout`, `fetch`, DOM events
- **Node.js APIs**: `fs.readFile`, HTTP requests, timers

---

## 1. Callbacks (Traditional Approach)

Before Promises, callbacks were the primary way to handle asynchronous operations.

### Basic Callback Pattern

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { user: 'Alice', age: 30 };
    callback(data);
  }, 1000);
}

fetchData((result) => {
  console.log(result); // Executes after 1 second
});
```

### Callback Hell (Pyramid of Doom)

Multiple nested callbacks become hard to read and maintain:

```javascript
getData(function (a) {
  getMoreData(a, function (b) {
    getEvenMoreData(b, function (c) {
      getYetMoreData(c, function (d) {
        getFinalData(d, function (e) {
          console.log(e);
        });
      });
    });
  });
});
```

**Problems**:

- Deeply nested code
- Error handling is complex
- Hard to read and maintain

---

## 2. Promises

Promises are objects representing the **eventual completion or failure** of an asynchronous operation.

### Promise States

A Promise is always in one of three states:

1. **Pending**: Initial state, operation in progress
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

Once settled (fulfilled or rejected), a Promise cannot change state.

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true;

    if (success) {
      resolve('Operation successful!'); // Fulfill
    } else {
      reject('Operation failed!'); // Reject
    }
  }, 1000);
});
```

### Consuming Promises

```javascript
promise
  .then((result) => {
    console.log(result); // Called when fulfilled
    return result + ' More data';
  })
  .then((newResult) => {
    console.log(newResult); // Chain multiple operations
  })
  .catch((error) => {
    console.error(error); // Called when rejected
  })
  .finally(() => {
    console.log('Cleanup'); // Always executes
  });
```

### Promise Methods

**`.then(onFulfilled, onRejected)`**: Handle success/failure

```javascript
promise.then(
  (result) => console.log(result),
  (error) => console.error(error)
);
```

**`.catch(onRejected)`**: Handle errors (shorthand)

```javascript
promise.catch((error) => console.error(error));
```

**`.finally(callback)`**: Execute cleanup code regardless of outcome

```javascript
promise.finally(() => console.log('Done'));
```

### Promise Chaining

Promises can be chained to sequence asynchronous operations:

```javascript
fetchUser()
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.error('Error:', error));
```

Each `.then()` returns a new Promise, enabling the chain.

### Static Promise Methods

**`Promise.resolve(value)`**: Create a fulfilled Promise

```javascript
Promise.resolve(42).then((x) => console.log(x)); // 42
```

**`Promise.reject(reason)`**: Create a rejected Promise

```javascript
Promise.reject('Error').catch((e) => console.log(e)); // Error
```

**`Promise.all(promises)`**: Wait for all Promises to fulfill

```javascript
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => {
    console.log('All completed');
  })
  .catch((error) => {
    console.log('One failed:', error); // Rejects if ANY fails
  });
```

**`Promise.race(promises)`**: Resolve/reject with first settled Promise

```javascript
Promise.race([promise1, promise2]).then((result) =>
  console.log('First to finish:', result)
);
```

**`Promise.allSettled(promises)`**: Wait for all to settle (ES2020)

```javascript
Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value);
    } else {
      console.log('Failed:', result.reason);
    }
  });
});
```

**`Promise.any(promises)`**: Resolve with first fulfilled Promise (ES2021)

```javascript
Promise.any([promise1, promise2, promise3])
  .then((result) => console.log('First success:', result))
  .catch((error) => console.log('All failed'));
```

---

## 3. async/await

`async`/`await` provides syntactic sugar over Promises, making asynchronous code look synchronous.

### async Functions

Functions declared with `async` automatically return a Promise:

```javascript
async function fetchData() {
  return 'Data'; // Automatically wrapped in Promise.resolve()
}

fetchData().then((data) => console.log(data)); // 'Data'
```

### await Keyword

`await` pauses execution until the Promise settles:

```javascript
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}
```

**Requirements**:

- `await` can only be used inside `async` functions
- `await` works with any Promise
- Execution pauses at `await` until Promise resolves

### Error Handling with try/catch

```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error('User not found');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
```

### Sequential vs Parallel Execution

**Sequential (one after another)**:

```javascript
async function sequential() {
  const user = await fetchUser(); // Wait 1s
  const posts = await fetchPosts(); // Wait 1s
  const comments = await fetchComments(); // Wait 1s
  // Total: ~3 seconds
}
```

**Parallel (simultaneous)**:

```javascript
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Total: ~1 second (fastest of the three)
}
```

### Top-Level await (ES2022)

In modules, you can use `await` at the top level:

```javascript
// In an ES module
const data = await fetch('/api/data');
console.log(data);
```

---

## 4. Asynchronous Iterators and for/await

Asynchronous iterators allow you to work with streams of asynchronous data.

### Async Iterators

Objects that implement the async iteration protocol:

```javascript
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  },
};
```

### for/await Loop

Iterates over async iterables:

```javascript
async function processStream() {
  for await (const value of asyncIterable) {
    console.log(value); // 1, 2, 3 (one at a time)
  }
}
```

### Async Generator Functions

Create async iterables easily:

```javascript
async function* fetchPages() {
  let page = 1;
  while (page <= 3) {
    const data = await fetch(`/api/page/${page}`);
    yield data;
    page++;
  }
}

async function getAllPages() {
  for await (const page of fetchPages()) {
    console.log(page);
  }
}
```

### Real-World Example: Processing Streams

```javascript
async function* readLines(reader) {
  let buffer = '';

  for await (const chunk of reader) {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line

    for (const line of lines) {
      yield line;
    }
  }

  if (buffer) yield buffer; // Yield remaining
}

// Usage
for await (const line of readLines(fileReader)) {
  console.log(line);
}
```

---

## Common Asynchronous Patterns

### 1. Timeout with Promise

```javascript
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delayedMessage() {
  console.log('Start');
  await timeout(2000);
  console.log('After 2 seconds');
}
```

### 2. Retry Logic

```javascript
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
  }
}
```

### 3. Debouncing Async Operations

```javascript
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  };
}
```

### 4. Parallel Limit

```javascript
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);

    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);

      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}
```

---

## Browser Asynchronous APIs

### setTimeout & setInterval

```javascript
// Execute once after delay
setTimeout(() => {
  console.log('After 1 second');
}, 1000);

// Execute repeatedly
const intervalId = setInterval(() => {
  console.log('Every 2 seconds');
}, 2000);

// Clear interval
clearInterval(intervalId);
```

### Fetch API

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### Event Listeners

```javascript
button.addEventListener('click', async () => {
  const data = await fetchData();
  console.log(data);
});
```

---

## Node.js Asynchronous APIs

### File System (Promises)

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}
```

### HTTP Requests

```javascript
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => resolve(data));
      response.on('error', reject);
    });
  });
}
```

---

## Error Handling Best Practices

### 1. Always Handle Rejections

```javascript
// Bad
promise.then((result) => console.log(result));

// Good
promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

### 2. Use try/catch with async/await

```javascript
async function safeOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    return null; // Provide fallback
  }
}
```

### 3. Handle Unhandled Rejections

```javascript
// Browser
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

// Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});
```

---

## Key Concepts Summary

✅ **Asynchronous programming** prevents blocking while waiting for operations
✅ **Callbacks** were the original async pattern (prone to callback hell)
✅ **Promises** represent future values with three states: pending, fulfilled, rejected
✅ **Promise chaining** sequences async operations cleanly
✅ **async/await** makes async code look synchronous (syntactic sugar over Promises)
✅ **await** pauses execution until Promise resolves (only in async functions)
✅ **for/await** loops iterate over async iterables
✅ **Async generators** create streams of async data
✅ **Promise.all()** waits for multiple Promises in parallel
✅ **Error handling** requires `.catch()` or `try/catch` blocks
✅ JavaScript core has **no async features**—they come from browser/Node.js APIs

---

## When to Use Each Approach

| Use Case                             | Best Approach                       |
| ------------------------------------ | ----------------------------------- |
| Simple async operation               | Promise with `.then()`              |
| Multiple sequential async operations | `async/await`                       |
| Multiple parallel async operations   | `Promise.all()` with `async/await`  |
| Stream of async events               | `for/await` loop                    |
| Need to wait for first/any result    | `Promise.race()` or `Promise.any()` |
| Complex error handling               | `async/await` with `try/catch`      |
| Legacy code compatibility            | Callbacks                           |
