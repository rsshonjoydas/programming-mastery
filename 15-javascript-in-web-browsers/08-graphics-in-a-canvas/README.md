# Graphics in a Canvas

The `<canvas>` element creates a drawing surface in HTML documents and exposes a powerful JavaScript-based drawing API for client-side graphics.

## Canvas vs SVG

| Feature         | Canvas                    | SVG                            |
| --------------- | ------------------------- | ------------------------------ |
| **Approach**    | Procedural (method calls) | Declarative (XML elements)     |
| **API Type**    | JavaScript-based          | DOM-based                      |
| **Editing**     | Must redraw from scratch  | Remove/modify elements         |
| **Performance** | Better for many objects   | Better for few objects         |
| **Scalability** | Pixelated when zoomed     | Crisp at any zoom level        |
| **Use Case**    | Games, data visualization | Icons, diagrams, illustrations |

## Getting Started

### Basic Setup

```javascript
// Get the canvas element
let canvas = document.querySelector('#my_canvas_id');

// Get the 2D drawing context
let c = canvas.getContext('2d');

// Now you can draw with the context object
```

### HTML Structure

```html
<canvas id="my_canvas_id" width="500" height="400"></canvas>
```

### Simple Example

```html
<p>
  This is a red square: <canvas id="square" width="10" height="10"></canvas>.
</p>
<p>
  This is a blue circle: <canvas id="circle" width="10" height="10"></canvas>.
</p>

<script>
  let canvas = document.querySelector('#square');
  let context = canvas.getContext('2d');
  context.fillStyle = '#f00'; // Red fill
  context.fillRect(0, 0, 10, 10); // Fill square

  canvas = document.querySelector('#circle');
  context = canvas.getContext('2d');
  context.beginPath();
  context.arc(5, 5, 5, 0, 2 * Math.PI, true); // Circle path
  context.fillStyle = '#00f'; // Blue fill
  context.fill();
</script>
```

---

## 1. Paths and Polygons

Paths are sequences of connected points that can be stroked (outlined) or filled.

### Path Methods

**beginPath()** - Start a new path
**moveTo(x, y)** - Start a new subpath at point (x,y)
**lineTo(x, y)** - Draw a line to point (x,y)
**closePath()** - Connect end point to start point
**fill()** - Fill the path
**stroke()** - Outline the path

### Basic Path Example

```javascript
c.beginPath();
c.moveTo(100, 100); // Start at (100,100)
c.lineTo(200, 200); // Line to (200,200)
c.lineTo(100, 200); // Line to (100,200)
c.fill(); // Fill the triangle
c.stroke(); // Stroke two sides (open path)
```

### Drawing Regular Polygons

```javascript
function polygon(c, n, x, y, r, angle = 0, counterclockwise = false) {
  c.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));

  let delta = (2 * Math.PI) / n;
  for (let i = 1; i < n; i++) {
    angle += counterclockwise ? -delta : delta;
    c.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
  }

  c.closePath();
}

// Usage
c.beginPath();
polygon(c, 3, 50, 70, 50); // Triangle
polygon(c, 6, 150, 70, 50); // Hexagon
c.fillStyle = '#ccc';
c.strokeStyle = '#008';
c.lineWidth = 5;
c.fill();
c.stroke();
```

### Important Path Concepts

- **Open paths**: fill() connects end to start automatically
- **Multiple subpaths**: stroke() and fill() affect all subpaths
- **Non-destructive**: Calling fill() doesn't clear the path
- **Nonzero winding rule**: Determines which areas are "inside" for overlapping paths

---

## 2. Canvas Dimensions and Coordinates

### Coordinate System

- **Origin**: Upper-left corner (0, 0)
- **X-axis**: Increases to the right
- **Y-axis**: Increases downward
- **Values**: Floating-point numbers allowed

### Setting Canvas Size

```javascript
// HTML attributes (affects memory allocation)
<canvas width='500' height='400'></canvas>;

// Or via JavaScript
canvas.width = 500;
canvas.height = 400;
```

**Warning**: Setting width or height **clears the entire canvas** and resets all graphics state!

### High-DPI Displays

For crisp graphics on high-resolution screens:

```javascript
// Set CSS size
canvas.style.width = '500px';
canvas.style.height = '400px';

// Set actual pixel dimensions
let dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;
canvas.height = 400 * dpr;

// Scale the context
c.scale(dpr, dpr);
```

---

## 3. Graphics Attributes

Graphics attributes control how drawing operations appear. They're set on the context object, not passed to drawing methods.

### Line Styles

```javascript
c.lineWidth = 5; // Line thickness in pixels
c.lineCap = 'round'; // "butt", "round", "square"
c.lineJoin = 'round'; // "miter", "round", "bevel"
c.miterLimit = 10; // Max miter length
c.setLineDash([10, 5]); // Dash pattern: [dash, gap, ...]
c.lineDashOffset = 0; // Offset into dash pattern
```

### Colors, Patterns, and Gradients

**Solid colors**:

```javascript
c.fillStyle = '#ff0000'; // Hex color
c.strokeStyle = 'rgb(0,0,255)'; // RGB
c.fillStyle = 'rgba(0,255,0,0.5)'; // RGBA with alpha
```

**Linear gradients**:

```javascript
let gradient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0.0, '#88f');
gradient.addColorStop(1.0, '#fff');
c.fillStyle = gradient;
```

**Radial gradients**:

```javascript
let gradient = c.createRadialGradient(300, 300, 100, 300, 300, 300);
gradient.addColorStop(0.0, 'transparent');
gradient.addColorStop(0.7, 'rgba(100,100,100,0.9)');
gradient.addColorStop(1.0, 'transparent');
c.fillStyle = gradient;
```

**Patterns**:

```javascript
let img = document.querySelector('#pattern-image');
let pattern = c.createPattern(img, 'repeat'); // "repeat-x", "repeat-y", "no-repeat"
c.fillStyle = pattern;
```

### Text Styles

```javascript
c.font = 'bold 24px Arial'; // CSS font syntax
c.textAlign = 'center'; // "start", "left", "center", "right", "end"
c.textBaseline = 'middle'; // "top", "middle", "bottom", "alphabetic", "hanging"
```

### Shadows

```javascript
c.shadowColor = 'rgba(0,0,0,0.5)'; // Semi-transparent black
c.shadowOffsetX = 5; // Horizontal offset
c.shadowOffsetY = 5; // Vertical offset
c.shadowBlur = 10; // Blur radius
```

### Transparency and Compositing

```javascript
c.globalAlpha = 0.5; // 0 (transparent) to 1 (opaque)
c.globalCompositeOperation = 'source-over'; // How pixels combine
```

**Common composite operations**:

- `"source-over"` (default) - New pixels drawn over old
- `"destination-over"` - New pixels drawn behind old
- `"source-atop"` - New pixels only where old pixels exist
- `"lighter"` - Add color values (brightening effect)
- `"copy"` - Replace everything with new pixels

### Saving and Restoring State

```javascript
c.save(); // Push current state onto stack
c.fillStyle = '#f00'; // Modify state
c.fillRect(0, 0, 100, 100);
c.restore(); // Pop state from stack (fillStyle restored)
```

**Saved state includes**: All properties listed above, plus transformations and clipping region (but **not** the current path).

---

## 4. Drawing Operations

### Rectangles

```javascript
c.fillRect(x, y, width, height); // Fill rectangle
c.strokeRect(x, y, width, height); // Stroke outline
c.clearRect(x, y, width, height); // Clear to transparent
c.rect(x, y, width, height); // Add rectangle to path
```

### Curves

**arc()** - Circular arcs:

```javascript
c.arc(x, y, radius, startAngle, endAngle, counterclockwise);
// Example: Full circle
c.arc(100, 100, 50, 0, 2 * Math.PI, false);
```

**ellipse()** - Elliptical arcs:

```javascript
c.ellipse(
  x,
  y,
  radiusX,
  radiusY,
  rotation,
  startAngle,
  endAngle,
  counterclockwise
);
```

**arcTo()** - Rounded corners:

```javascript
c.arcTo(x1, y1, x2, y2, radius);
// Creates arc tangent to lines from current point to (x1,y1) to (x2,y2)
```

**bezierCurveTo()** - Cubic Bezier curves:

```javascript
c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
// Two control points for smooth curves
```

**quadraticCurveTo()** - Quadratic Bezier curves:

```javascript
c.quadraticCurveTo(cpx, cpy, x, y);
// One control point for simpler curves
```

### Text

```javascript
c.fillText(text, x, y, maxWidth); // Fill text
c.strokeText(text, x, y, maxWidth); // Stroke text outline

// Measure text before drawing
let metrics = c.measureText('Hello');
console.log(metrics.width); // Width in pixels
```

### Images

```javascript
let img = document.querySelector('#my-image');

// Draw entire image at (x, y)
c.drawImage(img, x, y);

// Draw scaled image
c.drawImage(img, x, y, width, height);

// Draw portion of image
c.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

**Export canvas as image**:

```javascript
let dataURL = canvas.toDataURL(); // PNG as data: URL
let img = document.createElement('img');
img.src = dataURL;
document.body.appendChild(img);
```

---

## 5. Coordinate System Transforms

Transformations modify the current coordinate system.

### Basic Transformations

**translate()** - Move origin:

```javascript
c.translate(dx, dy); // Shift coordinate system
```

**rotate()** - Rotate axes:

```javascript
c.rotate(angle); // Angle in radians, clockwise
```

**scale()** - Scale distances:

```javascript
c.scale(sx, sy); // Stretch/compress axes
// Negative values flip axes
```

### Transform Example

```javascript
c.save();
c.translate(200, 200); // Move origin to center
c.rotate(Math.PI / 4); // Rotate 45 degrees
c.fillRect(-50, -50, 100, 100); // Draw centered square
c.restore();
```

### Advanced Transforms

**transform()** - Apply arbitrary affine transform:

```javascript
c.transform(a, b, c, d, e, f);
// x' = a*x + c*y + e
// y' = b*x + d*y + f
```

**setTransform()** - Replace current transform:

```javascript
c.setTransform(a, b, c, d, e, f);
// Reset to default: c.setTransform(1, 0, 0, 1, 0, 0);
```

### Koch Snowflake Example

```javascript
function snowflake(c, n, x, y, len) {
  c.save();
  c.translate(x, y);
  c.moveTo(0, 0);

  leg(n);
  c.rotate((-120 * Math.PI) / 180);
  leg(n);
  c.rotate((-120 * Math.PI) / 180);
  leg(n);

  c.closePath();
  c.restore();

  function leg(n) {
    c.save();
    if (n === 0) {
      c.lineTo(len, 0);
    } else {
      c.scale(1 / 3, 1 / 3);
      leg(n - 1);
      c.rotate((60 * Math.PI) / 180);
      leg(n - 1);
      c.rotate((-120 * Math.PI) / 180);
      leg(n - 1);
      c.rotate((60 * Math.PI) / 180);
      leg(n - 1);
    }
    c.restore();
    c.translate(len, 0);
  }
}

snowflake(c, 4, 100, 100, 200);
c.stroke();
```

---

## 6. Clipping

Clipping restricts drawing to a specific region.

```javascript
c.beginPath();
c.arc(200, 200, 100, 0, 2 * Math.PI);
c.clip(); // Set clipping region to circle

// Only pixels inside the circle will be drawn
c.fillStyle = '#f00';
c.fillRect(0, 0, 400, 400);
```

**Important**:

- clip() intersects with current clipping region (can't enlarge)
- Always save() before clip() so you can restore()
- Clipping affects all subsequent drawing operations

---

## 7. Pixel Manipulation

Direct access to raw pixel data for image processing.

### Getting Pixel Data

```javascript
let imageData = c.getImageData(x, y, width, height);
let pixels = imageData.data; // Uint8ClampedArray [R,G,B,A, R,G,B,A, ...]
let w = imageData.width;
let h = imageData.height;
```

### Creating Empty ImageData

```javascript
let imageData = c.createImageData(width, height);
```

### Putting Pixel Data Back

```javascript
c.putImageData(imageData, x, y);
```

### Motion Blur Example

```javascript
function smear(c, n, x, y, w, h) {
  let pixels = c.getImageData(x, y, w, h);
  let data = pixels.data;
  let width = pixels.width;
  let height = pixels.height;
  let m = n - 1;

  for (let row = 0; row < height; row++) {
    let i = row * width * 4 + 4;
    for (let col = 1; col < width; col++, i += 4) {
      data[i] = (data[i] + data[i - 4] * m) / n; // Red
      data[i + 1] = (data[i + 1] + data[i - 3] * m) / n; // Green
      data[i + 2] = (data[i + 2] + data[i - 2] * m) / n; // Blue
      data[i + 3] = (data[i + 3] + data[i - 1] * m) / n; // Alpha
    }
  }

  c.putImageData(pixels, x, y);
}
```

**Pixel data structure**:

- Each pixel = 4 bytes (RGBA)
- Values: 0-255
- Order: Left-to-right, top-to-bottom
- Index formula: `(y * width + x) * 4`

---

## 3D Graphics (WebGL)

```javascript
let gl = canvas.getContext('webgl');
// WebGL API for 3D graphics (not covered in detail here)
// Usually used via libraries like Three.js
```

---

## Best Practices

✅ **Use save()/restore()** to isolate graphics state changes
✅ **Call beginPath()** before starting a new shape
✅ **Set canvas size correctly** for high-DPI displays
✅ **Separate drawing logic** into reusable functions
✅ **Cache expensive operations** (gradients, patterns, measurements)
✅ **Use transformations** instead of manual coordinate calculations
✅ **Clear only necessary regions** with clearRect() for better performance
✅ **Batch similar operations** to minimize state changes

---

## Key Concepts Summary

📌 Canvas uses **immediate-mode rendering** (draw and forget)
📌 **Context object** (not canvas element) contains drawing methods
📌 **Paths** are sequences of connected points
📌 **Graphics attributes** are part of canvas state, not method parameters
📌 **Transformations** modify the coordinate system
📌 **Clipping regions** restrict drawing areas
📌 **Pixel manipulation** provides low-level image processing
📌 **save()/restore()** manage graphics state stack
📌 Setting **width/height clears** the entire canvas
📌 **putImageData()** bypasses all graphics attributes and compositing
