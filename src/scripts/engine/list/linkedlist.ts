export type LinkedListElement<T> = {
  element : T,
  next : LinkedListElement<T>,
}

export class LinkedList<T> {
  private list_root : LinkedListElement<T> = {
    element : null,
    next : null
  };

  public unshift (element : T) {
    this.list_root.next = {
      element,
      next : this.list_root.next
    };
  }

  public isEmpty() {
    return this.list_root.next === null;
  }

  protected get tail () : LinkedListElement<T> {
    let node = this.list_root;
    while (node && node.next) {
      node = node.next;
    }

    return node ? node : null;
  }

  public push(element : T) {
    this.tail.next = {
      element,
      next : null
    }
  }

  public shift () {
    let list_element = this.list_root.next;
    if (list_element) {
      this.list_root.next = list_element.next;
      return list_element.element;
    }
    return null;
  }

  public remove (element : T) {
    let current : LinkedListElement<T> = this.list_root.next;
    let prev : LinkedListElement<T> = this.list_root;
    while (current) {
      if (current.element === element) {
        prev.next = current.next;
        return; 
      }
      prev = current;
      current = current.next;      
    }
  }

  public forEach = (fn : (element : T) => void) => {
    let node = this.list_root.next;
    while (node) {
      fn(node.element);
      node = node.next;
    }
  }

  public getFirst = (comparison : (element : T) => boolean) : T => {
    let node = this.list_root.next;
    while (node) {
      if (comparison(node.element)) {
        return node.element;
      }
      node = node.next;
    }
    return null;
  }
  
  public getFirstIndex = (comparison : (element : T) => boolean) : number => {
    let node = this.list_root.next;
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

    let node : LinkedListElement<T> = this.list_root.next;
    let prev : LinkedListElement<T> = this.list_root;

    if (index === 0) {
      this.unshift(element);
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
