// =============================================
// JAVASCRIPT ADDING AND DELETING ARRAY ELEMENTS
// =============================================

console.log('=== 1. ADDING ELEMENTS: DIRECT ASSIGNMENT ===\n');

let a = [];
a[0] = 'zero';
a[1] = 'one';
console.log('After direct assignment:', a);
console.log('Length:', a.length);

// Creating sparse array
let b = [];
b[0] = 'zero';
b[5] = 'five';
console.log('\nSparse array:', b);
console.log('Length:', b.length);
console.log('Element at index 3:', b[3]); // undefined

console.log('\n=== 2. ADDING ELEMENTS: push() ===\n');

let arr1 = [];
arr1.push('zero');
console.log("After push('zero'):", arr1);

arr1.push('one', 'two');
console.log("After push('one', 'two'):", arr1);

let newLength = arr1.push('three');
console.log("After push('three'):", arr1);
console.log('Returned new length:', newLength);

// push() is equivalent to arr[arr.length] = value
let arr2 = ['a', 'b'];
arr2[arr2.length] = 'c';
console.log("\nUsing arr[arr.length] = 'c':", arr2);

console.log('\n=== 3. ADDING ELEMENTS: unshift() ===\n');

let arr3 = ['two', 'three'];
console.log('Starting array:', arr3);

arr3.unshift('one');
console.log("After unshift('one'):", arr3);

arr3.unshift('zero', 'point-five');
console.log("After unshift('zero', 'point-five'):", arr3);

let len = arr3.unshift('negative-one');
console.log('Returned new length:', len);

console.log('\n=== 4. ADDING ELEMENTS: splice() ===\n');

let arr4 = ['a', 'b', 'e'];
console.log('Starting array:', arr4);

// Insert at index 2, delete 0 elements
arr4.splice(2, 0, 'c', 'd');
console.log("After splice(2, 0, 'c', 'd'):", arr4);

// Insert at beginning
let arr5 = [3, 4, 5];
arr5.splice(0, 0, 1, 2);
console.log('\nInsert at beginning:', arr5);

// Insert at end
let arr6 = [1, 2, 3];
arr6.splice(arr6.length, 0, 4, 5);
console.log('Insert at end:', arr6);

console.log('\n=== 5. REMOVING ELEMENTS: pop() ===\n');

let arr7 = ['zero', 'one', 'two', 'three'];
console.log('Starting array:', arr7);

let last = arr7.pop();
console.log('After pop():', arr7);
console.log('Removed element:', last);
console.log('New length:', arr7.length);

// Pop from empty array
let empty = [];
console.log('\nPop from empty array:', empty.pop()); // undefined

console.log('\n=== 6. REMOVING ELEMENTS: shift() ===\n');

let arr8 = ['zero', 'one', 'two', 'three'];
console.log('Starting array:', arr8);

let first = arr8.shift();
console.log('After shift():', arr8);
console.log('Removed element:', first);
console.log('New length:', arr8.length);

// shift() moves all elements down by one index
console.log('Element at index 0 is now:', arr8[0]);

console.log('\n=== 7. REMOVING ELEMENTS: delete Operator ===\n');

let arr9 = [1, 2, 3, 4, 5];
console.log('Starting array:', arr9);

delete arr9[2];
console.log('After delete arr9[2]:', arr9);
console.log('Length (unchanged!):', arr9.length);
console.log('2 in arr9:', 2 in arr9); // false
console.log('arr9[2]:', arr9[2]); // undefined

// Difference between delete and undefined
let arr10 = [1, 2, 3];
delete arr10[1];
console.log('\nAfter delete arr10[1]:', arr10);
console.log('1 in arr10:', 1 in arr10); // false

let arr11 = [1, 2, 3];
arr11[1] = undefined;
console.log('\nAfter arr11[1] = undefined:', arr11);
console.log('1 in arr11:', 1 in arr11); // true (element exists!)

console.log('\n=== 8. REMOVING ELEMENTS: length Property ===\n');

let arr12 = [1, 2, 3, 4, 5];
console.log('Starting array:', arr12);

arr12.length = 3;
console.log('After length = 3:', arr12);

// Increasing length creates sparse array
let arr13 = [1, 2, 3];
arr13.length = 5;
console.log('\nAfter length = 5:', arr13);
console.log('arr13[4]:', arr13[4]); // undefined

// Setting length to 0 clears array
let arr14 = [1, 2, 3];
arr14.length = 0;
console.log('\nAfter length = 0:', arr14);

console.log('\n=== 9. REMOVING ELEMENTS: splice() ===\n');

let arr15 = ['a', 'b', 'c', 'd', 'e'];
console.log('Starting array:', arr15);

let removed = arr15.splice(1, 2);
console.log('After splice(1, 2):', arr15);
console.log('Removed elements:', removed);

// Remove from beginning
let arr16 = [1, 2, 3, 4, 5];
arr16.splice(0, 2);
console.log('\nRemove from beginning:', arr16);

// Remove from end
let arr17 = [1, 2, 3, 4, 5];
arr17.splice(-2, 2);
console.log('Remove from end (negative index):', arr17);

// Remove everything from index
let arr18 = [1, 2, 3, 4, 5];
arr18.splice(2);
console.log('Remove everything from index 2:', arr18);

console.log('\n=== 10. splice() - SWISS ARMY KNIFE ===\n');

// Insert only
let arr19 = [1, 2, 5];
arr19.splice(2, 0, 3, 4);
console.log('Insert 3, 4 at index 2:', arr19);

// Delete only
let arr20 = [1, 2, 3, 4, 5];
arr20.splice(2, 2);
console.log('Delete 2 elements at index 2:', arr20);

// Replace
let arr21 = [1, 2, 3, 4, 5];
let replaced = arr21.splice(1, 2, 'a', 'b', 'c');
console.log('Replace 2 elements with 3:', arr21);
console.log('Replaced elements:', replaced);

// Complex operation
let arr22 = ['Mon', 'Tue', 'Fri', 'Sat'];
arr22.splice(2, 0, 'Wed', 'Thu');
console.log('\nInsert missing weekdays:', arr22);

console.log('\n=== 11. STACK OPERATIONS (LIFO) ===\n');

let stack = [];
console.log('Empty stack:', stack);

// Push elements (add to top)
stack.push(1);
stack.push(2);
stack.push(3);
console.log('After pushing 1, 2, 3:', stack);

// Pop elements (remove from top)
console.log('Pop:', stack.pop()); // 3
console.log('Pop:', stack.pop()); // 2
console.log('Stack after popping:', stack);

console.log('\n=== 12. QUEUE OPERATIONS (FIFO) ===\n');

let queue = [];
console.log('Empty queue:', queue);

// Enqueue (add to end)
queue.push('first');
queue.push('second');
queue.push('third');
console.log('After enqueuing:', queue);

// Dequeue (remove from beginning)
console.log('Dequeue:', queue.shift()); // 'first'
console.log('Dequeue:', queue.shift()); // 'second'
console.log('Queue after dequeuing:', queue);

console.log('\n=== 13. PRACTICAL EXAMPLES ===\n');

// Example 1: Building a shopping cart
console.log('Example 1: Shopping Cart');
let cart = [];

function addToCart(item) {
  cart.push(item);
  console.log(`Added ${item} to cart`);
}

function removeFromCart(item) {
  let index = cart.indexOf(item);
  if (index !== -1) {
    cart.splice(index, 1);
    console.log(`Removed ${item} from cart`);
  }
}

addToCart('Apple');
addToCart('Banana');
addToCart('Orange');
console.log('Cart:', cart);
removeFromCart('Banana');
console.log('Cart after removal:', cart);

// Example 2: Undo/Redo functionality
console.log('\nExample 2: Undo/Redo');
let history = [];
let redoStack = [];

function addAction(action) {
  history.push(action);
  redoStack = []; // Clear redo stack on new action
  console.log(`Action: ${action}`);
}

function undo() {
  if (history.length > 0) {
    let action = history.pop();
    redoStack.push(action);
    console.log(`Undo: ${action}`);
  }
}

function redo() {
  if (redoStack.length > 0) {
    let action = redoStack.pop();
    history.push(action);
    console.log(`Redo: ${action}`);
  }
}

addAction('Type "Hello"');
addAction('Type "World"');
console.log('History:', history);
undo();
console.log('After undo, history:', history);
redo();
console.log('After redo, history:', history);

// Example 3: Task queue processing
console.log('\nExample 3: Task Queue');
let tasks = ['Task 1', 'Task 2', 'Task 3'];

function addTask(task) {
  tasks.push(task);
  console.log(`Added: ${task}`);
}

function processNextTask() {
  if (tasks.length > 0) {
    let task = tasks.shift();
    console.log(`Processing: ${task}`);
    return task;
  }
  return null;
}

console.log('Initial tasks:', tasks);
addTask('Task 4');
processNextTask();
processNextTask();
console.log('Remaining tasks:', tasks);

console.log('\n=== 14. PERFORMANCE COMPARISON ===\n');

console.log('Creating large array for performance test...');
let largeArray = [];
for (let i = 0; i < 1000; i++) {
  largeArray.push(i);
}

// push() - Fast (end of array)
console.time('push() x 1000');
for (let i = 0; i < 1000; i++) {
  largeArray.push(i);
}
console.timeEnd('push() x 1000');

// unshift() - Slow (beginning of array, shifts all elements)
let testArray = [...largeArray];
console.time('unshift() x 100');
for (let i = 0; i < 100; i++) {
  testArray.unshift(i);
}
console.timeEnd('unshift() x 100');

console.log('\nNote: push() is much faster than unshift()!');

console.log('\n=== 15. METHOD COMPARISON TABLE ===\n');

console.log('Method Comparison:');
console.log('─────────────────────────────────────────────────────────');
console.log('Method      | Position  | Modifies | Shifts | Returns');
console.log('─────────────────────────────────────────────────────────');
console.log('push()      | End       | Yes      | No     | New length');
console.log('pop()       | End       | Yes      | No     | Removed item');
console.log('unshift()   | Beginning | Yes      | Yes    | New length');
console.log('shift()     | Beginning | Yes      | Yes    | Removed item');
console.log('splice()    | Any       | Yes      | Yes    | Removed array');
console.log('delete      | Any       | Yes*     | No     | true');
console.log('length = n  | End       | Yes      | No     | -');
console.log('─────────────────────────────────────────────────────────');
console.log('* Creates sparse array without changing length');

console.log('\n=== 16. BEST PRACTICES ===\n');

console.log('✓ Use push()/pop() for stack operations (LIFO)');
console.log('✓ Use shift()/unshift() for queue operations (FIFO)');
console.log('✓ Use splice() for complex array modifications');
console.log('✓ Avoid delete operator (creates sparse arrays)');
console.log('✓ Use length property to truncate arrays');
console.log('✓ Prefer methods that maintain array continuity');
console.log('✓ Consider performance for large arrays');

console.log('\n=== COMPLETE! ===');
console.log('All array adding and deleting operations demonstrated!');
