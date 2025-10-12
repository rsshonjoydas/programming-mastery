# JavaScript Infinite Loops

An **infinite loop** is a loop that runs forever because its terminating condition is never met.

## Common Types

### 1. **While Loop**

```javascript
while (true) {
  console.log('This runs forever');
}
```

### 2. **For Loop**

```javascript
for (let i = 0; i >= 0; i++) {
  console.log('Never stops');
}
```

### 3. **Accidental Infinite Loops**

```javascript
// Forgot to increment
let i = 0;
while (i < 10) {
  console.log(i);
  // Missing i++
}

// Wrong condition
for (let i = 10; i > 0; i++) {
  // i++ instead of i--
  console.log(i);
}
```

## How to Stop an Infinite Loop

- **In browser**: Close the tab or use Task Manager
- **In Node.js**: Press `Ctrl + C` in terminal
- **In browser console**: Refresh the page or close DevTools

## Intentional Use Cases

Sometimes infinite loops are used on purpose:

```javascript
// Game loop
while (true) {
  updateGame();
  render();
  if (gameOver) break;
}

// Server listening
while (true) {
  handleRequest();
}
```

## Prevention Tips

- Always ensure your loop condition will eventually be false
- Double-check increment/decrement statements
- Use `break` statements when needed
- Set a maximum iteration count as a safety measure
