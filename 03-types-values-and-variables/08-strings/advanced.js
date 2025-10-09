// ============================================
// ADVANCED STRING MANIPULATION EXAMPLES
// ============================================

// String Literals & Type Detection
const name = 'John';
const age = 31;

console.log(`Type of name: ${typeof name}`); // 'string'

// ============================================
// MULTI-LINE STRINGS & ESCAPING
// ============================================

const multiLineStrings = {
  twoLinesOnOne: 'two\nlines',
  oneLongLine:
    'one\
  long\
  line',
  templateLiteral: `the newline character at the end of this line
is included literally in this string`,
  rawVsProcessed: {
    processed: `\n`.length, // 1 (newline character)
    raw: String.raw`\n`.length, // 2 (backslash + n)
  },
};

console.log('Multi-line examples:', multiLineStrings);

// ============================================
// STRING CONCATENATION
// ============================================

// Traditional vs Template Literals
const traditionalConcat =
  'Hello, my name is ' + name + ' and I am ' + age + ' years old';
const modernTemplate = `Hello, my name is ${name} and I am ${age} years old`;

console.log({ traditionalConcat, modernTemplate });

// ============================================
// COMPREHENSIVE STRING API DEMONSTRATION
// ============================================

const sampleText = 'Hello, world';

// String information
const stringInfo = {
  length: sampleText.length,
  type: typeof sampleText,
  firstChar: sampleText[0],
  lastChar: sampleText[sampleText.length - 1],
};

// Extraction methods
const extraction = {
  substring: sampleText.substring(1, 4), // "ell"
  slice: sampleText.slice(1, 4), // "ell"
  sliceNegative: sampleText.slice(-3), // "rld"
  split: sampleText.split(', '), // ["Hello", "world"]
  splitJoin: sampleText.split(' ').join('-'), // "Hello,-world"
};

// Search methods
const searching = {
  indexOf: sampleText.indexOf('l'), // 2
  indexOfWithStart: sampleText.indexOf('l', 3), // 3
  notFound: sampleText.indexOf('zz'), // -1
  lastIndexOf: sampleText.lastIndexOf('l'), // 10
  startsWith: sampleText.startsWith('Hell'), // true
  endsWith: sampleText.endsWith('!'), // false
  includes: sampleText.includes('or'), // true
};

// Transformation methods
const transformations = {
  replace: sampleText.replace('llo', 'y'), // "Hey, world"
  toLowerCase: sampleText.toLowerCase(),
  toUpperCase: sampleText.toUpperCase(),
  normalize: sampleText.normalize(), // NFC normalization
  normalizeNFD: sampleText.normalize('NFD'),
};

// Character inspection
const charInspection = {
  charAt: sampleText.charAt(0), // "H"
  charCodeAt: sampleText.charCodeAt(0), // 72
  codePointAt: sampleText.codePointAt(0), // 72 (ES6)
};

// Padding (ES2017)
const padding = {
  padStart: 'x'.padStart(3), // "  x"
  padEnd: 'x'.padEnd(3), // "x  "
  padStartCustom: 'x'.padStart(3, '*'), // "**x"
  padEndCustom: 'x'.padEnd(3, '-'), // "x--"
};

// Trimming (ES2019)
const trimming = {
  trim: ' test '.trim(), // "test"
  trimStart: ' test '.trimStart(), // "test "
  trimEnd: ' test '.trimEnd(), // " test"
};

// Miscellaneous
const misc = {
  concat: sampleText.concat('!'), // "Hello, world!"
  repeat: '<>'.repeat(5), // "<><><><><>"
  valueOf: sampleText.valueOf(),
};

console.log({
  stringInfo,
  extraction,
  searching,
  transformations,
  charInspection,
  padding,
  trimming,
  misc,
});

// ============================================
// PRACTICAL STRING PARSING UTILITY
// ============================================

class StringParser {
  /**
   * Parse full name into components
   */
  static parseFullName(fullName) {
    const spaceIndex = fullName.indexOf(' ');
    return {
      firstName: fullName.slice(0, spaceIndex),
      lastName: fullName.slice(spaceIndex + 1),
      firstInitial: fullName[0],
      lastInitial: fullName[spaceIndex + 1],
    };
  }

  /**
   * Parse email into components
   */
  static parseEmail(email) {
    const atIndex = email.indexOf('@');
    return {
      username: email.slice(0, atIndex),
      domain: email.slice(atIndex + 1),
      topLevelDomain: email.slice(email.lastIndexOf('.') + 1),
    };
  }

  /**
   * Capitalize text using various strategies
   */
  static capitalize(text, strategy = 'first') {
    const strategies = {
      first: () => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      all: () => text.toUpperCase(),
      words: () =>
        text
          .split(' ')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' '),
      toggle: () =>
        text
          .split('')
          .map((char, i) =>
            i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
          )
          .join(''),
    };

    return strategies[strategy]?.() || text;
  }

  /**
   * Advanced string slicing with validation
   */
  static safeSlice(str, start, end = str.length) {
    const normalized = {
      start:
        start < 0
          ? Math.max(str.length + start, 0)
          : Math.min(start, str.length),
      end: end < 0 ? Math.max(str.length + end, 0) : Math.min(end, str.length),
    };
    return str.slice(normalized.start, normalized.end);
  }

  /**
   * Sanitize and format username
   */
  static sanitizeUsername(username) {
    return username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20);
  }

  /**
   * Format username with proper casing (method chaining example)
   */
  static formatUsername(username) {
    const trimmed = username.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }
}

// ============================================
// USAGE EXAMPLES
// ============================================

const fullName = 'Shonjoy Das';
const email = 'shonjoy@gmail.com';
const rawUsername = '  ShOnJoY  ';

console.log('\n--- String Parser Examples ---');
console.log('Name parsing:', StringParser.parseFullName(fullName));
console.log('Email parsing:', StringParser.parseEmail(email));
console.log('Capitalize (first):', StringParser.capitalize('hello world'));
console.log(
  'Capitalize (words):',
  StringParser.capitalize('hello world', 'words')
);
console.log(
  'Capitalize (toggle):',
  StringParser.capitalize('hello world', 'toggle')
);
console.log('Safe slice:', StringParser.safeSlice('Hello', -2, -1));
console.log('Sanitized username:', StringParser.sanitizeUsername(rawUsername));
console.log('Formatted username:', StringParser.formatUsername(rawUsername));

// ============================================
// EXTRACTION METHOD COMPARISON
// ============================================

const comparisonText = 'Apple, Banana, Kiwi';

const extractionComparison = {
  slice: {
    description: 'Can use negative indices, counts from end',
    examples: {
      positiveIndices: comparisonText.slice(7, 13), // "Banana"
      negativeIndices: comparisonText.slice(-12, -6), // "Banana"
      fromIndex: comparisonText.slice(7), // "Banana, Kiwi"
    },
  },
  substring: {
    description: 'Similar to slice but cannot accept negative indices',
    examples: {
      standard: comparisonText.substring(7, 13), // "Banana"
      swapsIfStartGreater: comparisonText.substring(13, 7), // "Banana"
    },
  },
  substr: {
    description: 'DEPRECATED: Second param is length, not end position',
    examples: {
      withLength: comparisonText.substr(7, 6), // "Banana"
    },
  },
};

console.log('\n--- Extraction Methods Comparison ---');
console.log(JSON.stringify(extractionComparison, null, 2));

// ============================================
// ADVANCED METHOD CHAINING PATTERNS
// ============================================

class ChainableString {
  constructor(value) {
    this.value = value;
  }

  trim() {
    this.value = this.value.trim();
    return this;
  }

  capitalize() {
    this.value =
      this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();
    return this;
  }

  reverse() {
    this.value = this.value.split('').reverse().join('');
    return this;
  }

  removeSpaces() {
    this.value = this.value.replace(/\s+/g, '');
    return this;
  }

  addPrefix(prefix) {
    this.value = prefix + this.value;
    return this;
  }

  addSuffix(suffix) {
    this.value = this.value + suffix;
    return this;
  }

  get() {
    return this.value;
  }
}

// Usage with fluent interface
const chainedResult = new ChainableString('  hello world  ')
  .trim()
  .capitalize()
  .removeSpaces()
  .addPrefix('Welcome_')
  .addSuffix('_2024')
  .get();

console.log('\n--- Advanced Method Chaining ---');
console.log('Chained result:', chainedResult);

// ============================================
// PERFORMANCE & BEST PRACTICES
// ============================================

const bestPractices = {
  immutability: 'Strings are immutable - methods return new strings',
  concatenation: 'Use template literals over + operator for readability',
  comparison: 'Use === for strict equality without type coercion',
  modernMethods: 'Prefer startsWith/endsWith/includes over indexOf checks',
  methodChaining: 'Chain methods for cleaner code, but maintain readability',
  extraction: 'slice() is most versatile; avoid deprecated substr()',
};

console.log('\n--- Best Practices ---');
console.log(bestPractices);
