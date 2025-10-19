// =====================
// JAVASCRIPT SUBCLASSES
// =====================

console.log('=== 1. PRE-ES6: SUBCLASSING WITH PROTOTYPES ===\n');

// Define Range class (superclass)
function Range(from, to) {
  this.from = from;
  this.to = to;
}

Range.prototype.includes = function (x) {
  return x >= this.from && x <= this.to;
};

Range.prototype.toString = function () {
  return `[${this.from}...${this.to}]`;
};

// Create Span subclass the old way
function Span(start, span) {
  if (span >= 0) {
    this.from = start;
    this.to = start + span;
  } else {
    this.to = start;
    this.from = start + span;
  }
}

// KEY: Make Span.prototype inherit from Range.prototype
Span.prototype = Object.create(Range.prototype);
Span.prototype.constructor = Span;

// Override toString()
Span.prototype.toString = function () {
  return `(${this.from}... +${this.to - this.from})`;
};

console.log('Testing pre-ES6 subclass:');
let range = new Range(1, 5);
let span = new Span(2, 3);

console.log('range:', range.toString());
console.log('range includes 3?', range.includes(3));
console.log('span:', span.toString());
console.log('span includes 3?', span.includes(3)); // Inherited method
console.log('span instanceof Span:', span instanceof Span);
console.log('span instanceof Range:', span instanceof Range);

console.log('\n=== 2. ES6: SIMPLE SUBCLASS WITH extends ===\n');

class EZArray extends Array {
  get first() {
    return this[0];
  }
  get last() {
    return this[this.length - 1];
  }
}

let a = new EZArray();
console.log('a instanceof EZArray:', a instanceof EZArray);
console.log('a instanceof Array:', a instanceof Array);

a.push(1, 2, 3, 4);
console.log('After push(1,2,3,4):', Array.from(a));
console.log('a.pop():', a.pop());
console.log('a.first:', a.first);
console.log('a.last:', a.last);
console.log('a[1]:', a[1]);
console.log('Array.isArray(a):', Array.isArray(a));
console.log('EZArray.isArray(a):', EZArray.isArray(a));

// Static method inheritance
console.log('\nStatic method inheritance:');
console.log('Array.isPrototypeOf(EZArray):', Array.isPrototypeOf(EZArray));
console.log(
  'Array.prototype.isPrototypeOf(EZArray.prototype):',
  Array.prototype.isPrototypeOf(EZArray.prototype)
);

console.log('\n=== 3. USING super IN CONSTRUCTOR ===\n');

class TypedMap extends Map {
  constructor(keyType, valueType, entries) {
    // Type-check initial entries
    if (entries) {
      for (let [k, v] of entries) {
        if (typeof k !== keyType || typeof v !== valueType) {
          throw new TypeError(`Wrong type for entry [${k}, ${v}]`);
        }
      }
    }

    // Call superclass constructor
    super(entries);

    // Initialize subclass state
    this.keyType = keyType;
    this.valueType = valueType;
    console.log(`Created TypedMap<${keyType}, ${valueType}>`);
  }

  // Override set() method
  set(key, value) {
    // Type checking
    if (this.keyType && typeof key !== this.keyType) {
      throw new TypeError(`${key} is not of type ${this.keyType}`);
    }
    if (this.valueType && typeof value !== this.valueType) {
      throw new TypeError(`${value} is not of type ${this.valueType}`);
    }

    // Call superclass method
    return super.set(key, value);
  }
}

console.log('Testing TypedMap:');
let map = new TypedMap('string', 'number');
map.set('age', 30);
map.set('score', 95);
console.log("map.get('age'):", map.get('age'));
console.log('map.size:', map.size);

try {
  map.set('name', 'Alice'); // Wrong value type
} catch (e) {
  console.log('Error caught:', e.message);
}

try {
  map.set(123, 456); // Wrong key type
} catch (e) {
  console.log('Error caught:', e.message);
}

console.log('\n=== 4. CONSTRUCTOR RULES ===\n');

// Rule 1: Must call super() before using this
console.log('Rule 1: Must call super() before using this');

class Parent {
  constructor(name) {
    this.name = name;
  }
}

class GoodChild extends Parent {
  constructor(name, age) {
    super(name); // Call super first
    this.age = age; // Then use this
  }
}

let good = new GoodChild('Alice', 25);
console.log('GoodChild instance:', good);

// Rule 2: Auto-generated constructor
console.log('\nRule 2: Auto-generated constructor');

class AutoChild extends Parent {
  // No constructor defined - automatically created
}

let auto = new AutoChild('Bob');
console.log('AutoChild instance:', auto);

// Rule 3: new.target
console.log('\nRule 3: new.target in constructors');

class Logger {
  constructor() {
    console.log(`  Constructor called: ${new.target.name}`);
  }
}

class SubLogger extends Logger {
  constructor() {
    super();
  }
}

console.log('Creating Logger:');
new Logger();
console.log('Creating SubLogger:');
new SubLogger();

console.log('\n=== 5. USING super IN METHODS ===\n');

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  move() {
    return `${this.name} moves`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    // Call superclass method
    let parentSound = super.speak();
    return `${parentSound}. Woof!`;
  }

  // Can call super at any point
  describe() {
    return `${super.move()} on four legs. Breed: ${this.breed}`;
  }
}

let dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.speak());
console.log(dog.describe());

console.log('\n=== 6. COMPOSITION OVER INHERITANCE ===\n');

// Instead of extending Set, use delegation
class Histogram {
  constructor() {
    this.map = new Map(); // Delegate to Map
  }

  count(key) {
    return this.map.get(key) || 0;
  }

  has(key) {
    return this.count(key) > 0;
  }

  get size() {
    return this.map.size;
  }

  add(key) {
    this.map.set(key, this.count(key) + 1);
  }

  delete(key) {
    let count = this.count(key);
    if (count === 1) {
      this.map.delete(key);
    } else if (count > 1) {
      this.map.set(key, count - 1);
    }
  }

  [Symbol.iterator]() {
    return this.map.keys();
  }

  keys() {
    return this.map.keys();
  }
  values() {
    return this.map.values();
  }
  entries() {
    return this.map.entries();
  }
}

console.log('Testing Histogram (composition):');
let hist = new Histogram();
hist.add('apple');
hist.add('banana');
hist.add('apple');
hist.add('apple');
hist.add('banana');

console.log('histogram instanceof Map:', hist instanceof Map); // false
console.log('histogram instanceof Histogram:', hist instanceof Histogram); // true
console.log("Count of 'apple':", hist.count('apple'));
console.log("Count of 'banana':", hist.count('banana'));
console.log('Size:', hist.size);
console.log('Keys:', Array.from(hist.keys()));
console.log('Entries:', Array.from(hist.entries()));

hist.delete('apple');
console.log("After delete, count of 'apple':", hist.count('apple'));

console.log('\n=== 7. ABSTRACT CLASSES ===\n');

// Base abstract class
class AbstractSet {
  has(x) {
    throw new Error("Abstract method 'has' must be implemented");
  }
}

// Concrete subclass 1: NotSet
class NotSet extends AbstractSet {
  constructor(set) {
    super();
    this.set = set;
  }

  has(x) {
    return !this.set.has(x);
  }

  toString() {
    return `{ x| x ∉ ${this.set.toString()} }`;
  }
}

// Concrete subclass 2: RangeSet
class RangeSet extends AbstractSet {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
  }

  has(x) {
    return x >= this.from && x <= this.to;
  }

  toString() {
    return `{ x| ${this.from} ≤ x ≤ ${this.to} }`;
  }
}

console.log('Testing abstract class implementations:');
let rangeSet = new RangeSet(1, 10);
console.log('RangeSet:', rangeSet.toString());
console.log('5 in RangeSet?', rangeSet.has(5));
console.log('15 in RangeSet?', rangeSet.has(15));

let notSet = new NotSet(rangeSet);
console.log('NotSet:', notSet.toString());
console.log('5 in NotSet?', notSet.has(5));
console.log('15 in NotSet?', notSet.has(15));

console.log('\n=== 8. CLASS HIERARCHY ===\n');

// Abstract enumerable set
class AbstractEnumerableSet extends AbstractSet {
  get size() {
    throw new Error("Abstract method 'size' must be implemented");
  }

  [Symbol.iterator]() {
    throw new Error("Abstract method 'iterator' must be implemented");
  }

  isEmpty() {
    return this.size === 0;
  }

  toString() {
    return `{${Array.from(this).join(', ')}}`;
  }

  equals(set) {
    if (!(set instanceof AbstractEnumerableSet)) return false;
    if (this.size !== set.size) return false;

    for (let element of this) {
      if (!set.has(element)) return false;
    }

    return true;
  }
}

// Singleton set
class SingletonSet extends AbstractEnumerableSet {
  constructor(member) {
    super();
    this.member = member;
  }

  has(x) {
    return x === this.member;
  }

  get size() {
    return 1;
  }

  *[Symbol.iterator]() {
    yield this.member;
  }
}

// Abstract writable set
class AbstractWritableSet extends AbstractEnumerableSet {
  insert(x) {
    throw new Error("Abstract method 'insert' must be implemented");
  }

  remove(x) {
    throw new Error("Abstract method 'remove' must be implemented");
  }

  add(set) {
    for (let element of set) {
      this.insert(element);
    }
  }

  subtract(set) {
    for (let element of set) {
      this.remove(element);
    }
  }

  intersect(set) {
    for (let element of this) {
      if (!set.has(element)) {
        this.remove(element);
      }
    }
  }
}

// Concrete BitSet
class BitSet extends AbstractWritableSet {
  constructor(max) {
    super();
    this.max = max;
    this.n = 0;
    this.numBytes = Math.floor(max / 8) + 1;
    this.data = new Uint8Array(this.numBytes);
  }

  _valid(x) {
    return Number.isInteger(x) && x >= 0 && x <= this.max;
  }

  _has(byte, bit) {
    return (this.data[byte] & BitSet.bits[bit]) !== 0;
  }

  has(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      return this._has(byte, bit);
    }
    return false;
  }

  insert(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      if (!this._has(byte, bit)) {
        this.data[byte] |= BitSet.bits[bit];
        this.n++;
      }
    } else {
      throw new TypeError('Invalid set element: ' + x);
    }
  }

  remove(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x / 8);
      let bit = x % 8;
      if (this._has(byte, bit)) {
        this.data[byte] &= BitSet.masks[bit];
        this.n--;
      }
    } else {
      throw new TypeError('Invalid set element: ' + x);
    }
  }

  get size() {
    return this.n;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i <= this.max; i++) {
      if (this.has(i)) {
        yield i;
      }
    }
  }
}

BitSet.bits = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
BitSet.masks = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);

console.log('Testing class hierarchy:');

// SingletonSet
let singleton = new SingletonSet(42);
console.log('\nSingletonSet:', singleton.toString());
console.log('Size:', singleton.size);
console.log('Has 42?', singleton.has(42));
console.log('Has 10?', singleton.has(10));
console.log('isEmpty?', singleton.isEmpty());

// BitSet
let bitset = new BitSet(100);
bitset.insert(1);
bitset.insert(10);
bitset.insert(100);
bitset.insert(50);

console.log('\nBitSet:', bitset.toString());
console.log('Size:', bitset.size);
console.log('Has 10?', bitset.has(10));
console.log('Has 20?', bitset.has(20));

// Set operations
let bitset2 = new BitSet(100);
bitset2.insert(50);
bitset2.insert(75);

console.log('\nBitSet2:', bitset2.toString());

bitset.add(bitset2); // Union
console.log('After add (union):', bitset.toString());
console.log('Size after add:', bitset.size);

// Equals
let bitset3 = new BitSet(100);
bitset3.insert(1);
bitset3.insert(10);
bitset3.insert(50);
bitset3.insert(75);
bitset3.insert(100);

console.log('\nBitSet3:', bitset3.toString());
console.log('bitset.equals(bitset3)?', bitset.equals(bitset3));

console.log('\n=== 9. PRACTICAL EXAMPLE: SHAPE HIERARCHY ===\n');

class Shape {
  constructor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  area() {
    throw new Error("Abstract method 'area' must be implemented");
  }

  describe() {
    return `A ${this.color} ${this.constructor.name} with area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(color, side) {
    super(color, side, side);
  }
}

console.log('Shape hierarchy:');
let circle = new Circle('red', 5);
let rectangle = new Rectangle('blue', 4, 6);
let square = new Square('green', 5);

console.log(circle.describe());
console.log(rectangle.describe());
console.log(square.describe());

console.log('\nInstanceof checks:');
console.log('circle instanceof Circle:', circle instanceof Circle);
console.log('circle instanceof Shape:', circle instanceof Shape);
console.log('square instanceof Square:', square instanceof Square);
console.log('square instanceof Rectangle:', square instanceof Rectangle);
console.log('square instanceof Shape:', square instanceof Shape);

console.log('\n=== COMPLETE! ===');
console.log('All subclass concepts demonstrated successfully!');
