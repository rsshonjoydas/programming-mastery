/*
For...of

Definition and Usage
The for/of statement loops through the values of an iterable object.

JavaScript supports different kinds of loops:
  for - loops through a block of code a number of times
  for/in - loops through the properties of an object
  for/of - loops through the values of an iterable object
  while - loops through a block of code while a specified condition is true
  do/while - loops through a block of code once, and then repeats the loop while a specified condition is true

Syntax:
for (variable of iterable) {
  code block to be executed
}

variable:
Required. For every iteration the value of the next property is assigned to the variable. Variable can be declared with const, let, or var.

iterable:
Required. An object that has iterable properties
*/

let cars = ['BMW', 'Volvo', 'Mini'];
for (let car of cars) {
  console.log('The car is ' + car);
}

let colors = ['red', 'blue', 'green', 'yellow'];
for (let color in colors) {
  console.log('The color is ' + color);
}

// Loop through arrays
const items = ['book', 'table', 'chair', 'kite'];
const users = [{ name: 'Shonjoy' }, { name: 'Kate' }, { name: 'Steve' }];

// for (const item of items) {
//   console.log(item);
// }

for (const user of users) {
  console.log(user.name);
}

let data = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  sum = 0;
for (let element of data) {
  sum += element;
}

console.log(sum); // => 45

// Objects are not (by default) iterable. Attempting to use for/of on a
//  regular object throws a TypeError at runtime:
/*
let o = { x: 1, y: 2, z: 3 };
for (let element of o) {
  // Throws TypeError because o is not
  iterable;
  console.log(element);
}
*/

//  If you want to iterate through the properties of an object, you can use
//  the for/in loop, or use for/of with the Object.keys() method:
let o = { x: 1, y: 2, z: 3 };
let keys = '';
for (let k of Object.keys(o)) {
  keys += k;
}
console.log(keys); // => "xyz"

{
  let sum = 0;
  for (let v of Object.values(o)) {
    sum += v;
  }
  console.log(sum); // => 6
}

let pairs = '';
for (let [k, v] of Object.entries(o)) {
  pairs += k + v;
}
console.log(pairs); // => x1y2z3

// for/of with strings
const str = 'Hello World';

for (const letter of str) {
  console.log(letter);
}

let frequency = {};
for (let letter of 'mississippi') {
  if (frequency[letter]) {
    frequency[letter]++;
  } else {
    frequency[letter] = 1;
  }
}
console.log(frequency); // => { m: 1, i: 4, s: 4, p: 2 }

// for/of with Set and Map
let text = 'Na na na na na na na na Batman!';
let wordSet = new Set(text.split(' '));
let unique = [];
for (let word of wordSet) {
  unique.push(word);
}
console.log(
  unique // => ["Na", "na", "Batman!"]
);

const map = new Map();
map.set('name', 'John');
map.set('age', 30);

for (const [key, value] of map) {
  console.log(key, value);
}

// ASYNCHRONOUS ITERATION WITH FOR/AWAIT
// Read chunks from an asynchronously iterable stream and print them out
async function printStream(stream) {
  for await (let chunk of stream) {
    console.log(chunk);
  }
}

// printStream('Hello, World!');
