import { Vector2 } from "../types";


export interface IEntityInfo {
  asset : IAssetInfo,
  depth : number,
  id : number,
}

export interface IAssetInfo {
  type : "SPRITE" | "ANIMATED_SPRITE" | "EFFECT",
  name : string;
  scale ?: number,
  depth_offset : number,
  data ?: any,
}

export interface IEntity {
  id ?: number,
  entity_type : string,
  pos : Vector2
}