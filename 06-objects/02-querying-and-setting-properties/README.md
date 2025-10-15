# JavaScript Querying and Setting Properties

## Accessing Properties

JavaScript provides two ways to access object properties: **dot notation** and **bracket notation**.

### Dot Notation (`.`)

The right-hand side must be a simple identifier:

```javascript
let author = book.author; // Get "author" property
let name = author.surname; // Get "surname" property
let title = book.mainTitle; // Get "mainTitle" property
```

**Requirements**:

- Property name must be a valid JavaScript identifier
- Cannot be used with property names containing spaces, hyphens, or special characters
- Property name must be known at coding time (static)

### Bracket Notation (`[]`)

The value inside brackets must evaluate to a string or Symbol:

```javascript
let title = book['main title']; // Property with space
let subtitle = book['sub-title']; // Property with hyphen
let prop = book['author']; // Works like dot notation
```

**Requirements**:

- Expression must evaluate to a string, Symbol, or value convertible to string
- Can use dynamic property names (determined at runtime)
- Required for property names that aren't valid identifiers

---

## Setting Properties

Use the same notation as querying, but place it on the left side of an assignment:

### Creating Properties

```javascript
book.edition = 7; // Create "edition" property
book['main title'] = 'ECMAScript'; // Create/update property
```

### Updating Properties

```javascript
book.author = 'Jane Doe'; // Update existing property
book['sub-title'] = 'New Subtitle'; // Update with bracket notation
```

---

## Objects as Associative Arrays

Both syntaxes access the same property:

```javascript
object.property; // Dot notation
object['property']; // Bracket notation (associative array style)
```

### Why This Matters

**Dot notation limitations**:

- Property names must be hardcoded as identifiers
- Cannot be manipulated at runtime

**Bracket notation advantages**:

- Property names are strings (a data type)
- Can be created, manipulated, and computed at runtime
- Enables dynamic property access

### Dynamic Property Access Example

```javascript
// Reading dynamic properties
let addr = '';
for (let i = 0; i < 4; i++) {
  addr += customer[`address${i}`] + '\n';
}
// Accesses: address0, address1, address2, address3
```

### Practical Use Case: Stock Portfolio

```javascript
function addStock(portfolio, stockName, shares) {
  portfolio[stockName] = shares; // Dynamic property name
}

// User enters "AAPL" at runtime
addStock(portfolio, 'AAPL', 50);
// Creates: portfolio.AAPL = 50
```

### Computing Values with Dynamic Properties

```javascript
function computeValue(portfolio) {
  let total = 0.0;

  for (let stock in portfolio) {
    // Iterate property names
    let shares = portfolio[stock]; // Get value dynamically
    let price = getQuote(stock); // Look up current price
    total += shares * price; // Calculate total
  }

  return total;
}
```

**Note**: While objects work as associative arrays, **ES6+ Map** is often a better choice for key-value storage.

---

## Property Inheritance

Objects have **own properties** and **inherit properties** from their prototype chain.

### How Property Lookup Works

When querying property `x` on object `o`:

1. Check if `o` has an **own property** named `x` → return it
2. If not, check `o`'s **prototype** for property `x` → return it
3. Continue up the **prototype chain** until:
   - Property is found, or
   - An object with `null` prototype is reached (returns `undefined`)

### Inheritance Example

```javascript
let o = {}; // Inherits from Object.prototype
o.x = 1; // Own property x

let p = Object.create(o); // Inherits from o
p.y = 2; // Own property y

let q = Object.create(p); // Inherits from p (and o)
q.z = 3; // Own property z

console.log(q.x + q.y); // 3 (x from o, y from p)
console.log(q.toString()); // Inherited from Object.prototype
```

**Prototype chain**: `q` → `p` → `o` → `Object.prototype` → `null`

### Setting Properties and Inheritance

**Key rule**: Property assignment creates or modifies properties **only on the original object**, never on the prototype chain.

```javascript
let unitCircle = { r: 1 };
let c = Object.create(unitCircle); // c inherits r

c.x = 1; // Create own property x
c.y = 1; // Create own property y
c.r = 2; // Create own property r (overrides inherited)

console.log(unitCircle.r); // 1 (prototype unchanged)
console.log(c.r); // 2 (own property)
```

**What happens when setting properties**:

- If own property exists → update it
- If own property doesn't exist → create it
- Inherited properties are **shadowed** (hidden), not modified

### Assignment Rules

Property assignment examines the prototype chain only to check if assignment is **allowed**:

**Assignment fails if**:

- Object inherits a **read-only property** with the same name

**Exception**: If the inherited property is an **accessor with a setter**, the setter is called on the original object (not the prototype).

---

## Property Access Errors

### Querying Non-Existent Properties

**Not an error**: Returns `undefined`

```javascript
let book = {
  'sub-title': 'The Definitive Guide',
};

book.subtitle; // undefined (property doesn't exist)
```

### Querying Properties of null/undefined

**Error**: Attempting to access properties of `null` or `undefined` throws `TypeError`

```javascript
let book = { subtitle: undefined };
let len = book.subtitle.length; // TypeError: Cannot read property 'length' of undefined
```

### Guarding Against Errors

#### 1. Verbose Approach (if statements)

```javascript
let surname = undefined;
if (book) {
  if (book.author) {
    surname = book.author.surname;
  }
}
```

#### 2. Short-Circuit Evaluation (&&)

```javascript
let surname = book && book.author && book.author.surname;
// Returns surname, or first falsy value (null/undefined)
```

#### 3. Optional Chaining (?.) - ES2020

```javascript
let surname = book?.author?.surname;
// Returns surname or undefined if any part is null/undefined
```

**How optional chaining works**:

- If left side is `null` or `undefined`, returns `undefined`
- Otherwise, continues accessing the property
- No TypeError thrown

---

## Setting Property Errors

### Setting Properties on null/undefined

**Always an error**: Throws `TypeError`

```javascript
let obj = null;
obj.prop = 'value'; // TypeError
```

### When Property Assignment Fails

In **strict mode**, failed assignments throw `TypeError`. In **non-strict mode**, they fail silently.

**Assignment fails when**:

1. **Read-only own property**:

   ```javascript
   Object.defineProperty(obj, 'x', { value: 1, writable: false });
   obj.x = 2; // Fails (strict mode: TypeError)
   ```

2. **Read-only inherited property**:

   ```javascript
   let parent = {};
   Object.defineProperty(parent, 'x', { value: 1, writable: false });
   let child = Object.create(parent);
   child.x = 2; // Fails (cannot override read-only inherited property)
   ```

3. **Non-extensible object** (no setter exists):

   ```javascript
   let obj = { x: 1 };
   Object.preventExtensions(obj);
   obj.y = 2; // Fails (cannot add new properties)
   ```

---

## Comparison: Dot vs Bracket Notation

| Feature                | Dot Notation         | Bracket Notation         |
| ---------------------- | -------------------- | ------------------------ |
| **Syntax**             | `obj.property`       | `obj['property']`        |
| **Property name**      | Must be identifier   | Can be any string/Symbol |
| **Dynamic access**     | ❌ No (static only)  | ✅ Yes (runtime)         |
| **Special characters** | ❌ No spaces/hyphens | ✅ Supports any string   |
| **Performance**        | Slightly faster      | Slightly slower          |
| **Use when**           | Property name known  | Dynamic/computed names   |

---

## Best Practices

✅ **Use dot notation** when property names are known and valid identifiers
✅ **Use bracket notation** for dynamic property access or special characters
✅ **Use optional chaining (`?.`)** to safely access nested properties
✅ **Check for null/undefined** before accessing nested properties
✅ **Prefer Map** over plain objects for true associative arrays (ES6+)
✅ **Use strict mode** to catch property assignment errors
✅ **Understand inheritance** to avoid unintended property shadowing

---

## Key Concepts Summary

📌 **Two access methods**: dot (`.`) and bracket (`[]`) notation
📌 **Bracket notation** enables dynamic property access at runtime
📌 **Objects as associative arrays**: String-indexed collections
📌 **Property inheritance** follows the prototype chain upward
📌 **Property assignment** only affects the original object, not prototypes
📌 **Querying non-existent properties** returns `undefined` (not an error)
📌 **Accessing properties of null/undefined** throws `TypeError`
📌 **Optional chaining (`?.`)** prevents errors when accessing nested properties
📌 **Read-only properties** and **non-extensible objects** prevent assignment
📌 **Strict mode** throws errors; non-strict mode fails silently
