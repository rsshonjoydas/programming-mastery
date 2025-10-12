/*
For...in

Definition and Usage
The for/in statement loops through the properties of an object.
The block of code inside the loop will be executed once for each property.

JavaScript supports different kinds of loops:
  for - loops through a block of code a number of times
  for/in - loops through the properties of an object
  for/of - loops through the values of an iterable object
  while - loops through a block of code while a specified condition is true
  do/while - loops through a block of code once, and then repeats the loop while a specified condition is true

Note: Do not use the for/in statement to loop through arrays where index order is important. Use the for statement instead.

Syntax:

for (variable in object) {
  code block to be executed
}

variable:
Required. A variable that iterates over the properties of an object
In each iteration the variable will be assign a property.

object:
Required. The specified object that will be iterated
*/

let person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 25,
};

for (let key in person) {
  console.log(key);
  console.log('The key is ' + key + ' and the value is ' + person[key]);
}

// We can also use the for...in loop in array but it is best to use the for...of loop. We are going to use the for...in loop for demo.

let colors = ['red', 'blue', 'green', 'yellow'];

for (let index in colors) {
  console.log(index);
  console.log('The color in index ' + index + ' is ' + colors[index]);
}

// Loop through objects
const colorObj = {
  color1: 'red',
  color2: 'blue',
  color3: 'orange',
  color4: 'green',
};

for (const key in colorObj) {
  console.log(key, colorObj[key]);
}

// Loop through arrays
const colorArr = ['red', 'green', 'blue', 'yellow'];

for (const key in colorArr) {
  console.log(colorArr[key]);
}

// for in
const obj = {
  name: 'JavaScript',
  estd: '1995',
  founder: 'Brendan Eich',
};

for (property in obj) {
  // Assign property names of obj to variable property
  console.log(property); // Print the value of each property
}

const arr = [1, 2, 3, 4, 5];

for (property in arr) {
  console.log(property);
}

// copy the names of all object properties into an array:
let o = { x: 1, y: 2, z: 3 };
let a = [],
  i = 0;
for (a[i++] in o /* empty */);
console.log(a); // => [ 'x', 'y', 'z' ]

for (let i in a) console.log(i); // => 0 1 2
