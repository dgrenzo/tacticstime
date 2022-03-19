import { IImmutableScene } from "../../../../../engine/scene/Scene";
import { GameBoard, IActionData, IBoardPos, IGameAction } from "../../../../board/GameBoard";
import { IUnit } from "../../../../board/Unit";
import { IKilledAction } from "./Killed";

export interface IDamageAction extends IGameAction {
  type : "DAMAGE",
  data : IDamageActionData,
}

export interface IDamageActionData extends IActionData {
  amount : number,
  target : IUnit,
}

export interface IDamageDealtAction extends IGameAction {
  type : "DAMAGE_DEALT",
  data : IDamageActionData,
}


export function ExecuteDamage(action : IDamageAction, scene : IImmutableScene):IImmutableScene {

  const unit = GameBoard.GetUnit(scene, action.data.entity_id);
  if (!unit) {
    return scene
  }

  let starting_hp = unit.status.hp;

  if (starting_hp === 0) {
    return scene;
  }

  const new_hp = Math.max(starting_hp - action.data.amount, 0);
  const difference = starting_hp - new_hp;

  scene = GameBoard.SetHP(scene, unit.id, new_hp);

  if (difference > 0) {
    scene = GameBoard.AddActions(scene, {
      type : "DAMAGE_DEALT",
      data : {
        amount : difference,
        target : unit,
        entity_id : unit.id,
      }
    } as IDamageDealtAction);
  }

  if (new_hp === 0) {
    scene = GameBoard.AddActions(scene, {
      type : "UNIT_KILLED",
      data : {
        entity_id : unit.id,
        source : unit
      }
    } as IKilledAction)
  }

  return scene;
}