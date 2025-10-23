# JavaScript Timers

Timers allow JavaScript programs to schedule function execution after a delay or at repeated intervals. While not part of the core language specification, `setTimeout()` and `setInterval()` are universally supported in browsers and Node.js, making them a de facto standard.

---

## setTimeout()

Schedules a function to be invoked **once** after a specified delay.

### Syntax

```javascript
let timerId = setTimeout(callback, delay, arg1, arg2, ...);
```

**Parameters**:

- `callback`: Function to execute
- `delay`: Milliseconds to wait before execution (default: 0)
- `arg1, arg2, ...`: Optional arguments passed to the callback

**Returns**: Timer ID (number in browsers, object in Node.js)

### Basic Usage

```javascript
setTimeout(() => {
  console.log('Ready...');
}, 1000);

setTimeout(() => {
  console.log('set...');
}, 2000);

setTimeout(() => {
  console.log('go!');
}, 3000);
```

**Output** (after delays):

```text
Ready...    // After 1 second
set...      // After 2 seconds
go!         // After 3 seconds
```

### Important Behaviors

**Non-blocking execution**:

```javascript
console.log('Start');
setTimeout(() => console.log('Delayed'), 1000);
console.log('End');

// Output immediately:
// Start
// End
// (then after 1 second): Delayed
```

**Zero delay doesn't mean immediate**:

```javascript
setTimeout(() => {
  console.log("This runs 'as soon as possible'");
}, 0);

console.log('This runs first');

// Output:
// This runs first
// This runs 'as soon as possible'
```

When delay is `0` or omitted, the function is scheduled to run "as soon as possible" after the current code finishes, not immediately. Actual delay may be 10ms or more if the system is busy.

### Passing Arguments to Callback

```javascript
function greet(name, message) {
  console.log(`${message}, ${name}!`);
}

setTimeout(greet, 1000, 'Alice', 'Hello');
// After 1 second: "Hello, Alice!"
```

### Using with 'this' Context

```javascript
const obj = {
  name: 'MyObject',
  delayedLog() {
    setTimeout(() => {
      console.log(this.name); // Arrow function preserves 'this'
    }, 1000);
  },
};

obj.delayedLog(); // "MyObject" after 1 second
```

---

## setInterval()

Invokes a function **repeatedly** at specified intervals.

### **Syntax**

```javascript
let intervalId = setInterval(callback, delay, arg1, arg2, ...);
```

**Parameters**: Same as `setTimeout()`

**Returns**: Interval ID for cancellation

### **Basic Usage**

```javascript
let count = 0;

let intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);
}, 1000);

// Output every second:
// Count: 1
// Count: 2
// Count: 3
// ... (continues forever until cleared)
```

### Stopping Intervals

Use `clearInterval()` to stop repeating execution:

```javascript
let counter = 0;

let intervalId = setInterval(() => {
  counter++;
  console.log(counter);

  if (counter >= 5) {
    clearInterval(intervalId);
    console.log('Stopped!');
  }
}, 1000);

// Output:
// 1
// 2
// 3
// 4
// 5
// Stopped!
```

---

## clearTimeout() and clearInterval()

Cancel scheduled or repeating timers.

### clearTimeout()

Cancels a timer set by `setTimeout()`:

```javascript
let timerId = setTimeout(() => {
  console.log('This will never run');
}, 5000);

// Cancel before it executes
clearTimeout(timerId);
```

### clearInterval()

Stops a repeating timer set by `setInterval()`:

```javascript
let intervalId = setInterval(() => {
  console.log('Repeating...');
}, 1000);

// Stop after 3 seconds
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Stopped!');
}, 3000);
```

---

## Practical Examples

### Example 1: Digital Clock

```javascript
// Display current time every second
let clock = setInterval(() => {
  console.clear();
  console.log(new Date().toLocaleTimeString());
}, 1000);

// Stop after 10 seconds
setTimeout(() => {
  clearInterval(clock);
  console.log('Clock stopped');
}, 10000);
```

### Example 2: Countdown Timer

```javascript
function countdown(seconds) {
  let remaining = seconds;

  console.log(remaining);

  let intervalId = setInterval(() => {
    remaining--;
    console.log(remaining);

    if (remaining <= 0) {
      clearInterval(intervalId);
      console.log("Time's up!");
    }
  }, 1000);
}

countdown(5);
// Output:
// 5
// 4
// 3
// 2
// 1
// 0
// Time's up!
```

### Example 3: Delayed Function Chain

```javascript
function delayedSequence() {
  setTimeout(() => {
    console.log('Step 1');

    setTimeout(() => {
      console.log('Step 2');

      setTimeout(() => {
        console.log('Step 3');
      }, 1000);
    }, 1000);
  }, 1000);
}

delayedSequence();
// Step 1 (after 1s)
// Step 2 (after 2s)
// Step 3 (after 3s)
```

### Example 4: Debouncing User Input

```javascript
let timerId;

function handleInput(value) {
  // Clear previous timer
  clearTimeout(timerId);

  // Set new timer
  timerId = setTimeout(() => {
    console.log('Processing:', value);
    // Perform expensive operation here
  }, 500);
}

// Simulating rapid user input
handleInput('h');
handleInput('he');
handleInput('hel');
handleInput('hell');
handleInput('hello');
// Only processes "hello" after 500ms of no input
```

### Example 5: Polling

```javascript
function checkStatus() {
  console.log('Checking status...');

  // Simulate API call
  let status = Math.random() > 0.7 ? 'ready' : 'pending';
  console.log('Status:', status);

  if (status === 'ready') {
    console.log('Process complete!');
  } else {
    setTimeout(checkStatus, 2000); // Check again in 2 seconds
  }
}

checkStatus();
```

---

## setTimeout vs setInterval

### When to Use setTimeout

✅ One-time delayed execution
✅ Recursive scheduling with variable delays
✅ When you need guaranteed completion before next execution

```javascript
function repeatWithTimeout() {
  console.log('Task executing');

  // Heavy task here...

  setTimeout(repeatWithTimeout, 1000); // Schedule next execution
}

repeatWithTimeout();
```

**Advantage**: Next execution waits until current execution completes.

### When to Use setInterval

✅ Regular, predictable intervals
✅ Simpler syntax for repeating tasks
✅ When exact timing is more important than task completion

```javascript
setInterval(() => {
  console.log('Regular heartbeat');
}, 1000);
```

**Caution**: If a task takes longer than the interval, executions can overlap or queue up.

---

## Important Considerations

### 1. Minimum Delay

Browsers enforce a minimum delay (typically 4ms for nested timers, per HTML5 spec):

```javascript
setTimeout(() => console.log('Done'), 0);
// Actually delays ~4-10ms depending on browser/system load
```

### 2. Timer Drift

`setInterval` doesn't account for execution time:

```javascript
let start = Date.now();

setInterval(() => {
  console.log('Drift:', Date.now() - start - 1000);
}, 1000);

// May show increasing drift over time
```

### 3. Background Tab Throttling

Browsers may throttle timers in inactive tabs (minimum 1 second interval) to save resources.

### 4. Timer IDs Are Opaque

Don't rely on timer ID format:

```javascript
let id1 = setTimeout(() => {}, 1000);
let id2 = setInterval(() => {}, 1000);

// IDs are opaque values - don't compare or manipulate them
// Just pass them to clearTimeout/clearInterval
```

### 5. Memory Leaks

Always clear timers when done:

```javascript
class Component {
  constructor() {
    this.timerId = setInterval(() => {
      this.update();
    }, 1000);
  }

  destroy() {
    clearInterval(this.timerId); // Important: prevent memory leak
  }
}
```

---

## Common Patterns

### Pattern 1: Self-Clearing Timer

```javascript
let attempts = 0;
const maxAttempts = 3;

let timerId = setInterval(() => {
  attempts++;
  console.log('Attempt', attempts);

  if (attempts >= maxAttempts) {
    clearInterval(timerId);
  }
}, 1000);
```

### Pattern 2: Exponential Backoff

```javascript
function retryWithBackoff(fn, maxRetries = 5) {
  let retries = 0;

  function attempt() {
    fn().catch((err) => {
      if (retries < maxRetries) {
        retries++;
        let delay = Math.pow(2, retries) * 1000; // 2s, 4s, 8s, 16s, 32s
        console.log(`Retry ${retries} in ${delay}ms`);
        setTimeout(attempt, delay);
      }
    });
  }

  attempt();
}
```

### Pattern 3: Animation Frame Alternative

For animations, prefer `requestAnimationFrame` over timers:

```javascript
// Less efficient
setInterval(() => {
  updateAnimation();
}, 16); // ~60fps

// Better for animations
function animate() {
  updateAnimation();
  requestAnimationFrame(animate);
}
animate();
```

---

## Asynchronous Programming Context

Timers are fundamental to asynchronous JavaScript programming. They work with the event loop:

```javascript
console.log('1: Synchronous');

setTimeout(() => {
  console.log('3: Async (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('2: Async (Promise microtask)');
});

console.log('1: Synchronous');

// Output:
// 1: Synchronous
// 1: Synchronous
// 2: Async (Promise microtask)
// 3: Async (setTimeout)
```

Timers create **macrotasks**, which execute after **microtasks** (Promises).

---

## Key Concepts Summary

✅ **setTimeout()** schedules one-time execution after a delay
✅ **setInterval()** schedules repeated execution at intervals
✅ Both return IDs for cancellation with **clearTimeout()/clearInterval()**
✅ Timers are **non-blocking** - code continues executing immediately
✅ Zero delay means "as soon as possible", not immediate
✅ Timer IDs are **opaque values** (don't rely on their format)
✅ Always **clear timers** to prevent memory leaks
✅ Browsers may **throttle timers** in background tabs
✅ Minimum delay is typically **4ms** for nested timers
✅ **setTimeout** guarantees completion before next execution
✅ **setInterval** may queue executions if tasks take too long
✅ Timers are universally supported in **browsers and Node.js**
