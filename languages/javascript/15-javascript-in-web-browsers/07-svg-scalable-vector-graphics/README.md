# SVG: Scalable Vector Graphics

## What is SVG?

**SVG (Scalable Vector Graphics)** is an XML-based image format that describes graphics using mathematical descriptions rather than pixels.

### Key Characteristics

- **Vector-based**: Not a raster format like GIF, JPEG, or PNG
- **Resolution-independent**: Graphics scale without quality loss (hence "scalable")
- **XML/text-based**: Described using markup similar to HTML
- **Precise**: Mathematical descriptions of shapes, not pixel matrices

---

## Three Ways to Use SVG in Web Browsers

### 1. As Image Files

Use `.svg` files like any other image format:

```html
<img src="logo.svg" alt="Company Logo" width="200" />
<img src="icon.svg" alt="Icon" />
```

### 2. Inline SVG in HTML

Embed SVG tags directly in HTML documents:

```html
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" />
  <rect x="10" y="10" width="30" height="30" fill="red" />
</svg>
```

**Benefits**:

- Can style with CSS
- Can manipulate with JavaScript
- No additional HTTP requests
- No XML namespace required (browser's HTML parser handles it)

### 3. Dynamic Creation with JavaScript

Use the DOM API to create SVG elements programmatically:

```javascript
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
document.body.appendChild(svg);
```

---

## SVG Capabilities

SVG supports:

- ✅ Simple shapes (circles, rectangles, lines, polygons)
- ✅ Arbitrary curves and paths
- ✅ Text elements
- ✅ Animations
- ✅ JavaScript scripts
- ✅ CSS stylesheets
- ✅ Gradients and patterns
- ✅ Transformations (rotate, scale, translate)

---

## SVG in HTML: Analog Clock Example

### Complete HTML with Embedded SVG

```html
<html>
  <head>
    <title>Analog Clock</title>
    <style>
      #clock {
        stroke: black;
        stroke-linecap: round;
        fill: #ffe;
      }
      #clock .face {
        stroke-width: 3;
      }
      #clock .ticks {
        stroke-width: 2;
      }
      #clock .hands {
        stroke-width: 3;
      }
      #clock .numbers {
        font-family: sans-serif;
        font-size: 10;
        font-weight: bold;
        text-anchor: middle;
        stroke: none;
        fill: black;
      }
    </style>
  </head>
  <body>
    <svg id="clock" viewBox="0 0 100 100" width="250" height="250">
      <circle class="face" cx="50" cy="50" r="45" />

      <g class="ticks">
        <line x1="50" y1="5.000" x2="50.00" y2="10.00" />
        <line x1="72.50" y1="11.03" x2="70.00" y2="15.36" />
        <!-- More tick marks... -->
      </g>

      <g class="numbers">
        <text x="50" y="18">12</text>
        <text x="85" y="53">3</text>
        <text x="50" y="88">6</text>
        <text x="15" y="53">9</text>
      </g>

      <g class="hands">
        <line class="hourhand" x1="50" y1="50" x2="50" y2="25" />
        <line class="minutehand" x1="50" y1="50" x2="50" y2="20" />
      </g>
    </svg>

    <script src="clock.js"></script>
  </body>
</html>
```

### Key SVG Elements

- **`<svg>`**: Container for SVG graphics
- **`<circle>`**: Draws circles (cx, cy, r attributes)
- **`<line>`**: Draws lines (x1, y1, x2, y2 attributes)
- **`<text>`**: Displays text (x, y attributes)
- **`<g>`**: Groups elements together
- **`<rect>`**: Draws rectangles
- **`<path>`**: Draws complex shapes with commands

### SVG Attributes

- **`viewBox`**: Internal coordinate system (format: "minX minY width height")
- **`width`/`height`**: Screen size in pixels
- **Styling attributes**: `fill`, `stroke`, `stroke-width`, `stroke-linecap`

### CSS for SVG

SVG-specific CSS properties:

- `fill`: Fill color
- `stroke`: Outline color
- `stroke-width`: Line thickness
- `stroke-linecap`: Line end style (round, square, butt)
- `text-anchor`: Text alignment (start, middle, end)

**Note**: CSS shorthand properties (like `font`) don't work with SVG. Use individual properties:

```css
font-family: sans-serif;
font-size: 10;
font-weight: bold;
```

---

## Scripting SVG: Animated Clock

### JavaScript to Update Clock Hands

```javascript
(function updateClock() {
  let now = new Date();
  let sec = now.getSeconds();
  let min = now.getMinutes() + sec / 60;
  let hour = (now.getHours() % 12) + min / 60;

  let minangle = min * 6; // 6 degrees per minute
  let hourangle = hour * 30; // 30 degrees per hour

  // Get SVG elements
  let minhand = document.querySelector('#clock .minutehand');
  let hourhand = document.querySelector('#clock .hourhand');

  // Rotate the hands
  minhand.setAttribute('transform', `rotate(${minangle},50,50)`);
  hourhand.setAttribute('transform', `rotate(${hourangle},50,50)`);

  // Update every 10 seconds
  setTimeout(updateClock, 10000);
})();
```

### How It Works

1. Calculate current time angles
2. Use `querySelector()` to find SVG elements
3. Set `transform` attribute to rotate hands
4. Use `setTimeout()` for periodic updates

### Common SVG Transformations

```javascript
element.setAttribute('transform', 'rotate(45,50,50)'); // Rotate
element.setAttribute('transform', 'translate(10,20)'); // Move
element.setAttribute('transform', 'scale(2)'); // Scale
element.setAttribute('transform', 'rotate(45) translate(10,20)'); // Combine
```

---

## Creating SVG Images with JavaScript

### Important: Use createElementNS()

SVG elements are XML, not HTML. Must use:

```javascript
// CORRECT - SVG namespace required
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

// WRONG - Won't work for SVG
let svg = document.createElement('svg');
```

**SVG Namespace**: `"http://www.w3.org/2000/svg"` (literal string, always)

### Creating a Simple Shape

```javascript
const svg = 'http://www.w3.org/2000/svg';

// Create SVG container
let chart = document.createElementNS(svg, 'svg');
chart.setAttribute('width', '200');
chart.setAttribute('height', '200');
chart.setAttribute('viewBox', '0 0 200 200');

// Create a circle
let circle = document.createElementNS(svg, 'circle');
circle.setAttribute('cx', '100');
circle.setAttribute('cy', '100');
circle.setAttribute('r', '50');
circle.setAttribute('fill', 'blue');
circle.setAttribute('stroke', 'black');
circle.setAttribute('stroke-width', '2');

// Add to SVG
chart.appendChild(circle);

// Add to document
document.body.appendChild(chart);
```

---

## Advanced Example: Pie Chart

### The `<path>` Element

The `<path>` element draws complex shapes using the `d` attribute with commands:

**Path Commands**:

- **M x,y**: Move to coordinates
- **L x,y**: Line to coordinates
- **A rx,ry rotation large-arc sweep x,y**: Arc
- **Z**: Close path

### Pie Chart Function

```javascript
function pieChart(options) {
  let { width, height, cx, cy, r, lx, ly, data } = options;
  let svg = 'http://www.w3.org/2000/svg';

  // Create SVG element
  let chart = document.createElementNS(svg, 'svg');
  chart.setAttribute('width', width);
  chart.setAttribute('height', height);
  chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
  chart.setAttribute('font-family', 'sans-serif');
  chart.setAttribute('font-size', '18');

  // Get data
  let labels = Object.keys(data);
  let values = Object.values(data);
  let total = values.reduce((x, y) => x + y);

  // Calculate angles (in radians)
  let angles = [0];
  values.forEach((x, i) => angles.push(angles[i] + (x / total) * 2 * Math.PI));

  // Draw each slice
  values.forEach((value, i) => {
    // Calculate slice endpoints
    let x1 = cx + r * Math.sin(angles[i]);
    let y1 = cy - r * Math.cos(angles[i]);
    let x2 = cx + r * Math.sin(angles[i + 1]);
    let y2 = cy - r * Math.cos(angles[i + 1]);

    // Large arc flag for angles > 180°
    let big = angles[i + 1] - angles[i] > Math.PI ? 1 : 0;

    // Path description
    let path =
      `M${cx},${cy}` + // Move to center
      `L${x1},${y1}` + // Line to start
      `A${r},${r} 0 ${big} 1` + // Arc
      `${x2},${y2}` + // To end point
      'Z'; // Close path

    // Generate color
    let color = `hsl(${(i * 40) % 360},${90 - 3 * i}%,${50 + 2 * i}%)`;

    // Create path element
    let slice = document.createElementNS(svg, 'path');
    slice.setAttribute('d', path);
    slice.setAttribute('fill', color);
    slice.setAttribute('stroke', 'black');
    slice.setAttribute('stroke-width', '1');
    chart.append(slice);

    // Create legend icon
    let icon = document.createElementNS(svg, 'rect');
    icon.setAttribute('x', lx);
    icon.setAttribute('y', ly + 30 * i);
    icon.setAttribute('width', 20);
    icon.setAttribute('height', 20);
    icon.setAttribute('fill', color);
    icon.setAttribute('stroke', 'black');
    icon.setAttribute('stroke-width', '1');
    chart.append(icon);

    // Create legend label
    let label = document.createElementNS(svg, 'text');
    label.setAttribute('x', lx + 30);
    label.setAttribute('y', ly + 30 * i + 16);
    label.append(`${labels[i]} ${value}`);
    chart.append(label);
  });

  return chart;
}
```

### Using the Pie Chart

```javascript
document.querySelector('#chart').append(
  pieChart({
    width: 640,
    height: 400,
    cx: 200,
    cy: 200,
    r: 180,
    lx: 400,
    ly: 10,
    data: {
      JavaScript: 71.5,
      Java: 45.4,
      Python: 37.9,
      'C#': 35.3,
      PHP: 31.4,
    },
  })
);
```

---

## Common SVG Use Cases

### 1. Icons with `<template>`

```html
<template id="icon-template">
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
    />
  </svg>
</template>

<script>
  let template = document.querySelector('#icon-template');
  let icon = template.content.cloneNode(true);
  document.body.appendChild(icon);
</script>
```

### 2. Interactive Graphics

```javascript
let circle = document.querySelector('circle');

circle.addEventListener('mouseover', () => {
  circle.setAttribute('fill', 'red');
});

circle.addEventListener('mouseout', () => {
  circle.setAttribute('fill', 'blue');
});
```

### 3. Data Visualization

- Charts (pie, bar, line)
- Graphs and diagrams
- Maps
- Infographics

---

## Key Concepts Summary

✅ **SVG is vector-based**, not raster - scales without quality loss
✅ **Three usage methods**: image files, inline HTML, dynamic JavaScript creation
✅ **XML format** similar to HTML but with specific SVG elements
✅ **Use `createElementNS()`** with namespace for JavaScript creation
✅ **SVG namespace**: `"http://www.w3.org/2000/svg"`
✅ **CSS styling** works with SVG-specific properties
✅ **DOM manipulation** enables dynamic, interactive graphics
✅ **`<path>` element** draws complex shapes with command strings
✅ **Transformations** (rotate, translate, scale) manipulate elements
✅ **Inline SVG** allows scripting and styling flexibility

---

## SVG vs Canvas

| Feature          | SVG                       | Canvas                    |
| ---------------- | ------------------------- | ------------------------- |
| **Type**         | Vector (XML/DOM)          | Raster (pixel-based)      |
| **Scalability**  | Perfect at any size       | Pixelated when scaled     |
| **DOM**          | Elements in DOM tree      | Single `<canvas>` element |
| **Manipulation** | Easy (DOM API)            | Must redraw everything    |
| **Performance**  | Slower with many elements | Better for many objects   |
| **Use case**     | Icons, charts, UI         | Games, complex animations |
