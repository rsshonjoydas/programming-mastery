# JavaScript Statements

JavaScript programs are sequences of statements executed by the interpreter. By default, statements run one after another in written order, but control structures can alter this flow to create dynamic, responsive programs.

## Core Concepts

**Control Structures** modify the default execution order:

**_Conditionals_**
Statements like `if` and `switch` that make the JavaScript interpreter execute or skip other statements depending on the value of an expression

**_Loops_**
Statements like `while` and `for` that execute other statements repetitively

**_Jumps_**
Statements like `break`, `return`, and `throw` that cause the interpreter to jump to another part of the program

---

## JavaScript Statement Reference

| Statement         | Purpose                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| break             | Exit from the innermost loop or switch or from named enclosing statement |
| case              | Label a statement within a switch                                        |
| class             | Declare a class                                                          |
| const             | Declare and initialize one or more constants                             |
| continue          | Begin next iteration of the innermost loop or the named loop             |
| debugger          | Debugger breakpoint                                                      |
| default           | Label the default statement within a switch                              |
| do/while          | An alternative to the while loop                                         |
| export            | Declare values that can be imported into other modules                   |
| for               | An easy-to-use loop                                                      |
| for/await         | Asynchronously iterate the values of an async iterator                   |
| for/in            | Enumerate the property names of an object                                |
| for/of            | Enumerate the values of an iterable object such as an array              |
| function          | Declare a function                                                       |
| if/else           | Execute one statement or another depending on a condition                |
| import            | Declare names for values defined in other modules                        |
| label             | Give statement a name for use with break and continue                    |
| let               | Declare and initialize one or more block-scoped variables (new syntax)   |
| return            | Return a value from a function                                           |
| switch            | Multiway branch to case or default: labels                               |
| throw             | Throw an exception                                                       |
| try/catch/finally | Handle exceptions and code cleanup                                       |
| "use strict"      | Apply strict mode restrictions to script or function                     |
| var               | Declare and initialize one or more variables (old syntax)                |
| while             | A basic loop construct                                                   |
| with              | Extend the scope chain (deprecated and forbidden in strict mode)         |
| yield             | Provide a value to be iterated; only used in generator functions         |

---

## Key Takeaways

- JavaScript statements execute sequentially unless control structures change the flow
- **Conditionals** enable decision-making logic
- **Loops** enable repetitive execution
- **Jumps** enable non-linear program flow
- Modern JavaScript favors `let`/`const` over `var`, and `for/of` for cleaner iteration
- Exception handling with `try/catch/finally` provides robust error management
