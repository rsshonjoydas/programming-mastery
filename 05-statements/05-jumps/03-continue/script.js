/*
Continue statement definition and usage
The continue statement breaks one iteration (in the loop) if a specified condition occurs, and continues with the next iteration in the loop.
The difference between continue and the break statement, is instead of "jumping out" of a loop, the continue statement "jumps over" one iteration in the loop.
However, when the continue statement is executed, it behaves differently for different types of loops:
  In a while loop, the condition is tested, and if it is true, the loop is executed again
  In a for loop, the increment expression (e.g. i++) is first evaluated, and then the condition is tested to find out if another iteration should be done

The continue statement can also be used with an optional label reference.
Note: The continue statement (with or without a label reference) can only be used inside a loop.

Syntax:
continue;

Using the optional label reference:
continue label name;
*/
for (let i = 0; i <= 20; i++) {
  if (i === 13) {
    console.log('Skipping 13...');
    continue;
  }
  console.log(i);
}

// There may also be times when you want to skip to the next iteration of the loop,
// which is where you would use the continue statement.

// Now let us consider the continue keyword

// continue statement in the for loop
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;

  console.log(i);
}

// continue statement in the while loop
let whileLoopIdx = 0;
while (whileLoopIdx <= 10) {
  if (whileLoopIdx % 2 === 0) {
    whileLoopIdx++;
    continue;
  }
  console.log('While loop - The index is ' + whileLoopIdx);
  whileLoopIdx++;
}

// continue statement in the do-while loop
doWhileIdx = 0;
do {
  if (doWhileIdx % 2 === 0) {
    doWhileIdx++;
    continue;
  }

  console.log(doWhileIdx);

  doWhileIdx++;
} while (doWhileIdx < 10);

// continue statement in the for-in loop
object = { a: 1, b: 2, c: 3, d: 4 };

for (const key in object) {
  if (object[key] % 2 === 0) continue;

  console.log(object[key]);
}

// continue statement in the for-of loop
for (let element of array) {
  if (element % 2 === 0) continue;

  console.log(array[element]);
}
