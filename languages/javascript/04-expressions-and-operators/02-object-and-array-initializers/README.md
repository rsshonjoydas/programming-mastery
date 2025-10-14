# JavaScript Object and Array Initializers

Let me combine your notes with comprehensive additional information about these fundamental JavaScript concepts.

## Array Initializers

### Basic Syntax

Array initializers (array literals) use square brackets `[]` with comma-separated expressions:

```javascript
[][(1 + 2, 3 + 4)][(1, 2, 3, 4, 5)]; // Empty array with no elements // 2-element array: [3, 7] // Simple array with 5 elements
```

### Key Characteristics

**1. Dynamic Evaluation**

- Element expressions are evaluated **each time** the array initializer is used
- This means you can get different values on each evaluation:

```javascript
let arr1 = [Math.random(), Math.random()];
let arr2 = [Math.random(), Math.random()];
// arr1 and arr2 will have different values
```

**2. Nested Arrays**
Arrays can contain other arrays as elements:

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
// Access: matrix[0][1] returns 2
```

**3. Sparse Arrays (Undefined Elements)**
You can create "holes" in arrays by omitting values between commas:

```javascript
let sparseArray = [1, , , , 5]; // [1, empty × 3, 5]
// sparseArray.length is 5
// sparseArray[1] is undefined
// sparseArray[2] is undefined
// sparseArray[3] is undefined
```

**4. Trailing Commas**
A single trailing comma is allowed and ignored:

```javascript
let arr = [1, 2, 3]; // Valid, same as [1, 2, 3]
```

---

## Object Initializers

### Basic Syntax

Object initializers (object literals) use curly braces `{}` with property-value pairs:

```javascript
let p = { x: 2.3, y: -1.2 }; // Object with 2 properties
let q = {}; // Empty object

// Adding properties after creation
q.x = 2.3;
q.y = -1.2; // Now q equals p
```

### Nested Objects

Objects can contain other objects:

```javascript
let rectangle = {
  upperLeft: { x: 2, y: 2 },
  lowerRight: { x: 4, y: 5 },
};
// Access: rectangle.upperLeft.x returns 2
```

---

## ES6+ Enhanced Object Literal Syntax

Modern JavaScript (ES6+) added powerful features to object literals:

### 1. **Shorthand Property Names**

When variable name matches property name:

```javascript
let x = 10,
  y = 20;
let point = { x, y }; // Same as { x: x, y: y }
```

### 2. **Computed Property Names**

Use expressions for property names with square brackets:

```javascript
let propName = 'score';
let obj = {
  [propName]: 100,
  ['total' + 'Points']: 500,
};
// obj.score = 100, obj.totalPoints = 500
```

### 3. **Method Shorthand**

Shorter syntax for defining methods:

```javascript
let obj = {
  // Old way
  sayHello: function () {
    return 'Hello';
  },

  // New shorthand
  sayHi() {
    return 'Hi';
  },
};
```

### 4. **Getters and Setters**

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
};
```

---

## Important Differences: Arrays vs Objects

| Feature      | Arrays                       | Objects               |
| ------------ | ---------------------------- | --------------------- |
| **Brackets** | Square `[]`                  | Curly `{}`            |
| **Keys**     | Numeric indices (0, 1, 2...) | String property names |
| **Order**    | Ordered collection           | Unordered (mostly)    |
| **Length**   | Has `.length` property       | No built-in length    |
| **Purpose**  | Lists of items               | Key-value pairs       |

---

## Practical Examples

### Array Patterns

```javascript
// Mixed types
let mixed = [1, 'hello', true, null, { x: 5 }];

// Array of objects
let users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
];

// Multi-dimensional array
let grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

### Object Patterns

```javascript
// Configuration object
let config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};

// Complex nested structure
let company = {
  name: 'Tech Corp',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  employees: [
    { name: 'Alice', role: 'Developer' },
    { name: 'Bob', role: 'Designer' },
  ],
};
```

---

## Common Pitfalls & Tips

**Arrays:**

- Sparse arrays have a length but contain "holes" - be careful when iterating
- Trailing commas don't add elements, but multiple commas do
- Array elements are evaluated fresh each time

**Objects:**

- Property names are always strings (or Symbols in ES6+)
- Duplicate property names: last one wins
- Properties can be added/modified after creation
- Use computed property names `[expression]` for dynamic keys

---

This covers the fundamentals and modern features of JavaScript initializers. They're the foundation for creating data structures in JavaScript!
