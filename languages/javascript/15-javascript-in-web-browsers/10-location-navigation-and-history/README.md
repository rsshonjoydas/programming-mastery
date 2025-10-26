# Location, Navigation, and History

## 1. The Location Object

The **Location object** represents the current URL of the document and provides methods for loading new documents.

### Accessing Location

```javascript
window.location; // Location object
document.location; // Same Location object
document.URL; // String (not an object!)
```

### Location Properties

The Location object is similar to a URL object with these properties:

| Property   | Description                    | Example                                     |
| ---------- | ------------------------------ | ------------------------------------------- |
| `href`     | Complete URL as string         | `"https://example.com/page?q=test#section"` |
| `protocol` | Protocol scheme                | `"https:"`                                  |
| `hostname` | Domain name                    | `"example.com"`                             |
| `port`     | Port number                    | `"8080"` or `""`                            |
| `pathname` | Path portion                   | `"/page"`                                   |
| `search`   | Query string (with `?`)        | `"?q=test"`                                 |
| `hash`     | Fragment identifier (with `#`) | `"#section"`                                |

```javascript
// Example URL: https://example.com:8080/page?q=test#section
console.log(location.protocol); // "https:"
console.log(location.hostname); // "example.com"
console.log(location.port); // "8080"
console.log(location.pathname); // "/page"
console.log(location.search); // "?q=test"
console.log(location.hash); // "#section"
console.log(location.href); // Full URL
```

### Parsing Query Parameters

Location doesn't have `searchParams`, but you can create a URL object:

```javascript
let url = new URL(window.location);
let query = url.searchParams.get('q');
let numResults = parseInt(url.searchParams.get('n') || '10');

console.log('Search query:', query);
console.log('Number of results:', numResults);
```

---

## 2. Loading New Documents

### Assigning to location

Assigning a string to `location` loads a new page:

```javascript
// Absolute URL
window.location = 'http://www.example.com';

// Relative URL (resolved against current URL)
document.location = 'page2.html';

// Fragment identifier (scroll to element)
location = '#top'; // Scrolls to top of document
```

### Setting Individual Properties

```javascript
document.location.pathname = 'pages/3.html'; // Load new page
document.location.hash = 'TOC'; // Scroll to table of contents
location.search = '?page=' + (page + 1); // Reload with new query
```

### Location Methods

#### assign() - Load New Document

```javascript
location.assign('http://www.example.com');
// Same as: location = "http://www.example.com"
```

#### replace() - Replace in History

Loads new document **without adding to history**:

```javascript
location.replace('staticpage.html');
// User clicking Back won't return to current page
```

**Use case**: Redirecting when browser doesn't support required features:

```javascript
if (!isBrowserSupported()) {
  location.replace('staticpage.html');
}
```

**Difference between assign() and replace()**:

- `assign()`: Adds to history (Back button returns to current page)
- `replace()`: Replaces history (Back button skips current page)

#### reload() - Refresh Page

```javascript
location.reload(); // Reload current document
```

---

## 3. The History Object

The **History object** models the browsing history as a list of documents and states.

### Accessing History

```javascript
window.history; // History object
history.length; // Number of entries in history
```

### Navigation Methods

#### back() - Go Back One Page

```javascript
history.back(); // Same as clicking Back button
```

#### forward() - Go Forward One Page

```javascript
history.forward(); // Same as clicking Forward button
```

#### go() - Jump Multiple Pages

```javascript
history.go(-2); // Go back 2 pages
history.go(1); // Go forward 1 page
history.go(0); // Reload current page
```

### Important Notes

- **Security**: Scripts cannot access stored URLs in history
- **Child windows**: History includes `<iframe>` navigation interleaved chronologically
- Calling `history.back()` on main window may navigate a child window

---

## 4. History Management with hashchange Events

Modern web apps need to manage history for dynamic content without loading new pages.

### How It Works

1. Set `location.hash` to encode application state
2. This updates URL and adds entry to browser history
3. Browser fires `hashchange` event when hash changes
4. Back/Forward buttons trigger `hashchange` events
5. App listens for events and updates state accordingly

### Key Concepts

```javascript
// Setting hash creates history entry
location.hash = '#state1'; // Fires hashchange event

// Fragment identifier updates URL bar
location.hash = '#user/profile/123';

// Doesn't cause page load, just scrolls
location.hash = '#section2'; // Unless element with id exists
```

### Implementation Pattern

#### **Step 1: Encode state to string**

```javascript
function encodeState(state) {
  return `#page=${state.page}&filter=${state.filter}`;
}
```

#### **Step 2: Parse string to state**

```javascript
function decodeState(hash) {
  let params = new URLSearchParams(hash.slice(1));
  return {
    page: params.get('page'),
    filter: params.get('filter'),
  };
}
```

#### **Step 3: Listen for hashchange events**

```javascript
window.addEventListener('hashchange', (event) => {
  let state = decodeState(location.hash);
  renderApplicationState(state);
});
```

#### **Step 4: Update state via hash**

```javascript
function navigateToPage(page) {
  // Don't render directly - set hash instead
  location.hash = encodeState({ page: page, filter: currentFilter });
  // This triggers hashchange event, which renders the page
}
```

### Benefits

✅ Back/Forward buttons work automatically
✅ URL is bookmarkable
✅ Simple to implement

### Limitations

❌ Hash visible in URL (`#state-info`)
❌ Limited to short strings
❌ Considered a "hack" for history management

---

## 5. History Management with pushState()

More robust and modern approach using `history.pushState()` and `popstate` events.

### Core Concepts

**pushState()**: Add state to browser history
**replaceState()**: Update current history entry
**popstate event**: Fired when user navigates history (Back/Forward)

### pushState() Method

```javascript
history.pushState(stateObject, title, url);
```

**Parameters**:

1. **stateObject**: Object containing state data (uses structured clone algorithm)
2. **title**: Title string (mostly unused, pass `""`)
3. **url** (optional): URL to display in address bar

```javascript
let state = { page: 2, filter: 'active' };
history.pushState(state, '', '/page/2?filter=active');
```

### replaceState() Method

Same parameters as `pushState()`, but replaces current history entry:

```javascript
// Good for initial page load
history.replaceState(initialState, '', initialURL);
```

### popstate Event

Fired when user clicks Back/Forward:

```javascript
window.addEventListener('popstate', (event) => {
  let state = event.state; // Saved state object
  renderApplicationState(state);
});
```

### The Structured Clone Algorithm

More powerful than `JSON.stringify()`:

**Supports**:

- All JSON types
- `Map`, `Set`, `Date`, `RegExp`
- Typed arrays, `ArrayBuffer`
- Circular references

**Does NOT support**:

- Functions or classes
- DOM elements
- Getters/setters
- Non-enumerable properties

```javascript
let state = {
  user: { name: 'Alice' },
  created: new Date(),
  tags: new Set(['important', 'urgent']),
  data: new Map([['key', 'value']]),
};

history.pushState(state, '', '/current');
// All types preserved when retrieved via popstate
```

### **Implementation Pattern**

#### **Step 1: Initialize app state**

```javascript
let gamestate = GameState.fromURL(window.location) || GameState.newGame();

// Use replaceState for initial state
history.replaceState(gamestate, '', gamestate.toURL());
gamestate.render();
```

#### **Step 2: Update state and push to history**

```javascript
function handleUserAction(newState) {
  // Update application state
  updateState(newState);

  // Save to history
  history.pushState(newState, '', newState.toURL());

  // Render new state
  render(newState);
}
```

#### **Step 3: Handle popstate events**

```javascript
window.addEventListener('popstate', (event) => {
  let state = GameState.fromStateObject(event.state);
  state.render();
});
```

### Complete Example Structure

```javascript
class AppState {
  // Create new state
  static newState() {
    /*...*/
  }

  // Restore from URL (for bookmarks)
  static fromURL(url) {
    /*...*/
  }

  // Restore from history
  static fromStateObject(obj) {
    /*...*/
  }

  // Convert to URL for display
  toURL() {
    /*...*/
  }

  // Update DOM
  render() {
    /*...*/
  }

  // Update state based on user action
  update(data) {
    /*...*/
  }
}

// Initialize
let state = AppState.fromURL(location) || AppState.newState();
history.replaceState(state, '', state.toURL());
state.render();

// Handle user interactions
document.querySelector('#action').onclick = () => {
  if (state.update(data)) {
    history.pushState(state, '', state.toURL());
  }
  state.render();
};

// Handle Back/Forward
window.onpopstate = (event) => {
  state = AppState.fromStateObject(event.state);
  state.render();
};
```

---

## Comparison: hashchange vs pushState

| Feature             | hashchange            | pushState       |
| ------------------- | --------------------- | --------------- |
| **URL appearance**  | `#state-info` in hash | Clean URLs      |
| **State storage**   | String only           | Rich objects    |
| **Browser support** | Older browsers        | Modern browsers |
| **Complexity**      | Simple                | More complex    |
| **Best for**        | Simple apps           | Complex apps    |
| **Bookmarkability** | Limited               | Full support    |

---

## Best Practices

✅ **Use `replace()` for redirects** - Prevents Back button loops
✅ **Use `replaceState()` for initial page load** - Sets up history correctly
✅ **Use `pushState()` for modern apps** - Better than hashchange
✅ **Always handle popstate events** - Make Back/Forward work
✅ **Make URLs bookmarkable** - Encode state in URL
✅ **Parse URLs on load** - Restore state from bookmarks
✅ **Use structured clone** - Store rich data types
✅ **Don't encode secrets in URLs** - Security risk

---

## Key Concepts Summary

📌 **Location object** represents current URL with properties and methods
📌 **Assigning to location** loads new documents
📌 **`assign()` vs `replace()`**: Replace skips current page in history
📌 **History object** manages browsing history with `back()`, `forward()`, `go()`
📌 **hashchange events** provide simple history management via URL fragments
📌 **pushState()** provides robust history management with state objects
📌 **popstate events** fire when user navigates history
📌 **Structured clone** preserves complex data types in state
📌 **replaceState()** updates current history without adding entry
📌 **URLs should be bookmarkable** for best user experience
