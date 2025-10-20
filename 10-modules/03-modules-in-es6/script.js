// ====================================================
// ES6 MODULES - COMPLETE DEMONSTRATION
// ====================================================
// Note: This is a demonstration file showing ES6 module concepts.
// To actually run ES6 modules, you need separate files.
// See the structure below for how to organize real module files.

console.log('=== ES6 MODULES DEMONSTRATION ===\n');

// ====================================================
// FILE STRUCTURE FOR ACTUAL IMPLEMENTATION
// ====================================================
console.log('=== RECOMMENDED FILE STRUCTURE ===\n');

const fileStructure = `
project/
├── index.html
├── main.js (entry point)
├── modules/
│   ├── math.js (named exports)
│   ├── calculator.js (default export)
│   ├── utils.js (mixed exports)
│   ├── constants.js (named exports)
│   └── stats/
│       ├── mean.js
│       ├── stddev.js
│       └── index.js (re-exports)
└── data/
    └── config.json
`;

console.log(fileStructure);

// ====================================================
// 1. NAMED EXPORTS EXAMPLES
// ====================================================
console.log('\n=== 1. NAMED EXPORTS (math.js) ===\n');

// FILE: math.js
const mathModuleCode = `
// Method 1: Export with declaration
export const PI = Math.PI;
export const E = Math.E;

export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

export class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  area() {
    return PI * this.radius * this.radius;
  }

  circumference() {
    return 2 * PI * this.radius;
  }
}

// Method 2: Export at the end
const PHI = (1 + Math.sqrt(5)) / 2;
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

export { PHI, factorial };
`;

console.log('math.js content:');
console.log(mathModuleCode);

// Simulated import
console.log('\nImporting from math.js:');
console.log("import { PI, square, Circle } from './math.js';");
console.log('console.log(PI);              // 3.14159...');
console.log('console.log(square(5));       // 25');
console.log('console.log(new Circle(10));  // Circle instance');

// ====================================================
// 2. DEFAULT EXPORTS EXAMPLES
// ====================================================
console.log('\n\n=== 2. DEFAULT EXPORTS (calculator.js) ===\n');

// FILE: calculator.js
const calculatorModuleCode = `
// Default export - class
export default class Calculator {
  constructor() {
    this.result = 0;
  }

  add(n) {
    this.result += n;
    return this;
  }

  subtract(n) {
    this.result -= n;
    return this;
  }

  multiply(n) {
    this.result *= n;
    return this;
  }

  divide(n) {
    if (n !== 0) this.result /= n;
    return this;
  }

  getResult() {
    return this.result;
  }

  clear() {
    this.result = 0;
    return this;
  }
}
`;

console.log('calculator.js content:');
console.log(calculatorModuleCode);

console.log('\nImporting default export:');
console.log("import Calculator from './calculator.js';");
console.log('const calc = new Calculator();');
console.log('calc.add(5).multiply(3).getResult(); // 15');

// Other default export examples
console.log('\n\nOther default export patterns:');
console.log(`
// Export anonymous function
export default function(x, y) {
  return x + y;
}

// Export object literal
export default {
  name: 'MyModule',
  version: '1.0.0',
  author: 'Developer'
};

// Export value
export default 42;
`);

// ====================================================
// 3. MIXED EXPORTS EXAMPLES
// ====================================================
console.log('\n=== 3. MIXED EXPORTS (utils.js) ===\n');

// FILE: utils.js
const utilsModuleCode = `
// Default export
export default class Logger {
  constructor(prefix = 'LOG') {
    this.prefix = prefix;
  }

  log(message) {
    console.log(\`[\${this.prefix}] \${message}\`);
  }

  error(message) {
    console.error(\`[\${this.prefix}] ERROR: \${message}\`);
  }
}

// Named exports
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const VERSION = '1.0.0';
export const DEBUG = true;
`;

console.log('utils.js content:');
console.log(utilsModuleCode);

console.log('\nImporting mixed exports:');
console.log(
  "import Logger, { formatDate, capitalize, VERSION } from './utils.js';"
);
console.log("const logger = new Logger('APP');");
console.log('logger.log(formatDate(new Date()));');

// ====================================================
// 4. IMPORTING VARIATIONS
// ====================================================
console.log('\n\n=== 4. IMPORTING VARIATIONS ===\n');

const importExamples = `
// Import default
import Calculator from './calculator.js';

// Import named exports
import { PI, square, Circle } from './math.js';

// Import all as namespace
import * as MathUtils from './math.js';
console.log(MathUtils.PI);
console.log(MathUtils.square(5));

// Import default + named
import Logger, { formatDate, VERSION } from './utils.js';

// Import with renaming
import { square as sq, cube as cb } from './math.js';
console.log(sq(5));  // 25
console.log(cb(3));  // 27

// Import default with renaming
import { default as Calc } from './calculator.js';

// Import for side effects only
import './analytics.js';

// Multiple imports from different modules
import { PI } from './math.js';
import { VERSION } from './utils.js';
import Calculator from './calculator.js';
`;

console.log(importExamples);

// ====================================================
// 5. RENAMING EXAMPLES
// ====================================================
console.log('\n=== 5. RENAMING IMPORTS/EXPORTS ===\n');

const renamingExamples = `
// Renaming on import (to avoid conflicts)
import { render as renderImage } from './imageutils.js';
import { render as renderUI } from './ui.js';

renderImage(image);
renderUI(component);

// Renaming on export
// FILE: geometry.js
function calculateArea(radius) {
  return Math.PI * radius * radius;
}

function calculatePerimeter(radius) {
  return 2 * Math.PI * radius;
}

export {
  calculateArea as circleArea,
  calculatePerimeter as circlePerimeter
};

// Importing renamed exports
import { circleArea, circlePerimeter } from './geometry.js';
`;

console.log(renamingExamples);

// ====================================================
// 6. RE-EXPORTS EXAMPLES
// ====================================================
console.log('\n=== 6. RE-EXPORTS (stats/index.js) ===\n');

const reExportExamples = `
// FILE: stats/mean.js
export function mean(data) {
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

// FILE: stats/stddev.js
export function stddev(data) {
  const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
  const squareDiffs = data.map(val => (val - avg) ** 2);
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  return Math.sqrt(avgSquareDiff);
}

// FILE: stats/median.js
export function median(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// FILE: stats/index.js (aggregates all stats functions)
// Method 1: Import then export
import { mean } from './mean.js';
import { stddev } from './stddev.js';
import { median } from './median.js';
export { mean, stddev, median };

// Method 2: Re-export directly (cleaner)
export { mean } from './mean.js';
export { stddev } from './stddev.js';
export { median } from './median.js';

// Method 3: Re-export all
export * from './mean.js';
export * from './stddev.js';
export * from './median.js';

// Re-export with renaming
export { mean, mean as average } from './mean.js';

// Re-export default as named
export { default as StatCalculator } from './calculator.js';

// Re-export named as default
export { mean as default } from './mean.js';

// Usage
import { mean, stddev, median } from './stats/index.js';
// or
import * as stats from './stats/index.js';
`;

console.log(reExportExamples);

// ====================================================
// 7. DYNAMIC IMPORTS
// ====================================================
console.log('\n=== 7. DYNAMIC IMPORTS ===\n');

const dynamicImportExamples = `
// Basic dynamic import with Promise
import('./math.js').then(math => {
  console.log(math.PI);
  console.log(math.square(5));
});

// With async/await
async function loadMath() {
  const math = await import('./math.js');
  return math.square(10);
}

// Conditional loading
if (userWantsAdvancedFeatures) {
  import('./advanced-features.js').then(module => {
    module.initializeFeatures();
  });
}

// Dynamic module path
async function loadLocale(language) {
  const messages = await import(\`./i18n/\${language}.js\`);
  return messages.default;
}

// Error handling
import('./module.js')
  .then(module => {
    // Use module
  })
  .catch(error => {
    console.error('Failed to load module:', error);
  });

// Lazy loading components
async function showUserProfile() {
  const { UserProfile } = await import('./components/UserProfile.js');
  const profile = new UserProfile();
  profile.render();
}

// Code splitting example
document.getElementById('loadBtn').addEventListener('click', async () => {
  const { heavyCalculation } = await import('./heavy-module.js');
  const result = heavyCalculation(data);
  displayResult(result);
});
`;

console.log(dynamicImportExamples);

// ====================================================
// 8. IMPORT.META.URL
// ====================================================
console.log('\n=== 8. IMPORT.META.URL ===\n');

const importMetaExamples = `
// Get current module URL
console.log(import.meta.url);
// Output: "file:///path/to/module.js" or "https://example.com/module.js"

// Load resources relative to module
function getResourceURL(filename) {
  return new URL(filename, import.meta.url).href;
}

// Load data file
const dataURL = getResourceURL('./data.json');
fetch(dataURL).then(response => response.json());

// Load image
const imageURL = getResourceURL('../images/logo.png');
const img = new Image();
img.src = imageURL;

// Localization example
function localStringsURL(locale) {
  return new URL(\`l10n/\${locale}.json\`, import.meta.url);
}

const messages = await fetch(localStringsURL('en')).then(r => r.json());

// Asset loader
class AssetLoader {
  constructor() {
    this.baseURL = new URL('.', import.meta.url);
  }

  loadCSS(filename) {
    const url = new URL(\`styles/\${filename}\`, this.baseURL);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url.href;
    document.head.appendChild(link);
  }

  async loadJSON(filename) {
    const url = new URL(\`data/\${filename}\`, this.baseURL);
    return fetch(url).then(r => r.json());
  }
}
`;

console.log(importMetaExamples);

// ====================================================
// 9. HTML USAGE
// ====================================================
console.log('\n=== 9. HTML USAGE ===\n');

const htmlExamples = `
<!DOCTYPE html>
<html>
<head>
  <title>ES6 Modules Demo</title>
</head>
<body>
  <h1>ES6 Modules</h1>

  <!-- Method 1: Inline module -->
  <script type="module">
    import { PI, square } from './modules/math.js';
    console.log('PI:', PI);
    console.log('Square of 5:', square(5));
  </script>

  <!-- Method 2: External module file -->
  <script type="module" src="./main.js"></script>

  <!-- Method 3: With async attribute -->
  <script type="module" src="./app.js" async></script>

  <!-- Fallback for old browsers -->
  <script nomodule src="./legacy-bundle.js"></script>

  <!-- Dynamic import triggered by user action -->
  <script type="module">
    document.getElementById('loadBtn').addEventListener('click', async () => {
      const module = await import('./feature.js');
      module.initialize();
    });
  </script>

  <button id="loadBtn">Load Feature</button>
</body>
</html>
`;

console.log(htmlExamples);

// ====================================================
// 10. COMPLETE WORKING EXAMPLE
// ====================================================
console.log('\n=== 10. COMPLETE WORKING EXAMPLE ===\n');

console.log('FILE STRUCTURE:');
const completeExample = `
app/
├── index.html
├── main.js
├── modules/
│   ├── math.js
│   ├── calculator.js
│   └── logger.js
└── data/
    └── config.json

// ===== index.html =====
<!DOCTYPE html>
<html>
<head>
  <title>Calculator App</title>
</head>
<body>
  <h1>ES6 Module Calculator</h1>
  <div id="result"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>

// ===== modules/math.js =====
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// ===== modules/calculator.js =====
import { add, subtract, multiply, divide } from './math.js';

export default class Calculator {
  calculate(operation, a, b) {
    switch (operation) {
      case 'add': return add(a, b);
      case 'subtract': return subtract(a, b);
      case 'multiply': return multiply(a, b);
      case 'divide': return divide(a, b);
      default: throw new Error('Unknown operation');
    }
  }
}

// ===== modules/logger.js =====
export default class Logger {
  log(message) {
    console.log(\`[LOG] \${new Date().toISOString()}: \${message}\`);
  }

  error(message) {
    console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`);
  }
}

// ===== main.js =====
import Calculator from './modules/calculator.js';
import Logger from './modules/logger.js';

const calc = new Calculator();
const logger = new Logger();

try {
  const result = calc.calculate('add', 10, 5);
  logger.log(\`Result: \${result}\`);
  document.getElementById('result').textContent = \`Result: \${result}\`;
} catch (error) {
  logger.error(error.message);
}

// Dynamic import example
async function loadAdvancedMath() {
  const { sqrt, pow } = await import('./modules/advanced-math.js');
  logger.log('Advanced math loaded');
}
`;

console.log(completeExample);

// ====================================================
// 11. COMMON PATTERNS AND BEST PRACTICES
// ====================================================
console.log('\n=== 11. BEST PRACTICES ===\n');

const bestPractices = `
✅ DO:
1. Use named exports for multiple utilities
2. Use default export for main module purpose
3. Place imports at the top of the file
4. Use static imports when possible
5. Use relative paths (./  or ../) for local modules
6. Keep modules focused and single-purpose
7. Use re-exports to create clean public APIs
8. Use dynamic imports for code splitting
9. Test with a local development server

❌ DON'T:
1. Don't use bare module specifiers (unless using bundler)
2. Don't mix CommonJS and ES6 in same file
3. Don't export mutable values
4. Don't use circular dependencies
5. Don't put logic at module top level (use init functions)

// Good: Named exports for utilities
export function formatDate(date) { }
export function parseDate(str) { }

// Good: Default export for main class
export default class DateFormatter { }

// Good: Static import at top
import { formatDate } from './utils.js';

// Good: Dynamic import for lazy loading
button.onclick = () => import('./chart.js').then(chart => chart.draw());

// Bad: Bare module specifier (not standard)
import _ from 'lodash'; // Works in bundlers only

// Bad: Mutable export
export let counter = 0; // Avoid
export function increment() { counter++; } // Avoid

// Good: Immutable export
let counter = 0;
export function getCounter() { return counter; }
export function increment() { counter++; }
`;

console.log(bestPractices);

// ====================================================
// 12. TROUBLESHOOTING
// ====================================================
console.log('\n=== 12. COMMON ISSUES ===\n');

const troubleshooting = `
❌ CORS Error:
Problem: "Access to script blocked by CORS policy"
Solution: Use a local development server (not file://)
  - Python: python -m http.server
  - Node: npx serve
  - VS Code: Live Server extension

❌ Module Not Found:
Problem: "Failed to resolve module specifier"
Solution: Use ./ or ../ prefix
  - Wrong: import x from 'utils.js'
  - Right: import x from './utils.js'

❌ Bare Module Specifier:
Problem: import x from 'lodash' doesn't work
Solution: Use bundler (webpack) or import maps
  - Or use full URL: import x from 'https://cdn.com/lodash.js'

❌ Circular Dependencies:
Problem: Module A imports B, B imports A
Solution: Restructure code or use dynamic imports
  - Extract shared code to third module
  - Use dynamic import() to break cycle

❌ This is undefined:
Problem: this is undefined in module top level
Solution: This is expected behavior in modules
  - Use globalThis for global object if needed
  - Or use window (browser) / global (Node)

❌ Import in Node.js not working:
Problem: SyntaxError: Cannot use import statement
Solution: Use .mjs extension or "type": "module" in package.json
`;

console.log(troubleshooting);

console.log('\n=== DEMO COMPLETE ===');
console.log('\nTo actually use ES6 modules:');
console.log('1. Create separate .js files for each module');
console.log('2. Use a local development server');
console.log("3. Load with <script type='module'>");
console.log('4. Check browser console for any CORS errors');
console.log('\nHappy coding with ES6 modules! 🚀');
