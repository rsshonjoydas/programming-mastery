// ============================
// JAVASCRIPT STRINGS AS ARRAYS
// ============================

console.log('=== 1. CHARACTER ACCESS ===\n');

let s = 'test';

// Traditional method: charAt()
console.log('Using charAt():');
console.log('s.charAt(0):', s.charAt(0)); // "t"
console.log('s.charAt(1):', s.charAt(1)); // "e"
console.log('s.charAt(3):', s.charAt(3)); // "t"

// Array-style access (preferred)
console.log('\nUsing bracket notation:');
console.log('s[0]:', s[0]); // "t"
console.log('s[1]:', s[1]); // "e"
console.log('s[3]:', s[3]); // "t"

// Out-of-bounds access
console.log('\nOut-of-bounds access:');
console.log('s[10]:', s[10]); // undefined
console.log('s.charAt(10):', s.charAt(10)); // "" (empty string)

console.log('\n=== 2. STRINGS ARE NOT ACTUALLY ARRAYS ===\n');

let str = 'hello';

console.log('Type checking:');
console.log('typeof str:', typeof str); // "string"
console.log('Array.isArray(str):', Array.isArray(str)); // false
console.log('str instanceof Array:', str instanceof Array); // false

console.log('\nBut they behave like arrays:');
console.log('str.length:', str.length); // 5
console.log('str[0]:', str[0]); // "h"

console.log('\n=== 3. STRING LENGTH ===\n');

let word = 'JavaScript';
console.log('word:', word);
console.log('word.length:', word.length); // 10

// Attempting to modify length (fails silently)
console.log('\nTrying to modify length:');
word.length = 5;
console.log('After word.length = 5:');
console.log('word:', word); // "JavaScript" (unchanged)
console.log('word.length:', word.length); // 10

console.log('\n=== 4. ITERATING OVER STRINGS ===\n');

let greeting = 'Hello';

// Method 1: for loop (array-style)
console.log('Method 1: for loop');
for (let i = 0; i < greeting.length; i++) {
  console.log(`  greeting[${i}]: ${greeting[i]}`);
}

// Method 2: for...of loop (ES6)
console.log('\nMethod 2: for...of loop');
for (let char of greeting) {
  console.log(`  ${char}`);
}

// Method 3: forEach with spread
console.log('\nMethod 3: forEach with spread');
[...greeting].forEach((char, i) => {
  console.log(`  Index ${i}: ${char}`);
});

console.log('\n=== 5. APPLYING ARRAY METHODS TO STRINGS ===\n');

// join()
console.log('Array.prototype.join:');
let spaced = Array.prototype.join.call('JavaScript', ' ');
console.log('Result:', spaced); // "J a v a S c r i p t"

// Using spread operator (cleaner)
console.log('\nUsing spread operator:');
let spaced2 = [...'JavaScript'].join(' ');
console.log('Result:', spaced2); // "J a v a S c r i p t"

// filter()
console.log('\nArray.prototype.filter:');
let filtered = [...'hello'].filter((char) => char !== 'l').join('');
console.log("'hello' without 'l':", filtered); // "heo"

// map()
console.log('\nArray.prototype.map:');
let upper = [...'hello'].map((char) => char.toUpperCase()).join('');
console.log("'hello' to uppercase:", upper); // "HELLO"

// every()
console.log('\nArray.prototype.every:');
let allLower = Array.prototype.every.call(
  'hello',
  (char) => char === char.toLowerCase()
);
console.log("All chars lowercase in 'hello'?", allLower); // true

// some()
console.log('\nArray.prototype.some:');
let hasUpper = Array.prototype.some.call(
  'hello',
  (char) => char === char.toUpperCase()
);
console.log("Any uppercase in 'hello'?", hasUpper); // false

// reduce()
console.log('\nArray.prototype.reduce:');
let vowelCount = Array.prototype.reduce.call(
  'javascript',
  (count, char) => {
    return 'aeiou'.includes(char) ? count + 1 : count;
  },
  0
);
console.log("Vowels in 'javascript':", vowelCount); // 3

console.log('\n=== 6. STRINGS ARE IMMUTABLE (READ-ONLY) ===\n');

let text = 'hello';
console.log('Original text:', text);

// These mutating methods fail silently
console.log('\nTrying mutating array methods:');

console.log("Attempting Array.prototype.push.call(text, '!')");
Array.prototype.push.call(text, '!');
console.log('Result:', text); // "hello" (unchanged)

console.log('\nAttempting Array.prototype.reverse.call(text)');
Array.prototype.reverse.call(text);
console.log('Result:', text); // "hello" (unchanged)

console.log('\nAttempting Array.prototype.sort.call(text)');
Array.prototype.sort.call(text);
console.log('Result:', text); // "hello" (unchanged)

// Working around immutability
console.log('\n\nWorking around immutability:');
let reversed = [...text].reverse().join('');
console.log('Reversed using spread:', reversed); // "olleh"

let sorted = [...text].sort().join('');
console.log('Sorted using spread:', sorted); // "ehllo"

console.log('Original text still:', text); // "hello"

console.log('\n=== 7. CONVERTING STRINGS TO ARRAYS ===\n');

let sample = 'hello';

// Method 1: Spread operator
console.log('Method 1: Spread operator');
let arr1 = [...sample];
console.log('Result:', arr1);

// Method 2: Array.from()
console.log('\nMethod 2: Array.from()');
let arr2 = Array.from(sample);
console.log('Result:', arr2);

// Method 3: split()
console.log("\nMethod 3: split('')");
let arr3 = sample.split('');
console.log('Result:', arr3);

console.log('\n=== 8. PRACTICAL EXAMPLES ===\n');

// Example 1: Check if palindrome
function isPalindrome(str) {
  let reversed = [...str].reverse().join('');
  return str === reversed;
}

console.log('Example 1: Palindrome checker');
console.log("isPalindrome('racecar'):", isPalindrome('racecar'));
console.log("isPalindrome('hello'):", isPalindrome('hello'));

// Example 2: Count character occurrences
function countChar(str, char) {
  return [...str].filter((c) => c === char).length;
}

console.log('\nExample 2: Count character');
console.log("countChar('hello', 'l'):", countChar('hello', 'l'));
console.log("countChar('javascript', 'a'):", countChar('javascript', 'a'));

// Example 3: Capitalize each word
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

console.log('\nExample 3: Capitalize words');
console.log("Input: 'hello world'");
console.log('Output:', capitalizeWords('hello world'));

// Example 4: Remove duplicate characters
function removeDuplicates(str) {
  return [...new Set(str)].join('');
}

console.log('\nExample 4: Remove duplicates');
console.log("removeDuplicates('hello'):", removeDuplicates('hello'));
console.log("removeDuplicates('javascript'):", removeDuplicates('javascript'));

// Example 5: Find most common character
function mostCommon(str) {
  let counts = {};

  for (let char of str) {
    counts[char] = (counts[char] || 0) + 1;
  }

  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

console.log('\nExample 5: Most common character');
console.log("mostCommon('javascript'):", mostCommon('javascript'));
console.log("mostCommon('hello'):", mostCommon('hello'));

// Example 6: Reverse words in sentence
function reverseWords(str) {
  return str
    .split(' ')
    .map((word) => [...word].reverse().join(''))
    .join(' ');
}

console.log('\nExample 6: Reverse each word');
console.log("Input: 'hello world'");
console.log('Output:', reverseWords('hello world'));

// Example 7: Count vowels and consonants
function countVowelsConsonants(str) {
  let vowels = 0;
  let consonants = 0;
  let vowelSet = 'aeiouAEIOU';

  for (let char of str) {
    if (/[a-zA-Z]/.test(char)) {
      if (vowelSet.includes(char)) {
        vowels++;
      } else {
        consonants++;
      }
    }
  }

  return { vowels, consonants };
}

console.log('\nExample 7: Count vowels/consonants');
let counts = countVowelsConsonants('JavaScript');
console.log("'JavaScript':", counts);

// Example 8: Remove specific characters
function removeChars(str, charsToRemove) {
  return [...str].filter((char) => !charsToRemove.includes(char)).join('');
}

console.log('\nExample 8: Remove specific characters');
console.log(
  "removeChars('hello world', 'lo'):",
  removeChars('hello world', 'lo')
);

// Example 9: Check if anagram
function isAnagram(str1, str2) {
  let sorted1 = [...str1.toLowerCase()].sort().join('');
  let sorted2 = [...str2.toLowerCase()].sort().join('');
  return sorted1 === sorted2;
}

console.log('\nExample 9: Anagram checker');
console.log("isAnagram('listen', 'silent'):", isAnagram('listen', 'silent'));
console.log("isAnagram('hello', 'world'):", isAnagram('hello', 'world'));

// Example 10: Get character frequency
function charFrequency(str) {
  let freq = {};

  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

console.log('\nExample 10: Character frequency');
console.log("charFrequency('hello'):", charFrequency('hello'));

console.log('\n=== 9. UNICODE CONSIDERATIONS ===\n');

let emoji = '😀';
console.log('Emoji string:', emoji);
console.log('emoji.length:', emoji.length); // 2 (UTF-16 code units)
console.log('emoji[0]:', emoji[0]); // High surrogate
console.log('emoji[1]:', emoji[1]); // Low surrogate

console.log('\nProper Unicode handling:');
console.log('[...emoji].length:', [...emoji].length); // 1
console.log('Array.from(emoji):', Array.from(emoji)); // ["😀"]

let multiEmoji = '😀🎉👍';
console.log('\nMultiple emojis:', multiEmoji);
console.log('String length:', multiEmoji.length); // 6 (not 3!)
console.log('Actual character count:', [...multiEmoji].length); // 3

console.log('\nIterating properly:');
for (let char of multiEmoji) {
  console.log('  Character:', char);
}

console.log('\n=== 10. STRING VS ARRAY METHOD COMPARISON ===\n');

let testStr = 'JavaScript';

console.log('Original string:', testStr);

console.log('\nString methods:');
console.log('charAt(0):', testStr.charAt(0));
console.log('length:', testStr.length);
console.log('toUpperCase():', testStr.toUpperCase());
console.log('toLowerCase():', testStr.toLowerCase());
console.log('slice(0, 4):', testStr.slice(0, 4));
console.log("split(''):", testStr.split(''));

console.log('\nArray-style operations:');
console.log('testStr[0]:', testStr[0]);
console.log('testStr.length:', testStr.length);
console.log('[...testStr]:', [...testStr]);
console.log('Reversed:', [...testStr].reverse().join(''));
console.log('Sorted:', [...testStr].sort().join(''));
console.log('Filtered:', [...testStr].filter((c) => c !== 'a').join(''));

console.log('\n=== 11. PERFORMANCE COMPARISON ===\n');

let longStr = 'a'.repeat(10000);

console.log('Testing performance with string of length:', longStr.length);

// charAt vs bracket notation
console.time('charAt() access');
for (let i = 0; i < longStr.length; i++) {
  let char = longStr.charAt(i);
}
console.timeEnd('charAt() access');

console.time('Bracket [] access');
for (let i = 0; i < longStr.length; i++) {
  let char = longStr[i];
}
console.timeEnd('Bracket [] access');

// for vs for...of
console.time('for loop');
for (let i = 0; i < longStr.length; i++) {
  let char = longStr[i];
}
console.timeEnd('for loop');

console.time('for...of loop');
for (let char of longStr) {
  // Access character
}
console.timeEnd('for...of loop');

console.log('\n=== COMPLETE! ===');
console.log('All string-as-array concepts demonstrated successfully!');
