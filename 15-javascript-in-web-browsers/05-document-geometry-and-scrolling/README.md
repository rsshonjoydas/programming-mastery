# Document Geometry and Scrolling

## Overview

When browsers render documents, they create a visual representation where each element has a **position** and **size**. Understanding document geometry is essential for:

- Dynamically positioning elements (tooltips, popups)
- Implementing custom scrolling behavior
- Working with element positions and dimensions
- Handling viewport and scroll calculations

---

## 1. Coordinate Systems

JavaScript uses **two primary coordinate systems** for measuring element positions.

### Document Coordinates

- Origin: **Top-left corner of the document**
- **Fixed positions** regardless of scrolling
- **Problem**: Don't work well with scrollable elements within documents (CSS `overflow`)

### Viewport Coordinates (Window Coordinates)

- Origin: **Top-left corner of the viewport** (visible area)
- **Changes** as user scrolls
- **Most commonly used** in client-side JavaScript
- Used by: `getBoundingClientRect()`, `elementFromPoint()`, mouse events (`clientX`, `clientY`)

### Viewport Definition

- **Top-level windows**: The browser area displaying content (excludes menus, toolbars, tabs)
- **iframes**: The `<iframe>` element itself defines the viewport

---

## 2. Converting Between Coordinate Systems

When document and viewport coordinates differ (due to scrolling):

```javascript
// Document coordinates = Viewport coordinates + Scroll offset

// Example: Element at y=200 in document coordinates
// User scrolled down 75 pixels
// Viewport y coordinate = 200 - 75 = 125

// Example: Element at x=400 in viewport coordinates
// User scrolled right 200 pixels
// Document x coordinate = 400 + 200 = 600
```

**Formula**:

```text
Document Y = Viewport Y + window.scrollY
Document X = Viewport X + window.scrollX

Viewport Y = Document Y - window.scrollY
Viewport X = Document X - window.scrollX
```

---

## 3. CSS Positioning and Coordinates

### position: fixed

- Uses **viewport coordinates**
- Element stays in place when scrolling

```css
.tooltip {
  position: fixed;
  top: 100px; /* 100px from viewport top */
  left: 50px; /* 50px from viewport left */
}
```

### position: relative

- Element positioned relative to its normal position
- Creates a new positioning context for child elements

### position: absolute

- `top` and `left` relative to:
  - The **document**, or
  - The **nearest positioned ancestor** (relative, absolute, fixed)
- Useful for creating custom coordinate systems ("container coordinates")

**Best Practice**: Create a relatively positioned container with `top: 0; left: 0` to establish a coordinate system origin for absolutely positioned children.

---

## 4. CSS Pixels vs Device Pixels

Modern displays have decoupled **software pixels** from **hardware pixels**.

### devicePixelRatio

```javascript
window.devicePixelRatio; // e.g., 2 on retina displays
```

- **Ratio = 2**: Each CSS pixel = 2×2 grid of hardware pixels
- **Ratio = 3**: Each CSS pixel = 3×3 grid of hardware pixels
- Depends on: hardware resolution, OS settings, browser zoom

### Implications

- CSS pixel coordinates **don't need to be integers**
- If `devicePixelRatio = 3`, coordinate `3.33` is valid
- If ratio is 2, coordinate `3.33` rounds to `3.5`

**Example**:

```javascript
// CSS font-size: 12px
// devicePixelRatio: 2.5
// Actual device pixels: 12 × 2.5 = 30 pixels
```

---

## 5. Querying Element Geometry

### getBoundingClientRect()

Returns the **size and position** of an element in **viewport coordinates**.

```javascript
let rect = element.getBoundingClientRect();

console.log(rect.left); // x of upper-left corner
console.log(rect.top); // y of upper-left corner
console.log(rect.right); // x of lower-right corner
console.log(rect.bottom); // y of lower-right corner
console.log(rect.width); // element width
console.log(rect.height); // element height
```

**Includes**: CSS border and padding
**Excludes**: Margins

### Block vs Inline Elements

**Block elements** (div, p, img):

- Always rectangular
- Single bounding rectangle

**Inline elements** (span, code, b):

- May span multiple lines
- Can have **multiple rectangles**

```javascript
// For inline elements spanning multiple lines
let rects = element.getClientRects(); // Returns array-like object
for (let rect of rects) {
  console.log(rect.left, rect.top, rect.width, rect.height);
}
```

---

## 6. Finding Elements at a Point

### elementFromPoint()

Determines which element is at a specific viewport coordinate.

```javascript
let element = document.elementFromPoint(x, y);
```

- **Parameters**: `x`, `y` in **viewport coordinates**
- **Returns**: The **innermost** and **uppermost** (highest z-index) element
- Use with mouse events: `event.clientX`, `event.clientY`

**Example**:

```javascript
document.addEventListener('click', (event) => {
  let element = document.elementFromPoint(event.clientX, event.clientY);
  console.log('Clicked element:', element.tagName);
});
```

---

## 7. Scrolling

### window.scrollTo()

Scrolls to an **absolute position** in document coordinates.

```javascript
// Scroll to specific coordinates
window.scrollTo(x, y);

// Scroll to bottom of document
let documentHeight = document.documentElement.offsetHeight;
let viewportHeight = window.innerHeight;
window.scrollTo(0, documentHeight - viewportHeight);
```

### window.scrollBy()

Scrolls by a **relative amount** from current position.

```javascript
// Scroll down 50 pixels
window.scrollBy(0, 50);

// Scroll right 100 pixels
window.scrollBy(100, 0);

// Continuous scrolling (every 500ms)
setInterval(() => {
  scrollBy(0, 50);
}, 500);
```

### Smooth Scrolling

Pass an **object** instead of numbers:

```javascript
window.scrollTo({
  left: 0,
  top: documentHeight - viewportHeight,
  behavior: 'smooth', // Smooth animation
});

window.scrollBy({
  left: 0,
  top: 100,
  behavior: 'smooth',
});
```

### element.scrollIntoView()

Scrolls to make an element visible in the viewport.

```javascript
// Scroll element to top of viewport (default)
element.scrollIntoView();

// Scroll element to bottom of viewport
element.scrollIntoView(false);

// With options
element.scrollIntoView({
  behavior: 'smooth', // Smooth scrolling
  block: 'start', // Vertical: start, end, nearest, center
  inline: 'nearest', // Horizontal: start, end, nearest, center
});
```

**Options**:

- `behavior`: `"auto"` | `"smooth"`
- `block`: `"start"` | `"end"` | `"nearest"` | `"center"`
- `inline`: `"start"` | `"end"` | `"nearest"` | `"center"`

---

## 8. Viewport and Content Sizes

### Window (Browser Viewport)

```javascript
// Viewport size
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

// Document size (entire HTML document)
let docWidth = document.documentElement.offsetWidth;
let docHeight = document.documentElement.offsetHeight;

// Or using getBoundingClientRect()
let rect = document.documentElement.getBoundingClientRect();
let docWidth2 = rect.width;
let docHeight2 = rect.height;

// Current scroll position
let scrollX = window.scrollX; // Horizontal scroll offset
let scrollY = window.scrollY; // Vertical scroll offset
```

**Note**: `window.scrollX` and `window.scrollY` are **read-only**. Use `window.scrollTo()` to change scroll position.

---

## 9. Element Size and Scroll Properties

Every Element has **three groups of properties** for geometry and scrolling:

### Offset Properties (Read-Only)

```javascript
element.offsetWidth; // Total width (content + padding + border)
element.offsetHeight; // Total height (content + padding + border)
element.offsetLeft; // X coordinate relative to offsetParent
element.offsetTop; // Y coordinate relative to offsetParent
element.offsetParent; // Reference element for coordinates
```

- **Includes**: Content, padding, border
- **Excludes**: Margins
- **Coordinates**: Relative to `offsetParent` (may be document or ancestor)

### Client Properties (Read-Only)

```javascript
element.clientWidth; // Width of content area + padding (no border)
element.clientHeight; // Height of content area + padding (no border)
element.clientLeft; // Width of left border
element.clientTop; // Width of top border
```

- **Includes**: Content, padding
- **Excludes**: Borders, margins
- **For inline elements**: All return `0`

### Scroll Properties (Read/Write)

```javascript
element.scrollWidth; // Total content width (including overflow)
element.scrollHeight; // Total content height (including overflow)
element.scrollLeft; // Horizontal scroll offset (read/write)
element.scrollTop; // Vertical scroll offset (read/write)
```

- **scrollWidth/Height**: Size of content area + padding + overflowing content

  - Without overflow: Same as `clientWidth`/`clientHeight`
  - With overflow: Larger than `clientWidth`/`clientHeight`

- **scrollLeft/Top**: **Writable** properties to control scroll position

```javascript
// Scroll element to specific position
element.scrollLeft = 100;
element.scrollTop = 200;

// Scroll element to bottom
element.scrollTop = element.scrollHeight - element.clientHeight;
```

### Element Scrolling Methods

Most browsers support (not yet universal):

```javascript
element.scrollTo(x, y);
element.scrollTo({ left: x, top: y, behavior: 'smooth' });

element.scrollBy(x, y);
element.scrollBy({ left: x, top: y, behavior: 'smooth' });
```

---

## 10. Practical Examples

### Example 1: Position Tooltip Next to Element

```javascript
function positionTooltip(tooltip, targetElement) {
  let rect = targetElement.getBoundingClientRect();

  tooltip.style.position = 'fixed';
  tooltip.style.left = rect.right + 10 + 'px'; // 10px to the right
  tooltip.style.top = rect.top + 'px';
}
```

### Example 2: Check if Element is in Viewport

```javascript
function isInViewport(element) {
  let rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}
```

### Example 3: Lazy Loading Images

```javascript
function loadVisibleImages() {
  let images = document.querySelectorAll('img[data-src]');

  images.forEach((img) => {
    if (isInViewport(img)) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}

window.addEventListener('scroll', loadVisibleImages);
```

### Example 4: Get Scroll Percentage

```javascript
function getScrollPercentage() {
  let scrollTop = window.scrollY;
  let docHeight = document.documentElement.scrollHeight;
  let winHeight = window.innerHeight;

  let scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
  return scrollPercent;
}
```

### Example 5: Scroll Progress Indicator

```javascript
window.addEventListener('scroll', () => {
  let percent = getScrollPercentage();
  document.getElementById('progress-bar').style.width = percent + '%';
});
```

---

## Key Concepts Summary

✅ **Two coordinate systems**: Document (fixed) and Viewport (changes with scroll)
✅ **Viewport coordinates** are most commonly used in JavaScript
✅ **Convert coordinates** by adding/subtracting scroll offsets
✅ **CSS positioning**: `fixed` uses viewport, `absolute` uses document/ancestor
✅ **CSS pixels** ≠ Device pixels (see `devicePixelRatio`)
✅ **getBoundingClientRect()**: Get element size and position (viewport coords)
✅ **elementFromPoint()**: Find element at specific viewport coordinates
✅ **window.scrollTo()**: Scroll to absolute position
✅ **window.scrollBy()**: Scroll by relative amount
✅ **element.scrollIntoView()**: Scroll element into view
✅ **Smooth scrolling**: Use object with `behavior: "smooth"`
✅ **Element properties**: offset (total size), client (content area), scroll (overflow)
✅ **scrollLeft/scrollTop**: Read/write properties to control element scroll

---

## Property Reference Table

| Property                   | What it Measures                          | Read/Write     |
| -------------------------- | ----------------------------------------- | -------------- |
| `offsetWidth/Height`       | Element size (content + padding + border) | Read-only      |
| `offsetLeft/Top`           | Position relative to offsetParent         | Read-only      |
| `clientWidth/Height`       | Content area + padding (no border)        | Read-only      |
| `clientLeft/Top`           | Border width                              | Read-only      |
| `scrollWidth/Height`       | Total content size (including overflow)   | Read-only      |
| `scrollLeft/Top`           | Scroll offset                             | **Read/Write** |
| `window.innerWidth/Height` | Viewport size                             | Read-only      |
| `window.scrollX/Y`         | Document scroll offset                    | Read-only      |
