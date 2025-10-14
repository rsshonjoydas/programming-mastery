let x;

const num = new Number(5);

// toString() - returns a string representation of the number
x = num.toString();
// To get the length
x = num.toString().length;

// toFixed() - returns a string representation of the number with a specified number of decimals
x = num.toFixed(2);

// toPrecision() - returns a number with the specified length
x = num.toPrecision(3);

// toExponential() -  convert a number to exponential notation and return its value as a string
x = num.toExponential(2);

// toLocaleString() - returns a string representation of the number, using the current locale
x = num.toLocaleString('en-US');

// valueOf - Get value
x = num.valueOf();

// The Number object itself has some properties and methods

// Division by zero is not an error in JavaScript: it simply returns infinity or negative infinity. JavaScript predefines global constants Infinity and NaN to hold the positive infinity and not-a-number value, and these values are also available as properties of the Number object:

// Positive infinity number
x = Infinity; // A positive number too big to represent
x = Number.POSITIVE_INFINITY; // Same value
x = 1 / 0; // => Infinity
x = Number.MAX_VALUE * 2; // => Infinity; overflow

// Negative infinity number
x = -Infinity; // A negative number too big to represent
x = Number.NEGATIVE_INFINITY; // The same value
x = -1 / 0; // => -Infinity
x = -Number.MAX_VALUE * 2; // => -Infinity

// NaN = The not-a-number value
x = NaN; // The not-a-number value
x = Number.NaN; // The same value, written another way
x = 0 / 0; // => NaN
x = Infinity / Infinity; // => NaN
x = -1 / Infinity; // -> -0: also negative 0-0

// Largest and smallest possible number
x = Number.MAX_VALUE;
x = Number.MIN_VALUE;
x = Number.MIN_VALUE / 2; // => 0: underflow
x = -Number.MIN_VALUE / 2; // => -0: negative zero

// The following Number properties are defined in ES6
x = Number.parseInt('3.6'); // => 3: Same as the global parseInt() function
x = Number.parseFloat('3.6'); // => 3.6: Same as the global parseFloat() function
x = Number.isNaN(3); // => false: Is x the NaN value?
x = Number.isFinite(3); // true: Is x a number and finite?
x = Number.isInteger(3); // => true: Is x an integer?
x = Number.isSafeInteger(3); // => true: Is x an integer -(2**53) < x < 2**53?
x = Number.MIN_SAFE_INTEGER; // => -9007199254740991 or -(2**53 - 1)
x = Number.MAX_SAFE_INTEGER; // => 9007199254740991 or 2**53 - 1
x = Number.EPSILON; // => 2**-52 or 2.220446049250313e-16: smallest difference between numbers

let zero = 0; // Regular zero
let negZero = -0; // Negative zero
x = zero === negZero; // => true: zero and negative zero are equal
x = 1 / zero === 1 / negZero; // => false: Infinity and -Infinity are not equal

// Binary Floating-Point and Rounding Errors
let m = 0.3 - 0.2; // => 0.09999999999999998: thirty cents minus 20 cents
let n = 0.2 - 0.1; // => 0.1: twenty cents minus 10 cents
x = m === n; // => false: the two values are not the same!
x = m === 0.1; // => false: .3-.2 is not equal to .1
x = n === 0.1; // => true: .2-.1 is equal to .1

// Arbitrary Precision Integers with BigInt
x = 1234n; // A not-so-big BigInt literal
x = 0b111111n; // A binary BigInt
x = 0o7777n; // An octal BigInt
x = 0x8000000000000000n; // => 2n**63n: A 64-bit integer

x = BigInt(Number.MAX_SAFE_INTEGER); // => 9007199254740991n
let string = '1' + '0'.repeat(100); // 1 followed by 100 zeros
x = BigInt(string); // => 10n**100n: one googol

x = 1000n + 2000n; // => 3000n
x = 3000n - 2000n; // => 1000n
x = 2000n * 3000n; // => 6000000n
x = 3000n / 997n; // => 3n: the quotient is 3
x = 3000n % 997n; // => 9n: and the remainder is 9
x = 2n ** 131071n - 1n; // A Mersenne prime with 39457 decimal digits

x = 1 < 2n; // => true
x = 2 > 1n; // => true
x = 0 == 0n; // => true
x = 0 === 0n; // => false: the === checks for type equality as well

console.log(x);

console.log(Number(true));
console.log(Number(false));
console.log(Number(' 10'));
console.log(Number(' 10 '));
console.log(Number('10.25'));
