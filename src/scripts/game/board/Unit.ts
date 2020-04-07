import { IAssetInfo, IEntity } from "../../engine/scene/Entity";
import { ILoadedUnit } from "./Loader";


export interface IUnit extends IEntity {
  entity_type : "UNIT",
  data : {
    unit_type : string,
  }
  stats : {
    speed : number,
    move : number,
    hp : number,
    magic : number,
  },
  status : {
    hp : number,
  }
  abilities : string[],
}


export function isUnit(entity : IEntity) : entity is IUnit {
  return entity.entity_type === "UNIT";
}

  
  function asset() : IAssetInfo {
    return {
      type : "ANIMATED_SPRITE",
      name : this.m_unit_type + '_idle',
    }
  }
