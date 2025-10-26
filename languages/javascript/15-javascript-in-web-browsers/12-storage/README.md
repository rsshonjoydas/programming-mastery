# JavaScript Storage

## Overview

JavaScript provides multiple ways to store data on the client side (user's computer). This allows web applications to:

- Remember user preferences
- Save application state
- Enable offline functionality
- Share data between pages from the same origin

**Storage is segregated by origin** - pages from different sites cannot access each other's data.

---

## Types of Client-Side Storage

| Storage Type       | Use Case                     | Size Limit     | Persistence      | API Complexity |
| ------------------ | ---------------------------- | -------------- | ---------------- | -------------- |
| **localStorage**   | Large amounts of string data | ~5-10MB        | Permanent        | Easy           |
| **sessionStorage** | Temporary string data        | ~5-10MB        | Until tab closes | Easy           |
| **Cookies**        | Small text data for servers  | 4KB per cookie | Configurable     | Hard           |
| **IndexedDB**      | Large structured data        | ~50MB+         | Permanent        | Complex        |

---

## ⚠️ Security Warning

**CRITICAL**: Client-side storage is **NOT encrypted**. Never store:

- Passwords
- Financial account numbers
- Credit card information
- Personal identification numbers
- Any sensitive data

Data is accessible to:

- Users who share the device
- Malicious software (spyware) on the device

---

## 1. localStorage and sessionStorage

The simplest and most commonly used storage APIs.

### Basic Usage

```javascript
// Storing data
localStorage.username = 'Alice';
localStorage.setItem('theme', 'dark');

// Reading data
let name = localStorage.username;
let theme = localStorage.getItem('theme');

// Removing data
delete localStorage.username;
localStorage.removeItem('theme');

// Clear all data
localStorage.clear();
```

### Key Characteristics

**Storage objects behave like regular JavaScript objects but**:

1. Property values **must be strings**
2. Properties **persist** (survive page reloads)
3. Limited to **string storage only**

### Storing Non-String Data

Since storage only accepts strings, you must encode/decode other data types:

```javascript
// Numbers
localStorage.x = 10;
let x = parseInt(localStorage.x);

// Dates
localStorage.lastRead = new Date().toUTCString();
let lastRead = new Date(Date.parse(localStorage.lastRead));

// Objects/Arrays (use JSON)
let data = { name: 'Alice', age: 30 };
localStorage.data = JSON.stringify(data); // Store
let retrieved = JSON.parse(localStorage.data); // Retrieve
```

### Methods vs Property Access

Both work the same way:

```javascript
// Property access
localStorage.name = 'Alice';
let name = localStorage.name;

// Method access
localStorage.setItem('name', 'Alice');
let name = localStorage.getItem('name');
```

### Enumeration

```javascript
// Using for...in loop
for (let key in localStorage) {
  console.log(key, localStorage[key]);
}

// Using Object.keys()
Object.keys(localStorage).forEach((key) => {
  console.log(key, localStorage.getItem(key));
});
```

---

## localStorage vs sessionStorage

### localStorage

**Lifetime**: Permanent

- Data never expires
- Remains until deleted by app or user
- Survives browser restarts

**Scope**:

- By **document origin** (protocol + hostname + port)
- All documents with same origin share data
- Per **browser implementation** (Firefox data ≠ Chrome data)

```javascript
// Data persists across browser sessions
localStorage.setItem('preference', 'dark-mode');
// Close browser, reopen - data still there
```

### sessionStorage

**Lifetime**: Temporary

- Lasts only while tab/window is open
- Deleted when tab permanently closes
- May survive tab restoration in modern browsers

**Scope**:

- By **document origin** AND **per-window**
- Two tabs from same origin have **separate** sessionStorage
- Scripts in one tab cannot access another tab's data

```javascript
// Data only lasts for this tab's lifetime
sessionStorage.setItem('tempData', 'session-only');
// Close tab - data is gone
```

### Comparison Example

```javascript
// Page 1 (Tab 1)
localStorage.shared = 'visible to all tabs';
sessionStorage.private = 'only in this tab';

// Page 2 (Tab 2, same origin)
console.log(localStorage.shared); // "visible to all tabs"
console.log(sessionStorage.private); // undefined (different tab)
```

---

## Storage Events

The `storage` event notifies when localStorage changes in **other windows**.

### When Events Fire

- Triggered when localStorage is modified
- Fired on **all other windows** with same origin
- **NOT** fired on the window that made the change

### Event Properties

```javascript
window.addEventListener('storage', (event) => {
  console.log('Key:', event.key); // Property changed
  console.log('New value:', event.newValue); // New value
  console.log('Old value:', event.oldValue); // Previous value
  console.log('Storage:', event.storageArea); // Usually localStorage
  console.log('URL:', event.url); // Page that made change
});
```

| Property      | Description                                     |
| ------------- | ----------------------------------------------- |
| `key`         | Name of changed item (null if `clear()` called) |
| `newValue`    | New value (absent if `removeItem()`)            |
| `oldValue`    | Previous value (absent for new items)           |
| `storageArea` | The Storage object (usually localStorage)       |
| `url`         | URL of document that made the change            |

### Use Cases

**1. Broadcast preferences across tabs**:

```javascript
// Tab 1: User disables animations
localStorage.setItem('animationsEnabled', 'false');

// Tab 2: Automatically receives event and disables animations
window.addEventListener('storage', (e) => {
  if (e.key === 'animationsEnabled') {
    toggleAnimations(e.newValue === 'true');
  }
});
```

**2. Multi-window app synchronization**:

```javascript
// Image editor with tool palettes in separate windows
localStorage.setItem('selectedTool', 'brush');
// All palette windows receive event and update UI
```

---

## 2. Cookies

An older storage mechanism designed for server-side use. Cookies are **automatically sent with every HTTP request**.

### Why Called "Cookie"?

The term "cookie" or "magic cookie" historically refers to a small chunk of privileged data that proves identity or permits access (like a password token).

### Reading Cookies

Cookies are accessed via `document.cookie`, which returns a single string:

```javascript
document.cookie;
// Returns: "name1=value1; name2=value2; name3=value3"
```

### Parsing Cookies Function

```javascript
function getCookies() {
  let cookies = new Map();
  let all = document.cookie;
  let list = all.split('; ');

  for (let cookie of list) {
    if (!cookie.includes('=')) continue;
    let p = cookie.indexOf('=');
    let name = cookie.substring(0, p);
    let value = cookie.substring(p + 1);
    value = decodeURIComponent(value);
    cookies.set(name, value);
  }

  return cookies;
}
```

### Setting Cookies

```javascript
// Basic cookie (session only)
document.cookie = `username=${encodeURIComponent('Alice')}`;

// Cookie with expiration
document.cookie = `session=abc123; max-age=${60 * 60 * 24 * 7}`; // 7 days
```

### Cookie Attributes

#### 1. max-age (Lifetime)

```javascript
// Expires in 30 days
document.cookie = `token=xyz; max-age=${30 * 24 * 60 * 60}`;

// Delete cookie (set max-age to 0)
document.cookie = `token=xyz; max-age=0`;
```

#### 2. path (Visibility Scope)

```javascript
// Visible to all pages on site
document.cookie = 'user=Alice; path=/';

// Visible only to /catalog and subdirectories
document.cookie = 'cart=123; path=/catalog';
```

**Default**: Cookie visible to page that created it and subdirectories.

#### 3. domain (Cross-Subdomain Access)

```javascript
// Share cookie across subdomains
document.cookie = 'pref=dark; domain=.example.com';
// Now visible to: catalog.example.com, orders.example.com, etc.
```

**Security**: Can only set domain to parent domain of your server.

#### 4. secure (HTTPS Only)

```javascript
// Only transmitted over HTTPS
document.cookie = 'token=secret; secure';
```

### Complete Cookie Setting Function

```javascript
function setCookie(name, value, daysToLive = null) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (daysToLive !== null) {
    cookie += `; max-age=${daysToLive * 60 * 60 * 24}`;
  }

  document.cookie = cookie;
}

// Usage
setCookie('username', 'Alice', 7); // Expires in 7 days
setCookie('theme', 'dark'); // Session cookie
setCookie('session', '', 0); // Delete cookie
```

### Cookie Limitations

- **Size**: 4KB per cookie (name + value)
- **Quantity**: ~300 cookies total, ~20 per domain
- **Transmission**: Sent with **every HTTP request** (overhead)
- **Encoding**: Cannot contain semicolons, commas, or whitespace

### When to Use Cookies

✅ Need server-side access to data
✅ Small amounts of text data
✅ Authentication tokens
❌ Large data storage (use localStorage/IndexedDB instead)
❌ Client-only data (unnecessary HTTP overhead)

---

## 3. IndexedDB

A powerful **object database** for storing large amounts of structured data.

### Key Concepts

**Database**: Collection of named object stores
**Object Store**: Like a table, stores JavaScript objects
**Key**: Unique identifier for each object (auto-generated or specified)
**Index**: Secondary keys for searching non-primary properties
**Transaction**: Group of operations that succeed or fail together

### Basic Structure

```text
Database "mydb"
  └── Object Store "users"
       ├── Index "email"
       ├── Index "age"
       └── Objects: { id: 1, name: "Alice", email: "..." }
```

### Opening a Database

```javascript
let request = indexedDB.open('myDatabase', 1); // Name, version

request.onerror = (event) => {
  console.error('Database error:', event.target.error);
};

request.onsuccess = (event) => {
  let db = event.target.result;
  console.log('Database opened:', db);
};

request.onupgradeneeded = (event) => {
  let db = event.target.result;
  // Create object stores and indexes here
};
```

### Creating Object Stores (Schema)

Only possible during `upgradeneeded` event:

```javascript
request.onupgradeneeded = (event) => {
  let db = event.target.result;

  // Create object store with auto-incrementing key
  let store = db.createObjectStore('users', { autoIncrement: true });

  // Or specify a key path
  let store2 = db.createObjectStore('products', { keyPath: 'id' });

  // Create indexes for searching
  store2.createIndex('name', 'name', { unique: false });
  store2.createIndex('price', 'price', { unique: false });
};
```

### Adding/Updating Data

```javascript
function addUser(db, user) {
  // Create transaction
  let transaction = db.transaction(['users'], 'readwrite');

  // Get object store
  let store = transaction.objectStore('users');

  // Add or update object
  let request = store.put(user); // or .add() to prevent overwriting

  request.onsuccess = () => {
    console.log('User added:', request.result);
  };

  request.onerror = () => {
    console.error('Error adding user:', request.error);
  };
}
```

### Reading Data

```javascript
function getUser(db, userId, callback) {
  let transaction = db.transaction(['users'], 'readonly');
  let store = transaction.objectStore('users');
  let request = store.get(userId);

  request.onsuccess = () => {
    callback(request.result); // The user object
  };

  request.onerror = () => {
    console.error('Error:', request.error);
  };
}
```

### Querying with Indexes

```javascript
function getUserByEmail(db, email, callback) {
  let transaction = db.transaction(['users'], 'readonly');
  let store = transaction.objectStore('users');
  let index = store.index('email');

  let request = index.get(email);

  request.onsuccess = () => {
    callback(request.result);
  };
}
```

### Range Queries

```javascript
// Get all users with age between 20 and 30
let range = IDBKeyRange.bound(20, 30);
let request = index.getAll(range);

request.onsuccess = () => {
  console.log('Users:', request.result);
};
```

### Cursors (Iterating Results)

```javascript
function listAllUsers(db) {
  let transaction = db.transaction(['users'], 'readonly');
  let store = transaction.objectStore('users');
  let request = store.openCursor();

  request.onsuccess = (event) => {
    let cursor = event.target.result;
    if (cursor) {
      console.log('User:', cursor.value);
      cursor.continue(); // Move to next record
    } else {
      console.log('No more users');
    }
  };
}
```

### Deleting Data

```javascript
function deleteUser(db, userId) {
  let transaction = db.transaction(['users'], 'readwrite');
  let store = transaction.objectStore('users');
  let request = store.delete(userId);

  request.onsuccess = () => {
    console.log('User deleted');
  };
}
```

### Transactions

**Key Points**:

- Group operations that must all succeed or all fail
- Automatically commit when all operations complete
- Can be explicitly aborted

```javascript
let transaction = db.transaction(['users', 'orders'], 'readwrite');

transaction.oncomplete = () => {
  console.log('All operations succeeded');
};

transaction.onerror = () => {
  console.log('Transaction failed, rolled back');
};

// Explicit abort
transaction.abort();
```

### Complete Example

See the zipcode database example in the document for a real-world implementation with:

- Database initialization
- Data population from JSON
- Primary key queries
- Index-based searches

---

## Storage Comparison Table

| Feature            | localStorage | sessionStorage | Cookies         | IndexedDB      |
| ------------------ | ------------ | -------------- | --------------- | -------------- |
| **Size limit**     | ~5-10MB      | ~5-10MB        | 4KB             | ~50MB+         |
| **Data type**      | Strings only | Strings only   | Strings         | Any (objects)  |
| **Persistence**    | Permanent    | Tab lifetime   | Configurable    | Permanent      |
| **Scope**          | Origin       | Origin + Tab   | Origin + Path   | Origin         |
| **Server access**  | No           | No             | Yes (auto-sent) | No             |
| **API complexity** | Easy         | Easy           | Hard            | Complex        |
| **Asynchronous**   | No           | No             | No              | Yes            |
| **Indexes**        | No           | No             | No              | Yes            |
| **Best for**       | Preferences  | Temp data      | Auth tokens     | Large datasets |

---

## Best Practices

✅ **Use localStorage for**: User preferences, app settings, cached data
✅ **Use sessionStorage for**: Temporary form data, wizard state
✅ **Use cookies for**: Authentication tokens, server-side data
✅ **Use IndexedDB for**: Large datasets, offline apps, complex queries
✅ **Always JSON.stringify()** when storing objects in Web Storage
✅ **Always encodeURIComponent()** when setting cookie values
✅ **Never store sensitive data** in any client-side storage
✅ **Handle errors** for all storage operations
✅ **Check storage availability** before use

---

## Key Concepts Summary

📌 **Three main storage types**: Web Storage, Cookies, IndexedDB
📌 **localStorage** is permanent and origin-scoped
📌 **sessionStorage** is temporary and tab-scoped
📌 **Cookies** are sent with every HTTP request
📌 **IndexedDB** is for large, structured data with querying
📌 **Storage events** enable cross-tab communication
📌 **All client-side storage is unencrypted** (security risk)
📌 **Transactions** in IndexedDB ensure data integrity
📌 **Indexes** enable fast lookups on non-primary keys
📌 **Origin-based security** prevents cross-site data access
