
export type LinkedListener<T> = {
  fn : (data:T) => void,
  next : LinkedListener<T>,
}

export class Signal<T> {
  private listener_root : LinkedListener<T> = null;
  
  public emit(data : T) {
    let listener = this.listener_root;
    while (listener) {
      listener.fn(data);
      listener = listener.next;
    }
  }

  public add (cb : (data:T)=>void) {
    let current_root = this.listener_root;
    this.listener_root = {
      fn : cb,
      next : current_root,
    };
  }

  public remove (cb : (data:T)=>void) {

    if (cb === this.listener_root.fn) {
      this.listener_root = this.listener_root.next;
      return;
    }

    let current : LinkedListener<T> = this.listener_root;
    let prev : LinkedListener<T> = null;
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

export class EventManager<T> {

  private m_signalMap : Map<T, Signal<any>> = new Map();

  constructor () {

  }

  public emit(signal_type : T, data ?: any) {
    if (!this.m_signalMap.has(signal_type)) {
      return;
    } else {
      this.m_signalMap.get(signal_type).emit(data);
    }
  }

  public createSignal<DataType>(signal_name : T) {
    this.m_signalMap.set(signal_name, new Signal<DataType>());
  }

  public add<DataType>(signal_name : T, cb : (data:DataType)=>void) {
    if (!this.m_signalMap.get(signal_name)) {
      this.createSignal<DataType>(signal_name);
    }
    this.m_signalMap.get(signal_name).add(cb);
  }

  public remove(signal_name : T, cb : (data:any)=>void) {
    if (!this.m_signalMap.get(signal_name)) {
      return;
    } else {
      this.m_signalMap.get(signal_name).remove(cb);
    }
  }
}