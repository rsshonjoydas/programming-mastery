# Logical Assignment Operators

Logical assignment operators combine logical operations with assignment. They provide a shorthand way to conditionally assign values.

## `||=` (Logical OR Assignment)

Assigns the right side value **only if the left is a falsy value**.

```javascript
let a = null;

// Long form
if (!a) {
  a = 10;
}

// Medium form
a = a || 10;

// Short form (best)
a ||= 10;

console.log(a); // 10
```

**Falsy values:** `false`, `0`, `""`, `null`, `undefined`, `NaN`

## `&&=` (Logical AND Assignment)

Assigns the right side value **only if the left is a truthy value**.

```javascript
let b = 10;

// Long form
if (b) {
  b = 20;
}

// Medium form
b = b && 20;

// Short form (best)
b &&= 20;

console.log(b); // 20
```

**Truthy values:** Everything that's not falsy

## `??=` (Nullish Coalescing Assignment)

Assigns the right side value **only if the left is `null` or `undefined`**.

```javascript
let c = null;

// Long form
if (c === null || c === undefined) {
  c = 20;
}

// Medium form
c = c ?? 20;

// Short form (best)
c ??= 20;

console.log(c); // 20
```

**Key difference from `||=`:** Only checks for `null`/`undefined`, not all falsy values (like `0` or `""`).

## Comparison

| Operator | Assigns when left side is...                           |
| -------- | ------------------------------------------------------ |
| `\|\|=`  | Falsy (`false`, `0`, `""`, `null`, `undefined`, `NaN`) |
| `&&=`    | Truthy (any value that's not falsy)                    |
| `??=`    | `null` or `undefined` only                             |

## When to Use

- **`||=`** - Set default values for any falsy input
- **`&&=`** - Update existing truthy values
- **`??=`** - Set defaults but preserve falsy values like `0` or `""`
