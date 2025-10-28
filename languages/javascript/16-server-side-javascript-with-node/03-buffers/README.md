# Node Buffers

## What is a Buffer?

A **Buffer** is a Node.js class that represents a **sequence of bytes** (similar to how strings represent sequences of characters).

### Key Characteristics

- **Subclass of Uint8Array**: Buffer extends the typed array `Uint8Array`
- **Binary data handling**: Designed for working with raw binary data
- **String interoperability**: Can easily convert between bytes and strings using character encodings
- **Mutable**: Unlike strings, buffers can be modified in place
- **Fixed size**: Once allocated, the size cannot be changed

### Why Buffers Exist

Node.js was created before JavaScript had typed arrays (`Uint8Array`). Buffers were introduced to handle binary data. Even though `Uint8Array` now exists, Buffer remains important because it provides seamless conversion between binary data and text strings.

---

## Character Encodings

Character encodings map characters to bytes. Node's Buffer methods support encoding/decoding with these encodings:

| Encoding      | Description                                          | Use Case                               |
| ------------- | ---------------------------------------------------- | -------------------------------------- |
| **"utf8"**    | Default Unicode encoding (1-4 bytes per character)   | General text, international characters |
| **"utf16le"** | 2-byte Unicode, little-endian (alias: "ucs2")        | Wide character sets                    |
| **"latin1"**  | ISO-8859-1, one byte per character (alias: "binary") | Western European languages             |
| **"ascii"**   | 7-bit English-only encoding                          | Legacy systems, simple text            |
| **"hex"**     | Each byte → 2 ASCII hex digits                       | Debugging, data inspection             |
| **"base64"**  | 3 bytes → 4 ASCII characters                         | Data transmission, email attachments   |

---

## Creating Buffers

### 1. From an Array of Bytes

```javascript
let b = Buffer.from([0x41, 0x42, 0x43]);
// <Buffer 41 42 43>
```

### 2. From a String with Encoding

```javascript
let computer = Buffer.from('IBM3111', 'ascii');
// Creates buffer from ASCII string

let utf8Buf = Buffer.from('Hello 世界', 'utf8');
// Creates buffer from UTF-8 string (default)
```

### 3. Allocating New Buffers

```javascript
// Create buffer filled with zeros
let zeros = Buffer.alloc(1024); // 1024 bytes of zeros

// Create buffer filled with specific value
let ones = Buffer.alloc(128, 1); // 128 bytes, each = 1

// Create buffer with repeating pattern
let dead = Buffer.alloc(1024, 'DEADBEEF', 'hex');
// Repeats the pattern to fill 1024 bytes
```

### 4. Unsafe Allocation (Not Recommended)

```javascript
let unsafe = Buffer.allocUnsafe(1024);
// Faster but contains uninitialized memory
// Must overwrite before use to avoid security issues
```

---

## Converting Buffers to Strings

Use the `.toString()` method with optional encoding:

```javascript
let b = Buffer.from([0x41, 0x42, 0x43]);

b.toString(); // "ABC" (default utf8)
b.toString('utf8'); // "ABC"
b.toString('hex'); // "414243"
b.toString('base64'); // "QUJD"
```

---

## Working with Buffers as Byte Arrays

Buffers are **mutable** and can be accessed like arrays:

```javascript
let computer = Buffer.from('IBM3111', 'ascii');

// Access individual bytes
console.log(computer[0]); // 73 (ASCII code for 'I')

// Modify bytes (buffers are mutable!)
for (let i = 0; i < computer.length; i++) {
  computer[i]--; // Decrement each byte
}

computer.toString('ascii'); // "HAL2000"
```

### Buffer Properties

```javascript
let buf = Buffer.from('Hello');

buf.length; // 5 (number of bytes)
buf[0]; // 72 (byte value at index 0)
```

---

## Buffer Methods

### Slicing and Subarray

```javascript
let buf = Buffer.from('Hello World');

// Create a view (doesn't copy data)
let sub = buf.subarray(0, 5);
sub.toString(); // "Hello"

// Modify subarray affects original
sub[0] = 0x68; // 'h'
buf.toString(); // "hello World"
```

### Mapping

```javascript
let computer = Buffer.from('HAL2000', 'ascii');
let result = computer.subarray(0, 3).map((x) => x + 1);
result.toString(); // "IBM"
```

### Copying

```javascript
let buf1 = Buffer.from('Hello');
let buf2 = Buffer.alloc(5);

buf1.copy(buf2);
buf2.toString(); // "Hello"
```

### Concatenation

```javascript
let buf1 = Buffer.from('Hello ');
let buf2 = Buffer.from('World');

let combined = Buffer.concat([buf1, buf2]);
combined.toString(); // "Hello World"
```

### Comparison

```javascript
let buf1 = Buffer.from('ABC');
let buf2 = Buffer.from('ABD');

buf1.compare(buf2); // -1 (buf1 < buf2)
buf1.equals(buf2); // false
```

### Filling

```javascript
let buf = Buffer.alloc(10);
buf.fill('a');
buf.toString(); // "aaaaaaaaaa"
```

---

## Reading Multi-Byte Values

Buffers have methods to read integers of various sizes and byte orders:

### Reading Methods

```javascript
let dead = Buffer.alloc(1024, 'DEADBEEF', 'hex');

// Read 32-bit unsigned integer, big-endian
dead.readUInt32BE(0); // 0xDEADBEEF

// Read 32-bit unsigned integer, little-endian
dead.readUInt32LE(1020); // 0xEFBEADDE

// Read at offset 1
dead.readUInt32BE(1); // 0xADBEEFDE

// Read 64-bit big integer
dead.readBigUInt64BE(6); // 0xBEEFDEADBEEFDEADn
```

### Available Read Methods

| Method                       | Description                  |
| ---------------------------- | ---------------------------- |
| `readUInt8(offset)`          | Read unsigned 8-bit integer  |
| `readInt8(offset)`           | Read signed 8-bit integer    |
| `readUInt16BE/LE(offset)`    | Read unsigned 16-bit integer |
| `readInt16BE/LE(offset)`     | Read signed 16-bit integer   |
| `readUInt32BE/LE(offset)`    | Read unsigned 32-bit integer |
| `readInt32BE/LE(offset)`     | Read signed 32-bit integer   |
| `readBigUInt64BE/LE(offset)` | Read unsigned 64-bit BigInt  |
| `readBigInt64BE/LE(offset)`  | Read signed 64-bit BigInt    |
| `readFloatBE/LE(offset)`     | Read 32-bit float            |
| `readDoubleBE/LE(offset)`    | Read 64-bit double           |

**BE** = Big Endian (most significant byte first)
**LE** = Little Endian (least significant byte first)

---

## Writing Multi-Byte Values

```javascript
let buf = Buffer.alloc(8);

// Write 32-bit unsigned integer
buf.writeUInt32BE(0xdeadbeef, 0);

// Write 16-bit unsigned integer
buf.writeUInt16LE(0x1234, 4);

console.log(buf.toString('hex'));
```

### Available Write Methods

| Method                               | Description                   |
| ------------------------------------ | ----------------------------- |
| `writeUInt8(value, offset)`          | Write unsigned 8-bit integer  |
| `writeInt8(value, offset)`           | Write signed 8-bit integer    |
| `writeUInt16BE/LE(value, offset)`    | Write unsigned 16-bit integer |
| `writeInt16BE/LE(value, offset)`     | Write signed 16-bit integer   |
| `writeUInt32BE/LE(value, offset)`    | Write unsigned 32-bit integer |
| `writeInt32BE/LE(value, offset)`     | Write signed 32-bit integer   |
| `writeBigUInt64BE/LE(value, offset)` | Write unsigned 64-bit BigInt  |
| `writeBigInt64BE/LE(value, offset)`  | Write signed 64-bit BigInt    |
| `writeFloatBE/LE(value, offset)`     | Write 32-bit float            |
| `writeDoubleBE/LE(value, offset)`    | Write 64-bit double           |

---

## Common Use Cases

### 1. Reading Binary Files

```javascript
const fs = require('fs');

// Read file as buffer
let data = fs.readFileSync('image.png');
// data is a Buffer

// Read file as string with encoding
let text = fs.readFileSync('file.txt', 'utf8');
// text is a string
```

### 2. Network Data

```javascript
const net = require('net');

let server = net.createServer((socket) => {
  socket.on('data', (buffer) => {
    // buffer is a Buffer containing received data
    let str = buffer.toString('utf8');
    console.log('Received:', str);
  });
});
```

### 3. Cryptography

```javascript
const crypto = require('crypto');

let hash = crypto.createHash('sha256');
hash.update('Hello World');
let digest = hash.digest(); // Returns a Buffer
console.log(digest.toString('hex'));
```

### 4. Binary Protocol Parsing

```javascript
// Parse a simple binary message: [type: 1 byte][length: 2 bytes][data: n bytes]
function parseMessage(buffer) {
  let type = buffer.readUInt8(0);
  let length = buffer.readUInt16BE(1);
  let data = buffer.subarray(3, 3 + length);

  return { type, length, data: data.toString('utf8') };
}
```

---

## Buffer vs String: When to Use Each

### Use Buffers When

- Working with binary data (images, audio, video)
- Implementing network protocols
- Reading/writing binary file formats
- Need to manipulate individual bytes
- Working with cryptographic operations

### Use Strings When

- Working with text data
- Don't need byte-level access
- Using Node APIs that accept string encoding

### Mixed Approach

Many Node APIs accept **both** strings and buffers:

```javascript
const fs = require('fs');

// Write string with encoding
fs.writeFileSync('file.txt', 'Hello World', 'utf8');

// Write buffer directly
let buf = Buffer.from('Hello World', 'utf8');
fs.writeFileSync('file.txt', buf);
```

---

## Complete Example

```javascript
// Creating buffers
let b1 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(b1.toString()); // "Hello"

let b2 = Buffer.from('World', 'utf8');
console.log(b2); // <Buffer 57 6f 72 6c 64>

// Concatenating
let combined = Buffer.concat([b1, Buffer.from(' '), b2]);
console.log(combined.toString()); // "Hello World"

// Manipulating bytes
let data = Buffer.from('ABC');
data[1] = 0x62; // Change 'B' to 'b'
console.log(data.toString()); // "AbC"

// Binary data
let binary = Buffer.alloc(8);
binary.writeUInt32BE(12345, 0);
binary.writeFloatBE(3.14, 4);

console.log(binary.readUInt32BE(0)); // 12345
console.log(binary.readFloatBE(4)); // 3.140000104904175

// Encoding conversions
let text = 'Hello 世界';
let utf8 = Buffer.from(text, 'utf8');
let hex = utf8.toString('hex');
let base64 = utf8.toString('base64');

console.log('UTF-8 bytes:', utf8.length); // 12
console.log('Hex:', hex); // 48656c6c6f20e4b896e7958c
console.log('Base64:', base64); // SGVsbG8g5LiW55WM
```

---

## Key Concepts Summary

✅ **Buffer is a subclass of Uint8Array** for handling binary data
✅ **Mutable**: Bytes can be modified in place
✅ **Encodings**: Support utf8, utf16le, latin1, ascii, hex, base64
✅ **String conversion**: Use `.toString(encoding)`
✅ **Creation**: `Buffer.from()` for existing data, `Buffer.alloc()` for new buffers
✅ **Multi-byte values**: Read/write integers and floats with BE/LE methods
✅ **Array-like access**: Use `buffer[index]` to read/write individual bytes
✅ **Common in I/O**: Files, network, streams often use Buffers
✅ **Can specify encoding** in many Node APIs to avoid manual conversion
✅ **Fixed size**: Cannot grow or shrink after allocation
