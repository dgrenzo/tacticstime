import { IElement, IEntity } from "../../engine/scene/Entity";

export enum TILE_DEF {
  GRASS_EMPTY = 10,
  GRASS_MTN,
  GRASS_TREE,
  GRASS_HUT,
  DIRT_EMPTY = 20,
  DIRT_MTN,
  DIRT_TREE,
  DIRT_HUT,
  STONE_EMPTY = 30,
  STONE_MTN,
  STONE_TREE,
  STONE_HUT,
  SAND_EMPTY = 40,
  SAND_MTN,
  SAND_TREE,
  SAND_HUT,
  SNOW_EMPTY = 50,
  SNOW_MTN,
  SNOW_TREE,
  SNOW_HUT,
  WATER_EMPTY = 60,
}

export interface ITile extends IEntity {
  element_type : "TILE",
  data : {
    tile_type : TILE_DEF,
  }
}

export function isTile(entity : IElement) : entity is ITile {
  return entity.element_type === "TILE";
}

export const GetTileName = (def : TILE_DEF) => {
  let base = Math.floor(def / 10);
  let type = def % 10;
  return getBase(base) + '_' + getType(type);
}
const getBase = (base : number) : string => {
  return ["blank", "grass", "dirt", "stone", "sand", "snow", "water"][base];
}
const getType = (type : number) : string => {
  return ["empty", "mtn", "tree", "hut"][type];
}