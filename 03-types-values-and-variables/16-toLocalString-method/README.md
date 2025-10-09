# JavaScript `toLocaleString()` Method

The `toLocaleString()` method converts numbers, dates, and arrays to locale-sensitive strings. Here's everything you need to know:

## **Number.prototype.toLocaleString()**

Formats numbers according to locale conventions (currency, decimals, separators, etc.).

**Syntax:**

```javascript
number.toLocaleString(locales, options);
```

**Common Examples:**

```javascript
const num = 1234567.89;

// Default locale
num.toLocaleString(); // "1,234,567.89" (US) or "1.234.567,89" (Germany)

// Specific locale
num.toLocaleString('de-DE'); // "1.234.567,89"
num.toLocaleString('en-IN'); // "12,34,567.89"

// Currency formatting
num.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
}); // "$1,234,567.89"

// Percentage
(0.45).toLocaleString('en-US', {
  style: 'percent',
}); // "45%"

// Custom decimal places
num.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
}); // "1,234,567.89"
```

**Key Options:**

- `style`: `'decimal'` (default), `'currency'`, `'percent'`, `'unit'`
- `currency`: Currency code (e.g., `'USD'`, `'EUR'`, `'GBP'`)
- `minimumFractionDigits` / `maximumFractionDigits`: Control decimal places
- `useGrouping`: Enable/disable digit grouping (default: `true`)

## **Date.prototype.toLocaleString()**

Formats dates and times according to locale conventions.

**Syntax:**

```javascript
date.toLocaleString(locales, options);
```

**Examples:**

```javascript
const date = new Date('2025-10-10T14:30:00');

// Default
date.toLocaleString(); // "10/10/2025, 2:30:00 PM" (US)

// Different locales
date.toLocaleString('en-GB'); // "10/10/2025, 14:30:00"
date.toLocaleString('ja-JP'); // "2025/10/10 14:30:00"

// Custom formatting
date.toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}); // "Friday, October 10, 2025 at 02:30 PM"

// Time only
date.toLocaleString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}); // "02:30:00 PM"
```

**Key Options:**

- `weekday`: `'narrow'`, `'short'`, `'long'`
- `year`: `'numeric'`, `'2-digit'`
- `month`: `'numeric'`, `'2-digit'`, `'narrow'`, `'short'`, `'long'`
- `day`: `'numeric'`, `'2-digit'`
- `hour`, `minute`, `second`: `'numeric'`, `'2-digit'`
- `timeZone`: IANA time zone name (e.g., `'America/New_York'`)
- `hour12`: Boolean for 12/24 hour format

## **Array.prototype.toLocaleString()**

Converts array elements to strings using their `toLocaleString()` methods.

**Example:**

```javascript
const arr = [1234.5, new Date('2025-10-10'), 'Hello'];

arr.toLocaleString('en-US');
// "1,234.5,10/10/2025, 12:00:00 AM,Hello"

arr.toLocaleString('de-DE');
// "1.234,5,10.10.2025, 00:00:00,Hello"
```

## **Browser Compatibility**

Fully supported in all modern browsers. The `locales` and `options` parameters are supported in IE11+ and all evergreen browsers.

## **Common Use Cases**

- Displaying prices in user's currency format
- Showing dates/times in user's locale
- Formatting large numbers with appropriate separators
- Creating internationalized (i18n) applications
- Displaying percentages and units
