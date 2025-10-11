# JavaScript Logical Operators in Conditions

## The Three Logical Operators

JavaScript has three logical operators that are commonly used in conditional statements:

| Operator | Name | Description                                      |
| -------- | ---- | ------------------------------------------------ |
| `&&`     | AND  | Returns true if **both** operands are true       |
| `\|\|`   | OR   | Returns true if **at least one** operand is true |
| `!`      | NOT  | Inverts/negates a boolean value                  |

## 1. AND Operator (`&&`)

Returns `true` only when **all** conditions are true.

### Basic Usage

```javascript
if (age >= 18 && hasLicense) {
  console.log('You can drive');
}
```

### Multiple Conditions

```javascript
if (score >= 90 && score <= 100 && attendance > 80) {
  console.log('Grade: A+');
}
```

### Truth Table

```javascript
true && true; // true
true && false; // false
false && true; // false
false && false; // false
```

## 2. OR Operator (`||`)

Returns `true` if **any** condition is true.

### Basic Usage

```javascript
if (day === 'Saturday' || day === 'Sunday') {
  console.log("It's the weekend!");
}
```

### Multiple Conditions

```javascript
if (userRole === 'admin' || userRole === 'moderator' || userRole === 'owner') {
  console.log('Access granted');
}
```

### Truth Table

```javascript
true || true; // true
true || false; // true
false || true; // true
false || false; // false
```

## 3. NOT Operator (`!`)

Inverts a boolean value (true becomes false, false becomes true).

### Basic Usage

```javascript
if (!isLoggedIn) {
  console.log('Please log in');
}
```

### Double NOT (`!!`)

Converts any value to its boolean equivalent:

```javascript
!!0; // false
!!1; // true
!!''; // false
!!'hello'; // true
!!null; // false
!!undefined; // false
```

### Truth Table

```javascript
!true; // false
!false; // true
```

## Combining Logical Operators

You can combine multiple logical operators in a single condition:

```javascript
if ((age >= 18 && hasLicense) || hasPermit) {
  console.log('You can drive');
}
```

```javascript
if (isWeekend && (weather === 'sunny' || weather === 'cloudy') && !isRaining) {
  console.log('Perfect day for a picnic!');
}
```

## Operator Precedence

When mixing operators, remember the order:

1. `!` (NOT) - highest precedence
2. `&&` (AND)
3. `||` (OR) - lowest precedence

```javascript
// These are equivalent:
if ((!false && true) || false)
  if ((!false && true) || false)
    if ((!isRaining && isSunny) || hasUmbrella) {
      // Use parentheses for clarity:
      console.log("You'll stay dry");
    }
```

## Short-Circuit Evaluation

Logical operators use **short-circuit evaluation** - they stop evaluating as soon as the result is determined.

### AND (`&&`) Short-Circuit

If the first operand is false, the second is never evaluated:

```javascript
if (user && user.isAdmin) {
  // If user is null/undefined, user.isAdmin is never checked
  console.log('Admin access');
}
```

### OR (`||`) Short-Circuit

If the first operand is true, the second is never evaluated:

```javascript
let username = inputName || 'Guest';
// If inputName is truthy, "Guest" is never used
```

## Truthy and Falsy Values

Logical operators work with **truthy** and **falsy** values, not just booleans:

### Falsy Values (evaluate to false)

- `false`
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

### Truthy Values (evaluate to true)

- Everything else!
- `true`
- Any non-zero number
- Any non-empty string
- Objects and arrays (even empty ones: `{}`, `[]`)

### Examples

```javascript
if (username && password) {
  // Both must be non-empty strings
  login(username, password);
}

if (items.length) {
  // Array has items (length > 0)
  displayItems(items);
}

if (!errorMessage) {
  // No error occurred
  proceedToNextStep();
}
```

## Practical Examples

### Validation

```javascript
if (email.includes('@') && password.length >= 8) {
  console.log('Valid credentials');
}
```

### Access Control

```javascript
if (user.role === 'admin' || user.role === 'superuser') {
  showAdminPanel();
}
```

### Default Values

```javascript
let theme = userPreference || 'light'; // Use 'light' if no preference
```

### Multiple Checks

```javascript
if (age >= 13 && age <= 19) {
  console.log('Teenager');
} else if (age >= 20 && age < 60) {
  console.log('Adult');
} else {
  console.log('Senior');
}
```

### Complex Conditions

```javascript
if ((isWeekend || isHoliday) && !isWorking && weather === 'nice') {
  planOutdoorActivity();
}
```

## Best Practices

1. **Use parentheses** for clarity when combining operators
2. **Keep conditions simple** - break complex logic into variables
3. **Check for null/undefined** before accessing properties (use `&&`)
4. **Use meaningful variable names** to make conditions readable
5. **Avoid deep nesting** - consider using early returns or guard clauses

### Good Example

```javascript
const canVote = age >= 18 && isCitizen && isRegistered;

if (canVote) {
  showVotingBooth();
}
```

### Better Than

```javascript
if (age >= 18 && isCitizen && isRegistered) {
  showVotingBooth();
}
```
