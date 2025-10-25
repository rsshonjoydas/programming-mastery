# JavaScript Events

## What Are Events?

Events are actions or occurrences in the browser that JavaScript can respond to. Client-side JavaScript uses an **asynchronous event-driven programming model** where the browser generates events when something interesting happens, and your code responds by executing handler functions.

**Examples of events**:

- Document finishes loading
- User clicks a button
- User moves the mouse
- User types on keyboard
- Form is submitted
- Network request completes

---

## Key Event Terminology

### 1. Event Type (Event Name)

A string specifying what kind of event occurred.

```javascript
'click'; // User clicked
'mousemove'; // Mouse moved
'keydown'; // Key pressed
'load'; // Resource loaded
'submit'; // Form submitted
```

### 2. Event Target

The object on which the event occurred.

```javascript
// Click event on a button element
button.addEventListener('click', handler); // <button> is the target

// Load event on window
window.addEventListener('load', handler); // Window is the target
```

**Common event targets**: `Window`, `Document`, `Element` objects

### 3. Event Handler (Event Listener)

A function that responds to an event.

```javascript
function handleClick(event) {
  console.log('Button was clicked!');
}

button.addEventListener('click', handleClick);
```

When invoked, we say the browser has **"fired"**, **"triggered"**, or **"dispatched"** the event.

### 4. Event Object

An object containing details about the event, passed as an argument to the handler.

**Standard properties**:

- `type` - Event type (e.g., "click")
- `target` - The element that triggered the event
- `currentTarget` - Element with the current handler
- `timeStamp` - When the event occurred
- `isTrusted` - True if browser dispatched it (not JavaScript)

**Event-specific properties**:

- Mouse events: `clientX`, `clientY` (coordinates)
- Keyboard events: `key`, `code`, `ctrlKey`, `shiftKey`

### 5. Event Propagation

The process by which the browser decides which objects trigger event handlers.

**Types**:

- **Bubbling**: Events travel up from target to ancestors
- **Capturing**: Events travel down from ancestors to target

---

## Event Categories

### 1. Device-Dependent Input Events

Tied to specific input devices.

```javascript
// Mouse events
'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave';

// Touch events
'touchstart', 'touchmove', 'touchend';

// Keyboard events
'keydown', 'keyup', 'keypress';
```

### 2. Device-Independent Input Events

Not tied to specific devices.

```javascript
'click'; // Works with mouse, keyboard, touch
'input'; // Text input (any method)
'pointerdown'; // Works with mouse, touch, stylus
'pointermove';
'pointerup';
```

### 3. User Interface Events

Higher-level events on form elements.

```javascript
'focus'; // Element gains focus
'blur'; // Element loses focus
'change'; // Form element value changes
'submit'; // Form submitted
```

### 4. State-Change Events

Lifecycle and network-related events.

```javascript
'load'; // Document/resource loaded
'DOMContentLoaded'; // DOM fully loaded
'online'; // Network connected
'offline'; // Network disconnected
'popstate'; // Browser history changed
```

### 5. API-Specific Events

Defined by web APIs.

```javascript
// Media events
'play', 'pause', 'ended', 'volumechange';

// IndexedDB events
'success', 'error';

// XMLHttpRequest events
'progress', 'load', 'error';
```

---

## Registering Event Handlers

### Method 1: Event Handler Properties

Set a property on the event target (older method, limited to one handler per event type).

```javascript
// Window load event
window.onload = function () {
  console.log('Page loaded');
};

// Form submit event
let form = document.querySelector('form');
form.onsubmit = function (event) {
  if (!isFormValid(this)) {
    event.preventDefault(); // Stop form submission
  }
};

// Button click
let button = document.getElementById('myButton');
button.onclick = function () {
  console.log('Clicked!');
};
```

**Property naming**: `on` + event type (lowercase)

- `onclick`, `onchange`, `onload`, `onmouseover`

**Limitation**: Only one handler per event type (overwrites previous handlers).

### Method 2: HTML Attributes (Not Recommended)

Define handlers directly in HTML (avoid in modern development).

```html
<button onclick="console.log('Thank you');">Click Me</button>

<button onclick="handleClick()">Submit</button>

<body onload="init()"></body>
```

**Why avoid**:

- Mixes JavaScript with HTML
- Uses forbidden `with` statement
- Creates confusing scope
- Hard to maintain

### Method 3: addEventListener() (Recommended)

The modern, flexible way to register event handlers.

```javascript
element.addEventListener(eventType, handlerFunction, options);
```

**Parameters**:

1. **eventType** (string): Event name without "on" prefix
2. **handlerFunction** (function): The handler to invoke
3. **options** (optional): Boolean or object with options

**Basic usage**:

```javascript
let button = document.querySelector('#mybutton');

button.addEventListener('click', function () {
  console.log('Thanks for clicking!');
});

// Multiple handlers allowed
button.addEventListener('click', () => {
  console.log('Thanks again!');
});
```

**Advantages**:

- Multiple handlers per event type
- Doesn't overwrite existing handlers
- Supports capturing phase
- Can be easily removed

### Removing Event Handlers

```javascript
function handleClick(event) {
  console.log('Clicked!');
}

// Add handler
button.addEventListener('click', handleClick);

// Remove handler (must use same function reference)
button.removeEventListener('click', handleClick);
```

**Temporary handlers example**:

```javascript
function handleMouseDown(event) {
  // Register temporary handlers for drag operation
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp(event) {
  // Remove temporary handlers
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}
```

---

## addEventListener() Options

### Boolean (Third Argument)

```javascript
// true = capturing phase, false = bubbling phase (default)
element.addEventListener('click', handler, true);
```

### Options Object

```javascript
element.addEventListener('click', handler, {
  capture: true, // Use capturing phase
  once: true, // Remove after first invocation
  passive: true, // Won't call preventDefault()
});
```

**capture**: `true` for capturing phase, `false` (default) for bubbling

**once**: Automatically removes handler after it fires once

```javascript
button.addEventListener(
  'click',
  () => {
    console.log('Only fires once!');
  },
  { once: true }
);
```

**passive**: Indicates handler won't prevent default action (important for scroll performance)

```javascript
// Smooth scrolling on mobile
document.addEventListener('touchmove', handler, { passive: true });
```

---

## Event Handler Invocation

### Handler Arguments

Handlers receive an **Event object** as their single argument.

```javascript
button.addEventListener('click', function (event) {
  console.log('Event type:', event.type); // "click"
  console.log('Event target:', event.target); // <button>
  console.log('Timestamp:', event.timeStamp);
  console.log('Trusted:', event.isTrusted); // true
});
```

**Common Event properties**:

- `type` - Event type string
- `target` - Element that triggered event
- `currentTarget` - Element with current handler
- `timeStamp` - When event occurred (milliseconds)
- `isTrusted` - Browser vs JavaScript dispatch

**Event-specific properties**:

```javascript
// Mouse event
element.addEventListener('click', (e) => {
  console.log('X:', e.clientX, 'Y:', e.clientY);
});

// Keyboard event
document.addEventListener('keydown', (e) => {
  console.log('Key:', e.key, 'Code:', e.code);
  console.log('Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey);
});
```

### Handler Context (this)

When registered via property or `addEventListener()`, `this` refers to the **event target**.

```javascript
button.onclick = function () {
  console.log(this); // <button> element
};

button.addEventListener('click', function () {
  console.log(this); // <button> element
});
```

**Arrow functions**: `this` is lexically scoped (not the target)

```javascript
button.addEventListener('click', () => {
  console.log(this); // NOT the button (depends on outer scope)
});
```

### Handler Return Value

**Modern approach**: Don't return values; use `event.preventDefault()` instead.

**Legacy approach** (older code only):

```javascript
button.onclick = function () {
  if (!valid) {
    return false; // Prevents default action (old style)
  }
};
```

### Invocation Order

Handlers are invoked **in registration order**.

```javascript
button.onclick = handler1;
button.addEventListener('click', handler2);
button.addEventListener('click', handler3);

// Click fires: handler1, handler2, handler3
```

---

## Event Propagation

When an event occurs on a document element, it propagates through the DOM tree in **three phases**.

### Three Phases of Event Propagation

1. **Capturing Phase**: From `Window` down to target's parent
2. **Target Phase**: Handlers on target itself
3. **Bubbling Phase**: From target's parent up to `Window`

```text
Window → Document → <body> → <div> → <button>  (Capturing)
                                      ↓
                                   [TARGET]
                                      ↓
<button> → <div> → <body> → Document → Window  (Bubbling)
```

### Event Bubbling

Most events **bubble up** the DOM tree after firing on the target.

```javascript
<div id="outer">
  <div id="inner">
    <button id="btn">Click me</button>
  </div>
</div>

<script>
document.getElementById("btn").addEventListener("click", (e) => {
  console.log("Button clicked");
});

document.getElementById("inner").addEventListener("click", (e) => {
  console.log("Inner div clicked");
});

document.getElementById("outer").addEventListener("click", (e) => {
  console.log("Outer div clicked");
});

// Click button logs:
// "Button clicked"
// "Inner div clicked"
// "Outer div clicked"
</script>
```

**Events that DON'T bubble**:

- `focus`, `blur`, `scroll`
- `load` (stops at Document)

### Event Capturing

Capture events **before** they reach the target by setting `capture: true`.

```javascript
// Capturing handler (invoked first)
document.getElementById('outer').addEventListener(
  'click',
  (e) => {
    console.log('Outer capturing');
  },
  true
); // or { capture: true }

// Target handler
document.getElementById('btn').addEventListener('click', (e) => {
  console.log('Button clicked');
});

// Bubbling handler (invoked last)
document.getElementById('outer').addEventListener('click', (e) => {
  console.log('Outer bubbling');
});

// Click button logs:
// "Outer capturing" (capture phase)
// "Button clicked" (target phase)
// "Outer bubbling" (bubble phase)
```

**Use case**: Intercept events before they reach their target (debugging, filtering, mouse drags).

---

## Event Cancellation

### Preventing Default Actions

Use `preventDefault()` to stop the browser's default behavior.

```javascript
// Prevent link navigation
link.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Link clicked but not followed');
});

// Prevent form submission
form.addEventListener('submit', (event) => {
  if (!isValid()) {
    event.preventDefault(); // Stop submission
  }
});

// Prevent text input
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent Enter key
  }
});
```

**Note**: Doesn't work if handler registered with `passive: true`.

### Stopping Propagation

**stopPropagation()**: Prevents further propagation (capturing or bubbling).

```javascript
button.addEventListener('click', (event) => {
  event.stopPropagation(); // Stops bubbling to parent
  console.log('Button clicked');
});

parent.addEventListener('click', (event) => {
  console.log('Parent clicked'); // Won't fire if button clicked
});
```

**stopImmediatePropagation()**: Also prevents other handlers on the **same element**.

```javascript
button.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  console.log('First handler');
});

button.addEventListener('click', (event) => {
  console.log('Second handler'); // Won't fire
});
```

---

## Dispatching Custom Events

Create and dispatch your own events using `CustomEvent` and `dispatchEvent()`.

### Basic Custom Event

```javascript
// Create custom event
let event = new CustomEvent('busy', {
  detail: { message: 'Loading data...' }, // Custom data
  bubbles: true, // Bubble up DOM
  cancelable: true, // Can be canceled
});

// Dispatch event
document.dispatchEvent(event);

// Listen for custom event
document.addEventListener('busy', (e) => {
  console.log('App is busy:', e.detail.message);
  showSpinner();
});
```

### Practical Example: Loading Indicator

```javascript
// Module performing async operation
function loadData(url) {
  // Dispatch "busy" event
  document.dispatchEvent(
    new CustomEvent('busy', {
      detail: true,
    })
  );

  fetch(url)
    .then(handleResponse)
    .catch(handleError)
    .finally(() => {
      // Dispatch "not busy" event
      document.dispatchEvent(
        new CustomEvent('busy', {
          detail: false,
        })
      );
    });
}

// UI module listening for busy events
document.addEventListener('busy', (e) => {
  if (e.detail) {
    showSpinner();
  } else {
    hideSpinner();
  }
});
```

### CustomEvent Constructor

```javascript
new CustomEvent(type, options);
```

**Parameters**:

- `type` (string): Event name
- `options` (object):
  - `detail`: Any value (your custom data)
  - `bubbles`: Boolean (should bubble?)
  - `cancelable`: Boolean (can be canceled?)

---

## Common Event Patterns

### Form Validation

```javascript
form.addEventListener('submit', (event) => {
  let valid = true;

  // Validate inputs
  if (!emailInput.value.includes('@')) {
    valid = false;
  }

  if (!valid) {
    event.preventDefault(); // Stop submission
    alert('Please fix errors');
  }
});
```

### Debouncing Input

```javascript
let timeout;
input.addEventListener('input', (event) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('User finished typing:', event.target.value);
  }, 500);
});
```

### Event Delegation

Handle events on parent instead of many children.

```javascript
// Instead of adding listener to each <li>
ul.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('List item clicked:', event.target.textContent);
  }
});
```

### Keyboard Shortcuts

```javascript
document.addEventListener('keydown', (event) => {
  // Ctrl+S to save
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    save();
  }

  // Esc to cancel
  if (event.key === 'Escape') {
    cancel();
  }
});
```

---

## Best Practices

✅ **Use `addEventListener()`** over event handler properties
✅ **Use `preventDefault()`** instead of returning `false`
✅ **Remove event listeners** when no longer needed
✅ **Use event delegation** for many similar elements
✅ **Use `passive: true`** for scroll/touch handlers
✅ **Use `once: true`** for one-time events
✅ **Avoid inline HTML event handlers**
✅ **Use capturing for debugging** or filtering events
✅ **Stop propagation carefully** (can break other handlers)

---

## Key Concepts Summary

📌 **Events** are actions/occurrences the browser responds to
📌 **Event handlers** are functions that respond to events
📌 **addEventListener()** is the preferred registration method
📌 **Event object** contains details about the event
📌 **this** in handlers refers to the event target (except arrow functions)
📌 **Event propagation** has three phases: capturing, target, bubbling
📌 **Most events bubble** up the DOM tree
📌 **preventDefault()** stops default browser actions
📌 **stopPropagation()** stops event from continuing to propagate
📌 **Custom events** can be created with `CustomEvent`
📌 **Event delegation** handles events on parent instead of children
📌 **Options object** provides `capture`, `once`, and `passive` settings
