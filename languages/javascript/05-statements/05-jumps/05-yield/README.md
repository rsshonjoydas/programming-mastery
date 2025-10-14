# JavaScript `yield` Statement

The `yield` keyword is used in **generator functions** to pause execution and return a value to the caller. The generator can later be resumed from where it left off.

## Basic Syntax

```javascript
function* generatorFunction() {
  yield value;
}
```

## Key Concepts

**Generator Functions** are declared with `function*` (note the asterisk). When called, they return a generator object but don't execute the function body immediately.

**Pausing & Resuming**: `yield` pauses the function and returns a value. Calling `.next()` on the generator resumes execution from the last `yield`.

## Simple Example

```javascript
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = countToThree();
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }
```

## `yield*` (Delegate to Another Generator)

```javascript
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1(); // Delegates to gen1
  yield 3;
}

const g = gen2();
console.log([...g]); // [1, 2, 3]
```

## Passing Values Back In

```javascript
function* adder() {
  const x = yield 'Give me a number';
  const y = yield 'Give me another';
  return x + y;
}

const gen = adder();
gen.next(); // { value: "Give me a number", done: false }
gen.next(5); // { value: "Give me another", done: false }
gen.next(10); // { value: 15, done: true }
```

## Common Use Cases

- **Lazy evaluation** (generating values on-demand)
- **Infinite sequences**
- **Async iteration** (with async generators)
- **State machines**

That's the essence of `yield`!
