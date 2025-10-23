# JavaScript Typed Arrays and Binary Data

## What Are Typed Arrays?

**Typed arrays** are array-like objects that provide a mechanism for accessing raw binary data in memory buffers. Unlike regular JavaScript arrays, typed arrays:

- ✅ Store **only numbers** of a specific type and size
- ✅ Have a **fixed length** that cannot change
- ✅ Are **always initialized to 0** when created
- ✅ Are much closer to low-level C/Java arrays
- ✅ Offer better **performance** for numerical computations
- ❌ Are **not true arrays** (`Array.isArray()` returns `false`)

**Key differences from regular arrays**:

- Regular arrays can hold any type and grow/shrink dynamically
- Typed arrays are optimized for binary data and numeric operations
- Typed arrays implement most array methods but not `push()`, `pop()`, etc.

---

## Typed Array Types

JavaScript provides **11 types** of typed arrays:

| Constructor           | Type                            | Bytes | Range                     |
| --------------------- | ------------------------------- | ----- | ------------------------- |
| **Int8Array**         | Signed 8-bit integer            | 1     | -128 to 127               |
| **Uint8Array**        | Unsigned 8-bit integer          | 1     | 0 to 255                  |
| **Uint8ClampedArray** | Unsigned 8-bit (clamped)        | 1     | 0 to 255 (no rollover)    |
| **Int16Array**        | Signed 16-bit integer           | 2     | -32,768 to 32,767         |
| **Uint16Array**       | Unsigned 16-bit integer         | 2     | 0 to 65,535               |
| **Int32Array**        | Signed 32-bit integer           | 4     | -2³¹ to 2³¹-1             |
| **Uint32Array**       | Unsigned 32-bit integer         | 4     | 0 to 2³²-1                |
| **BigInt64Array**     | Signed 64-bit BigInt (ES2020)   | 8     | -2⁶³ to 2⁶³-1             |
| **BigUint64Array**    | Unsigned 64-bit BigInt (ES2020) | 8     | 0 to 2⁶⁴-1                |
| **Float32Array**      | 32-bit floating-point           | 4     | ±1.2×10⁻³⁸ to ±3.4×10³⁸   |
| **Float64Array**      | 64-bit floating-point           | 8     | Same as JavaScript Number |

### Special Cases

**Uint8ClampedArray vs Uint8Array**:

- **Uint8Array**: Values wrap around (256 becomes 0, -1 becomes 255)
- **Uint8ClampedArray**: Values clamp (256 becomes 255, -1 becomes 0)
- Clamping is required for HTML Canvas pixel manipulation

**BYTES_PER_ELEMENT**:
Each typed array constructor has this property:

```javascript
Int8Array.BYTES_PER_ELEMENT; // 1
Int16Array.BYTES_PER_ELEMENT; // 2
Int32Array.BYTES_PER_ELEMENT; // 4
Float64Array.BYTES_PER_ELEMENT; // 8
```

---

## Creating Typed Arrays

### 1. Constructor with Length

```javascript
let bytes = new Uint8Array(1024); // 1024 bytes
let matrix = new Float64Array(9); // 3×3 matrix
let point = new Int16Array(3); // 3D point
let rgba = new Uint8ClampedArray(4); // RGBA pixel
let sudoku = new Int8Array(81); // 9×9 sudoku board
```

All elements are initialized to `0`, `0n` (for BigInt), or `0.0`.

### 2. From Values with of()

```javascript
let white = Uint8ClampedArray.of(255, 255, 255, 0); // RGBA opaque white
let coords = Float32Array.of(1.5, 2.5, 3.5);
```

### 3. From Iterable with from()

```javascript
let ints = Uint32Array.from(white); // Copy with type conversion
let arr = Int16Array.from([1, 2, 3]); // From regular array
```

**Note**: Values may be truncated to fit the type:

```javascript
Uint8Array.of(1.23, 2.99, 45000); // [1, 2, 200] - truncated
```

### 4. Directly from Constructor (same as from())

```javascript
let ints = new Uint32Array(white); // Copy from another typed array
```

### 5. From ArrayBuffer

```javascript
let buffer = new ArrayBuffer(1024 * 1024); // 1MB of memory
buffer.byteLength; // 1048576

// Create views of the buffer
let asBytes = new Uint8Array(buffer); // All as bytes
let asInts = new Int32Array(buffer); // All as 32-bit ints
let lastK = new Uint8Array(buffer, 1023 * 1024); // Last kilobyte
let ints2 = new Int32Array(buffer, 1024, 256); // 2nd KB as 256 ints
```

**Arguments**: `TypedArray(buffer, byteOffset, length)`

- **buffer**: ArrayBuffer to use
- **byteOffset**: Starting position (must be aligned to element size)
- **length**: Number of elements (not bytes)

---

## Using Typed Arrays

### Array-like Access

```javascript
let ints = new Int16Array(10);
ints[0] = 42;
ints[1] = 100;
console.log(ints[0]); // 42
```

### Array Methods

Typed arrays support most array methods:

```javascript
let ints = new Int16Array(10);
ints
  .fill(3)
  .map((x) => x * x)
  .join(''); // "9999999999"
```

**Supported methods**:

- `map()`, `filter()`, `reduce()`, `forEach()`
- `slice()`, `subarray()`, `set()`
- `sort()`, `reverse()`, `fill()`
- `find()`, `findIndex()`, `indexOf()`
- `some()`, `every()`, `includes()`

**NOT supported** (change length):

- `push()`, `pop()`, `shift()`, `unshift()`, `splice()`

**Note**: Methods like `map()` and `slice()` return typed arrays of the same type.

### Practical Example: Sieve of Eratosthenes

```javascript
function sieve(n) {
  let a = new Uint8Array(n + 1); // 1 if composite
  let max = Math.floor(Math.sqrt(n));
  let p = 2;

  while (p <= max) {
    for (let i = 2 * p; i <= n; i += p) {
      a[i] = 1; // Mark multiples as composite
    }
    while (a[++p] /* empty */); // Find next prime
  }

  while (a[n]) n--; // Find largest prime
  return n;
}
```

Using `Uint8Array` makes this **4× faster** and uses **8× less memory** than regular arrays.

---

## Typed Array Methods and Properties

### set() Method

Copies elements from one array to another:

```javascript
let bytes = new Uint8Array(1024);
let pattern = new Uint8Array([0, 1, 2, 3]);

bytes.set(pattern); // Copy to start
bytes.set(pattern, 4); // Copy at offset 4
bytes.set([0, 1, 2, 3], 8); // From regular array

bytes.slice(0, 12); // [0,1,2,3,0,1,2,3,0,1,2,3]
```

**Signature**: `array.set(source, offset)`

- Very fast for typed array to typed array copies

### subarray() Method

Returns a **new view** of the same underlying memory:

```javascript
let ints = new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
let last3 = ints.subarray(ints.length - 3, ints.length); // [7, 8, 9]

last3[0]; // 7 (same as ints[7])

ints[9] = -1;
last3[2]; // -1 (shares memory!)
```

**subarray() vs slice()**:

- **subarray()**: Returns a view (shares memory)
- **slice()**: Returns a copy (independent memory)

### Buffer Properties

Every typed array has properties related to its underlying buffer:

```javascript
let ints = new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
let last3 = ints.subarray(7, 10);

last3.buffer; // ArrayBuffer object
last3.buffer === ints.buffer; // true (same buffer)
last3.byteOffset; // 14 (starts at byte 14)
last3.byteLength; // 6 (3 elements × 2 bytes)
last3.buffer.byteLength; // 20 (full buffer)

// Invariant (always true):
last3.length * last3.BYTES_PER_ELEMENT === last3.byteLength; // true
```

---

## ArrayBuffer

**ArrayBuffer** is an opaque reference to a chunk of raw binary data in memory.

### Creating ArrayBuffers

```javascript
let buffer = new ArrayBuffer(1024); // Allocate 1KB
buffer.byteLength; // 1024
```

### Important Notes

- Cannot read/write bytes directly
- Access data through typed array views
- Can have multiple views of the same buffer

```javascript
let bytes = new Uint8Array(1024);
let ints = new Uint32Array(bytes.buffer); // 256 integers
let floats = new Float64Array(bytes.buffer); // 128 doubles
```

### Common Mistake

Don't confuse ArrayBuffer indexing with byte access:

```javascript
let bytes = new Uint8Array(8);
bytes[0] = 1; // ✅ Sets first byte to 1

bytes.buffer[0]; // undefined (not byte access!)
bytes.buffer[1] = 255; // Sets JS property, NOT byte
bytes[1]; // 0 (byte unchanged)
```

---

## DataView and Endianness

### What is Endianness?

**Endianness** is the byte order for multi-byte numbers:

- **Little-endian**: Least significant byte first (most CPUs)
- **Big-endian**: Most significant byte first (some networks/files)

### Detecting Endianness

```javascript
let littleEndian = new Int8Array(new Int32Array([1]).buffer)[0] === 1;
// true on little-endian systems
// false on big-endian systems
```

### Why DataView?

Typed arrays use **native endianness** for efficiency. When working with external data (network, files), you need explicit control over byte order.

### Using DataView

**Creating a DataView**:

```javascript
let buffer = new ArrayBuffer(16);
let view = new DataView(buffer);

// Or from typed array:
let bytes = new Uint8Array(100);
let view2 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
```

### Reading Values

**Get methods**: `getInt8`, `getUint8`, `getInt16`, `getUint16`, `getInt32`, `getUint32`, `getBigInt64`, `getBigUint64`, `getFloat32`, `getFloat64`

```javascript
let int = view.getInt32(0); // Big-endian (default)
int = view.getInt32(4, false); // Big-endian (explicit)
int = view.getUint32(8, true); // Little-endian
let float = view.getFloat64(12, true); // Little-endian double
```

**Signature**: `view.getType(byteOffset, littleEndian)`

- **byteOffset**: Position in buffer
- **littleEndian**: `true` for little-endian, `false` or omitted for big-endian

### Writing Values

**Set methods**: `setInt8`, `setUint8`, `setInt16`, `setUint16`, `setInt32`, `setUint32`, `setBigInt64`, `setBigUint64`, `setFloat32`, `setFloat64`

```javascript
view.setInt32(0, 42); // Big-endian
view.setInt32(4, 100, false); // Big-endian (explicit)
view.setUint32(8, 255, true); // Little-endian
view.setFloat64(12, 3.14, true); // Little-endian double
```

**Signature**: `view.setType(byteOffset, value, littleEndian)`

### DataView Example

```javascript
let buffer = new ArrayBuffer(16);
let view = new DataView(buffer);

// Write values
view.setInt32(0, 0x12345678, false); // Big-endian
view.setInt32(4, 0x12345678, true); // Little-endian

// Read as bytes to see difference
let bytes = new Uint8Array(buffer);
console.log(bytes.slice(0, 4)); // [0x12, 0x34, 0x56, 0x78] (big)
console.log(bytes.slice(4, 8)); // [0x78, 0x56, 0x34, 0x12] (little)
```

---

## Practical Use Cases

### 1. Image Processing

```javascript
// RGBA pixel manipulation
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let pixels = imageData.data; // Uint8ClampedArray

// Invert colors
for (let i = 0; i < pixels.length; i += 4) {
  pixels[i] = 255 - pixels[i]; // Red
  pixels[i + 1] = 255 - pixels[i + 1]; // Green
  pixels[i + 2] = 255 - pixels[i + 2]; // Blue
  // pixels[i + 3] is alpha (unchanged)
}

ctx.putImageData(imageData, 0, 0);
```

### 2. Binary File Processing

```javascript
// Read and parse binary file
async function readBinaryFile(file) {
  let buffer = await file.arrayBuffer();
  let view = new DataView(buffer);

  // Read header (assume big-endian format)
  let magic = view.getUint32(0, false);
  let version = view.getUint16(4, false);
  let dataSize = view.getUint32(6, false);

  return { magic, version, dataSize };
}
```

### 3. Network Protocol Implementation

```javascript
// Create packet with specific byte order
function createPacket(type, data) {
  let buffer = new ArrayBuffer(8 + data.length);
  let view = new DataView(buffer);

  view.setUint32(0, 0xdeadbeef, false); // Magic number (big-endian)
  view.setUint16(4, type, false); // Packet type
  view.setUint16(6, data.length, false); // Data length

  let bytes = new Uint8Array(buffer);
  bytes.set(data, 8); // Copy data

  return bytes;
}
```

### 4. Audio Processing

```javascript
// Process audio samples
function processAudio(audioBuffer) {
  let samples = new Float32Array(audioBuffer);

  // Apply gain
  for (let i = 0; i < samples.length; i++) {
    samples[i] *= 0.5; // Reduce volume by 50%
  }

  return samples;
}
```

---

## Key Concepts Summary

✅ **Typed arrays** store numbers of specific types and sizes
✅ **11 typed array types** from Int8Array to Float64Array
✅ **Fixed length** - cannot grow or shrink
✅ **Always initialized to 0**
✅ **ArrayBuffer** holds raw binary data
✅ **Multiple views** can access the same buffer
✅ **set()** copies data efficiently
✅ **subarray()** creates views (shares memory)
✅ **slice()** creates copies (independent memory)
✅ **DataView** provides endian-aware access
✅ **Endianness** matters for external data
✅ **Much faster** than regular arrays for numeric operations
✅ Perfect for **binary data**, **image/audio processing**, **file formats**, **network protocols**
