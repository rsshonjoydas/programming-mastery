# Streams

## What Are Streams?

**Streams** are a powerful abstraction for handling data that flows through your program in **small chunks** rather than loading everything into memory at once.

### Why Use Streams?

**Problem with non-streaming approach**:

```javascript
const fs = require('fs');

// Inefficient: loads entire file into memory
function copyFile(sourceFilename, destinationFilename, callback) {
  fs.readFile(sourceFilename, (err, buffer) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(destinationFilename, buffer, callback);
    }
  });
}
```

**Issues**:

- Must allocate enough memory for the entire file
- Fails with very large files
- Cannot start writing until reading is complete
- Inefficient for concurrent operations

**Stream solution**:

- Process data in small chunks
- Memory efficient (full dataset never in memory)
- Faster processing (can start output before input completes)
- Ideal for large files and high concurrency

---

## Four Types of Streams

### 1. Readable Streams

**Sources of data** - you read from them

```javascript
const fs = require('fs');
let input = fs.createReadStream('file.txt'); // Read from file
let stdin = process.stdin; // Read from standard input
```

### 2. Writable Streams

**Sinks/destinations for data** - you write to them

```javascript
let output = fs.createWriteStream('file.txt'); // Write to file
let stdout = process.stdout; // Write to standard output
```

### 3. Duplex Streams

**Both readable and writable** - combine both into one object

```javascript
const net = require('net');
let socket = net.connect(port, host); // Network socket
// Can both read from and write to the socket
```

### 4. Transform Streams

**Readable and writable** - data written becomes readable (usually transformed)

```javascript
const zlib = require('zlib');
let gzipper = zlib.createGzip(); // Compress data

const crypto = require('crypto');
let encryptor = crypto.createCipheriv(); // Encrypt data
```

---

## Stream Basics

### Encoding

By default, streams read/write **Buffers**:

```javascript
// Return strings instead of Buffers
stream.setEncoding('utf8');

// Write strings (automatically encoded)
stream.write('hello'); // Encoded to buffer
```

### Buffering

Streams have **internal buffers** to handle speed mismatches:

- Reader faster than writer → buffer fills up
- Writer faster than reader → buffer empties
- Buffer management is automatic but understanding it is crucial

---

## 1. Pipes - The Simplest Approach

**Pipes** connect a Readable stream directly to a Writable stream. Node handles all complexity automatically.

### Basic Pipe

```javascript
const fs = require('fs');

function pipeFileToSocket(filename, socket) {
  fs.createReadStream(filename).pipe(socket);
}
```

### Pipe with Error Handling

```javascript
function pipe(readable, writable, callback) {
  function handleError(err) {
    readable.close();
    writable.close();
    callback(err);
  }

  readable
    .on('error', handleError)
    .pipe(writable)
    .on('error', handleError)
    .on('finish', callback);
}
```

### Transform Stream Pipeline

```javascript
const fs = require('fs');
const zlib = require('zlib');

function gzip(filename, callback) {
  let source = fs.createReadStream(filename);
  let destination = fs.createWriteStream(filename + '.gz');
  let gzipper = zlib.createGzip();

  source
    .on('error', callback)
    .pipe(gzipper)
    .pipe(destination)
    .on('error', callback)
    .on('finish', callback);
}
```

### Custom Transform Stream

```javascript
const stream = require('stream');

class GrepStream extends stream.Transform {
  constructor(pattern) {
    super({ decodeStrings: false });
    this.pattern = pattern;
    this.incompleteLine = '';
  }

  _transform(chunk, encoding, callback) {
    if (typeof chunk !== 'string') {
      callback(new Error('Expected a string but got a buffer'));
      return;
    }

    // Split into lines
    let lines = (this.incompleteLine + chunk).split('\n');
    this.incompleteLine = lines.pop();

    // Filter matching lines
    let output = lines.filter((l) => this.pattern.test(l)).join('\n');

    if (output) output += '\n';
    callback(null, output);
  }

  _flush(callback) {
    if (this.pattern.test(this.incompleteLine)) {
      callback(null, this.incompleteLine + '\n');
    }
  }
}

// Usage: grep pattern from stdin to stdout
let pattern = new RegExp(process.argv[2]);
process.stdin
  .setEncoding('utf8')
  .pipe(new GrepStream(pattern))
  .pipe(process.stdout)
  .on('error', () => process.exit());
```

---

## 2. Asynchronous Iteration (Node 12+)

Readable streams are **async iterators** - use `for await` loops.

### Async Grep Example

```javascript
async function grep(source, destination, pattern, encoding = 'utf8') {
  source.setEncoding(encoding);
  destination.on('error', (err) => process.exit());

  let incompleteLine = '';

  // Asynchronously read chunks
  for await (let chunk of source) {
    let lines = (incompleteLine + chunk).split('\n');
    incompleteLine = lines.pop();

    for (let line of lines) {
      if (pattern.test(line)) {
        destination.write(line + '\n', encoding);
      }
    }
  }

  // Check final line
  if (pattern.test(incompleteLine)) {
    destination.write(incompleteLine + '\n', encoding);
  }
}

// Usage
let pattern = new RegExp(process.argv[2]);
grep(process.stdin, process.stdout, pattern).catch((err) => {
  console.error(err);
  process.exit();
});
```

---

## 3. Writing to Streams and Backpressure

### The write() Method

```javascript
stream.write(data); // Write buffer or string
stream.write(string, encoding); // Write with specific encoding
stream.write(data, callback); // Callback when written
```

**Return value is critical**:

- `true` → Buffer has room, OK to write more
- `false` → Buffer is full (**backpressure**)

### Handling Backpressure

**Backpressure** = signal that you're writing faster than the stream can handle

```javascript
function write(stream, chunk, callback) {
  let hasMoreRoom = stream.write(chunk);

  if (hasMoreRoom) {
    setImmediate(callback); // OK to write more
  } else {
    stream.once('drain', callback); // Wait for drain event
  }
}
```

### Promise-Based Write with Backpressure

```javascript
function write(stream, chunk) {
  let hasMoreRoom = stream.write(chunk);

  if (hasMoreRoom) {
    return Promise.resolve(null);
  } else {
    return new Promise((resolve) => {
      stream.once('drain', resolve);
    });
  }
}

// Usage with async/await
async function copy(source, destination) {
  destination.on('error', (err) => process.exit());

  for await (let chunk of source) {
    await write(destination, chunk); // Respects backpressure
  }
}

copy(process.stdin, process.stdout);
```

### Security Warning

**Ignoring backpressure can cause**:

- Memory overflow (buffers grow indefinitely)
- Server slowdown/crashes
- **Denial-of-service vulnerability**

Example attack: Request large files but never read them → server buffers overflow

---

## 4. Reading Streams with Events

Two modes: **Flowing Mode** and **Paused Mode**. Never mix them!

### Flowing Mode

Data is **pushed** to you via "data" events as soon as it arrives.

**Events**:

- `"data"` → Chunk of data available (automatically starts flowing)
- `"end"` → No more data
- `"error"` → An error occurred

```javascript
const fs = require('fs');

function copyFile(sourceFilename, destinationFilename, callback) {
  let input = fs.createReadStream(sourceFilename);
  let output = fs.createWriteStream(destinationFilename);

  input.on('data', (chunk) => {
    let hasRoom = output.write(chunk);
    if (!hasRoom) {
      input.pause(); // Pause when output buffer is full
    }
  });

  input.on('end', () => {
    output.end();
  });

  input.on('error', (err) => {
    callback(err);
    process.exit();
  });

  output.on('drain', () => {
    input.resume(); // Resume when output buffer has room
  });

  output.on('error', (err) => {
    callback(err);
    process.exit();
  });

  output.on('finish', () => {
    callback(null);
  });
}

// Usage
copyFile('source.txt', 'dest.txt', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('done.');
  }
});
```

**Key methods**:

- `pause()` → Stop "data" events
- `resume()` → Restart "data" events

### Paused Mode

You **pull** data by calling `read()` method (non-blocking).

**Events**:

- `"readable"` → Data is available to read
- `"end"` → No more data
- `"error"` → An error occurred

```javascript
const fs = require('fs');
const crypto = require('crypto');

function sha256(filename, callback) {
  let input = fs.createReadStream(filename);
  let hasher = crypto.createHash('sha256');

  input.on('readable', () => {
    let chunk;
    while ((chunk = input.read())) {
      // Read until null
      hasher.update(chunk);
    }
  });

  input.on('end', () => {
    let hash = hasher.digest('hex');
    callback(null, hash);
  });

  input.on('error', callback);
}

// Usage
sha256('file.txt', (err, hash) => {
  if (err) {
    console.error(err.toString());
  } else {
    console.log(hash);
  }
});
```

**Important**: Must drain the buffer completely (read until `null`) to trigger next "readable" event.

---

## Stream API Summary

| Method/Event         | Description                     | Mode     |
| -------------------- | ------------------------------- | -------- |
| **pipe(dest)**       | Connect readable to writable    | Both     |
| **for await**        | Async iteration                 | Both     |
| **"data"** event     | Data chunk available            | Flowing  |
| **pause()**          | Stop data events                | Flowing  |
| **resume()**         | Restart data events             | Flowing  |
| **"readable"** event | Data ready to read              | Paused   |
| **read()**           | Pull data from stream           | Paused   |
| **write(chunk)**     | Write data (returns true/false) | Writable |
| **"drain"** event    | Buffer has room again           | Writable |
| **"end"** event      | Stream finished                 | Readable |
| **"finish"** event   | All data written                | Writable |
| **"error"** event    | Error occurred                  | All      |

---

## Best Practices

✅ **Use pipes** when simply copying data between streams
✅ **Use async iteration** (for await) when processing data chunks
✅ **Always handle backpressure** when writing to streams
✅ **Never mix flowing and paused modes**
✅ **Register error handlers** on all streams
✅ **Use Transform streams** for data processing pipelines
✅ **Call setEncoding()** if you want strings instead of Buffers
✅ **Drain buffers completely** in paused mode (read until null)

---

## Key Concepts

📌 **Streams process data in chunks** to avoid memory overload
📌 **Four types**: Readable, Writable, Duplex, Transform
📌 **Pipes** are the simplest way to connect streams
📌 **Backpressure** signals when to slow down writing
📌 **Ignoring backpressure** can cause memory/security issues
📌 **Flowing mode** pushes data via events
📌 **Paused mode** pulls data via read() method
📌 **Async iteration** (for await) is the modern approach
📌 **All stream APIs are event-based** (non-blocking)
📌 **Internal buffers** handle speed mismatches automatically
