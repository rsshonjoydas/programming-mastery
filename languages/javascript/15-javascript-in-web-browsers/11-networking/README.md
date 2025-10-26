# JavaScript Networking

JavaScript provides three main APIs for network communication in web browsers: **fetch()**, **Server-Sent Events (SSE)**, and **WebSockets**.

---

## 1. fetch() API

The **fetch()** method provides a Promise-based API for making HTTP and HTTPS requests.

### Basic Three-Step Process

1. Call `fetch()` with a URL
2. Get the Response object when HTTP response begins
3. Get the body object and process it

### Simple GET Request

```javascript
// Using Promises
fetch('/api/users/current')
  .then((response) => response.json())
  .then((currentUser) => {
    displayUserInfo(currentUser);
  });

// Using async/await
async function isServiceReady() {
  let response = await fetch('/api/service/status');
  let body = await response.text();
  return body === 'ready';
}
```

---

### HTTP Status Codes and Error Handling

**Important**: `fetch()` only rejects if it **cannot contact the server** (network failure). Server errors (404, 500) still fulfill the Promise.

```javascript
fetch('/api/users/current')
  .then((response) => {
    if (
      response.ok && // Check for success (status 200-299)
      response.headers.get('Content-Type') === 'application/json'
    ) {
      return response.json();
    } else {
      throw new Error(`Unexpected status ${response.status}`);
    }
  })
  .then((currentUser) => {
    displayUserInfo(currentUser);
  })
  .catch((error) => {
    console.log('Error:', error);
  });
```

**Response Properties**:

- `response.ok` - `true` if status is 200-299
- `response.status` - HTTP status code (200, 404, 500, etc.)
- `response.statusText` - Status text ("OK", "Not Found", etc.)
- `response.headers` - Headers object

---

### Working with Headers

**Reading headers**:

```javascript
fetch(url).then((response) => {
  for (let [name, value] of response.headers) {
    console.log(`${name}: ${value}`);
  }

  // Check specific header
  let contentType = response.headers.get('Content-Type');
  let hasAuth = response.headers.has('Authorization');
});
```

**Setting request headers**:

```javascript
let authHeaders = new Headers();
authHeaders.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);

fetch('/api/users/', { headers: authHeaders })
  .then((response) => response.json())
  .then((usersList) => displayAllUsers(usersList));
```

---

### Request Parameters (Query Strings)

```javascript
async function search(term) {
  let url = new URL('/api/search');
  url.searchParams.set('q', term);

  let response = await fetch(url);
  if (!response.ok) throw new Error(response.statusText);

  let resultsArray = await response.json();
  return resultsArray;
}
```

---

### Parsing Response Bodies

**Common methods**:

| Method          | Returns               | Use Case                     |
| --------------- | --------------------- | ---------------------------- |
| `json()`        | Promise → Object      | JSON data                    |
| `text()`        | Promise → String      | Plain text                   |
| `arrayBuffer()` | Promise → ArrayBuffer | Binary data                  |
| `blob()`        | Promise → Blob        | Large binary (files, images) |
| `formData()`    | Promise → FormData    | Multipart form data          |

```javascript
// JSON
let data = await response.json();

// Text
let text = await response.text();

// Binary
let buffer = await response.arrayBuffer();
let bytes = new Uint8Array(buffer);

// Blob (for large files)
let blob = await response.blob();
let url = URL.createObjectURL(blob);
```

---

### Streaming Response Bodies

For large responses or progress tracking:

```javascript
async function streamBody(response, reportProgress, processChunk) {
  let expectedBytes = parseInt(response.headers.get('Content-Length'));
  let bytesRead = 0;
  let reader = response.body.getReader();
  let decoder = new TextDecoder('utf-8');
  let body = '';

  while (true) {
    let { done, value } = await reader.read();

    if (value) {
      if (processChunk) {
        let processed = processChunk(value);
        if (processed) body += processed;
      } else {
        body += decoder.decode(value, { stream: true });
      }

      if (reportProgress) {
        bytesRead += value.length;
        reportProgress(bytesRead, bytesRead / expectedBytes);
      }
    }

    if (done) break;
  }

  return body;
}

// Usage with progress
fetch('big.json')
  .then((response) => streamBody(response, updateProgress))
  .then((bodyText) => JSON.parse(bodyText))
  .then(handleBigJSONObject);
```

---

### POST Requests with Body

**String body**:

```javascript
fetch(url, {
  method: 'POST',
  body: 'hello world',
});
```

**JSON body**:

```javascript
fetch(url, {
  method: 'POST',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  body: JSON.stringify(requestBody),
});
```

**URL-encoded parameters**:

```javascript
let params = new URLSearchParams();
params.set('username', 'alice');
params.set('password', 'secret');

fetch(url, {
  method: 'POST',
  body: params, // Content-Type: application/x-www-form-urlencoded
});
```

**FormData (multipart)**:

```javascript
let formData = new FormData();
formData.set('username', 'alice');
formData.set('file', fileBlob);

fetch(url, {
  method: 'POST',
  body: formData, // Content-Type: multipart/form-data
});
```

---

### File Upload

```javascript
// Upload from <input type="file">
let fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async () => {
  let formData = new FormData();
  formData.set('file', fileInput.files[0]);

  let response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
});

// Upload canvas as PNG
async function uploadCanvasImage(canvas) {
  let pngblob = await new Promise((resolve) => canvas.toBlob(resolve));
  let formdata = new FormData();
  formdata.set('canvasimage', pngblob);

  let response = await fetch('/upload', {
    method: 'POST',
    body: formdata,
  });
}
```

---

### Cross-Origin Requests (CORS)

**Same-origin**: Request to your own server (no restrictions)
**Cross-origin**: Request to different domain (requires CORS)

```javascript
// Browser adds "Origin" header automatically
// Server must respond with "Access-Control-Allow-Origin" header

fetch('https://api.example.com/data')
  .then((response) => response.json())
  .catch((error) => console.log('CORS error or network failure'));
```

---

### Aborting Requests

```javascript
let controller = new AbortController();

fetch(url, { signal: controller.signal })
  .then((response) => response.json())
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    }
  });

// Abort the request
controller.abort();

// With timeout
function fetchWithTimeout(url, options = {}) {
  if (options.timeout) {
    let controller = new AbortController();
    options.signal = controller.signal;
    setTimeout(() => controller.abort(), options.timeout);
  }
  return fetch(url, options);
}

// Usage
fetchWithTimeout(url, { timeout: 5000 }).then((response) => response.json());
```

---

### Additional Options

**Cache control**:

```javascript
fetch(url, {
  cache: 'no-store', // Don't use cache
  // cache: "reload"   // Ignore cache, but update it
  // cache: "no-cache" // Revalidate cached responses
  // cache: "force-cache" // Use even stale cache
});
```

**Redirect handling**:

```javascript
fetch(url, {
  redirect: 'follow', // Default: follow redirects
  // redirect: "error" // Reject on redirect
  // redirect: "manual" // Handle redirects manually
});
```

**Referrer**:

```javascript
fetch(url, {
  referrer: '', // Omit Referer header
  // referrer: "/some/page"  // Set custom referrer
});
```

---

## 2. Server-Sent Events (SSE)

Server pushes events to the client over a long-lived HTTP connection.

### Basic Usage

```javascript
let ticker = new EventSource('stockprices.php');

ticker.addEventListener('bid', (event) => {
  displayNewBid(event.data);
});

// Default event type is "message"
ticker.addEventListener('message', (event) => {
  console.log(event.data);
});
```

### Event Object Properties

- `event.data` - Message payload (string)
- `event.type` - Event type/name
- `event.lastEventId` - Event ID for reconnection

### SSE Protocol Format

```text
event: bid
data: GOOG
data: 999

```

---

### Complete Chat Client Example

```javascript
// Client-side
let nick = prompt('Enter your nickname');
let input = document.getElementById('input');

// Receive messages
let chat = new EventSource('/chat');
chat.addEventListener('chat', (event) => {
  let div = document.createElement('div');
  div.append(event.data);
  input.before(div);
  input.scrollIntoView();
});

// Send messages
input.addEventListener('change', () => {
  fetch('/chat', {
    method: 'POST',
    body: nick + ': ' + input.value,
  }).catch((e) => console.error);
  input.value = '';
});
```

### When to Use SSE

✅ Server needs to push updates to client
✅ One-way communication (server → client)
✅ Text-based messages
✅ Automatic reconnection needed
✅ Simpler than WebSockets

❌ Don't use for: Binary data, bidirectional communication

---

## 3. WebSockets

Full-duplex, bidirectional communication between client and server.

### Creating a Connection

```javascript
let socket = new WebSocket('wss://example.com/service');

// Connection states
socket.readyState === WebSocket.CONNECTING; // Connecting
socket.readyState === WebSocket.OPEN; // Connected
socket.readyState === WebSocket.CLOSING; // Closing
socket.readyState === WebSocket.CLOSED; // Closed
```

### Event Handlers

```javascript
socket.onopen = () => {
  console.log('WebSocket connected');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onclose = () => {
  console.log('WebSocket closed');
};

socket.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

---

### Sending Messages

```javascript
// Send text
socket.send('Hello, server!');

// Send JSON
socket.send(JSON.stringify({ type: 'chat', message: 'Hello' }));

// Send binary (ArrayBuffer)
let buffer = new ArrayBuffer(8);
socket.send(buffer);

// Send binary (Blob)
let blob = new Blob(['binary data']);
socket.send(blob);

// Check buffered amount
console.log(socket.bufferedAmount); // Bytes not yet sent
```

---

### Receiving Messages

**Text messages**:

```javascript
socket.onmessage = (event) => {
  if (typeof event.data === 'string') {
    console.log('Text:', event.data);
  }
};
```

**Binary messages**:

```javascript
// Default: Blob
socket.onmessage = (event) => {
  if (event.data instanceof Blob) {
    // Handle Blob
  }
};

// Change to ArrayBuffer
socket.binaryType = 'arraybuffer';
socket.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    let bytes = new Uint8Array(event.data);
  }
};
```

---

### Protocol Negotiation

```javascript
// Client supports multiple protocol versions
let socket = new WebSocket('wss://example.com/service', [
  'protocol-v2',
  'protocol-v1',
]);

socket.onopen = () => {
  console.log('Using protocol:', socket.protocol);
};
```

---

### Closing Connection

```javascript
socket.close(); // Normal closure
socket.close(1000, 'Normal closure'); // With code and reason
```

---

### Complete Example

```javascript
class ChatClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.setupHandlers();
  }

  setupHandlers() {
    this.socket.onopen = () => {
      console.log('Connected to chat');
      this.send({ type: 'join', username: this.username });
    };

    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      this.displayMessage(message);
    };

    this.socket.onerror = (error) => {
      console.error('Connection error:', error);
    };

    this.socket.onclose = () => {
      console.log('Disconnected');
      // Reconnect after delay
      setTimeout(() => new ChatClient(this.url), 5000);
    };
  }

  send(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  displayMessage(message) {
    console.log(`${message.user}: ${message.text}`);
  }
}

// Usage
let chat = new ChatClient('wss://chat.example.com');
```

---

## Comparison of Networking APIs

| Feature             | fetch()          | SSE             | WebSockets                |
| ------------------- | ---------------- | --------------- | ------------------------- |
| **Direction**       | Request/Response | Server → Client | Bidirectional             |
| **Protocol**        | HTTP/HTTPS       | HTTP            | WebSocket (ws://, wss://) |
| **Data Format**     | Any              | Text            | Text + Binary             |
| **Use Case**        | API calls        | Server push     | Real-time chat, games     |
| **Complexity**      | Simple           | Medium          | Complex                   |
| **Reconnection**    | Manual           | Automatic       | Manual                    |
| **Browser Support** | ✅ Excellent     | ✅ Good         | ✅ Excellent              |

---

## When to Use Each API

### Use fetch() for

✅ Standard HTTP requests (GET, POST, PUT, DELETE)
✅ RESTful API calls
✅ File uploads/downloads
✅ One-time data retrieval

### Use Server-Sent Events for

✅ Server pushing updates (stock prices, notifications)
✅ One-way real-time data
✅ Automatic reconnection needed
✅ Text-only messages

### Use WebSockets for

✅ Real-time bidirectional communication
✅ Chat applications
✅ Multiplayer games
✅ Collaborative editing
✅ Binary data transfer

---

## Key Concepts Summary

📌 **fetch()** replaces XMLHttpRequest for modern HTTP requests
📌 fetch() is **Promise-based** with async/await support
📌 fetch() only rejects on **network failure**, not HTTP errors
📌 Always check `response.ok` for successful status codes
📌 **SSE** enables server-to-client event streaming over HTTP
📌 SSE automatically reconnects on connection loss
📌 **WebSockets** provide full-duplex, real-time communication
📌 WebSockets support both text and binary messages
📌 Use **AbortController** to cancel fetch() requests
📌 **CORS** must be enabled on server for cross-origin requests
📌 URLs determine protocol: `https://` (fetch), `wss://` (WebSocket)
