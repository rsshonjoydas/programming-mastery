/*
While Loop
Definition and Usage
The while statement creates a loop that is executed while a specified condition is true.
The loop will continue to run as long as the condition is true. It will only stop when the condition becomes false.
JavaScript supports different kinds of loops:
  for - loops through a block of code a number of times
  for/in - loops through the properties of an object
  for/of - loops through the values of an iterable object
  while - loops through a block of code while a specified condition is true
  do/while - loops through a block of code once, and then repeats the loop while a specified condition is true

Tip: Use the break statement to break out of a loop, and the continue statement to skip a value in the loop.

Syntax
while (condition) {
  code block to be executed
}

condition:
Required. Defines the condition for running the loop (the code block).
If it returns true, the loop will start over again, if it returns false, the loop will end.

Note: If the condition is always true, the loop will never end. This will crash your browser.
Note: If you are using a variable with the condition, initialize it before the loop, and increment it within the loop.
If you forget to increase the variable, the loop will never end. This will also crash your browser.
*/

console.log('While loop 1');
let i = 0;
while (i <= 5) {
  let text = 'The number is ' + i;
  console.log(text);
  i++;
}

console.log('While loop 2');
let index = 0;
while (index <= 10) {
  if (index % 2 !== 0) {
    let text = 'Index is odd ' + index;
    console.log(text);
  }
  index++;
}

// Loop over arrays
const arr = [10, 20, 30, 40, 50];

// We use for loops when we know the exact number of times that we want the loop to execute.
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// There's another way to perform loops, which is the while-loop.
// You would use the while-loop when you know which condition
// must be true, to perform the loop, but not the exact number of times
// you want the loop to be performed.

while (i < arr.length) {
  console.log(arr[i]);
  i++;
}

let sum = 0;
while (true) {
  console.log('Loop');
  sum++;

  if (sum === 10) break;
}

function printArray(a) {
  let len = a.length,
    i = 0;
  if (len === 0) {
    console.log('Empty Array');
  } else {
    do {
      console.log(a[i]);
    } while (++i < len);
  }
}

// Nesting while loops
while (i <= 5) {
  console.log('Number ' + i);

  let j = 1;
  while (j <= 5) {
    console.log(`${i} * ${j} = ${i * j}`);
    j++;
  }

  i++;
}
