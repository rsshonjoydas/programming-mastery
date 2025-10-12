# JavaScript `for...in` Loop

The `for...in` loop iterates over the **enumerable properties** of an object. It has been part of JavaScript since the beginning, predating the ES6 `for...of` loop.

## Syntax

```javascript
for (variable in object) {
  statement;
}
```

- **variable**: Typically a variable name, but can be a variable declaration or anything suitable for the left-hand side of an assignment
- **object**: An expression that evaluates to an object
- **statement**: The statement or block that serves as the loop body

## Basic Example

```javascript
const person = {
  name: 'Alice',
  age: 30,
  city: 'New York',
};

for (let key in person) {
  console.log(key + ': ' + person[key]);
}
// Output:
// name: Alice
// age: 30
// city: New York
```

## How It Works

1. The JavaScript interpreter evaluates the object expression
2. If it evaluates to `null` or `undefined`, the loop is skipped
3. The loop executes once for each enumerable property
4. Before each iteration, the property name (as a string) is assigned to the variable

## Advanced Usage

The variable can be an arbitrary expression evaluated on each iteration:

```javascript
let o = { x: 1, y: 2, z: 3 };
let a = [],
  i = 0;
for (a[i++] in o); // Copies property names into array
```

## Using with Arrays (Not Recommended)

JavaScript arrays are specialized objects, and array indexes are enumerable properties:

```javascript
const arr = [10, 20, 30];

for (let index in arr) {
  console.log(index); // "0", "1", "2" (strings, not numbers!)
}
```

**Why avoid `for...in` with arrays?**

- Iterates over index strings, not numeric indexes
- May include inherited properties
- Use `for...of` or traditional `for` loops instead

## What Gets Enumerated

The `for...in` loop does **not** enumerate all properties:

- ✅ **Enumerates**: String-named enumerable properties (including inherited ones)
- ❌ **Does not enumerate**:
  - Properties with Symbol names
  - Non-enumerable properties (like built-in methods such as `toString()`)
  - All properties and methods you define are enumerable by default

## Filtering Inherited Properties

To exclude inherited properties from the prototype chain:

```javascript
for (let key in person) {
  if (Object.hasOwn(person, key)) {
    // or person.hasOwnProperty(key)
    console.log(key + ': ' + person[key]);
  }
}
```

## Dynamic Property Changes

- If the loop body **deletes** a property that hasn't been enumerated yet, it won't be enumerated
- If the loop body **defines** new properties, they may or may not be enumerated

## Best Practices

Many developers prefer `for...of` with `Object.keys()` over `for...in`:

```javascript
for (let key of Object.keys(person)) {
  console.log(key + ': ' + person[key]);
}
```

This approach avoids inherited properties and provides more predictable behavior.

## Key Takeaways

- **Iterates over keys** (property names), not values
- Works with any object, but not recommended for arrays
- Includes inherited enumerable properties
- Use filtering or `Object.keys()` for more control
- Common bug: accidentally using `for...in` instead of `for...of` with arrays
