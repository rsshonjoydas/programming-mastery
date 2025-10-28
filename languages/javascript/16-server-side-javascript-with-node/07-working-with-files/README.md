# Working with Files

## Overview

Node's **"fs" (filesystem) module** provides comprehensive APIs for file and directory operations. It's complemented by the **"path" module** for handling file paths.

### Key Characteristics

- **Three API styles**: Callback-based, synchronous, and Promise-based
- **Multiple variants**: Path-based, file descriptor-based, and symbolic link variants
- **Low-level access**: Unix system call bindings for fine-grained control

---

## 1. Paths and File System Basics

### Important Path References

```javascript
process.cwd(); // Current working directory
__filename; // Absolute path of current file
__dirname; // Directory containing current file
os.homedir(); // User's home directory
```

### Path Module Operations

```javascript
const path = require('path');

// Path separator ("/" on Unix, "\" on Windows)
path.sep;

// Parsing paths
let p = 'src/pkg/test.js';
path.basename(p); // "test.js"
path.extname(p); // ".js"
path.dirname(p); // "src/pkg"
path.basename(path.dirname(p)); // "pkg"

// Normalizing paths (cleans up .., ./, and //)
path.normalize('a/b/c/../d/'); // "a/b/d/"
path.normalize('a/./b'); // "a/b"
path.normalize('//a//b//'); // "/a/b/"

// Joining path segments
path.join('src', 'pkg', 't.js'); // "src/pkg/t.js"

// Resolving to absolute paths
path.resolve(); // process.cwd()
path.resolve('t.js'); // path.join(process.cwd(), "t.js")
path.resolve('/tmp', 't.js'); // "/tmp/t.js"
path.resolve('/a', '/b', 't.js'); // "/b/t.js" (last absolute wins)
```

### Cross-Platform Paths

```javascript
// Use Unix paths on any OS
path.posix.join('a', 'b', 'c');

// Use Windows paths on any OS
path.win32.join('a', 'b', 'c');
```

### Filesystem-Aware Path Resolution

```javascript
// Resolves symbolic links and relative paths
fs.realpath('/path/to/symlink', (err, resolvedPath) => {
  console.log(resolvedPath);
});

fs.realpathSync('/path/to/file');
```

---

## 2. File Descriptors and FileHandles

### File Descriptors (Integer references to open files)

```javascript
const fs = require('fs');

// Open file and get descriptor
let fd = fs.openSync('file.txt', 'r'); // "r" = read mode

// Use the descriptor
// ... perform operations ...

// IMPORTANT: Always close when done
fs.closeSync(fd);
```

**Key points**:

- Limited number of files can be open simultaneously
- Must close descriptors to free resources
- Used for low-level read/write operations

### FileHandles (Promise-based equivalent)

```javascript
async function useFile() {
  let filehandle = await fs.promises.open('file.txt', 'r');

  try {
    // Use filehandle
  } finally {
    await filehandle.close(); // Always close
  }
}
```

---

## 3. Reading Files

### 3.1 Read Entire File at Once

**Synchronous**:

```javascript
const fs = require('fs');

let buffer = fs.readFileSync('test.data'); // Returns Buffer
let text = fs.readFileSync('data.csv', 'utf8'); // Returns string
```

**Callback-based**:

```javascript
fs.readFile('test.data', (err, buffer) => {
  if (err) {
    console.error(err);
  } else {
    console.log(buffer);
  }
});
```

**Promise-based**:

```javascript
// With .then()
fs.promises
  .readFile('data.csv', 'utf8')
  .then((text) => console.log(text))
  .catch((err) => console.error(err));

// With async/await
async function processText(filename, encoding = 'utf8') {
  let text = await fs.promises.readFile(filename, encoding);
  // Process text here
}
```

### 3.2 Read File as Stream

```javascript
function printFile(filename, encoding = 'utf8') {
  fs.createReadStream(filename, encoding).pipe(process.stdout);
}
```

### 3.3 Low-Level Reading with File Descriptors

```javascript
// Callback-based
fs.open('data', (err, fd) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    // Read 400 bytes starting at position 20
    fs.read(fd, Buffer.alloc(400), 0, 400, 20, (err, bytesRead, buffer) => {
      console.log(`Read ${bytesRead} bytes`);
      console.log(buffer);
    });
  } finally {
    fs.close(fd);
  }
});

// Synchronous (easier for multiple reads)
function readData(filename) {
  let fd = fs.openSync(filename);

  try {
    // Read 12-byte header
    let header = Buffer.alloc(12);
    fs.readSync(fd, header, 0, 12, 0);

    // Verify magic number
    let magic = header.readInt32LE(0);
    if (magic !== 0xdadafeed) {
      throw new Error('Wrong file type');
    }

    // Read data based on header info
    let offset = header.readInt32LE(4);
    let length = header.readInt32LE(8);

    let data = Buffer.alloc(length);
    fs.readSync(fd, data, 0, length, offset);

    return data;
  } finally {
    fs.closeSync(fd);
  }
}
```

---

## 4. Writing Files

### 4.1 Write Entire File at Once

```javascript
// Synchronous
fs.writeFileSync('settings.json', JSON.stringify(settings));

// With specific encoding
fs.writeFileSync('file.txt', 'Hello', 'utf8');

// Callback-based
fs.writeFile('file.txt', 'Hello', (err) => {
  if (err) console.error(err);
});

// Promise-based
await fs.promises.writeFile('file.txt', 'Hello');
```

### 4.2 Append to File

```javascript
// Append instead of overwrite
fs.appendFileSync('log.txt', 'New log entry\n');
fs.appendFile('log.txt', 'Entry', (err) => {});
await fs.promises.appendFile('log.txt', 'Entry');
```

### 4.3 Write File as Stream

```javascript
const fs = require('fs');

let output = fs.createWriteStream('numbers.txt');

for (let i = 0; i < 100; i++) {
  output.write(`${i}\n`);
}

output.end();
```

### 4.4 Low-Level Writing

```javascript
// Open file for writing
let fd = fs.openSync('output.txt', 'w');

try {
  // Write string at specific position
  fs.writeSync(fd, 'Hello', 0, 'utf8');

  // Write buffer at specific position
  let buffer = Buffer.from('World');
  fs.writeSync(fd, buffer, 0, buffer.length, 5);
} finally {
  fs.closeSync(fd);
}
```

### File Mode Strings

| Mode    | Description                         |
| ------- | ----------------------------------- |
| `"r"`   | Read only (default)                 |
| `"w"`   | Write (creates or overwrites)       |
| `"w+"`  | Read and write                      |
| `"wx"`  | Create new file (fails if exists)   |
| `"wx+"` | Create and read (fails if exists)   |
| `"a"`   | Append (preserves existing content) |
| `"a+"`  | Append and read                     |

```javascript
// Using flags
fs.writeFileSync('log.txt', 'hello', { flag: 'a' });

fs.createWriteStream('data.txt', { flags: 'wx' }); // Fail if exists
```

### Truncating Files

```javascript
// Truncate to specific length
fs.truncateSync('file.txt', 100); // Set to 100 bytes
fs.truncateSync('file.txt', 0); // Empty the file
fs.truncateSync('file.txt', 1000); // Extend with zero bytes

// With file descriptor
fs.ftruncateSync(fd, 100);
```

### Forcing Data to Disk

```javascript
// Ensure data is physically written (not just buffered)
let fd = fs.openSync('critical.data', 'w');
fs.writeSync(fd, data);
fs.fsyncSync(fd); // Force write to disk
fs.closeSync(fd);
```

---

## 5. File Operations

### Copying Files

```javascript
// Basic copy
fs.copyFileSync('ch15.txt', 'ch15.bak');

// Copy with flags (don't overwrite if exists)
fs.copyFile('ch15.txt', 'ch16.txt', fs.constants.COPYFILE_EXCL, (err) => {
  if (err) console.error(err);
});

// Promise-based with multiple flags
fs.promises
  .copyFile(
    'Important data',
    `Important data ${new Date().toISOString()}`,
    fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE
  )
  .then(() => console.log('Backup complete'))
  .catch((err) => console.error('Backup failed', err));
```

**Copy flags**:

- `COPYFILE_EXCL`: Fail if destination exists
- `COPYFILE_FICLONE`: Create copy-on-write clone (efficient)

### Moving/Renaming Files

```javascript
// Rename/move file
fs.renameSync('ch15.bak', 'backups/ch15.bak');

// Callback version
fs.rename('old.txt', 'new.txt', (err) => {
  if (err) console.error(err);
});

// Promise version
await fs.promises.rename('old.txt', 'new.txt');
```

**Note**: Cannot rename across filesystems; will overwrite existing files

### Creating Links

```javascript
// Hard link
fs.linkSync('original.txt', 'hardlink.txt');

// Symbolic link
fs.symlinkSync('original.txt', 'symlink.txt');
```

### Deleting Files

```javascript
// Delete file (called "unlink" from Unix heritage)
fs.unlinkSync('file.txt');

fs.unlink('file.txt', (err) => {
  if (err) console.error(err);
});

await fs.promises.unlink('file.txt');
```

---

## 6. File Metadata

### Getting File Stats

```javascript
const fs = require('fs');

let stats = fs.statSync('book/ch15.md');

stats.isFile(); // true for regular files
stats.isDirectory(); // true for directories
stats.size; // File size in bytes
stats.atime; // Last access time (Date)
stats.mtime; // Last modification time (Date)
stats.uid; // Owner user ID
stats.gid; // Owner group ID
stats.mode.toString(8); // Permissions as octal string
```

**Variants**:

```javascript
// Follow symbolic links (default)
fs.statSync('file.txt');

// Don't follow symbolic links
fs.lstatSync('symlink.txt'); // Stats for the link itself

// Using file descriptor
fs.fstatSync(fd);
```

### Changing File Metadata

**Permissions (chmod)**:

```javascript
// Set file to read-only for owner
fs.chmodSync('ch15.md', 0o400);

// Common permission patterns
fs.chmodSync('script.sh', 0o755); // rwxr-xr-x (executable)
fs.chmodSync('data.txt', 0o644); // rw-r--r-- (readable by all)

// Using file descriptor
fs.fchmodSync(fd, 0o600);
```

**Ownership (chown)**:

```javascript
fs.chownSync('file.txt', uid, gid);
fs.lchownSync('symlink.txt', uid, gid); // For symlink itself
fs.fchownSync(fd, uid, gid); // Using descriptor
```

**Timestamps (utimes)**:

```javascript
let now = new Date();
let yesterday = new Date(Date.now() - 86400000);

fs.utimesSync('file.txt', yesterday, now); // access, modification
fs.futimesSync(fd, yesterday, now);
```

---

## 7. Working with Directories

### Creating Directories

```javascript
// Create single directory
fs.mkdirSync('newdir');

// Create with specific permissions
fs.mkdirSync('newdir', 0o755);

// Create nested directories (recursive)
fs.mkdirSync('dist/lib/utils', { recursive: true });

// Promise-based
await fs.promises.mkdir('dist/lib', { recursive: true });
```

### Creating Temporary Directories

```javascript
const os = require('os');
const path = require('path');

// Creates directory with random name
let tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'myapp-'));
// Returns something like: "/tmp/myapp-a8f3e2"
```

### Deleting Directories

```javascript
// Directory must be empty
fs.rmdirSync('emptydir');

// Example with cleanup
let tempDirPath;
try {
  tempDirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'd'));
  // Use the directory
} finally {
  fs.rmdirSync(tempDirPath); // Clean up
}
```

### Listing Directory Contents

**Read all at once**:

```javascript
// Get array of filenames
let files = fs.readdirSync('/tmp');

// Get array of Dirent objects (includes type info)
let entries = fs.readdirSync('/tmp', { withFileTypes: true });

// Promise-based with filtering
fs.promises
  .readdir('/tmp', { withFileTypes: true })
  .then((entries) => {
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .forEach((name) => console.log(path.join('/tmp', name)));
  })
  .catch(console.error);
```

**Streaming approach (for large directories)**:

```javascript
const fs = require('fs');
const path = require('path');

async function listDirectory(dirpath) {
  let dir = await fs.promises.opendir(dirpath);

  for await (let entry of dir) {
    let name = entry.name;

    if (entry.isDirectory()) {
      name += '/';
    }

    let stats = await fs.promises.stat(path.join(dirpath, name));
    console.log(String(stats.size).padStart(10), name);
  }
}

listDirectory('/tmp');
```

**Manual iteration**:

```javascript
let dir = fs.opendirSync('/tmp');
let entry;

while ((entry = dir.readSync()) !== null) {
  console.log(entry.name);
}

dir.closeSync();
```

---

## API Variants Summary

| Operation   | Callback         | Synchronous          | Promise                   |
| ----------- | ---------------- | -------------------- | ------------------------- |
| Read file   | `fs.readFile()`  | `fs.readFileSync()`  | `fs.promises.readFile()`  |
| Write file  | `fs.writeFile()` | `fs.writeFileSync()` | `fs.promises.writeFile()` |
| Copy file   | `fs.copyFile()`  | `fs.copyFileSync()`  | `fs.promises.copyFile()`  |
| Delete file | `fs.unlink()`    | `fs.unlinkSync()`    | `fs.promises.unlink()`    |
| Rename      | `fs.rename()`    | `fs.renameSync()`    | `fs.promises.rename()`    |
| Get stats   | `fs.stat()`      | `fs.statSync()`      | `fs.promises.stat()`      |
| Open file   | `fs.open()`      | `fs.openSync()`      | `fs.promises.open()`      |
| Make dir    | `fs.mkdir()`     | `fs.mkdirSync()`     | `fs.promises.mkdir()`     |
| Read dir    | `fs.readdir()`   | `fs.readdirSync()`   | `fs.promises.readdir()`   |

---

## Best Practices

✅ **Use Promise-based API** with async/await for modern code
✅ **Always close file descriptors** to prevent resource leaks
✅ **Use path.join()** instead of string concatenation for paths
✅ **Handle errors** in all file operations
✅ **Use streams** for large files to save memory
✅ **Call fs.fsync()** for critical data that must be persisted
✅ **Use recursive: true** when creating nested directories
✅ **Check file existence** with fs.stat() instead of fs.exists() (deprecated)
✅ **Use temporary directories** for scratch work
✅ **Set appropriate file permissions** for security

---

## Key Concepts

📌 **Three API styles**: Callback, synchronous (Sync), Promise-based
📌 **Path module** handles cross-platform path operations
📌 **File descriptors** are low-level integer references to open files
📌 **Streams** are memory-efficient for large files
📌 **Metadata** includes permissions, ownership, timestamps, size
📌 **File modes** control read/write/create behavior
📌 **fs.fsync()** forces data to disk (not just OS buffers)
📌 **Directories must be empty** before deletion
📌 **Symbolic links** have special handling with "l" variants
📌 **Always close resources** (file descriptors, directory handles)
