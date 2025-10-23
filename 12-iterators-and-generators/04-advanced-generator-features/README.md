# JavaScript Advanced Generator Features

Generators are more than just iterators—they allow you to **pause computations**, **yield intermediate results**, and **resume execution** with two-way communication between the generator and its caller.

---

## 1. Return Value of a Generator Function

Generator functions can return values, which appear in the final iteration result.

### Basic Behavior

```javascript
function* oneAndDone() {
  yield 1;
  return 'done';
}

// Return value is ignored by for/of and spread operator
[...oneAndDone()]; // => [1] (return value not included)

// But available with explicit next() calls
let generator = oneAndDone();
generator.next(); // => { value: 1, done: false }
generator.next(); // => { value: "done", done: true }
generator.next(); // => { value: undefined, done: true }
```

### Key Points

- **Final `next()` call**: Returns an object with **both** `value` (the return value) and `done: true`
- **for/of and spread**: Ignore the return value
- **Manual iteration**: Can access the return value
- **After completion**: Subsequent calls return `{ value: undefined, done: true }`

### Use Cases

```javascript
function* generateWithSummary() {
  let sum = 0;
  for (let i = 1; i <= 3; i++) {
    sum += i;
    yield i;
  }
  return `Total: ${sum}`; // Summary as return value
}

let gen = generateWithSummary();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: "Total: 6", done: true }
```

---

## 2. The Value of a yield Expression

`yield` is an **expression** that can have a value. The generator and caller pass values **back and forth**.

### How It Works

1. **Generator yields**: `yield expression` returns a value to the caller
2. **Generator pauses**: Execution stops at the `yield`
3. **Caller passes value**: Next `next(arg)` call provides the value for the `yield` expression
4. **Generator resumes**: The `yield` expression evaluates to `arg`

### Two-Way Communication

```javascript
function* smallNumbers() {
  console.log('next() invoked the first time; argument discarded');
  let y1 = yield 1; // y1 gets the argument from next call
  console.log('next() invoked a second time with argument', y1);

  let y2 = yield 2; // y2 gets the argument from next call
  console.log('next() invoked a third time with argument', y2);

  let y3 = yield 3; // y3 gets the argument from next call
  console.log('next() invoked a fourth time with argument', y3);

  return 4;
}

let g = smallNumbers();
console.log('generator created; no code runs yet');

let n1 = g.next('a'); // n1.value == 1 (argument "a" discarded)
console.log('generator yielded', n1.value);

let n2 = g.next('b'); // n2.value == 2 (y1 becomes "b")
console.log('generator yielded', n2.value);

let n3 = g.next('c'); // n3.value == 3 (y2 becomes "c")
console.log('generator yielded', n3.value);

let n4 = g.next('d'); // n4.value == 4 (y3 becomes "d")
console.log('generator returned', n4.value);
```

### Output

```text
generator created; no code runs yet
next() invoked the first time; argument discarded
generator yielded 1
next() invoked a second time with argument b
generator yielded 2
next() invoked a third time with argument c
generator yielded 3
next() invoked a fourth time with argument d
generator returned 4
```

### Important Asymmetry

⚠️ **First `next()` call**: The argument is **discarded** because there's no `yield` waiting for a value yet.

### Practical Example

```javascript
function* echo() {
  while (true) {
    let input = yield 'Ready'; // Yield "Ready", then wait for input
    yield `You said: ${input}`; // Echo back what was received
  }
}

let e = echo();
console.log(e.next()); // { value: "Ready", done: false }
console.log(e.next('Hello')); // { value: "You said: Hello", done: false }
console.log(e.next()); // { value: "Ready", done: false }
console.log(e.next('World')); // { value: "You said: World", done: false }
```

---

## 3. The return() Method

The `return()` method forces a generator to return early and triggers cleanup code.

### Basic Usage

```javascript
function* numbers() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('Cleanup code executed');
  }
}

let gen = numbers();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.return(99)); // { value: 99, done: true }
// "Cleanup code executed"
console.log(gen.next()); // { value: undefined, done: true }
```

### How return() Works

1. **Executes `finally` blocks**: Ensures cleanup code runs
2. **Returns immediately**: With the provided value
3. **Sets `done: true`**: Generator is finished
4. **Subsequent calls**: Return `{ value: undefined, done: true }`

### Automatic Cleanup

When iteration stops early (e.g., `break` in a loop), `return()` is called automatically:

```javascript
function* withCleanup() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('Automatic cleanup!');
  }
}

for (let val of withCleanup()) {
  console.log(val);
  if (val === 2) break; // Triggers automatic return()
}
// Output:
// 1
// 2
// Automatic cleanup!
```

### Cleanup Pattern

```javascript
function* resourceHandler() {
  let resource = acquireResource();
  try {
    while (true) {
      yield resource.getData();
    }
  } finally {
    resource.close(); // Always runs, even if stopped early
    console.log('Resource closed');
  }
}
```

---

## 4. The throw() Method

The `throw()` method injects an exception into the generator at the current `yield` point.

### **Basic Usage**

```javascript
function* handleErrors() {
  try {
    yield 1;
    yield 2; // Exception thrown here
    yield 3; // Never reached
  } catch (e) {
    console.log('Caught:', e);
    yield 'recovered';
  }
}

let gen = handleErrors();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.throw('Error!')); // "Caught: Error!"
// { value: "recovered", done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### How throw() Works

1. **Throws at current yield**: Exception appears at the paused `yield` expression
2. **Can be caught**: Use `try/catch` inside the generator
3. **Resumes execution**: After catching, continues normally
4. **Uncaught exceptions**: Terminate the generator and propagate outward

### Practical Example: Resettable Counter

```javascript
function* counter() {
  let count = 0;
  while (true) {
    try {
      yield ++count;
    } catch (e) {
      if (e === 'reset') {
        count = 0;
        console.log('Counter reset!');
      } else {
        throw e; // Re-throw unexpected errors
      }
    }
  }
}

let c = counter();
console.log(c.next().value); // 1
console.log(c.next().value); // 2
console.log(c.next().value); // 3
c.throw('reset'); // "Counter reset!"
console.log(c.next().value); // 1 (counter restarted)
console.log(c.next().value); // 2
```

### Error Recovery Pattern

```javascript
function* resilientTask() {
  let retries = 0;
  while (retries < 3) {
    try {
      yield performTask();
      break; // Success
    } catch (e) {
      retries++;
      console.log(`Retry ${retries}: ${e}`);
      if (retries >= 3) throw e; // Give up
    }
  }
}
```

---

## 5. Generators with yield\*

When using `yield*`, the `return()` and `throw()` methods are **forwarded** to the delegated iterator.

### Example

```javascript
function* inner() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('Inner cleanup');
  }
}

function* outer() {
  yield* inner();
  yield 3;
}

let gen = outer();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.return(99)); // "Inner cleanup"
// { value: 99, done: true }
```

### **Key Points**

- **next()**: Forwarded to the delegated iterator
- **return()**: Forwarded, triggering cleanup in the delegated iterator
- **throw()**: Forwarded, allowing error handling in the delegated iterator

---

## 6. Advanced Control Flow

Generators provide powerful control flow capabilities beyond simple iteration.

### Cooperative Threading Simulation

```javascript
function* task1() {
  console.log('Task 1: Start');
  yield;
  console.log('Task 1: Middle');
  yield;
  console.log('Task 1: End');
}

function* task2() {
  console.log('Task 2: Start');
  yield;
  console.log('Task 2: Middle');
  yield;
  console.log('Task 2: End');
}

function runTasks(...tasks) {
  let generators = tasks.map((t) => t());
  let active = generators.length;

  while (active > 0) {
    for (let gen of generators) {
      let result = gen.next();
      if (result.done) active--;
    }
  }
}

runTasks(task1, task2);
// Interleaved execution:
// Task 1: Start
// Task 2: Start
// Task 1: Middle
// Task 2: Middle
// Task 1: End
// Task 2: End
```

### State Machine

```javascript
function* stateMachine() {
  let state = 'START';

  while (true) {
    switch (state) {
      case 'START':
        console.log('In START state');
        state = yield 'START';
        break;
      case 'PROCESSING':
        console.log('In PROCESSING state');
        state = yield 'PROCESSING';
        break;
      case 'END':
        console.log('In END state');
        return 'FINISHED';
      default:
        state = 'START';
    }
  }
}

let sm = stateMachine();
console.log(sm.next()); // { value: "START", done: false }
console.log(sm.next('PROCESSING')); // { value: "PROCESSING", done: false }
console.log(sm.next('END')); // { value: "FINISHED", done: true }
```

---

## 7. Historical Note: Async Generators

**Before async/await**: Generators were used to manage asynchronous code, making it appear synchronous.

**Now**: Use `async`/`await` instead—generators for async flow control are no longer necessary or recommended.

### Old Pattern (Don't use)

```javascript
// Complex and hard to understand
function* fetchData() {
  let data = yield fetch('url');
  let result = yield process(data);
  return result;
}
```

### Modern Pattern (Use this)

```javascript
// Clear and readable
async function fetchData() {
  let data = await fetch('url');
  let result = await process(data);
  return result;
}
```

---

## Summary: Generator Methods

| Method            | Purpose            | Effect                                                           |
| ----------------- | ------------------ | ---------------------------------------------------------------- |
| **next(value)**   | Resume execution   | Provides value to `yield` expression, returns next yielded value |
| **return(value)** | Force early return | Executes `finally` blocks, returns `{ value, done: true }`       |
| **throw(error)**  | Inject exception   | Throws error at current `yield`, can be caught inside generator  |

---

## Key Concepts

✅ **Return values** from generators appear in the final iteration object
✅ **yield is an expression** that receives values from `next(arg)`
✅ **Two-way communication**: Generator yields values, caller passes values back
✅ **First next() argument** is discarded (no yield waiting for it)
✅ **return() method** triggers cleanup code in `finally` blocks
✅ **throw() method** injects exceptions for error handling or state changes
✅ **yield\*** forwards `next()`, `return()`, and `throw()` to delegated iterators
✅ **Cooperative threading** is possible but complex
✅ **Async flow control** with generators is obsolete—use `async`/`await` instead

---

## Best Practices

🎯 Use generators for **custom iterators** and **lazy evaluation**
🎯 Use `return` values for **summaries** or **final state**
🎯 Use `try/finally` for **guaranteed cleanup**
🎯 Use `throw()` for **state management** or **error recovery**
🎯 **Avoid** using generators for async control flow (use `async`/`await`)
🎯 Document two-way communication patterns clearly
🎯 Be aware of the first `next()` argument asymmetry
