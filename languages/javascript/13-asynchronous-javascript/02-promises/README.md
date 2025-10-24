# JavaScript Promises

## What Are Promises?

A **Promise** is an object that represents the result of an **asynchronous computation**. The result may not be ready yet, and you cannot synchronously get the value—you can only ask the Promise to call a callback function when the value is ready.

**Key characteristics**:

- Simplifies asynchronous programming compared to callbacks
- Prevents "callback hell" (deeply nested callbacks)
- Standardizes error handling for async operations
- Creates linear, readable chains of async operations
- Represents **single** async computations (not repeated operations)

---

## Promise States and Terminology

A Promise can be in one of three states:

| State         | Description                                   |
| ------------- | --------------------------------------------- |
| **Pending**   | Initial state; neither fulfilled nor rejected |
| **Fulfilled** | Operation completed successfully              |
| **Rejected**  | Operation failed                              |

**Additional terms**:

- **Settled**: Promise is either fulfilled or rejected (no longer pending)
- **Resolved**: Promise has become associated with another Promise (may still be pending)

**Important**: Once a Promise settles, it cannot change states (fulfilled ↔ rejected).

---

## Basic Promise Usage

### Creating a Promise-Based Function

```javascript
// Promise-returning function (no callback argument)
function getJSON(url) {
  return fetch(url).then((response) => response.json());
}

// Using the Promise
getJSON('/api/user/profile').then((jsonData) => {
  // Callback invoked when data is ready
  console.log(jsonData);
});
```

### The then() Method

The `then()` method registers callbacks to handle Promise results:

```javascript
promise.then(onFulfilled, onRejected);
```

- **First argument**: Called when Promise fulfills (success)
- **Second argument**: Called when Promise rejects (error) - optional
- **Returns**: A new Promise

**Key behavior**:

- Callbacks are invoked asynchronously (even if Promise is already settled)
- Multiple `then()` calls register multiple callbacks
- Each callback is invoked only once

### Idiomatic Promise Usage

```javascript
// Chaining then() directly to the function call
getJSON('/api/user/profile').then(displayUserProfile);

// Reads like English: "Get JSON, then display user profile"
```

---

## Error Handling with Promises

### Method 1: Two Callbacks to then()

```javascript
getJSON('/api/user/profile').then(
  displayUserProfile, // Success handler
  handleProfileError // Error handler
);
```

### Method 2: Using catch() (Preferred)

```javascript
getJSON('/api/user/profile').then(displayUserProfile).catch(handleProfileError); // Handles errors from getJSON() or displayUserProfile()
```

**Why catch() is better**:

- Catches errors from both the Promise and the callback
- More idiomatic and readable
- Matches try/catch syntax

### The finally() Method (ES2018)

Runs cleanup code regardless of success or failure:

```javascript
fetch('/api/data')
  .then(processData)
  .catch(handleError)
  .finally(() => {
    closeConnection(); // Always runs
  });
```

**Characteristics**:

- Callback receives no arguments
- Cannot determine if fulfilled or rejected
- Returns a new Promise
- Generally passes through the original value/error
- If callback throws, returned Promise rejects with that error

### Comprehensive Error Handling Example

```javascript
fetch('/api/user/profile')
  .then((response) => {
    if (!response.ok) {
      return null; // Handle 404 as non-error
    }

    let type = response.headers.get('content-type');
    if (type !== 'application/json') {
      throw new TypeError(`Expected JSON, got ${type}`);
    }

    return response.json();
  })
  .then((profile) => {
    if (profile) {
      displayUserProfile(profile);
    } else {
      displayLoggedOutProfilePage();
    }
  })
  .catch((e) => {
    if (e instanceof NetworkError) {
      displayErrorMessage('Check your internet connection.');
    } else if (e instanceof TypeError) {
      displayErrorMessage('Something is wrong with our server!');
    } else {
      console.error(e);
    }
  });
```

---

## Promise Chaining

Promises shine when expressing sequences of async operations:

### Basic Chain

```javascript
fetch(url)
  .then((response) => response.json()) // Returns a Promise
  .then((data) => {
    processData(data);
    return transformedData;
  })
  .then((transformed) => {
    displayResults(transformed);
  })
  .catch((error) => handleError(error));
```

### How Chaining Works

```javascript
fetch(url) // Returns Promise p1
  .then(c1) // Returns Promise p2
  .then(c2); // Returns Promise p3
```

**Execution flow**:

1. `fetch()` initiates HTTP request, returns Promise p1
2. `then(c1)` registers callback, returns Promise p2
3. `then(c2)` registers callback, returns Promise p3
4. When p1 fulfills, c1 is invoked with the Response
5. c1's return value is used to fulfill/resolve p2
6. When p2 fulfills, c2 is invoked with that value
7. Process continues down the chain

**Critical point**: Each `then()` returns a **new** Promise, not the same one.

---

## Promise Resolution

Understanding "resolved" is key to mastering Promises:

### What Happens When a Callback Returns

When callback `c` returns value `v`:

**Case 1: v is not a Promise**

- Promise is immediately **fulfilled** with value v

**Case 2: v is a Promise**

- Promise is **resolved** (but not yet fulfilled)
- Promise becomes "locked onto" the returned Promise
- Fulfillment/rejection depends on the returned Promise

### Example: Understanding Resolution

```javascript
function c1(response) {
  let p4 = response.json(); // Returns a Promise
  return p4;
}

let p1 = fetch('/api/user/profile'); // Promise 1
let p2 = p1.then(c1); // Promise 2
let p3 = p2.then(c2); // Promise 3
```

**What happens**:

- c1 returns Promise p4
- p2 is **resolved** with p4 (not fulfilled yet)
- When p4 fulfills, p2 fulfills with the same value
- Then c2 is invoked with that value

---

## Error Propagation in Chains

Errors "trickle down" the Promise chain until caught:

```javascript
startAsyncOperation()
  .then(doStageTwo)
  .catch(recoverFromStageTwoError) // Catches errors from stages 1-2
  .then(doStageThree)
  .then(doStageFour)
  .catch(logStageThreeAndFourErrors); // Catches errors from stages 3-4
```

**Key behaviors**:

- `catch()` only invoked if a previous stage throws
- If previous callback succeeds, `catch()` is skipped
- `catch()` can recover from errors by returning normally
- Errors stop propagating after being caught (unless re-thrown)

### Retrying Failed Operations

```javascript
queryDatabase()
  .catch((e) => wait(500).then(queryDatabase)) // Retry after delay
  .then(displayTable)
  .catch(displayDatabaseError);
```

### Common Mistake: Forgetting to Return

```javascript
// ❌ WRONG: Missing return
.catch(e => { wait(500).then(queryDatabase) })  // Returns undefined!

// ✅ CORRECT: Returns the Promise
.catch(e => wait(500).then(queryDatabase))
```

---

## Promises in Parallel

### Promise.all()

Runs multiple Promises concurrently, waits for all to complete:

```javascript
const urls = ['/api/user', '/api/posts', '/api/comments'];
const promises = urls.map((url) => fetch(url).then((r) => r.json()));

Promise.all(promises)
  .then((results) => {
    // results is an array of all fulfilled values
    let [user, posts, comments] = results;
  })
  .catch((e) => console.error(e)); // Rejects if ANY Promise rejects
```

**Characteristics**:

- Input: Array of Promises (non-Promise values are treated as fulfilled)
- Returns: Promise that fulfills to an array of all results
- **Rejects immediately** if any input Promise rejects
- Other Promises may still be pending when rejection occurs

### Promise.allSettled() (ES2020)

Waits for all Promises, never rejects:

```javascript
Promise.allSettled([Promise.resolve(1), Promise.reject(2), 3]).then(
  (results) => {
    results[0]; // { status: "fulfilled", value: 1 }
    results[1]; // { status: "rejected", reason: 2 }
    results[2]; // { status: "fulfilled", value: 3 }
  }
);
```

**Use when**: You want results from all Promises regardless of failures

### Promise.race()

Returns when the **first** Promise settles:

```javascript
Promise.race([
  fetch('/fast-server'),
  fetch('/slow-server'),
  timeout(5000),
]).then((result) => {
  // result is from whichever Promise settled first
});
```

**Use when**: You only care about the fastest response

---

## Creating Your Own Promises

### Method 1: Based on Other Promises

Chain off existing Promise-returning functions:

```javascript
function getJSON(url) {
  return fetch(url).then((response) => response.json());
}

function getHighScore() {
  return getJSON('/api/user/profile').then((profile) => profile.highScore);
}
```

### Method 2: From Synchronous Values

Use static methods when no async work is needed:

```javascript
Promise.resolve(value); // Fulfilled Promise
Promise.reject(error); // Rejected Promise
```

**Example**:

```javascript
function validateUser(user) {
  if (!user.email) {
    return Promise.reject(new Error('Email required'));
  }
  return Promise.resolve(user);
}
```

**Note**: These Promises settle asynchronously (not immediately) after current code finishes.

### Method 3: Using the Promise Constructor

For complete control, use `new Promise()`:

```javascript
function wait(duration) {
  return new Promise((resolve, reject) => {
    if (duration < 0) {
      reject(new Error('Time travel not yet implemented'));
    }
    setTimeout(resolve, duration);
  });
}
```

**How it works**:

1. Pass a function to `new Promise()`
2. Function receives `resolve` and `reject` parameters
3. Call `resolve(value)` to fulfill the Promise
4. Call `reject(error)` to reject the Promise
5. Constructor returns the Promise immediately

### Complete Example: Custom getJSON() for Node.js

```javascript
const http = require('http');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    let request = http.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP status ${response.statusCode}`));
        response.resume();
        return;
      }

      if (response.headers['content-type'] !== 'application/json') {
        reject(new Error('Invalid content-type'));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf-8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    request.on('error', (error) => reject(error));
  });
}
```

---

## Promises in Sequence

Running Promises one after another (not in parallel):

### Method 1: Building a Dynamic Chain

```javascript
function fetchSequentially(urls) {
  const bodies = [];

  function fetchOne(url) {
    return fetch(url)
      .then((response) => response.text())
      .then((body) => {
        bodies.push(body);
      });
  }

  let p = Promise.resolve(undefined);

  for (let url of urls) {
    p = p.then(() => fetchOne(url));
  }

  return p.then(() => bodies);
}

// Usage
fetchSequentially(urls)
  .then((bodies) => console.log(bodies))
  .catch(console.error);
```

### Method 2: Generic Sequential Processor

```javascript
function promiseSequence(inputs, promiseMaker) {
  inputs = [...inputs]; // Copy array

  function handleNextInput(outputs) {
    if (inputs.length === 0) {
      return outputs; // All done
    }

    let nextInput = inputs.shift();
    return promiseMaker(nextInput)
      .then((output) => outputs.concat(output))
      .then(handleNextInput); // "Recursive" call
  }

  return Promise.resolve([]).then(handleNextInput);
}

// Usage
function fetchBody(url) {
  return fetch(url).then((r) => r.text());
}

promiseSequence(urls, fetchBody)
  .then((bodies) => console.log(bodies))
  .catch(console.error);
```

---

## Key Concepts Summary

✅ **Promises represent single async computations** (not repeated operations)
✅ **Three states**: Pending, Fulfilled, Rejected
✅ **Settled** = Fulfilled or Rejected (cannot change after)
✅ **Resolved** = Associated with another Promise
✅ **then()** registers callbacks and returns a new Promise
✅ **catch()** is shorthand for `then(null, errorHandler)`
✅ **finally()** runs cleanup code regardless of outcome
✅ **Chaining** creates linear sequences of async operations
✅ **Error propagation** flows down the chain until caught
✅ **Promise.all()** runs Promises in parallel, rejects if any fail
✅ **Promise.allSettled()** waits for all, never rejects
✅ **Promise.race()** returns first settled Promise
✅ **new Promise()** creates Promises from scratch
✅ **Always return** from Promise callbacks to maintain the chain

---

## Best Practices

🎯 **End chains with .catch()** to handle errors
🎯 **Use catch() over second then() argument** for error handling
🎯 **Always return values** from callbacks (avoid forgetting with arrow functions)
🎯 **Use Promise.resolve/reject** for synchronous special cases
🎯 **Prefer async/await** for even cleaner async code (covered separately)
🎯 **Don't nest Promises** like callbacks—use chaining instead
🎯 **Use Promise.all()** when operations can run concurrently
🎯 **Use sequential execution** when order matters or to limit concurrency
