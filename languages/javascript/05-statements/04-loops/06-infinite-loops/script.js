/*
Infinite loop -> DON"T DO THIS

A infinite loop executes infinity or forever.
If we create such a loop we may crash the browser or the computer.
*/

// If we forget to increment i we loop runs forever.
let i = 0;
while (i < 5) {
  console.log(i);
  // i++
}

// while and do...while loop condition is true
// while (true) {
//   console.log("I'm looping forever!");
// }

// do {
//   console.log("I'm looping forever!");
// } while (true);

// This is an example of an infinity for loop, the condition i > 0 is always true, so the loop will never end.
for (i = 1; i > 0; i++) {
  console.log(i);
}

// This is an example of an infinity for loop, because we are not incrementing i
for (i = 1; i > 0; ) {
  console.log(i);
}

for (;;) {
  console.log("I'm looping forever!");
}
