# JavaScript Stack and Heap

## The Stack (Call Stack)

**What it stores:**

- Primitive values (numbers, strings, booleans, null, undefined, symbols, bigints)
- Function calls and execution contexts
- References/pointers to objects (not the objects themselves)

**Characteristics:**

- **Fixed size** - limited memory space
- **Fast access** - LIFO (Last In, First Out) structure
- **Automatic memory management** - variables are automatically removed when out of scope
- **Static memory allocation** - size must be known at compile time

**Example:**

```javascript
function greet() {
  let name = 'Alice'; // primitive stored on stack
  let age = 25; // primitive stored on stack
  console.log(name);
}
greet(); // function call added to stack, then removed when done
```

## The Heap

**What it stores:**

- Objects
- Arrays
- Functions (as objects)
- Any complex data structures

**Characteristics:**

- **Dynamic size** - can grow as needed
- **Slower access** - unstructured memory pool
- **Manual cleanup needed** - relies on garbage collection
- **Dynamic memory allocation** - size can change at runtime

**Example:**

```javascript
let person = {
  // object stored in heap
  name: 'Alice', // stack holds reference to this object
  age: 25,
};

let numbers = [1, 2, 3]; // array stored in heap
```

## How They Work Together

```javascript
let x = 10; // Stack: x = 10
let obj = { value: 20 }; // Stack: obj = [reference]
// Heap: { value: 20 }

let y = x; // Stack: y = 10 (copy of value)
let obj2 = obj; // Stack: obj2 = [same reference]
// Both point to same heap object

obj2.value = 30;
console.log(obj.value); // 30 (same object in heap)
```

## Key Implications

**Stack overflow:** Too many function calls (deep recursion) → stack overflow error

**Memory leaks:** Objects in heap not being garbage collected → memory leak

**Pass by value vs reference:**

- Primitives are copied (pass by value)
- Objects share references (pass by reference behavior)

This division allows JavaScript to efficiently manage both simple, temporary data and complex, long-lived data structures.
