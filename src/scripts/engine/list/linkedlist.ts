export type LinkedListElement<T> = {
  element : T,
  next : LinkedListElement<T>,
}

export class LinkedList<T> {
  private list_root : LinkedListElement<T> = null;

  public add (element : T) {
    let current_root = this.list_root;
    this.list_root = {
      element : element,
      next : current_root,
    };
  }

  public remove (element : T) {
    if (!this.list_root) {
      return;
    }
    if (element === this.list_root.element) {
      this.list_root = this.list_root.next;
      return;
    }

    let current : LinkedListElement<T> = this.list_root;
    let prev : LinkedListElement<T> = null;
    while (current) {
      if (current.element === element) {
        if (prev) {
          prev.next = current.next;
        }
        return; 
      }
      prev = current;
      current = current.next;      
    }
  }

  public forEach = (fn : (element : T) => void) => {
    let node = this.list_root;
    while (node) {
      fn(node.element);
      node = node.next;
    }
  }

  public getFirst = (comparison : (element : T) => boolean) : T => {
    let node = this.list_root;
    while (node) {
      if (comparison(node.element)) {
        return node.element;
      }
      node = node.next;
    }
    return null;
  }
  
  public getFirstIndex = (comparison : (element : T) => boolean) : number => {
    let node = this.list_root;
    let index = 0;
    while (node) {
      if (comparison(node.element)) {
        return index;
      }
      node = node.next;
      index ++;
    }
    return index;
  }

  public insertAt = (element : T, index : number) => {

    let node : LinkedListElement<T> = this.list_root;
    let prev : LinkedListElement<T> = null;

    if (index === 0) {
      this.add(element);
      return;
    }
    let count = 0;
    while (node && count < index) {

      count ++;
      prev = node;
      node = node.next;
    }

    prev.next = {
      element : element,
      next : node,
    }
  }

}
