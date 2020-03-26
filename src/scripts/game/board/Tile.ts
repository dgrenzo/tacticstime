import { Entity, IAssetInfo } from "../../engine/scene/Entity";

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

export interface ITileInfo {
  type : string,
}

export class Tile extends Entity {
  protected readonly depth_offset : number = -1;

  private m_tile_name : string;
  constructor(x : number, y : number, private m_definition : TILE_DEF) {
    super(x, y);
    this.setTileType(m_definition);
  }

  public setTileType = (def : TILE_DEF) => {  
    this.m_definition = def;
    this.m_tile_name = GetTileName(def);
  }

  public getCurrentAsset = () : IAssetInfo => {
    return {
      type : "SPRITE",
      name : this.m_tile_name,
    }
  }
  
  public get type() : TILE_DEF {
    return this.m_definition;
  }

  public get tile_name() : string {
    return this.m_tile_name;
  }
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