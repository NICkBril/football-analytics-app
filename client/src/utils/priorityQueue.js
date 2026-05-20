// ============================================================
// START: LAB 4 — Bi-Directional Priority Queue
// ============================================================

export class PriorityQueue {
  constructor() {
    this.items = [];
    this.insertionCounter = 0;
  }

  enqueue(data, priority) {
    this.items.push({
      data,
      priority,
      insertedAt: this.insertionCounter++
    });
  }

  dequeue(mode = "highest") {
    if (this.items.length === 0) {
      return null;
    }

    let targetIndex = 0;

    for (let i = 1; i < this.items.length; i++) {
      const current = this.items[i];
      const target = this.items[targetIndex];

      if (mode === "highest" && current.priority > target.priority) {
        targetIndex = i;
      } else if (mode === "lowest" && current.priority < target.priority) {
        targetIndex = i;
      } else if (mode === "oldest" && current.insertedAt < target.insertedAt) {
        targetIndex = i;
      } else if (mode === "newest" && current.insertedAt > target.insertedAt) {
        targetIndex = i;
      }
    }

    const [removed] = this.items.splice(targetIndex, 1);
    return removed.data;
  }

  peek(mode = "highest") {
    if (this.items.length === 0) {
      return null;
    }

    let targetIndex = 0;

    for (let i = 1; i < this.items.length; i++) {
      const current = this.items[i];
      const target = this.items[targetIndex];

      if (mode === "highest" && current.priority > target.priority) {
        targetIndex = i;
      } else if (mode === "lowest" && current.priority < target.priority) {
        targetIndex = i;
      } else if (mode === "oldest" && current.insertedAt < target.insertedAt) {
        targetIndex = i;
      } else if (mode === "newest" && current.insertedAt > target.insertedAt) {
        targetIndex = i;
      }
    }

    return this.items[targetIndex].data;
  }

  get size() {
    return this.items.length;
  }
}
// END: LAB 4