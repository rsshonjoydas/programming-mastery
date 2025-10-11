/*
Logical operators are used to determine the logic between variables or values. To make decisions on multiple conditions.
There are 4 logical operators which include:
  &&	(and operator) With the and operator both conditions or operator have to be true.
  ||	(or operator)  With the or operator only one of the conditions has to be true.
  !	(not operator) The not operator converts true to false and vice-versa.
  ?? (null coalescing)
*/

// These can be applied to values of any type, not just boolean values.
// Expressions are evaluated from left to right.

console.log(10 < 20 && 30 > 15 && 40 > 30); // Must all be true
console.log(10 > 20 || 30 < 15); // Only one has to be true

// && - Will return first falsy value or the last value
// &&, the AND operator
// This returns true if all the operands being evaluated are truthy.
// Consider the four possible logical combinations that can be made when working with two operands.
console.log(true && true); // true
console.log(true && false); // false
console.log(false && true); // false
console.log(false && false); // false

let a;

a = 10 && 20;
a = 10 && 20 && 30;
a = 10 && 0 && 30;
a = 10 && '' && 0 && 30;

console.log(a);

const posts = ['Post One', 'Post Two'];
posts.length > 0 && console.log(posts[0]);

// || - Will return the first truthy value or the last value
// Consider the four possible logical combinations that can be made when working with two operands.
// So as long as one is true, then it will return true.
console.log(true || true); // true
console.log(true || false); // true
console.log(false || true); // true
console.log(false || false); // false

let b;

b = 10 || 20;
b = 0 || 20;
b = 0 || null || '' || undefined;

console.log(b);

// !, the NOT operator
// This will return the inverse of the operand.
console.log(!true); // false

// Another example
let isClosedOnSunday = true;

const isOpen = !isClosedOnSunday;

console.log(isOpen);

// ?? - nullish coalescing operator
// Returns the right side operand when the left is null or undefined

let c;

c = 10 ?? 20;
c = null ?? 20;
c = undefined ?? 30;
c = 0 ?? 30;
c = '' ?? 30;

console.log(c);

let doesValueExist = null;
const result = doesValueExist ?? false;
console.log(result);

// So the ?? operator is syntactic sugar for...
const resultOfExpression = a !== null && a !== undefined ? a : false;
console.log(resultOfExpression);

// Logical operators with non boolean
// Expressions are evaluated from left to right.
// When using logical operators with non-boolean values,
// rather than returning the value of true or false,
// it will return the value of the operand.

// so in the case of || (or operator)
console.log(false || 'John'); // returns 'John'

// So since 'John' is evaluated to truthy, it will be the value returned
// the OR operator returns the first truthy value

// The falsy values in JavaScript are...
// undefined, null, 0, false, '', NaN
// anything else that doesn't fall in this category is considered truthy

console.log(false || 1 || 2); // returns 1
// The JavaScript OR operator, ||, performs short-circuit evaluation.
// Meaning it stops the expression once it can evaluate to 'truthy' or 'falsy'.

// Another example
let usersChosenColor = 'blue';
let defaultColor = 'green';

const currentWebsiteColor = usersChosenColor || defaultColor;
