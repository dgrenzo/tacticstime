import { IEntity } from "../../engine/scene/Entity";
import { IElementMap } from "../../engine/scene/Scene";
import { IBoardPos } from "../board/GameBoard";

export class UpdateElements {
  constructor() {
    
  }

  // public static AddEntity(elements : IElementMap, entity_id : number, entity : IEntity) {
  //   return elements.set(entity_id, entity);
  // }

  // public static RemoveEntity(elements : IElementMap, entity_id : number) {
  //   return elements.remove(entity_id);
  // }

  public static SetUnitFlag(elements : IElementMap, entity_id : number, flag : string, value : string | number | boolean) {
    return elements.setIn([entity_id, 'status', 'flags', flag], value)
  }

  public static SetHP(elements : IElementMap, entity_id : number, hp : number) {
    return elements.setIn([entity_id, 'status', 'hp' ], hp);
  }
  public static SetMP(elements : IElementMap, entity_id : number, mana : number) {
    return elements.setIn([entity_id, 'status', 'mana' ], mana);
  }

  public static SetPosition(elements : IElementMap, entity_id : number, position : IBoardPos) {
    return elements.setIn([entity_id, 'pos'], position);
  }
}