import * as PIXI from 'pixi.js';

type TypedEventDef = {
  [key : string] : any
}


export class TypedEventEmitter<T extends TypedEventDef = TypedEventDef> extends PIXI.utils.EventEmitter {  
  public emit<Key extends Extract<keyof T, string>> (signal_type : Key, data ?: T[Key]) {
    return super.emit(signal_type as string, data);
  }

  public on<Key extends Extract<keyof T, string>>(signal_name : Key, cb : (data:T[Key])=>void, context ?: any) {
    return super.on(signal_name as string, cb, context);
  }

  public off<Key extends Extract<keyof T, string>>(signal_name : Key, cb : (data:T[Key])=>void, context ?: any) {
    return super.off(signal_name as string, cb, context);
  }
}