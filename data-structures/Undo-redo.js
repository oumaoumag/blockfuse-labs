class Stack {
  constructor() {
    this.items = []; // Internal storage
  }

  // Add an item to the top of the stack
  push(item) {
    if (item === undefined || item === null) {
      throw new Error("Cannot push undefined or null to stack");
    }
    this.items.push(item);
  }

  // Remove and return the top item
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop();
  }

  // Return the top item without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the number of items in the stack
  size() {
    return this.items.length;
  }

  // Clear the stack
  clear() {
    this.items = [];
  }
}

// Interface for an action
class Action {
  constructor(doFn, undoFn) {
    if (typeof doFn !== "function" || typeof undoFn !== "function") {
      throw new Error("doFn and undoFn must be functions");
    }
    this.doFn = doFn;
    this.undoFn = undoFn;
  }
}

// UndoRedoManager class using custom Stack
class UndoRedoManager {
  constructor() {
    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  // Execute a new action and add it to the undo stack
  execute(action) {
    if (!(action instanceof Action)) {
      throw new Error("Action must be an instance of Action class");
    }
    action.doFn();
    this.undoStack.push(action);
    this.redoStack.clear(); // Clear redo stack on new action
  }

  // Undo the last action
  undo() {
    try {
      const action = this.undoStack.pop();
      action.undoFn();
      this.redoStack.push(action);
      return true;
    } catch (error) {
      console.log("Nothing to undo");
      return false;
    }
  }

  // Redo the last undone action
  redo() {
    try {
      const action = this.redoStack.pop();
      action.doFn();
      this.undoStack.push(action);
      return true;
    } catch (error) {
      console.log("Nothing to redo");
      return false;
    }
  }

  // Get current stack sizes
  getStackSizes() {
    return {
      undoStack: this.undoStack.size(),
      redoStack: this.redoStack.size(),
    };
  }
}

// Counter class for demonstration
class Counter {
  constructor() {
    this.value = 0;
    this.manager = new UndoRedoManager();
  }

  increment() {
    const oldValue = this.value;
    const action = new Action(
      () => (this.value += 1),
      () => (this.value = oldValue)
    );
    this.manager.execute(action);
  }

  decrement() {
    const oldValue = this.value;
    const action = new Action(
      () => (this.value -= 1),
      () => (this.value = oldValue)
    );
    this.manager.execute(action);
  }

  getValue() {
    return this.value;
  }

  undo() {
    return this.manager.undo();
  }

  redo() {
    return this.manager.redo();
  }

  getStackSizes() {
    return this.manager.getStackSizes();
  }
}

// Demo usage
try {
  const counter = new Counter();
  console.log("Initial value:", counter.getValue()); // 0
  counter.increment();
  console.log("After increment:", counter.getValue()); // 1
  counter.increment();
  console.log("After another increment:", counter.getValue()); // 2
  counter.decrement();
  console.log("After decrement:", counter.getValue()); // 1
  console.log("Stacks:", counter.getStackSizes()); // { undoStack: 3, redoStack: 0 }
  counter.undo();
  console.log("After undo:", counter.getValue()); // 2
  console.log("Stacks:", counter.getStackSizes()); // { undoStack: 2, redoStack: 1 }
  counter.redo();
  console.log("After redo:", counter.getValue()); // 1
  console.log("Stacks:", counter.getStackSizes()); // { undoStack: 3, redoStack: 0 }
} catch (error) {
  console.error("Error in demo:", error.message);
}

