// ============================
// JAVASCRIPT EXTENDING OBJECTS
// ============================

console.log('=== 1. BASIC MANUAL EXTENSION ===\n');

// Traditional loop method
let target = { x: 1 };
let source = { y: 2, z: 3 };

console.log('Before extension:');
console.log('Target:', target);
console.log('Source:', source);

for (let key of Object.keys(source)) {
  target[key] = source[key];
}

console.log('\nAfter extension:');
console.log('Target:', target);

console.log('\n=== 2. Object.assign() BASICS ===\n');

// Basic usage
let obj1 = { x: 1 };
let obj2 = { y: 2, z: 3 };

Object.assign(obj1, obj2);
console.log('Object.assign(obj1, obj2):', obj1);

// Multiple sources
let target2 = { a: 1 };
let source1 = { b: 2 };
let source2 = { c: 3 };

Object.assign(target2, source1, source2);
console.log('Multiple sources:', target2);

// Property override behavior
let result = Object.assign(
  { x: 1 }, // target
  { x: 2, y: 2 }, // source1 overrides x
  { y: 3, z: 4 } // source2 overrides y
);
console.log('Override behavior:', result);

console.log('\n=== 3. CLONING OBJECTS ===\n');

// Shallow clone
let original = { x: 1, y: 2, z: 3 };
let clone = Object.assign({}, original);

console.log('Original:', original);
console.log('Clone:', clone);
console.log('Are they the same object?', original === clone);

// Modifying clone doesn't affect original
clone.x = 100;
console.log('\nAfter modifying clone:');
console.log('Original.x:', original.x);
console.log('Clone.x:', clone.x);

console.log('\n=== 4. MERGING MULTIPLE OBJECTS ===\n');

let person = { name: 'Alice' };
let details = { age: 30, city: 'NYC' };
let job = { title: 'Developer', company: 'TechCorp' };

let profile = Object.assign({}, person, details, job);
console.log('Merged profile:', profile);

console.log('\n=== 5. SETTING DEFAULTS - WRONG WAY ===\n');

let userOptions = { timeout: 1000 };
let defaults = { timeout: 5000, retries: 3, verbose: true };

console.log('User options:', userOptions);
console.log('Defaults:', defaults);

// Wrong: This overwrites custom timeout!
let wrongConfig = Object.assign({}, userOptions);
Object.assign(wrongConfig, defaults);
console.log('Wrong approach (overwrites):', wrongConfig);

console.log('\n=== 6. SETTING DEFAULTS - CORRECT WAY ===\n');

userOptions = { timeout: 1000 };
defaults = { timeout: 5000, retries: 3, verbose: true };

// Correct: Copy defaults first, then override with user options
let correctConfig = Object.assign({}, defaults, userOptions);
console.log('Correct approach (preserves custom):', correctConfig);

console.log('\n=== 7. SPREAD OPERATOR (...) ===\n');

// Basic spread
let obj3 = { x: 1, y: 2 };
let obj4 = { y: 3, z: 4 };

let spread1 = { ...obj3 };
console.log('Spread clone:', spread1);

let spread2 = { ...obj3, ...obj4 };
console.log('Spread merge:', spread2);

// Setting defaults with spread
let spreadDefaults = { timeout: 5000, retries: 3 };
let spreadOptions = { timeout: 1000 };

let spreadConfig = { ...spreadDefaults, ...spreadOptions };
console.log('Spread defaults pattern:', spreadConfig);

// Adding additional properties
let enhanced = { ...spreadConfig, debug: true };
console.log('Enhanced with new property:', enhanced);

console.log('\n=== 8. COMPARISON: Object.assign() vs SPREAD ===\n');

let base = { x: 1 };

// Object.assign mutates first argument
let assigned = Object.assign(base, { y: 2 });
console.log('After Object.assign:');
console.log('base:', base); // Modified
console.log('assigned:', assigned); // Same reference
console.log('Same object?', base === assigned);

// Spread creates new object
let base2 = { x: 1 };
let spreaded = { ...base2, y: 2 };
console.log('\nAfter spread:');
console.log('base2:', base2); // Unchanged
console.log('spreaded:', spreaded); // New object
console.log('Same object?', base2 === spreaded);

console.log('\n=== 9. CUSTOM MERGE FUNCTION ===\n');

// Custom merge that doesn't override existing properties
function merge(target, ...sources) {
  for (let source of sources) {
    for (let key of Object.keys(source)) {
      if (!(key in target)) {
        // Only add if missing
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Comparison
let assignResult = Object.assign({ x: 1 }, { x: 2, y: 2 }, { y: 3, z: 4 });
console.log('Object.assign result:', assignResult);

let mergeResult = merge({ x: 1 }, { x: 2, y: 2 }, { y: 3, z: 4 });
console.log('merge() result:', mergeResult);

console.log('\n=== 10. UTILITY FUNCTIONS ===\n');

// restrict() - Keep only template properties
function restrict(target, template) {
  for (let key of Object.keys(target)) {
    if (!(key in template)) {
      delete target[key];
    }
  }
  return target;
}

let restrictObj = { x: 1, y: 2, z: 3, w: 4 };
let template = { x: 0, y: 0 };
console.log('Before restrict:', restrictObj);
restrict(restrictObj, template);
console.log('After restrict (only x, y):', restrictObj);

// subtract() - Remove specified properties
function subtract(target, source) {
  for (let key of Object.keys(source)) {
    delete target[key];
  }
  return target;
}

let subtractObj = { x: 1, y: 2, z: 3 };
let toRemove = { y: 0, z: 0 };
console.log('\nBefore subtract:', subtractObj);
subtract(subtractObj, toRemove);
console.log('After subtract (removed y, z):', subtractObj);

console.log('\n=== 11. SHALLOW vs DEEP COPY ===\n');

// Shallow copy problem
let nested = {
  name: 'John',
  address: {
    city: 'NYC',
    zip: 10001,
  },
};

let shallowCopy = { ...nested };
console.log('Original:', nested);
console.log('Shallow copy:', shallowCopy);

// Modify nested object
shallowCopy.address.city = 'LA';
console.log("\nAfter modifying shallow copy's nested object:");
console.log('Original city:', nested.address.city); // Also changed!
console.log('Copy city:', shallowCopy.address.city);

// Deep copy using JSON
let original2 = {
  name: 'Alice',
  age: 30,
  address: {
    city: 'Boston',
    zip: 2101,
  },
};

let deepCopy = JSON.parse(JSON.stringify(original2));
deepCopy.address.city = 'Seattle';

console.log('\nDeep copy using JSON:');
console.log('Original city:', original2.address.city); // Unchanged
console.log('Deep copy city:', deepCopy.address.city);

// Recursive deep copy function
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  let copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key]);
    }
  }

  return copy;
}

let original3 = {
  name: 'Bob',
  scores: [90, 85, 92],
  meta: { created: '2024', updated: '2025' },
};

let recursiveDeep = deepClone(original3);
recursiveDeep.scores.push(88);
recursiveDeep.meta.updated = '2026';

console.log('\nRecursive deep copy:');
console.log('Original scores:', original3.scores);
console.log('Copy scores:', recursiveDeep.scores);
console.log('Original meta:', original3.meta.updated);
console.log('Copy meta:', recursiveDeep.meta.updated);

console.log('\n=== 12. GETTERS AND SETTERS ===\n');

let sourceWithGetter = {
  _value: 42,
  get value() {
    console.log('Getter invoked!');
    return this._value;
  },
  set value(v) {
    console.log('Setter invoked!');
    this._value = v;
  },
};

let targetForGetter = {};
console.log('Copying object with getter:');
Object.assign(targetForGetter, sourceWithGetter);

console.log('\ntargetForGetter.value:', targetForGetter.value);
console.log(
  'Has getter?',
  Object.getOwnPropertyDescriptor(targetForGetter, 'value')
);

console.log('\n=== 13. PRACTICAL EXAMPLE: Configuration ===\n');

function createConfig(userOptions = {}) {
  const defaults = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    debug: false,
  };

  return { ...defaults, ...userOptions };
}

let config1 = createConfig();
console.log('Config with defaults:', config1);

let config2 = createConfig({ timeout: 10000, debug: true });
console.log('\nConfig with overrides:', config2);

console.log('\n=== 14. PRACTICAL EXAMPLE: Object Composition ===\n');

const canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  },
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  },
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  },
};

const canFly = {
  fly() {
    return `${this.name} is flying`;
  },
};

// Create different animals with different abilities
let dog = Object.assign({ name: 'Rex', species: 'Dog' }, canEat, canWalk);

let duck = Object.assign(
  { name: 'Donald', species: 'Duck' },
  canEat,
  canWalk,
  canSwim,
  canFly
);

let fish = Object.assign({ name: 'Nemo', species: 'Fish' }, canEat, canSwim);

console.log(dog.eat('bone'));
console.log(dog.walk());

console.log('\n' + duck.eat('bread'));
console.log(duck.swim());
console.log(duck.fly());

console.log('\n' + fish.eat('algae'));
console.log(fish.swim());

console.log('\n=== 15. PRACTICAL EXAMPLE: Immutable Updates ===\n');

let state = {
  user: {
    name: 'Alice',
    email: 'alice@example.com',
  },
  isLoggedIn: false,
  theme: 'dark',
  notifications: [],
};

console.log('Initial state:', state);

// Update state immutably (create new object)
let newState = {
  ...state,
  isLoggedIn: true,
  notifications: [...state.notifications, 'Welcome back!'],
};

console.log('\nNew state:', newState);
console.log('Original state unchanged:', state.isLoggedIn);

console.log('\n=== 16. PRACTICAL EXAMPLE: Plugin System ===\n');

class Application {
  constructor() {
    this.config = {
      name: 'MyApp',
      version: '1.0.0',
    };
    this.features = {};
  }

  use(plugin) {
    // Extend features with plugin
    Object.assign(this.features, plugin);
    return this;
  }

  showFeatures() {
    console.log('Available features:', Object.keys(this.features));
  }
}

const loggingPlugin = {
  log(message) {
    console.log(`[LOG] ${message}`);
  },
};

const analyticsPlugin = {
  track(event) {
    console.log(`[ANALYTICS] Tracking: ${event}`);
  },
};

const notificationPlugin = {
  notify(message) {
    console.log(`[NOTIFICATION] ${message}`);
  },
};

let app = new Application();
app.use(loggingPlugin).use(analyticsPlugin).use(notificationPlugin);

app.showFeatures();
app.features.log('Application started');
app.features.track('page_view');
app.features.notify('Welcome!');

console.log('\n=== 17. SYMBOL PROPERTIES ===\n');

let sym = Symbol('id');
let objWithSymbol = {
  name: 'Test',
  [sym]: 123,
};

let copyWithSymbol = Object.assign({}, objWithSymbol);
console.log('Original:', objWithSymbol);
console.log('Copy:', copyWithSymbol);
console.log('Symbol property copied?', sym in copyWithSymbol);
console.log('Symbol value:', copyWithSymbol[sym]);

console.log('\n=== COMPLETE! ===');
console.log('All object extension techniques demonstrated successfully!');
