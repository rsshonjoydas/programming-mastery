// toLocaleString() = returns a string with a language sensitive
//                    representation of this number

// number.toLocaleString(locale, {options})

// 'locale' = specify that language (undefined = default set in browser)
// 'options' = object with formatting options

let myNum = 123456.789;

myNum = myNum.toLocaleString('en-US'); // English US
myNum = myNum.toLocaleString('bn-BD'); // Bengali Bangladesh
myNum = myNum.toLocaleString('hi-IN'); // Hindi India
myNum = myNum.toLocaleString('de-DE'); // standard German

myNum = myNum.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
myNum = myNum.toLocaleString('bn-BD', { style: 'currency', currency: 'BDT' });
myNum = myNum.toLocaleString('hi-IN', { style: 'currency', currency: 'INR' });
myNum = myNum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

myNum = myNum.toLocaleString(undefined, { style: 'percent' });
myNum = myNum.toLocaleString(undefined, { style: 'decimal' });
myNum = myNum.toLocaleString(undefined, { style: 'unit', unit: 'celsius' });

console.log(myNum);
