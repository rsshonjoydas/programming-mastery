# JavaScript Scripting CSS

JavaScript can control the visual appearance and layout of HTML documents by manipulating CSS in several ways.

---

## Common CSS Styles Scripted with JavaScript

Before diving into techniques, here are CSS styles commonly manipulated via JavaScript:

| CSS Property            | Purpose              | Example Use Case                                      |
| ----------------------- | -------------------- | ----------------------------------------------------- |
| **display**             | Show/hide elements   | `display: "none"` to hide, `display: "block"` to show |
| **position, top, left** | Dynamic positioning  | Modal dialogs, tooltips, dropdowns                    |
| **transform**           | Shift, scale, rotate | Animations, visual effects                            |
| **transition**          | Animate CSS changes  | Smooth fade-ins, slide effects                        |

---

## 1. CSS Classes (Simplest Method)

The easiest way to affect styling is by **adding/removing CSS class names** using the `classList` property.

### Define CSS Class

```css
.hidden {
  display: none;
}
```

### Add/Remove Classes with JavaScript

```javascript
let tooltip = document.querySelector('#tooltip');

// Show element (remove "hidden" class)
tooltip.classList.add('hidden');

// Hide element (add "hidden" class)
tooltip.classList.remove('hidden');

// Toggle class on/off
tooltip.classList.toggle('hidden');

// Check if class exists
if (tooltip.classList.contains('hidden')) {
  console.log('Element is hidden');
}
```

### classList Methods

| Method                        | Description                        |
| ----------------------------- | ---------------------------------- |
| `add(className)`              | Adds a class                       |
| `remove(className)`           | Removes a class                    |
| `toggle(className)`           | Adds if absent, removes if present |
| `contains(className)`         | Returns true if class exists       |
| `replace(oldClass, newClass)` | Replaces one class with another    |

**Best for**: Predefined styles, show/hide, state changes

---

## 2. Inline Styles

When you need to set **unique, dynamic values** (like specific positions), use the `style` property.

### The style Property

The `style` property is a **CSSStyleDeclaration** object, not a string. It represents the inline `style` attribute.

```javascript
function displayAt(tooltip, x, y) {
  tooltip.style.display = 'block';
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${x}px`; // Must include units!
  tooltip.style.top = `${y}px`;
}
```

### CSS Property Naming Convention

**CSS properties with hyphens** are converted to **camelCase** in JavaScript:

| CSS Property        | JavaScript Property |
| ------------------- | ------------------- |
| `font-size`         | `fontSize`          |
| `background-color`  | `backgroundColor`   |
| `border-left-width` | `borderLeftWidth`   |
| `margin-top`        | `marginTop`         |
| `z-index`           | `zIndex`            |

### Important Rules for Inline Styles

**1. All values must be strings:**

```javascript
// ❌ INCORRECT
e.style.marginLeft = 300;

// ✅ CORRECT
e.style.marginLeft = '300px';
```

**2. Units are required:**

```javascript
// ❌ INCORRECT (missing units)
e.style.width = '200';

// ✅ CORRECT
e.style.width = '200px';
e.style.fontSize = '16pt';
e.style.margin = '1em';
```

**3. Computed values need units appended:**

```javascript
let totalWidth = x0 + left_border + left_padding;
e.style.left = `${totalWidth}px`;
```

**4. Use semicolons outside strings:**

```javascript
e.style.display = 'block'; // JavaScript semicolon
e.style.fontFamily = 'sans-serif'; // Not CSS semicolon
e.style.backgroundColor = '#ffffff';
```

### Shortcut Properties

CSS shortcut properties work in JavaScript:

```javascript
// Setting margin (shortcut for margin-top, margin-right, etc.)
e.style.margin = `${top}px ${right}px ${bottom}px ${left}px`;

// Setting padding
e.style.padding = '10px 20px';

// Setting border
e.style.border = '1px solid black';
```

### Working with cssText

Set/get the entire style attribute as a string:

```javascript
// Copy inline styles from e to f
f.style.cssText = e.style.cssText;

// Or using getAttribute/setAttribute
f.setAttribute('style', e.getAttribute('style'));

// Set multiple styles at once
e.style.cssText = 'color: red; font-size: 20px; margin: 10px;';
```

### Limitation of Inline Styles

The `style` property only represents **inline styles**, not styles from stylesheets. To get the actual rendered styles, use computed styles.

---

## 3. Computed Styles (Read-Only)

**Computed styles** are the final property values the browser uses after combining inline styles and all applicable stylesheet rules.

### Getting Computed Styles

```javascript
let title = document.querySelector('#section1title');
let styles = window.getComputedStyle(title);

// Get specific property
let fontSize = styles.fontSize; // e.g., "16px"
let color = styles.color; // e.g., "rgb(0, 0, 0)"
let display = styles.display; // e.g., "block"

// Get styles for pseudo-elements
let beforeStyles = window.getComputedStyle(title, '::before');
let afterContent = beforeStyles.content;
```

### Key Differences from Inline Styles

| Feature                 | Computed Styles            | Inline Styles |
| ----------------------- | -------------------------- | ------------- |
| **Read/Write**          | Read-only                  | Read/Write    |
| **Units**               | Always absolute (px)       | As specified  |
| **Colors**              | `rgb()` or `rgba()` format | As specified  |
| **Shortcut properties** | Not computed               | Available     |
| **cssText**             | `undefined`                | Available     |

### Important Notes

**1. Values are absolute:**

```javascript
// All sizes converted to pixels
styles.fontSize; // "16px" (not "1em")
styles.marginLeft; // "20px" (not "5%")
```

**2. Colors in rgb/rgba format:**

```javascript
styles.color; // "rgb(255, 0, 0)" not "#ff0000"
styles.backgroundColor; // "rgba(0, 0, 0, 0.5)"
```

**3. Use fundamental properties, not shortcuts:**

```javascript
// ❌ DON'T query shortcuts
styles.margin;
styles.border;
styles.borderWidth;

// ✅ DO query fundamental properties
styles.marginLeft;
styles.marginTop;
styles.borderLeftWidth;
styles.borderTopWidth;
```

**4. Some properties return "auto":**

```javascript
// For non-absolutely positioned elements
styles.top; // May return "auto"
styles.left; // May return "auto"
```

**5. font-family returns the entire list:**

```javascript
styles.fontFamily; // "arial, helvetica, sans-serif"
// Doesn't tell you which font is actually used
```

### Better Alternative for Size/Position

For element size and position, use **element geometry properties** (e.g., `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`) instead of computed styles.

---

## 4. Scripting Stylesheets

JavaScript can manipulate entire stylesheets, not just individual elements.

### Enabling/Disabling Stylesheets

Both `<style>` and `<link rel="stylesheet">` elements have a `disabled` property:

```javascript
// Toggle between light and dark themes
function toggleTheme() {
  let lightTheme = document.querySelector('#light-theme');
  let darkTheme = document.querySelector('#dark-theme');

  if (darkTheme.disabled) {
    // Switch to dark
    lightTheme.disabled = true;
    darkTheme.disabled = false;
  } else {
    // Switch to light
    lightTheme.disabled = false;
    darkTheme.disabled = true;
  }
}
```

### Dynamically Adding Stylesheets

**Method 1: Create and insert `<link>` element**

```javascript
function setTheme(name) {
  // Create new <link> element
  let link = document.createElement('link');
  link.id = 'theme';
  link.rel = 'stylesheet';
  link.href = `themes/${name}.css`;

  // Replace existing theme or add new one
  let currentTheme = document.querySelector('#theme');
  if (currentTheme) {
    currentTheme.replaceWith(link);
  } else {
    document.head.append(link);
  }
}
```

**Method 2: Insert `<style>` tag with HTML string**

```javascript
document.head.insertAdjacentHTML(
  'beforeend',
  '<style>body { transform: rotate(180deg) }</style>'
);
```

### Advanced: CSS Object Model API

JavaScript can query, modify, insert, and delete individual style rules using the **CSSStyleSheet** API (not covered in detail here). Search MDN for "CSSStyleSheet" and "CSS Object Model" for more info.

---

## 5. CSS Animations and Events

JavaScript can **trigger CSS animations** and **listen for animation events**.

### CSS Transitions

Define transition classes in CSS:

```css
.transparent {
  opacity: 0;
}

.fadeable {
  transition: opacity 0.5s ease-in;
}
```

Trigger animation with JavaScript:

```html
<div id="subscribe" class="fadeable notification">...</div>
```

```javascript
let element = document.querySelector('#subscribe');

// Fade out
element.classList.add('transparent');

// Fade in (later)
element.classList.remove('transparent');
```

### Transition Events

JavaScript can monitor CSS transition progress:

| Event             | When It Fires                                                |
| ----------------- | ------------------------------------------------------------ |
| `transitionrun`   | Transition triggered (before visual changes if delay exists) |
| `transitionstart` | Visual changes begin                                         |
| `transitionend`   | Animation complete                                           |

**Event object**: `TransitionEvent`

- `propertyName`: CSS property being animated
- `elapsedTime`: Seconds since `transitionstart`

```javascript
element.addEventListener('transitionend', (e) => {
  console.log(`Transition of ${e.propertyName} completed`);
  console.log(`Duration: ${e.elapsedTime}s`);
});
```

### CSS Animations

CSS animations use `@keyframes` and animation properties:

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.animated {
  animation-name: slideIn;
  animation-duration: 1s;
}
```

Trigger with JavaScript:

```javascript
element.classList.add('animated');
```

### Animation Events

| Event                | When It Fires                       |
| -------------------- | ----------------------------------- |
| `animationstart`     | Animation begins                    |
| `animationiteration` | After each repetition (except last) |
| `animationend`       | Animation completes                 |

**Event object**: `AnimationEvent`

- `animationName`: Value of `animation-name` property
- `elapsedTime`: Seconds since animation started

```javascript
element.addEventListener('animationstart', (e) => {
  console.log(`Animation ${e.animationName} started`);
});

element.addEventListener('animationend', (e) => {
  console.log(`Animation completed after ${e.elapsedTime}s`);
});
```

---

## Summary Comparison

| Method              | Use When                       | Read/Write   | Dynamic Values |
| ------------------- | ------------------------------ | ------------ | -------------- |
| **classList**       | Predefined styles              | Read/Write   | ❌             |
| **Inline styles**   | Unique values per element      | Read/Write   | ✅             |
| **Computed styles** | Getting actual rendered values | Read-only    | ✅             |
| **Stylesheets**     | Theme switching, bulk changes  | Read/Write   | ✅             |
| **CSS Animations**  | Complex animations             | Trigger only | ✅             |

---

## Best Practices

✅ **Use classList** for simple show/hide and state changes
✅ **Use inline styles** for dynamic positioning and unique values
✅ **Use computed styles** to read actual rendered values
✅ **Always include units** when setting style values (`"10px"`, not `"10"`)
✅ **Use camelCase** for CSS property names in JavaScript
✅ **Let CSS handle animations** (better performance than JavaScript)
✅ **Listen to animation events** to coordinate JavaScript with CSS animations
✅ **Prefer CSS classes over inline styles** when possible (separation of concerns)

---

## Key Concepts

📌 **classList** is the simplest way to manipulate CSS classes
📌 **style property** is a CSSStyleDeclaration object for inline styles
📌 **All style values must be strings with units** (`"10px"`, not `10`)
📌 **CSS hyphens become camelCase** (`font-size` → `fontSize`)
📌 **Computed styles** show actual rendered values (read-only)
📌 **Stylesheets can be enabled/disabled** via the `disabled` property
📌 **CSS transitions/animations trigger events** JavaScript can listen to
📌 **JavaScript triggers animations**; CSS performs them (better performance)
