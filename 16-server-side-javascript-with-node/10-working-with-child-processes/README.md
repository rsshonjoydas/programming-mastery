# Working with Child Processes

## What Are Child Processes?

Node.js allows you to **run external programs** as **child processes**, enabling you to:

- Execute shell commands
- Run other programs/scripts
- Perform parallel tasks
- Offload CPU-intensive work

The **`child_process`** module provides functions for creating and managing child processes.

---

## 1. execSync() and execFileSync()

### execSync() - Synchronous Shell Command

**Simplest way** to run a command. It **blocks** until the command completes.

```javascript
const child_process = require('child_process');

// Execute shell command
let listing = child_process.execSync('ls -l web/*.html', {
  encoding: 'utf8',
});

console.log(listing);
```

**How it works**:

1. Creates a child process
2. Runs a **shell** in that process
3. Uses the shell to execute your command
4. **Blocks** until command exits
5. Returns output from `stdout` (as Buffer or string)
6. Throws exception if command fails

**Features**:

- ✅ Supports shell features (pipes, wildcards, redirection)
- ✅ Can use semicolon-separated commands
- ⚠️ **Security risk**: Never pass untrusted user input (shell injection attacks)

### execFileSync() - Direct Program Execution

Runs a program **directly without a shell** (more secure, less overhead).

```javascript
// Must pass executable and arguments separately
let listing = child_process.execFileSync('ls', ['-l', 'web/'], {
  encoding: 'utf8',
});
```

**Differences from execSync()**:

- No shell involved (safer, faster)
- Cannot use shell features (pipes, wildcards, etc.)
- First argument: executable path
- Second argument: array of arguments

---

## Child Process Options

Optional configuration object for child process functions:

```javascript
{
  cwd: "/path/to/directory",        // Working directory
  env: { NODE_ENV: "production" },  // Environment variables (default: process.env)
  input: "data to stdin",           // Input data (sync functions only)
  maxBuffer: 1024 * 1024,           // Max output size in bytes
  shell: true,                      // Use shell (or path to shell)
  timeout: 5000,                    // Max execution time in ms
  uid: 1000,                        // User ID to run as
  encoding: "utf8"                  // Output encoding (default: Buffer)
}
```

**Common options**:

- **`cwd`**: Working directory (default: `process.cwd()`)
- **`env`**: Environment variables (default: `process.env`)
- **`encoding`**: Return string instead of Buffer
- **`timeout`**: Kill process after this time
- **`maxBuffer`**: Kill if output exceeds this size
- **`shell`**: Which shell to use (or true for default)

---

## 2. exec() and execFile() - Asynchronous

Non-blocking versions that return immediately.

### exec() - Async Shell Command

```javascript
const child_process = require('child_process');

child_process.exec('ls -l', { encoding: 'utf8' }, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Output:', stdout);
  if (stderr) console.error('Errors:', stderr);
});
```

**Returns**: `ChildProcess` object (represents running process)

**Callback arguments**:

1. `error` - Error object (or null if successful)
2. `stdout` - Output from standard output
3. `stderr` - Output from standard error

### Promisified Version

Use with async/await for cleaner code:

```javascript
const child_process = require('child_process');
const util = require('util');

const execP = util.promisify(child_process.exec);

async function runCommand() {
  try {
    let { stdout, stderr } = await execP('ls -l', { encoding: 'utf8' });
    console.log(stdout);
  } catch (error) {
    console.error(error);
  }
}
```

### Running Multiple Commands in Parallel

```javascript
const child_process = require('child_process');
const util = require('util');
const execP = util.promisify(child_process.exec);

function parallelExec(commands) {
  // Create array of Promises
  let promises = commands.map((command) =>
    execP(command, { encoding: 'utf8' })
  );

  // Wait for all to complete
  return Promise.all(promises).then((outputs) =>
    outputs.map((out) => out.stdout)
  );
}

// Usage
parallelExec(['ls -l', 'pwd', 'whoami']).then((results) => {
  results.forEach((result) => console.log(result));
});
```

---

## 3. spawn() - Streaming Interface

For **long-running processes** or **large output**, use streaming instead of buffering.

### Basic Usage

```javascript
const child_process = require('child_process');

// Spawn without shell
let child = child_process.spawn('ls', ['-l', '/usr']);

// Listen to stdout stream
child.stdout.on('data', (data) => {
  console.log('Output:', data.toString());
});

// Listen to stderr stream
child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Listen for exit event
child.on('exit', (code, signal) => {
  console.log(`Child exited with code ${code}`);
});
```

### ChildProcess Object

**Properties**:

- `child.pid` - Process ID
- `child.stdout` - Readable stream (child's output)
- `child.stderr` - Readable stream (child's errors)
- `child.stdin` - Writable stream (write to child's input)

**Methods**:

- `child.kill()` - Terminate the process
- `child.disconnect()` - Close IPC channel

**Events**:

- `"exit"` - Process has exited
- `"close"` - All stdio streams have closed
- `"error"` - Error occurred
- `"message"` - Received message (fork() only)

### Interactive Child Process

Write to stdin and read from stdout dynamically:

```javascript
const child_process = require('child_process');

let child = child_process.spawn('grep', ['error']);

// Write data to child's stdin
child.stdin.write('This is a test\n');
child.stdin.write('This contains an error\n');
child.stdin.write('Another line\n');
child.stdin.end();

// Read filtered output
child.stdout.on('data', (data) => {
  console.log('Match:', data.toString());
});
```

### Piping Streams

```javascript
const fs = require('fs');
const child_process = require('child_process');

let input = fs.createReadStream('input.txt');
let output = fs.createWriteStream('output.txt');
let child = child_process.spawn('sort');

// Pipe file through sort command
input.pipe(child.stdin);
child.stdout.pipe(output);

child.on('exit', () => {
  console.log('Sorting complete');
});
```

---

## 4. fork() - Run JavaScript Code

Specialized function for running **Node.js modules** as child processes.

### **Basic Usage**

**Parent process** (main.js):

```javascript
const child_process = require('child_process');

// Start child process running child.js
let child = child_process.fork(`${__dirname}/child.js`);

// Send message to child
child.send({ x: 4, y: 3 });

// Receive message from child
child.on('message', (message) => {
  console.log('Hypotenuse:', message.hypotenuse); // 5
  child.disconnect(); // Close IPC channel
});
```

**Child process** (child.js):

```javascript
// Listen for messages from parent
process.on('message', (message) => {
  // Perform calculation
  let result = Math.hypot(message.x, message.y);

  // Send result back to parent
  process.send({ hypotenuse: result });
});
```

### Inter-Process Communication (IPC)

**Parent to child**:

- `child.send(message)` - Send message to child
- `child.on("message", callback)` - Receive from child
- `child.disconnect()` - Close communication channel

**Child to parent**:

- `process.send(message)` - Send message to parent
- `process.on("message", callback)` - Receive from parent

### Message Serialization

Messages are serialized with `JSON.stringify()`:

```javascript
// Parent
child.send({
  name: 'Alice',
  age: 30,
  data: [1, 2, 3],
});

// Child receives deserialized object
process.on('message', (msg) => {
  console.log(msg.name); // "Alice"
});
```

**Supported types**: Objects, arrays, strings, numbers, booleans, null
**Not supported**: Functions, undefined, circular references

### Special Case: Sending Socket/Server Objects

You can transfer network connections to child processes:

```javascript
const net = require('net');
const child_process = require('child_process');

let server = net.createServer();
let child = child_process.fork('worker.js');

server.on('connection', (socket) => {
  // Send socket to child process
  child.send('connection', socket);
});

server.listen(8000);
```

---

## Use Cases

### 1. Running Shell Commands

```javascript
// Quick script automation
const { execSync } = require('child_process');
let output = execSync('git log --oneline -5', { encoding: 'utf8' });
console.log(output);
```

### 2. Parallel Task Execution

```javascript
// Run multiple independent tasks
const { exec } = require('child_process');
const util = require('util');
const execP = util.promisify(exec);

Promise.all([
  execP('npm test'),
  execP('npm run lint'),
  execP('npm run build'),
]).then(() => console.log('All tasks complete'));
```

### 3. Processing Large Files

```javascript
// Stream large file through external program
const { spawn } = require('child_process');
const fs = require('fs');

let input = fs.createReadStream('large-file.txt');
let gzip = spawn('gzip');
let output = fs.createWriteStream('large-file.txt.gz');

input.pipe(gzip.stdin);
gzip.stdout.pipe(output);
```

### 4. CPU-Intensive Computation

```javascript
// Offload heavy computation to child process
const { fork } = require('child_process');

let worker = fork('compute-worker.js');

worker.send({ task: 'calculatePrimes', limit: 1000000 });

worker.on('message', (result) => {
  console.log('Primes found:', result.count);
  worker.disconnect();
});
```

### 5. Multi-Core Server

```javascript
// Utilize multiple CPU cores
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  // Worker process handles requests
  require('./server.js');
}
```

---

## Comparison of Functions

| Function           | Blocks? | Shell? | Streaming? | Use Case                   |
| ------------------ | ------- | ------ | ---------- | -------------------------- |
| **execSync()**     | ✅ Yes  | ✅ Yes | ❌ No      | Quick shell commands       |
| **execFileSync()** | ✅ Yes  | ❌ No  | ❌ No      | Direct program execution   |
| **exec()**         | ❌ No   | ✅ Yes | ❌ No      | Async shell commands       |
| **execFile()**     | ❌ No   | ❌ No  | ❌ No      | Async program execution    |
| **spawn()**        | ❌ No   | ❌ No  | ✅ Yes     | Long-running, large output |
| **fork()**         | ❌ No   | ❌ No  | ✅ Yes     | Run Node.js modules        |

---

## Best Practices

✅ **Use execSync() for simple scripts** where blocking is acceptable
✅ **Use exec() for parallel tasks** that don't produce much output
✅ **Use spawn() for streaming** large amounts of data
✅ **Use fork() for Node.js code** that needs to communicate with parent
✅ **Never pass untrusted input** to execSync() or exec() (shell injection risk)
✅ **Use execFileSync() instead of execSync()** when shell features aren't needed
✅ **Handle errors** with try/catch (sync) or error callbacks/events (async)
✅ **Set timeout and maxBuffer** to prevent runaway processes
✅ **Clean up child processes** (call disconnect() or kill() when done)
✅ **Consider threads over processes** for CPU-intensive work (lower overhead)

---

## Security Warnings

⚠️ **Shell Injection Risk**:

```javascript
// DANGEROUS - user input in shell command
let userInput = req.query.filename;
execSync(`cat ${userInput}`); // Attacker could use: "; rm -rf /"

// SAFE - use execFile with argument array
execFileSync('cat', [userInput]);
```

⚠️ **Resource Limits**:

```javascript
// Set limits to prevent abuse
exec(
  'long-running-command',
  {
    timeout: 30000, // Kill after 30 seconds
    maxBuffer: 1024000, // Limit output size
  },
  callback
);
```

---

## Key Concepts Summary

📌 **Child processes** run external programs from Node.js
📌 **Sync functions** block until completion (simple scripts)
📌 **Async functions** return immediately (concurrent operations)
📌 **exec()** runs shell commands (supports pipes, wildcards)
📌 **execFile()** runs programs directly (safer, no shell)
📌 **spawn()** provides streaming interface (large data, long-running)
📌 **fork()** runs Node.js modules with IPC (message passing)
📌 **ChildProcess object** has streams (stdin/stdout/stderr) and events
📌 **Never use shell commands with untrusted input** (security risk)
📌 **Set timeouts and limits** to prevent resource exhaustion
📌 **Clean up processes** to avoid orphaned children
📌 **Threads may be better** than processes for CPU-bound work
