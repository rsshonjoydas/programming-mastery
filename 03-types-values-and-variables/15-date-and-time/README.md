# JavaScript Date and Time

JavaScript's `Date` object is the primary way to work with dates and times. Here's a comprehensive guide:

## Creating Dates

```javascript
// Current date and time
const now = new Date();

// Specific date (month is 0-indexed: 0=Jan, 11=Dec)
const date1 = new Date(2025, 9, 10); // October 10, 2025

// From string
const date2 = new Date('2025-10-10');
const date3 = new Date('October 10, 2025');

// From timestamp (milliseconds since Jan 1, 1970)
const date4 = new Date(1728518400000);

// Specific date and time
const date5 = new Date(2025, 9, 10, 14, 30, 0); // Oct 10, 2025, 2:30 PM
```

## Getting Date Components

```javascript
const date = new Date();

date.getFullYear(); // 2025
date.getMonth(); // 9 (October, 0-indexed)
date.getDate(); // 10 (day of month)
date.getDay(); // 5 (Friday, 0=Sunday, 6=Saturday)
date.getHours(); // 0-23
date.getMinutes(); // 0-59
date.getSeconds(); // 0-59
date.getMilliseconds(); // 0-999
date.getTime(); // Timestamp in milliseconds
```

## Setting Date Components

```javascript
const date = new Date();

date.setFullYear(2026);
date.setMonth(11); // December
date.setDate(25);
date.setHours(12);
date.setMinutes(30);
date.setSeconds(45);
date.setMilliseconds(500);
date.setTime(1728518400000); // Set via timestamp
```

## UTC Methods

All getter/setter methods have UTC equivalents:

```javascript
date.getUTCFullYear();
date.getUTCMonth();
date.getUTCDate();
date.setUTCHours(12);
// etc.
```

## Formatting Dates

```javascript
const date = new Date();

date.toString(); // "Fri Oct 10 2025 00:00:00 GMT+0600"
date.toDateString(); // "Fri Oct 10 2025"
date.toTimeString(); // "00:00:00 GMT+0600"
date.toISOString(); // "2025-10-09T18:00:00.000Z"
date.toLocaleDateString(); // "10/10/2025" (locale-dependent)
date.toLocaleTimeString(); // "12:00:00 AM" (locale-dependent)
date.toLocaleString(); // "10/10/2025, 12:00:00 AM"
```

## Intl.DateTimeFormat (Modern Formatting)

```javascript
const date = new Date();

// Basic formatting
new Intl.DateTimeFormat('en-US').format(date);
// "10/10/2025"

// With options
new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(date);
// "Friday, October 10, 2025"

// Time formatting
new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
}).format(date);
```

## Date Arithmetic

```javascript
const date = new Date();

// Add days
date.setDate(date.getDate() + 7); // Add 7 days

// Add months
date.setMonth(date.getMonth() + 2); // Add 2 months

// Add years
date.setFullYear(date.getFullYear() + 1); // Add 1 year

// Difference between dates (in milliseconds)
const date1 = new Date('2025-10-10');
const date2 = new Date('2025-10-15');
const diff = date2 - date1; // 432000000 ms

// Convert to days
const days = diff / (1000 * 60 * 60 * 24); // 5 days
```

## Timestamps

```javascript
// Current timestamp
Date.now(); // Milliseconds since Jan 1, 1970

// From date object
const date = new Date();
date.getTime();
date.valueOf();
+date; // Coercion to number

// Parse string to timestamp
Date.parse('2025-10-10'); // 1728518400000
```

## Comparing Dates

```javascript
const date1 = new Date('2025-10-10');
const date2 = new Date('2025-10-15');

date1 < date2; // true
date1 > date2; // false
date1.getTime() === date2.getTime(); // false (exact comparison)
```

## Common Pitfalls

1. **Months are 0-indexed**: January is 0, December is 11
2. **Date mutability**: `Date` objects are mutable, so methods like `setDate()` modify the original
3. **Timezone issues**: `Date` objects store time in UTC but display in local timezone
4. **Date parsing inconsistency**: Parsing strings can behave differently across browsers; ISO 8601 format (`YYYY-MM-DD`) is most reliable

## Useful Patterns

```javascript
// Check if date is valid
const isValid = !isNaN(new Date('invalid').getTime());

// Clone a date
const clone = new Date(originalDate.getTime());

// Start of day
const startOfDay = new Date(date);
startOfDay.setHours(0, 0, 0, 0);

// End of day
const endOfDay = new Date(date);
endOfDay.setHours(23, 59, 59, 999);

// Days in month
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Is leap year
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
```

## Modern Alternatives

For complex date operations, consider using libraries like **Day.js**, **date-fns**, or the upcoming **Temporal API** (currently a Stage 3 proposal), which offer better APIs and handle edge cases more reliably.
