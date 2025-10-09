// Symbols
// Symbols were introduced in ES6 to serve as non-string property names.

let x;

let strname = 'string name'; // A string to use as a property name
let symname = Symbol('propname'); // A Symbol to use as a property name

x = typeof strname; // => "string": strname is a string
x = typeof symname; // => "symbol": symname is a symbol

let o = {}; // Create a new object
o[strname] = 1; // Define a property with a string name
o[symname] = 2; // Define a property with a Symbol name

x = o[strname]; // => 1: access the string-named property
x = o[strname]; // => 2: access the symbol-named property

//  toString() is the only interesting method of Symbol instances.
let s = Symbol.for('shared');
let t = Symbol.for('shared');
x = s === t; // => true
x = s.toString(); // => "Symbol(shared)"
x = Symbol.keyFor(t); // => "shared"

console.log(x);
