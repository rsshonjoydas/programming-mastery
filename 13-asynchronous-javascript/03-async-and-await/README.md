# JavaScript Async and Await

## What are Async and Await?

**async** and **await** are ES2017 keywords that simplify working with Promises, allowing you to write asynchronous code that looks and behaves like synchronous code.

**Key benefits**:

- Dramatically simplify Promise-based code
- Make asynchronous code readable and easy to reason about
- Hide Promise complexity while maintaining asynchronous behavior
- Allow returning values and throwing exceptions naturally

---

## Understanding await Expressions

The `await` keyword takes a Promise and converts it back into a return value or thrown exception.

### Syntax

```javascript
let result = await promiseExpression;
```

### How await Works

**When Promise fulfills**:

```javascript
let response = await fetch('/api/user/profile');
// response contains the fulfillment value
```

**When Promise rejects**:

```javascript
try {
  let data = await fetch('/api/invalid');
} catch (error) {
  // error contains the rejection value
  console.error(error);
}
```

### Common Usage Pattern

```javascript
// Don't usually await a Promise variable
let p = fetch('/api/data');
let result = await p; // Works, but uncommon

// Instead, await the function call directly
let response = await fetch('/api/user/profile');
let profile = await response.json();
```

### Critical Understanding

**await does NOT block your program**:

- Code remains **asynchronous**
- `await` simply **disguises** the asynchronous nature
- Your program continues to be responsive
- Other code can execute while waiting

```javascript
console.log('Start');
let data = await fetchData(); // Doesn't block the event loop
console.log('Data received');
```

---

## Async Functions

### The Critical Rule

**You can ONLY use `await` inside functions declared with `async`**

```javascript
// ✅ Correct - await inside async function
async function getData() {
  let result = await fetch("/api/data");
  return result.json();
}

// ❌ Wrong - await outside async function
function getData() {
  let result = await fetch("/api/data");  // SyntaxError!
  return result.json();
}
```

### Declaring Async Functions

```javascript
async function getHighScore() {
  let response = await fetch('/api/user/profile');
  let profile = await response.json();
  return profile.highScore;
}
```

### What Async Does

An `async` function **always returns a Promise**, even if no Promise-related code appears in the body.

**Return value handling**:

```javascript
async function getValue() {
  return 42; // Looks synchronous
}

// Equivalent to:
function getValue() {
  return Promise.resolve(42);
}

// Usage:
getValue().then((value) => console.log(value)); // 42
```

**Exception handling**:

```javascript
async function throwError() {
  throw new Error('Something went wrong');
}

// Equivalent to:
function throwError() {
  return Promise.reject(new Error('Something went wrong'));
}

// Usage:
throwError().catch((error) => console.error(error));
```

### Return Value Rules

| Code in async function | Actual return value                  |
| ---------------------- | ------------------------------------ |
| `return value;`        | Promise that resolves to `value`     |
| `throw error;`         | Promise that rejects with `error`    |
| No return statement    | Promise that resolves to `undefined` |

---

## Using Async Functions

### Calling Async Functions

**Inside another async function** (can use await):

```javascript
async function displayUserScore() {
  let score = await getHighScore(); // Clean and readable
  displayScore(score);
}
```

**At top level or non-async function** (must use .then()):

```javascript
// Can't use await here
getHighScore().then(displayHighScore).catch(console.error);
```

**Nesting await expressions**:

```javascript
async function processUser() {
  let user = await getUser();
  let profile = await getProfile(user.id);
  let settings = await getSettings(profile.id);
  return settings;
}
```

### Async with Different Function Types

```javascript
// Function declaration
async function func1() {}

// Function expression
const func2 = async function () {};

// Arrow function
const func3 = async () => {};

// Method in object literal
const obj = {
  async method() {},
};

// Class method
class MyClass {
  async method() {}
}
```

---

## Awaiting Multiple Promises

### Sequential vs Concurrent Execution

**Problem: Unnecessarily `sequential`**

```javascript
async function getTwoValues() {
  let value1 = await getJSON(url1); // Waits for url1
  let value2 = await getJSON(url2); // Then waits for url2
  return [value1, value2];
}
// Total time: time(url1) + time(url2)
```

**Solution: Concurrent execution with `Promise.all()`**

```javascript
async function getTwoValues() {
  let [value1, value2] = await Promise.all([getJSON(url1), getJSON(url2)]);
  return [value1, value2];
}
// Total time: max(time(url1), time(url2))
```

### When to Use Each Approach

**Use sequential (separate awaits)** when:

- Second request depends on first result
- Order matters

```javascript
async function getUserAndPosts() {
  let user = await getUser(userId);
  let posts = await getPosts(user.id); // Needs user.id
  return { user, posts };
}
```

**Use concurrent (Promise.all)** when:

- Requests are independent
- Want to minimize total time

```javascript
async function getDashboardData() {
  let [users, posts, comments] = await Promise.all([
    getUsers(),
    getPosts(),
    getComments(),
  ]);
  return { users, posts, comments };
}
```

---

## Implementation Details

### How Async Functions Work Under the Hood

**Your async function**:

```javascript
async function f(x) {
  // body
}
```

**Conceptually equivalent to**:

```javascript
function f(x) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(
        (function (x) {
          // body
        })(x)
      );
    } catch (e) {
      reject(e);
    }
  });
}
```

### **How await Works**

The `await` keyword acts as a **marker** that breaks the function into separate synchronous chunks.

**Original code**:

```javascript
async function example() {
  let a = await promise1();
  let b = await promise2();
  return a + b;
}
```

**Conceptually broken into**:

```javascript
function example() {
  return promise1().then((a) => {
    return promise2().then((b) => {
      return a + b;
    });
  });
}
```

The interpreter transforms each `await` into a `.then()` call, passing the subsequent code as a callback.

---

## Error Handling

### Try-Catch with Async/Await

```javascript
async function fetchUserData() {
  try {
    let response = await fetch('/api/user');
    let data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw or handle
  }
}
```

### Multiple Error Sources

```javascript
async function processData() {
  try {
    let data = await fetchData(); // Could fail
    let processed = await process(data); // Could fail
    let saved = await save(processed); // Could fail
    return saved;
  } catch (error) {
    // Catches errors from any await
    console.error('Error in pipeline:', error);
  }
}
```

### Finally Block

```javascript
async function fetchWithCleanup() {
  let connection;
  try {
    connection = await openConnection();
    let data = await fetchData(connection);
    return data;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Always runs
    if (connection) {
      await connection.close();
    }
  }
}
```

---

## Complete Example

```javascript
// Async function with full error handling
async function getJSON(url) {
  try {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    let body = await response.json();
    return body;
  } catch (error) {
    console.error('Failed to fetch JSON:', error);
    throw error;
  }
}

// Using the async function
async function displayUserProfile() {
  try {
    // Sequential - second depends on first
    let user = await getJSON('/api/user');
    let profile = await getJSON(`/api/profile/${user.id}`);

    // Concurrent - independent requests
    let [posts, comments] = await Promise.all([
      getJSON(`/api/posts/${user.id}`),
      getJSON(`/api/comments/${user.id}`),
    ]);

    return { profile, posts, comments };
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

// Top-level usage
displayUserProfile()
  .then((data) => {
    if (data) {
      console.log('Profile loaded:', data);
    }
  })
  .catch(console.error);
```

---

## Best Practices

✅ **Always use `async`** when you need to use `await`
✅ **Use try-catch** for error handling in async functions
✅ **Use Promise.all()** for concurrent operations
✅ **Avoid sequential awaits** when operations are independent
✅ **Return early** from async functions when possible
✅ **Re-throw errors** if you can't handle them
✅ **Use finally** for cleanup operations
✅ **Remember**: async functions always return Promises

---

## Common Patterns

### Pattern 1: Async IIFE (Immediately Invoked Function Expression)

```javascript
(async () => {
  let data = await fetchData();
  console.log(data);
})();
```

### Pattern 2: Conditional Awaits

```javascript
async function getData(useCache) {
  if (useCache) {
    return await getCachedData();
  } else {
    return await fetchFreshData();
  }
}
```

### Pattern 3: Sequential Processing with Loop

```javascript
async function processItems(items) {
  let results = [];
  for (let item of items) {
    let result = await processItem(item);
    results.push(result);
  }
  return results;
}
```

### Pattern 4: Retry Logic

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

---

## Key Concepts Summary

📌 **async/await** simplify Promise-based asynchronous code
📌 **await** converts Promises to values or thrown exceptions
📌 **await does NOT block** - code remains asynchronous
📌 **await only works** inside async functions
📌 **async functions** always return Promises
📌 **Return values** become fulfilled Promise values
📌 **Thrown exceptions** become rejected Promise values
📌 **Use Promise.all()** for concurrent operations
📌 **Use try-catch** for error handling
📌 **Sequential awaits** can be inefficient
📌 **Async functions** can be nested infinitely deep
