import { IEntity } from "../../engine/scene/Entity";


export interface IUnit extends IEntity {
  entity_type : "UNIT",
  data : {
    unit_type : string,
    faction : string,
  },
  stats : {
    speed : number,
    move : number,
    hp : number,
    magic : number,
  },
  status : {
    hp : number,
    mana : number,
  },
  abilities : string[],
}


export function isUnit(entity : IEntity) : entity is IUnit {
  return entity.entity_type === "UNIT";
}
