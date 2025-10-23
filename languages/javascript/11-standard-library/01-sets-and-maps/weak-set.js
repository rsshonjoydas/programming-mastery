// ==================
// JAVASCRIPT WEAKSET
// ==================

console.log('=== WHAT IS WEAKSET? ===\n');

console.log('WeakSet is a special type of Set with important differences:');
console.log('✓ Only accepts objects/arrays as values (no primitives)');
console.log('✓ Uses weak references (allows garbage collection)');
console.log('✓ Cannot be iterated (no forEach, for...of, spread)');
console.log('✓ No size property');
console.log('✓ Only 3 methods: add(), has(), delete()');
console.log(
  '\n🎯 Purpose: Tag/mark objects temporarily without memory leaks\n'
);

console.log('=== 1. CREATING WEAKSET ===\n');

// Empty WeakSet
let ws = new WeakSet();
console.log('Empty WeakSet created');

// Initialize with array of objects
let obj1 = { id: 1, name: 'Object 1' };
let obj2 = { id: 2, name: 'Object 2' };
let obj3 = { id: 3, name: 'Object 3' };

let ws2 = new WeakSet([obj1, obj2, obj3]);
console.log('WeakSet initialized with 3 objects');

console.log('\n=== 2. BASIC OPERATIONS ===\n');

let myWeakSet = new WeakSet();

// Objects that can be added
let userObj = { username: 'alice' };
let arrayObj = [1, 2, 3];
let funcObj = function () {
  return 'hello';
};
let dateObj = new Date();

// add() - Add objects to WeakSet
myWeakSet.add(userObj);
myWeakSet.add(arrayObj);
myWeakSet.add(funcObj);
myWeakSet.add(dateObj);
console.log('✓ Added 4 objects to WeakSet');

// has() - Check membership
console.log('\nChecking membership:');
console.log('has(userObj):', myWeakSet.has(userObj)); // true
console.log('has(arrayObj):', myWeakSet.has(arrayObj)); // true
console.log('has({}):', myWeakSet.has({})); // false (different reference)

// delete() - Remove objects
console.log('\nDeleting objects:');
console.log('delete(userObj):', myWeakSet.delete(userObj)); // true (removed)
console.log('has(userObj):', myWeakSet.has(userObj)); // false (no longer exists)
console.log('delete(userObj):', myWeakSet.delete(userObj)); // false (already gone)

console.log('\n=== 3. VALUE RESTRICTIONS ===\n');

let restrictedWS = new WeakSet();

// ✓ VALID: Objects and arrays
console.log('Valid values:');
try {
  restrictedWS.add({ type: 'object' });
  restrictedWS.add([1, 2, 3]);
  restrictedWS.add(new Date());
  restrictedWS.add(new Set());
  restrictedWS.add(new Map());
  console.log('✓ Objects, arrays, Date, Set, Map - all work!');
} catch (e) {
  console.log('✗ Error:', e.message);
}

// ✗ INVALID: Primitives throw TypeError
console.log('\n✗ Invalid values (primitives):');

try {
  restrictedWS.add('string');
} catch (e) {
  console.log('String:', e.message);
}

try {
  restrictedWS.add(42);
} catch (e) {
  console.log('Number:', e.message);
}

try {
  restrictedWS.add(true);
} catch (e) {
  console.log('Boolean:', e.message);
}

try {
  restrictedWS.add(Symbol('test'));
} catch (e) {
  console.log('Symbol:', e.message);
}

try {
  restrictedWS.add(null);
} catch (e) {
  console.log('Null:', e.message);
}

try {
  restrictedWS.add(undefined);
} catch (e) {
  console.log('Undefined:', e.message);
}

console.log('\n=== 4. NO ITERATION CAPABILITIES ===\n');

let ws4 = new WeakSet();
ws4.add({ a: 1 });
ws4.add({ b: 2 });
ws4.add({ c: 3 });

console.log('WeakSet CANNOT:');
console.log('✗ Be iterated with for...of');
console.log('✗ Use forEach() method');
console.log('✗ Use spread operator (...)');
console.log('✗ Call values() or entries()');
console.log('✗ Access .size property');
console.log('✗ List all members');

console.log('\nWhy? To allow garbage collection!');
console.log(
  "If we could iterate, objects would be 'reachable' and couldn't be GC'd"
);

console.log('\n=== 5. GARBAGE COLLECTION EXPLAINED ===\n');

console.log('📚 Theory:');
console.log('When an object has no references, JavaScript garbage collects it');
console.log(
  "WeakSet uses 'weak references' - doesn't count as keeping object alive"
);
console.log(
  "Regular Set uses 'strong references' - prevents garbage collection\n"
);

// Demonstration (conceptual - can't actually trigger GC in script)
let demoWS = new WeakSet();
let tempObject = { data: "I'm temporary" };

demoWS.add(tempObject);
console.log('Object added to WeakSet');
console.log('has(tempObject):', demoWS.has(tempObject)); // true

console.log('\nIf we set tempObject = null:');
console.log('- Object has no other references');
console.log('- Garbage collector can reclaim it');
console.log('- WeakSet entry automatically removed');
console.log('- No memory leak! 🎉');

console.log('\n=== 6. USE CASE: MARKING PROCESSED OBJECTS ===\n');

let processedItems = new WeakSet();

function processOrder(order) {
  if (processedItems.has(order)) {
    console.log(`⏭️  Order #${order.id} already processed`);
    return;
  }

  console.log(`⚙️  Processing order #${order.id}...`);
  // Simulate processing
  order.status = 'completed';
  processedItems.add(order);
  console.log(`✅ Order #${order.id} completed`);
}

let order1 = { id: 101, customer: 'Alice' };
let order2 = { id: 102, customer: 'Bob' };
let order3 = { id: 103, customer: 'Charlie' };

processOrder(order1);
processOrder(order2);
processOrder(order1); // Already processed
processOrder(order3);

console.log('\n=== 7. USE CASE: USER VERIFICATION SYSTEM ===\n');

let verifiedUsers = new WeakSet();
let bannedUsers = new WeakSet();

class UserSystem {
  static verify(user) {
    if (bannedUsers.has(user)) {
      console.log(`❌ User ${user.username} is banned`);
      return false;
    }

    if (user.email && user.email.includes('@')) {
      verifiedUsers.add(user);
      console.log(`✅ User ${user.username} verified`);
      return true;
    }

    console.log(`❌ User ${user.username} verification failed`);
    return false;
  }

  static ban(user) {
    bannedUsers.add(user);
    verifiedUsers.delete(user);
    console.log(`🚫 User ${user.username} banned`);
  }

  static isVerified(user) {
    return verifiedUsers.has(user) && !bannedUsers.has(user);
  }
}

let alice = { username: 'alice', email: 'alice@example.com' };
let bob = { username: 'bob', email: 'invalid' };
let charlie = { username: 'charlie', email: 'charlie@example.com' };

UserSystem.verify(alice);
UserSystem.verify(bob);
UserSystem.verify(charlie);
UserSystem.ban(charlie);

console.log('\n📊 Status check:');
console.log('Alice verified?', UserSystem.isVerified(alice));
console.log('Bob verified?', UserSystem.isVerified(bob));
console.log('Charlie verified?', UserSystem.isVerified(charlie));

console.log('\n=== 8. USE CASE: DOM ELEMENT TRACKING ===\n');

console.log('Scenario: Track user interactions with DOM elements');
console.log('(Simulated - real usage would be with actual DOM nodes)\n');

let clickedElements = new WeakSet();
let hoveredElements = new WeakSet();
let focusedElements = new WeakSet();

// Simulate DOM elements (in reality, these would be real HTMLElements)
let submitBtn = { type: 'button', id: 'submit-btn' };
let cancelBtn = { type: 'button', id: 'cancel-btn' };
let emailInput = { type: 'input', id: 'email-input' };
let navLink = { type: 'link', id: 'home-link' };

function handleClick(element) {
  clickedElements.add(element);
  console.log(`🖱️  Clicked: ${element.id}`);
}

function handleHover(element) {
  hoveredElements.add(element);
  console.log(`👆 Hovered: ${element.id}`);
}

function handleFocus(element) {
  focusedElements.add(element);
  console.log(`🎯 Focused: ${element.id}`);
}

// Simulate user interactions
handleClick(submitBtn);
handleHover(submitBtn);
handleHover(navLink);
handleFocus(emailInput);
handleClick(cancelBtn);

console.log('\n📊 Interaction summary:');
console.log('Submit button clicked?', clickedElements.has(submitBtn));
console.log('Submit button hovered?', hoveredElements.has(submitBtn));
console.log('Cancel button clicked?', clickedElements.has(cancelBtn));
console.log('Email input focused?', focusedElements.has(emailInput));

console.log(
  '\n💡 When DOM elements are removed, tracked data is auto-cleaned!'
);

console.log('\n=== 9. USE CASE: CIRCULAR REFERENCE DETECTION ===\n');

let currentlyVisiting = new WeakSet();

function hasCircularReference(obj, path = 'root') {
  // If we're currently visiting this object, it's a cycle
  if (currentlyVisiting.has(obj)) {
    console.log(`🔄 Circular reference detected at: ${path}`);
    return true;
  }

  // Mark as visiting
  currentlyVisiting.add(obj);

  // Check all properties
  for (let key in obj) {
    let value = obj[key];
    if (value && typeof value === 'object') {
      if (hasCircularReference(value, `${path}.${key}`)) {
        currentlyVisiting.delete(obj);
        return true;
      }
    }
  }

  // Done visiting this object
  currentlyVisiting.delete(obj);
  return false;
}

// Test 1: No circular reference
let safeObj = {
  name: 'Safe',
  nested: {
    value: 42,
    deep: {
      data: 'hello',
    },
  },
};

console.log('Testing safe object:');
console.log('Has cycle?', hasCircularReference(safeObj));

// Test 2: Circular reference
let circularObj = { name: 'Circular' };
circularObj.self = circularObj; // Points to itself

console.log('\nTesting circular object:');
console.log('Has cycle?', hasCircularReference(circularObj));

console.log('\n=== 10. USE CASE: BUTTON STATE MANAGEMENT ===\n');

let disabledButtons = new WeakSet();
let loadingButtons = new WeakSet();
let activeButtons = new WeakSet();

class Button {
  constructor(label) {
    this.label = label;
    activeButtons.add(this);
  }

  disable() {
    disabledButtons.add(this);
    console.log(`🔒 ${this.label} disabled`);
  }

  enable() {
    disabledButtons.delete(this);
    console.log(`🔓 ${this.label} enabled`);
  }

  startLoading() {
    loadingButtons.add(this);
    this.disable();
    console.log(`⏳ ${this.label} loading...`);
  }

  stopLoading() {
    loadingButtons.delete(this);
    this.enable();
    console.log(`✅ ${this.label} finished loading`);
  }

  click() {
    if (disabledButtons.has(this)) {
      console.log(`❌ ${this.label} is disabled`);
      return;
    }
    if (loadingButtons.has(this)) {
      console.log(`⏳ ${this.label} is loading...`);
      return;
    }
    console.log(`✨ ${this.label} clicked!`);
  }

  getState() {
    if (loadingButtons.has(this)) return 'loading';
    if (disabledButtons.has(this)) return 'disabled';
    return 'enabled';
  }
}

let saveBtn = new Button('Save');
let deleteBtn = new Button('Delete');

console.log('Button interactions:');
saveBtn.click();
saveBtn.startLoading();
saveBtn.click(); // Should be disabled
saveBtn.stopLoading();
saveBtn.click();

console.log('\n📊 Final states:');
console.log('Save button:', saveBtn.getState());
console.log('Delete button:', deleteBtn.getState());

console.log('\n=== 11. USE CASE: VALIDATION TRACKING ===\n');

let validatedForms = new WeakSet();

function validateForm(form) {
  console.log(`🔍 Validating form: ${form.name}`);

  let isValid = true;

  if (!form.email || !form.email.includes('@')) {
    console.log('  ❌ Invalid email');
    isValid = false;
  }

  if (!form.password || form.password.length < 8) {
    console.log('  ❌ Password too short');
    isValid = false;
  }

  if (!form.terms) {
    console.log('  ❌ Must accept terms');
    isValid = false;
  }

  if (isValid) {
    validatedForms.add(form);
    console.log('  ✅ Form validated!');
  }

  return isValid;
}

function submitForm(form) {
  if (!validatedForms.has(form)) {
    console.log(`❌ Cannot submit ${form.name} - not validated`);
    return false;
  }
  console.log(`✅ Form ${form.name} submitted successfully!`);
  return true;
}

let form1 = {
  name: 'Signup Form',
  email: 'user@example.com',
  password: 'securepass123',
  terms: true,
};

let form2 = {
  name: 'Contact Form',
  email: 'invalid-email',
  password: 'short',
  terms: false,
};

validateForm(form1);
validateForm(form2);

console.log('\nSubmission attempts:');
submitForm(form1);
submitForm(form2);

console.log('\n=== 12. SET VS WEAKSET COMPARISON ===\n');

console.log('📦 REGULAR SET:');
console.log('✓ Can hold any values (primitives + objects)');
console.log('✓ Iterable with for...of, forEach');
console.log('✓ Has .size property');
console.log('✓ Can be converted to array');
console.log('✓ Strongly references objects (prevents GC)');
console.log('✗ Can cause memory leaks');

console.log('\n🧊 WEAKSET:');
console.log('✓ Only objects/arrays as values');
console.log('✓ Weakly references objects (allows GC)');
console.log('✓ No memory leaks');
console.log('✓ Perfect for tagging/marking objects');
console.log('✗ Not iterable');
console.log('✗ No .size property');
console.log('✗ Cannot convert to array');

console.log('\n=== 13. WHEN TO USE WEAKSET ===\n');

console.log('✅ USE WEAKSET FOR:');
console.log('1. Marking objects as processed/visited');
console.log('2. Tracking temporary object states');
console.log('3. DOM element metadata that should auto-cleanup');
console.log('4. Circular reference detection');
console.log('5. Object branding/tagging');
console.log('6. Private boolean flags for objects');
console.log('7. Any scenario where objects are short-lived');

console.log("\n❌ DON'T USE WEAKSET FOR:");
console.log('1. Storing primitive values');
console.log('2. When you need to iterate members');
console.log('3. When you need to count members');
console.log('4. When you need to export/serialize');
console.log('5. When you need deterministic cleanup');

console.log('\n=== 14. ADVANCED: WEAKSET + WEAKMAP ===\n');

let processedDocs = new WeakSet();
let docMetadata = new WeakMap();

class DocumentProcessor {
  static process(doc) {
    if (processedDocs.has(doc)) {
      console.log(`⏭️  Document "${doc.title}" already processed`);
      return docMetadata.get(doc);
    }

    console.log(`⚙️  Processing "${doc.title}"...`);

    let metadata = {
      processedAt: new Date().toISOString(),
      wordCount: doc.content.split(' ').length,
      hash: Math.random().toString(36).substring(7),
    };

    processedDocs.add(doc);
    docMetadata.set(doc, metadata);

    console.log(`✅ Processed with hash: ${metadata.hash}`);
    return metadata;
  }

  static isProcessed(doc) {
    return processedDocs.has(doc);
  }

  static getMetadata(doc) {
    return docMetadata.get(doc);
  }
}

let doc1 = { title: 'Report.pdf', content: 'Lorem ipsum dolor sit amet' };
let doc2 = { title: 'Memo.docx', content: 'Quick meeting notes here' };

DocumentProcessor.process(doc1);
DocumentProcessor.process(doc2);
DocumentProcessor.process(doc1); // Already processed

console.log('\n📊 Document info:');
console.log('Doc1 metadata:', DocumentProcessor.getMetadata(doc1));
console.log('Doc2 metadata:', DocumentProcessor.getMetadata(doc2));

console.log('\n=== 🎉 COMPLETE! ===');
console.log('\n💡 KEY TAKEAWAY:');
console.log('Use WeakSet to temporarily mark/tag objects without preventing');
console.log(
  'garbage collection. Perfect for tracking transient object states!'
);
