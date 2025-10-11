/*
// if/else statements
if (n === 1) {
  // Execute code block #1
} else if (n === 2) {
  // Execute code block #2
} else if (n === 3) {
  // Execute code block #3
} else {
  // If all else fails, execute block #4
}

// nested if/else statements
if (n === 1) {
  // Execute code block #1
} else {
  if (n === 2) {
    // Execute code block #2
  } else {
    if (n === 3) {
      // Execute code block #3
    } else {
      // If all else fails, execute block #4
    }
  }
}
*/

const d = new Date(10, 30, 2022, 6, 0, 0);
const hour = d.getHours();

if (hour < 12) {
  console.log('Good Morning');
} else if (hour < 18) {
  console.log('Good Afternoon');
} else {
  console.log('Good Night');
}

// Nested If
if (hour < 12) {
  console.log('Good Morning');

  if (hour === 6) {
    console.log('Wake Up!');
  }
} else if (hour < 18) {
  console.log('Good Afternoon');
} else {
  console.log('Good Night');

  if (hour >= 20) {
    console.log('zzzzzzzz');
  }
}

if (hour >= 7 && hour < 15) {
  console.log('It is work time!');
}

if (hour === 6 || hour === 20) {
  console.log('Brush your teeth!');
}
