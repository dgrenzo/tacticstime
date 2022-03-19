import { IElement, IEntity } from "../../engine/scene/Entity";

export interface IUnitStats {
  speed : number,
  move : number,
  hp : number,
  magic : number
}

export interface IUnit extends IEntity {
  element_type : "UNIT",
  data : {
    unit_type : string,
    faction : string,
    unit_level : number,
  },
  base_stats : IUnitStats,
  stats : IUnitStats,
  status : {
    hp : number,
    mana : number,
  },
  auras : string[],
  abilities : string[],
}


export function isUnit(entity : IElement) : entity is IUnit {
  return entity.element_type === "UNIT";
}
