# JavaScript Scripting Documents

Client-side JavaScript's central purpose is to turn static HTML documents into interactive web applications by manipulating document content through the Document Object Model (DOM).

---

## Overview

Every **Window** object has a **document** property that refers to a **Document** object, which represents the content of the window. The Document object is the central API for:

- Selecting individual elements
- Traversing the document tree
- Querying and setting attributes
- Modifying content
- Creating, inserting, and deleting nodes

---

## 1. Selecting Document Elements

### CSS Selectors (Modern Approach)

The most powerful way to select elements uses **CSS selector syntax**.

#### Basic CSS Selector Syntax

```javascript
// By tag name
div                     // Any <div> element

// By ID
#nav                    // Element with id="nav"

// By class
.warning                // Elements with "warning" in class attribute

// By attribute
p[lang="fr"]            // Paragraph in French: <p lang="fr">
*[name="x"]             // Any element with name="x" attribute

// Combined selectors
span.fatal.error        // <span> with both "fatal" and "error" classes
span[lang="fr"].warning // <span> in French with class "warning"
```

#### Structural Selectors

```javascript
// Descendant selector (any level down)
#log span               // Any <span> descendant of id="log"

// Child selector (direct child only)
#log>span               // Direct <span> child of id="log"

// First child
body>h1:first-child     // First <h1> child of <body>

// Adjacent sibling
img + p.caption         // <p> with class "caption" immediately after <img>

// General sibling
h2 ~ p                  // Any <p> that follows and is sibling of <h2>

// Multiple selectors (OR)
button, input[type="button"]  // All <button> OR <input type="button">
```

### querySelector() and querySelectorAll()

**querySelector()** - Returns **first** matching element or `null`:

```javascript
let spinner = document.querySelector('#spinner');
let firstPara = document.querySelector('p');
```

**querySelectorAll()** - Returns **all** matching elements as a **NodeList**:

```javascript
let titles = document.querySelectorAll('h1, h2, h3');
```

**NodeList characteristics**:

- Array-like object with `length` property
- Can be indexed like arrays: `titles[0]`
- Iterable (works with `for...of` loops)
- Convert to array: `Array.from(titles)`
- Returns empty NodeList (length 0) if no matches

**Element-level querying**:

```javascript
let section = document.querySelector('#main');
let paragraphs = section.querySelectorAll('p'); // Only descendants
```

**Limitations**:

- `::first-line` and `::first-letter` pseudo-elements won't match
- `:link` and `:visited` may not work (privacy protection)

### closest() Method

Searches **upward** in the tree for matching ancestor:

```javascript
// Find closest enclosing <a> tag with href
let hyperlink = event.target.closest('a[href]');

// Check if element is inside a list
function insideList(e) {
  return e.closest('ul,ol,dl') !== null;
}
```

- Returns the element itself if it matches
- Returns closest matching ancestor
- Returns `null` if no match found

### matches() Method

Tests if element matches a selector:

```javascript
function isHeading(e) {
  return e.matches('h1,h2,h3,h4,h5,h6');
}
```

### Older Selection Methods (Legacy)

Still functional but mostly obsolete:

```javascript
// By ID
let sect1 = document.getElementById('sect1');

// By name attribute
let colors = document.getElementsByName('color');

// By tag name
let headings = document.getElementsByTagName('h1');
let subheads = sect1.getElementsByTagName('h2'); // Within element

// By class name
let tooltips = document.getElementsByClassName('tooltip');
let sidebars = sect1.getElementsByClassName('sidebar');
```

**Key difference**: These return **live** NodeLists (update automatically when document changes), unlike `querySelectorAll()` which returns static NodeLists.

### Preselected Elements

Historical shortcut properties:

```javascript
document.images; // All <img> elements
document.forms; // All <form> elements
document.links; // All <a> elements with href attribute

// Access by ID or name
document.forms.address; // <form id="address">
```

**Deprecated**: `document.all` (don't use)

---

## 2. Document Structure and Traversal

### Element-Only Traversal API

Properties for navigating between **Elements** (ignoring Text nodes):

| Property                 | Description                          |
| ------------------------ | ------------------------------------ |
| `parentNode`             | Parent element (Element or Document) |
| `children`               | NodeList of Element children only    |
| `childElementCount`      | Number of Element children           |
| `firstElementChild`      | First Element child or `null`        |
| `lastElementChild`       | Last Element child or `null`         |
| `nextElementSibling`     | Next sibling Element or `null`       |
| `previousElementSibling` | Previous sibling Element or `null`   |

**Examples**:

```javascript
// Second child of first child of document
document.children[0].children[1];
document.firstElementChild.firstElementChild.nextElementSibling;

// Both refer to <body> in standard HTML
```

**Recursive traversal**:

```javascript
// Depth-first traversal
function traverse(e, f) {
  f(e); // Invoke function on element
  for (let child of e.children) {
    // Iterate children
    traverse(child, f); // Recurse
  }
}

// Alternative using firstElementChild
function traverse2(e, f) {
  f(e);
  let child = e.firstElementChild;
  while (child !== null) {
    traverse2(child, f);
    child = child.nextElementSibling;
  }
}
```

### Documents as Trees of Nodes

Properties for traversing **all nodes** (including Text and Comment nodes):

| Property          | Description                                         |
| ----------------- | --------------------------------------------------- |
| `parentNode`      | Parent node or `null`                               |
| `childNodes`      | NodeList of all children                            |
| `firstChild`      | First child node or `null`                          |
| `lastChild`       | Last child node or `null`                           |
| `nextSibling`     | Next sibling node or `null`                         |
| `previousSibling` | Previous sibling node or `null`                     |
| `nodeType`        | Node type: 9=Document, 1=Element, 3=Text, 8=Comment |
| `nodeValue`       | Text content of Text/Comment nodes                  |
| `nodeName`        | HTML tag name (uppercase) for Elements              |

**Example**:

```javascript
document.childNodes[0].childNodes[1];
document.firstChild.firstChild.nextSibling;
```

**Warning**: This API is sensitive to whitespace. A newline creates a Text node.

**Getting all text content**:

```javascript
function textContent(e) {
  let s = '';
  for (let child = e.firstChild; child !== null; child = child.nextSibling) {
    let type = child.nodeType;
    if (type === 3) {
      // Text node
      s += child.nodeValue;
    } else if (type === 1) {
      // Element node
      s += textContent(child); // Recurse
    }
  }
  return s;
}

// In practice, just use:
e.textContent;
```

---

## 3. Attributes

HTML elements have attributes (name/value pairs) like `href`, `id`, `class`, etc.

### HTML Attributes as Element Properties

Most HTML attributes are available as JavaScript properties:

```javascript
let image = document.querySelector('#main_image');
let url = image.src; // Get src attribute
image.id === 'main_image'; // true

let form = document.querySelector('form');
form.action = 'https://example.com/submit';
form.method = 'POST';
```

### Naming Conventions

**Attribute → Property conversion**:

- Lowercase: `id`, `title`, `lang`
- camelCase for multi-word: `tabIndex`, `defaultChecked`
- Event handlers: lowercase (`onclick`)
- Reserved words: prefix with `html` → `htmlFor` (for `for` attribute)
- Special case: `class` → `className`

### Property Types

- **String values**: Most attributes (`id`, `src`, `href`)
- **Boolean values**: `defaultChecked`, `disabled`
- **Numeric values**: `maxLength`, `tabIndex`
- **Functions**: Event handlers (`onclick`, `onload`)

### Generic Attribute Methods

```javascript
element.getAttribute('data-custom');
element.setAttribute('data-custom', 'value');
element.hasAttribute('data-custom'); // true/false
element.removeAttribute('data-custom');
```

**Note**: Cannot use `delete` operator to remove attributes.

### The class Attribute

The `class` attribute is special because it's a space-separated list of CSS classes.

#### className Property

```javascript
element.className = 'warning error'; // Set as string
```

#### classList Property (Preferred)

Treats class as a **set** with helpful methods:

```javascript
let spinner = document.querySelector('#spinner');

spinner.classList.add('animated'); // Add class
spinner.classList.remove('hidden'); // Remove class
spinner.classList.contains('animated'); // Check if has class
spinner.classList.toggle('visible'); // Toggle on/off
```

**classList** is:

- Iterable (use with `for...of`)
- Array-like (has `length`)
- Behaves like a Set

### Dataset Attributes

Custom attributes starting with `data-` are valid HTML and accessible via `dataset`:

```html
<h2 id="title" data-section-number="16.1">Attributes</h2>
```

```javascript
let number = document.querySelector('#title').dataset.sectionNumber;
// "16.1"

// Hyphenated names become camelCase:
// data-section-number → dataset.sectionNumber
```

**Rules**:

- Attribute must be lowercase and start with `data-`
- Accessed via `dataset` property
- Hyphenated names convert to camelCase
- Won't affect element presentation

---

## 4. Element Content

Element content can be manipulated as:

1. **HTML markup** (string with tags)
2. **Plain text** (string without tags)

### Element Content as HTML

#### innerHTML Property

**Reading**:

```javascript
let html = element.innerHTML; // Get HTML content as string
```

**Writing**:

```javascript
element.innerHTML = '<h1>New Content</h1>'; // Replaces content
```

**Warning**:

- Browser parses and renders the HTML
- Setting innerHTML is efficient
- Appending with `+=` is inefficient (serialize + parse)
- **NEVER insert user input** (security risk: XSS attacks)

#### outerHTML Property

Like `innerHTML` but includes the element's own tags:

```javascript
// Reading includes opening/closing tags
let html = element.outerHTML;

// Writing replaces the element itself
element.outerHTML = '<div>New Element</div>';
```

#### insertAdjacentHTML() Method

Insert HTML at specific positions:

```javascript
element.insertAdjacentHTML(position, htmlString);
```

**Positions**:

- `"beforebegin"` - Before the element
- `"afterbegin"` - Inside, before first child
- `"beforeend"` - Inside, after last child
- `"afterend"` - After the element

```html
<!-- beforebegin -->
<div>
  <!-- afterbegin -->
  content
  <!-- beforeend -->
</div>
<!-- afterend -->
```

### Element Content as Plain Text

#### textContent Property

Standard way to get/set plain text:

```javascript
let para = document.querySelector('p');
let text = para.textContent; // Get all text
para.textContent = 'Hello World!'; // Replace with plain text
```

**Characteristics**:

- Defined on Node class (works for Text and Element nodes)
- For Elements: returns all text from all descendants
- Setting: replaces all content with plain text (HTML escaped automatically)

**Deprecated**: `innerText` (don't use - inconsistent behavior)

### Text in `<script>` Elements

Inline scripts can store arbitrary text data:

```html
<script type="text/x-custom-data" id="data">
  Any text here, including <angles> & ampersands
</script>
```

```javascript
let data = document.querySelector('#data').text;
```

**Benefits**:

- HTML parser ignores angle brackets/ampersands
- Never displayed by browser
- Perfect for embedding data

---

## 5. Creating, Inserting, and Deleting Nodes

### Creating Elements

```javascript
let para = document.createElement('p');
let em = document.createElement('em');
let text = document.createTextNode('explicit text'); // Rarely needed
```

### Adding Content

#### append() and prepend()

Add content at end or start of element:

```javascript
let para = document.createElement('p');
let em = document.createElement('em');

em.append('World'); // Add text
para.append('Hello ', em, '!'); // Add text and element
para.prepend('¡'); // Add at start

para.innerHTML; // "¡Hello <em>World</em>!"
```

**Features**:

- Take multiple arguments (Node objects or strings)
- Strings automatically converted to Text nodes
- `append()` adds at end
- `prepend()` adds at start

### Inserting Relative to Siblings

#### before() and after()

Insert relative to an existing element or text node:

```javascript
let heading = document.querySelector('h2.greetings');

// Insert after the heading
heading.after(para, document.createElement('hr'));

// Insert before the heading
heading.before(para);
```

**Important**: Elements can only exist in one place. Inserting moves them, doesn't copy.

### Copying Elements

```javascript
// Deep copy (includes all descendants)
let copy = element.cloneNode(true);

// Shallow copy (no children)
let copy = element.cloneNode(false);
```

### Removing and Replacing

```javascript
// Remove element
element.remove();

// Replace element
element.replaceWith(newElement);
element.replaceWith('text', elem1, elem2); // Multiple arguments
```

### Legacy Methods (Avoid)

Older, harder-to-use methods:

- `appendChild()`
- `insertBefore()`
- `replaceChild()`
- `removeChild()`

---

## 6. Example: Table of Contents Generator

A practical example demonstrating multiple DOM techniques:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Find or create TOC container
  let toc = document.querySelector('#TOC');
  if (!toc) {
    toc = document.createElement('div');
    toc.id = 'TOC';
    document.body.prepend(toc);
  }

  // Find all section headings
  let headings = document.querySelectorAll('h2,h3,h4,h5,h6');
  let sectionNumbers = [0, 0, 0, 0, 0];

  for (let heading of headings) {
    if (heading.parentNode === toc) continue;

    // Calculate section number
    let level = parseInt(heading.tagName.charAt(1)) - 1;
    sectionNumbers[level - 1]++;
    for (let i = level; i < sectionNumbers.length; i++) {
      sectionNumbers[i] = 0;
    }
    let sectionNumber = sectionNumbers.slice(0, level).join('.');

    // Add section number to heading
    let span = document.createElement('span');
    span.className = 'TOCSectNum';
    span.textContent = sectionNumber;
    heading.prepend(span);

    // Wrap heading in anchor
    let anchor = document.createElement('a');
    anchor.name = `TOC${sectionNumber}`;
    heading.before(anchor);
    anchor.append(heading);

    // Create TOC entry
    let link = document.createElement('a');
    link.href = `#TOC${sectionNumber}`;
    link.innerHTML = heading.innerHTML;

    let entry = document.createElement('div');
    entry.classList.add('TOCEntry', `TOCLevel${level}`);
    entry.append(link);
    toc.append(entry);
  }
});
```

**Techniques demonstrated**:

- Event handling (`DOMContentLoaded`)
- Element selection (`querySelector`, `querySelectorAll`)
- Element creation (`createElement`)
- Content manipulation (`textContent`, `innerHTML`)
- DOM traversal (`parentNode`, `tagName`)
- Attribute setting (`id`, `className`, `href`, `name`)
- Insertion methods (`prepend`, `before`, `append`)
- classList manipulation

---

## Key Concepts Summary

✅ **querySelector/querySelectorAll** use CSS selectors to find elements
✅ **Element traversal** properties navigate between Elements only
✅ **Node traversal** properties include all nodes (Text, Comment, etc.)
✅ **Attributes** are accessible as properties (with naming conventions)
✅ **classList** provides Set-like interface for class management
✅ **dataset** accesses data-\* attributes as properties
✅ **innerHTML** gets/sets HTML content (XSS risk with user input)
✅ **textContent** gets/sets plain text safely
✅ **append/prepend** add content at end/start
✅ **before/after** insert relative to siblings
✅ **createElement** creates new elements
✅ **cloneNode** copies elements
✅ **remove/replaceWith** delete or replace elements
✅ Elements can only exist in **one location** (moves, not copies)
