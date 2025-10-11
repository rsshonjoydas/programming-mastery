/*
Programming is powerful as it enables us to execute different code based on conditions.
This is what enables us to provide dynamic and personalized applications to end users.

The fundamental programming concept that enables this is conditional statements.
More specifically, if-else statements.

Conditional Statements:
Definition and Usage
The if/else statement executes a block of code if a specified condition is true. If the condition is false, another block of code can be executed.

The if/else statement is a part of JavaScript's "Conditional" Statements, which are used to perform different actions based on different conditions.

In JavaScript we have the following conditional statements:
  Use "if" to specify a block of code to be executed, if a specified condition is true
  Use "else" to specify a block of code to be executed, if the same condition is false
  Use "else if" to specify a new condition to test, if the first condition is false
  Use "switch" to select one of many blocks of code to be executed

Syntax:
The if statement specifies a block of code to be executed if a condition is true:
if (condition) {
  block of code to be executed if the condition is true
}

The else statement specifies a block of code to be executed if the condition is false:
if (condition) {
  block of code to be executed if the condition is true
} else {
  block of code to be executed if the condition is false
}
*/

// If Statement Syntax
if (true) {
  console.log('This is true');
}

// Evaluation expressions
const x = 10;
const y = 5;

if (x >= y) {
  console.log(`${x} is greater than or equal to ${y}`);
}

if (x === y) {
  console.log(`${x} is equal to ${y}`);
} else {
  console.log(`${x} is NOT equal to ${y}`);
}

let i = (j = 1),
  k = 2;
if (i === j) {
  if (j === k) console.log('i equals k');
  else console.log("i doesn't equal j");
}

// Block scope
if (x !== y) {
  const z = 20;
  console.log(`${z} is 20`);
}

// console.log(z); // Throw error

// Shorthand If/Else
if (x >= y)
  console.log(`${x} is greater than or equal to ${y}`),
    console.log('This is true');
else console.log('This is false');
