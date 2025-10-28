# Non-HTTP Network Servers and Clients

## Overview

Node.js supports creating **custom network servers and clients** beyond HTTP/HTTPS. Network sockets are **Duplex streams**, making networking relatively simple if you understand streams.

---

## The "net" Module

The `net` module provides classes for TCP networking:

- **Server** - Creates TCP servers
- **Socket** - Represents connections (Duplex stream)

---

## Creating a TCP Server

### Basic Steps

1. **Create server**: `net.createServer()`
2. **Listen on port**: `server.listen(port)`
3. **Handle connections**: Listen for `"connection"` events
4. **Read/Write**: Use Socket (Duplex stream)
5. **Disconnect**: Call `socket.end()`

### Simple Server Example

```javascript
const net = require('net');

// Create server
let server = net.createServer();

// Listen on port 6789
server.listen(6789, () => {
  console.log('Server listening on port 6789');
});

// Handle client connections
server.on('connection', (socket) => {
  console.log('Client connected');

  // Write to client
  socket.write('Hello from server!\n');

  // Read from client
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
  });

  // Close connection
  socket.end();
});
```

---

## Creating a TCP Client

### **Basic Steps**

1. **Connect**: `net.createConnection(port, hostname)`
2. **Read/Write**: Use returned Socket
3. **Handle events**: Listen for data, close, error

### Simple Client Example

```javascript
const net = require('net');

// Connect to server
let socket = net.createConnection(6789, 'localhost');

// Handle connection
socket.on('connect', () => {
  console.log('Connected to server');
  socket.write('Hello from client!\n');
});

// Read from server
socket.on('data', (data) => {
  console.log('Server says:', data.toString());
});

// Handle close
socket.on('close', () => {
  console.log('Connection closed');
  process.exit();
});

// Handle errors
socket.on('error', (err) => {
  console.error('Error:', err);
});
```

---

## Complete Example: Knock-Knock Joke Server

### Server Implementation

```javascript
const net = require('net');
const readline = require('readline');

// Create and start server
let server = net.createServer();
server.listen(6789, () => console.log('Delivering laughs on port 6789'));

// Handle connections
server.on('connection', (socket) => {
  tellJoke(socket)
    .then(() => socket.end())
    .catch((err) => {
      console.error(err);
      socket.end();
    });
});

// Joke database
const jokes = {
  Boo: "Don't cry...it's only a joke!",
  Lettuce: "Let us in! It's freezing out here!",
  'A little old lady': "Wow, I didn't know you could yodel!",
};

// Interactive joke telling
async function tellJoke(socket) {
  // Pick random joke
  let randomElement = (a) => a[Math.floor(Math.random() * a.length)];
  let who = randomElement(Object.keys(jokes));
  let punchline = jokes[who];

  // Set up readline for line-by-line input
  let lineReader = readline.createInterface({
    input: socket,
    output: socket,
    prompt: '>> ',
  });

  // Helper to output text
  function output(text, prompt = true) {
    socket.write(`${text}\r\n`);
    if (prompt) lineReader.prompt();
  }

  // Track conversation stage
  let stage = 0;

  // Start the joke
  output('Knock knock!');

  // Read lines asynchronously
  for await (let inputLine of lineReader) {
    if (stage === 0) {
      if (inputLine.toLowerCase() === "who's there?") {
        output(who);
        stage = 1;
      } else {
        output('Please type "Who\'s there?".');
      }
    } else if (stage === 1) {
      if (inputLine.toLowerCase() === `${who.toLowerCase()} who?`) {
        output(`${punchline}`, false);
        return;
      } else {
        output(`Please type "${who} who?".`);
      }
    }
  }
}
```

### Client Implementation

```javascript
// Connect to server
let socket = require('net').createConnection(6789, process.argv[2]);

// Pipe server output to stdout
socket.pipe(process.stdout);

// Pipe stdin to server
process.stdin.pipe(socket);

// Exit when connection closes
socket.on('close', () => process.exit());
```

### Using with netcat (nc)

```bash
$ nc localhost 6789
Knock knock!
>> Who's there?
A little old lady
>> A little old lady who?
Wow, I didn't know you could yodel!
```

---

## Socket Events and Methods

### Socket Events

| Event         | Description            | When Emitted                    |
| ------------- | ---------------------- | ------------------------------- |
| **"connect"** | Connection established | Client connects successfully    |
| **"data"**    | Data received          | Data arrives from other end     |
| **"end"**     | Other end closed       | Other end calls end()           |
| **"close"**   | Connection closed      | Socket fully closed             |
| **"error"**   | Error occurred         | Connection or I/O error         |
| **"drain"**   | Write buffer empty     | OK to write more (backpressure) |

### Socket Methods

| Method          | Description      | Usage                         |
| --------------- | ---------------- | ----------------------------- |
| **write(data)** | Send data        | `socket.write("Hello\n")`     |
| **end([data])** | Close connection | `socket.end("Goodbye\n")`     |
| **destroy()**   | Force close      | `socket.destroy()`            |
| **pause()**     | Pause reading    | `socket.pause()`              |
| **resume()**    | Resume reading   | `socket.resume()`             |
| **pipe(dest)**  | Pipe to stream   | `socket.pipe(process.stdout)` |

### Server Events

| Event            | Description      | Value Passed  |
| ---------------- | ---------------- | ------------- |
| **"connection"** | Client connected | Socket object |
| **"listening"**  | Server started   | None          |
| **"error"**      | Server error     | Error object  |
| **"close"**      | Server closed    | None          |

---

## Working with Streams

Since sockets are **Duplex streams**, you can:

### 1. Pipe Data

```javascript
// Server to client
fileStream.pipe(socket);

// Client to server
socket.pipe(process.stdout);

// Both directions
process.stdin.pipe(socket);
socket.pipe(process.stdout);
```

### 2. Handle Backpressure

```javascript
socket.on('data', (chunk) => {
  let canWrite = outputStream.write(chunk);
  if (!canWrite) {
    socket.pause();
    outputStream.once('drain', () => socket.resume());
  }
});
```

### 3. Use Async Iteration

```javascript
for await (let chunk of socket) {
  console.log('Received:', chunk.toString());
}
```

---

## Additional Network Features

### 1. Unix Domain Sockets

**Alternative to TCP** - identified by filesystem path instead of port:

```javascript
// Server
server.listen('/tmp/my.sock');

// Client
let socket = net.createConnection('/tmp/my.sock');
```

**Use cases**:

- Inter-process communication (IPC) on same machine
- Faster than TCP (no network stack overhead)
- File system permissions for security

### 2. UDP (User Datagram Protocol)

Module: `dgram`

```javascript
const dgram = require('dgram');

// Create UDP socket
let socket = dgram.createSocket('udp4');

// Server - bind to port
socket.bind(8080);
socket.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

// Client - send message
socket.send(buffer, port, address, callback);
```

**Characteristics**:

- Connectionless (no handshake)
- Unreliable (packets may be lost)
- Fast and lightweight
- Good for real-time applications (gaming, streaming)

### 3. TLS/SSL (Secure Sockets)

Module: `tls` (like HTTPS is to HTTP)

```javascript
const tls = require('tls');
const fs = require('fs');

// Secure server
let options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

let server = tls.createServer(options, (socket) => {
  socket.write('Secure connection established\n');
});

server.listen(8000);

// Secure client
let socket = tls.connect(8000, 'localhost', () => {
  console.log('Connected securely');
});
```

**Classes**:

- `tls.Server` - Like `net.Server` but encrypted
- `tls.TLSSocket` - Like `net.Socket` but encrypted

---

## Complete Echo Server Example

### Server

```javascript
const net = require('net');

let server = net.createServer((socket) => {
  console.log('Client connected');

  socket.write('Welcome to echo server!\n');

  socket.on('data', (data) => {
    // Echo data back to client
    socket.write(`Echo: ${data}`);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(8080, () => {
  console.log('Echo server listening on port 8080');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
```

### Client

```javascript
const net = require('net');
const readline = require('readline');

let socket = net.createConnection(8080, 'localhost');

socket.on('connect', () => {
  console.log('Connected to echo server');

  // Set up readline for user input
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    socket.write(line + '\n');
  });
});

socket.on('data', (data) => {
  process.stdout.write(data.toString());
});

socket.on('close', () => {
  console.log('Connection closed');
  process.exit();
});

socket.on('error', (err) => {
  console.error('Error:', err);
});
```

---

## Best Practices

✅ **Always handle errors** on sockets and servers
✅ **Close sockets properly** with `end()` or `destroy()`
✅ **Handle backpressure** when piping or writing large amounts of data
✅ **Use async/await** with `for await` loops for cleaner code
✅ **Set timeouts** to prevent hanging connections
✅ **Validate input** from clients (security)
✅ **Log connections** for debugging and monitoring
✅ **Use TLS** for sensitive data

---

## Common Patterns

### 1. Line-Based Protocol

```javascript
const readline = require('readline');

let rl = readline.createInterface({
  input: socket,
  output: socket,
});

rl.on('line', (line) => {
  // Process line
});
```

### 2. Binary Protocol

```javascript
socket.on('data', (buffer) => {
  // Parse binary data
  let header = buffer.readInt32BE(0);
  let data = buffer.slice(4);
});
```

### 3. Connection Pooling

```javascript
let connections = new Set();

server.on('connection', (socket) => {
  connections.add(socket);

  socket.on('close', () => {
    connections.delete(socket);
  });
});

// Broadcast to all
function broadcast(message) {
  for (let socket of connections) {
    socket.write(message);
  }
}
```

---

## Key Concepts Summary

📌 **Sockets are Duplex streams** - can read and write
📌 **net.createServer()** creates TCP servers
📌 **net.createConnection()** creates TCP clients
📌 **"connection" event** fires when clients connect
📌 **socket.write()** sends data
📌 **socket.end()** closes connection gracefully
📌 **Piping** simplifies data transfer between streams
📌 **Unix domain sockets** use file paths for IPC
📌 **dgram module** for UDP communication
📌 **tls module** for encrypted TCP connections
📌 **Always handle errors and close events**
📌 **Custom protocols** enable specialized communication

---

## When to Use Non-HTTP Networking

✅ **Real-time applications** (chat, gaming, live updates)
✅ **Custom protocols** (database drivers, message queues)
✅ **High-performance systems** (low overhead vs HTTP)
✅ **Inter-process communication** (Unix sockets)
✅ **IoT devices** (lightweight protocols)
✅ **Streaming data** (audio, video, sensor data)
✅ **Microservices** (internal service communication)
