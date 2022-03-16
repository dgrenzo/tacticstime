import { Vector2 } from "../types";

export interface IElement {
  id ?: number,
}

export interface IEntity extends IElement {
  entity_type : string,
  pos : Vector2
}

export interface IAssetInfo {
  type : "SPRITE" | "ANIMATED_SPRITE" | "EFFECT",
  name : string;
  scale ?: number,
  depth_offset : number,
  data ?: any,
}