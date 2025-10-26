# JavaScript in Web Browsers

## Overview

JavaScript was created in 1994 to enable **dynamic behavior in web documents**. Today, the web has evolved into a **full-featured application development platform** where browsers provide services similar to operating systems: graphics, video, audio, networking, storage, and threading.

## What This Guide Covers

This comprehensive guide covers the **core web platform capabilities** that JavaScript enables:

1. **Programming Model** - Scripts in HTML and event-driven execution
2. **Document Control** - Manipulating content and styles
3. **Element Positioning** - Determining on-screen positions
4. **UI Components** - Creating reusable interface elements
5. **Graphics** - Drawing with Canvas and SVG
6. **Audio** - Playing and generating sounds
7. **Navigation** - Managing browser history
8. **Networking** - Exchanging data over HTTP
9. **Storage** - Persisting data locally
10. **Threading** - Concurrent computation with Web Workers

---

## Client-Side vs Server-Side JavaScript

### Terminology

**Client-side JavaScript**: Code that runs in web browsers

- Also called "frontend" development
- Runs on the user's device

**Server-side JavaScript**: Code that runs on web servers (e.g., Node.js)

- Also called "backend" development
- Runs on remote servers

**The "sides"** refer to the two ends of the network connection between browser and server.

---

## Web Platform Programming Model

### 1. Embedding Scripts in HTML

JavaScript code runs in the context of HTML documents. There are several ways to include JavaScript:

#### Inline Scripts

```html
<script>
  console.log('Hello from inline script!');
  alert('This runs when the page loads');
</script>
```

#### External Scripts

```html
<script src="script.js"></script>
<script src="https://cdn.example.com/library.js"></script>
```

#### Script Placement

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Scripts in head load before body -->
    <script src="early-script.js"></script>
  </head>
  <body>
    <h1>My Page</h1>

    <!-- Scripts at end can access DOM elements -->
    <script src="late-script.js"></script>
  </body>
</html>
```

#### Modern Script Loading

```html
<!-- Defer: Downloads in parallel, executes after DOM is ready -->
<script src="script.js" defer></script>

<!-- Async: Downloads and executes asynchronously -->
<script src="analytics.js" async></script>

<!-- Module: ES6 modules with deferred behavior by default -->
<script type="module" src="app.js"></script>
```

### 2. Event-Driven Programming

Web applications are **asynchronous** and **event-driven**. Code executes in response to events rather than running sequentially.

#### Common Events

```javascript
// User interactions
button.addEventListener('click', function () {
  console.log('Button clicked!');
});

// Document lifecycle
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM is ready!');
});

window.addEventListener('load', function () {
  console.log('Page fully loaded!');
});

// Form events
input.addEventListener('input', function (e) {
  console.log('User typed:', e.target.value);
});

// Mouse events
element.addEventListener('mouseover', function () {
  this.style.backgroundColor = 'yellow';
});
```

---

## Core Web APIs

### 1. Document Object Model (DOM) - Content Control

The DOM represents the HTML document as a tree of objects that JavaScript can manipulate.

#### Selecting Elements

```javascript
// Single element
let heading = document.getElementById('title');
let first = document.querySelector('.item');

// Multiple elements
let items = document.getElementsByClassName('item');
let paragraphs = document.querySelectorAll('p');
```

#### Modifying Content

```javascript
// Change text
element.textContent = 'New text';
element.innerHTML = '<strong>Bold text</strong>';

// Change attributes
img.src = 'new-image.jpg';
link.href = 'https://example.com';
element.setAttribute('data-id', '123');
```

#### Creating and Removing Elements

```javascript
// Create
let div = document.createElement('div');
div.textContent = 'Hello';
document.body.appendChild(div);

// Remove
element.remove();
parent.removeChild(child);
```

### 2. CSS Styling

JavaScript can manipulate element styles dynamically.

```javascript
// Inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '20px';

// CSS classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('highlight');
element.classList.contains('active'); // true/false

// Computed styles (read-only)
let styles = getComputedStyle(element);
let color = styles.color;
```

### 3. Element Positioning

Determine where elements are positioned on screen.

```javascript
// Bounding box
let rect = element.getBoundingClientRect();
console.log(rect.top, rect.left, rect.width, rect.height);

// Scroll position
let scrollTop = window.pageYOffset;
let scrollLeft = window.pageXOffset;

// Viewport size
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

// Element dimensions
let width = element.offsetWidth;
let height = element.offsetHeight;
```

### 4. Reusable UI Components

Modern web development uses custom elements and components.

```javascript
// Web Components - Custom Element
class MyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          background: blue;
          color: white;
          padding: 10px;
        }
      </style>
      <button>Click Me</button>
    `;
  }
}

customElements.define('my-button', MyButton);
// Usage: <my-button></my-button>
```

### 5. Graphics - Canvas API

Draw 2D graphics programmatically.

```javascript
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

// Draw rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);

// Draw circle
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI * 2);
ctx.fillStyle = 'red';
ctx.fill();

// Draw text
ctx.font = '30px Arial';
ctx.fillText('Hello Canvas', 50, 200);
```

### 6. Graphics - SVG

Scalable Vector Graphics using XML-like syntax.

```html
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="blue" />
  <rect x="20" y="20" width="80" height="80" fill="red" />
</svg>
```

```javascript
// Manipulate SVG with JavaScript
let circle = document.querySelector('circle');
circle.setAttribute('r', '75');
circle.setAttribute('fill', 'green');
```

### 7. Audio API

Play and control audio.

```javascript
// HTML5 Audio
let audio = new Audio('music.mp3');
audio.play();
audio.pause();
audio.volume = 0.5; // 0 to 1

// With controls
let player = document.createElement('audio');
player.src = 'song.mp3';
player.controls = true;
document.body.appendChild(player);

// Web Audio API (advanced)
let audioContext = new AudioContext();
let oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440; // A4 note
oscillator.connect(audioContext.destination);
oscillator.start();
```

### 8. Browser Navigation and History

Control browser navigation and URL.

```javascript
// Navigate
window.location.href = 'https://example.com';
window.location.reload();

// History API
history.pushState({ page: 1 }, 'Title', '/page1');
history.back();
history.forward();

// Listen for navigation
window.addEventListener('popstate', function (e) {
  console.log('State:', e.state);
});

// Current URL info
console.log(location.pathname);
console.log(location.search);
console.log(location.hash);
```

### 9. Networking - Fetch API

Make HTTP requests to exchange data.

```javascript
// GET request
fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));

// POST request
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Alice', age: 30 }),
})
  .then((response) => response.json())
  .then((data) => console.log('Created:', data));

// Async/await
async function fetchData() {
  try {
    let response = await fetch('https://api.example.com/data');
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 10. Local Storage

Persist data on the user's computer.

```javascript
// localStorage (persists forever)
localStorage.setItem('username', 'alice');
let user = localStorage.getItem('username');
localStorage.removeItem('username');
localStorage.clear();

// sessionStorage (cleared when tab closes)
sessionStorage.setItem('token', 'abc123');

// Store objects (convert to JSON)
let user = { name: 'Bob', age: 25 };
localStorage.setItem('user', JSON.stringify(user));
let stored = JSON.parse(localStorage.getItem('user'));

// Cookies
document.cookie = 'name=value; expires=Fri, 31 Dec 2024 23:59:59 GMT';

// IndexedDB (for large amounts of structured data)
let request = indexedDB.open('MyDatabase', 1);
request.onsuccess = function (event) {
  let db = event.target.result;
  // Use database
};
```

### 11. Web Workers - Threading

Run JavaScript in background threads for concurrent computation.

```javascript
// Main thread (main.js)
let worker = new Worker('worker.js');

// Send message to worker
worker.postMessage({ data: [1, 2, 3, 4, 5] });

// Receive message from worker
worker.addEventListener('message', function (e) {
  console.log('Result from worker:', e.data);
});

// Terminate worker
worker.terminate();
```

```javascript
// Worker thread (worker.js)
self.addEventListener('message', function (e) {
  let data = e.data.data;
  let result = data.reduce((sum, n) => sum + n, 0);

  // Send result back to main thread
  self.postMessage(result);
});
```

---

## Documentation Resources

### Mozilla Developer Network (MDN)

The most reliable and comprehensive source for web API documentation:

- **<https://developer.mozilla.org/en-US/docs/Web>**

### Key MDN Sections

- Web APIs Reference
- HTML Reference
- CSS Reference
- JavaScript Guide
- Web Components

---

## Legacy APIs to Avoid

Modern web development has moved beyond many outdated APIs. **Avoid these**:

### 1. Proprietary APIs

```javascript
// DON'T USE - Internet Explorer specific
element.attachEvent('onclick', handler); // Use addEventListener instead
```

### 2. Inefficient APIs

```javascript
// DON'T USE - Performance issues
document.write('<p>Content</p>'); // Use DOM manipulation instead
```

### 3. Outdated APIs

```javascript
// DON'T USE - Replaced by CSS
document.bgColor = 'blue'; // Use CSS: body { background-color: blue; }
```

### 4. Poorly Designed APIs

Early DOM APIs that were language-agnostic and clunky have been replaced by modern, JavaScript-friendly alternatives.

**Use modern equivalents**:

- ✅ `querySelector()` instead of legacy selectors
- ✅ `classList` instead of manual className manipulation
- ✅ `addEventListener()` instead of inline event handlers
- ✅ Fetch API instead of XMLHttpRequest

---

## Web Platform Maturity

The web platform has **stabilized significantly**:

- Standards are defined by consensus among major browser vendors
- Modern APIs are well-designed for JavaScript
- Browser compatibility is much better
- Performance has dramatically improved

**Focus on learning**:

- ✅ Modern, standardized APIs
- ✅ Best practices and patterns
- ✅ Progressive enhancement
- ❌ Not legacy/deprecated APIs

---

## Key Concepts Summary

🌐 **JavaScript enables web apps** to use browser services (graphics, audio, networking, storage)
📄 **Scripts embed in HTML** and execute in response to events
⚡ **Event-driven programming** is asynchronous and reactive
🎯 **DOM manipulation** controls document content and structure
🎨 **CSS control** enables dynamic styling
📊 **Canvas and SVG** provide graphics capabilities
🔊 **Audio APIs** play and generate sounds
🔗 **Fetch API** exchanges data over networks
💾 **Storage APIs** persist data locally
🧵 **Web Workers** enable multi-threading
📚 **MDN** is the authoritative documentation source
🚫 **Avoid legacy APIs** - use modern equivalents

---

## Getting Started

1. **Learn the DOM** - Start with element selection and manipulation
2. **Master events** - Understand the event-driven model
3. **Practice with Fetch** - Make API requests
4. **Explore Canvas** - Create interactive graphics
5. **Use developer tools** - Browser DevTools are essential
6. **Read MDN docs** - Your go-to reference for all web APIs

The web platform is vast, but mastering these core APIs gives you a solid foundation for building modern web applications!
