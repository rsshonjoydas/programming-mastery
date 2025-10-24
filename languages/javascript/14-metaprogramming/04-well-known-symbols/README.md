# JavaScript Well-Known Symbols

**Well-known Symbols** are predefined Symbol values stored as properties of the `Symbol()` factory function. They allow you to control low-level behaviors of objects and classes, enabling safe language extensions without breaking existing code.

---

## Overview of Well-Known Symbols

| Symbol                      | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| `Symbol.iterator`           | Make objects iterable (for...of loops)            |
| `Symbol.asyncIterator`      | Make objects async iterable                       |
| `Symbol.hasInstance`        | Customize `instanceof` behavior                   |
| `Symbol.toStringTag`        | Customize `toString()` output                     |
| `Symbol.species`            | Control which constructor creates derived objects |
| `Symbol.isConcatSpreadable` | Control array spreading in `concat()`             |
| `Symbol.match`              | Define custom string matching                     |
| `Symbol.replace`            | Define custom string replacement                  |
| `Symbol.search`             | Define custom string search                       |
| `Symbol.split`              | Define custom string splitting                    |
| `Symbol.matchAll`           | Define custom match-all behavior                  |
| `Symbol.toPrimitive`        | Control object-to-primitive conversion            |
| `Symbol.unscopables`        | Exclude properties from `with` statement          |

---

## 1. Symbol.iterator and Symbol.asyncIterator

Make objects work with `for...of` loops and async iteration.

### Symbol.iterator

```javascript
class Counter {
  constructor(max) {
    this.max = max;
  }

  [Symbol.iterator]() {
    let count = 0;
    let max = this.max;

    return {
      next() {
        if (count < max) {
          return { value: count++, done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}

let counter = new Counter(3);
for (let num of counter) {
  console.log(num); // 0, 1, 2
}
```

### Symbol.asyncIterator

```javascript
class AsyncCounter {
  constructor(max) {
    this.max = max;
  }

  [Symbol.asyncIterator]() {
    let count = 0;
    let max = this.max;

    return {
      async next() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (count < max) {
          return { value: count++, done: false };
        }
        return { done: true };
      },
    };
  }
}

(async () => {
  for await (let num of new AsyncCounter(3)) {
    console.log(num); // 0, 1, 2 (with delays)
  }
})();
```

---

## 2. Symbol.hasInstance

Customize how `instanceof` works for your objects.

### Basic Usage

```javascript
// Define a pseudo-type for type checking
let uint8 = {
  [Symbol.hasInstance](x) {
    return Number.isInteger(x) && x >= 0 && x <= 255;
  },
};

128 instanceof uint8; // true
256 instanceof uint8; // false (too big)
Math.PI instanceof uint8; // false (not an integer)
```

### Practical Example

```javascript
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number';
  }
}

5 instanceof PrimitiveNumber; // true
new Number(5) instanceof PrimitiveNumber; // false
```

**Note**: While clever, it's often clearer to use regular functions like `isUint8(x)` instead.

---

## 3. Symbol.toStringTag

Customize the string returned by `Object.prototype.toString()`.

### Default Behavior

```javascript
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(/./); // "[object RegExp]"
Object.prototype.toString.call(() => {}); // "[object Function]"
Object.prototype.toString.call(''); // "[object String]"
```

### Custom Class Example

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  get [Symbol.toStringTag]() {
    return 'Range';
  }
}

let r = new Range(1, 10);
Object.prototype.toString.call(r); // "[object Range]"
r.toString(); // "[object Range]"
```

### Utility Function

```javascript
function classof(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

classof(null); // "Null"
classof(undefined); // "Undefined"
classof(1); // "Number"
classof(''); // "String"
classof([]); // "Array"
classof(new Map()); // "Map"
classof(new Range()); // "Range"
```

---

## 4. Symbol.species

Control which constructor is used when methods create new instances.

### The Problem

```javascript
class EZArray extends Array {
  get first() {
    return this[0];
  }
  get last() {
    return this[this.length - 1];
  }
}

let e = new EZArray(1, 2, 3);
let f = e.map((x) => x * x);

f.last; // Should f be an EZArray or plain Array?
```

### **Default Behavior**

By default, array methods return instances of the **subclass**:

```javascript
let e = new EZArray(1, 2, 3);
let f = e.map((x) => x * x);

console.log(f instanceof EZArray); // true
console.log(f.last); // 9 (has last property)
```

### How It Works

1. `Array` has a `Symbol.species` property (getter that returns `this`)
2. Subclasses inherit this getter
3. Methods like `map()` use `new this.constructor[Symbol.species]()`
4. By default, each subclass is its own "species"

### Overriding Species

Make array methods return plain `Array` objects:

```javascript
class EZArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  get first() {
    return this[0];
  }
  get last() {
    return this[this.length - 1];
  }
}

let e = new EZArray(1, 2, 3);
let f = e.map((x) => x - 1);

console.log(e.last); // 3 (e is EZArray)
console.log(f.last); // undefined (f is plain Array)
```

### Alternative: defineProperty

```javascript
Object.defineProperty(EZArray, Symbol.species, {
  value: Array,
});
```

### Other Uses

- **Typed arrays**: Use `Symbol.species` like `Array`
- **ArrayBuffer**: `slice()` method uses it
- **Promise**: Methods like `then()` create new promises via species
- **Map/Set**: Subclasses can use it for derived instances

---

## 5. Symbol.isConcatSpreadable

Control whether arrays/objects are flattened in `concat()`.

### Default Behavior

```javascript
let arr = [1, 2];
let result = [].concat(arr, 3);
console.log(result); // [1, 2, 3] (array is spread)

let obj = { 0: 1, 1: 2, length: 2 };
result = [].concat(obj, 3);
console.log(result); // [{0: 1, 1: 2, length: 2}, 3] (object not spread)
```

### Making Array-Like Objects Spreadable

```javascript
let arraylike = {
  length: 2,
  0: 1,
  1: 2,
  [Symbol.isConcatSpreadable]: true,
};

[].concat(arraylike); // [1, 2] (spread like an array)
```

### Preventing Array Subclass Spreading

```javascript
class NonSpreadableArray extends Array {
  get [Symbol.isConcatSpreadable]() {
    return false;
  }
}

let a = new NonSpreadableArray(1, 2, 3);
let result = [].concat(a);

console.log(result.length); // 1 (a is not spread)
console.log(result[0]); // NonSpreadableArray [1, 2, 3]
```

---

## 6. Pattern-Matching Symbols

Generalize String methods to work with custom pattern objects.

### Available Symbols

- `Symbol.match` - for `string.match(pattern)`
- `Symbol.replace` - for `string.replace(pattern, replacement)`
- `Symbol.search` - for `string.search(pattern)`
- `Symbol.split` - for `string.split(pattern)`
- `Symbol.matchAll` - for `string.matchAll(pattern)`

### **How It Works**

```javascript
string.method(pattern, arg);
// Becomes:
pattern[symbol](string, arg);
```

### Custom Glob Pattern Example

```javascript
class Glob {
  constructor(glob) {
    this.glob = glob;

    // Convert glob to RegExp: ? = one char, * = zero or more
    let regexpText = glob.replace('?', '([^/])').replace('*', '([^/]*)');

    this.regexp = new RegExp(`^${regexpText}$`, 'u');
  }

  toString() {
    return this.glob;
  }

  [Symbol.search](s) {
    return s.search(this.regexp);
  }

  [Symbol.match](s) {
    return s.match(this.regexp);
  }

  [Symbol.replace](s, replacement) {
    return s.replace(this.regexp, replacement);
  }
}

let pattern = new Glob('docs/*.txt');

'docs/js.txt'.search(pattern); // 0 (matches)
'docs/js.htm'.search(pattern); // -1 (no match)

let match = 'docs/js.txt'.match(pattern);
console.log(match[0]); // "docs/js.txt"
console.log(match[1]); // "js"

'docs/js.txt'.replace(pattern, 'web/$1.htm'); // "web/js.htm"
```

### Use Cases

- Fuzzy matching with `Intl.Collator` (ignore accents)
- Soundex algorithm (match by sound)
- Levenshtein distance (approximate matching)
- Custom DSLs for pattern matching

---

## 7. Symbol.toPrimitive

Control how objects convert to primitive values.

### Conversion Contexts

Your method receives a **hint** argument:

| Hint        | Context                   | Example                          |
| ----------- | ------------------------- | -------------------------------- |
| `"string"`  | String expected/preferred | Template literals, `String(obj)` |
| `"number"`  | Number expected/preferred | `<`, `>`, `-`, `*` operators     |
| `"default"` | Either works              | `+`, `==`, `!=` operators        |

### Default Behavior (Without Symbol.toPrimitive)

- **String context**: Try `toString()`, then `valueOf()`
- **Number context**: Try `valueOf()`, then `toString()`
- **Default context**: Class decides (Date uses toString first, others use valueOf)

### Custom Implementation

```javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'string':
        return `${this.celsius}°C`;
      case 'number':
        return this.celsius;
      case 'default':
        return this.celsius;
    }
  }
}

let temp = new Temperature(25);

console.log(`Temperature: ${temp}`); // "Temperature: 25°C"
console.log(temp + 10); // 35
console.log(temp > 20); // true
console.log(String(temp)); // "25°C"
console.log(Number(temp)); // 25
```

### Comparable Objects

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return `(${this.x}, ${this.y})`;
    }
    // Return distance from origin for comparison
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

let p1 = new Point(3, 4);
let p2 = new Point(1, 1);

console.log(`${p1}`); // "(3, 4)"
console.log(p1 > p2); // true (5 > 1.41)
console.log(p1 + p2); // 6.41... (distances added)
```

---

## 8. Symbol.unscopables

Exclude properties from the `with` statement scope (deprecated feature).

### Purpose

Introduced to maintain backward compatibility when new methods were added to built-in classes like `Array`.

### How It Works

```javascript
let obj = {
  a: 1,
  b: 2,
  [Symbol.unscopables]: {
    b: true, // Exclude 'b' from with scope
  },
};

with (obj) {
  console.log(a); // 1
  console.log(b); // ReferenceError: b is not defined
}
```

### Array Example

Check which Array methods are unscopable:

```javascript
let newArrayMethods = Object.keys(Array.prototype[Symbol.unscopables]);

console.log(newArrayMethods);
// ["copyWithin", "entries", "fill", "find", "findIndex",
//  "flat", "flatMap", "includes", "keys", "values"]
```

**Note**: The `with` statement is deprecated and should not be used in modern code. This Symbol exists only for backward compatibility.

---

## Summary Table

| Symbol                              | Use Case                     | Example                               |
| ----------------------------------- | ---------------------------- | ------------------------------------- |
| `Symbol.iterator`                   | Make iterable                | `for (let x of obj)`                  |
| `Symbol.asyncIterator`              | Async iteration              | `for await (let x of obj)`            |
| `Symbol.hasInstance`                | Custom `instanceof`          | `obj instanceof MyType`               |
| `Symbol.toStringTag`                | Custom type string           | `Object.prototype.toString.call(obj)` |
| `Symbol.species`                    | Control derived constructors | Array subclass methods                |
| `Symbol.isConcatSpreadable`         | Control concat spreading     | `[].concat(obj)`                      |
| `Symbol.match/replace/search/split` | Custom patterns              | `str.match(pattern)`                  |
| `Symbol.toPrimitive`                | Object-to-primitive          | `+obj`, `String(obj)`                 |
| `Symbol.unscopables`                | Exclude from `with`          | Compatibility only                    |

---

## Key Concepts

✅ Well-known Symbols enable **low-level customization** of JavaScript behavior
✅ They allow **safe language extensions** without breaking existing code
✅ Most useful: **iterator**, **toStringTag**, **species**, **toPrimitive**
✅ Pattern-matching Symbols enable **custom DSLs** for string operations
✅ Use `Symbol.species` to control **subclass behavior** of built-in classes
✅ `Symbol.toPrimitive` gives **complete control** over type coercion
✅ Always use Symbols as **property names** with bracket notation: `[Symbol.iterator]`
✅ Well-known Symbols are **shared across all code** (unlike custom Symbols)
