let x, str;

// String literals
const name = 'John';
x = typeof name; // 'string'
const age = 31;

// Multi-line strings
str = 'two\nlines'; // 2 lines on 1 line
str =
  'one\
  long\
  line'; // 1 line written on 3 lines

// Template Literals
str = `the newline character at the end of this line
is included literally in this string`; // Multi-line with backticks

// Tagged template literals
str = `\n`.length; // => 1: single newline character
str = String.raw`\n`.length; // => 2: backslash + letter n

// Concatenation
x = 'Hello, my name is ' + name + ' and I am ' + age + ' years old';
x = `Hello, my name is ${name} and I am ${age} years old`; // Template literal

// String Properties and Methods
const s = 'Hello, world';

x = typeof s; // 'string'
x = s.length; // 12
x = s[0]; // 'H' - Array-like access
x = s.__proto__; // Shows prototype with all methods

// Concatenation methods
let fName = 'John';
let lName = 'Doe';
let fullName = fName + ' ' + lName;
fullName = fName.concat(' ', lName);
fName += ' something else'; // Append

// Obtaining portions
x = s.substring(1, 4); // "ell"
x = s.slice(1, 4); // "ell"
x = s.slice(-3); // "rld" - last 3 characters
x = s.split(', '); // ["Hello", "world"]
x = s.split(' ').join('-'); // "Hello,-world" - Method chaining

// Searching
x = s.indexOf('l'); // 2 - first 'l'
x = s.indexOf('l', 3); // 3 - first 'l' at/after position 3
x = s.indexOf('zz'); // -1 - not found
x = s.lastIndexOf('l'); // 10 - last 'l'

// Boolean searching (ES6+)
x = s.startsWith('Hell'); // true
x = s.endsWith('!'); // false
x = s.includes('or'); // true

// Modifying (returns new string)
x = s.replace('llo', 'y'); // "Hey, world"
x = s.toLowerCase(); // "hello, world"
x = s.toUpperCase(); // "HELLO, WORLD"
x = s.normalize(); // Unicode NFC normalization
x = s.normalize('NFD'); // NFD normalization

// Inspecting characters
x = s.charAt(0); // "H"
x = s.charAt(s.length - 1); // "d"
x = s.charCodeAt(0); // 72 - 16-bit number
x = s.codePointAt(0); // 72 - works for codepoints > 16 bits

// Padding (ES2017)
x = 'x'.padStart(3); // "  x"
x = 'x'.padEnd(3); // "x  "
x = 'x'.padStart(3, '*'); // "**x"
x = 'x'.padEnd(3, '-'); // "x--"

// Trimming (ES5/ES2019)
x = ' test '.trim(); // "test"
x = ' test '.trimStart(); // "test " (also trimLeft)
x = ' test '.trimEnd(); // " test" (also trimRight)

// Miscellaneous
x = s.concat('!'); // "Hello, world!" (use + instead)
x = '<>'.repeat(5); // "<><><><><>"
x = s.valueOf(); // Returns primitive value

// Practical Examples
const email = 'john@gmail.com';
const username2 = 'John Doe';

// Extract parts using slice + indexOf
firstName = username2.slice(0, username2.indexOf(' '));
lastName = username2.slice(username2.indexOf(' ') + 1);
let username = email.slice(0, email.indexOf('@'));
let extension = email.slice(email.indexOf('@') + 1);

/*
String Extraction Methods Comparison:

1) slice(start, end)
   - Accepts negative indexes (count from end)
   - str.slice(-12, -6) // "Banana"
   - str.slice(7) // "Banana, Kiwi"

2) substring(start, end)
   - Similar to slice but NO negative indexes
   - str.substring(7, 13) // "Banana"

3) substr(start, length) [DEPRECATED]
   - Second parameter = length (not end position)
   - str.substr(7, 6) // "Banana"
*/

// Method Chaining Example
let username3 = '  john  ';

// Without chaining
username3 = username3.trim();
let letter = username3.charAt(0).toUpperCase();
let extraChars = username3.slice(1).toLowerCase();
username3 = letter + extraChars; // "John"

// With chaining (cleaner)
username3 =
  username3.trim().charAt(0).toUpperCase() +
  username3.trim().slice(1).toLowerCase(); // "John"

// REMEMBER: Strings are immutable - methods return NEW strings!
