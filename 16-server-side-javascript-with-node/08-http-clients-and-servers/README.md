# HTTP Clients and Servers

## Overview

Node's **http**, **https**, and **http2** modules provide full-featured but low-level implementations of HTTP protocols for building clients and servers.

---

## HTTP Clients

### Simple GET Requests

The easiest way to make HTTP GET requests:

```javascript
const http = require('http');
const https = require('https');

// For http:// URLs
http.get('http://example.com', (response) => {
  // Handle response
});

// For https:// URLs
https.get('https://example.com', (response) => {
  // Handle response
});
```

**Key points**:

- First argument: URL to fetch
- Second argument: Callback invoked when response starts arriving
- Callback receives an `IncomingMessage` object
- Response is a **Readable stream**

### Basic GET Example

```javascript
const https = require('https');

https
  .get('https://api.example.com/data', (response) => {
    // Status and headers are available
    console.log('Status:', response.statusCode);
    console.log('Headers:', response.headers);

    // Set encoding to get strings instead of buffers
    response.setEncoding('utf8');

    let body = '';

    // Read body chunks as they arrive
    response.on('data', (chunk) => {
      body += chunk;
    });

    // Handle complete response
    response.on('end', () => {
      console.log('Body:', body);
    });
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  });
```

---

### POST Requests with JSON

Use `http.request()` or `https.request()` for more control:

```javascript
const https = require('https');

function postJSON(host, endpoint, body, port, username, password) {
  return new Promise((resolve, reject) => {
    // Convert body to JSON string
    let bodyText = JSON.stringify(body);

    // Configure the request
    let requestOptions = {
      method: 'POST',
      host: host,
      path: endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyText),
      },
    };

    // Optional port
    if (port) {
      requestOptions.port = port;
    }

    // Optional authentication
    if (username && password) {
      requestOptions.auth = `${username}:${password}`;
    }

    // Create the request
    let request = https.request(requestOptions);

    // Write body and end request
    request.write(bodyText);
    request.end();

    // Handle errors
    request.on('error', (e) => reject(e));

    // Handle response
    request.on('response', (response) => {
      // Check status code
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP status ${response.statusCode}`));
        // Discard response body (put stream in flowing mode)
        response.resume();
        return;
      }

      // Read response as text
      response.setEncoding('utf8');

      let body = '';
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
  });
}

// Usage
postJSON('api.example.com', '/users', { name: 'Alice', age: 30 })
  .then((result) => console.log('Success:', result))
  .catch((err) => console.error('Error:', err));
```

---

### Request Methods Summary

| Method              | Use Case                         | Notes                         |
| ------------------- | -------------------------------- | ----------------------------- |
| **http.get()**      | Simple GET requests              | Shorthand for http.request()  |
| **https.get()**     | Simple HTTPS GET                 | Shorthand for https.request() |
| **http.request()**  | Full control (POST, PUT, DELETE) | Returns request object        |
| **https.request()** | Full control over HTTPS          | Returns request object        |

---

## HTTP Servers

### Basic Server Setup

Three steps to create an HTTP server:

1. **Create** a Server object
2. **Listen** on a specified port
3. **Register** a "request" event handler

```javascript
const http = require('http');

// Create server
let server = http.createServer();

// Listen on port
server.listen(8000);
console.log('Server listening on port 8000');

// Handle requests
server.on('request', (request, response) => {
  // request: IncomingMessage (Readable stream)
  // response: ServerResponse (Writable stream)

  console.log(`${request.method} ${request.url}`);

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello, World!');
});
```

**Alternative syntax** (callback in createServer):

```javascript
let server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello, World!');
});

server.listen(8000);
```

---

### Complete Static File Server

```javascript
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

function serve(rootDirectory, port) {
  let server = new http.Server();
  server.listen(port);
  console.log('Listening on port', port);

  server.on('request', (request, response) => {
    // Parse URL to get pathname (ignore query string)
    let endpoint = url.parse(request.url).pathname;

    // Special endpoint: echo request back (for debugging)
    if (endpoint === '/test/mirror') {
      response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      response.writeHead(200);

      // Echo request line
      response.write(
        `${request.method} ${request.url} HTTP/${request.httpVersion}\r\n`
      );

      // Echo headers
      let headers = request.rawHeaders;
      for (let i = 0; i < headers.length; i += 2) {
        response.write(`${headers[i]}: ${headers[i + 1]}\r\n`);
      }
      response.write('\r\n');

      // Pipe request body to response
      request.pipe(response);
    }
    // Serve static files
    else {
      // Map URL to filesystem path
      let filename = endpoint.substring(1); // Remove leading /

      // Security: prevent directory traversal attacks
      filename = filename.replace(/\.\.\//g, '');

      // Convert to absolute path
      filename = path.resolve(rootDirectory, filename);

      // Determine content type from file extension
      let type;
      switch (path.extname(filename)) {
        case '.html':
        case '.htm':
          type = 'text/html';
          break;
        case '.js':
          type = 'text/javascript';
          break;
        case '.css':
          type = 'text/css';
          break;
        case '.png':
          type = 'image/png';
          break;
        case '.txt':
          type = 'text/plain';
          break;
        default:
          type = 'application/octet-stream';
          break;
      }

      // Create read stream for file
      let stream = fs.createReadStream(filename);

      stream.once('readable', () => {
        // File exists and is readable
        response.setHeader('Content-Type', type);
        response.writeHead(200);
        stream.pipe(response); // Automatically calls response.end()
      });

      stream.on('error', (err) => {
        // File doesn't exist or isn't readable
        response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        response.writeHead(404);
        response.end(err.message);
      });
    }
  });
}

// Start server from command line
// Usage: node server.js [directory] [port]
serve(process.argv[2] || '/tmp', parseInt(process.argv[3]) || 8000);
```

---

## Request Object (IncomingMessage)

The `request` object in server handlers:

```javascript
server.on('request', (request, response) => {
  // Common properties
  console.log(request.method); // "GET", "POST", etc.
  console.log(request.url); // "/path?query=string"
  console.log(request.httpVersion); // "1.1"
  console.log(request.headers); // Object with headers
  console.log(request.rawHeaders); // Array: [name, value, name, value, ...]

  // Request is a Readable stream (for POST bodies)
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => {
    console.log('Body:', body);
  });
});
```

---

## Response Object (ServerResponse)

The `response` object is a **Writable stream**:

### Setting Headers and Status

```javascript
// Set individual header
response.setHeader('Content-Type', 'text/html');
response.setHeader('X-Custom-Header', 'value');

// Write status and multiple headers at once
response.writeHead(200, {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
});

// Common status codes
response.writeHead(200); // OK
response.writeHead(404); // Not Found
response.writeHead(500); // Internal Server Error
response.writeHead(301, { Location: '/new-url' }); // Redirect
```

### Writing Response Body

```javascript
// Write data (can call multiple times)
response.write('Hello, ');
response.write('World!');

// End response (optionally with final data)
response.end(); // No more data
response.end('Goodbye!'); // Send final chunk and end

// Or combine (for simple responses)
response.end('Hello, World!');
```

### Streaming Response

```javascript
// Pipe a file to response
let stream = fs.createReadStream('file.txt');
stream.pipe(response); // Automatically calls response.end()
```

---

## Common Patterns

### JSON API Endpoint

```javascript
server.on('request', (request, response) => {
  if (request.url === '/api/data' && request.method === 'GET') {
    let data = { message: 'Hello', timestamp: Date.now() };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(data));
  }
});
```

### Handling POST Data

```javascript
server.on('request', (request, response) => {
  if (request.method === 'POST') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;

      // Prevent large uploads (security)
      if (body.length > 1e6) {
        // 1MB limit
        request.connection.destroy();
      }
    });

    request.on('end', () => {
      try {
        let data = JSON.parse(body);
        // Process data...
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ success: true }));
      } catch (e) {
        response.writeHead(400);
        response.end('Invalid JSON');
      }
    });
  }
});
```

### URL Routing

```javascript
const url = require('url');

server.on('request', (request, response) => {
  let parsedUrl = url.parse(request.url, true); // true = parse query string
  let pathname = parsedUrl.pathname;
  let query = parsedUrl.query;

  if (pathname === '/') {
    response.end('Home page');
  } else if (pathname === '/about') {
    response.end('About page');
  } else if (pathname === '/search') {
    response.end(`Searching for: ${query.q}`);
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});
```

---

## HTTPS Server

For HTTPS, you need SSL/TLS certificates:

```javascript
const https = require('https');
const fs = require('fs');

let options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

let server = https.createServer(options, (request, response) => {
  response.writeHead(200);
  response.end('Secure connection!');
});

server.listen(443);
```

---

## Error Handling

### Client Errors

```javascript
let request = https.get('https://example.com', (response) => {
  // Handle response
});

request.on('error', (err) => {
  console.error('Request failed:', err.message);
  // Common errors: ENOTFOUND, ECONNREFUSED, ETIMEDOUT
});
```

### Server Errors

```javascript
server.on('request', (request, response) => {
  try {
    // Your code
  } catch (err) {
    response.writeHead(500);
    response.end('Internal Server Error');
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
```

---

## Production Considerations

⚠️ **Node's built-in modules are low-level**. For production servers:

- **Use frameworks** like **Express**, **Koa**, or **Fastify**
- These provide:
  - Middleware support
  - Better routing
  - Request parsing (body, cookies, etc.)
  - Template engines
  - Security features
  - Session management

**Express example**:

```javascript
const express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

---

## Key Concepts Summary

📌 **http.get() / https.get()** - Simple GET requests
📌 **http.request() / https.request()** - Full control (POST, PUT, DELETE)
📌 **IncomingMessage** - Readable stream for responses/requests
📌 **ServerResponse** - Writable stream for sending responses
📌 **Streams** - All requests and responses are streams
📌 **Pipe** - Efficiently transfer data between streams
📌 **Status codes** - Set with `response.writeHead()`
📌 **Headers** - Set before writing body
📌 **Security** - Validate input, limit upload size, prevent path traversal
📌 **Frameworks** - Use Express/Koa for production applications
📌 **HTTPS** - Requires SSL certificates
📌 **Error handling** - Always handle "error" events

---

## Complete Example: Simple API Server

```javascript
const http = require('http');

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

let server = http.createServer((req, res) => {
  // Parse URL
  let [pathname, query] = req.url.split('?');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET /users
  if (pathname === '/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  // POST /users
  else if (pathname === '/users' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      let user = JSON.parse(body);
      user.id = users.length + 1;
      users.push(user);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    });
  }
  // 404
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
