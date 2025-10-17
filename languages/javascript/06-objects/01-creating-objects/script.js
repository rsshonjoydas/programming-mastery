// ==========================
// JAVASCRIPT OBJECT CREATION
// ==========================

console.log('=== 1. OBJECT LITERALS ===\n');

// Basic object literal
let empty = {};
console.log('Empty object:', empty);

let point = { x: 0, y: 0 };
console.log('Point object:', point);

// Complex property names and values
let book = {
  'main title': 'JavaScript',
  'sub-title': 'The Definitive Guide',
  for: 'all audiences', // Reserved word
  author: {
    firstName: 'John',
    surname: 'Doe',
  },
  pages: 1000,
};
console.log('Book object:', book);
console.log('Book main title:', book['main title']);

// Computed property values
let p2 = {
  x: point.x,
  y: point.y + 1,
};
console.log('Computed point:', p2);

// Dynamic evaluation - creates new object each time
function createPoint(x, y) {
  return { x: x, y: y };
}
let p1 = createPoint(1, 2);
let p3 = createPoint(1, 2);
console.log('p1 === p3?', p1 === p3); // false - different objects

console.log("\n=== 2. USING 'new' OPERATOR ===\n");

// Built-in constructors
let o = new Object();
let a = new Array();
let d = new Date();
let m = new Map();
let s = new Set();

console.log('new Object():', o);
console.log('new Array():', a);
console.log('new Date():', d);

// Custom constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  };
}

let person1 = new Person('Bob', 25);
console.log('Person created with constructor:', person1);
console.log(person1.greet());

// ES6 Class (syntactic sugar for constructors)
class Animal {
  constructor(species, sound) {
    this.species = species;
    this.sound = sound;
  }

  makeSound() {
    return `${this.species} says ${this.sound}`;
  }
}

let dog = new Animal('Dog', 'Woof');
console.log('Animal created with class:', dog);
console.log(dog.makeSound());

console.log('\n=== 3. Object.create() ===\n');

// Basic inheritance
let parent = { x: 1, y: 2 };
let child = Object.create(parent);
child.z = 3;

console.log('Parent object:', parent);
console.log('Child object (own properties):', child);
console.log('Child.x (inherited):', child.x);
console.log('Child.z (own):', child.z);

// Creating object with no prototype
let noProto = Object.create(null);
noProto.name = 'No Prototype';
console.log('Object with no prototype:', noProto);
console.log('Has toString?', noProto.toString); // undefined

// Creating empty object like {}
let emptyLike = Object.create(Object.prototype);
console.log('Object.create(Object.prototype):', emptyLike);

// With property descriptors
let obj = Object.create(Object.prototype, {
  name: {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  age: {
    value: 30,
    writable: false, // Read-only
    enumerable: true,
    configurable: true,
  },
});

console.log('Object with descriptors:', obj);
console.log('Trying to change read-only age:');
obj.age = 40;
console.log('Age after attempt:', obj.age); // Still 30

console.log('\n=== 4. PROTOTYPES ===\n');

// Understanding prototypes
let arr = [1, 2, 3];
console.log('Array prototype:', Object.getPrototypeOf(arr) === Array.prototype);
console.log(
  "Array.prototype's prototype:",
  Object.getPrototypeOf(Array.prototype) === Object.prototype
);

// Custom prototype chain
let animal = {
  eats: true,
  walk() {
    console.log('Animal walks');
  },
};

let rabbit = Object.create(animal);
rabbit.jumps = true;

console.log('Rabbit eats (inherited)?', rabbit.eats);
console.log('Rabbit jumps (own)?', rabbit.jumps);
console.log("Rabbit has own 'eats'?", rabbit.hasOwnProperty('eats'));
console.log("Rabbit has own 'jumps'?", rabbit.hasOwnProperty('jumps'));

// Prototype chain
console.log('\nPrototype chain:');
console.log('rabbit -> animal:', Object.getPrototypeOf(rabbit) === animal);
console.log(
  'animal -> Object.prototype:',
  Object.getPrototypeOf(animal) === Object.prototype
);
console.log(
  'Object.prototype -> null:',
  Object.getPrototypeOf(Object.prototype) === null
);

console.log('\n=== 5. USE CASE: GUARDING AGAINST MODIFICATIONS ===\n');

let original = {
  x: "don't change this value",
  y: 42,
};

// Simulate a library function that might modify the object
function libraryFunction(obj) {
  obj.x = 'modified!';
  obj.newProp = 'added property';
  console.log('Inside library function:', obj);
}

// Pass a protective wrapper instead
let wrapper = Object.create(original);
console.log('Original before:', original);
libraryFunction(wrapper);
console.log('Original after:', original);
console.log('Wrapper has newProp:', wrapper.newProp);

console.log('\n=== 6. COMPARISON OF METHODS ===\n');

// Object literal
let literal = { name: 'Literal', type: 'object literal' };

// new Object()
let newObj = new Object();
newObj.name = 'New Object';
newObj.type = 'new operator';

// Constructor
function Product(name) {
  this.name = name;
  this.type = 'constructor';
}
let product = new Product('Product');

// Class
class Item {
  constructor(name) {
    this.name = name;
    this.type = 'class';
  }
}
let item = new Item('Item');

// Object.create()
let proto = { type: 'Object.create' };
let created = Object.create(proto);
created.name = 'Created';

console.log('Literal:', literal);
console.log('New Object:', newObj);
console.log('Constructor:', product);
console.log('Class:', item);
console.log('Object.create:', created);

console.log('\n=== 7. PRACTICAL EXAMPLES ===\n');

// Configuration object (use literal)
let config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};
console.log('Config:', config);

// User objects (use class)
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
  }

  getInfo() {
    return `${this.username} (${this.email})`;
  }
}

let user1 = new User('alice', 'alice@example.com');
let user2 = new User('bob', 'bob@example.com');
console.log('User 1:', user1.getInfo());
console.log('User 2:', user2.getInfo());

// Object composition (use Object.create)
let canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  },
};

let canWalk = {
  walk() {
    return `${this.name} is walking`;
  },
};

// Combine behaviors
let person = Object.create(canEat);
Object.assign(person, canWalk);
person.name = 'John';

console.log(person.eat('pizza'));
console.log(person.walk());

console.log('\n=== COMPLETE! ===');
console.log('All object creation methods demonstrated successfully!');
