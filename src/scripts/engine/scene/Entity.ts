import { Vector2 } from "../types";

export function isEntity(element : IElement | any) : element is IEntity {
  return element.pos;
}

export interface IElement {
  element_type : string,
  id ?: number,
}

export interface IEntity extends IElement {
  pos : Vector2
}

export interface IAssetInfo {
  type : "SPRITE" | "ANIMATED_SPRITE" | "EFFECT",
  name : string;
  scale ?: number,
  depth_offset : number,
  data ?: any,
}