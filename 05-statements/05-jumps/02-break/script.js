/*
Break statement definition and usage:
The break statement exits a switch statement or a loop (for, for ... in, while, do ... while).
When the break statement is used with a switch statement, it breaks out of the switch block.
This will stop the execution of more execution of code and/or case testing inside the block.
When the break statement is used in a loop, it breaks the loop and continues executing the code after the loop (if any).
The break statement can also be used with an optional label reference, to "jump out" of any JavaScript code block (see "More Examples" below).
Note: Without a label reference, the break statement can only be used inside a loop or a switch.

Syntax:

break;

Using the optional label reference:
break label name;
*/

// Break
for (let i = 0; i <= 20; i++) {
  if (i === 15) {
    console.log('Breaking...');
    break;
  }
  console.log(i);
}

// In loops, there may be specific conditions where you will want to terminate the loop.
// This is where you would use the break statement.

// Starting with the break keyword

// break statement in the for loop
for (let i = 0; i < 10; i++) {
  if (i === 5) break;

  console.log(i);
}

// break statement in the while loop
let i = 0;
while (i < 10) {
  if (i === 5) break;

  console.log(i);

  i++;
}

// break statement in the do-while loop
let doWhileIdx = 0;
do {
  if (doWhileIdx === 5) break;

  console.log(doWhileIdx);

  doWhileIdx++;
} while (doWhileIdx < 10);

// break statement in the for-in loop
let object = { a: 1, b: 2, c: 3 };
for (const key in object) {
  if (key === 'b') break;

  console.log(object[key]);
}

// break statement in the for-of loop
const array = [1, 2, 3, 4, 5];
for (let element of array) {
  if (element === 3) break;

  console.log(array[element]);
}
