
export type LinkedListener<T> = {
  fn : (data:T) => void,
  next : LinkedListener<T>,
}

export class Signal {
  private listener_root : LinkedListener<any> = null;
  
  public emit(data) {
    let listener = this.listener_root;
    while (listener) {
      listener.fn(data);
      listener = listener.next;
    }
  }

  public add (cb : (data)=>void) {
    let current_root = this.listener_root;
    this.listener_root = {
      fn : cb,
      next : current_root,
    };
  }

  public remove (cb : (data)=>void) {

    if (cb === this.listener_root.fn) {
      this.listener_root = this.listener_root.next;
      return;
    }

    let current = this.listener_root;
    let prev : LinkedListener<any> = null;
    while (current) {
      if (current.fn === cb) {
        if (prev) {
          prev.next = current.next;
        }
        return; 
      }
      prev = current;
      current = current.next;      
    }
  }
}

export class EventManager<T extends Object> {
  
  

  private m_signalMap : Map<any, Signal> = new Map();

  constructor () {

  }

  public emit<Key extends keyof T> (signal_type : Key, data ?: T[Key]) {
    if (!this.m_signalMap.has(signal_type)) {
      return;
    } else {
      this.m_signalMap.get(signal_type).emit(data);
    }
  }

  public createSignal<Key extends keyof T>(signal_name : Key) {
    this.m_signalMap.set(signal_name, new Signal());
  }

  public add<Key extends keyof T>(signal_name : Key, cb : (data:T[Key])=>void) {
    if (!this.m_signalMap.get(signal_name)) {
      this.createSignal(signal_name);
    }
    this.m_signalMap.get(signal_name).add(cb);
  }

  public remove<Key extends keyof T>(signal_name : Key, cb : (data:T[Key])=>void) {
    if (!this.m_signalMap.get(signal_name)) {
      return;
    } else {
      this.m_signalMap.get(signal_name).remove(cb);
    }
  }
  public clear(){
    this.m_signalMap.clear();
  }
}