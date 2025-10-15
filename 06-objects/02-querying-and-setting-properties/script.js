// ==========================================
// JAVASCRIPT QUERYING AND SETTING PROPERTIES
// ==========================================

console.log('=== 1. ACCESSING PROPERTIES ===\n');

let book = {
  title: 'JavaScript',
  'main title': 'JavaScript: The Definitive Guide',
  'sub-title': "Master the World's Most-Used Programming Language",
  for: 'all audiences',
  author: {
    firstName: 'David',
    surname: 'Flanagan',
  },
  edition: 7,
  pages: 706,
};

// Dot notation
console.log('Using dot notation:');
console.log('book.title:', book.title);
console.log('book.author.surname:', book.author.surname);

// Bracket notation
console.log('\nUsing bracket notation:');
console.log("book['title']:", book['title']);
console.log("book['main title']:", book['main title']);
console.log("book['sub-title']:", book['sub-title']);

// Both work the same for valid identifiers
console.log('\nBoth notations (same result):');
console.log('book.edition:', book.edition);
console.log("book['edition']:", book['edition']);

console.log('\n=== 2. SETTING PROPERTIES ===\n');

// Creating new properties
book.isbn = '978-1491952023';
book['publisher'] = "O'Reilly Media";
console.log('After adding properties:', book.isbn, book.publisher);

// Updating existing properties
book.edition = 8;
book['main title'] = 'JavaScript: The Complete Reference';
console.log('After updating:', book.edition, book['main title']);

console.log('\n=== 3. OBJECTS AS ASSOCIATIVE ARRAYS ===\n');

// Dynamic property access
let customer = {
  address0: '123 Main St',
  address1: 'Apt 4B',
  address2: 'New York, NY',
  address3: '10001',
};

console.log('Building address dynamically:');
let addr = '';
for (let i = 0; i < 4; i++) {
  addr += customer[`address${i}`] + '\n';
}
console.log(addr);

// Stock portfolio example
let portfolio = {};

function addStock(portfolio, stockName, shares) {
  portfolio[stockName] = shares;
  console.log(`Added ${shares} shares of ${stockName}`);
}

console.log('\nBuilding stock portfolio:');
addStock(portfolio, 'AAPL', 50);
addStock(portfolio, 'GOOGL', 30);
addStock(portfolio, 'MSFT', 75);
addStock(portfolio, 'TSLA', 20);

console.log('\nPortfolio contents:', portfolio);

// Computing portfolio value
function computeValue(portfolio) {
  let total = 0.0;

  // Mock price lookup function
  function getQuote(stock) {
    const prices = { AAPL: 150, GOOGL: 2800, MSFT: 300, TSLA: 700 };
    return prices[stock] || 0;
  }

  for (let stock in portfolio) {
    let shares = portfolio[stock];
    let price = getQuote(stock);
    let value = shares * price;
    console.log(`${stock}: ${shares} shares × $${price} = $${value}`);
    total += value;
  }

  return total;
}

console.log('\nComputing portfolio value:');
let totalValue = computeValue(portfolio);
console.log(`Total portfolio value: $${totalValue}`);

console.log('\n=== 4. PROPERTY INHERITANCE ===\n');

// Create prototype chain
let o = {};
o.x = 1;
console.log('Object o:', o);

let p = Object.create(o);
p.y = 2;
console.log('Object p (inherits from o):', p);
console.log('p.x (inherited):', p.x);
console.log('p.y (own):', p.y);

let q = Object.create(p);
q.z = 3;
console.log('\nObject q (inherits from p and o):', q);
console.log('q.x (from o):', q.x);
console.log('q.y (from p):', q.y);
console.log('q.z (own):', q.z);
console.log('q.x + q.y + q.z =', q.x + q.y + q.z);

// toString is inherited from Object.prototype
console.log('\nq.toString() (from Object.prototype):', q.toString());

// Checking own vs inherited properties
console.log('\nProperty ownership:');
console.log("q has own property 'z':", q.hasOwnProperty('z'));
console.log("q has own property 'y':", q.hasOwnProperty('y'));
console.log("q has own property 'x':", q.hasOwnProperty('x'));
console.log("But 'x' exists via inheritance:", 'x' in q);

console.log('\n=== 5. PROPERTY SHADOWING ===\n');

let unitCircle = { r: 1 };
let c = Object.create(unitCircle);

console.log('Before setting properties:');
console.log('c.r (inherited):', c.r);
console.log('unitCircle.r:', unitCircle.r);

// Add own properties
c.x = 1;
c.y = 1;
c.r = 2; // Shadows inherited property

console.log('\nAfter setting c.r = 2:');
console.log('c.r (own property):', c.r);
console.log('unitCircle.r (unchanged):', unitCircle.r);
console.log("c has own 'r':", c.hasOwnProperty('r'));

console.log('\n=== 6. PROPERTY ACCESS ERRORS ===\n');

// Querying non-existent properties returns undefined
console.log('Non-existent property:');
console.log('book.subtitle:', book.subtitle); // undefined

// Attempting to access properties of null/undefined causes errors
console.log('\nTrying to access properties of undefined:');
try {
  let len = book.subtitle.length;
} catch (e) {
  console.log('Error:', e.message);
}

// Guarding against errors - Method 1: Verbose
console.log('\nMethod 1: Verbose checking:');
let surname = undefined;
if (book) {
  if (book.author) {
    surname = book.author.surname;
  }
}
console.log('Surname:', surname);

// Method 2: Short-circuit evaluation
console.log('\nMethod 2: Short-circuit (&&):');
surname = book && book.author && book.author.surname;
console.log('Surname:', surname);

// Test with missing property
let middleName = book && book.author && book.author.middleName;
console.log("Middle name (doesn't exist):", middleName);

// Method 3: Optional chaining (ES2020)
console.log('\nMethod 3: Optional chaining (?.):');
surname = book?.author?.surname;
console.log('Surname:', surname);

middleName = book?.author?.middleName;
console.log('Middle name:', middleName);

// Safe access with null object
let nullBook = null;
console.log('nullBook?.author?.name:', nullBook?.author?.name); // undefined, no error

console.log('\n=== 7. SETTING PROPERTY ERRORS ===\n');

// Read-only properties
console.log('Creating read-only property:');
let readOnlyObj = {};
Object.defineProperty(readOnlyObj, 'x', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: true,
});

console.log('readOnlyObj.x:', readOnlyObj.x);

try {
  ('use strict');
  readOnlyObj.x = 2; // Fails in strict mode
} catch (e) {
  console.log('Cannot modify read-only property:', e.message);
}

// Read-only inherited property
console.log('\nInheriting read-only property:');
let parent = {};
Object.defineProperty(parent, 'y', {
  value: 10,
  writable: false,
});

let child = Object.create(parent);
console.log('child.y (inherited):', child.y);

try {
  ('use strict');
  child.y = 20; // Cannot override read-only inherited property
} catch (e) {
  console.log('Cannot override inherited read-only:', e.message);
}

// Non-extensible objects
console.log('\nNon-extensible object:');
let sealed = { a: 1 };
Object.preventExtensions(sealed);

console.log('sealed.a:', sealed.a);
sealed.a = 2; // Can modify existing
console.log('Modified sealed.a:', sealed.a);

try {
  ('use strict');
  sealed.b = 3; // Cannot add new property
} catch (e) {
  console.log('Cannot add property to non-extensible:', e.message);
}

console.log('\n=== 8. PRACTICAL EXAMPLES ===\n');

// Example 1: Configuration object with dynamic access
console.log('Example 1: Dynamic configuration:');
let config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token123',
  },
};

function getConfigValue(key) {
  return config[key]; // Dynamic property access
}

console.log('API URL:', getConfigValue('apiUrl'));
console.log('Timeout:', getConfigValue('timeout'));

// Example 2: Form data validation
console.log('\nExample 2: Form validation:');
let formData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
};

let requiredFields = ['username', 'email', 'password'];

function validateForm(data, required) {
  let errors = [];

  for (let field of required) {
    if (!data[field]) {
      // Dynamic property check
      errors.push(`${field} is required`);
    }
  }

  return errors.length === 0 ? 'Valid' : errors;
}

console.log('Validation result:', validateForm(formData, requiredFields));

// Example 3: Object property mapper
console.log('\nExample 3: Property mapping:');
let user = {
  firstName: 'Alice',
  lastName: 'Smith',
  age: 30,
  email: 'alice@example.com',
};

let propertyMap = {
  firstName: 'first_name',
  lastName: 'last_name',
  age: 'user_age',
  email: 'email_address',
};

function transformObject(obj, map) {
  let result = {};

  for (let key in obj) {
    let newKey = map[key] || key;
    result[newKey] = obj[key];
  }

  return result;
}

let transformedUser = transformObject(user, propertyMap);
console.log('Original user:', user);
console.log('Transformed user:', transformedUser);

console.log('\n=== 9. COMPARISON: DOT VS BRACKET ===\n');

let testObj = {
  name: 'Test',
  'property-name': 'value',
  123: 'numeric key',
};

console.log('Dot notation:');
console.log('testObj.name:', testObj.name);
// console.log(testObj.property-name); // Syntax error!
// console.log(testObj.123); // Syntax error!

console.log('\nBracket notation:');
console.log("testObj['name']:", testObj['name']);
console.log("testObj['property-name']:", testObj['property-name']);
console.log('testObj[123]:', testObj[123]);
console.log("testObj['123']:", testObj['123']);

// Dynamic key
let key = 'name';
console.log('\nDynamic access:');
console.log("Using variable 'key':", testObj[key]);
// console.log(testObj.key); // Would look for property named "key"!

console.log('\n=== 10. ADVANCED: GETTER/SETTER WITH INHERITANCE ===\n');

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

let employee = Object.create(person);
employee.firstName = 'Jane';
employee.lastName = 'Smith';
employee.role = 'Developer';

console.log('Employee full name (inherited getter):', employee.fullName);
console.log('Employee role (own property):', employee.role);

employee.fullName = 'Alice Johnson'; // Calls inherited setter
console.log('After setter, firstName:', employee.firstName);
console.log('After setter, lastName:', employee.lastName);

console.log('\n=== COMPLETE! ===');
console.log('All property access and setting concepts demonstrated!');
