let x;

// Coerced to a string
x = 3 + '6'; // => "36": Number 6 converts to a string

x = 3 + Number('6'); // => 9: Number '6' convert to a number

// Coerced to a number
x = 3 * '6'; // => 18: number '6' convert ot a number
x = '3' * '6'; // => 18: both strings convert to numbers

// null is coerced to 0 as it is a `falsy` value
x = Number(null); // => 0: null convert to 0
x = 5 + null; // => 5: null convert to 0
x = 1 - 'x'; // n == NaN; string "x" can't convert to a number
x = x + ' objects'; // => "NaN objects": NaN converts to string "NaN"

// true is coerced to a 1
x = 5 + true; // => 6: true convert to a 1

// false is coerced to 0 (falsy)
x = 5 + false; // => 5: false convert to a 0

// Undefined is coerced to 0 (falsy)
x = 5 + undefined; // => NaN

// Conversions and Equality
x = null == undefined; // => true: These two values are treated as equal.
x = '0' == 0; // => true: String converts to a number before comparing.
x = 0 == false; // => true: Boolean converts to number before comparing.
x = '0' == false; // => true: Both operands convert to 0 before comparing!

x = null === undefined; // => false
x = '0' === 0; // => false
x = 0 === false; // => false
x = '0' === false; // => false

// Explicit Conversions
// The simplest way to perform an explicit type conversion is to use the
// Boolean(), Number(), and String() functions:
x = Number('3'); // => 3
x = String(false); // => "false":  Or use false.toString()
x = Boolean([]); // => true

x = 1 + {}; // => "1[object Object]": concatenation after object-to-string
x = true + true; // => 2: addition after boolean-to-number
x = 2 + null; // => 2: addition after null converts to 0
x = 2 + undefined; // => NaN: addition after undefined converts to NaN

let n = 17;
x = '0b' + n.toString(2); // binary == "0b10001"
x = '0o' + n.toString(8); // octal == "0o21"
x = '0x' + n.toString(16); // hex == "0x11"

let number = 123456.789;
x = number.toFixed(0); // => "123457"
x = number.toFixed(2); // => "123456.79"
x = number.toFixed(5); // => "123456.78900"
x = number.toExponential(1); // => "1.2e+5"
x = number.toExponential(3); // => "1.235e+5"
x = number.toPrecision(4); // => "1.235e+5"
x = number.toPrecision(7); // => "123456.8"
x = number.toPrecision(10); // => "123456.7890"

x = parseInt('3 blind mice'); // => 3
x = parseFloat(' 3.14 meters'); // => 3.14
x = parseInt('-12.34'); // => -12
x = parseInt('0xFF'); // => 255
x = parseInt('0xff'); // => 255
x = parseInt('-0XFF'); // => -255
x = parseFloat('.1'); // => 0.1
x = parseInt('0.1'); // => 0
x = parseInt('.1'); // => NaN: integers can't start with "."
x = parseFloat('$72.47'); // => NaN: numbers can't start with "$"

x = parseInt('11', 2); // => 3: (1*2 + 1)
x = parseInt('ff', 16); // => 255: (15*16 + 15)
x = parseInt('zz', 36); // => 1295: (35*36 + 35)
x = parseInt('077', 8); // => 63: (7*8 + 7)
x = parseInt('077', 10); // => 77: (7*10 + 7)

// Object to Primitive Conversions
// The JavaScript specification defines three fundamental algorithms for converting objects to primitive values:
/**
- prefer-string
    This algorithm returns a primitive value, preferring a string value,
    if a conversion to string is possible.
- prefer-number
    This algorithm returns a primitive value, preferring a number, if
    such a conversion is possible.
- no-preference
    This algorithm expresses no preference about what type of
    primitive value is desired, and classes can define their own
    conversions. Of the built-in JavaScript types, all except Date
    implement this algorithm as prefer-number. The Date class
    implements this algorithm as prefer-string.
 */

x = [1, 2, 3].toString(); // => "1,2,3"

x = function (x) {
  f(x);
}.toString(); // => "function(x) { f(x); }"

x = /\d+/g.toString(); // => "/\\d+/g"

let d = new Date(2020, 0, 1);
x = d.toString(); // => "Wed Jan 01 2020 00:00:00 GMT-0800 (Pacific Standard Time)"
x = d.valueOf(); // => 1262332800000

// OBJECT-TO-PRIMITIVE CONVERSION ALGORITHMS

/**
- The prefer-string algorithm first tries the toString()
    method. If the method is defined and returns a primitive value,
    then JavaScript uses that primitive value (even if it is not a
    string!). If toString() does not exist or if it returns an
    object, then JavaScript tries the valueOf() method. If that
    method exists and returns a primitive value, then JavaScript
    uses that value. Otherwise, the conversion fails with a TypeError.
- The prefer-number algorithm works like the prefer-string
    algorithm, except that it tries valueOf() first and toString() second.
- The no-preference algorithm depends on the class of the
    object being converted. If the object is a Date object, then
    JavaScript uses the prefer-string algorithm. For any other
    object, JavaScript uses the prefer-number algorithm.
*/

console.log(x, typeof x);
