import { EventManager } from "../listener/event";


export interface IEntityInfo {
  asset : IAssetInfo,
  depth : number,
  id : number,
}

export interface IAssetInfo {
  type : "SPRITE" | "ANIMATED_SPRITE" | "EFFECT",
  name : string;
}

export interface IEntity {
  id : number,
  entity_type : string,
  depth_offset : number,
  pos : {
    x : number,
    y : number,
  }
}
