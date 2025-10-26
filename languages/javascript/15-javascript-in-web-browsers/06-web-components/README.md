# JavaScript Web Components

Web Components allow you to create **reusable, self-contained custom HTML elements** using native browser APIs. They're a browser-native alternative to frameworks like React and Angular.

## What Are Web Components?

Web components extend HTML with custom tags that work as independent UI components. They're based on **three core web standards**:

1. **Custom Elements** - Define new HTML tags with JavaScript classes
2. **Shadow DOM** - Encapsulate component styles and markup
3. **HTML Templates** - Define reusable HTML structures

---

## Using Web Components

### Including a Web Component

Load the component's JavaScript file (often as a module):

```html
<script type="module" src="components/search-box.js"></script>
```

### Using Custom Tags

Web component tag names **must include a hyphen** and require both opening and closing tags:

```html
<!-- Correct -->
<search-box placeholder="Search..."></search-box>

<!-- Wrong - no self-closing tags -->
<search-box />
```

### Attributes and Properties

Components support attributes like regular HTML elements:

```html
<search-box placeholder="Search..." size="30" disabled> </search-box>
```

### Using Slots

Some components accept specially-labeled children via **slots**:

```html
<search-box>
  <img src="images/search-icon.png" slot="left" />
  <img src="images/cancel-icon.png" slot="right" />
</search-box>
```

- The `slot` attribute specifies where children appear
- Slot names are defined by the component

### Handling Initial Rendering

Web components are often defined **after** the HTML is parsed, causing a brief delay before they're "upgraded."

**Hide undefined components with CSS**:

```css
search-box:not(:defined) {
  opacity: 0;
  display: inline-block;
  width: 300px;
  height: 50px;
}
```

### Using in JavaScript

Query web components like regular elements:

```javascript
let searchBox = document.querySelector('search-box');
searchBox.placeholder = 'Type here...';
searchBox.addEventListener('search', (e) => {
  console.log('Search for:', e.detail);
});
```

**Important**: Query components after their defining module has loaded.

---

## 1. HTML Templates

The `<template>` tag defines **reusable HTML structures** that aren't rendered until cloned via JavaScript.

### Why Use Templates?

- Define HTML structure once, reuse many times
- More efficient than repeated `innerHTML` parsing
- Commonly used internally by web components

### Basic Usage

**HTML**:

```html
<template id="row">
  <tr>
    <td class="name"></td>
    <td class="email"></td>
  </tr>
</template>

<table>
  <tbody id="table-body"></tbody>
</table>
```

**JavaScript**:

```javascript
let tbody = document.querySelector('#table-body');
let template = document.querySelector('#row');

// Clone the template content
let clone = template.content.cloneNode(true); // deep clone

// Modify the clone
clone.querySelector('.name').textContent = 'Alice';
clone.querySelector('.email').textContent = 'alice@example.com';

// Add to document
tbody.append(clone); // DocumentFragment inserts its children
```

### Creating Templates in JavaScript

You don't need HTML `<template>` tags—create them programmatically:

```javascript
let template = document.createElement('template');
template.innerHTML = `
  <div class="card">
    <h2 class="title"></h2>
    <p class="description"></p>
  </div>
`;

// Clone and use
let clone = template.content.cloneNode(true);
```

### DocumentFragment

`template.content` is a **DocumentFragment**:

- A temporary parent for sibling nodes
- When inserted into the DOM, only its **children** are inserted
- The fragment itself disappears

---

## 2. Custom Elements

Custom elements associate a **JavaScript class** with an **HTML tag name**, automatically instantiating the class for matching tags.

### Defining a Custom Element

```javascript
customElements.define('tag-name', ClassName);
```

**Requirements**:

- Tag name must include a hyphen (e.g., `my-element`, not `myelement`)
- Class must extend `HTMLElement`
- Constructor must call `super()` first

### Basic Example: `<inline-circle>`

```javascript
customElements.define(
  'inline-circle',
  class InlineCircle extends HTMLElement {
    constructor() {
      super(); // Required first step
      // Initialization code here
    }
  }
);
```

**Usage**:

```html
<p>
  Here's a circle: <inline-circle></inline-circle> And a blue one:
  <inline-circle diameter="1.2em" color="blue"></inline-circle>
</p>
```

### Lifecycle Methods

#### connectedCallback()

Called when the element is **inserted into the DOM**:

```javascript
connectedCallback() {
  this.style.display = "inline-block";
  this.style.borderRadius = "50%";
  this.style.border = "solid black 1px";

  if (!this.style.width) {
    this.style.width = "0.8em";
    this.style.height = "0.8em";
  }
}
```

#### disconnectedCallback()

Called when the element is **removed from the DOM** (less commonly used).

#### attributeChangedCallback()

Called when observed attributes change:

```javascript
static get observedAttributes() {
  return ["diameter", "color"];
}

attributeChangedCallback(name, oldValue, newValue) {
  switch(name) {
    case "diameter":
      this.style.width = newValue;
      this.style.height = newValue;
      break;
    case "color":
      this.style.backgroundColor = newValue;
      break;
  }
}
```

**Note**: Only attributes listed in `observedAttributes` trigger this callback.

### Properties and Attributes

Define getters/setters that sync with HTML attributes:

```javascript
get diameter() {
  return this.getAttribute("diameter");
}

set diameter(value) {
  this.setAttribute("diameter", value);
}

get color() {
  return this.getAttribute("color");
}

set color(value) {
  this.setAttribute("color", value);
}
```

**Usage**:

```javascript
let circle = document.querySelector('inline-circle');
circle.diameter = '2em'; // Sets attribute, triggers attributeChangedCallback
```

---

## 3. Shadow DOM

Shadow DOM provides **encapsulation** for web components, creating a private DOM tree attached to a host element.

### What is Shadow DOM?

- A **shadow root** attached to a **shadow host** element
- Creates a separate, encapsulated DOM tree
- Styles and scripts don't leak in or out
- Used internally by `<audio>`, `<video>`, and other browser UI elements

### Key Benefits

1. **DOM Encapsulation**: Shadow DOM elements are hidden from `querySelector()` and other DOM methods
2. **Style Encapsulation**: Styles inside shadow DOM don't affect outside elements (and vice versa)
3. **Event Retargeting**: Events crossing the shadow boundary appear to originate from the host element

### Creating a Shadow Root

```javascript
constructor() {
  super();

  // Attach shadow root to this element
  this.attachShadow({mode: "open"});

  // Add content to shadow root
  this.shadowRoot.innerHTML = `
    <style>
      p { color: blue; }
    </style>
    <p>This is in the shadow DOM</p>
  `;
}
```

**Modes**:

- `{mode: "open"}` - Accessible via `element.shadowRoot`
- `{mode: "closed"}` - Completely sealed (rare)

### Style Encapsulation

**Shadow DOM styles are scoped**:

```javascript
this.shadowRoot.innerHTML = `
  <style>
    /* Only affects elements in this shadow DOM */
    p { color: red; }

    /* :host refers to the shadow host element */
    :host {
      display: inline-block;
      border: 1px solid black;
    }

    /* :host with attribute */
    :host([disabled]) {
      opacity: 0.5;
    }

    /* :host with class */
    :host(.highlighted) {
      background: yellow;
    }
  </style>
  <p>Red text inside shadow DOM</p>
`;
```

**Light DOM styles don't affect shadow DOM**:

```html
<style>
  /* This won't affect the shadow DOM paragraph */
  p {
    color: green;
  }
</style>

<my-component></my-component>
```

### Slots: Light DOM Children

Slots allow light DOM children to be displayed within shadow DOM:

**Shadow DOM with slot**:

```javascript
this.shadowRoot.innerHTML = `
  <div class="wrapper">
    <h2>Component Title</h2>
    <slot></slot> <!-- Light DOM children appear here -->
  </div>
`;
```

**Light DOM usage**:

```html
<my-component>
  <p>This content goes into the slot</p>
</my-component>
```

### Named Slots

Multiple slots with names:

**Shadow DOM**:

```javascript
this.shadowRoot.innerHTML = `
  <div>
    <slot name="header"></slot>
    <slot></slot> <!-- Default slot -->
    <slot name="footer"></slot>
  </div>
`;
```

**Light DOM**:

```html
<my-component>
  <h1 slot="header">Header Content</h1>
  <p>Default slot content</p>
  <footer slot="footer">Footer Content</footer>
</my-component>
```

### Slot Change Events

Listen for changes to slotted content:

```javascript
let slot = this.shadowRoot.querySelector('slot[name="left"]');
slot.addEventListener('slotchange', (e) => {
  console.log('Slot content changed');
});
```

### Important Behaviors

- **Light DOM children remain in light DOM**: They appear in the slot but don't become part of shadow DOM
- **Inheritance**: Shadow DOM inherits font, colors from light DOM
- **CSS Variables**: Shadow DOM can use CSS variables defined in light DOM
- **Event retargeting**: Events from shadow DOM appear to come from the host

---

## Complete Example: `<search-box>` Component

Here's a full web component implementation using all three technologies:

```javascript
class SearchBox extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    this.attachShadow({ mode: 'open' });

    // Clone template and add to shadow root
    this.shadowRoot.append(SearchBox.template.content.cloneNode(true));

    // Get references to shadow DOM elements
    this.input = this.shadowRoot.querySelector('#input');
    let leftSlot = this.shadowRoot.querySelector('slot[name="left"]');
    let rightSlot = this.shadowRoot.querySelector('slot[name="right"]');

    // Focus handling
    this.input.onfocus = () => this.setAttribute('focused', '');
    this.input.onblur = () => this.removeAttribute('focused');

    // Search event on left icon click
    leftSlot.onclick = this.input.onchange = (event) => {
      event.stopPropagation();
      if (this.disabled) return;

      this.dispatchEvent(
        new CustomEvent('search', {
          detail: this.input.value,
        })
      );
    };

    // Clear event on right icon click
    rightSlot.onclick = (event) => {
      event.stopPropagation();
      if (this.disabled) return;

      let e = new CustomEvent('clear', { cancelable: true });
      this.dispatchEvent(e);

      if (!e.defaultPrevented) {
        this.input.value = '';
      }
    };
  }

  // Observe attribute changes
  static get observedAttributes() {
    return ['disabled', 'placeholder', 'size', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this.input.disabled = newValue !== null;
    } else if (name === 'placeholder') {
      this.input.placeholder = newValue;
    } else if (name === 'size') {
      this.input.size = newValue;
    } else if (name === 'value') {
      this.input.value = newValue;
    }
  }

  // Property getters and setters
  get placeholder() {
    return this.getAttribute('placeholder');
  }
  set placeholder(value) {
    this.setAttribute('placeholder', value);
  }

  get size() {
    return this.getAttribute('size');
  }
  set size(value) {
    this.setAttribute('size', value);
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(text) {
    this.setAttribute('value', text);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get hidden() {
    return this.hasAttribute('hidden');
  }
  set hidden(value) {
    if (value) this.setAttribute('hidden', '');
    else this.removeAttribute('hidden');
  }
}

// Create template
SearchBox.template = document.createElement('template');
SearchBox.template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      border: solid black 1px;
      border-radius: 5px;
      padding: 4px 6px;
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]) {
      opacity: 0.5;
    }

    :host([focused]) {
      box-shadow: 0 0 2px 2px #6AE;
    }

    input {
      border-width: 0;
      outline: none;
      font: inherit;
      background: inherit;
    }

    slot {
      cursor: default;
      user-select: none;
    }
  </style>

  <div>
    <slot name="left">🔍</slot>
    <input type="text" id="input" />
    <slot name="right">✕</slot>
  </div>
`;

// Register the custom element
customElements.define('search-box', SearchBox);
```

**Usage**:

```html
<search-box placeholder="Search..." size="30"></search-box>

<search-box>
  <img src="search.png" slot="left" />
  <img src="cancel.png" slot="right" />
</search-box>

<script>
  let box = document.querySelector('search-box');
  box.addEventListener('search', (e) => {
    console.log('Search for:', e.detail);
  });
  box.addEventListener('clear', (e) => {
    console.log('Cleared search box');
  });
</script>
```

---

## Best Practices

✅ **Always include hyphens** in custom element tag names
✅ **Use templates** for repeated structures to improve performance
✅ **Call `super()`** first in custom element constructors
✅ **Use shadow DOM** for style encapsulation
✅ **Define observedAttributes** for reactive attribute handling
✅ **Provide property getters/setters** that sync with attributes
✅ **Use slots** for flexible, composable components
✅ **Dispatch custom events** for component communication
✅ **Consider accessibility** (ARIA attributes, keyboard navigation)
✅ **Use libraries** like lit-element for complex components

---

## Key Concepts Summary

📌 **Web components** = Custom Elements + Shadow DOM + HTML Templates
📌 **Custom elements** define new HTML tags with JavaScript classes
📌 **Shadow DOM** provides style and DOM encapsulation
📌 **Templates** enable efficient HTML reuse
📌 **Tag names must include hyphens** (e.g., `my-component`)
📌 **Lifecycle methods** handle initialization and changes
📌 **Slots** allow light DOM children to appear in shadow DOM
📌 **Style encapsulation** prevents CSS conflicts
📌 **Event retargeting** makes shadow DOM transparent to outside code
📌 **Browser native** - no framework required
