// for ([initialExpression]; [conditionExpression]; [incrementExpression])
//   statement;

// INITIAL EXPRESSION - Initializes a variable/counter
// CONDITION EXPRESSION - Condition that the loop will continue to run as long as it is met or until the condition is false
// INCREMENT EXPRESSION - Expression that will be executed after each iteration of the loop. Usually increments the variable
// STATEMENT - Code that will be executed each time the loop is run. To execute a `block` of code, use the `{}` syntax

// for (let index = 0; index <= 5; index++) {
//   console.log(index);
// }

// let index = 0;
// for (; ; index++) {
//   if (index <= 5) {
//     console.log(index);
//   } else {
//     break;
//   }
// }

// for (let i = 0; i <= 10; i++) {
//   if (i === 7) {
//     console.log('7 is my lucky number');
//   } else {
//     console.log('Number ' + i);
//   }
// }

// sum of 5 (1,2,3,4,5) numbers
let i,
  j,
  sum = 0;
for (i = 0, j = 5; i < 5; i++, j--) {
  sum += i * j;
}
console.log(sum);

// Nested loops
// for (let i = 1; i <= 10; i++) {
//   console.log('Number ' + i);

//   for (let j = 1; j <= 5; j++) {
//     console.log(`${i} * ${j} = ${i * j}`);
//   }
// }

// Loop through an array
const names = ['Ram', 'Sita', 'John', 'Tim'];

for (let i = 0; i < names.length; i++) {
  if (names[i] === 'John') {
    console.log(names[i] + ' is the best');
  } else {
    console.log(names[i]);
  }
}

// for loop to traverse a linked list data structure and return the last object in the list.
function tail(o) {
  // Return the tail of linked list o
  for (; o.next; o = o.next /* empty */); // Traverse while o.next is truthy
  return o;
}

// Infinite loops will cause your program to crash.
// You want to ensure within your loops that you are progressively
// getting closer to your condition being false as to terminate the loop.
