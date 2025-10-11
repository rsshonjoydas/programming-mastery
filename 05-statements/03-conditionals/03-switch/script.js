/*
Switch-case statements can also be used for control flow.
The difference between if-else statements and switch-case statements
is that switch-case statements are only used for equality comparisons.

Definition and Usage
The switch statement executes a block of code depending on different cases.
The switch statement is a part of JavaScript's "Conditional" Statements, which are used to perform different actions based on different conditions.
Use switch to select one of many blocks of code to be executed. This is the perfect solution for long, nested if/else statements.
The switch statement evaluates an expression. The value of the expression is then compared with the values of each case in the structure.
If there is a match, the associated block of code is executed.
The switch statement is often used together with a break or a default keyword (or both). These are both optional:
  The break keyword breaks out of the switch block. This will stop the execution of more execution of code and/or case testing inside the block.
    If break is omitted, the next code block in the switch statement is executed.
  The default keyword specifies some code to run if there is no case match. There can only be one default keyword in a switch.
    Although this is optional, it is recommended that you use it, as it takes care of unexpected cases.

switch (n) {
  case 1: // Start here if n === 1
    // Execute code block #1.
    break; // Stop here
  case 2: // Start here if n === 2
    // Execute code block #2.
    break; // Stop here
  case 3: // Start here if n === 3
    // Execute code block #3.
    break; // Stop here
  default: // If all else fails...
    // Execute code block #4.
    break; // Stop here
}
*/

let role = 'guest';

switch (role) {
  case 'guest':
    console.log('Guest user');
    break;
  case 'moderator':
    console.log('moderator user');
    break;
  default:
    console.log('Unknown user');
}

let job = 'Software Developer';

if (job === 'Software Developer') {
  console.log('Writes code');
} else if (job === 'Designer') {
  console.log('Makes user interface documents');
} else if (job === 'Cloud Engineer') {
  console.log('Manages and deploys cloud resources');
} else {
  console.log('Works directly with customers');
}

// Since we doing equality comparisons, this can be hard to read and repetitive.
// So in this case, we could use the switch-case statements.

switch (job) {
  case 'Software Developer':
    console.log('Writes code');
    break;
  case 'Designer':
    console.log('Makes user interface documents');
    break;
  case 'Cloud Engineer':
    console.log('Manages and deploys cloud resources');
    break;
  default:
    console.log('Works directly with customers');
}

// more examples
const d = new Date(2022, 1, 10, 19, 0, 0);
const month = d.getMonth();
const hour = d.getHours();

// Immediate value evaluation
switch (month) {
  case 1:
    console.log('It is January');
    break;
  case 2:
    console.log('It is February');
    break;
  case 3:
    console.log('It is March');
    break;
  default:
    console.log('It is not Jan, Feb or March');
}

// Range evaluation
switch (true) {
  case hour < 12:
    console.log('Good Morning');
    break;
  case hour < 18:
    console.log('Good Afternoon');
    break;
  default:
    console.log('Good Night');
}

// converts a value to a string
function convert(x) {
  switch (typeof x) {
    case 'number': // Convert the number to a hexadecimal integer
      return x.toString(16);
    case 'string': // Return the string enclosed in quotes
      return '"' + x + '"';
    default: // Convert any other type in the usual way
      return String(x);
  }
}

// calculator
function calculator(num1, num2, operator) {
  let result;

  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      result = num1 / num2;
      break;
    default:
      result = 'Invalid Operator';
  }

  console.log(result);
  return result;
}

calculator(5, 2, '&');
