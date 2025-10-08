# JavaScript Type Conversion

JavaScript has two types of conversion: **implicit (coercion)** and **explicit (casting)**.

## Explicit Conversion

You manually convert types using built-in functions:

**To String:**

```javascript
String(123); // "123"
String(true); // "true"
String(null)(
  // "null"
  123
).toString(); // "123"
```

**To Number:**

```javascript
Number('123'); // 123
Number('12.5'); // 12.5
Number('hello'); // NaN
Number(true); // 1
Number(false); // 0
Number(null); // 0
Number(undefined); // NaN
parseInt('123px'); // 123
parseFloat('12.5em'); // 12.5
```

**To Boolean:**

```javascript
Boolean(1); // true
Boolean(0); // false
Boolean(''); // false
Boolean('hello'); // true
Boolean(null); // false
Boolean(undefined); // false
Boolean({}); // true
Boolean([]); // true
```

## Implicit Conversion (Coercion)

JavaScript automatically converts types in certain operations:

**String Coercion (+):**

```javascript
'5' + 3; // "53" (number to string)
'Hello' + true; // "Hellotrue"
```

**Numeric Coercion (-, \*, /, %):**

```javascript
'5' - 2; // 3 (string to number)
'10' * '2'; // 20
'6' / '2'; // 3
```

**Boolean Coercion:**

```javascript
if ('hello') {
} // truthy
if (0) {
} // falsy
!!'text'; // true (double negation trick)
```

## Falsy Values

These convert to `false`:

- `false`
- `0`, `-0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

Everything else is truthy!

## Common Gotchas

```javascript
[] + []               // "" (empty string)
[] + {}               // "[object Object]"
{} + []               // 0 (depends on context)
true + true           // 2
"5" + null            // "5null"
"5" - null            // 5 (null becomes 0)
```

## Equality Comparisons

**Loose equality (==)** performs type coercion:

```javascript
5 == '5'; // true
null == undefined; // true
0 == false; // true
```

**Strict equality (===)** does NOT coerce:

```javascript
5 === '5'; // false
null === undefined; // false
0 === false; // false
```

**Best practice:** Use `===` to avoid unexpected coercion bugs.

## Key Takeaways

1. Use explicit conversion for clarity and predictability
2. The `+` operator with strings always concatenates
3. Other math operators convert to numbers
4. Avoid relying on implicit coercion—it can be confusing
5. Always use `===` unless you specifically need type coercion
