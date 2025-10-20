// =====================================================
// NODE.JS MODULES - COMPLETE DEMONSTRATION
// =====================================================
// This file demonstrates Node modules concepts
// In practice, these would be separate files

console.log('=== NODE.JS MODULES DEMONSTRATION ===\n');

// =====================================================
// 1. EXPORTING MULTIPLE VALUES WITH exports
// =====================================================
console.log('=== 1. EXPORTING MULTIPLE VALUES ===\n');

// Simulate stats.js module
const statsModule = (function () {
  // Private helpers
  const sum = (x, y) => x + y;
  const square = (x) => x * x;

  // Public exports object
  const exports = {};

  exports.mean = (data) => data.reduce(sum) / data.length;

  exports.stddev = function (d) {
    let m = exports.mean(d);
    return Math.sqrt(
      d
        .map((x) => x - m)
        .map(square)
        .reduce(sum) /
        (d.length - 1)
    );
  };

  return exports;
})();

console.log('stats module exports:', Object.keys(statsModule));

const testData = [2, 4, 6, 8, 10];
console.log('Data:', testData);
console.log('Mean:', statsModule.mean(testData));
console.log('Standard Deviation:', statsModule.stddev(testData));

// =====================================================
// 2. EXPORTING A SINGLE VALUE WITH module.exports
// =====================================================
console.log('\n=== 2. EXPORTING SINGLE VALUE ===\n');

// Simulate bitset.js module exporting a class
const BitSetModule = (function () {
  class BitSet {
    constructor() {
      this.bits = new Set();
    }

    add(num) {
      this.bits.add(num);
      return this;
    }

    has(num) {
      return this.bits.has(num);
    }

    size() {
      return this.bits.size;
    }
  }

  // module.exports = BitSet
  return BitSet;
})();

console.log('BitSet module exports a class');
const bitset = new BitSetModule();
bitset.add(1).add(5).add(10);
console.log('BitSet has 5?', bitset.has(5));
console.log('BitSet size:', bitset.size());

// =====================================================
// 3. EXPORTING AT THE END OF MODULE
// =====================================================
console.log('\n=== 3. EXPORTING AT MODULE END ===\n');

const mathUtilsModule = (function () {
  // All functions defined privately first
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  // Private helper (not exported)
  const validate = (a, b) => {
    return typeof a === 'number' && typeof b === 'number';
  };

  // Export only public API at the end
  return { add, subtract, multiply, divide };
})();

console.log('mathUtils exports:', Object.keys(mathUtilsModule));
console.log('5 + 3 =', mathUtilsModule.add(5, 3));
console.log('10 * 2 =', mathUtilsModule.multiply(10, 2));
console.log(
  'validate() is accessible?',
  mathUtilsModule.validate === undefined
);

// =====================================================
// 4. IMPORTING ENTIRE MODULE VS DESTRUCTURING
// =====================================================
console.log('\n=== 4. IMPORT PATTERNS ===\n');

// Pattern A: Import entire object
console.log('Pattern A: Import entire module');
const stats = statsModule;
let average = stats.mean([10, 20, 30]);
console.log('Average using stats.mean():', average);

// Pattern B: Destructuring (selective import)
console.log('\nPattern B: Destructuring import');
const { add, multiply } = mathUtilsModule;
console.log('Using destructured add():', add(5, 7));
console.log('Using destructured multiply():', multiply(3, 4));

// =====================================================
// 5. REAL-WORLD EXAMPLE: USER MODULE
// =====================================================
console.log('\n=== 5. USER MODULE EXAMPLE ===\n');

const UserModule = (function () {
  class User {
    constructor(name, email) {
      this.name = name;
      this.email = email;
      this.createdAt = new Date();
    }

    greet() {
      return `Hello, I'm ${this.name}`;
    }

    getInfo() {
      return {
        name: this.name,
        email: this.email,
        memberSince: this.createdAt.toLocaleDateString(),
      };
    }
  }

  return User;
})();

const user1 = new UserModule('Alice', 'alice@example.com');
const user2 = new UserModule('Bob', 'bob@example.com');

console.log(user1.greet());
console.log(user2.greet());
console.log('User 1 info:', user1.getInfo());

// =====================================================
// 6. DATABASE MODULE (PUBLIC/PRIVATE SEPARATION)
// =====================================================
console.log('\n=== 6. DATABASE MODULE (PUBLIC/PRIVATE) ===\n');

const DatabaseModule = (function () {
  // Private variables and functions
  let isConnected = false;
  let currentConfig = null;

  function validateConnection(config) {
    return config && config.host && config.port;
  }

  function log(message) {
    console.log(`[DB] ${message}`);
  }

  // Public API
  return {
    connect(config) {
      if (!validateConnection(config)) {
        throw new Error('Invalid database configuration');
      }
      isConnected = true;
      currentConfig = config;
      log(`Connected to ${config.host}:${config.port}`);
      return { success: true, config };
    },

    disconnect() {
      if (!isConnected) {
        log('Not connected');
        return { success: false };
      }
      isConnected = false;
      log('Disconnected');
      return { success: true };
    },

    query(sql) {
      if (!isConnected) {
        throw new Error('Not connected to database');
      }
      log(`Executing: ${sql}`);
      return { rows: [], rowCount: 0 };
    },

    getStatus() {
      return {
        connected: isConnected,
        config: currentConfig,
      };
    },
  };
})();

console.log('Connecting to database...');
DatabaseModule.connect({ host: 'localhost', port: 5432 });
console.log('Status:', DatabaseModule.getStatus());
DatabaseModule.query('SELECT * FROM users');
DatabaseModule.disconnect();

// =====================================================
// 7. CONFIGURATION MODULE
// =====================================================
console.log('\n=== 7. CONFIGURATION MODULE ===\n');

const ConfigModule = (function () {
  const config = {
    app: {
      name: 'MyApp',
      version: '1.0.0',
      port: 3000,
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'mydb',
    },
    api: {
      url: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
    },
  };

  return {
    get(key) {
      const keys = key.split('.');
      let value = config;
      for (let k of keys) {
        value = value[k];
        if (value === undefined) return null;
      }
      return value;
    },

    getAll() {
      return { ...config };
    },

    set(key, value) {
      const keys = key.split('.');
      let obj = config;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    },
  };
})();

console.log('App name:', ConfigModule.get('app.name'));
console.log('Database port:', ConfigModule.get('database.port'));
console.log('API timeout:', ConfigModule.get('api.timeout'));

// =====================================================
// 8. LOGGER MODULE (SINGLE FUNCTION EXPORT)
// =====================================================
console.log('\n=== 8. LOGGER MODULE (SINGLE EXPORT) ===\n');

const LoggerModule = (function () {
  function createLogger(prefix) {
    return {
      info(message) {
        console.log(`[${prefix}] INFO: ${message}`);
      },
      warn(message) {
        console.log(`[${prefix}] WARN: ${message}`);
      },
      error(message) {
        console.log(`[${prefix}] ERROR: ${message}`);
      },
    };
  }

  return createLogger;
})();

const appLogger = LoggerModule('APP');
const dbLogger = LoggerModule('DATABASE');

appLogger.info('Application started');
appLogger.warn('Low memory warning');
dbLogger.info('Connection established');
dbLogger.error('Query failed');

// =====================================================
// 9. VALIDATORS MODULE (MULTIPLE UTILITY FUNCTIONS)
// =====================================================
console.log('\n=== 9. VALIDATORS MODULE ===\n');

const ValidatorsModule = (function () {
  return {
    isEmail(str) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    },

    isPhone(str) {
      return /^\d{3}-\d{3}-\d{4}$/.test(str);
    },

    isURL(str) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    },

    isEmpty(value) {
      return value === null || value === undefined || value === '';
    },

    isInRange(num, min, max) {
      return num >= min && num <= max;
    },
  };
})();

console.log(
  "'test@example.com' is email?",
  ValidatorsModule.isEmail('test@example.com')
);
console.log(
  "'123-456-7890' is phone?",
  ValidatorsModule.isPhone('123-456-7890')
);
console.log(
  "'https://example.com' is URL?",
  ValidatorsModule.isURL('https://example.com')
);

// Using destructuring
const { isEmail, isEmpty } = ValidatorsModule;
console.log('\nUsing destructured validators:');
console.log("'invalid' is email?", isEmail('invalid'));
console.log("'' is empty?", isEmpty(''));

// =====================================================
// 10. SHOPPING CART MODULE (STATEFUL)
// =====================================================
console.log('\n=== 10. SHOPPING CART MODULE ===\n');

const ShoppingCartModule = (function () {
  // Private state
  const items = [];
  let nextId = 1;

  // Private helper
  function findItem(id) {
    return items.find((item) => item.id === id);
  }

  // Public API
  return {
    addItem(name, price, quantity = 1) {
      items.push({
        id: nextId++,
        name,
        price,
        quantity,
      });
      console.log(`Added: ${name} x${quantity} @ $${price}`);
    },

    removeItem(id) {
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        const removed = items.splice(index, 1)[0];
        console.log(`Removed: ${removed.name}`);
        return true;
      }
      return false;
    },

    updateQuantity(id, quantity) {
      const item = findItem(id);
      if (item) {
        item.quantity = quantity;
        console.log(`Updated ${item.name} quantity to ${quantity}`);
      }
    },

    getTotal() {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    getItems() {
      return [...items]; // Return copy
    },

    clear() {
      items.length = 0;
      console.log('Cart cleared');
    },
  };
})();

ShoppingCartModule.addItem('Laptop', 999.99, 1);
ShoppingCartModule.addItem('Mouse', 29.99, 2);
ShoppingCartModule.addItem('Keyboard', 79.99, 1);

console.log('\nCart items:', ShoppingCartModule.getItems());
console.log('Total: $' + ShoppingCartModule.getTotal().toFixed(2));

ShoppingCartModule.updateQuantity(2, 3);
console.log('Updated total: $' + ShoppingCartModule.getTotal().toFixed(2));

// =====================================================
// 11. MODULE PATTERNS COMPARISON
// =====================================================
console.log('\n=== 11. MODULE PATTERNS COMPARISON ===\n');

console.log('Pattern 1: exports.property (multiple exports)');
console.log('  - Good for: utility libraries, multiple related functions');
console.log('  - Example: stats.mean(), stats.stddev()');

console.log('\nPattern 2: module.exports = value (single export)');
console.log('  - Good for: classes, single functions, main export');
console.log('  - Example: class User, function createLogger()');

console.log('\nPattern 3: module.exports = {} (object at end)');
console.log('  - Good for: clear public/private separation');
console.log('  - Example: { connect, disconnect, query }');

// =====================================================
// SUMMARY
// =====================================================
console.log('\n=== SUMMARY ===\n');

console.log('Key Concepts Demonstrated:');
console.log('✓ Exporting multiple values with exports object');
console.log('✓ Exporting single value with module.exports');
console.log('✓ Public/private function separation');
console.log('✓ Import entire module vs destructuring');
console.log('✓ Class exports');
console.log('✓ Stateful modules with private state');
console.log('✓ Configuration and utility modules');
console.log('✓ Real-world practical examples');

console.log('\n=== COMPLETE! ===');

// =====================================================
// NOTE: In real Node.js applications, each module
// would be in its own file. This demo uses IIFEs
// (Immediately Invoked Function Expressions) to
// simulate the module pattern in a single file.
// =====================================================
