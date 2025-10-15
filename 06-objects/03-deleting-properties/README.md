# JavaScript Deleting Properties

## The delete Operator

The `delete` operator **removes a property from an object**. It operates on the **property itself**, not the property's value.

### Basic Syntax

```javascript
delete object.property;
delete object['property'];
```

### Basic Examples

```javascript
let book = {
  'main title': 'JavaScript',
  'sub-title': 'The Definitive Guide',
  for: 'all audiences',
  author: {
    firstName: 'John',
    surname: 'Doe',
  },
};

delete book.author; // Removes "author" property
delete book['main title']; // Removes "main title" property

console.log(book.author); // undefined
console.log(book['main title']); // undefined
```

---

## How delete Works

### Only Deletes Own Properties

The `delete` operator **only removes own properties**, not inherited ones.

```javascript
let obj = { x: 1 }; // obj has own property x
delete obj.x; // true: deletes own property

delete obj.toString; // true: does nothing (toString is inherited)
console.log(obj.toString); // Still works (inherited from Object.prototype)
```

**To delete an inherited property**: You must delete it from the prototype object itself, which affects **all objects** that inherit from that prototype.

```javascript
let proto = { inherited: 'value' };
let child = Object.create(proto);

delete child.inherited; // true, but doesn't remove it
console.log(child.inherited); // Still 'value' (inherited)

delete proto.inherited; // Removes from prototype
console.log(child.inherited); // undefined (now truly gone)
```

---

## Return Values

The `delete` operator returns a **boolean** value:

### Returns true when

1. **Delete succeeds** (property is removed)
2. **Property doesn't exist** (no effect, but still true)
3. **Property is inherited** (no effect, but still true)
4. **Operand is not a property** (meaningless, but still true)

```javascript
let o = { x: 1 };

delete o.x; // true: property deleted
delete o.x; // true: property doesn't exist (no effect)
delete o.toString; // true: inherited property (not deleted)
delete 1; // true: not a property expression
```

**Important**: `delete` returning `true` doesn't guarantee the property was actually removed!

---

## Non-Configurable Properties

Properties with `configurable: false` **cannot be deleted**.

### What Are Non-Configurable Properties?

- Built-in object properties (e.g., `Object.prototype`)
- Properties created by `var` declarations
- Properties created by function declarations
- Properties explicitly defined with `configurable: false`

### Behavior by Mode

**Strict mode**: Throws `TypeError`

```javascript
'use strict';
delete Object.prototype; // TypeError
```

**Non-strict mode**: Returns `false`

```javascript
delete Object.prototype; // false (no error)
```

### Examples of Non-Configurable Properties

```javascript
// Built-in properties
delete Object.prototype; // false (non-configurable)

// var declarations create non-configurable properties
var x = 1;
delete globalThis.x; // false (can't delete)

// Function declarations
function f() {}
delete globalThis.f; // false (can't delete)

// let/const do NOT create global properties
let y = 2;
delete globalThis.y; // true (y isn't on globalThis)
console.log(y); // Still 2 (exists in block scope)
```

---

## Global Object Properties

### Non-Strict Mode

You can omit the global object reference:

```javascript
globalThis.x = 1; // Configurable global property
delete x; // true (works in non-strict mode)
```

### Strict Mode

You **must** use explicit property access:

```javascript
'use strict';

globalThis.x = 1;
delete x; // SyntaxError (unqualified identifier)
delete globalThis.x; // true (explicit access required)
```

---

## Property Configurability

### Checking if a Property is Configurable

```javascript
let obj = { x: 1 };

let descriptor = Object.getOwnPropertyDescriptor(obj, 'x');
console.log(descriptor.configurable); // true
```

### Creating Non-Configurable Properties

```javascript
let obj = {};
Object.defineProperty(obj, 'permanent', {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: false, // Cannot be deleted
});

delete obj.permanent; // false
console.log(obj.permanent); // 42 (still exists)
```

---

## Common Use Cases

### 1. Removing Unnecessary Properties

```javascript
let user = {
  username: 'alice',
  password: 'secret123',
  email: 'alice@example.com',
};

// Before sending to client
delete user.password; // Remove sensitive data
```

### 2. Cleaning Up Temporary Properties

```javascript
let data = {
  result: [1, 2, 3],
  _temp: 'processing',
  _cache: {},
};

// Remove temporary properties
delete data._temp;
delete data._cache;
```

### 3. Implementing Optional Properties

```javascript
function createUser(name, age, email) {
  let user = { name, age, email };

  if (!email) {
    delete user.email; // Remove if not provided
  }

  return user;
}
```

---

## delete vs Setting to undefined

### delete Removes the Property

```javascript
let obj = { x: 1, y: 2 };
delete obj.x;

console.log('x' in obj); // false
console.log(obj.hasOwnProperty('x')); // false
Object.keys(obj); // ['y']
```

### Setting to undefined Keeps the Property

```javascript
let obj = { x: 1, y: 2 };
obj.x = undefined;

console.log('x' in obj); // true
console.log(obj.hasOwnProperty('x')); // true
Object.keys(obj); // ['x', 'y']
```

**Key difference**: `delete` completely removes the property; setting to `undefined` just changes its value.

---

## Edge Cases and Gotchas

### 1. Arrays

Deleting array elements creates "holes":

```javascript
let arr = [1, 2, 3, 4];
delete arr[1];

console.log(arr); // [1, empty, 3, 4]
console.log(arr.length); // 4 (length unchanged!)
console.log(arr[1]); // undefined
```

**Better alternative**: Use `splice()` to maintain array integrity:

```javascript
arr.splice(1, 1); // Removes element and shifts others
```

### 2. Deleting Variables

Cannot delete variables declared with `var`, `let`, or `const`:

```javascript
var x = 1;
let y = 2;
const z = 3;

delete x; // false
delete y; // false
delete z; // false
```

### 3. Property on Sealed/Frozen Objects

```javascript
let obj = { x: 1 };
Object.seal(obj);

delete obj.x; // false (sealed objects)
```

```javascript
let obj = { x: 1 };
Object.freeze(obj);

delete obj.x; // false (frozen objects)
```

### 4. Deleting Non-Existent Properties

Always returns `true` (no error):

```javascript
let obj = {};
delete obj.nonExistent; // true
```

---

## Best Practices

✅ **Use delete** when you need to completely remove a property
✅ **Check return value** if you need to know if deletion succeeded
✅ **Use strict mode** to catch errors when deleting non-configurable properties
✅ **Avoid delete on arrays** - use `splice()` instead
✅ **Set to undefined/null** if you just want to clear a value but keep the property
✅ **Be explicit** with global object in strict mode: `delete globalThis.x`
✅ **Check configurability** before attempting to delete critical properties

---

## Performance Considerations

⚠️ **delete can be slow**: Modern JavaScript engines optimize objects based on their "shape" (property structure). Deleting properties can de-optimize objects.

**Alternative**: If performance matters, set properties to `null` or `undefined` instead:

```javascript
// Slower (changes object structure)
delete obj.property;

// Faster (maintains object structure)
obj.property = undefined;
```

---

## Key Concepts Summary

📌 **delete removes properties**, not values
📌 **Only deletes own properties**, not inherited ones
📌 **Returns true** even when deletion has no effect
📌 **Cannot delete non-configurable properties**
📌 **Strict mode throws TypeError** for non-configurable deletions
📌 **Non-strict mode returns false** for failed deletions
📌 **var/function declarations** create non-configurable global properties
📌 **let/const** do not create properties on the global object
📌 **Strict mode requires explicit global object reference** (`delete globalThis.x`)
📌 **delete vs undefined**: delete removes the property entirely; undefined keeps it
📌 **Array deletion** creates holes; use `splice()` instead
📌 **Performance**: delete can de-optimize objects in some engines
