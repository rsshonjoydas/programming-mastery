# JavaScript Internationalization API

The **Internationalization API** (Intl API) enables locale-aware formatting of numbers, dates, times, and string comparison. It's defined in the **ECMA-402** standard and is well-supported in browsers and Node.js.

## Overview

The Intl API consists of three main classes:

| Class                   | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| **Intl.NumberFormat**   | Format numbers, currencies, and percentages         |
| **Intl.DateTimeFormat** | Format dates and times                              |
| **Intl.Collator**       | Compare and sort strings in locale-appropriate ways |

**Note**: The Intl API does **not** handle text translation—only formatting and comparison.

---

## 1. Intl.NumberFormat - Formatting Numbers

Formats numbers according to locale-specific conventions (decimal points, thousands separators, currency symbols, digit scripts).

### Basic Usage

```javascript
let formatter = new Intl.NumberFormat(locale, options);
let result = formatter.format(number);
```

### Constructor Arguments

1. **locale** (string or array):

   - Locale identifier like `"en-US"`, `"fr"`, `"zh-Hans-CN"`
   - Array of locales (most specific supported one is chosen)
   - `undefined` uses system/user locale

2. **options** (object): Configuration properties

### Options

| Property                     | Description                                 | Values                                           |
| ---------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **style**                    | Type of formatting                          | `"decimal"` (default), `"percent"`, `"currency"` |
| **currency**                 | Currency code (required for currency style) | `"USD"`, `"EUR"`, `"GBP"`, etc.                  |
| **currencyDisplay**          | How to display currency                     | `"symbol"` (default), `"code"`, `"name"`         |
| **useGrouping**              | Use thousands separators                    | `true` (default), `false`                        |
| **minimumIntegerDigits**     | Minimum integer digits (pad with zeros)     | 1–21 (default: 1)                                |
| **minimumFractionDigits**    | Minimum fractional digits                   | 0–20 (default: 0)                                |
| **maximumFractionDigits**    | Maximum fractional digits                   | 0–20 (default: 3)                                |
| **minimumSignificantDigits** | Minimum significant digits                  | 1–21                                             |
| **maximumSignificantDigits** | Maximum significant digits                  | 1–21                                             |

### Examples

**Currency formatting**:

```javascript
let euros = Intl.NumberFormat('es', {
  style: 'currency',
  currency: 'EUR',
});
euros.format(10); // "10,00 €"

let pounds = Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'GBP',
});
pounds.format(1000); // "£1,000.00"
```

**Percentage formatting**:

```javascript
let data = [0.05, 0.75, 1];
let formatData = Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format;

data.map(formatData); // ["5.0%", "75.0%", "100.0%"]
```

**Different number scripts**:

```javascript
// Arabic digits
let arabic = Intl.NumberFormat('ar', { useGrouping: false }).format;
arabic(1234567890); // "١٢٣٤٥٦٧٨٩٠"

// Devanagari digits with Indian grouping
let hindi = Intl.NumberFormat('hi-IN-u-nu-deva').format;
hindi(1234567890); // "१,२३,४५,६७,८९०"
```

**Unicode extension syntax**: `-u-nu-` specifies numbering system

- `deva` = Devanagari
- Other systems: `arab`, `thai`, `beng` (Bengali), etc.

### Bound format() Method

The `format()` method is automatically bound to its NumberFormat instance, so you can use it directly:

```javascript
let formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
let prices = [9.99, 29.99, 99.99];
prices.map(formatter.format); // ["$9.99", "$29.99", "$99.99"]
```

---

## 2. Intl.DateTimeFormat - Formatting Dates and Times

Formats dates and times with fine-grained control over which fields to display and how.

### **Basic Usage**

```javascript
let formatter = new Intl.DateTimeFormat(locale, options);
let result = formatter.format(dateObject);
```

### **Constructor Arguments**

Same as NumberFormat: locale (string/array) and options (object)

### **Options**

Specify only the fields you want to display:

| Property         | Description             | Values                                                    |
| ---------------- | ----------------------- | --------------------------------------------------------- |
| **year**         | Year format             | `"numeric"` (4-digit), `"2-digit"`                        |
| **month**        | Month format            | `"numeric"`, `"2-digit"`, `"long"`, `"short"`, `"narrow"` |
| **day**          | Day of month            | `"numeric"`, `"2-digit"`                                  |
| **weekday**      | Day of week             | `"long"`, `"short"`, `"narrow"`                           |
| **era**          | Era display             | `"long"`, `"short"`, `"narrow"`                           |
| **hour**         | Hour format             | `"numeric"`, `"2-digit"`                                  |
| **minute**       | Minute format           | `"numeric"`, `"2-digit"`                                  |
| **second**       | Second format           | `"numeric"`, `"2-digit"`                                  |
| **timeZone**     | Time zone               | `"UTC"`, IANA names like `"America/Los_Angeles"`          |
| **timeZoneName** | Time zone display       | `"long"`, `"short"`                                       |
| **hour12**       | 12-hour time            | `true`, `false`                                           |
| **hourCycle**    | Midnight representation | `"h11"`, `"h12"`, `"h23"`, `"h24"`                        |

### **Examples**

**Basic date formatting**:

```javascript
let d = new Date('2020-01-02T13:14:15Z');

Intl.DateTimeFormat('en-US').format(d); // "1/2/2020"
Intl.DateTimeFormat('fr-FR').format(d); // "02/01/2020"
```

**Custom date format**:

```javascript
let opts = {
  weekday: 'long',
  month: 'long',
  year: 'numeric',
  day: 'numeric',
};

Intl.DateTimeFormat('en-US', opts).format(d);
// "Thursday, January 2, 2020"

Intl.DateTimeFormat('es-ES', opts).format(d);
// "jueves, 2 de enero de 2020"
```

**Time with timezone**:

```javascript
let opts = {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York',
};

Intl.DateTimeFormat('fr-CA', opts).format(d); // "8 h 14"
```

### Different Calendar Systems

Use `-u-ca-` in locale to specify calendar:

```javascript
let d = new Date('2020-01-02T13:14:15Z');
let opts = { year: 'numeric', era: 'short' };

Intl.DateTimeFormat('en', opts).format(d);
// "2020 AD"

Intl.DateTimeFormat('en-u-ca-hebrew', opts).format(d);
// "5780 AM"

Intl.DateTimeFormat('en-u-ca-buddhist', opts).format(d);
// "2563 BE"

Intl.DateTimeFormat('en-u-ca-islamic', opts).format(d);
// "1441 AH"

Intl.DateTimeFormat('en-u-ca-chinese', opts).format(d);
// "36 78"

Intl.DateTimeFormat('en-u-ca-japanese', opts).format(d);
// "2 Reiwa"
```

**Available calendars**: `buddhist`, `chinese`, `coptic`, `ethiopic`, `gregory`, `hebrew`, `indian`, `islamic`, `iso8601`, `japanese`, `persian`

---

## 3. Intl.Collator - Comparing and Sorting Strings

Performs locale-aware string comparison for proper alphabetical sorting.

### Why It's Needed

Different languages have different collation rules:

- Spanish: `ñ` comes after `n`, before `o`
- Lithuanian: `Y` comes before `J`
- Welsh: `CH` and `DD` are treated as single letters
- Many languages treat accented characters differently

### Basic Usage

```javascript
let collator = new Intl.Collator(locale, options);
let result = collator.compare(string1, string2);
```

**compare() returns**:

- **< 0**: string1 comes before string2
- **0**: strings are equal
- **> 0**: string1 comes after string2

### Options

| Property              | Description                   | Values                                                |
| --------------------- | ----------------------------- | ----------------------------------------------------- |
| **usage**             | How collator is used          | `"sort"` (default), `"search"`                        |
| **sensitivity**       | Case/accent sensitivity       | `"base"`, `"accent"`, `"case"`, `"variant"` (default) |
| **ignorePunctuation** | Ignore spaces and punctuation | `true`, `false` (default)                             |
| **numeric**           | Numerical sorting             | `true`, `false` (default)                             |
| **caseFirst**         | Which case comes first        | `"upper"`, `"lower"`                                  |

**Sensitivity levels**:

- `"base"`: Ignores case and accents (a = A = á = Á)
- `"accent"`: Considers accents, ignores case (a = A, á = Á, a ≠ á)
- `"case"`: Considers case, ignores accents (a ≠ A, á ≠ Á, a = á)
- `"variant"`: Strict comparison (a ≠ A ≠ á ≠ Á)

### Examples

**Basic sorting**:

```javascript
const collator = new Intl.Collator().compare;
['a', 'z', 'A', 'Z'].sort(collator); // ["a", "A", "z", "Z"]
```

**Numeric sorting**:

```javascript
const filenameOrder = new Intl.Collator(undefined, {
  numeric: true,
}).compare;

['page10', 'page9'].sort(filenameOrder); // ["page9", "page10"]
```

**Fuzzy matching**:

```javascript
const fuzzyMatcher = new Intl.Collator(undefined, {
  sensitivity: 'base',
  ignorePunctuation: true,
}).compare;

let strings = ['food', 'fool', 'Føø Bar'];
strings.findIndex((s) => fuzzyMatcher(s, 'foobar') === 0); // 2
```

**Locale-specific sorting**:

```javascript
// Spanish: traditional vs modern
const modernSpanish = Intl.Collator('es-ES').compare;
const traditionalSpanish = Intl.Collator('es-ES-u-co-trad').compare;

let palabras = ['luz', 'llama', 'como', 'chico'];

palabras.sort(modernSpanish);
// ["chico", "como", "llama", "luz"]

palabras.sort(traditionalSpanish);
// ["como", "chico", "luz", "llama"]
```

### Collation Variants

Use `-u-co-` to specify collation variant:

- `"de-DE-u-co-phonebk"`: German phonebook order
- `"zh-TW-u-co-pinyin"`: Chinese Pinyin order
- `"es-ES-u-co-trad"`: Spanish traditional order

---

## Locale String Format

Locale strings follow the **BCP 47** format:

```text
language[-script][-region][-u-extension]
```

**Examples**:

- `"en"` - English
- `"en-US"` - English (United States)
- `"zh-Hans-CN"` - Chinese, Simplified script, China
- `"hi-IN-u-nu-deva"` - Hindi (India) with Devanagari numerals
- `"es-ES-u-co-trad"` - Spanish (Spain) with traditional collation

**Unicode extensions** (`-u-`):

- `-u-nu-`: Numbering system (`deva`, `arab`, `thai`)
- `-u-ca-`: Calendar (`gregory`, `buddhist`, `islamic`)
- `-u-co-`: Collation order (`phonebk`, `pinyin`, `trad`)

---

## Common Patterns

### Binding format/compare methods

All Intl classes bind their methods automatically:

```javascript
// Can use directly without wrapper
let numbers = [1000, 2000, 3000];
let formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

numbers.map(formatter.format); // Works!
```

### System locale

Pass `undefined` to use the user's system locale:

```javascript
let formatter = Intl.NumberFormat(undefined, { style: 'percent' });
```

### Locale fallback

Pass an array of locales; most specific supported one is used:

```javascript
let formatter = Intl.NumberFormat(['ban', 'id'], {
  style: 'currency',
  currency: 'IDR',
});
```

---

## Browser and Node.js Support

**Browsers**: Well-supported in all modern browsers

**Node.js**:

- Supported, but prebuilt binaries may only include US English locale data
- May need to install additional data packages or use custom builds for full locale support

---

## Key Concepts Summary

✅ **Intl.NumberFormat**: Format numbers, currencies, and percentages with locale-specific conventions
✅ **Intl.DateTimeFormat**: Format dates and times with fine-grained control over displayed fields
✅ **Intl.Collator**: Sort and compare strings according to locale-specific rules
✅ **Locale strings**: Follow BCP 47 format (language-region-extensions)
✅ **Unicode extensions**: Customize numbering systems, calendars, and collation
✅ **Bound methods**: format() and compare() are pre-bound to their instances
✅ **System locale**: Use `undefined` to default to user's preferred locale
✅ **Not for translation**: Intl API handles formatting, not text translation
✅ **ECMA-402 standard**: Separate from ECMAScript but widely implemented
