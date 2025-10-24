# JavaScript Asynchronous Programming with Callbacks

## What is Asynchronous Programming?

**Asynchronous programming** allows JavaScript to perform long-running operations without blocking the execution of other code. Instead of waiting for an operation to complete, you provide a **callback function** that gets invoked when the operation finishes.

### What is a Callback?

A **callback** is a function that you write and pass to another function. That function then invokes ("calls back") your function when:

- A condition is met
- An asynchronous event occurs
- An operation completes

**Basic pattern**:

```javascript
function doSomethingAsync(callback) {
  // Perform async operation
  // When done, invoke the callback
  callback(result);
}

// Usage
doSomethingAsync(function (result) {
  console.log('Operation completed:', result);
});
```

---

## 1. Timers

Timers are the simplest form of asynchronous programming, allowing you to execute code after a delay.

### setTimeout()

Executes a callback **once** after a specified delay:

```javascript
setTimeout(checkForUpdates, 60000);
// Calls checkForUpdates() after 60,000ms (1 minute)
```

**Syntax**:

```javascript
setTimeout(callbackFunction, delayInMilliseconds);
```

**With arguments**:

```javascript
setTimeout(
  function (name) {
    console.log('Hello, ' + name);
  },
  1000,
  'Alice'
);
// Passes "Alice" as argument after 1 second
```

**Canceling timeouts**:

```javascript
let timerId = setTimeout(myFunction, 5000);
clearTimeout(timerId); // Cancel before it executes
```

### setInterval()

Executes a callback **repeatedly** at specified intervals:

```javascript
// Call checkForUpdates every minute
let updateIntervalId = setInterval(checkForUpdates, 60000);

// Stop the repeated calls
function stopCheckingForUpdates() {
  clearInterval(updateIntervalId);
}
```

**Syntax**:

```javascript
setInterval(callbackFunction, intervalInMilliseconds);
```

**Example - Digital clock**:

```javascript
let clockId = setInterval(function () {
  console.log(new Date().toLocaleTimeString());
}, 1000);

// Stop after 10 seconds
setTimeout(function () {
  clearInterval(clockId);
}, 10000);
```

---

## 2. Events (Client-Side JavaScript)

Client-side JavaScript is **event-driven**: programs wait for user actions and respond with callbacks.

### Event Listeners

Register callback functions to respond to events using `addEventListener()`:

```javascript
// Get a button element
let okay = document.querySelector('#confirmUpdateDialog button.okay');

// Register callback for click event
okay.addEventListener('click', applyUpdate);
```

**Syntax**:

```javascript
element.addEventListener(eventType, callbackFunction);
```

### Common Event Types

| Event         | Description               |
| ------------- | ------------------------- |
| `'click'`     | Mouse click or touch tap  |
| `'keydown'`   | Key pressed down          |
| `'keyup'`     | Key released              |
| `'submit'`    | Form submitted            |
| `'load'`      | Resource finished loading |
| `'change'`    | Input value changed       |
| `'mouseover'` | Mouse moved over element  |

### Event Handler with Details

Event callbacks receive an event object with details:

```javascript
button.addEventListener('click', function (event) {
  console.log('Button clicked at:', event.clientX, event.clientY);
  console.log('Time:', event.timeStamp);
  event.preventDefault(); // Prevent default action
});
```

### Alternative: Property Assignment

Instead of `addEventListener()`, you can assign directly to event properties:

```javascript
button.onclick = function () {
  console.log('Button clicked!');
};
```

**Convention**: Event properties always start with `on` (onclick, onload, onerror, etc.)

**addEventListener() vs property assignment**:

- `addEventListener()`: Can register multiple handlers
- Property assignment: Simpler, but only one handler per event

---

## 3. Network Events

Asynchronous network requests are handled with callbacks.

### XMLHttpRequest Example

```javascript
function getCurrentVersionNumber(versionCallback) {
  // Create HTTP request
  let request = new XMLHttpRequest();
  request.open('GET', 'http://www.example.com/api/version');
  request.send();

  // Register callback for successful response
  request.onload = function () {
    if (request.status === 200) {
      // Success: parse response and call callback
      let currentVersion = parseFloat(request.responseText);
      versionCallback(null, currentVersion);
    } else {
      // HTTP error: report to callback
      versionCallback(response.statusText, null);
    }
  };

  // Register callbacks for network errors
  request.onerror = request.ontimeout = function (e) {
    versionCallback(e.type, null);
  };
}
```

**Usage**:

```javascript
getCurrentVersionNumber(function (error, version) {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Current version:', version);
  }
});
```

### Key Points

1. **Asynchronous functions can't return values directly** - they must use callbacks
2. **Error-first callback pattern**: First argument is error (or null), second is result
3. **Multiple event handlers**: onload, onerror, ontimeout for different outcomes

---

## 4. Callbacks in Node.js

Node.js is deeply asynchronous with callback-based APIs.

### File System Operations

Reading files asynchronously:

```javascript
const fs = require('fs');

let options = {
  // default options
};

// Read config file asynchronously
fs.readFile('config.json', 'utf-8', (err, text) => {
  if (err) {
    // Handle error
    console.warn('Could not read config file:', err);
  } else {
    // Parse and use file contents
    Object.assign(options, JSON.parse(text));
  }

  // Continue program execution
  startProgram(options);
});
```

**Pattern**: Node callbacks typically follow **error-first convention**:

- First parameter: error (or null if successful)
- Subsequent parameters: result data

### HTTP Requests in Node

Using event-based APIs with `on()` method:

```javascript
const https = require('https');

function getText(url, callback) {
  // Start HTTP GET request
  let request = https.get(url);

  // Register handler for "response" event
  request.on('response', (response) => {
    let httpStatus = response.statusCode;

    response.setEncoding('utf-8');
    let body = '';

    // Handler for data chunks
    response.on('data', (chunk) => {
      body += chunk;
    });

    // Handler for complete response
    response.on('end', () => {
      if (httpStatus === 200) {
        callback(null, body);
      } else {
        callback(httpStatus, null);
      }
    });
  });

  // Handler for network errors
  request.on('error', (err) => {
    callback(err, null);
  });
}
```

**Usage**:

```javascript
getText('https://api.example.com/data', function (error, text) {
  if (error) {
    console.error('Request failed:', error);
  } else {
    console.log('Response:', text);
  }
});
```

### Node.js Event Registration

- **Browser**: `addEventListener(eventType, callback)`
- **Node.js**: `on(eventType, callback)`

Both do the same thing with different method names.

---

## Callback Patterns

### 1. Error-First Callbacks (Node.js Convention)

```javascript
function asyncOperation(param, callback) {
  // Perform operation
  if (error) {
    callback(error, null); // Error case
  } else {
    callback(null, result); // Success case
  }
}

// Usage
asyncOperation(value, function (err, result) {
  if (err) {
    // Handle error
  } else {
    // Use result
  }
});
```

### 2. Multiple Arguments

```javascript
function fetchUserData(userId, callback) {
  // Fetch data
  callback(null, userData, permissions, preferences);
}

fetchUserData(123, function (err, user, perms, prefs) {
  // Handle all data
});
```

### 3. Callback Hell (Pyramid of Doom)

Nested callbacks can become difficult to read:

```javascript
getData(function (a) {
  getMoreData(a, function (b) {
    getEvenMoreData(b, function (c) {
      getFinalData(c, function (d) {
        // Finally do something with d
      });
    });
  });
});
```

**Solutions**:

- Named functions instead of anonymous
- Promises (modern alternative)
- Async/await (even better)

---

## Common Use Cases

### 1. User Interaction

```javascript
document.getElementById('myButton').addEventListener('click', function () {
  console.log('Button clicked!');
});
```

### 2. Data Loading

```javascript
loadUserData(userId, function (error, userData) {
  if (error) {
    showError(error);
  } else {
    displayUserProfile(userData);
  }
});
```

### 3. Animation and Timing

```javascript
function fadeOut(element, duration) {
  let opacity = 1;
  let interval = setInterval(function () {
    opacity -= 0.1;
    element.style.opacity = opacity;

    if (opacity <= 0) {
      clearInterval(interval);
      element.style.display = 'none';
    }
  }, duration / 10);
}
```

### 4. Sequential Operations

```javascript
step1(function (result1) {
  step2(result1, function (result2) {
    step3(result2, function (result3) {
      console.log('All steps complete:', result3);
    });
  });
});
```

---

## Best Practices

✅ **Use error-first callbacks** in Node.js for consistency
✅ **Always handle errors** in callback functions
✅ **Avoid deep nesting** - use named functions or Promises
✅ **Clear timers and intervals** when no longer needed
✅ **Remove event listeners** when elements are removed from DOM
✅ **Use arrow functions** for concise callback syntax (ES6+)
✅ **Document callback parameters** clearly
✅ **Consider Promises/async-await** for complex async flows

---

## Key Concepts Summary

📌 **Callbacks** are functions passed to other functions to be invoked later
📌 **Timers** (`setTimeout`, `setInterval`) schedule code execution
📌 **Events** trigger callbacks in response to user actions or system events
📌 **Network requests** use callbacks to handle asynchronous responses
📌 **Error-first pattern** (Node.js): First parameter is error, rest are results
📌 **addEventListener()** (browser) vs **on()** (Node.js) for event registration
📌 **Callback hell** occurs with deeply nested callbacks
📌 **Asynchronous functions can't return values** - must use callbacks
📌 **Multiple layers** of async operations require nested callbacks
📌 **Modern alternatives** include Promises and async/await syntax
