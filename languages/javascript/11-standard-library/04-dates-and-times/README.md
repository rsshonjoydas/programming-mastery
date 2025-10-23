# JavaScript Dates and Times

The **Date class** is JavaScript's API for working with dates and times. It represents dates internally as **milliseconds since the Unix epoch** (January 1, 1970, 00:00:00 UTC).

---

## Creating Date Objects

### 1. Current Date and Time

```javascript
let now = new Date(); // Current date and time
```

### 2. Using Milliseconds (Timestamp)

```javascript
let epoch = new Date(0); // January 1, 1970, 00:00:00 GMT
let future = new Date(1609459200000); // Specific timestamp
```

### 3. Using Date Components (Local Time)

```javascript
let century = new Date(
  2100, // Year
  0, // Month (0 = January)
  1, // Day
  2,
  3,
  4,
  5
); // Hours, minutes, seconds, milliseconds
```

**Important quirks**:

- Months are **0-indexed**: 0 = January, 11 = December
- Days are **1-indexed**: 1 = first day of month
- Omitted time fields default to 0 (midnight)
- Uses **local time zone**

### 4. Using UTC Time

```javascript
// Create date in UTC
let century = new Date(Date.UTC(2100, 0, 1));
// Midnight, January 1, 2100, UTC
```

### 5. Parsing Date Strings

```javascript
// ISO format (recommended)
let d1 = new Date('2100-01-01T00:00:00Z');

// Other formats
let d2 = new Date('January 1, 2100');
let d3 = new Date('2100/01/01');
```

The Date constructor can parse:

- ISO 8601 format
- Output from `toString()`, `toUTCString()`, `toISOString()`

---

## Getting Date Components

Each getter has **two forms**: local time and UTC time.

### Local Time Getters

```javascript
let d = new Date();

d.getFullYear(); // 4-digit year (e.g., 2025)
d.getMonth(); // Month (0-11)
d.getDate(); // Day of month (1-31)
d.getDay(); // Day of week (0=Sunday, 6=Saturday) - READ-ONLY
d.getHours(); // Hours (0-23)
d.getMinutes(); // Minutes (0-59)
d.getSeconds(); // Seconds (0-59)
d.getMilliseconds(); // Milliseconds (0-999)
d.getTime(); // Timestamp (milliseconds since epoch)
```

### UTC Time Getters

Replace `get` with `getUTC`:

```javascript
d.getUTCFullYear();
d.getUTCMonth();
d.getUTCDate();
d.getUTCDay();
d.getUTCHours();
d.getUTCMinutes();
d.getUTCSeconds();
d.getUTCMilliseconds();
```

**Note**:

- `getDate()` and `getUTCDate()` return **day of month**
- `getDay()` and `getUTCDay()` return **day of week** (read-only, no setter)

---

## Setting Date Components

Each setter has **two forms**: local time and UTC time.

### Local Time Setters

```javascript
let d = new Date();

d.setFullYear(2026); // Set year
d.setMonth(11); // Set month (December)
d.setDate(25); // Set day of month
d.setHours(14); // Set hours
d.setMinutes(30); // Set minutes
d.setSeconds(45); // Set seconds
d.setMilliseconds(500); // Set milliseconds
d.setTime(1609459200000); // Set via timestamp
```

### UTC Time Setters

Replace `set` with `setUTC`:

```javascript
d.setUTCFullYear(2026);
d.setUTCMonth(11);
d.setUTCDate(25);
// etc.
```

### Setting Multiple Fields

Some setters accept optional parameters to set multiple fields:

```javascript
// setFullYear(year, month, day)
d.setFullYear(2026, 0, 15); // January 15, 2026

// setHours(hours, minutes, seconds, milliseconds)
d.setHours(14, 30, 45, 500); // 14:30:45.500
```

### Example: Add One Year

```javascript
let d = new Date();
d.setFullYear(d.getFullYear() + 1); // Increment year
```

---

## Timestamps

JavaScript represents dates as **integers** (milliseconds since January 1, 1970, UTC).

### Working with Timestamps

```javascript
let d = new Date();

// Get timestamp
let timestamp = d.getTime(); // Milliseconds since epoch

// Set timestamp
d.setTime(timestamp + 30000); // Add 30 seconds (30,000 ms)
```

### Current Timestamp

```javascript
let now = Date.now(); // Current time as timestamp
```

**Use case**: Measuring execution time

```javascript
let startTime = Date.now();
reticulateSplines(); // Time-consuming operation
let endTime = Date.now();
console.log(`Operation took ${endTime - startTime}ms`);
```

### High-Resolution Timestamps

For more precise timing, use `performance.now()`:

```javascript
let start = performance.now();
doSomething();
let end = performance.now();
console.log(`Took ${end - start}ms`); // Includes fractions of milliseconds
```

**Differences from Date.now()**:

- Returns **fractional milliseconds** (sub-millisecond precision)
- **Relative time** (not absolute timestamp)
- Measures time since page load (browser) or process start (Node.js)

**Node.js usage**:

```javascript
const { performance } = require('perf_hooks');
```

---

## Date Arithmetic

### Comparing Dates

Dates can be compared using standard operators:

```javascript
let d1 = new Date(2025, 0, 1);
let d2 = new Date(2026, 0, 1);

d1 < d2; // true
d1 > d2; // false
d1 <= d2; // true
d1 >= d2; // false
```

### Subtracting Dates

Subtracting two dates returns the difference in **milliseconds**:

```javascript
let difference = d2 - d1; // Milliseconds between dates
console.log(difference / 1000 / 60 / 60 / 24); // Convert to days
```

### Adding/Subtracting Time

**For hours, minutes, seconds**:

```javascript
let d = new Date();
d.setTime(d.getTime() + 30000); // Add 30 seconds
d.setTime(d.getTime() + 3600000); // Add 1 hour
```

**For days, months, years**:

```javascript
let d = new Date();

// Add 3 months and 14 days
d.setMonth(d.getMonth() + 3, d.getDate() + 14);

// Add 1 year
d.setFullYear(d.getFullYear() + 1);

// Subtract 7 days
d.setDate(d.getDate() - 7);
```

**Automatic overflow handling**:

```javascript
let d = new Date(2025, 11, 31); // December 31, 2025
d.setDate(d.getDate() + 1); // Becomes January 1, 2026
```

Date setters automatically handle:

- Month overflow (month > 11 → increment year)
- Day overflow (day > days in month → increment month)

---

## Formatting Date Strings

The Date class provides multiple methods to convert dates to strings:

### Basic Formatting Methods

```javascript
let d = new Date(2020, 0, 1, 17, 10, 30); // Jan 1, 2020, 5:10:30 PM

d.toString();
// "Wed Jan 01 2020 17:10:30 GMT-0800 (Pacific Standard Time)"

d.toUTCString();
// "Thu, 02 Jan 2020 01:10:30 GMT"

d.toISOString();
// "2020-01-02T01:10:30.000Z"

d.toLocaleDateString();
// "1/1/2020" (locale-dependent)

d.toLocaleTimeString();
// "5:10:30 PM" (locale-dependent)

d.toLocaleString();
// "1/1/2020, 5:10:30 PM" (locale-dependent)
```

### All Formatting Methods

| Method                 | Time Zone | Locale-Aware | Includes               |
| ---------------------- | --------- | ------------ | ---------------------- |
| `toString()`           | Local     | ❌           | Date + Time            |
| `toUTCString()`        | UTC       | ❌           | Date + Time            |
| `toISOString()`        | UTC       | ❌           | Date + Time (ISO-8601) |
| `toLocaleString()`     | Local     | ✅           | Date + Time            |
| `toDateString()`       | Local     | ❌           | Date only              |
| `toLocaleDateString()` | Local     | ✅           | Date only              |
| `toTimeString()`       | Local     | ❌           | Time only              |
| `toLocaleTimeString()` | Local     | ✅           | Time only              |

### ISO 8601 Format

The `toISOString()` method returns the standard format:

```javascript
d.toISOString(); // "2020-01-02T01:10:30.000Z"
```

Format: `YYYY-MM-DDTHH:mm:ss.sssZ`

- `T` separates date and time
- `Z` indicates UTC time zone

---

## Parsing Date Strings

### Date.parse()

Static method that parses a date string and returns a **timestamp**:

```javascript
let timestamp = Date.parse('2020-01-01T00:00:00Z');
let d = new Date(timestamp);
```

**Can parse**:

- ISO 8601 format
- Output from `toString()`, `toUTCString()`, `toISOString()`
- Various other formats (implementation-dependent)

```javascript
Date.parse('2020-01-01T00:00:00Z'); // ISO format
Date.parse('January 1, 2020'); // Text format
Date.parse('2020/01/01'); // Slash format
```

**Best practice**: Use ISO 8601 format for reliable parsing across platforms.

---

## Key Concepts Summary

✅ **Date class** represents dates as milliseconds since January 1, 1970, UTC
✅ **Months are 0-indexed** (0 = January, 11 = December)
✅ **Days are 1-indexed** (1 = first day of month)
✅ **Two forms for most methods**: local time and UTC time
✅ **getDay()** returns day of week (0-6), not day of month
✅ **Date.now()** returns current timestamp (milliseconds)
✅ **performance.now()** provides high-resolution timing
✅ **Date arithmetic** supports comparison and subtraction
✅ **Setters handle overflow** automatically (e.g., month 13 → next year)
✅ **Multiple formatting methods** for different use cases
✅ **toISOString()** produces standard ISO-8601 format
✅ **Date.parse()** converts date strings to timestamps
✅ **Locale-aware methods** format dates according to user's locale

---

## Common Patterns

### Get tomorrow's date

```javascript
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
```

### Get first day of month

```javascript
let firstDay = new Date();
firstDay.setDate(1);
```

### Get last day of month

```javascript
let lastDay = new Date();
lastDay.setMonth(lastDay.getMonth() + 1, 0);
```

### Check if same day

```javascript
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
```

### Age calculation

```javascript
function getAge(birthDate) {
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
```
