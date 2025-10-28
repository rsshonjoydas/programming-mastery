# Process, CPU, and Operating System Details

## The Process Object

The **global `process` object** provides information and control over the currently running Node.js process. It's available globally without requiring any imports.

### Command Line and Environment

```javascript
// Command-line arguments
process.argv;
// Array: [node_path, script_path, ...user_arguments]
// Example: node script.js arg1 arg2
// process.argv = ['/usr/bin/node', '/path/to/script.js', 'arg1', 'arg2']

// Environment variables
process.env;
// Object containing all environment variables
// Example: process.env.HOME, process.env.PATH, process.env.NODE_ENV

// Node executable path
process.execPath;
// Absolute path to the Node.js executable
// Example: '/usr/local/bin/node'
```

### Working Directory

```javascript
// Get current working directory
process.cwd();
// Returns: '/current/directory/path'

// Change working directory
process.chdir('/new/directory');
// Changes the current working directory
```

### Process Information

```javascript
// Process ID
process.pid;
// The process identifier (number)

// Parent process ID
process.ppid;
// The parent process identifier

// Process title (appears in ps listings)
process.title;
// Get or set the process name
process.title = 'my-app';

// Node version
process.version;
// Example: 'v18.12.0'

// Dependency versions
process.versions;
// Object: { node: '18.12.0', v8: '10.2.154.15', ... }

// Process uptime
process.uptime();
// Returns seconds since Node process started
```

### System Information

```javascript
// CPU architecture
process.arch;
// Examples: 'x64', 'arm', 'arm64', 'ia32'

// Operating system platform
process.platform;
// Examples: 'linux', 'darwin' (macOS), 'win32', 'freebsd'
```

### Resource Usage

```javascript
// CPU usage
process.cpuUsage();
// Returns: { user: 12345, system: 6789 }
// Values in microseconds

// Memory usage
process.memoryUsage();
// Returns: {
//   rss: 12345678,        // Resident Set Size (total memory)
//   heapTotal: 4567890,   // V8 heap total
//   heapUsed: 2345678,    // V8 heap used
//   external: 123456,     // C++ objects bound to JS
//   arrayBuffers: 12345   // Memory for ArrayBuffers
// }
// All values in bytes

// Detailed resource usage
process.resourceUsage();
// Returns comprehensive resource usage statistics
```

### Process Control

```javascript
// Exit the process
process.exit();
// Immediately terminates with exit code 0 (success)

process.exit(1);
// Terminates with exit code 1 (error)

// Set exit code without exiting
process.exitCode = 1;
// Sets the exit code for when process naturally exits

// Send signal to another process
process.kill(pid, signal);
// Examples:
process.kill(12345, 'SIGTERM'); // Graceful termination
process.kill(12345, 'SIGKILL'); // Force kill
```

### User and Permissions (Unix/Linux)

```javascript
// Get current user ID
process.getuid();
// Returns numeric user ID

// Set current user
process.setuid(id);
// Set user by numeric ID or username
process.setuid(1000);
process.setuid('username');

// File creation mask
process.umask();
// Get current umask (default permissions for new files)

process.umask(0o022);
// Set umask (octal notation)
```

### Timing

```javascript
// High-resolution time
process.hrtime.bigint();
// Returns nanosecond timestamp as BigInt
// Example: 123456789012345n

// Schedule callback
process.nextTick(callback);
// Executes callback after current operation completes
// Similar to setImmediate() but executes earlier

process.nextTick(() => {
  console.log('Executes next');
});
console.log('Executes first');
// Output:
// Executes first
// Executes next
```

---

## The OS Module

The **`os` module** provides operating system-related utility methods. Must be explicitly imported.

```javascript
const os = require('os');
```

### **System Information**

```javascript
// CPU architecture
os.arch();
// Returns: 'x64', 'arm', 'arm64', etc.

// Operating system platform
os.platform();
// Returns: 'linux', 'darwin', 'win32', 'freebsd', etc.

// OS type
os.type();
// Returns: 'Linux', 'Darwin', 'Windows_NT', etc.

// OS release/version
os.release();
// Example: '5.10.0-1234-generic' (Linux kernel version)

// System hostname
os.hostname();
// Returns the computer's hostname

// System uptime
os.uptime();
// Returns seconds since system boot
```

### CPU Information

```javascript
// CPU details
os.cpus();
// Returns array of CPU core information:
// [
//   {
//     model: 'Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz',
//     speed: 2600,  // MHz
//     times: {
//       user: 12345,
//       nice: 0,
//       sys: 6789,
//       idle: 98765,
//       irq: 0
//     }
//   },
//   // ... one object per CPU core
// ]

// CPU endianness
os.endianness();
// Returns: 'BE' (big-endian) or 'LE' (little-endian)

// Load average
os.loadavg();
// Returns: [1.5, 1.8, 2.0]
// 1, 5, and 15-minute load averages (Unix only)
```

### Memory Information

```javascript
// Total memory
os.totalmem();
// Returns total system RAM in bytes

// Free memory
os.freemem();
// Returns available RAM in bytes

// Example: Convert to GB
const totalGB = os.totalmem() / 1024 ** 3;
const freeGB = os.freemem() / 1024 ** 3;
console.log(`Total: ${totalGB.toFixed(2)} GB`);
console.log(`Free: ${freeGB.toFixed(2)} GB`);
```

### User Information

```javascript
// Current user info
os.userInfo();
// Returns: {
//   uid: 1000,
//   gid: 1000,
//   username: 'john',
//   homedir: '/home/john',
//   shell: '/bin/bash'
// }

// Home directory
os.homedir();
// Returns: '/home/john' or 'C:\Users\John'
```

### File System Paths

```javascript
// Temporary directory
os.tmpdir();
// Returns: '/tmp' or 'C:\Users\John\AppData\Local\Temp'

// Line ending
os.EOL;
// Returns: '\n' (Unix/Linux/macOS) or '\r\n' (Windows)

// Example usage:
const lines = ['Line 1', 'Line 2', 'Line 3'];
const text = lines.join(os.EOL);
```

### Network Information

```javascript
// Network interfaces
os.networkInterfaces();
// Returns object with network interface details:
// {
//   eth0: [
//     {
//       address: '192.168.1.100',
//       netmask: '255.255.255.0',
//       family: 'IPv4',
//       mac: '00:11:22:33:44:55',
//       internal: false
//     }
//   ],
//   lo: [
//     {
//       address: '127.0.0.1',
//       netmask: '255.0.0.0',
//       family: 'IPv4',
//       mac: '00:00:00:00:00:00',
//       internal: true
//     }
//   ]
// }
```

### Process Priority (Unix/Linux)

```javascript
// Get process priority
os.getPriority(pid);
// Returns scheduling priority (lower = higher priority)
// Range: -20 (highest) to 19 (lowest)

// Set process priority
os.setPriority(pid, priority);
// Example:
os.setPriority(process.pid, -10); // Increase priority
```

### Constants

```javascript
// OS-specific constants
os.constants;
// Contains useful constants:

// Signal constants
os.constants.signals.SIGINT; // 2
os.constants.signals.SIGTERM; // 15
os.constants.signals.SIGKILL; // 9

// Error codes
os.constants.errno.ENOENT; // No such file or directory
os.constants.errno.EACCES; // Permission denied

// Example usage:
process.on('SIGINT', () => {
  console.log('Received SIGINT');
  process.exit(0);
});
```

---

## Practical Examples

### Example 1: System Information Script

```javascript
const os = require('os');

console.log('=== SYSTEM INFORMATION ===');
console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`Hostname: ${os.hostname()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`OS Release: ${os.release()}`);
console.log(`Uptime: ${(os.uptime() / 3600).toFixed(2)} hours`);

console.log('\n=== CPU INFORMATION ===');
const cpus = os.cpus();
console.log(`CPU Model: ${cpus[0].model}`);
console.log(`CPU Cores: ${cpus.length}`);
console.log(`CPU Speed: ${cpus[0].speed} MHz`);

console.log('\n=== MEMORY INFORMATION ===');
const totalMem = os.totalmem() / 1024 ** 3;
const freeMem = os.freemem() / 1024 ** 3;
const usedMem = totalMem - freeMem;
console.log(`Total: ${totalMem.toFixed(2)} GB`);
console.log(`Used: ${usedMem.toFixed(2)} GB`);
console.log(`Free: ${freeMem.toFixed(2)} GB`);
console.log(`Usage: ${((usedMem / totalMem) * 100).toFixed(2)}%`);
```

### Example 2: Command-Line Argument Parser

```javascript
// node script.js --name=John --age=30 --verbose

function parseArgs() {
  const args = {};

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value || true;
    }
  });

  return args;
}

const args = parseArgs();
console.log('Arguments:', args);
// { name: 'John', age: '30', verbose: true }
```

### Example 3: Graceful Shutdown

```javascript
function setupGracefulShutdown() {
  let isShuttingDown = false;

  function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    // Perform cleanup tasks
    // Close database connections, etc.

    setTimeout(() => {
      console.log('Cleanup complete, exiting...');
      process.exit(0);
    }, 1000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

setupGracefulShutdown();
```

### Example 4: Resource Monitor

```javascript
function monitorResources() {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();

  console.log('=== PROCESS RESOURCES ===');
  console.log(`PID: ${process.pid}`);
  console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
  console.log(`Memory (RSS): ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`CPU User: ${(cpu.user / 1000).toFixed(2)} ms`);
  console.log(`CPU System: ${(cpu.system / 1000).toFixed(2)} ms`);
}

// Monitor every 5 seconds
setInterval(monitorResources, 5000);
```

### Example 5: Environment Configuration

```javascript
// Load environment variables
const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};

console.log('Configuration:', config);

// Validate required variables
if (!config.dbUrl) {
  console.error('ERROR: DATABASE_URL is required');
  process.exit(1);
}
```

---

## Quick Reference Tables

### Process Properties

| Property           | Description            | Example                          |
| ------------------ | ---------------------- | -------------------------------- |
| `process.argv`     | Command-line arguments | `['node', 'script.js', 'arg1']`  |
| `process.env`      | Environment variables  | `{ HOME: '/home/user' }`         |
| `process.pid`      | Process ID             | `12345`                          |
| `process.platform` | Operating system       | `'linux'`, `'darwin'`, `'win32'` |
| `process.arch`     | CPU architecture       | `'x64'`, `'arm64'`               |
| `process.version`  | Node version           | `'v18.12.0'`                     |

### OS Module Methods

| Method          | Description      | Returns                          |
| --------------- | ---------------- | -------------------------------- |
| `os.platform()` | OS platform      | `'linux'`, `'darwin'`, `'win32'` |
| `os.arch()`     | CPU architecture | `'x64'`, `'arm'`                 |
| `os.cpus()`     | CPU information  | Array of CPU details             |
| `os.totalmem()` | Total RAM        | Bytes                            |
| `os.freemem()`  | Available RAM    | Bytes                            |
| `os.hostname()` | Computer name    | String                           |
| `os.userInfo()` | Current user     | Object with user details         |

---

## Key Concepts Summary

📌 **`process` is a global object** - no require() needed
📌 **`os` module must be imported** - use require('os')
📌 **process.argv** contains command-line arguments
📌 **process.env** accesses environment variables
📌 **process.exit()** terminates the program immediately
📌 **process.nextTick()** schedules callbacks before I/O
📌 **os.cpus()** provides detailed CPU information
📌 **Memory functions** return values in bytes
📌 **process.platform and os.platform()** identify the OS
📌 **Graceful shutdown** handles SIGTERM/SIGINT signals
📌 **Resource monitoring** tracks CPU and memory usage
📌 **User permissions** (Unix/Linux) via getuid/setuid
