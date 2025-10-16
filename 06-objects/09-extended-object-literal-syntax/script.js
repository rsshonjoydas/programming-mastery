// =========================================
// JAVASCRIPT EXTENDED OBJECT LITERAL SYNTAX
// =========================================

console.log('=== 1. SHORTHAND PROPERTIES ===\n');

// Before ES6 - repetitive
let x = 1,
  y = 2;
let oldWay = {
  x: x,
  y: y,
};
console.log('Old way (repetitive):', oldWay);

// ES6+ shorthand
let newWay = { x, y };
console.log('ES6+ shorthand:', newWay);
console.log('Sum:', newWay.x + newWay.y);

// Practical example
function createUser(name, age, email) {
  return { name, age, email }; // Clean and concise!
}

let user = createUser('Alice', 30, 'alice@example.com');
console.log('User created with shorthand:', user);

// Mixed usage
let a = 10;
let mixed = {
  a, // Shorthand
  b: 20, // Traditional
  c: a * 2, // Computed value
};
console.log('Mixed syntax:', mixed);

console.log('\n=== 2. COMPUTED PROPERTY NAMES ===\n');

// Before ES6 - two steps
const PROPERTY_NAME = 'p1';
function computePropertyName() {
  return 'p' + 2;
}

let oldComputed = {};
oldComputed[PROPERTY_NAME] = 1;
oldComputed[computePropertyName()] = 2;
console.log('Old way (two steps):', oldComputed);

// ES6+ computed properties
let newComputed = {
  [PROPERTY_NAME]: 1,
  [computePropertyName()]: 2,
};
console.log('ES6+ computed:', newComputed);
console.log('Sum:', newComputed.p1 + newComputed.p2);

// Dynamic property creation
function createObject(key, value) {
  return { [key]: value };
}

console.log('\nDynamic objects:');
console.log('Name:', createObject('name', 'Bob'));
console.log('Age:', createObject('age', 25));
console.log('Email:', createObject('email', 'bob@example.com'));

// Using with library constants (safer code)
const API_KEY = 'apiKey';
const API_SECRET = 'apiSecret';
const API_URL = 'apiUrl';

let config = {
  [API_KEY]: 'abc123',
  [API_SECRET]: 'xyz789',
  [API_URL]: 'https://api.example.com',
};
console.log('\nAPI config with constants:', config);

// Complex expressions
let prefix = 'user';
let userObj = {
  [prefix + 'Name']: 'Charlie',
  [prefix + 'Age']: 35,
  [prefix.toUpperCase() + '_ID']: 12345,
};
console.log('Complex expressions:', userObj);

console.log('\n=== 3. SYMBOLS AS PROPERTY NAMES ===\n');

// Creating symbols
let sym1 = Symbol('test');
let sym2 = Symbol('test');
console.log('sym1 === sym2:', sym1 === sym2); // false - unique!
console.log('sym1 description:', sym1.toString());

// Using symbols as property names
const extension = Symbol('my extension symbol');
const privateData = Symbol('private');

let obj = {
  publicProp: 'visible',
  [extension]: {
    customData: 'extension data',
  },
  [privateData]: 'secret information',
};

console.log('\nObject with symbol properties:', obj);
console.log('Public property:', obj.publicProp);
console.log('Symbol property:', obj[extension]);
console.log('Private data:', obj[privateData]);

// Symbols don't show up in normal enumeration
console.log('\nNormal property keys:', Object.keys(obj));
console.log('Symbol property keys:', Object.getOwnPropertySymbols(obj));

// Safe extension of third-party objects
let thirdPartyObj = { name: 'existing', value: 42 };
const myData = Symbol('myData');
thirdPartyObj[myData] = { custom: 'safe data' };

console.log('\nThird-party object extended safely:');
console.log('Original property:', thirdPartyObj.name);
console.log('My extension:', thirdPartyObj[myData]);

// Well-known symbol example
let iterable = {
  data: [10, 20, 30],
  [Symbol.iterator]() {
    let index = 0;
    let data = this.data;
    return {
      next() {
        return index < data.length
          ? { value: data[index++], done: false }
          : { done: true };
      },
    };
  },
};

console.log('\nIterable object with Symbol.iterator:');
for (let val of iterable) {
  console.log('Value:', val);
}

console.log('\n=== 4. SPREAD OPERATOR ===\n');

// Basic spreading
let position = { x: 0, y: 0 };
let dimensions = { width: 100, height: 75 };
let rect = { ...position, ...dimensions };

console.log('Position:', position);
console.log('Dimensions:', dimensions);
console.log('Rectangle (spread):', rect);
console.log('Total:', rect.x + rect.y + rect.width + rect.height);

// Property override - last value wins
let o = { x: 1 };
let p = { x: 0, ...o };
let q = { ...o, x: 2 };

console.log('\nProperty override:');
console.log('p.x (o overrides):', p.x);
console.log('q.x (2 overrides o):', q.x);

// Only own properties are spread
let parent = { inherited: 'value' };
let child = Object.create(parent);
child.own = 'own value';

let spread = { ...child };
console.log('\nSpread only copies own properties:');
console.log('child.inherited:', child.inherited);
console.log('child.own:', child.own);
console.log('spread.inherited:', spread.inherited); // undefined!
console.log('spread.own:', spread.own);

// Merging configurations
let defaults = { timeout: 5000, retries: 3, verbose: false };
let userConfig = { timeout: 10000, verbose: true };
let finalConfig = { ...defaults, ...userConfig };

console.log('\nMerging configs:');
console.log('Defaults:', defaults);
console.log('User config:', userConfig);
console.log('Final config:', finalConfig);

// Shallow copy
let original = { a: 1, b: 2, nested: { c: 3 } };
let copy = { ...original };
copy.a = 99;
copy.nested.c = 999; // Modifies original (shallow copy!)

console.log('\nShallow copy:');
console.log('original.a:', original.a); // 1 (unchanged)
console.log('original.nested.c:', original.nested.c); // 999 (changed!)

// Adding properties while spreading
let base = { x: 1, y: 2 };
let extended = { ...base, z: 3, label: 'point' };
console.log('\nExtended object:', extended);

console.log('\n=== 5. SHORTHAND METHODS ===\n');

// Before ES6
let oldSquare = {
  area: function () {
    return this.side * this.side;
  },
  perimeter: function () {
    return 4 * this.side;
  },
  side: 10,
};
console.log('Old method syntax - area:', oldSquare.area());

// ES6+ shorthand
let newSquare = {
  area() {
    return this.side * this.side;
  },
  perimeter() {
    return 4 * this.side;
  },
  side: 10,
};
console.log('Shorthand method - area:', newSquare.area());
console.log('Shorthand method - perimeter:', newSquare.perimeter());

// Advanced method names
const METHOD_NAME = 'multiply';
const symbolMethod = Symbol('symbolMethod');

let calculator = {
  'method With Spaces'(x) {
    return x + 1;
  },
  [METHOD_NAME](a, b) {
    return a * b;
  },
  [symbolMethod](x) {
    return x * x;
  },
  divide(a, b) {
    return b !== 0 ? a / b : 'Error: Division by zero';
  },
};

console.log('\nAdvanced method names:');
console.log('Method with spaces:', calculator['method With Spaces'](5));
console.log('Computed name:', calculator[METHOD_NAME](3, 4));
console.log('Symbol method:', calculator[symbolMethod](7));
console.log('Regular method:', calculator.divide(10, 2));

console.log('\n=== 6. PROPERTY GETTERS AND SETTERS ===\n');

// Basic accessor properties
let person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  },
};

console.log('Person:', person);
console.log('Full name (getter):', person.fullName);

person.fullName = 'Jane Smith';
console.log('\nAfter setting full name:');
console.log('First name:', person.firstName);
console.log('Last name:', person.lastName);
console.log('Full name:', person.fullName);

// Cartesian to Polar coordinates
let point = {
  x: 1.0,
  y: 1.0,

  get r() {
    return Math.hypot(this.x, this.y);
  },

  set r(newValue) {
    let oldValue = Math.hypot(this.x, this.y);
    let ratio = newValue / oldValue;
    this.x *= ratio;
    this.y *= ratio;
  },

  get theta() {
    return Math.atan2(this.y, this.x);
  },
};

console.log('\nCartesian point:', { x: point.x, y: point.y });
console.log('Polar - radius:', point.r);
console.log('Polar - theta:', point.theta);
console.log('Theta in degrees:', (point.theta * 180) / Math.PI);

point.r = 2;
console.log('\nAfter setting r = 2:');
console.log('New x:', point.x);
console.log('New y:', point.y);
console.log('New r:', point.r);

// Inheritance of accessors
let point3D = Object.create(point);
point3D.x = 3;
point3D.y = 4;
point3D.z = 5;

console.log('\n3D point (inherits r and theta):');
console.log('point3D.x:', point3D.x);
console.log('point3D.y:', point3D.y);
console.log('point3D.z:', point3D.z);
console.log('point3D.r (inherited):', point3D.r);
console.log('point3D.theta (inherited):', point3D.theta);

// Validation with setters
const serialNumber = {
  _n: 0,

  get next() {
    return this._n++;
  },

  set next(n) {
    if (n > this._n) {
      this._n = n;
    } else {
      throw new Error('serial number can only be set to a larger value');
    }
  },
};

console.log('\nSerial number generator:');
serialNumber.next = 10;
console.log('Set to 10');
console.log('Next:', serialNumber.next); // 10
console.log('Next:', serialNumber.next); // 11
console.log('Next:', serialNumber.next); // 12

try {
  serialNumber.next = 5; // Will throw error
} catch (e) {
  console.log('Error:', e.message);
}

// Random number generator
const random = {
  get octet() {
    return Math.floor(Math.random() * 256);
  },
  get uint16() {
    return Math.floor(Math.random() * 65536);
  },
  get int16() {
    return Math.floor(Math.random() * 65536) - 32768;
  },
};

console.log('\nRandom number generators:');
console.log('Random octet (0-255):', random.octet);
console.log('Random uint16 (0-65535):', random.uint16);
console.log('Random int16 (-32768 to 32767):', random.int16);

// Read-only property
let circle = {
  radius: 5,

  get area() {
    return Math.PI * this.radius * this.radius;
  },

  get circumference() {
    return 2 * Math.PI * this.radius;
  },
};

console.log('\nCircle (read-only properties):');
console.log('Radius:', circle.radius);
console.log('Area:', circle.area);
console.log('Circumference:', circle.circumference);

circle.radius = 10;
console.log('\nAfter changing radius to 10:');
console.log('New area:', circle.area);
console.log('New circumference:', circle.circumference);

console.log('\n=== 7. COMBINING ALL FEATURES ===\n');

const ID = Symbol('id');
const SECRET = Symbol('secret');

function createAdvancedUser(username, email, age) {
  return {
    // Shorthand properties
    username,
    email,
    age,

    // Symbol properties
    [ID]: Math.random().toString(36).substr(2, 9),
    [SECRET]: 'hidden-data',

    // Computed property
    [username.toUpperCase()]: true,

    // Shorthand method
    greet() {
      return `Hello, I'm ${this.username}`;
    },

    // Getter/Setter
    get info() {
      return `${this.username} (${this.email}) - ${this.age} years old`;
    },

    set info(str) {
      const [name, emailPart, agePart] = str.split(/[()]+/);
      this.username = name.trim();
      this.email = emailPart.trim();
      this.age = parseInt(agePart);
    },
  };
}

let advancedUser = createAdvancedUser('techuser', 'tech@example.com', 28);

console.log('Advanced user created:');
console.log('Username:', advancedUser.username);
console.log('Email:', advancedUser.email);
console.log('Greeting:', advancedUser.greet());
console.log('Info (getter):', advancedUser.info);
console.log('ID (symbol):', advancedUser[ID]);
console.log('Has symbol secret:', SECRET in advancedUser);

// Spread and extend
let baseUser = { role: 'user', active: true };
let extendedUser = {
  ...baseUser,
  ...advancedUser,
  permissions: ['read', 'write'],
};

console.log('\nExtended user with spread:');
console.log('Role:', extendedUser.role);
console.log('Active:', extendedUser.active);
console.log('Permissions:', extendedUser.permissions);

console.log('\n=== 8. PERFORMANCE COMPARISON ===\n');

// Inefficient: O(n²) with spread in loop
console.log('Demonstrating spread performance consideration:');
console.time('Spread in loop (inefficient)');
let inefficient = {};
for (let i = 0; i < 1000; i++) {
  inefficient = { ...inefficient, [`key${i}`]: i };
}
console.timeEnd('Spread in loop (inefficient)');

// Efficient: O(n) with direct assignment
console.time('Direct assignment (efficient)');
let efficient = {};
for (let i = 0; i < 1000; i++) {
  efficient[`key${i}`] = i;
}
console.timeEnd('Direct assignment (efficient)');

console.log('Both objects have', Object.keys(inefficient).length, 'properties');

console.log('\n=== COMPLETE! ===');
console.log('All extended object literal syntax features demonstrated!');
