// ==================================
// JAVASCRIPT FUNCTIONS AS NAMESPACES
// ==================================

console.log('=== 1. THE PROBLEM: GLOBAL NAMESPACE POLLUTION ===\n');

// BAD: These variables pollute the global namespace
console.log('Without namespace protection:');
var count = 0;
var data = ['item1', 'item2'];
var result = null;

console.log('Global variables created:', 'count, data, result');
console.log('Risk: Name conflicts with other scripts!');

console.log('\n=== 2. SOLUTION 1: NAMED FUNCTION NAMESPACE ===\n');

function chunkNamespace() {
  // Variables are local to this function
  var count = 0;
  var data = [];
  var result = null;

  console.log('Inside chunkNamespace:');
  console.log('  count:', count);
  console.log('  data:', data);

  // Do some work
  for (var i = 0; i < 5; i++) {
    count++;
    data.push(i);
  }

  result = count * 2;
  console.log('  After processing - count:', count, 'result:', result);
}

chunkNamespace(); // Invoke the function

console.log("\nGlobal variable created: only 'chunkNamespace'");
// console.log(count); // Would cause ReferenceError if uncommented

console.log(
  '\n=== 3. SOLUTION 2: IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION) ===\n'
);

console.log('Basic IIFE:');
(function () {
  var message = 'Hello from IIFE!';
  var secret = 'This is private';

  console.log('  ' + message);
  console.log('  ' + secret);
})();

console.log('No global variables created at all!');
// console.log(message); // ReferenceError if uncommented

console.log('\n=== 4. IIFE SYNTAX VARIATIONS ===\n');

// Style 1: Parentheses wrap everything
console.log('Style 1: (function(){...}());');
(function () {
  console.log('  Executed!');
})();

// Style 2: Parentheses wrap function only
console.log('\nStyle 2: (function(){...})();');
(function () {
  console.log('  Executed!');
})();

// Both are equivalent and commonly used

console.log('\n=== 5. PASSING ARGUMENTS TO IIFE ===\n');

console.log('IIFE with parameters:');
(function (name, age, city) {
  console.log('  Name:', name);
  console.log('  Age:', age);
  console.log('  City:', city);
})('Alice', 30, 'New York');

// Common pattern: Passing global objects
console.log('\nPassing global objects:');
(function (window, document, undefined) {
  console.log('  window object:', typeof window);
  console.log('  document object:', typeof document);
  console.log('  undefined:', undefined);

  // Benefits:
  // 1. Faster property lookup (local vs global)
  // 2. Protection against undefined being overwritten
  // 3. Clear dependencies
})(
  typeof window !== 'undefined' ? window : global,
  typeof document !== 'undefined' ? document : {},
  void 0
);

console.log('\n=== 6. RETURNING VALUES FROM IIFE ===\n');

console.log('IIFE returning a value:');
var counter = (function () {
  var count = 0; // Private variable

  console.log('  Counter module initialized with count =', count);

  // Return public API
  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getCount: function () {
      return count;
    },
    reset: function () {
      count = 0;
      console.log('  Counter reset!');
    },
  };
})();

console.log('\nUsing the counter:');
console.log('  increment():', counter.increment()); // 1
console.log('  increment():', counter.increment()); // 2
console.log('  increment():', counter.increment()); // 3
console.log('  getCount():', counter.getCount()); // 3
console.log('  decrement():', counter.decrement()); // 2
counter.reset();
console.log('  getCount() after reset:', counter.getCount()); // 0

// Try to access private variable
console.log("\nTrying to access private 'count':");
console.log('  counter.count:', counter.count); // undefined (private!)

console.log('\n=== 7. CLOSURES WITH IIFE ===\n');

console.log('Creating a greeter with closure:');
var createGreeter = (function () {
  var greeting = 'Hello'; // Private variable
  var punctuation = '!';

  console.log('  Greeter initialized with greeting:', greeting);

  return function (name) {
    return greeting + ', ' + name + punctuation;
  };
})();

console.log('\nUsing the greeter:');
console.log('  ' + createGreeter('Alice'));
console.log('  ' + createGreeter('Bob'));
console.log('  ' + createGreeter('Charlie'));

console.log('\nPrivate variables are not accessible:');
console.log('  greeting:', typeof greeting); // undefined

console.log('\n=== 8. MODULE PATTERN ===\n');

console.log('Creating a Calculator module:');
var Calculator = (function () {
  // Private variables and functions
  var history = [];
  var maxHistory = 10;

  function log(operation) {
    history.push(operation);
    if (history.length > maxHistory) {
      history.shift(); // Remove oldest
    }
  }

  function formatResult(a, op, b, result) {
    return a + ' ' + op + ' ' + b + ' = ' + result;
  }

  console.log('  Calculator module initialized');

  // Public API
  return {
    add: function (a, b) {
      var result = a + b;
      log(formatResult(a, '+', b, result));
      return result;
    },

    subtract: function (a, b) {
      var result = a - b;
      log(formatResult(a, '-', b, result));
      return result;
    },

    multiply: function (a, b) {
      var result = a * b;
      log(formatResult(a, '×', b, result));
      return result;
    },

    divide: function (a, b) {
      if (b === 0) {
        console.log('  Error: Division by zero!');
        return null;
      }
      var result = a / b;
      log(formatResult(a, '÷', b, result));
      return result;
    },

    getHistory: function () {
      return history.slice(); // Return copy, not reference
    },

    clearHistory: function () {
      history = [];
      console.log('  History cleared!');
    },
  };
})();

console.log('\nUsing Calculator:');
console.log('  5 + 3 =', Calculator.add(5, 3));
console.log('  10 - 4 =', Calculator.subtract(10, 4));
console.log('  6 × 7 =', Calculator.multiply(6, 7));
console.log('  20 ÷ 5 =', Calculator.divide(20, 5));

console.log('\nCalculation history:');
var hist = Calculator.getHistory();
hist.forEach(function (entry) {
  console.log('  ' + entry);
});

console.log('\nTrying to access private variables:');
console.log('  Calculator.history:', Calculator.history); // undefined
console.log('  Calculator.maxHistory:', Calculator.maxHistory); // undefined

console.log('\n=== 9. PRACTICAL USE CASE: USER MANAGER ===\n');

var UserManager = (function () {
  // Private data
  var users = [];
  var currentUser = null;
  var nextId = 1;

  // Private functions
  function findUserById(id) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        return users[i];
      }
    }
    return null;
  }

  function validateUser(username, email) {
    if (!username || username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!email || email.indexOf('@') === -1) {
      return 'Invalid email address';
    }
    return null;
  }

  console.log('UserManager initialized');

  // Public API
  return {
    addUser: function (username, email) {
      var error = validateUser(username, email);
      if (error) {
        console.log('  Error:', error);
        return null;
      }

      var user = {
        id: nextId++,
        username: username,
        email: email,
        createdAt: new Date(),
      };

      users.push(user);
      console.log('  User added:', username);
      return user;
    },

    login: function (username) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          currentUser = users[i];
          console.log('  User logged in:', username);
          return true;
        }
      }
      console.log('  Login failed: User not found');
      return false;
    },

    logout: function () {
      if (currentUser) {
        console.log('  User logged out:', currentUser.username);
        currentUser = null;
      }
    },

    getCurrentUser: function () {
      return currentUser ? Object.assign({}, currentUser) : null;
    },

    getAllUsers: function () {
      return users.map(function (user) {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      });
    },

    getUserCount: function () {
      return users.length;
    },
  };
})();

console.log('\nUsing UserManager:');
UserManager.addUser('alice', 'alice@example.com');
UserManager.addUser('bob', 'bob@example.com');
UserManager.addUser('charlie', 'charlie@example.com');

console.log('\nTotal users:', UserManager.getUserCount());

UserManager.login('alice');
var current = UserManager.getCurrentUser();
console.log('Current user:', current ? current.username : 'none');

console.log('\nAll users:');
UserManager.getAllUsers().forEach(function (user) {
  console.log('  ID:', user.id, 'Username:', user.username);
});

UserManager.logout();

console.log('\n=== 10. INITIALIZATION CODE PATTERN ===\n');

console.log('Running initialization code:');
(function () {
  var isDevelopment = true;
  var config = {
    apiUrl: isDevelopment ? 'http://localhost:3000' : 'https://api.prod.com',
    timeout: 5000,
    retries: 3,
  };

  console.log('  Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('  API URL:', config.apiUrl);
  console.log('  Timeout:', config.timeout + 'ms');

  // Simulate initialization tasks
  console.log('  Setting up application...');
  console.log('  Loading configuration...');
  console.log('  Initializing services...');
  console.log('  Application ready!');

  // Expose only what's needed globally
  if (typeof window !== 'undefined') {
    window.AppConfig = {
      getApiUrl: function () {
        return config.apiUrl;
      },
      getTimeout: function () {
        return config.timeout;
      },
    };
  }
})();

console.log('\n=== 11. LIBRARY/PLUGIN PATTERN ===\n');

var MyLibrary = (function () {
  // Private
  var version = '1.0.0';
  var initialized = false;
  var settings = {};

  function privateHelper(message) {
    return '[MyLibrary] ' + message;
  }

  function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  }

  // Public API
  return {
    version: version, // Public version property

    init: function (config) {
      if (initialized) {
        console.log(privateHelper('Already initialized'));
        return;
      }

      settings = extend(
        {
          debug: false,
          theme: 'light',
        },
        config || {}
      );

      initialized = true;
      console.log(privateHelper('Initialized v' + version));
      console.log('  Settings:', JSON.stringify(settings));
    },

    doSomething: function (data) {
      if (!initialized) {
        console.log(privateHelper('Not initialized! Call init() first'));
        return;
      }
      console.log(privateHelper('Processing: ' + data));
      return privateHelper('Result: ' + data.toUpperCase());
    },

    getSettings: function () {
      return Object.assign({}, settings); // Return copy
    },
  };
})();

console.log('Using MyLibrary:');
console.log('  Version:', MyLibrary.version);
MyLibrary.init({ debug: true, theme: 'dark' });
console.log('  ' + MyLibrary.doSomething('hello world'));

console.log('\n=== 12. MODERN ALTERNATIVES ===\n');

console.log('ES6 Block Scope (let/const):');
{
  let blockScoped = "I'm block scoped";
  const alsoBlocked = 'Me too';
  console.log('  Inside block:', blockScoped);
}
// console.log(blockScoped); // ReferenceError if uncommented

console.log('\nES6 Modules (conceptual):');
console.log('  // module.js');
console.log("  const privateVar = 'private';");
console.log('  export function publicFunc() { return privateVar; }');
console.log('');
console.log('  // main.js');
console.log("  import { publicFunc } from './module.js';");

console.log('\nWhen to use IIFEs:');
console.log('  ✓ Browser scripts without module support');
console.log('  ✓ Creating closures with private data');
console.log('  ✓ One-time initialization code');
console.log('  ✓ Legacy codebases');
console.log('  ✓ Creating self-contained modules');

console.log('\n=== 13. NAMED IIFE (FOR DEBUGGING) ===\n');

console.log('Named IIFE appears in stack traces:');
(function debuggableFunction() {
  console.log('  Function name helps with debugging');
  console.log('  Stack trace will show: debuggableFunction');

  // Simulate an error to show stack trace
  try {
    throw new Error('Example error');
  } catch (e) {
    console.log('  Error caught:', e.message);
    // In real debugging, you'd see 'debuggableFunction' in the stack
  }
})();

console.log('\n=== COMPLETE! ===');
console.log('All function namespace concepts demonstrated!');
console.log('\nKey Takeaways:');
console.log('✓ IIFEs prevent global namespace pollution');
console.log('✓ Closures enable private variables and methods');
console.log('✓ Module pattern creates reusable, self-contained code');
console.log('✓ Modern alternatives: ES6 modules, let/const blocks');
