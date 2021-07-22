class Set {
  constructor() {
    this.items = {};
  }
  make = (lines) => {
    for (const line of lines) {
      this.items[line] = {
        parent: null,
        value: line,
      };
    }
  };
  find = (line) => {
    let p = this.items[line];
    if (p) {
      return p.parent === null ? p : this.find(p.parent.value);
    }
    throw new Error("Nisu povezani");
  };
  union = (line1, line2) => {
    const first = this.find(line1);
    const second = this.find(line2);
    if (first === null || second === null) {
      throw new Error("Nisu povezani");
    }
    if (first !== second) {
      first.parent = second;
      return true;
    }
    return false;
  };
}

export const kruskalSet = new Set();
