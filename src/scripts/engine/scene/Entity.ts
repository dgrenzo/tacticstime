import { EventManager } from "../listener/event";

let id_ticker = 0;

export interface IEntityInfo {
  asset : IAssetInfo,
  depth : number,
  id : number,
}

export interface IAssetInfo {
  type : "SPRITE" | "ANIMATED_SPRITE" | "EFFECT",
  name : string;
}

export abstract class Entity {

  private m_event_manager : EventManager<string>;
  private readonly m_id = id_ticker ++;

  protected readonly depth_offset : number = 0;

  constructor (public x : number, public y : number) {
    this.m_event_manager = new EventManager();
  }

  public abstract getCurrentAsset() : IAssetInfo; 
  
  public get depthOffset() : number {
    return 0;
  }

  public get id() {
    return this.m_id;
  }
}