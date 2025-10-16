// =========================
// JAVASCRIPT OBJECT METHODS
// =========================

console.log('=== 1. toString() METHOD ===\n');

// Default toString() - not very useful
let basicObj = { x: 1, y: 1 };
console.log('Default toString():', basicObj.toString()); // "[object Object]"

// Custom toString() implementation
let point = {
  x: 1,
  y: 2,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
};

console.log('Custom toString():', point.toString());
console.log('String concatenation:', 'Point: ' + point);
console.log('String() conversion:', String(point));

// Built-in toString() implementations
console.log('\nBuilt-in toString() examples:');
console.log('Array:', [1, 2, 3].toString());
console.log('Function:', function test() {}.toString());
console.log('Date:', new Date().toString());
console.log('Number:', (42).toString());

console.log('\n=== 2. toLocaleString() METHOD ===\n');

// Number localization
let num = 1234567.89;
console.log('Number (US):', num.toLocaleString('en-US'));
console.log('Number (Germany):', num.toLocaleString('de-DE'));
console.log('Number (France):', num.toLocaleString('fr-FR'));

// Date localization
let date = new Date();
console.log('\nDate (US):', date.toLocaleString('en-US'));
console.log('Date (UK):', date.toLocaleString('en-GB'));
console.log('Date (Japan):', date.toLocaleString('ja-JP'));

// Array localization
console.log('\nArray:', [1000, 2000, 3000].toLocaleString());

// Custom toLocaleString()
let localizedPoint = {
  x: 1000,
  y: 2000,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
  toLocaleString: function () {
    return `(${this.x.toLocaleString()}, ${this.y.toLocaleString()})`;
  },
};

console.log('\nCustom toString():', localizedPoint.toString());
console.log('Custom toLocaleString():', localizedPoint.toLocaleString());

// Currency formatting
let price = 1234.56;
console.log(
  '\nCurrency (USD):',
  price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
);
console.log(
  'Currency (EUR):',
  price.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
);

console.log('\n=== 3. valueOf() METHOD ===\n');

// Default valueOf() - returns the object itself
let obj = { x: 1 };
console.log('Default valueOf():', obj.valueOf() === obj);

// Built-in valueOf() implementations
let dateObj = new Date(2025, 0, 1);
console.log('Date valueOf():', dateObj.valueOf()); // milliseconds

let numObj = new Number(42);
console.log('Number valueOf():', numObj.valueOf());

// Custom valueOf() - distance from origin
let vectorPoint = {
  x: 3,
  y: 4,
  valueOf: function () {
    return Math.hypot(this.x, this.y); // sqrt(x² + y²)
  },
};

console.log('\nPoint valueOf():', vectorPoint.valueOf());
console.log('Number conversion:', Number(vectorPoint));
console.log('Comparison (> 4):', vectorPoint > 4);
console.log('Comparison (> 5):', vectorPoint > 5);
console.log('Comparison (< 6):', vectorPoint < 6);
console.log('Arithmetic (+ 10):', vectorPoint + 10);

// Type coercion with both valueOf and toString
let mixed = {
  valueOf: function () {
    return 100;
  },
  toString: function () {
    return '50';
  },
};

console.log('\nMixed object:');
console.log('Arithmetic uses valueOf (+ 5):', mixed + 5);
console.log('String conversion uses toString:', String(mixed));
console.log('Template literal uses toString:', `Value: ${mixed}`);

console.log('\n=== 4. toJSON() METHOD ===\n');

// Built-in toJSON() - Date
let jsonDate = new Date(2025, 0, 1);
console.log('Date toJSON():', jsonDate.toJSON());
console.log('Date JSON.stringify():', JSON.stringify(jsonDate));

// Custom toJSON() - basic
let jsonPoint = {
  x: 1,
  y: 2,
  toString: function () {
    return `(${this.x}, ${this.y})`;
  },
  toJSON: function () {
    return this.toString();
  },
};

console.log('\nPoint JSON.stringify():', JSON.stringify(jsonPoint));
console.log('Point array:', JSON.stringify([jsonPoint, jsonPoint]));

// Custom toJSON() - exclude sensitive data
let user = {
  name: 'Alice',
  password: 'secret123',
  email: 'alice@example.com',
  role: 'admin',
  toJSON: function () {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      // password excluded for security
    };
  },
};

console.log('\nUser (with sensitive data hidden):');
console.log(JSON.stringify(user, null, 2));

// toJSON() with custom formatting
let product = {
  id: 101,
  name: 'Laptop',
  price: 999.99,
  stock: 50,
  toJSON: function () {
    return {
      productId: this.id,
      productName: this.name,
      displayPrice: `$${this.price.toFixed(2)}`,
      available: this.stock > 0,
    };
  },
};

console.log('\nProduct formatted:');
console.log(JSON.stringify(product, null, 2));

console.log('\n=== 5. hasOwnProperty() METHOD ===\n');

let parent = { x: 1, y: 2 };
let child = Object.create(parent);
child.z = 3;

console.log('Child object:', child);
console.log("child.hasOwnProperty('z'):", child.hasOwnProperty('z'));
console.log("child.hasOwnProperty('x'):", child.hasOwnProperty('x'));
console.log("'x' in child:", 'x' in child);
console.log("'z' in child:", 'z' in child);

// Filtering own properties
console.log('\nOwn properties only:');
for (let prop in child) {
  if (child.hasOwnProperty(prop)) {
    console.log(`  ${prop}: ${child[prop]}`);
  }
}

console.log('\n=== 6. propertyIsEnumerable() METHOD ===\n');

let enumObj = { a: 1, b: 2 };
Object.defineProperty(enumObj, 'c', {
  value: 3,
  enumerable: false,
});

console.log(
  "enumObj.propertyIsEnumerable('a'):",
  enumObj.propertyIsEnumerable('a')
);
console.log(
  "enumObj.propertyIsEnumerable('c'):",
  enumObj.propertyIsEnumerable('c')
);
console.log(
  "enumObj.propertyIsEnumerable('toString'):",
  enumObj.propertyIsEnumerable('toString')
);

console.log('\nEnumerating properties:');
for (let prop in enumObj) {
  console.log(`  ${prop}: ${enumObj[prop]}`);
}
console.log("'c' exists but not enumerable:", enumObj.c);

console.log('\n=== 7. isPrototypeOf() METHOD ===\n');

let ancestor = { a: 1 };
let descendant = Object.create(ancestor);

console.log(
  'ancestor.isPrototypeOf(descendant):',
  ancestor.isPrototypeOf(descendant)
);
console.log(
  'Object.prototype.isPrototypeOf(descendant):',
  Object.prototype.isPrototypeOf(descendant)
);
console.log(
  'Array.prototype.isPrototypeOf(descendant):',
  Array.prototype.isPrototypeOf(descendant)
);

console.log('\n=== 8. STATIC OBJECT METHODS ===\n');

let staticObj = { a: 1, b: 2, c: 3 };

// Object.keys()
console.log('Object.keys():', Object.keys(staticObj));

// Object.values()
console.log('Object.values():', Object.values(staticObj));

// Object.entries()
console.log('Object.entries():', Object.entries(staticObj));

// Object.assign()
let target = { a: 1 };
let source1 = { b: 2 };
let source2 = { c: 3 };
Object.assign(target, source1, source2);
console.log('Object.assign() result:', target);

// Object.create()
let proto = { x: 10 };
let created = Object.create(proto);
created.y = 20;
console.log('Object.create() - created.x:', created.x);
console.log('Object.create() - created.y:', created.y);

// Object.freeze()
let frozen = { x: 1 };
Object.freeze(frozen);
frozen.x = 2; // Fails silently
frozen.y = 3; // Fails silently
console.log('Object.freeze() - frozen.x still:', frozen.x);

// Object.seal()
let sealed = { x: 1 };
Object.seal(sealed);
sealed.x = 2; // OK
sealed.y = 3; // Fails
console.log('Object.seal() - sealed.x modified:', sealed.x);
console.log('Object.seal() - sealed.y:', sealed.y);

// Object.getPrototypeOf()
let protoCheck = {};
console.log(
  'Object.getPrototypeOf({}) === Object.prototype:',
  Object.getPrototypeOf(protoCheck) === Object.prototype
);

console.log('\n=== 9. DEFINING CUSTOM METHODS ===\n');

// Traditional function property
let calc1 = {
  add: function (a, b) {
    return a + b;
  },
};
console.log('Traditional syntax - calc1.add(5, 3):', calc1.add(5, 3));

// ES6 shorthand
let calc2 = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
};

console.log('ES6 shorthand - calc2.add(10, 5):', calc2.add(10, 5));
console.log('ES6 shorthand - calc2.subtract(10, 5):', calc2.subtract(10, 5));
console.log('ES6 shorthand - calc2.multiply(10, 5):', calc2.multiply(10, 5));

// Arrow function (caveat: no 'this' binding)
let arrowObj = {
  value: 10,
  regular: function () {
    return this.value;
  },
  arrow: () => {
    return this.value; // 'this' is not arrowObj!
  },
};

console.log('\nArrow function caveat:');
console.log('Regular function:', arrowObj.regular());
console.log("Arrow function (wrong 'this'):", arrowObj.arrow());

console.log("\n=== 10. THE 'this' KEYWORD ===\n");

let person = {
  name: 'Alice',
  age: 30,
  greet: function () {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  },
  haveBirthday: function () {
    this.age++;
    return this; // For chaining
  },
};

console.log(person.greet());
person.haveBirthday();
console.log('After birthday:', person.age);

// Context loss example
console.log('\nContext loss:');
let greetFunc = person.greet;
try {
  console.log(greetFunc()); // 'this' is undefined or global
} catch (e) {
  console.log('Error:', e.message);
}

// Solution: bind()
let boundGreet = person.greet.bind(person);
console.log('With bind():', boundGreet());

console.log('\n=== 11. METHOD CHAINING ===\n');

let calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // Enable chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  multiply(n) {
    this.value *= n;
    return this;
  },
  divide(n) {
    this.value /= n;
    return this;
  },
  getResult() {
    return this.value;
  },
  reset() {
    this.value = 0;
    return this;
  },
};

let result = calculator.add(10).subtract(3).multiply(2).divide(2).getResult();

console.log('Chained calculation result:', result);

// Another example: String builder
let builder = {
  str: '',
  append(text) {
    this.str += text;
    return this;
  },
  appendLine(text) {
    this.str += text + '\n';
    return this;
  },
  clear() {
    this.str = '';
    return this;
  },
  toString() {
    return this.str;
  },
};

let message = builder
  .appendLine('Hello World!')
  .appendLine('This is a test.')
  .append('End of message.')
  .toString();

console.log('\nString builder result:');
console.log(message);

console.log('\n=== 12. PRACTICAL EXAMPLES ===\n');

// Example 1: Counter object
let counter = {
  count: 0,
  increment() {
    this.count++;
    return this;
  },
  decrement() {
    this.count--;
    return this;
  },
  reset() {
    this.count = 0;
    return this;
  },
  getValue() {
    return this.count;
  },
  toString() {
    return `Counter: ${this.count}`;
  },
};

counter.increment().increment().increment();
console.log('Counter:', counter.toString());

// Example 2: Rectangle with methods
let rectangle = {
  width: 10,
  height: 5,

  getArea() {
    return this.width * this.height;
  },

  getPerimeter() {
    return 2 * (this.width + this.height);
  },

  scale(factor) {
    this.width *= factor;
    this.height *= factor;
    return this;
  },

  toString() {
    return `Rectangle(${this.width}x${this.height})`;
  },

  toJSON() {
    return {
      shape: 'rectangle',
      dimensions: { width: this.width, height: this.height },
      area: this.getArea(),
      perimeter: this.getPerimeter(),
    };
  },
};

console.log('\nRectangle:', rectangle.toString());
console.log('Area:', rectangle.getArea());
console.log('Perimeter:', rectangle.getPerimeter());
rectangle.scale(2);
console.log('After scaling:', rectangle.toString());
console.log('JSON:', JSON.stringify(rectangle, null, 2));

// Example 3: Temperature converter
let temperature = {
  celsius: 0,

  setCelsius(c) {
    this.celsius = c;
    return this;
  },

  setFahrenheit(f) {
    this.celsius = ((f - 32) * 5) / 9;
    return this;
  },

  getCelsius() {
    return this.celsius;
  },

  getFahrenheit() {
    return (this.celsius * 9) / 5 + 32;
  },

  getKelvin() {
    return this.celsius + 273.15;
  },

  toString() {
    return `${this.celsius.toFixed(1)}°C / ${this.getFahrenheit().toFixed(1)}°F / ${this.getKelvin().toFixed(1)}K`;
  },
};

temperature.setCelsius(25);
console.log('\nTemperature:', temperature.toString());

temperature.setFahrenheit(100);
console.log('After setting to 100°F:', temperature.toString());

console.log('\n=== COMPLETE! ===');
console.log('All object methods concepts demonstrated successfully!');
